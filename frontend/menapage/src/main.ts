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


import * as firebase from "firebase";

var config = {
  apiKey: "AIzaSyCZpBfvZFuK6gN6jU9xgcQt4koGrRCXftQ",
  authDomain: "meni-love.firebaseapp.com",
  databaseURL: "https://meni-love.firebaseio.com",
  projectId: "meni-love",
  storageBucket: "meni-love.appspot.com",
  messagingSenderId: "953041820126",
  appId: "1:953041820126:web:e80dd839e8afc4ee35e54f"
}; 
// 4. Get Firebase Configuration
firebase.initializeApp(config);

const messaging = firebase.messaging();

messaging.usePublicVapidKey("BMHKW3ayfgcE_CyH02iHUs2Kjzg-JKFi0psyTd8It3Coc1wj3oT4L8AGHDRfBY2zF3Eg5ANLeKvhY6IjVapoKrY"); // 1. Generate a new key pair

// Request Permission of Notifications
messaging.requestPermission().then(() => {
  console.log('Notification permission granted.');

  // Get Token
  messaging.getToken().then((token) => {
    console.log(token)
  })
}).catch((err) => {
  console.log('Unable to get permission to notify.', err);
});

messaging.onMessage((data)=>{
  console.log('message received ', data)
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
