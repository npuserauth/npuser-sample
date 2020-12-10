<template lang="pug">
div(class="form-container")
  div(class="form-group")
    label(for="vcode") Verification Code
    input(type="text", v-model="vcode", id="vcode", name="vcode", :class="{ invalid: !isValid }")
  div(class="button-group")
    button(v-on:click="$emit('vcode', vcode)", title="Submit", :disabled="!isValid") Submit
    button(v-on:click="$emit('cancel')", title="Cancel") Cancel
</template>

<script>

export default {
  data () {
    return {
      vcode: ''
    }
  },
  computed: {
    isValid () {
      /* 5 digits */
      const re = /^\d{5,}$/
      return re.test(String(this.vcode))
    }
  }
}
</script>

