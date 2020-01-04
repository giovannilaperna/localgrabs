<template>
  <section class="section container">
    <div class="columns">
      <div class="column is-half">
        <b-field>
          <b-input v-model="message"  maxlength="200" type="textarea"></b-input>
        </b-field>
        <b-field>
          <button @click="postMessage" class="button">Post</button>
        </b-field>
        <div v-for="(message, index) in messages" :key="index" class="content">
          <div v-if="message.user===me" class="notification has-text-right">
            <p class="is-italic has-text-grey-light">{{message.ago}}</p>
            <p>{{message.content}}</p>
          </div>
          <div v-else class="notification">
            <p>
              <span class="has-text-weight-semibold has-text-grey-light">
              {{username || message.user}}
              </span>, <span class="is-italic has-text-grey-light">{{message.ago}}</span>
            </p>
            <p>{{message.content}}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
const getMessages = async (app,ref) => {
  const { messages } = await app.$db.messages.listByTrade(ref)
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
  middleware: 'auth',
  data () {
    return {
      message: null,
    }
  },
  async asyncData ({ app, store, params: { ref }}) {
    const { trade } = await app.$db.trades.get(ref)
    const otherUserId = [trade.product.user, trade.delivery.user].filter(user => user !== store.state.auth.user.id)[0]
    const {data: {username}} = await app.$db.users.get(otherUserId)
    const isBuyer = (trade.product.user === store.state.auth.user.id) ? true : false
    const messages = await getMessages(app,ref)
    return { ref, messages, trade, username, isBuyer }
  },
  created () {
    setInterval( async () => {
      const messages = await getMessages(this, this.ref)
      this.messages = messages
    }, 120000)
  },
  computed: {
    me () {
      return this.$store.state.auth.user.id
    }
  },
  methods: {
    async postMessage () {
      await this.$db.messages.create({
        ref: this.ref, props: {
          time: new Date(),
          content: this.message,
          trade: this.ref,
          user: this.$store.state.auth.user.id
        }
      })
      const messages = await getMessages(this, this.ref)
      this.messages = messages
      this.message = null
    },
    async dispute () {
      await this.$db.trades.update({
        ref: this.trade.ref,
        props: { status: 4}
      })
    },
    async release () {
      await this.$db.trades.update({
        ref: this.trade.ref,
        props: { status: 5}
      })
    }
  }
}
</script>