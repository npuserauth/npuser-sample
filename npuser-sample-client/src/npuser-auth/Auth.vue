<template lang="pug">
div
  div
    div(class="")
      label(for="fakeLoginEmail") fake login email
      input(type="text", v-model="uState.fakeLoginEmail", id="fakeLoginEmail", name="fakeLoginEmail")
      button(v-on:click="fakeLoginEmail()", title="Ap") Fake login
    div(class="")
      label(for="userText") user text
      input(type="text", v-model="uState.userText", id="userText", name="userText")
      button(v-on:click="updateUserText()", title="updateUserText") Update
    div(class="")
      label User Text
      div authenticated {{ authenticated }}
      div authToken {{ authToken }}
      div userAppData: {{ userAppData }}
      div {{ userInfo }}
      button(v-on:click="refresh()", title="refresh") Refresh
      button(v-on:click="logout()", title="logout") Logout

  div
    pre {{ state.data }}
    div ---

  <!-- now real sample below -->
  div &nbsp;
  hr
  h5 above is experiment and below is real sample
  div(v-if="state.isPendingUserEmail")
    login-form-input-email(v-on:email="npAuthUser($event)")
    p(v-if="state.errMsg", class="error-text") {{state.errMsg}}
    p.
      NP user and this sample application consider your personal information to be yours and yours alone.
    p.
      By clicking the button above, you agree to allow this sample client application to share your email address with the NP User Authentication service (see <a href="npuser.org">npuser.org</a>).  The NP User Authentication service will now send you one email message with a verification code and then that service will immediately forget everything about you.
    p.
      To help keep our system safe and running, this application will store your IP address for up to one day. This is only used to prevent malicious users from over loading the system and denying you access.
    p Please write to us if you have any questions or concerns at <a href="mailto:info@npuser.org">info@npuser.org</a>
    hr
  div(v-if="state.isPendingVerificationCode")
    login-form-input-v-code(v-on:vcode="npVerifyUser($event)", v-on:cancel="npCancelLogin()")
    p(v-if="state.errMsg", class="error-text") {{state.errMsg}}
    p.
      NP user and this sample application consider your personal information to be yours and yours alone.
    p.
      The NP User Authentication service (see <a href="npuser.org">npuser.org</a>) has sent you an email and it no longer knows anything about you.
    p.
      Now, by entering the verification code and clicking the button above you will be given access to the user only area of this sample application. This sample application will allow you to enter one personal note that only you can see or access. This sample application does not retain your email address. Your privacy is secure.
    p.
      This application will store a token in your browser's local storage (we do not use browser cookies).  As long as you come back to this browser you can access whatever data you place into this sample client application. The server behind this sample client application server only knows you by a unique id created using the what is called a "one way hash". This id protects your private data without storing your email address in the system.

</template>

<script lang="ts">
import { reactive } from 'vue'
import LoginFormInputEmail from './LoginFormEmail.vue'
import LoginFormInputVCode from './LoginFormVCode.vue'
import State from '../state'
import { postToMyServer, getFromMyServer } from '@/api-helper'
import { useUsers } from '@/user'

type AuthState = {
  isPendingUserEmail: boolean;
  isPendingVerificationCode: boolean;
  email: string;
  tokenInput: string;
  errMsg?: string;
  data?: string;
}

type UState = {
  fakeLoginEmail?: string;
  userText? : string;
}

const SAMPLE_SERVER_AUTH_PATH = 'user/auth'
const SAMPLE_SERVER_VALIDATE_PATH = 'user/validate'

export default {
  components: {
    LoginFormInputEmail, LoginFormInputVCode
  },
  setup () {
    const state: AuthState = reactive({
      isPendingUserEmail: true,
      isPendingVerificationCode: false,
      email: '',
      tokenInput: '',
      errMsg: undefined,
      data: '',
    })

    const { authenticated, userLoggedIn, userLogout} = useUsers()

    type LogInBody = { auth: boolean; newUser: boolean; token: string; user: object }

    const npCancelLogin = async () => {
      state.email = ''
      await userLogout()
      state.isPendingUserEmail = true
      state.isPendingVerificationCode = false
      state.errMsg = undefined
    }

    const npAuthUser = async (email: string) => {
      State.setLoading(true)
      state.errMsg = ''
      try {
        state.email = email
        const payload = {
          email: state.email
        }
        const authResponse = await postToMyServer(SAMPLE_SERVER_AUTH_PATH, payload)
        if (authResponse.token) {
          state.isPendingUserEmail = false
          state.isPendingVerificationCode = true
        } else {
          state.errMsg = authResponse.message
        }
      } catch (error) {
        state.errMsg = error.message
      } finally {
        State.setLoading(false)
      }
    }

    const npVerifyUser = async (vcode: string) => {
      State.setLoading(true)
      state.errMsg = ''
      try {
        if (vcode) {
          const payload = {
            email: state.email,
            authToken: state.tokenInput,
            code: vcode
          }
          const validationResponse = await postToMyServer(SAMPLE_SERVER_VALIDATE_PATH, payload)
          console.log('Validation response:', validationResponse)
          if (validationResponse.token) {
            state.isPendingVerificationCode = false
            userLoggedIn(validationResponse.token)
          } else {
            state.errMsg = validationResponse.message
          }
        } else {
          state.errMsg = 'Must provide verification code'
        }
      } catch (error) {
        state.errMsg = error.message
      } finally {
        State.setLoading(false)
      }
    }

    /* ---------------------------------------------------- */

    const uState: UState = reactive({
      fakeLoginEmail: '',
      userText: '',
    })
    const {authToken, userAppData, userInfo, userRefresh, userUpdateData } = useUsers()

    const fakeLoginEmail = async () => {
      const payload= {email: uState.fakeLoginEmail}
      const response = await postToMyServer('app/fake', payload)
      state.data = JSON.stringify(response, null, 2)
      const data: LogInBody = response
      const token: string = data.token
      userLoggedIn(token)
    }

    const refresh = async () => {
      await userRefresh()
    }

    const logout = async () => {
      await userLogout()
      console.log('user.logoutUser so auth:', authenticated.value)
    }

    const updateUserText = async () => {
      await userUpdateData(uState.userText || '')
    }


    /* ---------------------------------------------------- */
    return {
      state,
      authenticated,
      npAuthUser,
      npCancelLogin,
      npVerifyUser,

      // faking testing
      uState,
      authToken,
      logout,
      refresh,
      fakeLoginEmail,
      updateUserText,
      userAppData,
      userInfo,
    }
  }
}
</script>
