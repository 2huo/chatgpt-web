import type { Router } from 'vue-router'
import { getJWT } from '@/store/modules/auth/helper'
import { useAuthStoreWithout } from '@/store/modules/auth'

export function setupPageGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStoreWithout()

    if (!authStore.jwt) {
      const jwt = getJWT()
      if (jwt !== undefined) {
        authStore.setJWT(jwt)
        next({ name: 'Root' })
      }
      else {
        if (authStore.loginAuth) {
          next()
        }
        else {
          authStore.loginAuth = true
          next({ name: 'login' })
        }
      }
    }
    else if (!authStore.session) {
      try {
        const data = await authStore.getSession()
        if (String(data.auth) === 'false' && authStore.token)
          authStore.removeToken()

        if (to.path === '/500')
          next({ name: 'Root' })
        else
          next()
      }
      catch (error) {
        if (to.path !== '/500')
          next({ name: '500' })
        else
          next()
      }
    }
    else {
      next()
    }
  })
}
