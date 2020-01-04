<template>
  <section class="section">
    <h1 class="title">New product</h1>
    <div class="columns">
      <div class="column is-half">
        <b-field label="Country">
          <b-select v-model="country" placeholder="Select a country" expanded>
            <option
              v-for="(country) in countries"
              :value="country.name"
              :key="country.alpha2Code">
              {{ country.name }}
            </option>
          </b-select>
        </b-field>
        <b-field label="City">
          <b-select v-model="city" placeholder="Select a city" expanded>
            <option
              v-for="(city) in cities"
              :value="city.name"
              :key="city.geonameid">
              {{ city.name }}
            </option>
          </b-select>
        </b-field>
        <b-field label="Date limit">
          <b-datepicker
            v-model="date"
            icon="calendar-today"
            editable>
          </b-datepicker>
        </b-field>
        <b-field label="Amazon product code">
          <b-input v-model="amazon_id" type="text" expanded></b-input>
        </b-field>
        <b-field label="Reward %">
          <b-slider v-model="reward" :min="5" :max="50" :step="5" ticks></b-slider>
        </b-field>
        <b-field grouped>
          <p class="control">
            <button @click="loadData" :class="loadDataButtonClass">Save and Fund</button>
          </p>
        </b-field>

        <div v-if="specifications" class="column">
          <h1 class="title is-4">{{specifications.title}}</h1> 
          <h2 class="subtitle is-6">Brand: {{specifications.brand}} | Weight: {{specifications.weight}} Kg</h2>
          <div class="columns">
            <div class="column is-narrow has-text-right">
              <p>Product</p>
              <p>Shipping</p>
              <p>Taxes</p>
              <p>Reward</p>
              <p>Total USD</p>
            </div>
            <div class="column is-narrow">
              <p>{{specifications.price.product}}</p>
              <p>{{specifications.price.shipping}}</p>
              <p>{{specifications.price.taxes}}</p>
              <p>{{specifications.price.reward}}</p>
              <p>{{specifications.price.total}}</p>
            </div>
          </div>
        </div>

      </div>
      <div class="column is-half">
        <div v-if="address_btc">
          <addr :address_btc="address_btc" :amount_btc="specifications.price.btc" />
        </div>
      </div>
    </div>
  </section> 
</template>

<script>
import addr from '~/components/deposit-address'
import filter from 'lodash.filter'
import sortBy from 'lodash.sortby'
import { allCities } from '~/assets/js/allCities'
export default {
  layout: 'account',
  middleware: 'auth',
  components: {
    addr: addr
  },
  data () {
    return {
      country: null,
      city: null,
      date: null,
      amazon_id: null,
      reward: 5,
      specifications: null,
      loadDataButtonClass: 'button',
      specifications: null,
      address_btc: null,
    }
  },
  async asyncData ({ app }) {
    const { data: { countries }} = await app.$axios.get('/.netlify/functions/get-countries')
    return { countries }
  },
  computed: {
    cities () {
      if (this.country) {
        return sortBy(filter(allCities, { country: this.country}), 'name')
      }
      else {
        return []
      }
    }
  },
  methods: {
    async setAmazonData () {
      const btcPrice = await this.$btcPrice['USD']
      const { data: { specifications: { title, brand, weight, image, price }}} = await this.$axios.get('/.netlify/functions/amazon', {
        params: { asin: this.amazon_id }
      })
      this.specifications = {
        title, brand, weight, image, price: {
          product: this.$utils.round(price, 2),
          shipping: 0.00,
          taxes: this.$utils.round(price * 0.06, 2),
          reward: this.$utils.round(price * 1.06 * (this.reward/100), 2),
          total: this.$utils.round((price * 1.06 * ((this.reward/100)+1)),2),
          btc: this.$utils.round((price * 1.06 * ((this.reward/100)+1))/btcPrice, 8)
        }
      }
    },
    async setAddress () {
      const { chains } = await this.$blockcypher.wallets.deriveAddress(process.env.WALLET_NAME)
      this.address_btc = chains[0].chain_addresses[0].address
    },
    async postNew () {
      const props = {
        status: 0,
        advertisement: 'product',
        product: {
          user: {
            id: this.$store.state.auth.user.id,
            name: this.$store.state.auth.user.name
          },
          amazon_id: this.amazon_id,
          specifications: this.specifications,
          reward: this.reward,
          country: this.country,
          city: this.city,
          date: this.date,
          address_btc: this.address_btc,
          founded: false,
          time: new Date()
        }
      }
      const data = await this.$db.products.create({ props })
      // this.resetForm()
    },
    async createWebhook () {
      await this.$blockcypher.hooks.create({
        event: 'unconfirmed-tx',
        address: this.address_btc,
        // https://enk6y8uyubahc.x.pipedream.net
        url: `${process.env.URL}/.netlify/functions/blockcypher-hooks-tx?auth=${process.env.WEBHOOK_AUTH}`,
      })
    },
    async loadData () {
      this.loadDataButtonClass = 'button is-loading'
      await this.setAmazonData()
      await this.setAddress()
      // await this.createWebhook()
      const data = await this.postNew()
      this.loadDataButtonClass = 'button'
    },
  }
}
</script>