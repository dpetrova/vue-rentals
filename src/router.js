import Vue from 'vue'
import Router from 'vue-router'
import Rentals from '@/pages/Rentals'
import MyRentals from '@/pages/MyRentals'
import Settings from '@/pages/Settings'
import Login from '@/pages/Login'
import Users from '@/pages/Users'
import Contacts from '@/pages/Contacts'
import About from '@/pages/About'
import { Auth } from '../auth/utils-ui'
import store from './store/store'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'rentals',
      component: Rentals
    },
    {
      path: '/my-rentals',
      name: 'my-rentals',
      component: MyRentals,
      meta: { requiresAuthentication: true }
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings,
      meta: { requiresAuthentication: true }
    },
    {
      path: '/users',
      name: 'users',
      component: Users,
      meta: { requireAuthorization: true }
    },
    {
      path: '/contacts',
      name: 'contacts',
      component: Contacts
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '*',
      redirect: { name: 'rentals' }
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  /* --------------Require Authentication------------------- */
  if (to.matched.some(record => record.meta.requiresAuthentication)) {
    if (!(await Auth.isAuthenticated())) {
      store.dispatch('setBeforeRoute', to.name)
      next({
        path: '/login'
      })
    } else {
      next()
    }
    /* --------------Require Authorization------------------- */
  } else if (to.matched.some(record => record.meta.requireAuthorization)) {
    if (!(await Auth.isAuthorized(to.name))) {
      store.dispatch('setBeforeRoute', to.name)
      next({
        path: '/login'
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
