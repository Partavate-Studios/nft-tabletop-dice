<script setup>
import Die from '../_die.svg.vue'
import DotButtonAdd from './DotButtonAdd.vue'
import DotButtonRemove from './DotButtonRemove.vue'
</script>
<script>
import { store } from '../../store.js'

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
    hover: {
      type: Boolean,
      default: false
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

    // TODO: this color tricker could be in a library
    getColorToRGB(color) {
      let r = "0x" + color[0] + color[1]
      let g = "0x" + color[2] + color[3]
      let b = "0x" + color[4] + color[5]
      return{
          r: +r,
          g: +g,
          b: +b
      }
    },
    getRGBComponentToHex(c) {
      c = Math.min(c, 255)
      let hex = c.toString(16)
      return hex.length == 1 ? "0" + hex : hex
    },
    getRGBToColor(r, g, b) {
      return this.getRGBComponentToHex(r) + this.getRGBComponentToHex(g) + this.getRGBComponentToHex(b);
    },
    getLuminanceValue(color) {
      let rgb = this.getColorToRGB(color)
      let luminance = parseInt((rgb.r + rgb.g + rgb.b) / 3)
      return luminance
    },
    getLighterComponent(c) {
      return Math.round((c + 255) / 2)
    },
    getDarkerComponent(c) {
      return Math.round((c / 2))
    },
    getLighterColor(color) {
      let rgb = this.getColorToRGB(color)
      color = this.getRGBToColor(
        this.getLighterComponent(rgb.r),
        this.getLighterComponent(rgb.g),
        this.getLighterComponent(rgb.b),
      )
      return color
    },
    getDarkerColor(color) {
      let rgb = this.getColorToRGB(color)
      color = this.getRGBToColor(
        this.getDarkerComponent(rgb.r),
        this.getDarkerComponent(rgb.g),
        this.getDarkerComponent(rgb.b),
      )
      return color
    },
    getDivergentColors(colorA, colorB) {
      let luminanceA = this.getLuminanceValue(colorA)
      let luminanceB = this.getLuminanceValue(colorB)
      if (luminanceA > luminanceB) {
        return {
          a: this.getLighterColor(colorA),
          b: this.getDarkerColor(colorB),
        }
      }
      return {
        a: this.getLighterColor(colorB),
        b: this.getDarkerColor(colorA),
      }
    },
    diceLabelForground(diceId) {
      let colors = this.getDivergentColors(
        this.store.diceTraits[diceId].fgColor,
        this.store.diceTraits[diceId].bgColor
      )
      return colors.a
    },
    diceLabelBackground(diceId) {
      let colors = this.getDivergentColors(
        this.store.diceTraits[diceId].fgColor,
        this.store.diceTraits[diceId].bgColor
      )
      return colors.b
    }
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
      <g transform="translate(0 150)">
        <rect
          x="-70" y="-15"
          width="140" height="30"
          :fill="'#'+diceLabelBackground(diceId)"
          stroke="#ffffff" :stroke-opacity="strokeOpacity"
          fill-opacity="1"
          stroke-width="2"
          rx="10" ry="10"
        />
        <text
          :fill="'#'+diceLabelForground(diceId)"
          stroke-width="0"
          font-weight="bold"
          font-size="0.55em"
        >{{ store.diceTraits[diceId].name }}</text>
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
