import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import AdminLogin from '../views/AdminLogin.vue'
import ManagePage from '../views/ManagePage.vue'
import Store from '@/store'
Vue.use(VueRouter)

  const routes: Array<RouteConfig> = [
  {
    path: '/login',
    name: 'Login',
    component: AdminLogin
  },
  {
    path: '/manage',
    name: 'Manage',
    component: ManagePage
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next)=>{
  if(to.name!='Login' && !Store.state.login)
    next({name:'Login'})
  else if(to.name==from.name)
    next(false)
  else
    next()
})

export default router
