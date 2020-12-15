import { createApp } from 'vue'
import App from './App.vue'
import { FontAwesomeIcon } from './icons'
import router from './router'
import store from './store'

import './scss/styles.scss'

createApp(App)
  .use(store)
  .use(router)
  .component('fas-icon', FontAwesomeIcon)
  .mount('#app')
