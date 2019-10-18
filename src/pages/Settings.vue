<template>
  <v-container fluid fill-height style="height:90vh">
    <v-row no-gutters align="center" justify="center">
      <v-col cols="12" xs="12" sm="8" md="4">
        <v-card class="elevation-12" v-if="user">
          <v-toolbar dark color="primary">
            <v-toolbar-title>User Settings</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-form @submit.prevent="save($event)" method="post" ref="loginForm">
            <v-card-text>
              <v-text-field
                name="name"
                label="Name"
                type="text"
                v-model="user.name"
              ></v-text-field>
              <v-text-field
                name="username"
                label="Username"
                type="text"
                v-model="user.username"
              ></v-text-field>
              <v-text-field
                name="password"
                label="Password"
                v-model="user.password"
                :append-icon="passVisibility ? 'visibility' : 'visibility_off'"
                @click:append="() => (passVisibility = !passVisibility)"
                :type="passVisibility ? 'password' : 'text'"
                hint="At least 2 characters"
                min="2"
              ></v-text-field>
              <v-text-field
                v-model="user.email"
                :rules="emailRules"
                label="Email"
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <div class="spacer"></div>
              <v-btn color="primary" type="submit">Save</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Settings',
  data() {
    return {
      passVisibility: true
    }
  },
  computed: {
    ...mapState(['user']),
    user() {
      return this.$store.state.user.editedUser
    },
    emailRules() {
      if (
        this.user.email != '' &&
        this.user.email != undefined &&
        this.user.email != null
      ) {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return [v => pattern.test(v) || 'Invalid email']
      } else {
        return []
      }
    }
  },
  methods: {
    save: async function(e) {
      var form = e.target
      var formData = new FormData(form)
      var credentials = {}
      for (var pair of formData.entries()) {
        if (pair[1] != '') credentials[pair[0]] = pair[1]
      }
      if (credentials == {}) return

      //get only _id of role
      if (this.user.role._id) {
        this.user.role = this.user.role._id
      }

      await this.$store.dispatch('user/update', {
        ...this.user,
        ...credentials
      })
    },
    clear(form) {
      if (form) form.reset()
      this.$refs.loginForm.reset()
    }
  },
  created() {
    this.$store.dispatch('user/fetchById', this.$store.state.user.user._id)
  }
}
</script>
