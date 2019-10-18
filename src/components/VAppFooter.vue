<template>
  <v-footer fixed class="font-weight-medium">
    <v-col class="text-left" cols="12" sm="6"></v-col>
    <v-col class="text-right" cols="12" sm="6">
      <strong>© SuperRentals</strong>
      -
      {{ new Date().getFullYear() }}
    </v-col>
  </v-footer>
</template>

<script>
export default {
  name: 'VAppFooter',
  data() {
    return {}
  },
  methods: {}
}
</script>

<style lang="scss">
#app ::v-deep .v-footer {
  background-color: rgb(138, 133, 133);
}

#app ::v-deep .v-toolbar__title {
  color: white;
}
</style>
