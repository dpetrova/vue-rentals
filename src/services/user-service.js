import axios from '@/axios'

export const UserService = {
  authenticateUser(username, password) {
    return axios.post('/graphql', {
      query: `mutation {
              login(username:"${username}", password:"${password}") {
                token
                user {
                  _id
                  username
                  role {
                    _id
                    role
                  }                                          
                }                
              }
            }
          `
    })
  },
  getAll() {
    return axios.post('/graphql', {
      query: `query {
          users {
            _id
            username
            name
            email
            role {
              _id
              role
            }            
            created_at
          }    
          userRoles {
            _id
            role
          }                   
        }
      `
    })
  },
  getById(id) {
    return axios.post('/graphql', {
      query: `query {
        user(_id: "${id}") {
            _id
            username
            name
            email
            role {
              _id
              role
            }            
            created_at
          }
        }
      `
    })
  },
  add(user) {
    return axios.post('/graphql', {
      query: `mutation {
        addUser(
            name: "${user.name}",
            username: "${user.username}",
            password: "${user.password}",
            email: "${user.email}") {
                _id
                username
                name
                email
                role {
                  _id
                  role
                }                
                created_at 
          }
        }
      `
    })
  },
  update(user) {
    let pass = user.password ? user.password : ''
    return axios.post('/graphql', {
      query: `mutation {
        updateUser(
            _id: "${user._id}",
            name: "${user.name}",
            username: "${user.username}",                        
            email: "${user.email}",
            password: "${pass}") {
                _id
                username
                name
                email
                role {
                  _id
                  role
                }                
                created_at   
          }
        }
      `
    })
  },
  delete(args) {
    return axios.post('/graphql', {
      query: `mutation {
        deleteUser(_id: "${args._id}") {
            _id
            username            
          }
        }
      `
    })
  },
  sendFeedback(args) {
    return axios({
      method: 'post',
      url: '/feedback',
      data: args
    })
  }
}
