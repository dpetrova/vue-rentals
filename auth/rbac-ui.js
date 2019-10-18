const opts = {
  registered: {
    can: ['settings']
  },
  admin: {
    can: ['users', 'settings'],
    inherits: ['registered']
  }
}

import rbac from 'easy-rbac'

export default rbac.create(opts)
