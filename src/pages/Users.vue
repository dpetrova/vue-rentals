<template>
  <div class="mt-2 pa-5">
    <v-row justify="end">
      <v-col cols="12" sm="12" md="6">
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Search"
          single-line
          hide-details
          :clearable="true"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row no-gutters align="start" justify="center" class="mt-5">
      <v-col cols="12" sm="12">
        <v-data-table
          :headers="headers"
          :items="users"
          :items-per-page="10"
          :loading="loading"
          loading-text="Fetch data..."
          class="elevation-1 users"
          :search="search"
        >
          <template v-slot:item.created_at="{ item }">
            {{ item.created_at | dateTimeFormatter }}
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn icon class="mx-0" @click="view(item)">
              <v-icon color="accent">info</v-icon>
            </v-btn>
            <v-btn icon class="mx-0" @click="edit(item)">
              <v-icon color="accent">edit</v-icon>
            </v-btn>
            <v-btn icon class="mx-0" @click="remove(item)">
              <v-icon color="accent">delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { dateFilter } from '../mixins/date-filter'

export default {
  name: 'Users',
  computed: {
    ...mapState(['user']),
    users() {
      return this.$store.state.user.users
    },
    loading() {
      return this.$store.state.user.users.length == 0
    }
  },
  data() {
    return {
      headers: [
        {
          text: 'Name',
          value: 'name',
          align: 'start',
          sortable: true,
          width: '20%'
        },
        {
          text: 'Username',
          value: 'username',
          sortable: true,
          align: 'start',
          width: '20%'
        },
        {
          text: 'Email',
          value: 'email',
          sortable: false,
          align: 'start',
          width: '20%'
        },
        {
          text: 'Created At',
          value: 'created_at',
          sortable: true,
          align: 'start',
          width: '25%'
        },
        {
          text: '',
          value: 'actions',
          align: 'end'
        }
      ],
      search: ''
    }
  },
  created() {
    this.$store.dispatch('user/fetchAll')
  },
  methods: {
    view() {},
    edit() {},
    remove() {}
  },
  mixins: [dateFilter]
}
</script>

<style lang="scss">
.users .v-btn {
  padding: 0;
  color: #82b1ff;
}

.users {
  margin-bottom: 50px;
}

.v-list-item__title {
  text-align: start !important;
}

.user-dialog {
  overflow-x: hidden;
}
</style>
