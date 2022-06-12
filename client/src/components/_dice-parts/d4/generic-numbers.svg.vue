<script setup>
import GenericOne from './numbers/generic/generic-one.svg.vue'
import GenericTwo from './numbers/generic/generic-two.svg.vue'
import GenericThree from './numbers/generic/generic-three.svg.vue'
import GenericFour from './numbers/generic/generic-four.svg.vue'
</script>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: 1
    },
    fontColor: {
      type: String,
      default: '#ffffff'
    }
  },
  data () {
    return {
    }
  },
  computed: {
  }
}
</script>

<template>
  <g>
    <g :fill="fontColor" :stroke="fontColor" stroke-opacity="0.25">
      <g v-if="value==1">
        <generic-four transform="translate(-12 -4) rotate(120) scale(0.5)" />
        <generic-two transform="translate(12 -4) rotate(-120) scale(0.5)" />
        <generic-one transform="translate(0 25) scale(1)" />
      </g>
      <g v-if="value==2">
        <generic-one transform="translate(-12 -4) rotate(120) scale(0.5)" />
        <generic-three transform="translate(12 -4) rotate(-120) scale(0.5)" />
        <generic-two transform="translate(0 25) scale(1)" />
      </g>
      <g v-if="value==3">
        <generic-two transform="translate(-12 -4) rotate(120) scale(0.5)" />
        <generic-four transform="translate(12 -4) rotate(-120) scale(0.5)" />
        <generic-three transform="translate(0 25) scale(1)" />
      </g>
      <g v-if="value==4">
        <generic-three transform="translate(-12 -4) rotate(120) scale(0.5)" />
        <generic-one transform="translate(12 -4) rotate(-120) scale(0.5)" />
        <generic-four transform="translate(0 25) scale(1)" />
      </g>
    </g>

  </g>
</template>

<style>
</style>
