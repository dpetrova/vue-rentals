import { UserService } from '@/services/user-service.js'
import axios from '@/axios'
import bus from '@/bus'

export default {
  namespaced: true, //namespace module (to avoid naming collisions)
  state: {
    users: [],
    user: null,
    editedUser: {
      _id: '',
      username: '',
      name: '',
      created_at: null,
      password: '',
      email: '',
      role: null
    },
    userRoles: []
  },
  mutations: {
    ADD_USER(state, user) {
      state.users.push(user)
    },
    SET_USERS(state, users) {
      state.users = users
    },
    SET_USER(state, user) {
      state.user = user
    },
    UNSET_USER(state) {
      state.user = null
    },
    SET_EDITED_USER(state, user) {
      state.editedUser = user
    },
    UNSET_EDITED_USER(state) {
      state.editedUser = {
        _id: '',
        username: '',
        name: '',
        created_at: null,
        password: '',
        email: '',
        role: null
      }
    },
    UPDATE_USER(state, user) {      
      if (state.users.length > 0) {
        Object.assign(
          state.users[state.users.findIndex(x => x._id === user._id)],
          user
        )
      }
      state.editedUser = user

      if (state.user._id === user._id) {
        state.user.username = user.username       
      }
    },
    DELETE_USER(state, user) {
      state.users.splice(state.users.findIndex(x => x._id === user._id), 1)
    },
    SET_USER_ROLES(state, roles) {
      state.userRoles = roles
    }
  },
  actions: {
    async login({ commit }, credentials) {
      let res = await UserService.authenticateUser(
        credentials.username,
        credentials.password
      )
      //success
      if (res.data.data.login) {
        commit('SET_USER', res.data.data.login.user)
        localStorage.setItem('app-user-id', res.data.data.login.user._id)
        localStorage.setItem('app-auth-token', res.data.data.login.token)
        axios.defaults.headers.common['Authorization'] =
          'Bearer ' + res.data.data.login.token

        bus.$emit('user-logged-in', {
          user: res.data.data.login.user
        })

        return res.data.data.login.user
      }
      //error
      else {
        bus.$emit('show-notification', {
          message: res.data.errors[0].message,
          color: 'error'
        })
        return null
      }
    },
    logout({ commit, dispatch }) {
      commit('UNSET_USER')
      localStorage.removeItem('app-auth-token')
      localStorage.removeItem('app-user-id')
      delete axios.defaults.headers.common['Authorization']

      bus.$emit('user-logged-out', {
        user: null
      })
    },
    fetchAll({ commit }) {
      return UserService.getAll()
        .then(res => {
          commit('SET_USERS', res.data.data.users)
          commit('SET_USER_ROLES', res.data.data.userRoles)
        })
        .catch(error => {
          bus.$emit('show-notification', {
            message: error.message,
            color: 'error'
          })
        })
    },
    fetchById({ commit }, id) {
      return UserService.getById(id).then(res => {
        if (res.data.data.user) {
          //success
          commit('SET_EDITED_USER', res.data.data.user)
        } else {
          //error
          bus.$emit('show-notification', {
            message: res.data.errors[0].message,
            color: 'error'
          })
        }
      })
    },
    resetEditedUser({ commit }) {
      commit('UNSET_EDITED_USER')
    },
    create({ commit, rootState, dispatch }, user) {
      return UserService.add(user)
        .then(res => {
          if (res.data.data.addUser) {
            //success
            commit('ADD_USER', res.data.data.addUser)
            bus.$emit('show-notification', {
              message: 'Registered successfully. Please Log In!',
              color: 'notes'
            })
          } else {
            //error
            bus.$emit('show-notification', {
              message: res.data.errors[0].message,
              color: 'error'
            })
          }
        })
        .catch(error => {
          bus.$emit('show-notification', {
            message: error.message,
            color: 'error'
          })
        })
    },
    update({ commit, rootState }, user) {
      return UserService.update(user)
        .then(res => {          
          if (res.data.data.updateUser) {
            //success
            commit('UPDATE_USER', res.data.data.updateUser)
            bus.$emit('show-notification', {
              message: 'Your credentials have been updated!',
              color: 'notes'
            })
          } else {
            //error
            bus.$emit('show-notification', {
              message: res.data.errors[0].message,
              color: 'error'
            })
          }
        })
        .catch(error => {
          bus.$emit('show-notification', {
            message: error.message,
            color: 'error'
          })
        })
    },
    delete({ commit, rootState }, args) {
      return UserService.delete(args)
        .then(res => {
          if (res.data.data.deleteUser) {
            //success
            commit('DELETE_USER', res.data.data.deleteUser)
            bus.$emit('show-notification', {
              message: 'User has been deleted!',
              color: 'accent'
            })
          } else {
            //error
            bus.$emit('show-notification', {
              message: res.data.errors[0].message,
              color: 'error'
            })
          }
        })
        .catch(error => {
          bus.$emit('show-notification', {
            message: error.message,
            color: 'error'
          })
        })
    },
    async feedback({ commit, rootState }, args) {
      return UserService.sendFeedback(args)
        .then(res => {
          if (res.data.result.messageId) {
            bus.$emit('show-notification', {
              message: `Message has sent successfully`,
              color: 'primary'
            })
            return true
          } else {
            bus.$emit('show-notification', {
              message: 'Something wrong happened',
              color: 'error'
            })
          }
        })
        .catch(error => {
          bus.$emit('show-notification', {
            message: error.message,
            color: 'error'
          })
        })
    }
  }
}
