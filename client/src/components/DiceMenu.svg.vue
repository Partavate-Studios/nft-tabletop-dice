<script setup>
import Die from './_die.svg.vue'
import dieBox from './_dicemenu-parts/SelectedDieBox.svg.vue'
</script>
<script>
import { web3dice } from '../web3dice.js'
import { store } from '../store.js'
import SelectedDieBox from './_dicemenu-parts/SelectedDieBox.svg.vue'

export default {
  components: { SelectedDieBox },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      hover: false,
      ownedDiceIndex: 0,
      store
    }
  },
  destroyed () {
    window.removeEventListener('keyup', this.handleKeyPress)
  },
  created () {
    window.addEventListener('keyup', this.handleKeyPress)
  },
  methods: {
    // TODO: These urls need to be based on the current network id
    shop() {
      const url = "https://testnets.opensea.io/assets?search%5Bquery%5D="+web3dice.diceContractAddress
      window.open(url, '_blank')
    },
    explorer() {
      const url = "https://mumbai.polygonscan.com/address/"+web3dice.diceContractAddress
      window.open(url, '_blank')
    },
    close() {
      this.$emit('close')
    },
    openBuyDice() {
      this.$emit('buydice')
    },
    add(id) {
      for(let i=0;i<3;i++) {
        if (store.selectedDice[i] == this.ownedDiceIndex) {
          store.selectedDice[i] = null
        }
      }
      store.selectedDice[id] = this.ownedDiceIndex
    },
    remove(id) {
      store.selectedDice[id] = null
    },
    removeIfSelected(diceId) {
      for(let i=0;i<3;i++) {
        if (store.selectedDice[i] == this.ownedDiceIndex) {
          store.selectedDice[i] = null
        }
      }
    },
    selectOrRemove(id) {
      let diceId = store.selectedDice[id]
      if (diceId == this.ownedDiceIndex) {
        this.remove(id)
      } else {
        this.ownedDiceIndex = diceId
      }

    },
    async mintRandomDie() {
      const dice = await web3dice.mintRandomDie()
      if (dice) {
        alert('New Dice!')
      }
    },
    async mintRandomDice() {
      const dice = await web3dice.buyRandomDice(20)
      if (dice) {
        alert('New Dice!')
      }
    },
    goLeft() {
      if (this.isMoreLeft) {
        this.ownedDiceIndex--
      }
    },
    goRight() {
      if (this.isMoreRight) {
        this.ownedDiceIndex++
      }
    },
    getScaler(n) {
      const delta = Math.abs(this.ownedDiceIndex - n)
      const gradient = (delta * delta) / 100
      return Math.max(0, (1 - gradient))
    },
    dieHit(dieId) {
      if (dieId == this.ownedDiceIndex) {
        this.quickadd()
      } else {
        this.ownedDiceIndex = dieId
      }
    },
    quickadd() {
      if (store.selectedDice[0] == this.ownedDiceIndex) {
        return
      }
      if (store.selectedDice[1] == this.ownedDiceIndex) {
        return
      }
      if (store.selectedDice[2] == this.ownedDiceIndex) {
        return
      }
      if (store.selectedDice[1] == null) {
        store.selectedDice[1] = this.ownedDiceIndex
        return
      }
      if (store.selectedDice[0] == null) {
        store.selectedDice[0] = this.ownedDiceIndex
        return
      }
      if (store.selectedDice[2] == null) {
        store.selectedDice[2] = this.ownedDiceIndex
        return
      }
    },
    isUsed(diceId) {
      if ((store.selectedDice[0] == diceId) ||
          (store.selectedDice[1] == diceId) ||
          (store.selectedDice[2] == diceId)) {
        return true
      }
      return false
    },
    handleKeyPress (event) {
      switch (event.key) {
        case '1':
        case '2':
        case '3':
          if (store.selectedDice[event.key -1] != null) {
            this.ownedDiceIndex = store.selectedDice[event.key -1]
          }
          break;
        case 'ArrowRight':
          this.goRight()
          break
        case 'ArrowLeft':
          this.goLeft()
          break
        case 'ArrowDown':
          this.quickadd();
          break
        case 'ArrowUp':
          this.removeIfSelected();
          break
        case ' ':
          this.quickadd();
          break
        case 'Escape':
          this.close();
          break
      }
    }
  },
  computed: {
    fillOpacity() {
      if (this.hover) {
        return 1
      }
      return 0.6
    },
    haveDice() {
      if (store.ownedDice.length > 0) {
        return true
      }
      return false
    },
    isMoreLeft() {
      if (this.ownedDiceIndex > 0) {
        return true
      }
      return false
    },
    isMoreRight() {
      if (this.ownedDiceIndex + 1 < store.ownedDice.length) {
        return true
      }
      return false
    },
    isSelected() {
      if ((store.selectedDice[0] == this.ownedDiceIndex) ||
          (store.selectedDice[1] == this.ownedDiceIndex) ||
          (store.selectedDice[2] == this.ownedDiceIndex)) {
        return true
      }
      return false
    },
  }
}
</script>

