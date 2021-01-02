<template lang="pug">
div
  div(v-if="isPendingUserEmail")
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
  div(v-if="isPendingVerificationCode")
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
import { computed, reactive } from 'vue'
import { onMounted } from 'vue'
import LoginFormInputEmail from './LoginFormEmail.vue'
import LoginFormInputVCode from './LoginFormVCode.vue'
import State from '../state'
import { postToMyServer } from '@/api-helper'
import { useUsers } from '@/user'

type AuthState = {
  email: string;
  tokenInput: string;
  errMsg?: string;
  data?: string;
}

const SAMPLE_SERVER_AUTH_PATH = 'user/auth'
const SAMPLE_SERVER_VALIDATE_PATH = 'user/validate'

export default {
  components: {
    LoginFormInputEmail, LoginFormInputVCode
  },
  setup () {
    const { authenticated, userLoggedIn, userLogout} = useUsers()

    const state: AuthState = reactive({
      email: '',
      tokenInput: '',
      errMsg: undefined,
      data: '',
    })
    onMounted(() => {
      state.email = ''
      state.tokenInput = ''
      state.errMsg = undefined
      state.data = ''
    })

    const isPendingUserEmail = computed((): boolean => !(authenticated.value || state.tokenInput.length > 0))
    const isPendingVerificationCode = computed((): boolean => !isPendingUserEmail.value && state.email.length > 0)

    const npCancelLogin = async () => {
      state.email = ''
      await userLogout()
      state.errMsg = undefined
    }

    const npAuthUser = async (email: string) => {
      State.setLoading(true)
      state.errMsg = ''
      try {
        // important to stash the email to be included in the next post
        state.email = email
        const payload = {
          email: state.email
        }
        const authResponse = await postToMyServer(SAMPLE_SERVER_AUTH_PATH, payload)
        if (authResponse.token) {
          // important to stash the np user token to be included in the next post
          state.tokenInput = authResponse.token
        } else {
          state.errMsg = authResponse.message
        }
      } catch (error) {
        state.errMsg = error.message
      } finally {
        State.setLoading(false)
      }
    }

    /**
     * Step 2. Take the verification code the user provides, and the stashed email address and npUser token and
     * send a POST to your sample application.  Your sample server will talk with npUSer to finalize the user
     * authentication process.  Your sample server will then respond with its JWT that this client will need
     * to access any resources the end user has permission to see.
     *
     * This function uses the 'userLoggedIn' function (See users.ts) to manage the user state information.
     */
    const npVerifyUser = async (vcode: string) => {
      State.setLoading(true)
      state.errMsg = ''
      try {
        if (vcode) {
          const payload = {
            // send the stashed email and np user token
            email: state.email,
            authToken: state.tokenInput,
            // send the verification code the user obtained via email
            code: vcode
          }
          const validationResponse = await postToMyServer(SAMPLE_SERVER_VALIDATE_PATH, payload)
          console.log('Validation response:', validationResponse)
          if (validationResponse.token) {
            // The user is now logged into the system.
            // stash the JWT we've been given. It is our sample application's JWT and is needed
            // for this client to authenticate with our sample application.
            // But actually, how your application handles the verification is up to you.
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
    return {
      state,
      authenticated,
      isPendingUserEmail,
      isPendingVerificationCode,
      npAuthUser,
      npCancelLogin,
      npVerifyUser,
    }
  }
}
</script>
