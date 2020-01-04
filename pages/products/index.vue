<template>
  <section class="section container">
    <div class="columns is-multiline">
      <div
        v-for="(match, index) of matches"
        :key="index"
        class="column is-full-mobile is-one-third-tablet is-one-third-desktop is-one-quarter-widescreen is-one-quarter-fullhd">
        <product-card :match="match" />
      </div>
    </div>
  </section>
</template>

<script>
import ProductCard from '~/components/product-card'
export default {
  auth: false,
  components: {
    productCard: ProductCard
  },
  async asyncData({ app }) {
    const btcPrice = await app.$btcPrice['USD']
    const matches = await app.$db.products.filter(1)
    matches.forEach((match) => {
      match.product.total_btc = app.$utils.round(match.product.specifications.price.total/btcPrice, 8)
      match.product.reward_btc = app.$utils.round(match.product.specifications.price.reward/btcPrice, 8)
    })
    return {matches}
  }
}
</script>
