import { reactive } from 'vue'

export const store = reactive({
  web3: {
    hasWallet: false,
    isConnected: false,
    chain: null,
    accounts: null,
    activeAccount: null,
    validNetwork: false,
    blockExplorer: null,
    openSea: null,
    balance: 0,
    weiPrice: 0,
    price: 0
    //todo: one array of dice objects with roll and trait properties
  },
  diceLoaded: false,
  block: 0,

  //TODO: versioning should be automated
  version: {
    client: "0.2.1",
    contract: "0.2"
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
