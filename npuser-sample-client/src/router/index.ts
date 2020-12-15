import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { authenticated } from '@/user'
import Home from '@/views/Home.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue')
  },
  {
    path: '/account',
    name: 'account',
    component: () => import(/* webpackChunkName: "account" */ '@/views/Account.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/auth',
    name: 'auth',
    component: () => import(/* webpackChunkName: "auth" */ '@/npuser-auth/Auth.vue'),
    meta: {
      guest: true
    }
  },
  {
    path: '/dashboard',
    name: 'userDash',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/views/UserDash.vue'),
    meta: {
      requiresAuth: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in ... if not, redirect to login page.
    if (!authenticated()) {
      next({
        path: '/auth',
        query: { redirect: to.fullPath }
      })
      return
    }
  }
  // make sure to always call next()!
  next()
})

export default router

