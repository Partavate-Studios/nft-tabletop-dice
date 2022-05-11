<script setup>
import SvgContainer from './components/layouts/SvgContainer.vue'
import MenuIcon from './components/_menu-icon.svg.vue'
import AboutScreen from './components/AboutScreen.svg.vue'
import PolydiceLogoButton from './components/polydice-logo-button.svg.vue'
import PolydiceIcon from './components/polydice-icon.svg.vue'
import PolygonLogo from './components/_polygon-logo.svg.vue'
import DiceMenu from './components/DiceMenu.svg.vue'
import BuyDice from './components/BuyDicePopup.svg.vue'
import DiceRoller from './components/DiceRoller.svg.vue'
import SquareButton from './components/SquareButton.svg.vue'
import Notice from './components/Notice.svg.vue'
import { web3dice } from './web3dice.js'
import { store } from './store.js'
</script>

<script>
export default {
  data() {
    return {
      store,
      menu: false,
      buyDice: false,
      about: false
    }
  },
  computed: {
    chainName() {
      if ( store.web3.chain != null) {
        return store.web3.chain.name
      }
      return 'no chain found'
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
    },
    menuIsOpen() {
      if (this.menu || this.buyDice || this.about) {
        return true
      }
      return false
    }
  },
  methods: {
    connect() {
      web3dice.connect()
    },
    openMenu() {
      this.closeAll()
      web3dice.getOwnedDice()
      this.menu = true
    },
    openBuyDice() {
      this.closeAll()
      this.menu = false
      this.buyDice = true
    },
    openAbout() {
      this.closeAll()
      this.about = true
    },
    closeAll () {
      this.menu = false
      this.buyDice = false
      this.about = false
    },
    switchNetwork() {
      web3dice.switchNetwork()
    }
  }
}
</script>

<template>
  <div id="svgContainer">
    <svg-container>
      <g fill="#ffffff" text-anchor="middle" dominant-baseline="middle" font-size="1.75em">

        <polydice-icon transform="scale(4) translate(-190 -120)" opacity="0.01" />

        <polydice-logo-button transform="translate(-240 -420) scale(1.1)" @click="openAbout()" />


        <g font-size="0.5em" fill="#ffffff" fill-opacity="0.25" stroke="0" transform="translate(0 500)">
          <text>Client version: {{ store.version.client }} Contract version: {{ store.version.contract }}</text>
        </g>

        <g v-if="!store.web3.hasWallet">
          <text transform="translate(0 -50)">I called out to your Web3 wallet provider;</text>
          <text>but alas, I heard only silence.</text>
          <text transform="translate(0 50)">Check your wallet and reload this page.</text>

          <polygon-logo transform="scale(10) translate(0 40)" opacity="0.1" />
        </g>

        <g v-else-if="!store.web3.isConnected">
          <polygon-logo transform="scale(10) translate(0 40)" opacity="0.1" />
          <text transform="translate(0 -50)">You are on the {{ chainName }} network.</text>
          <g v-if="!store.web3.validNetwork">
            <text>Please switch to Polygon Mumbai</text>
            <g transform="translate(0 70)">
              <square-button label="Switch Network" @click="switchNetwork()" />
            </g>
          </g>
          <g v-else>
            <text>Let's connect your account!</text>
            <g transform="translate(0 70)">
              <square-button label="Connect It!" @click="connect()" />
            </g>
          </g>

        </g>

        <g v-else>

          <g :transform="'translate(' + 280 + ' ' + -420 +')'" v-if="!menu">
            <menu-icon @click="openMenu()" />
          </g>

          <g v-if="diceSelected">
            <dice-roller />
          </g>
          <g v-else transform="translate(0 100)">
            <square-button
              label="Select Dice"
              btnstyle="clear"
              :width="400"
              :height="100"
              @click="openMenu()" />
          </g>

          <g v-if="menuIsOpen">
            <rect x="-2000" y="-2000" width="4000"  height="4000" fill="#000000" opacity="0.4" @click="closeAll()" />
          </g>
          <dice-menu :show="menu" @close="closeAll()" @buydice="openBuyDice()" />
          <buy-dice :show="buyDice" @close="closeAll()" />
          <about-screen :show="about" @close="closeAll()" />

        </g>
        <notice />
      </g>
    </svg-container>
  </div>

</template>

<style>
@import './assets/base.css';

#app {
  text-align: center
}
#svgContainer {
  background: #000000;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  overflow: hidden;
  z-index: 1000;
  height: 100vh;
  width: 100vw;
}
.can-click:hover {
  cursor: pointer;
}
</style>
