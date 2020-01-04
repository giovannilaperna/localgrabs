<template>
  <div class="container">
    <nav-bar />
      <div class="columns">
        <div class="column">
          <nuxt />
        </div> 
        <div class="column is-narrow">
          <section class="section">
            <account-menu />
          </section>
        </div>
      </div>
  </div>
</template>

<script>
import NavBar from '~/components/nav-bar'
import AccountMenu from '~/components/account-menu'
export default {
  components: {
    navBar: NavBar,
    accountMenu: AccountMenu
  }
  
}
</script>