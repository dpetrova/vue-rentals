<template>
  <v-app id="app">
    <app-menu-bar />
    <v-content class="pa-10">
      <v-container fluid style="min-height:85vh">
        <router-view></router-view>
      </v-container>
    </v-content>
    <app-footer></app-footer>
    <app-notification />
  </v-app>
</template>

<script>
import VMenuBar from '@/components/VMenuBar.vue'
import VAppFooter from '@/components/VAppFooter.vue'

export default {
  name: 'App',
  components: {
    'app-menu-bar': VMenuBar,
    'app-footer': VAppFooter
  },
  computed: {
    user() {
      return this.$store.state.user.user
    }
  },
  created() {
    this.$vuetify.theme.light = true
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: white;
}

html,
body {
  overflow-x: hidden;
  overflow-y: auto;
}

.v-data-table td,
.v-data-table th {
  font-size: 20px;
}
</style>
