<template>
    <section class="section container">
      <div class="columns">
        <div class="column">
          <template v-if="isAuthorized && status===1 && product.user.id!==me" class= "section container">
            <b-field label="Date">
              <b-datepicker v-model="date" icon="calendar-today" :min-date="minDate" :max-date="maxDate" editable>
              </b-datepicker>
            </b-field>
            <b-field label="Withdraw Address">
              <b-input v-model="withdraw_address" type="text"></b-input>
            </b-field>
            <b-field label="Note">
              <b-input v-model="note" maxlength="200" type="textarea"></b-input>
            </b-field>
            <b-field>
              <button @click="book" class="button">Book</button>
            </b-field>
          </template>

          <template v-if="isAuthorized && status===2 && (isBuyer || isSeller)">
            <b-field>
              <b-input v-model="message"  maxlength="200" type="textarea"></b-input>
            </b-field>
            <b-field>
              <button @click="postMessage" class="button">Post</button>
            </b-field>
            <div v-for="(message, index) in messages" :key="index" class="content">
              <div v-if="message.user.id===me" class="notification has-text-right">
                <p class="is-italic has-text-grey-light">{{message.ago}}</p>
                <p>{{message.content}}</p>
              </div>
              <div v-else class="notification">
                <p>
                  <span class="has-text-weight-semibold has-text-grey-light">
                  {{message.user.name}}
                  </span>, <span class="is-italic has-text-grey-light">{{message.ago}}</span>
                </p>
                <p>{{message.content}}</p>
              </div>
            </div>
          </template>
        </div>
        <div class="column">
          <div class="card">
            <div class="card-content">
              <div class="media">
                <div class="media-left">
                  <figure class="image is-48x48">
                    <img :src="product.specifications.image">
                  </figure>
                </div>
                <div class="media-content">
                  <p class="title is-4">
                    {{product.id}}
                  </p>
                  <p class="subtitle is-6">
                    {{product.city}} [{{product.country}}]
                  </p>
                </div>
              </div>
              <div class="content">
                {{product.specifications.title}}
              </div>
            </div>
            <footer class="card-footer">
              <a v-if="!isBuyer" :href="'https://amazon.com/dp/'+product.id" target="_blank" class="card-footer-item">Amazon</a>
              <a v-if="isBuyer" @click="release()" class="card-footer-item">Release</a>
              <a v-if="(delivery&&isSeller)||isBuyer" @click="dispute()" class="card-footer-item">Dispute</a>
            </footer>
          </div>
        </div>
      </div>
    </section>

</template>

<script>

const getMessages = async (app,ref) => {
  const { messages } = await app.$db.messages.list(ref)
  const newMessages = messages.map(msg => {
    if (msg.time) {
      const time = new Date(msg.time)
      msg.ago = app.$moment([
        time.getFullYear(),
        time.getMonth(),
        time.getDate(),
        time.getHours(),
        time.getMinutes(),
        time.getSeconds()
      ]).fromNow()
    }
    return msg
  })
  return newMessages.reverse()
}

export default {
  layout: 'account',
  data () {
    return {
      date: null,
      note: null,
      withdraw_address: null,
      message: null,
      messages: null
    }
  },
  async asyncData ({ app, params: { ref }}) {
    try {
    const { match: {status, product, delivery}} = await app.$db.matches.get(ref)
    const date = (product.date) ? new Date(product.date) : null
    const minDate = new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate())
    const maxDate = (date) ? new Date(date.getFullYear(), date.getMonth(), date.getDate()) : null
    let messages = []
    if (delivery) { messages = await getMessages(app,ref) }
    return { ref, status, product, delivery, messages, minDate, maxDate }
    } catch (error) {
      console.log(error)
    }
  },
  computed: {
    isAuthorized () {
      return this.$store.state.auth.loggedIn
    },
    me () {
      return this.$store.state.auth.user.id
    },
    isBuyer () {
      return (this.$store.state.auth.user)
      ? this.product.user.id === this.$store.state.auth.user.id
      : false
    },
    isSeller () {
      return (this.delivery && this.$store.state.auth.user)
      ? this.delivery.user.id === this.$store.state.auth.user.id
      : false
    }
  },
  methods: {
    async book () {
      const { match: {status, product, delivery}} = await this.$db.matches.update({
        ref: this.ref,
        props: {
          status: 2,
          delivery: {
            user: {
              id: this.$store.state.auth.user.id,
              name: this.$store.state.auth.user.name
            },
            date: this.date,
            note: this.note,
            withdraw_address: this.withdraw_address
          }
        }
      })
      this.status = status
      this.product = product
      this.delivery = delivery
    },
    async postMessage () {
      await this.$db.messages.create({
        props: {
          time: new Date(),
          content: this.message,
          trade: this.ref,
          user: {
            id: this.$store.state.auth.user.id,
            name: this.$store.state.auth.user.name
          }
        }
      })
      this.messages = await getMessages(this, this.ref)
      this.message = null
    },
    async dispute () {
      await this.$db.trades.update({
        ref: this.ref,
        props: { status: 3}
      })
    },
    async release () {
      await this.$db.trades.update({
        ref: this.ref,
        props: { status: 4}
      })
    }
  },
  created () {
    setInterval( async () => {
      if (this.delivery) {
        this.messages = await getMessages(this, this.ref)
      }
    }, 120000)
  },
}
</script>