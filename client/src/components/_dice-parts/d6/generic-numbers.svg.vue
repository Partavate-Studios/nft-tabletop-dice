<script setup>
import GenericOne from './numbers/generic/generic-one.svg.vue'
import GenericTwo from './numbers/generic/generic-two.svg.vue'
import GenericThree from './numbers/generic/generic-three.svg.vue'
import GenericFour from './numbers/generic/generic-four.svg.vue'
import GenericFive from './numbers/generic/generic-five.svg.vue'
import GenericSix from './numbers/generic/generic-six.svg.vue'
import GenericSeven from './numbers/generic/generic-seven.svg.vue'
import GenericEight from './numbers/generic/generic-eight.svg.vue'
import GenericNine from './numbers/generic/generic-nine.svg.vue'
import GenericTen from './numbers/generic/generic-ten.svg.vue'
import GenericEleven from './numbers/generic/generic-eleven.svg.vue'
import GenericTwelve from './numbers/generic/generic-twelve.svg.vue'
import GenericThirteen from './numbers/generic/generic-thirteen.svg.vue'
import GenericFourteen from './numbers/generic/generic-fourteen.svg.vue'
import GenericFifteen from './numbers/generic/generic-fifteen.svg.vue'
import GenericSixteen from './numbers/generic/generic-sixteen.svg.vue'
import GenericSeventeen from './numbers/generic/generic-seventeen.svg.vue'
import GenericEighteen from './numbers/generic/generic-eighteen.svg.vue'
import GenericNineteen from './numbers/generic/generic-nineteen.svg.vue'
import GenericTwenty from './numbers/generic/generic-twenty.svg.vue'
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
    <generic-one v-if="value==1" />
    <generic-two v-if="value==2" />
    <generic-three v-if="value==3" />
    <generic-four v-if="value==4" />
    <generic-five v-if="value==5" />
    <generic-six v-if="value==6" />
    <generic-seven v-if="value==7" />
    <generic-eight v-if="value==8" />
    <generic-nine v-if="value==9" />
    <generic-ten v-if="value==10" />
    <generic-eleven v-if="value==11" />
    <generic-twelve v-if="value==12" />
    <generic-thirteen v-if="value==13" />
    <generic-fourteen v-if="value==14" />
    <generic-fifteen v-if="value==15" />
    <generic-sixteen v-if="value==16" />
    <generic-seventeen v-if="value==17" />
    <generic-eighteen v-if="value==18" />
    <generic-nineteen v-if="value==19" />
    <generic-twenty v-if="value==20" />
  </g>
</template>

<style>
</style>
