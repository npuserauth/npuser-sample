import store from './store'

export default class State {

  static setLoading(val: boolean) {
    store.commit('loading', val)
  }

  static getLoading(): boolean {
    return store.state.loading
  }
}
