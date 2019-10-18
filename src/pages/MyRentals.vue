<template>
  <v-container>
    <v-row justify="end">
      <v-col cols="12" sm="12" md="1">
        <v-btn color="primary" @click="add()">Add Item</v-btn>
      </v-col>
    </v-row>
    <v-row class="mb-6">
      <v-col v-for="item in rentals" :key="item._id" sm="12" md="6" lg="3">
        <rental-card :item="item" @seeDetails="edit(item._id)"></rental-card>
      </v-col>
    </v-row>
    <!-- modal dialog for add/edit -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-container>
              <v-row>
                <v-col cols="12" sm="12">
                  <v-select
                    v-model="rental.category"
                    :items="categories"
                    item-value="_id"
                    item-text="category"
                    :rules="[v => !!v || 'Category is required']"
                    label="Category*"
                    required
                    hide-details
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="12">
                  <v-text-field
                    v-model="rental.title"
                    :rules="[v => !!v || 'Title is required']"
                    label="Title*"
                    required
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12">
                  <v-text-field
                    v-model="rental.city"
                    :rules="[v => !!v || 'City is required']"
                    label="City*"
                    required
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12">
                  <v-text-field
                    v-model="rental.bedrooms"
                    type="number"
                    label="Bedrooms"
                    required
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12">
                  <v-textarea
                    v-model="rental.description"
                    label="Details"
                    hide-details
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-row justify="space-around" class="px-7">
            <v-btn v-if="editedIndex > 0" color="accent" text @click="remove"
              >Delete</v-btn
            >
            <v-spacer></v-spacer>
            <v-btn color="accent" text @click="close">Close</v-btn>
            <v-btn color="accent" text @click="submit" :disabled="!valid"
              >Save</v-btn
            >
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { dateFilter } from '../mixins/date-filter'
import RentalCard from '@/components/RentalCard'

export default {
  name: 'MyRentals',
  data: () => ({
    dialog: false,
    editedIndex: -1,
    valid: true
  }),
  computed: {
    rentals() {
      return this.$store.state.rental.myRentals
    },
    rental() {
      return this.$store.state.rental.rental
    },
    categories() {
      return this.$store.state.rental.rentalCategories
    },
    formTitle() {
      return this.editedIndex < 0 ? 'New Item' : 'Edit Item'
    }
  },
  async mounted() {
    await this.$store.dispatch('rental/fetchByOwner')
  },
  methods: {
    add() {
      this.editedIndex = -1
      this.dialog = true
    },
    async edit(id) {
      await this.$store.dispatch('rental/fetchById', id)
      this.editedIndex = 1
      this.dialog = true
    },
    close() {
      this.dialog = false
      setTimeout(() => {
        this.$refs.form.reset()
        this.$store.dispatch('rental/resetRental')
        this.editedIndex = -1
      }, 300)
    },
    async submit() {
      if (!this.$refs.form.validate()) return

      if (this.editedIndex < 0) {
        //---------------- Add --------------------
        try {
          await this.$store.dispatch('rental/create', this.rental)
          this.close()
        } catch (error) {
          console.log(error)
        }
      } else {
        //---------------- Update --------------------        
        if (this.rental.category._id) {
          this.rental.category = this.rental.category._id
        }
        try {
          await this.$store.dispatch('rental/update', this.rental)
          this.close()
        } catch (error) {
          console.log(error)
        }
      }
    },
    async remove() {
      try {
        await this.$store.dispatch('rental/delete', this.rental._id)
        this.close()
      } catch (error) {
        console.log(error)
      }
    }
  },
  mixins: [dateFilter],
  components: {
    'rental-card': RentalCard
  }
}
</script>
