<template>
  <b-navbar wrapper-class="container">
    <template slot="brand">
      <b-navbar-item tag="router-link" :to="{ path: '/' }">
        <b-taglist attached>
          <b-tag size="is-medium" type="is-primary">LocalGrabs</b-tag>
          <b-tag size="is-medium" type="is-grey">0.1</b-tag>
        </b-taglist>
      </b-navbar-item>
    </template>
    <template slot="start">
      <b-navbar-item tag="router-link" :to="{ path: '/products/' }">
        Products
      </b-navbar-item>
    </template>
    <template slot="end">
      <b-navbar-item v-if="authenticated" tag="router-link" :to="{ path: '/account/' }">
        Account
      </b-navbar-item>
      <b-navbar-item tag="div">
        <button v-if="!authenticated" @click="login" class="button is-primary is-outlined">Login with facebook</button>
        <button v-if="authenticated" @click="logout" class="button is-primary is-outlined">Logout</button>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script>
export default {
  name: 'NavBar',
  computed: {
    authenticated() {
      return this.$store.state.auth.loggedIn
    }
  },
  methods: {
    login() {
      this.$auth.loginWith('facebook')
    },
    logout() {
      this.$auth.logout()
    }
  }
}
</script>
