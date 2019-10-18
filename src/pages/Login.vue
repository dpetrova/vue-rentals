<template>
  <v-container fluid fill-height style="height:90vh">
    <v-row no-gutters align="center" justify="center">
      <v-col cols="12" xs="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Log In</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-form @submit.prevent="login($event)" method="post" ref="loginForm">
            <v-card-text>
              <v-text-field
                prepend-icon="person"
                name="username"
                label="Login"
                type="text"
                v-model="username"
              ></v-text-field>
              <v-text-field
                prepend-icon="lock"
                name="password"
                label="Password"
                v-model="pass"
                :append-icon="passVisibility ? 'visibility' : 'visibility_off'"
                @click:append="() => (passVisibility = !passVisibility)"
                :type="passVisibility ? 'password' : 'text'"
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-btn text color="primary" @click="dialog = true">Register</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="primary" type="submit">Log In</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
    <!-- modal dialog for regisister -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Register</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="registerForm" v-model="valid" lazy-validation>
            <v-container>
              <v-row>
                <v-col cols="12" sm="12">
                  <v-text-field
                    v-model="targetUser.name"
                    :rules="nameRules('Name', 40)"
                    label="Name*"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12">
                  <v-text-field
                    v-model="targetUser.username"
                    :rules="nameRules('Username', 20)"
                    label="Username*"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12">
                  <v-text-field
                    v-model="targetUser.password"
                    :rules="passRules"
                    :append-icon="
                      passVisibility ? 'visibility' : 'visibility_off'
                    "
                    :append-icon-cb="() => (passVisibility = !passVisibility)"
                    :type="passVisibility ? 'password' : 'text'"
                    label="Password*"
                    hint="At least 2 characters"
                    min="2"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12">
                  <v-text-field v-model="targetUser.email" :rules="emailRules" label="Email"></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-row justify="end" class="pr-7">
            <v-btn color="accent" text @click="close()">Close</v-btn>
            <v-btn color="accent" text @click="register()" :disabled="!valid">Submit</v-btn>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Login',
  computed: {
    ...mapState(['user']),
    targetUser() {
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
  data() {
    return {
      username: '',
      pass: '',
      passVisibility: true,
      dialog: false,
      valid: true,
      passRules: [
        v => !!v || 'Password is required',
        v => (v && v.length >= 2) || 'Password must be at least 2 characters'
      ]
    }
  },
  methods: {
    login: async function(e) {
      var form = e.target
      var formData = new FormData(form)
      var credentials = {}
      for (var pair of formData.entries()) {
        credentials[pair[0]] = pair[1]
      }
      let result = await this.$store.dispatch('user/login', credentials) //return true/false
      if (result) {
        this.clear(form)
        this.$router.push({ name: 'rentals' })
      } else {
        this.pass = ''
      }
    },
    async register() {
      if (!this.$refs.registerForm.validate()) return
      try {
        await this.$store.dispatch('user/create', this.targetUser)
        this.close()
      } catch (error) {
        console.log(error)
      }
    },
    clear(form) {
      if (form) form.reset()
      this.$refs.loginForm.reset()
    },
    nameRules(field, characters) {
      const noWhitespacePattern = /^\S*$/
      return [
        v => !!v || `${field} is required`,
        v =>
          (v && v.length <= characters) ||
          `${field} must be less than ${characters} characters`,
        field === 'Username'
          ? v => noWhitespacePattern.test(v) || 'Invalid username'
          : true
      ]
    },
    close() {
      this.dialog = false
      setTimeout(() => {
        this.$refs.registerForm.reset()
        this.$store.dispatch('user/resetEditedUser')
      }, 300)
    }
  },
  components: {}
}
</script>
