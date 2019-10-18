<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogVisibilty" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ title }}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-container>
              <v-row>
                <v-col cols="12" sm="12">
                  <v-text-field
                    v-model="user.name"
                    :rules="nameRules('Name', 40)"
                    label="Name*"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12">
                  <v-text-field
                    v-model="user.username"
                    :rules="nameRules('Username', 20)"
                    label="Username*"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12">
                  <v-text-field
                    v-if="register"
                    v-model="user.password"
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
                  <v-text-field
                    v-model="user.email"
                    :rules="emailRules"
                    label="Email"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-row justify="end" class="pr-7">
            <v-btn color="accent" text @click="close()">Close</v-btn>
            <v-btn color="accent" text @click="submit(user)" :disabled="!valid"
              >Submit</v-btn
            >
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
export default {
  name: 'UserForm',
  props: {
    user: Object,
    title: String,
    dialogVisibilty: Boolean,
    register: Boolean
  },
  computed: {
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
      valid: true,
      passRules: [
        v => !!v || 'Password is required',
        v => (v && v.length >= 2) || 'Password must be at least 2 characters'
      ],
      passVisibility: true
    }
  },
  methods: {
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
    submit(user) {
      this.$emit('submit', user)
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>