<template>
  <g :class="{show: show, hide: !show}" class="menu">
    <defs>
      <linearGradient id="menu-background" gradientTransform="rotate(90)">
        <stop offset="0%" stop-color="#221a22" stop-opacity="1" />
        <stop offset="40%" stop-color="#554055" stop-opacity="1" />
        <stop offset="70%" stop-color="#554055" stop-opacity="1" />
        <stop offset="100%" stop-color="#221a22" stop-opacity="1" />
      </linearGradient>
    </defs>

    <rect
      x="-350" y="-450"
      width="700" height="1000"
      fill="url(#menu-background)"
      stroke="#661f66"
      stroke-opacity="0.75"
      stroke-width="4"
      rx="25" ry="25" />

    <g transform="translate(0 -250)" v-if="haveDice">

      <g stroke-width="4" stroke="#ffffff" transform="translate(0 100)">
        <g v-for="(id, n) in store.ownedDice" :key="'k' + id + n">
          <g :transform="'translate('+ ((n * 20) - (ownedDiceIndex * 20)) +' 0)'" class="smoothmove">
            <die
              :floating="(n == ownedDiceIndex) && !isSelected"
              :selected="isUsed(n)"
              :id="'collectionItem-' + n"
              :transform="'translate(' + ((n - ownedDiceIndex) * 40) * getScaler(n) + ' ' + (getScaler(n) * 100)  + ') scale(' + getScaler(n)*getScaler(n)*0.5 + ')'"
              :diceid="n"
              class="smoothmove"
              @click="dieHit(n)"
            />
          </g>
        </g>
      </g>

      <g v-if="store.ownedDice[ownedDiceIndex]" transform="translate(0 -100)">
        <text transform="translate(0 0)" font-size="1.2em" fill="#aaaaaa">{{ store.ownedDice[ownedDiceIndex].name }}</text>
      </g>
      <g v-if="store.ownedDice[ownedDiceIndex]" transform="translate(0 -65)">
        <text transform="translate(0 0)" font-size="0.6em" fill="#ffffff88">{{ store.ownedDice[ownedDiceIndex].sides }} sided</text>
      </g>

      <g transform="translate(0 145)">
        <text font-size="0.5em" fill="#cccccc">{{ ownedDiceIndex }} of {{ store.ownedDice.length }}</text>
      </g>
      <g transform="translate(0 130)">
        <text font-size="0.5em" fill="#cccccc">Die #{{ store.ownedDice[ownedDiceIndex].nftId }}</text>
      </g>

      <g stroke-width="4" stroke="#ffffff" transform="translate(-220 20)" v-if="isMoreLeft">
        <line x1="20" y1="-40" x2="-20" y2="0" />
        <line x1="20" y1="40" x2="-20" y2="0" />
        <rect x="-45" y="-55" width="90" height="110" fill="#000000" fill-opacity="0" stroke-width="0" class="can-click" @click="goLeft()" />
      </g>
      <g stroke-width="4" stroke="#ffffff" transform="translate(220 20)" v-if="isMoreRight">
        <line x1="-20" y1="-40" x2="20" y2="0" />
        <line x1="-20" y1="40" x2="20" y2="0" />
        <rect x="-45" y="-55" width="90" height="110" fill="#000000" fill-opacity="0" stroke-width="0" class="can-click" @click="goRight()" />
      </g>

    </g>
    <g transform="translate(0 -150)" v-else>
      <text>You don't have any dice yet.</text>
      <g transform="translate(0 100)">
        <rect x="-180" y="-40" width="360" height="80" fill="#008800" fill-opacity="0.5" stroke="#ffff00" stroke-opacity="0.2" stroke-width="2" rx="15" ry="15" />
        <text font-size="0.6em">Mint Yourself Some New Dice!</text>
        <rect x="-180" y="-40" width="360" height="80" fill="#ffffff" fill-opacity="0" stroke="#ffffff"  stroke-width="0" @click="openBuyDice" class="can-click" />
      </g>
    </g>

    <g v-if="isSelected" transform="translate(0 0)"
      stroke="#ffffff"
      stroke-width="2"
      stroke-linecap="round"
      stroke-opacity="0.4">
      <g v-if="store.selectedDice[0] == ownedDiceIndex">
        <line x1="-26" y1="-24" x2="-126" y2="56"/>
      </g>
      <g v-if="store.selectedDice[1] == ownedDiceIndex">
        <line x1="0" y1="-22" x2="0" y2="55"/>
      </g>
      <g v-if="store.selectedDice[2] == ownedDiceIndex">
        <line x1="26" y1="-24" x2="126" y2="56"/>
      </g>
    </g>

    <g transform="translate(0 50)" v-if="haveDice">
      <selected-die-box
        transform="translate(-210 0)"
        :diceId="store.selectedDice[0]"
        :selected="store.selectedDice[0] == ownedDiceIndex"
        v-on:add="add(0)"
        v-on:remove="remove(0)"
        v-on:smartClick="selectOrRemove(0)"
      />
      <selected-die-box
        transform="translate(0 0)"
        :diceId="store.selectedDice[1]"
        :selected="store.selectedDice[1] == ownedDiceIndex"
        v-on:add="add(1)"
        v-on:remove="remove(1)"
        v-on:smartClick="selectOrRemove(1)"
      />
      <selected-die-box
        transform="translate(210 0)"
        :diceId="store.selectedDice[2]"
        :selected="store.selectedDice[2] == ownedDiceIndex"
        v-on:add="add(2)"
        v-on:remove="remove(2)"
        v-on:smartClick="selectOrRemove(2)"
      />
    </g>

    <g transform="translate(0 350)">
      <g transform="translate(200 20)">
        <rect x="-80" y="-40" width="160" height="80" fill="#4444ff" fill-opacity="0.5" stroke="#4444ff" stroke-opacity="0.2" stroke-width="2" rx="15" ry="15" />
        <text font-size="0.6em">Mint New Dice</text>
        <rect x="-80" y="-40" width="160" height="80" fill="#ffffff" fill-opacity="0" stroke="#ffffff"  stroke-width="0" @click="openBuyDice" class="can-click" />
      </g>
      <g transform="translate(-200 50)">
        <rect x="-80" y="-20" width="160" height="40" fill="#4444ff" fill-opacity="0.5" stroke="#4444ff" stroke-opacity="0.2" stroke-width="2" rx="15" ry="15" />
        <text font-size="0.6em">Browse Dice</text>
        <rect x="-80" y="-20" width="160" height="40" fill="#ffffff" fill-opacity="0" stroke="#ffffff"  stroke-width="0" @click="shop" class="can-click" />
      </g>

      <g transform="translate(-200 0)">
        <rect x="-80" y="-20" width="160" height="40" fill="#4444ff" fill-opacity="0.5" stroke="#4444ff" stroke-opacity="0.2" stroke-width="2" rx="15" ry="15" />
        <text font-size="0.6em">View Contract</text>
        <rect x="-80" y="-20" width="160" height="40" fill="#ffffff" fill-opacity="0" stroke="#ffffff"  stroke-width="0" @click="explorer" class="can-click" />
      </g>

      <g transform="translate(0 20)">
        <rect x="-100" y="-40" width="200" height="80" fill="#ff44dd" fill-opacity="0.5" stroke="#ff44dd" stroke-opacity="0.2" stroke-width="2" rx="25" ry="25" />
        <text font-size="0.9em" v-if="haveDice">Let's Play!</text>
        <text font-size="0.6em" v-else>Close</text>
        <rect x="-100" y="-40" width="200" height="80" fill="#ffffff" fill-opacity="0" stroke="#ffffff"  stroke-width="0" @click="close" class="can-click" />
      </g>
    </g>
  </g>
</template>

<style>
  g.show {
    transform: rotate(0deg);
  }
  g.hide {
    transform: rotate(-180deg);
  }
  g.menu {
    transition: transform 0.5s;
    transform-origin: 100% 0%;
  }
  .smoothmove {
    transition: transform 0.25s;
  }
</style>
