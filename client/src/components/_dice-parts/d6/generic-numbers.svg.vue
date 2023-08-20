<script setup>
import GenericOne from './numbers/generic/generic-one.svg.vue'
import GenericTwo from './numbers/generic/generic-two.svg.vue'
import GenericThree from './numbers/generic/generic-three.svg.vue'
import GenericFour from './numbers/generic/generic-four.svg.vue'
import GenericFive from './numbers/generic/generic-five.svg.vue'
import GenericSix from './numbers/generic/generic-six.svg.vue'
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
    <defs>
      <radialGradient id="dotshade" cx="50%" cy="50%" r="50%" fx="45%" fy="60%">
        <stop
          stop-color="#000000"
          stop-opacity="0"
          offset="0%"/>
        <stop
          stop-color="#000000"
          stop-opacity="0"
          offset="40%"/>
        <stop
          stop-color="#000000"
          stop-opacity="0.5"
          offset="110%"/>
      </radialGradient>
    </defs>
    <g :fill="fontColor" :stroke="fontColor" stroke-opacity="0.25">
      <generic-one v-if="value==1" />
      <generic-two v-if="value==2" />
      <generic-three v-if="value==3" />
      <generic-four v-if="value==4" />
      <generic-five v-if="value==5" />
      <generic-six v-if="value==6" />
    </g>
    <g fill="url('#dotshade')" stroke="#000000" stroke-opacity="0.3">
      <generic-one v-if="value==1" />
      <generic-two v-if="value==2" />
      <generic-three v-if="value==3" />
      <generic-four v-if="value==4" />
      <generic-five v-if="value==5" />
      <generic-six v-if="value==6" />
    </g>
  </g>
</template>

<style>
</style>
