<template lang="pug">
div
  h1 Account
  div Your private user information: {{ userInfo }}
  div(class="button-group")
    button(v-on:click="refresh()", title="refresh") Refresh
    button(v-on:click="userLogout()", title="Logout") Logout

</template>

<script lang="ts">
import { useUsers } from '@/user'

export default {
  setup () {
    const { userInfo, userLogout } = useUsers()

    return {
      userLogout,
      userInfo
    }
  }
}
</script>
