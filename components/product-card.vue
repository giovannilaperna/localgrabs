<template>
  <div class="card">
    <div class="card-image">
      <figure
        :style="'height: 128px; background-color:grey;'"
        class="image is-square"
      >
        <nuxt-link :to="'/products/'+match.ref+'/'">
          <img :src="match.product.specifications.image" :alt="'Image of '+ match.product.specifications.title">
        </nuxt-link>
      </figure>
    </div>
    <div class="card-content">
      <div class="content">
        <div class="columns is-mobile">
          <div class="column expanded">
            <p class="title is-5">
              {{match.product.specifications.title}}
            </p>
            <div class="content">
              Reward: {{match.product.specifications.price.reward}} USD
              <br>
              Escrow: {{match.product.specifications.price.btc}} BTC
            </div>
            <div class="content has-text-weight-bold">
              {{match.product.city}} [{{match.product.country}}]
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer class="card-footer">
      <nuxt-link :to="'/products/'+match.ref+'/'" class="card-footer-item">View details</nuxt-link>
      <a :href="'https://amazon.com/dp/'+match.product.amazon_id" target="_blank" class="card-footer-item">View on Amazon</a>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'ProductCard',
  props: [
    'match',
  ]
}
</script>