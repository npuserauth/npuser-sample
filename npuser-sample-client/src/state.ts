import store from './store'

// const AUTH_TOKEN_KEY = 'authToken'

export default class State {

  static setLoading(val: boolean) {
    store.commit('loading', val)
  }

  static getLoading(): boolean {
    return store.state.loading
  }

  // static logInUser(token: string) {
  //   store.commit('setToken', token)
  //   localStorage.setItem(AUTH_TOKEN_KEY, token)
  // }
  //
  // static logOutUser() {
  //   store.commit('setToken', '')
  //   localStorage.removeItem(AUTH_TOKEN_KEY)
  // }
  //
  // static isUserLoggedIn(): boolean {
  //   const t: string = store.state.token
  //   return !!t && t.length > 0
  // }
  //
  // static getToken(): string {
  //   return store.state.token
  // }
  //
  // static initialize() {
  //   const token = localStorage.getItem(AUTH_TOKEN_KEY)
  //   console.log(`initialize app with user token ${token}`)
  //   if (token) {
  //     store.commit('setToken', token)
  //   }
  // }
}
