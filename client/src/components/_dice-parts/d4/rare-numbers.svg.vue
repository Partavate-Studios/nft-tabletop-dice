<script setup>
import RareOne from './numbers/rare/rare-one.svg.vue'
import RareTwo from './numbers/rare/rare-two.svg.vue'
import RareThree from './numbers/rare/rare-three.svg.vue'
import RareFour from './numbers/rare/rare-four.svg.vue'
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
        <rare-four transform="translate(-8 0) rotate(120) scale(0.65)" />
        <rare-two transform="translate(8 0) rotate(-120) scale(0.65)" />
        <rare-one transform="translate(0 8) scale(1.35)" />
      </g>
      <g v-if="value==2">
        <rare-one transform="translate(-8 0) rotate(120) scale(0.65)" />
        <rare-three transform="translate(8 0) rotate(-120) scale(0.65)" />
        <rare-two transform="translate(0 8) scale(1.35)" />
      </g>
      <g v-if="value==3">
        <rare-two transform="translate(-8 0) rotate(120) scale(0.65)" />
        <rare-four transform="translate(8 0) rotate(-120) scale(0.65)" />
        <rare-three transform="translate(0 8) scale(1.35)" />
      </g>
      <g v-if="value==4">
        <rare-three transform="translate(-8 0) rotate(120) scale(0.65)" />
        <rare-one transform="translate(8 0) rotate(-120) scale(0.65)" />
        <rare-four transform="translate(0 8) scale(1.35)" />
      </g>
    </g>
  </g>
</template>

<style>
</style>
