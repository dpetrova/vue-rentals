<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogVisibilty" persistent max-width="400">
      <v-card>
        <v-card-title :class="dialogType">
          <slot name="title"></slot>
        </v-card-title>
        <v-card-text>
          <slot name="text"></slot>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="confirmCancel">
            <slot name="cancelButton"></slot>
          </v-btn>
          <v-btn :color="dialogType" text @click="confirmAccept">
            <slot name="confirmButton"></slot>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
export default {
  name: 'ConfirmDialog',
  props: ['dialogType', 'dialogVisibilty'],
  methods: {
    confirmCancel() {
      this.$emit('confirmCancel')
    },
    confirmAccept() {
      this.$emit('confirmAccept')
    }
  }
}
</script>
