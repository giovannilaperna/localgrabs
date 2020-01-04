<template>
  <section class="section container">
    <button @click="walletCreate()" class="button">Create Wallet</button>
    <button @click="listWallets()" class="button">List Wallets</button>
    <button @click="walletGet()" class="button">Get Wallet</button>
    <button @click="deriveAddress()" class="button">Derive Address</button>
    <button @click="deleteWallet()" class="button">Delete Wallet</button>
    <p>{{data}}</p>
    <p>{{addresses}}</p>
    <p>{{address}}</p>
    <p>{{wallets}}</p>
  </section>
</template>

<script>
export default {
  data () {
    return {
      data: null,
      addresses: null,
      address: null,
      wallets: null
    }
  },
  methods: {
    async walletCreate () {
      const data = await this.$blockcypher.wallets.create({
        name: process.env.WALLET_NAME,
        // subchain_indexes: [0,1]
      })
      this.data = data
    },
    async walletGet () {
      const data = await this.$blockcypher.wallets.get(process.env.WALLET_NAME)
      this.addresses = data
    },
    async listWallets () {
      const data = await this.$blockcypher.wallets.list()
      this.wallets = data
    },
    async deriveAddress () {
      const data = await this.$blockcypher.wallets.deriveAddress(process.env.WALLET_NAME)
      this.address = data
    },
    async deleteWallet () {
      const data = await this.$blockcypher.wallets.delete(process.env.WALLET_NAME)
      this.data = data
    }
  }
}
</script>