import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import './registerServiceWorker'

import { Input, Button, Table } from 'view-design'
import 'view-design/dist/styles/iview.css'

Vue.component('Input', Input)
Vue.component('Button', Button )
Vue.component('Table', Table)


// @ts-ignore
import Chat from 'vue-beautiful-chat'
Vue.use(Chat)

Vue.config.productionTip = false
// Vue.config.devtools = true

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
