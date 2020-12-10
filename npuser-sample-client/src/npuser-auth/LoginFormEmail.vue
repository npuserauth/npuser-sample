<template lang="pug">
div(class="form-container")
  div(class="form-group")
    label(for="email") Email
    input(type="email", v-model="email", id="email", name="email", :class="{ invalid: !isValid }")
  div(class="button-group")
    button(v-on:click="$emit('email', email)", title="Submit", :disabled="!isValid") Submit
</template>

<script>
export default {
  components: {
  },
  data () {
    return {
      email: ''
    }
  },
  computed: {
    isValid () {
      /* The goal is to just do a  cursory test to prevent obvious errors. Don't get fancy here... */
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return re.test(String(this.email).toLowerCase())
    }
  }
}
</script>
