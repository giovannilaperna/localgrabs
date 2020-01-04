<template>
  <section class="section">
    <div v-if="countdown>0 && !paymentDetected">
      <div>
        <p>Amount: <code>{{amount_btc}}</code> BTC</p>
        <p>Address: <code>{{address_btc}}</code></p>
      </div>
      <figure class="image is-square">
        <qrcode :value="address_btc" :width="qrCodeWidth" />
      </figure>
      <b-progress :value="countdown/totalTime*100" size="is-medium" show-value>
        {{formattedCountdown}}
      </b-progress>
    </div>
    <div v-if="paymentDetected">
      Receiving: {{parseInt(paymentDetected)/100000000}} BTC 
      Confirmed: {{confirmed}}
    </div>
  </section>
</template>

<script>
import Qrcode from 'vue-qrcode'
import find from 'lodash.find'
export default {
  name: 'DepositAddress',
  props: [
    'address_btc',
    'amount_btc'
  ],
  data () {
    return {
      qrCodeWidth: 400,
      countdown: 60 * 5,
      totalTime: 60 * 5,
      paymentDetected: false,
      confirmed: false
    }
  },
  components: {
    Qrcode
  },
  computed: {
    formattedCountdown () {
      return this.$moment.utc(this.countdown*1000).format('mm:ss')
    }
  },
  created () {
    setInterval(() => {
      this.countdown = this.countdown -1
      this.$axios.get(`/api/address/${this.address_btc}/txs`)
      .then(({ data }) => {
        if (data[0]) {
          this.paymentDetected = find(data[0].vout, {scriptpubkey_address: this.address_btc}).value
          this.confirmed = data[0].status.confirmed
        }
      })
    }, 1000)
  }
}
</script>