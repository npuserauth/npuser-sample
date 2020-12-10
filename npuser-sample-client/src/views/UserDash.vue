<template lang="pug">
div
  p User dashboard
</template>

<script lang="ts">
import { ref, computed, watch } from 'vue'
export default {
  setup () {
    /* ---------------------------------------------------- */
    const count = ref(0)
    const countDouble = computed(() => count.value * 2)
    watch(count, newVal => {
      console.log('count changed', newVal)
    })
    const inc = () => {
      count.value += 1
    }
    const dec = () => {
      if (count.value !== 0) {
        count.value -= 1
      }
    }
    /* ---------------------------------------------------- */
    const msg = ref('some text')
    watch(msg, newVal => {
      console.log('msg changed', newVal)
    })
    const changeMessage = () => {
      msg.value = 'new Message'
    }
    /* ---------------------------------------------------- */
    return {
      count,
      inc,
      dec,
      countDouble,
      msg,
      changeMessage
    }
  }
}
</script>
