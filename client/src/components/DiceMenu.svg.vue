<script setup>
import Die from './_die.svg.vue'
import dieBox from './_dicemenu-parts/SelectedDieBox.svg.vue'
import SelectedDieBox from './_dicemenu-parts/SelectedDieBox.svg.vue'
import SquareButton from './SquareButton.svg.vue'
import { web3dice } from '../web3dice.js'
import { store } from '../store.js'
</script>
<script>

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
      window.open(store.web3.openSea, '_blank')
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
    diceSelected() {
      if(store.selectedDice[0] != null) {
        return true
      }
      if(store.selectedDice[1] != null) {
        return true
      }
      if(store.selectedDice[2] != null) {
        return true
      }
      return false
    }
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
        <square-button font-size="0.8em" btnstyle="mint" label="Mint Yourself Some New Dice!" :width="360" :height="80" @click="openBuyDice" />
      </g>
      <g transform="translate(0 220)">
        <square-button font-size="0.8em" btnstyle="cornflower" label="Shop for Dice on OpenSea!" :width="360" :height="80" @click="shop" />
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
        <square-button
          label="Mint New Dice"
          :width="160"
          :height="50"
          btnstyle="mint"
          font-size="0.7em"
          @click="openBuyDice" />
      </g>
      <g transform="translate(-200 20)">
        <square-button
          label="Browse Dice"
          :width="160"
          :height="50"
          btnstyle="cornflower"
          font-size="0.7em"
          @click="shop" />
      </g>

      <g transform="translate(0 20)">
        <square-button
          :label="diceSelected ? 'Let\'s Roll' : 'Close Menu'"
          :width="200"
          :height="80"
          btnstyle="pink"
          font-size="1.1em"
          @click="close()" />

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
  g.menu {
    transition: transform 0.5s;
    transform-origin: 100% 0%;
  }
  .smoothmove {
    transition: transform 0.25s;
  }
</style>
