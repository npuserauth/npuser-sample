<template lang="pug">
div
  h1 User dashboard
  div(class="")
    div Your private user data as currently stored this sample application server
    div {{ userAppData }}
  div(class="form-container")
    div(class="form-group")
      label(for="userText") Your private user data:
      input(type="text", v-model="uState.userText", id="userText", name="userText")
    div(class="button-group")
      button(v-on:click="updateUserText()", title="updateUserText") Update
  div(class="button-group")
    button(v-on:click="refresh()", title="refresh") Refresh
  div
    div(class="")
      label(for="fakeLoginEmail") fake login email
      input(type="text", v-model="uState.fakeLoginEmail", id="fakeLoginEmail", name="fakeLoginEmail")
      button(v-on:click="fakeLoginEmail()", title="Ap") Fake login


</template>

<script lang="ts">
import { reactive } from 'vue'
import { postToMyServer } from '@/api-helper'
import { useUsers } from '@/user'

type UState = {
  fakeLoginEmail?: string;
  userText? : string;
}
type LogInBody = { auth: boolean; newUser: boolean; token: string; user: object }

export default {
  setup () {
    const uState: UState = reactive({
      fakeLoginEmail: '',
      userText: '',
    })
    const {userAppData, userLoggedIn, userLogout, userRefresh, userUpdateData } = useUsers()

    const fakeLoginEmail = async () => {
      const payload= {email: uState.fakeLoginEmail}
      const response = await postToMyServer('app/fake', payload)
      const data: LogInBody = response
      const token: string = data.token
      userLoggedIn(token)
    }

    const refresh = async () => {
      await userRefresh()
    }

    const updateUserText = async () => {
      await userUpdateData(uState.userText || '')
    }

    /* ---------------------------------------------------- */
    return {
      uState,
      refresh,
      fakeLoginEmail,
      updateUserText,
      userAppData,
   }
  }
}
</script>
