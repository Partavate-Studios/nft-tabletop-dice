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
      <linearGradient id="dotshadow" gradientTransform="rotate(45)">
        <stop
          stop-color="#000000"
          stop-opacity="1"
          offset="0%"/>
        <stop
          stop-color="#e6e6e6"
          stop-opacity="0"
          offset="20%"/>
        <stop
          stop-color="#000000"
          stop-opacity="1"
          offset="100%"/>
      </linearGradient>
    </defs>
    <g fill="url('#dotshadow')" :stroke="none">
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
