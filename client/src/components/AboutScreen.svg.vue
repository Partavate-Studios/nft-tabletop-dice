<script setup>
import PolydiceLogo from './polydice-logo.svg.vue'
import PartavateLogo from './partavate-logo.svg.vue'
import SquareButton from './SquareButton.svg.vue'
import { store } from '../store.js'
</script>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      store
    }
  },
  methods: {
    openPartavate() {
      window.open('https://partavate.com', '_blank')
    },
    openRix() {
      window.open('https://ryndon.com/', '_blank')
    },
    viewContract() {
      window.open(this.store.web3.blockExplorer, '_blank')
    },
    close() {
      this.$emit('close')
    },
  }
}
</script>

<template>
  <g :class="{show: show, hide: !show}" class="aboutscreen">
    <rect
      x="-320" y="-420"
      width="640" height="840"
      fill="#000000"
      stroke="#ff0000"
      stroke-opacity="0.75"
      stroke-width="4"
      rx="25" ry="25" />

    <g fill="#ffffff" stroke-width="0">

       <polydice-logo transform="translate(0 -250) scale(1.75)" />

      <text font-size="0.7em"
        transform="translate(0, -110)">brought to you by</text>

      <partavate-logo transform="translate(0 -60) scale(0.5)" />
      <rect
        fill-opacity="0"
        fill="#000000"
        x="-200" y="-120"
        width="400" height="100"
        stroke-width="0"
        class="can-click"
        @click="openPartavate()" />

      <text font-size="0.6em"
        transform="translate(0, 35)">in collaboration with</text>
      <text font-size="1.2em"
        transform="translate(0, 70)">Rix Studios</text>
      <rect
        fill-opacity="0"
        fill="#000000"
        x="-100" y="20"
        width="200" height="70"
        stroke-width="0"
        class="can-click"
        @click="openRix()" />

      <g transform="translate(0 190)" v-if="store.web3.blockExplorer">
        <square-button :width="300" label="View The Contract" @click="viewContract()" />
      </g>

      <g transform="translate(0 310)">
        <square-button :width="150" btnstyle="red" label="close" @click="close()" />
      </g>


    </g>
  </g>
</template>

<style scoped>
  g.show {
    transform: translate(0, 0) scale(1) rotate(0deg);
  }
  g.hide {
    transform: translate(-250px, -420px) scale(0) rotate(720deg);
  }
  g.aboutscreen {
    transition: transform 0.5s;
  }
</style>
