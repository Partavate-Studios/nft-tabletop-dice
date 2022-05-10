<script setup>
import Die from './_die.svg.vue'
import DieLabel from './_dicemenu-parts/DieLabel.svg.vue'
import { web3dice } from '../web3dice.js'
import { store } from '../store.js'
</script>

<script>

export default {
  data() {
    return {
      store,
    }
  },
  methods: {
    async roll() {
      if (store.selectedDice[0] != null) {
        web3dice.delayedRoll(store.selectedDice[0])
      }
      if (store.selectedDice[1] != null) {
        web3dice.delayedRoll(store.selectedDice[1])
      }
      if (store.selectedDice[2] != null) {
        web3dice.delayedRoll(store.selectedDice[2])
      }
    }
  }
}
</script>

<template>
  <g transform="translate(0 300)" stroke-opacity="0.25">
    <die-label
        v-if="store.selectedDice[0] != null"
        transform="translate(-170 0) scale(1)"
        :diceId="store.selectedDice[0]"
        :showRoll="true"
    />
    <die-label
        v-if="store.selectedDice[1] != null"
        transform="translate(0 0) scale(1)"
        :diceId="store.selectedDice[1]"
        :showRoll="true"
    />
    <die-label
        v-if="store.selectedDice[2] != null"
        transform="translate(170 0) scale(1)"
        :diceId="store.selectedDice[2]"
        :showRoll="true"
    />
    </g>


    <g transform="translate(0 120)">
    <die
        v-if="store.selectedDice[0] != null"
        transform="translate(-170 -20) scale(1.2)"
        :diceid="store.selectedDice[0]"
    />
    <die
        v-if="store.selectedDice[1] != null"
        transform="translate(0 10) scale(1.2)"
        :diceid="store.selectedDice[1]"
    />
    <die
        v-if="store.selectedDice[2] != null"
        transform="translate(170 -20) scale(1.2)"
        :diceid="store.selectedDice[2]"
    />

    <rect
      x="-300" y="-100"
      width="600" height="200"
      fill="#000000"
      stroke="#ffffff"
      stroke-opacity="0.0"
      fill-opacity="0.0"
      class="can-click"
      @click="roll()" />
  </g>
</template>

<style>
</style>
