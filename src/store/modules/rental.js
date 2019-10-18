import { RentalService } from '@/services/rental-service'
import axios from '@/axios'
import bus from '@/bus'

export default {
  namespaced: true, //namespace module (to avoid naming collisions)
  state: {
    rentals: [],
    myRentals: [],
    rental: {
      _id: '',
      title: '',
      owner: null,
      city: '',
      category: null,
      image: '',
      bedrooms: 1,
      description: '',
      gps: null
    },
    rentalCategories: []
  },
  mutations: {
    CONCAT_RENTALS(state, items) {
      // state.rentals = state.rentals.concat(items)
      // state.rentals = state.rentals.filter(
      //   (e, i) => state.rentals.findIndex(a => a._id === e._id) === i
      // )
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (!state.rentals.find(x => x._id === item._id)) {
          state.rentals.push(item)
        }
      }
    },
    ADD_RENTAL(state, item) {
      state.rentals.unshift(item)
      state.myRentals.unshift(item)
    },
    SET_RENTALS(state, items) {
      state.rentals = items
    },
    SET_MY_RENTALS(state, items) {
      state.myRentals = items
    },
    SET_RENTAL(state, item) {
      state.rental = item
    },
    UNSET_RENTAL(state) {
      state.rental = {
        _id: '',
        title: '',
        owner: null,
        city: '',
        category: null,
        image: '',
        bedrooms: 1,
        description: '',
        gps: null
      }
    },
    UPDATE_RENTAL(state, item) {
      if (state.myRentals.find(x => x._id === item._id)) {
        Object.assign(
          state.myRentals[state.myRentals.findIndex(x => x._id === item._id)],
          item
        )
      }
      if (state.rentals.find(x => x._id === item._id)) {
        Object.assign(
          state.rentals[state.rentals.findIndex(x => x._id === item._id)],
          item
        )
      }
      state.rental = item
    },
    DELETE_RENTAL(state, item) {
      state.rentals.splice(state.rentals.findIndex(x => x._id === item._id), 1)
      state.myRentals.splice(
        state.myRentals.findIndex(x => x._id === item._id),
        1
      )
    },
    SET_RENTAL_CATEGORIES(state, items) {
      state.rentalCategories = items
    }
  },
  actions: {
    fetchAll({ commit }) {
      return RentalService.getAll()
        .then(res => {
          commit('SET_RENTALS', res.data.data.rentals)
          commit('SET_RENTAL_CATEGORIES', res.data.data.categories)
        })
        .catch(error => {
          bus.$emit('show-notification', {
            message: error.message,
            color: 'error'
          })
        })
    },
    fetchPaginated({ commit, state }, query) {
      return RentalService.getPaginated(query)
        .then(res => {
          if (query.resetMode) {
            commit('SET_RENTALS', res.data.data.rentalsPaginated.rentals)
          } else {
            commit('CONCAT_RENTALS', res.data.data.rentalsPaginated.rentals)
          }
          commit('SET_TOTAL_ITEMS', res.data.data.rentalsPaginated.count, {
            root: true
          })
        })
        .catch(error => {
          bus.$emit('show-notification', {
            message: error.message,
            color: 'error'
          })
        })
    },
    fetchById({ commit }, id) {
      return RentalService.getById(id).then(res => {
        if (res.data.data.rental) {
          //success
          commit('SET_RENTAL', res.data.data.rental)
        } else {
          //error
          bus.$emit('show-notification', {
            message: res.data.errors[0].message,
            color: 'error'
          })
        }
      })
    },
    fetchByOwner({ commit, rootState }) {
      if (!rootState.user.user) return
      const currentlyLogged = rootState.user.user._id
      return RentalService.getByOwner(currentlyLogged).then(res => {
        if (res.data.data.rentalsByOwner) {
          //success
          commit('SET_MY_RENTALS', res.data.data.rentalsByOwner)
          commit('SET_RENTAL_CATEGORIES', res.data.data.categories)
        } else {
          //error
          bus.$emit('show-notification', {
            message: res.data.errors[0].message,
            color: 'error'
          })
        }
      })
    },
    fetchByCategory({ commit }, id) {
      return RentalService.getByCategory(id).then(res => {
        if (res.data.data.rentalsByCategory) {
          //success
          commit('SET_RENTALS', res.data.data.rentalsByCategory)
        } else {
          //error
          bus.$emit('show-notification', {
            message: res.data.errors[0].message,
            color: 'error'
          })
        }
      })
    },
    resetRental({ commit }) {
      commit('UNSET_RENTAL')
    },
    create({ commit, rootState, dispatch }, item) {
      if (!rootState.user.user) return
      const currentlyLogged = rootState.user.user._id
      item.owner = currentlyLogged
      return RentalService.add(item)
        .then(res => {
          if (res.data.data.addRental) {
            //success
            commit('ADD_RENTAL', res.data.data.addRental)
            bus.$emit('show-notification', {
              message: 'Rental has published',
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
    update({ commit, rootState }, item) {
      if (!rootState.user.user) return
      return RentalService.update(item)
        .then(res => {
          if (res.data.data.updateRental) {
            //success
            commit('UPDATE_RENTAL', res.data.data.updateRental)
            bus.$emit('show-notification', {
              message: 'Rental has been updated',
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
    delete({ commit, rootState }, args) {
      return RentalService.delete(args)
        .then(res => {
          if (res.data.data.deleteRental) {
            //success
            commit('DELETE_RENTAL', res.data.data.deleteRental)
            bus.$emit('show-notification', {
              message: 'Rental has been deleted',
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
    }
  }
}
