<script setup>
import DotButtonAdd from './_dicemenu-parts/DotButtonAdd.svg.vue'
import DotButtonMinus from './_dicemenu-parts/DotButtonMinus.svg.vue'
import { ethers } from "ethers"
</script>
<script>
import { web3dice } from '../web3dice.js'

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      qty: 1,
      price: 0,
      maxBuy: 5
    }
  },
  mounted () {
    this.loadPrice();
  },
  methods: {
    close() {
      this.$emit('close')
    },
    increase() {
      if (this.canIncrease) {
        this.qty++
        this.loadPrice()
      }
    },
    decrease() {
      if (this.canDecrease) {
        this.qty--
        this.loadPrice()
      }
    },
    async loadPrice() {
        this.price = 0
        let weiPrice = await web3dice.getPriceForDice(this.qty)
        this.price = ethers.utils.formatEther(weiPrice)
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
        <text font-size="0.5em" transform="translate(0 0)" v-if="price > 0">Current Estimated Price: {{ price }} Matic</text>
        <text font-size="0.5em" transform="translate(0 0)" v-else>Fetching latest price...</text>
        <text font-size="0.5em" transform="translate(0 20)">(not including network fees)</text>
        <g transform="translate(-120 -65)" v-if="canDecrease">
            <dot-button-minus @click="decrease()" />
        </g>
        <g transform="translate(120 -65)" v-if="canIncrease">
            <dot-button-add @click="increase()" />
        </g>

        <g transform="translate(-110 100)">
            <rect x="-80" y="-20" width="160" height="40" fill="#ffaa00" fill-opacity="0.5" stroke="#ffaa00" stroke-opacity="0.2" stroke-width="2" rx="15" ry="15" />
            <text font-size="0.6em">Nevermind</text>
            <rect x="-80" y="-20" width="160" height="40" fill="#ffffff" fill-opacity="0" stroke="#ffffff"  stroke-width="0" @click="close" class="can-click" />
        </g>
        <g transform="translate(110 100)">
            <rect x="-80" y="-20" width="160" height="40" fill="#44ff44" fill-opacity="0.5" stroke="#44ff44" stroke-opacity="0.2" stroke-width="2" rx="15" ry="15" />
            <text font-size="0.6em">Mint My Dice</text>
            <rect x="-80" y="-20" width="160" height="40" fill="#ffffff" fill-opacity="0" stroke="#ffffff"  stroke-width="0" @click="checkout" class="can-click" />
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
