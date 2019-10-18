const opts = {
  registered: {
    can: [
      'rental:add',
      'user_settings',
      {
        name: 'user:update-credentials',
        when: async params => params.userId === params.updaterId
      }
    ]
  },
  admin: {
    can: ['user:*'],
    inherits: ['registered']
  }
}

const rbac = require('easy-rbac').create(opts)

module.exports = rbac
