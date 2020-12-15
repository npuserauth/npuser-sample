import {getFromMyServer, postToMyServer} from '@/api-helper'
import {computed, ComputedRef, Ref, ref} from 'vue'

const AUTH_TOKEN_KEY = 'authToken'

interface DbUser {
  id: number;
  email: string;
  appData: string;
}

function getDefs() {

  const _authToken = ref('')

  const userInfo = ref({} as DbUser)

  const authenticated = computed((): boolean => _authToken.value.length > 0)

  const authToken = computed(() => _authToken.value)

  async function loadUser(): Promise<void> {
    console.log('User', 'load')
    userInfo.value = {} as DbUser
    if (authenticated.value) {
      const response: DbUser = await getFromMyServer('app/data') as DbUser
      userInfo.value = response
      console.log('User', 'response', response)
    }
  }

  async function restoreUserFromStash(): Promise<void> {
    _authToken.value = ''
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    if (token) {
      console.log(`initialize user with user token ${token}`)
      _authToken.value = token
    }
    return loadUser()
  }

  const userAppData = computed((): string => userInfo.value ? userInfo.value.appData : '')

  async function userLogout(): Promise<void> {
    console.log('User', 'userLogout')
    _authToken.value = ''
    localStorage.removeItem(AUTH_TOKEN_KEY)
    return loadUser()
  }

  async function userLoggedIn(token: string): Promise<void> {
    console.log('User', 'log in user', token)
    _authToken.value = token
    localStorage.setItem(AUTH_TOKEN_KEY, token)
    return loadUser()
  }

  async function userRefresh() {
    return loadUser()
  }

  async function userUpdateData(userText: string): Promise<void> {
    console.log('User', 'updateUserData')
    const payload = {userText: userText}
    userInfo.value = await postToMyServer('app/update', payload) as DbUser
  }

  return {
    authenticated,
    authToken,
    // canAdmin,
    restoreUserFromStash,
    userAppData,
    userInfo,
    userLoggedIn,
    userLogout,
    userRefresh,
    userUpdateData
  }
}

type Defs = {
  authenticated: ComputedRef<boolean>;
  authToken: ComputedRef<string>;
  restoreUserFromStash: () => Promise<void>;
  userAppData: ComputedRef<string>;
  userInfo: Ref<DbUser>;
  userLogout: () => Promise<void>;
  userLoggedIn: (token: string) => Promise<void>;
  userRefresh: () => Promise<void>;
  userUpdateData: (userText: string) => Promise<void>;
}

type Instance = { _instance: Defs | undefined }
const instance: Instance = {_instance: undefined}

function Instance() {
  return instance._instance || (instance._instance = getDefs())
}

export function useUsers() {
  return Instance()
}

export function authenticated(): boolean {
  return Instance().authenticated.value
}

export function getAuthToken(): string {
  return Instance().authToken.value
}
