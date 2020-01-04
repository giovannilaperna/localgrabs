<template>
  <aside class="menu">
    <p class="menu-label">
      Products
    </p>
    <ul class="menu-list">
      <li><nuxt-link to="/account/products/new/">New</nuxt-link></li>
      <li><nuxt-link :to="{path: '/account/products/'}">Lists</nuxt-link></li>
    </ul>
    <p class="menu-label">
      Deliveries
    </p>
    <ul class="menu-list">
      <li><nuxt-link to="/account/deliveries/">List</nuxt-link></li>
    </ul>
  </aside>
</template>

<script>
export default {
  name: 'AccountMenu'
}
</script>