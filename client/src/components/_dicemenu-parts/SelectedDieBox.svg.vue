<script setup>
import Die from '../_die.svg.vue'
import DotButtonAdd from './DotButtonAdd.svg.vue'
import DotButtonRemove from './DotButtonRemove.svg.vue'
import DieLabel from './DieLabel.svg.vue'
</script>
<script>

export default {
  props: {
    diceId: {
      type: Number,
      default: null
    },
    selected: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      hover: false
    }
  },
  methods: {
    add() {
      this.$emit('add')
    },
    remove() {
      this.$emit('remove')
    },
    smartClick() {
      if (this.diceId == null) {
        this.$emit('add')
      } else {
        this.$emit('smartClick')
      }
    },
  },
  computed: {
    fillOpacity() {
      if (this.selected) {
        return 0
      }
      return 0.5
    },
    strokeOpacity() {
      if (this.selected) {
        return 0.5
      } else if (this.hover) {
        return 0.3
      }
      return 0.15
    },
    dieTransform() {
      if (this.hover) {
        return "translate(0 80) scale(0.9)"
      } else if (this.selected) {
        return "translate(0 80) scale(0.75)"
      }
      return "translate(0 80) scale(0.6)"
    }
  }
}
</script>

<template>
  <g @mouseover="hover = true" @mouseleave="hover = false">
    <defs>
      <linearGradient id="boxgradient" gradientTransform="rotate(90)">
        <stop offset="0%" stop-color="#000000" stop-opacity="0.2" />
        <stop offset="100%" stop-color="#000000" stop-opacity="0.8" />
      </linearGradient>
    </defs>

    <rect x="-90" y="0" width="180" height="180" fill="url(#boxgradient)"  stroke="#ffffff" :stroke-opacity="strokeOpacity" :fill-opacity="fillOpacity" stroke-width="2" rx="25" ry="25" />

    <g v-if="diceId != null">
      <die
        :transform="dieTransform"
        :diceid="diceId"
      />
      <g transform="translate(0 180)" :stroke-opacity="strokeOpacity">
        <die-label :diceId="diceId" />
      </g>
    </g>


    <rect
      x="-90" y="0"
      width="180" height="180"
      fill="#000000"
      stroke="none"
      stroke-opacity="0"
      fill-opacity="0"
      stroke-width="2"
      rx="25" ry="25"
      @click="smartClick()" />

    <g transform="translate(0 0)" v-if="diceId != null">
      <dot-button-remove @click="remove()" />
    </g>
    <g transform="translate(0 0)" v-else>
      <dot-button-add @click="add()" />
    </g>

  </g>
</template>

<style>
</style>
