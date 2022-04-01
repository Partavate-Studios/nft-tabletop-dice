<script setup>
import D20GenericBackground from './_dice-parts/d20/background/generic-background.svg.vue'
import D20GenericNumbers from './_dice-parts/d20/generic-numbers.svg.vue'
import D20PixelNumbers from './_dice-parts/d20/pixel-numbers.svg.vue'
import D6GenericBackground from './_dice-parts/d6/background/generic-background.svg.vue'
</script>

<script>
import { store } from '../store.js'

export default {
  props: {
    diceid: {
      type: Number,
      default: 1
    },
  },
  data () {
    return {
      rollingNumber: 1,
      store
    }
  },
  watch: {
    rolling(value) {
      if (value) {
        this.rollNumbers()
      }
    }
  },
  methods: {
    rollNumbers () {
      this.rollingNumber = ((this.rollingNumber) % this.sides) + 1
      if (this.rolling) {
        setTimeout(this.rollNumbers, 200)
      }
    },
    displayValue () {
      if (this.rolling) {
        return this.rollingNumber
      }
      return this.value
    },
  },
  computed: {
    rolling () {
      return store.isRolling[this.diceid]
    },
    value () {
      if (store.lastRoll[this.diceid]) {
        return parseInt(store.lastRoll[this.diceid])
      }
      return (this.diceid % this.sides + 1)
    },
    fontType () {
      if (store.diceTraits[this.diceid]) {
        return store.diceTraits[this.diceid].font % 2
      }
      return this.diceid %2
    },
    fontColor () {
      if (store.diceTraits[this.diceid]) {
        return '#' + store.diceTraits[this.diceid].fgColor
      }
      return '#ffffff'
    },
    backgroundColor () {
      if (store.diceTraits[this.diceid]) {
        return '#' + store.diceTraits[this.diceid].bgColor
      }
      return '#000088'
    },
    sides () {
      if (store.diceTraits[this.diceid]) {
        return store.diceTraits[this.diceid].sides
      }
      return 20
    },

  }
}
</script>

<template>
  <g  v-if="store.ownedDice[diceid] != null && store.diceTraits[diceid] != null">
    <ellipse cx="0" cy="60" rx="60" ry="10" fill="#000000" opacity="0.25" stroke-width="0" />
    <g class="dice" :class="{rolling: rolling}">
      <g fill="#ffffff" stroke="#ffffff">
      <animateTransform v-if="rolling" attributeName="transform"
                        attributeType="XML"
                        type="rotate"
                        from="0"
                        to="360"
                        dur="0.75s"
                        animate="freeze"
                        repeatCount="indefinite"/>
        <d20-generic-background :backgroundColor="backgroundColor" v-if="sides == 20" />
        <d6-generic-background :backgroundColor="backgroundColor" v-if="sides == 6" />
        <g v-if="sides == 20" >
          <g v-if="fontType == 0">
            <d20-generic-numbers :fontColor="fontColor" :value="displayValue()" />
          </g>
          <g v-if="fontType == 1">
            <d20-pixel-numbers :fontColor="fontColor" :value="displayValue()" />
          </g>
        </g>
      </g>
    </g>
  </g>
</template>

<style>
.dice {
  transition: 0.5s ease-out;
}
.rolling {
  transition: 2s linear;
  transform: translate(0,-100px) scale(0.75);
}
</style>
