<template lang="pug">
div
  h1 Account
  button(v-on:click="logout()", title="Logout") Logout

</template>

<script lang="ts">
import router from '@/router'
import { useUsers } from '@/user'

export default {
  setup () {
    const { userLogout } = useUsers()

    const logout = async () => {
      userLogout()
      router.push('/')
    }

    return {
      logout
    }
  }
}
</script>
