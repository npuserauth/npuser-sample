import { createStore } from 'vuex'

export default createStore({
  state: {
    loading: false
  },
  mutations: {
    loading (state, val) {
      state.loading = val
    }
  },
  actions: {
  },
  modules: {
  }
})
