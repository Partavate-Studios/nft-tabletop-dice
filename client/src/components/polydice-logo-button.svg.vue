<script setup>
import PolydiceLogo from './polydice-logo.svg.vue'
</script>
<script>
export default {
  data() {
    return {
      hover: false
    }
  },
  computed: {
    opacity() {
      if (this.hover) {
        return 0.75
      }
      return 0.2
    },
  }
}
</script>

<template>
  <g>
    <polydice-logo :opacity="opacity" />
    <rect x="-90" y="-48" width="180" height="105" fill-opacity="0" stroke-opacity="0" class="can-click"  @mouseover="hover = true" @mouseleave="hover = false" />
  </g>
</template>

<style>
</style>
