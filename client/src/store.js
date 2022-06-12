import { reactive } from 'vue'

export const store = reactive({
  web3: {
    hasWallet: false,
    isConnected: false,
    validNetwork: false,
    chain: null,
    accounts: null,
    activeAccount: null,
    blockExplorer: null,
    openSea: null,
    balance: 0,
    weiPrice: 0,
    price: 0
    //todo: one array of dice objects with roll and trait properties
  },
  diceLoaded: false,
  block: 0,
  alert: null,

  //TODO: versioning should be automated
  version: {
    client: "0.4.0",
    contract: "1.0"
  },

  ownedDice: [
  ],

  selectedDice: [
    null,
    null,
    null
  ],

  addDie(dieData) {
    if (!this.ownedDice.find(die=>die.nftId === dieData.nftId)) {
      this.ownedDice.push(dieData)
    }
  }
})
