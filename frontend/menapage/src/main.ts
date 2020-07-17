import Vue, { PluginObject, VueConstructor} from 'vue'
import _Vue from "../node_modules/vue/types"
import App from './App.vue'
import router from '@/router'
import './registerServiceWorker'
import './axios'

import { Input, Button, Table } from 'view-design'
import 'view-design/dist/styles/iview.css'
Vue.component('Input', Input)
Vue.component('Button', Button )
Vue.component('Table', Table)
// @ts-ignore
import Chat from 'vue-beautiful-chat'
Vue.use(Chat)
Vue.config.productionTip = false

import * as firebase from "firebase";

// class Firebase{
//   private _token: string = ''

//   constructor() {
//     this._token= ''
//   }

//   get token(){
//     return this._token
//   }
//   set token(newVal:string){
//     this._token = newVal
//   }
// }

// const myFirebasePlugin :PluginObject<any> = {
//   install(Vue: VueConstructor<_Vue>){
//     Vue.prototype.$firebase = Vue.observable(new Firebase())
//   }
// }

// Vue.use(myFirebasePlugin)

const vueInstance = new Vue({
    router,
    render: h => h(App)
}).$mount('#app')

// var config = {
//   apiKey: "AIzaSyCZpBfvZFuK6gN6jU9xgcQt4koGrRCXftQ",
//   authDomain: "meni-love.firebaseapp.com",
//   databaseURL: "https://meni-love.firebaseio.com",
//   projectId: "meni-love",
//   storageBucket: "meni-love.appspot.com",
//   messagingSenderId: "953041820126",
//   appId: "1:953041820126:web:e80dd839e8afc4ee35e54f"
// }; 

// // Firebase Configuration
// firebase.initializeApp(config);

// const messaging = firebase.messaging();
// messaging.usePublicVapidKey("BMHKW3ayfgcE_CyH02iHUs2Kjzg-JKFi0psyTd8It3Coc1wj3oT4L8AGHDRfBY2zF3Eg5ANLeKvhY6IjVapoKrY"); // 1. Generate a new key pair

// messaging.requestPermission().then(() => {
//   console.log('Notification permission granted.');

//   messaging.getToken().then((token) => {
//     // @ts-ignore 
//     vueInstance.$firebase.token = token
//   })
// }).catch((err) => {
//   console.log('Unable to get permission to notify.', err);
// });

// messaging.onMessage((data)=>{
// })
