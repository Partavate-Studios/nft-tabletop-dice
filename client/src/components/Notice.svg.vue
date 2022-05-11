<script setup>
  import DotButtonRemove from './_dicemenu-parts/DotButtonRemove.svg.vue'
  import { store } from '../store.js'
</script>

<script>
export default {
  props: {
  },
  data () {
    return {
      store
    }
  },
  watch: {
    show(oldVal, newVal) {
      if (newVal != null) {
        setTimeout(() => {this.clearNotice()}, 7000)
      }
    }
  },
  methods: {
    clearNotice() {
      store.alert = null
    }
  },
  computed: {
    show () {
      if (store.alert != null) {
          return true
      }
      return false
    }
  }
}
</script>

<template>
  <g class="alert" :class="{show: show, hide: !show}">
    <g transform="translate(0 420)">
      <rect
        x="-320" y="-25"
        width="640" height="50"
        fill="#00000088"
        stroke="#ffff88"
        stroke-opacity="0.75"
        stroke-width="2"
        rx="25" ry="25" />
      <text fill="#aaaaaa">{{ store.alert }}</text>
      <rect
        x="-320" y="-25"
        width="640" height="50"
        fill="#000000"
        opacity="0"
        @click="clearNotice" />
      <g transform="translate(290 0) scale(0.7)"><dot-button-remove @click="clearNotice" /></g>
    </g>
  </g>
</template>

<style scoped>

  g.show {
    transform: translate(0, 0px);
  }
  g.hide {
    transform: translate(0, 300px);
    opacity: 0;
  }
  g.alert {
    transition: transform 0.5s, opacity 2s;
  }
</style>
