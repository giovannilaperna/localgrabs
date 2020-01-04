<template>
  <section class="section container">
    <h1 class="title">My Products</h1>
    <div v-if="enabled.length > 0" id="enabled" class="content">
      <h2 class="subtitle is-5">Enabled</h2>
      <b-table :data="enabled">
        <template slot-scope="props">
          <b-table-column label="ID">
            {{`${props.row.ref.substr(0,4)}.....${props.row.ref.substr(props.row.ref.length-4)}`}}
          </b-table-column>
          <b-table-column label="Date">
            <p v-if="props.row.product.date">{{ props.row.product.date.split('T')[0] }}</p>
          </b-table-column>
          <b-table-column label="Amazon ID">
            <a :href="'https://www.amazon.com/dp/'+props.row.product.amazon_id">{{props.row.product.amazon_id}}</a>
          </b-table-column>
          <b-table-column label="Price">
            {{ props.row.product.specifications.price.total }}<span class="is-size-7">USD</span>
          </b-table-column>
          <b-table-column numeric>
            <b-field grouped position="is-right">
              <p class="control">
                <button @click="disable(props.row.ref)" class="button is-small">Disable</button>
              </p>
              <p class="control">
                <button class="button is-small">Remove</button>
              </p>
            </b-field>
          </b-table-column>
        </template>
      </b-table>
    </div>
    <div v-if="disabled.length > 0" id="disabled" class="content">
      <h2 class="subtitle is-5">Disabled</h2>
      <b-table :data="disabled">
        <template slot-scope="props">
          <b-table-column label="ID">
            {{`${props.row.ref.substr(0,4)}.....${props.row.ref.substr(props.row.ref.length-4)}`}}
          </b-table-column>
          <b-table-column label="Date">
            <p v-if="props.row.product.date">{{ props.row.product.date.split('T')[0] }}</p>
          </b-table-column>
          <b-table-column label="Amazon ID">
            <a :href="'https://www.amazon.com/dp/'+props.row.product.amazon_id">{{props.row.product.amazon_id}}</a>
          </b-table-column>
          <b-table-column label="Price">
            {{props.row.product.specifications.price.total}}<span class="is-size-7">USD</span>
          </b-table-column>
          <b-table-column numeric>
            <b-field grouped position="is-right">
              <p class="control">
                <button @click="enable(props.row.ref)" class="button is-small">Enable</button>
              </p>
            </b-field>
          </b-table-column>
        </template>
      </b-table>
    </div>
    <div v-if="delivering.length > 0" id="delivering" class="content">
      <h2 class="subtitle is-5">Delivering</h2>
      <b-table :data="delivering">
        <template slot-scope="props">
          <b-table-column label="ID">
            {{`${props.row.ref.substr(0,4)}.....${props.row.ref.substr(props.row.ref.length-4)}`}}
          </b-table-column>
          <b-table-column label="Deliverer">
            {{props.row.delivery.user.name}}
          </b-table-column>
          <b-table-column label="Amazon ID">
            <a :href="'https://www.amazon.com/dp/'+props.row.product.amazon_id">{{props.row.product.amazon_id}}</a>
          </b-table-column>
          <b-table-column label="Delivery Date">
            <p v-if="props.row.delivery.date">{{ props.row.delivery.date.split('T')[0] }}</p>
          </b-table-column>
          <b-table-column label="Price">
            {{ props.row.product.specifications.price.total }}<span class="is-size-7">USD</span>
          </b-table-column>
          <b-table-column numeric>
            <b-field grouped position="is-right">
              <p class="control">
                <nuxt-link :to="`/products/${props.row.ref}`" class="button is-small">Open</nuxt-link>
              </p>
            </b-field>
          </b-table-column>
        </template>
      </b-table>
    </div>
    <div v-if="delivered.length > 0" id="delivered" class="content">
      <h2 class="subtitle is-5">Delivered</h2>
    </div>
  </section>
</template>

<script>
import filter from 'lodash.filter'
export default {
  layout: 'account',
  middleware: 'auth',
  async asyncData ( { app, store }) {
    const { products } = await app.$db.me.products()
    const disabled = filter(products, { status: 0 })
    const enabled = filter(products, { status: 1 })
    const delivering = filter(products, { status: 2 })
    const delivered = filter(products, { status: 3 })
    return { enabled, disabled, delivering, delivered }
  },
  methods: {
    async updateLists () {
      const { products } = await this.$db.me.products(this.$store.state.auth.user.id)
      this.disabled = filter(products, { status: 0 })
      this.enabled = filter(products, { status: 1 })
      this.delivering = filter(products, { status: 2 })
      this.delivered = filter(products, { status: 3 })
    },
    async disable (ref) {
      await this.$db.matches.update({ ref, props: { status: 0 }})
      await this.updateLists()
    },
    async enable (ref) {
      await this.$db.matches.update({ ref, props: { status: 1 }})
      await this.updateLists()
    }
  }
}
</script>
