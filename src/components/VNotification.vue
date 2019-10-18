<template>
  <v-snackbar
    :timeout="5000"
    :bottom="true"
    :left="true"
    :color="color"
    v-model="snackbar"
    >{{ message }}</v-snackbar
  >
</template>

<script>
export default {
  data() {
    return {
      snackbar: false,
      message: '',
      color: 'error'
    }
  },
  mounted() {    
    this.$bus.$on('show-notification', args => {
      this.message = args.message
      this.color = args.color
      this.snackbar = true
    })    
  }
}
</script>
