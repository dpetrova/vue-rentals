const jwt = require('jsonwebtoken')
const cfg = require('../globals')
const rbac = require('./rbac')

/*function that you’ll call in resolvers which require authentication and/or authorization */

function getUserId(context) {
  //console.log(context.headers)
  const Authorization = context.headers.authorization
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const { userId } = jwt.verify(token, cfg.APP_SECRET)
    return userId
  }

  throw new Error('Not authenticated')
}

function getUserRole(context) {
  const Authorization = context.headers.authorization
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const { userRole } = jwt.verify(token, cfg.APP_SECRET, {
      ignoreExpiration: true
    })

    return userRole.role
  }

  throw new Error('Not authenticated')
}

async function isAuthorized(context, action, params) {
  //console.log(params)
  const updaterId = await getUserId(context)
  const userRole = await getUserRole(context)
  if (params) params.updaterId = updaterId.toString()
  const allowed = await rbac.can(userRole, action, params)
  if (allowed) return true

  throw new Error('Not authorized')
}

module.exports = {
  getUserId,
  getUserRole,
  isAuthorized
}
