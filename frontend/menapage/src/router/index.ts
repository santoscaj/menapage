import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import store from '@/store'
Vue.use(VueRouter)

  const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next)=>{
  let loginUser = store.user || localStorage.getItem('user')
  
  if(to.name==from.name)
    next(false)
  else if(!loginUser && to.name!='Login')
    next({name:'Login'})
  else if(loginUser && to.name=='Login')
    next({name:'Home'})
  else
    next()
})

export default router
