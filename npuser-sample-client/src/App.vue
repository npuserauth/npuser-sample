<template lang="pug">
div
  ui-spinner
  div(id="app-banner")
    ul(class="nav-list nav-left")
      li
        router-link(to="/") Home
      li
        span(class="nav-spacer")
        router-link(to="/about") About
      li(v-if="!authenticated")
        span(class="nav-spacer")
        router-link(to="/auth") Sign in
      li(v-if="authenticated")
        span(class="nav-spacer")
        router-link(to="/dashboard") User Dash
    ul(class="nav-list nav-right")
      li(v-if="authenticated")
        router-link(to="account")
          fas-icon(class="fa", icon="user")
  div(class="page-content")
    router-view
  div(class="footer")
    app-email-us
</template>

<script lang="ts">
import UiSpinner from './components/UiSpinner.vue'
import AppEmailUs from '@/components/AppEmailUs.vue'
import { useUsers } from '@/user'

export default {
  components: {
    UiSpinner, AppEmailUs
  },
  setup () {

    const { authenticated } = useUsers()

    return {
      authenticated
    }
  },
  created() {
    const { restoreUserFromStash } = useUsers()
    restoreUserFromStash()
  }
}

</script>
<style scoped lang="scss">
  @import './scss/definitions';

  #app-banner {
    background-color: aliceblue;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: row;

    .nav-left {
      flex: 1 0 60%; // setting this flex on the left side actually pushes the right side to the righe
    }
    .nav-right {
      padding-right: 2rem;
    }

    ul {
      /*width: 90%;*/
      /*margin: 0 auto;*/
      /*padding: 1rem;*/
      display: flex;
      flex-direction: row;
      font-size: 1.5rem;

      li {
        display: flex;
        flex-direction: row;
      }

      a {
        font-weight: bold;
        color: $text-color;
        text-decoration: none;

        &.router-link-exact-active {
          color: $active-link-color;
        }
      }

      .nav-spacer {
        width: 2rem;
        text-align: center;

        &::after {
          content: '|';
        }
      }
    }

    @media all and (max-width: 500px) {
      .nav-list {
        font-weight: normal;
        font-size: 1rem;
      }
    }

    .user-menu-chevron {
      height: 1rem;
    }

    button {
      width: 1rem;
    }
    button .fa {
      color: white;
      margin: 0 auto;
    }
  }
</style>
