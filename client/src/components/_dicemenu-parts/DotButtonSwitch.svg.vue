<script>
export default {
  data() {
    return {
      hover: false
    }
  },
  computed: {
    fillColor() {
      if (this.hover) {
        return "#660000"
      }
      return "#440000"
    },
  }
}
</script>

<template>
  <g @mouseover="hover = true" @mouseleave="hover = false"  >
    <circle cx="-0" cy="0" r="20" :fill="fillColor" stroke="#880000" stroke-width="3" />
    <line x1="-10" y1="-10" y2= "10" x2="10" stroke="#ffffff" stroke-width="3"  />
    <line x1= "10" y1="-10" y2="10" x2="-10" stroke="#ffffff" stroke-width="3"  />
    <circle cx="-0" cy="0" r="35" opacity="0" class="can-click" />
  </g>
</template>

<style>
</style>
