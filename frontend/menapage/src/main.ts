import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
// import 'flickity/dist/flickity.css'

// @ts-ignore
import Chat from 'vue-beautiful-chat'
Vue.use(Chat)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
