import Vue from 'vue'
import vuetify from './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store/store'
import '@babel/polyfill'
import axios from '@/axios'
import bus from './bus'
import { sync } from 'vuex-router-sync'
import ScrollLoader from 'vue-scroll-loader'

Vue.use(ScrollLoader)

const unsync = sync(store, router)

import VNotification from '@/components/VNotification'
import ConfirmDialog from '@/components/ConfirmDialog'
Vue.component('app-notification', VNotification)
Vue.component('confirm-dialog', ConfirmDialog)

Vue.config.productionTip = false

Vue.prototype.$axios = axios
Vue.prototype.$bus = bus

if (window.Cypress) {
  window.__store__ = store
}

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
