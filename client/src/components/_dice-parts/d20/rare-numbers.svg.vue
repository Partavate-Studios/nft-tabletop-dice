<script setup>
import PixelOne from './numbers/pixel/pixel-one.svg.vue'
import PixelTwo from './numbers/pixel/pixel-two.svg.vue'
import PixelThree from './numbers/pixel/pixel-three.svg.vue'
import PixelFour from './numbers/pixel/pixel-four.svg.vue'
import PixelFive from './numbers/pixel/pixel-five.svg.vue'
import PixelSix from './numbers/pixel/pixel-six.svg.vue'
import PixelSeven from './numbers/pixel/pixel-seven.svg.vue'
import PixelEight from './numbers/pixel/pixel-eight.svg.vue'
import PixelNine from './numbers/pixel/pixel-nine.svg.vue'
import PixelTen from './numbers/pixel/pixel-ten.svg.vue'
import PixelEleven from './numbers/pixel/pixel-eleven.svg.vue'
import PixelTwelve from './numbers/pixel/pixel-twelve.svg.vue'
import PixelThirteen from './numbers/pixel/pixel-thirteen.svg.vue'
import PixelFourteen from './numbers/pixel/pixel-fourteen.svg.vue'
import PixelFifteen from './numbers/pixel/pixel-fifteen.svg.vue'
import PixelSixteen from './numbers/pixel/pixel-sixteen.svg.vue'
import PixelSeventeen from './numbers/pixel/pixel-seventeen.svg.vue'
import PixelEighteen from './numbers/pixel/pixel-eighteen.svg.vue'
import PixelNineteen from './numbers/pixel/pixel-nineteen.svg.vue'
import PixelTwenty from './numbers/pixel/pixel-twenty.svg.vue'
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
  <g :fill="fontColor" :stroke="fontColor" stroke-opacity="0.25">
    <pixel-one v-if="value==1" />
    <pixel-two v-if="value==2" />
    <pixel-three v-if="value==3" />
    <pixel-four v-if="value==4" />
    <pixel-five v-if="value==5" />
    <pixel-six v-if="value==6" />
    <pixel-seven v-if="value==7" />
    <pixel-eight v-if="value==8" />
    <pixel-nine v-if="value==9" />
    <pixel-ten v-if="value==10" />
    <pixel-eleven v-if="value==11" />
    <pixel-twelve v-if="value==12" />
    <pixel-thirteen v-if="value==13" />
    <pixel-fourteen v-if="value==14" />
    <pixel-fifteen v-if="value==15" />
    <pixel-sixteen v-if="value==16" />
    <pixel-seventeen v-if="value==17" />
    <pixel-eighteen v-if="value==18" />
    <pixel-nineteen v-if="value==19" />
    <pixel-twenty v-if="value==20" />
  </g>
</template>

<style>
</style>
