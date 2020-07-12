import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import ManagePage from '../views/ManagePage.vue'
import ManageHome from '../views/ManageHome.vue'
import Login from '../views/Login.vue'
import { nextTick } from 'vue/types/umd'


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
  },
  {
    path: '/manage',
    name: 'ManageHome',
    component: ManageHome
  },
  {
    path: '/manage/:albumDay',
    name: 'Manage',
    component: ManagePage
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
