import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'

//modules
import user from '@/store/modules/user.js'
import rental from '@/store/modules/rental.js'

Vue.use(Vuex)

const vuexLocalStorage = new VuexPersist({
  key: 'vue-rentals',
  storage: window.localStorage,
  reducer: state => ({
    user: state.user
  })
})

export default new Vuex.Store({
  plugins: [vuexLocalStorage.plugin],
  modules: {
    user,
    rental
  },
  state: {
    beforeRoute: '',
    pagination: {
      descending: true,
      page: 1,
      rowsPerPage: 10,
      sortBy: 'name',
      totalItems: 0,
      rowsPerPageItems: [10, 50, 100]
    },
    scrollLoader: {
      loadMore: true,
      page: 0,
      pageSize: 12,
      totalItems: 0
    }
  },
  mutations: {
    SET_BEFOREROUTE(state, value) {
      state.beforeRoute = value
    },
    RESET_BEFOREROUTE(state) {
      state.beforeRoute = ''
    },
    SET_PAGINATION(state, payload) {
      state.pagination = payload
    },
    SET_SCROLL_LOADER(state, payload) {
      state.scrollLoader = payload
    },
    SET_SCROLL_LOADER_STATUS(state, status) {
      state.scrollLoader.loadMore = status
    },
    SET_TOTAL_ITEMS(state, count) {
      state.scrollLoader.totalItems = count
      if (
        state.scrollLoader.page * state.scrollLoader.pageSize >=
        state.scrollLoader.totalItems
      ) {
        state.scrollLoader.loadMore = false
      } else {
        state.scrollLoader.loadMore = true
      }
    }
  },
  actions: {
    setBeforeRoute({ state, commit }, route) {
      if (state.user) {
        commit('SET_BEFOREROUTE', route)
      }
    },
    resetBeforeRoute({ commit }) {
      commit('RESET_BEFOREROUTE')
    },
    setTotalItems({ state, commit }, totalItems) {
      Vue.set(state.pagination, 'totalItems', totalItems)
      Vue.set(state.scrollLoader, 'totalItems', totalItems)
    }
  },
  getters: {
    pagination(state) {
      return state.pagination
    },
    scrollLoader(state) {
      return state.scrollLoader
    }
  }
})
