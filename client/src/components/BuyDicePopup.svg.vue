<script setup>
import DotButtonAdd from './_dicemenu-parts/DotButtonAdd.svg.vue'
import DotButtonMinus from './_dicemenu-parts/DotButtonMinus.svg.vue'
import SquareButton from './SquareButton.svg.vue'
import { web3dice } from '../web3dice.js'
import {store } from '../store.js'
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
      store,
      qty: 1,
      maxBuy: 5
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    increase() {
      if (this.canIncrease) {
        this.qty++
      }
    },
    decrease() {
      if (this.canDecrease) {
        this.qty--
      }
    },
    async checkout() {
      await web3dice.buyRandomDice(this.qty)
      this.close();
    }
  },
  computed: {
    canIncrease() {
      return this.maxBuy > this.qty
    },
    canDecrease() {
      return this.qty > 1
    },
    canAfford() {
      if ((store.web3.price == 0) ||
          (this.price > store.web3.balance)) {
        return false
      }
      return true
    },
    price() {
      return store.web3.price * this.qty
    }
  }
}
</script>

<template>
  <g :class="{show: show, hide: !show}" class="buydice">
    <rect
      x="-320" y="-210"
      width="640" height="420"
      fill="#100020"
      stroke="#661f66"
      stroke-opacity="0.75"
      stroke-width="4"
      rx="25" ry="25" />

    <g fill="#ffffff" stroke-width="0">
        <text font-size="0.8em" transform="translate(0, -130)">How many dice would you like to mint?</text>
        <g font-size="1.5em" transform="translate(0, -60)">
            <text v-if="qty == 1">1 Die</text>
            <text v-else>{{ qty }} Dice</text>
        </g>
        <text font-size="0.5em" transform="translate(0 0)" v-if="price > 0">Current Estimated Price: ~{{ price.toFixed(4) }} Matic</text>
        <text font-size="0.5em" transform="translate(0 0)" v-else>Fetching price...</text>
        <text font-size="0.5em" transform="translate(0 20)">(not including network fees)</text>
        <g transform="translate(-120 -65)" v-if="canDecrease">
            <dot-button-minus @click="decrease()" />
        </g>
        <g transform="translate(120 -65)" v-if="canIncrease">
            <dot-button-add @click="increase()" />
        </g>

        <g transform="translate(-110 100)">
          <square-button
            font-size="0.6em"
            :width="160" :height="40"
            btnstyle="red"
            label="Nevermind"
            @click="close" />
        </g>
        <g transform="translate(110 100)">
          <g v-if="price == 0">
            <text font-size="0.6em">Fetching Price</text>
          </g>
          <g v-else-if="canAfford">
            <square-button
              v-if="canAfford"
              font-size="0.6em"
              :width="160"
              :height="40"
              btnstyle="mint"
              label="Mint My Dice"
              @click="checkout" />
          </g>
          <g v-else="">
            <text font-size="0.6em">Too expensive.</text>
          </g>
        </g>
    </g>
  </g>
</template>

<style scoped>
  g.show {
    transform: rotate(0deg);
  }
  g.hide {
    transform: rotate(-180deg);
  }
  g.buydice {
    transition: transform 0.5s;
    transform-origin: -100% 0%;
  }
</style>
