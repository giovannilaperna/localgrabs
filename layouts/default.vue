<template>
  <div>
    <nav-bar />
    <nuxt />
  </div>
</template>

<script>
import NavBar from '~/components/nav-bar'
export default {
  components: {
    navBar: NavBar
  }
  
}
</script>