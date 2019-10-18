<template>
  <v-container>
    <v-row justify="end">
      <v-col cols="12" sm="12" md="6">
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Search"
          single-line
          hide-details
          :clearable="true"
          @click:clear="clearSearch"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row class="mb-6">
      <v-col v-for="item in rentals" :key="item._id" sm="12" md="6" lg="3">
        <rental-card :item="item" @seeDetails="openDetails(item._id)"></rental-card>
      </v-col>
    </v-row>
    <!-- scroll loader -->
    <scroll-loader :loader-method="getItems" :loader-enable="scrollLoader.loadMore"></scroll-loader>
    <!-- details dialog -->
    <v-dialog v-model="dialog" width="50%">
      <v-card max-width="100%" class="rental mx-auto">
        <v-img v-if="rental.image" :src="require(`@/assets/${rental.image}`)" height="250px" dark>
          <v-row class="fill-height">
            <v-card-title></v-card-title>
            <v-spacer></v-spacer>
            <v-card-title class="white--text mt-12" style="width:100%">
              <div
                class="display-1 mx-2 mt-12"
                style="word-break:normal; width:100%"
              >{{ rental.title }}</div>
              <div class="subtitle-1 mx-2" style="word-break:normal; width:100%">{{ rental.city }}</div>
            </v-card-title>
          </v-row>
        </v-img>
        <v-card-text class="text-justify mt-3">
          <section>
            <div class="font-weight-bold">Bedrooms:</div>
            <p>{{ rental.bedrooms }}</p>
          </section>
          <section>
            <div class="font-weight-bold">Details:</div>
            <p>{{ rental.description }}</p>
          </section>
          <section v-if="rental.owner">
            <div class="font-weight-bold">Owner:</div>
            <p>{{ rental.owner.name }}</p>
          </section>
          <section>
            <div class="font-weight-bold">Published:</div>
            <p>{{ rental.published | dateTimeFormatter }}</p>
          </section>
        </v-card-text>
        <v-divider></v-divider>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { dateFilter } from '../mixins/date-filter'
import RentalCard from '@/components/RentalCard'

export default {
  name: 'Rentals',
  data: () => ({
    search: '',
    dialog: false
  }),
  computed: {
    rentals() {
      return this.$store.state.rental.rentals
    },
    rental() {
      return this.$store.state.rental.rental
    },
    categories() {
      return this.$store.state.rental.rentalCategories
    },
    scrollLoader: {
      get: function() {
        return this.$store.state.scrollLoader
      },
      set: function(value) {
        this.$store.commit('SET_SCROLL_LOADER', value)
      }
    },
    params() {
      return {
        ...this.scrollLoader,
        search: this.search
      }
    }
  },
  async mounted() {
    this.getItems()
  },
  methods: {
    async getItems() {
      this.scrollLoader.page++
      await this.$store.dispatch('rental/fetchPaginated', this.params)
    },
    clearSearch() {
      this.$nextTick(() => {
        this.search = ''
      })
    },
    async openDetails(itemId) {
      await this.$store.dispatch('rental/fetchById', itemId)
      this.dialog = true
    }
  },
  watch: {
    search: {
      async handler() {
        this.scrollLoader.page = 0
        this.scrollLoader.resetMode = true
        this.scrollLoader.loadMore = true
        this.$store.commit('SET_SCROLL_LOADER_STATUS', true, { root: true })
        await this.getItems()
        delete this.scrollLoader.resetMode
      },
      deep: true
    }
  },
  mixins: [dateFilter],
  components: {
    'rental-card': RentalCard
  }
}
</script>

<style lang="scss">
.v-list-item__subtitle {
  text-align: start !important;
}
</style>
