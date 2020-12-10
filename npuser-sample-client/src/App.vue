<template lang="pug">
div
  ui-spinner
  div(id="app-banner")
    div(id="nav")
      router-link(to="/") Home
      div(class="nav-spacer")
      router-link(to="/about") About
      div(class="nav-spacer")
      router-link(to="/auth") Sign in
      div(class="nav-spacer")
      router-link(to="/dashboard") User Dash
  div(class="page-content")
    router-view
</template>
<script>
import UiSpinner from './components/UiSpinner.vue'
export default {
  components: {
    UiSpinner
  }
}
</script>
<style scoped lang="scss">
  @import './scss/definitions';
</style>
