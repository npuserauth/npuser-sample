<template lang="pug">
transition(name="modal")
  div(class="modal-mask", v-show="loading")
    div(class="modal-wrapper")
      div(class="modal-container is-centered")
        spinner(:speed="1.0", :depth="20", :size="100")
</template>

<script>
import Spinner from 'vue-spinner-component/src/Spinner.vue'
import State from '../state'

export default {
  name: 'UiSpinner',
  computed: {
    loading () {
      return State.getLoading()
    }
  },
  components: {
    Spinner
  }
}
</script>

<style lang="scss" scoped>
.modal-mask {
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
.modal-container {
  margin-left: auto;
  margin-right: auto;
  width: 120px;
  height: 120px;
  padding: 10px;
  border-radius: 60px;
  /*background-color: lightgrey;*/
}

</style>
