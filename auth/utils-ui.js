import jwt from 'jsonwebtoken'
import rbac from './rbac-ui'
import { APP_SECRET } from '../globals'

function getUserId() {
  const token = localStorage.getItem('app-auth-token')
  if (!token) return null
  const { userId } = jwt.verify(token, APP_SECRET, {
    ignoreExpiration: true
  })
  return userId
}

function getUserRole() {
  const token = localStorage.getItem('app-auth-token')
  if (!token) return null
  const { userRole } = jwt.verify(token, APP_SECRET, {
    ignoreExpiration: true
  })
  return userRole.role
}

export const Auth = {
  async isAuthenticated() {
    const userId = await getUserId()
    if (userId) return true
    return false
  },
  async isAuthorized(action, params) {
    const userRole = await getUserRole()
    const allowed = await rbac.can(userRole, action, params)
    if (allowed) return true
    return false
  }
}
