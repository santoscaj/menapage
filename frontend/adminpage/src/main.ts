import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {store} from './store'
import './registerServiceWorker'
import {Input, Button, Table} from 'view-design';
import 'view-design/dist/styles/iview.css'
import './axios'

Vue.component('Input', Input)
Vue.component('Button', Button)
Vue.component('Table', Table)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
