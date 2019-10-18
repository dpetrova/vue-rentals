<template>
  <v-navigation-drawer :app="true" :expand-on-hover="true" class="d-lg-none">
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="headline">SuperRentals</v-list-item-title>
        <v-list-item-subtitle>Find your house</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <v-list dense nav>
      <v-list-item link>
        <v-list-item-content>
          <v-list-item-title>
            <v-btn text :to="{ name: 'rentals' }">Rentals</v-btn>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item link>
        <v-list-item-content>
          <v-list-item-title>
            <v-btn text :to="{ name: 'about' }">About</v-btn>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item link>
        <v-list-item-content>
          <v-list-item-title>
            <v-btn text :to="{ name: 'contacts' }">Contacts</v-btn>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item link>
        <v-list-item-content>
          <v-list-item-title>
            <v-btn text v-show="autheticated" :to="{ name: 'settings' }">Settings</v-btn>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item link>
        <v-list-item-content>
          <v-list-item-title>
            <v-btn text v-show="authorizedAdmin" :to="{ name: 'users' }">Users</v-btn>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item link>
        <v-list-item-content>
          <v-list-item-title>
            <v-btn
              text
              v-show="
                !this.$store.state.user.user && this.$route.name !== 'login'
              "
              :to="{ name: 'login' }"
            >Log In</v-btn>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item link>
        <v-list-item-content>
          <v-list-item-title>
            <v-btn text v-show="this.$store.state.user.user" @click="logout">Logout, {{ userName }}</v-btn>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapState } from 'vuex'
import { Auth } from '../../auth/utils-ui'

export default {
  name: 'VMenuBar',
  computed: {
    userName() {
      if (!this.$store.state.user.user) return ''
      return this.$store.state.user.user.username
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('user/logout')
      this.$store.dispatch('resetBeforeRoute')
    },
    async checkAuth() {
      this.autheticated = await Auth.isAuthenticated()
      this.authorizedAdmin = await Auth.isAuthorized('users')
    }
  },
  mounted() {
    this.checkAuth()
    this.$bus.$on('user-logged-in', args => {
      this.checkAuth()
    })

    this.$bus.$on('user-logged-out', args => {
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

<style lang="scss"></style>
