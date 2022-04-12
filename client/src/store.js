import { reactive } from 'vue'

export const store = reactive({
  web3: {
    hasWallet: false,
    isConnected: false,
    chain: null,
    accounts: null,
    validNetwork: false,
    //todo: one array of dice objects with roll and trait properties
  },
  diceLoaded: false,
  address: '',
  block: 0,
  lastRoll: [],
  diceTraits: [],
  isRolling: [],
  ownedDice: [
  ],
  selectedDice: [
    null,
    null,
    null
  ]
})
