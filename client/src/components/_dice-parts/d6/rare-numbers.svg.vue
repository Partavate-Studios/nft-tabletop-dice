<script setup>
import RareOne from './numbers/rare/rare-one.svg.vue'
import RareTwo from './numbers/rare/rare-two.svg.vue'
import RareThree from './numbers/rare/rare-three.svg.vue'
import RareFour from './numbers/rare/rare-four.svg.vue'
import RareFive from './numbers/rare/rare-five.svg.vue'
import RareSix from './numbers/rare/rare-six.svg.vue'
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
      <radialGradient id="dotshade" cx="50%" cy="50%" r="50%" fx="40%" fy="70%">
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
      <rare-one v-if="value==1" />
      <rare-two v-if="value==2" />
      <rare-three v-if="value==3" />
      <rare-four v-if="value==4" />
      <rare-five v-if="value==5" />
      <rare-six v-if="value==6" />
    </g>
    <g fill="url('#dotshade')" stroke="#000000" stroke-opacity="0.3">
      <rare-one v-if="value==1" />
      <rare-two v-if="value==2" />
      <rare-three v-if="value==3" />
      <rare-four v-if="value==4" />
      <rare-five v-if="value==5" />
      <rare-six v-if="value==6" />
    </g>
  </g>
</template>

<style>
</style>
