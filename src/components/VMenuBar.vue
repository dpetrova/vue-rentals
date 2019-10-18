<template>
  <v-app-bar color="secondary" fixed class="d-none d-md-block">
    <router-link to="/">
      <v-toolbar-title
        class="display-1 font-italic font-weight-bold white--text mx-5"
        >SuperRentals &nbsp;</v-toolbar-title
      >
    </router-link>
    <v-btn
      v-show="autheticated"
      text
      :to="{ name: 'my-rentals' }"
      class="white--text"
      >My Rentals</v-btn
    >
    <v-btn text :to="{ name: 'about' }" class="white--text">About</v-btn>
    <v-btn text :to="{ name: 'contacts' }" class="white--text">Contacts</v-btn>

    <div class="flex-grow-1"></div>

    <v-btn
      v-show="autheticated"
      text
      :to="{ name: 'settings' }"
      class="white--text"
      >Settings</v-btn
    >
    <v-btn
      v-show="authorizedAdmin"
      text
      :to="{ name: 'users' }"
      class="white--text"
      >Users</v-btn
    >
    <v-btn
      text
      v-show="!this.$store.state.user.user && this.$route.name !== 'login'"
      :to="{ name: 'login' }"
      class="white--text"
      >Log In</v-btn
    >
    <v-btn
      text
      v-show="this.$store.state.user.user"
      @click="logout"
      class="white--text"
      >Logout, {{ userName }}</v-btn
    >
  </v-app-bar>
</template>

<script>
import { mapState } from 'vuex'
import { Auth } from '../../auth/utils-ui'

export default {
  name: 'VMenuBar',
  data() {
    return {
      autheticated: false,
      authorizedAdmin: false
    }
  },
  computed: {
    ...mapState(['user']),
    userName() {
      if (!this.$store.state.user.user) return ''
      return this.$store.state.user.user.username
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('user/logout')
      this.$store.dispatch('resetBeforeRoute')
      this.$router.push({
        name: 'rentals'
      })
    },
    async checkAuth() {
      this.autheticated = await Auth.isAuthenticated()
      this.authorizedAdmin = await Auth.isAuthorized('users')
    }
  },
  mounted() {
    this.checkAuth()
    this.$bus.$on('user-logged-in', () => {
      this.checkAuth()
    })

    this.$bus.$on('user-logged-out', () => {
      this.checkAuth()
    })
  },
  watch: {
    async $route(to, from) {      
      this.checkAuth()
    }
  }
}
</script>

<style lang="scss" scoped>
.v-toolbar__content ::v-deep .router-link-active {
  text-decoration: none !important;
}

.v-application ::v-deep a {
  text-decoration: none !important;
}
</style>
