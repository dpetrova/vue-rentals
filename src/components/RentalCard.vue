<template>
  <v-card max-width="375" class="rental mx-auto">
    <v-img
      v-if="item.image"
      :src="require(`@/assets/${item.image}`)"
      height="250px"
      dark
    >
      <v-row class="fill-height">
        <v-card-title></v-card-title>
        <v-spacer></v-spacer>
        <v-card-title class="white--text mt-12" style="width:100%">
          <div
            class="display-1 mx-2 mt-12"
            style="word-break:normal; width:100%"
          >
            {{ item.title }}
          </div>
        </v-card-title>
      </v-row>
    </v-img>
    <v-list one-line>
      <v-list-item>
        <v-list-item-icon>
          <v-icon color="primary">location_city</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Type</v-list-item-title>
          <v-list-item-subtitle>
            {{ item.category.category }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-icon>
          <v-icon color="primary">room</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Location</v-list-item-title>
          <v-list-item-subtitle>{{ item.city }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" text @click="seeDetails">See details</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'RentalCard',
  props: ['item'],
  methods: {
    seeDetails() {
      this.$emit('seeDetails')
    }
  }
}
</script>

<style lang="scss">
.v-list-item__subtitle {
  text-align: start !important;
}
</style>
