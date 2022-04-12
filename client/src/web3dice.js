import { store } from './store.js'
import { ethers } from "ethers"
import Dice from '../../evm/artifacts/contracts/Dice.sol/TabletopDiceNFT.json'

export const web3dice = {
  provider: null,
  signer: null,
  diceContract: null,
  //diceContractAddress: '0x9AC5Ce72dB012e19BBB7e9fb05cb614fA2d58938', //what will be the best way to populate this? A: (@excalq) the HH deploy task!
  diceContractAddress: '0x80D0880F284037f4E2e133392b79deb39789c25C',

  async init() {
    try {
      this.provider = new ethers.providers.Web3Provider(window.ethereum,"any")
    } catch (e) {
      console.log('Error: ' + e.message)
      return
    }
    store.web3.hasWallet = true

    try {
      store.web3.chain = await this.provider.getNetwork()
    } catch (e) {
      console.log('Error: ' + e.message)
    }

    this.provider.on("network", (newNetwork, oldNetwork) => {
      console.log('network changed')
      if (oldNetwork) {
          window.location.reload()
      }
    })


    //todo - if we were going multichain, we would need to get the correct
    //address for the contract based on which network is currently active
    console.log ('Wallet provider found')
    console.log('chain id: ', store.web3.chain.chainId)
    //if (parseInt(store.web3.chain.chainId) == 80001) {
      this.connect()
    //}
  },

  async connect() {
    try {
      store.web3.accounts = await this.provider.send("eth_requestAccounts", [])
    } catch(e) {
      console.log('Error: ' + e.message)
      return
    }
    this.signer = await this.provider.getSigner()
    this.diceContract = new ethers.Contract(this.diceContractAddress, Dice.abi, this.signer)
    console.log(await this.diceContract.address)

    this.signer.getAddress().then( async (address) => {
      console.log('signer address found')
      store.address = address
      this.diceContract.connect(this.signer)
      this.getOwnedDice()
      store.web3.isConnected = true
    }, this)

  },

  async switchNetwork() {

    //Todo: this will need to be smarter when we
    //release to polygon.
    const chainId = '0x13881'
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainId }]
      });
    } catch (error) {
      if (confirm('Chain not found in your wallet. Would you like us to try to add it?')) {
        let data = [{
          chainId: chainId,
          chainName: 'Polygon Testnet',
          nativeCurrency: {
            name: 'MATIC',
            symbol: 'MATIC',
            decimals: 18
          },
          rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
          blockExplorerUrls: ['https://mumbai.polygonscan.com/']
        }]
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: data
          });
        } catch (error) {
          alert('We were unable to add the network.')
        }
      }
    }
  },

  async delayedRoll(diceId) {
    let rollDelay = Math.floor(Math.random() * 100)
    setTimeout(() => {this.roll(diceId)}, rollDelay)
  },

  async roll(diceId) {
    store.isRolling[diceId] = true
    try {
      const nonce = parseInt(new Date().getTime() % 512);
      const roll = await this.diceContract.roll(diceId, nonce)
      store.lastRoll[diceId] = roll
      setTimeout(() => {store.isRolling[diceId] = false}, 1000)
      return roll
    } catch (error) {
      console.log("Error: ", error)
      store.isRolling[diceId] = false
      return 'failed'
    }
  },

  async mintRandomDice() {
    let price = 1000000000000000
    let qty = 5
    let value = String(price * qty)
    try {
      let minted = await this.diceContract.mintRandomDice({value: value})
      console.log('Minted new dice: ', minted)
      return true
    } catch (error) {
      console.log("Error: ", error)
    }
    return false
  },

  async mintRandomDie() {
    try {
      await this.diceContract.mintRandomDie()
      return true
    } catch (error) {
      console.log("Error: ", error)
    }
    return false
  },

  async getTraits() {
    try {
      store.ownedDice.forEach(async (diceId, index) => {
        store.diceTraits[index] = await this.diceContract.getTraits(diceId)
        console.log(store.diceTraits[index])
        console.log(index)
      }, this)
    } catch (error) {
      console.log("Error: ", error)
    }
  },


  async getOwnedDice() {
    try {
      store.ownedDice  = await this.diceContract.tokenListOfOwner(store.address)
      console.log('dice loaded: ', store.ownedDice)
      await this.getTraits()
    } catch (error) {
      store.ownedDice  = []
      console.log("Error: ", error)
    }
  }

}
