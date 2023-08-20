<script>
import { store } from '../../store.js'

export default {
  props: {
    diceId: {
      type: Number,
      default: null
    },
    showRoll: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      store,
      hover: false
    }
  },
  methods: {
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
    getDivergentColors() {
      let colorA = store.ownedDice[this.diceId].fgColor
      let colorB = store.ownedDice[this.diceId].bgColor

      let luminanceA = this.getLuminanceValue(colorA)
      let luminanceB = this.getLuminanceValue(colorB)
      if (luminanceA > luminanceB) {
        return {
          a: this.getLighterColor(colorA),
          b: this.getDarkerColor(colorB),
        }
      }
      return {
        b: this.getLighterColor(colorB),
        a: this.getDarkerColor(colorA),
      }
    },
  },
  computed: {
    diceLabelForground() {
      let colors = this.getDivergentColors()
      return colors.a
    },
    diceLabelBackground() {
      let colors = this.getDivergentColors()
      return colors.b
    },
    dieName() {
      return store.ownedDice[this.diceId].name
    },
    rollText() {
      if (store.ownedDice[this.diceId].isRolling || (store.ownedDice[this.diceId].lastRoll == null)) {
        return "?"
      }
      return store.ownedDice[this.diceId].lastRoll
    }
  }
}
</script>

<template>
  <g @mouseover="hover = true" @mouseleave="hover = false">

    <g v-if="diceId != null">
      <rect
        x="-100" y="-15"
        width="200" height="30"
        :fill="'#'+diceLabelBackground"
        stroke="#ffffff"
        fill-opacity="1"
        stroke-width="2"
        rx="10" ry="10"
      />
      <text
        v-if="showRoll"
        text-anchor="end"
        transform="translate(90 1)"
        :fill="'#'+diceLabelForground"
        stroke-width="0"
        font-weight="bold"
        font-size="0.7em"
      >{{ rollText }}</text>
      <text
        v-if="showRoll"
        text-anchor="start"
        transform="translate(-90 0)"
        :fill="'#'+diceLabelForground"
        stroke-width="0"
        font-weight="bold"
        font-size="0.55em"
      >{{ dieName }}</text>
      <text
        v-if="!showRoll"
        :fill="'#'+diceLabelForground"
        stroke-width="0"
        font-weight="bold"
        font-size="0.55em"
      >{{ dieName }}</text>
    </g>
  </g>
</template>

<style>
</style>
