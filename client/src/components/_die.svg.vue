<script setup>
import D20GenericBackground from './_dice-parts/d20/background/generic-background.svg.vue'
import D20GenericNumbers from './_dice-parts/d20/generic-numbers.svg.vue'
import D20RareNumbers from './_dice-parts/d20/rare-numbers.svg.vue'
import D6GenericBackground from './_dice-parts/d6/background/generic-background.svg.vue'
import D6GenericNumbers from './_dice-parts/d6/generic-numbers.svg.vue'
import D6RareNumbers from './_dice-parts/d6/rare-numbers.svg.vue'
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
        return store.diceTraits[this.diceid].font
      }
      return this.diceid % 2
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
    <defs>
      <radialGradient id="dieshadow">
        <stop offset="0" stop-color="#000000" stop-opacity="1" />
        <stop offset="25%" stop-color="#000000" stop-opacity="1" />
        <stop offset="60%" stop-color="#000000" stop-opacity="0.9" />
        <stop offset="85%" stop-color="#000000" stop-opacity="0.4" />
        <stop offset="100%" stop-color="#000000" stop-opacity="0" />
      </radialGradient>
    </defs>
    <g class="diceshadow" :class="{rollshadow: rolling}">
      <ellipse cx="0" cy="40" rx="60" ry="30" transform="rotate(0)" fill="url('#dieshadow')"  opacity="0.20" stroke-width="0" />
    </g>
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
        <g v-if="sides == 20" transform="rotate(0) translate(0 0)">
          <d20-generic-background :backgroundColor="backgroundColor" />
          <g v-if="fontType == 0">
            <d20-generic-numbers :fontColor="fontColor" :value="displayValue()" />
          </g>
          <g v-if="fontType == 1">
            <d20-rare-numbers :fontColor="fontColor" :value="displayValue()" />
          </g>
        </g>
        <g v-if="sides == 6" transform="rotate(0) translate(0 0)">
          <d6-generic-background :backgroundColor="backgroundColor" />
          <g v-if="fontType == 0">
            <d6-generic-numbers :fontColor="fontColor" :value="displayValue()" />
          </g>
          <g v-if="fontType == 1">
            <d6-rare-numbers :fontColor="fontColor" :value="displayValue()" />
          </g>
        </g>
      </g>
    </g>
  </g>
</template>

<style>
.dice, .diceshadow {
  transition: 0.5s ease-out;
}

.rolling {
  transition: 1s linear;
  transform: translate(0,-64px) scale(1.1);
}
.rollshadow {
  transition: 1s linear;
  transform: translate(-8px,32px) scale(0.8);
  opacity: 0.5;
}
</style>
