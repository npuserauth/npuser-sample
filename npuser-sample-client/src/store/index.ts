import { createStore } from 'vuex'

export default createStore({
  state: {
    loading: false,
    token: ''
  },
  mutations: {
    loading (state, val) {
      state.loading = val
    },
    setToken: function (state, token: string) {
      state.token = token
    }
  }
})
