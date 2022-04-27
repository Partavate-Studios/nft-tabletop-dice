import { store } from './store.js'
import { ethers } from "ethers"
import Dice from '../../evm/artifacts/contracts/Dice.sol/TabletopDiceNFT.json'
import Addresses from '../../evm/addresses/published-addresses.json'

export const web3dice = {
  provider: null,
  signer: null,
  diceContract: null,

  diceContractAddress: null,

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

    //Choose the contract address based on the chainId
    if (String(store.web3.chain.chainId) in Addresses) {
      this.diceContractAddress = Addresses[store.web3.chain.chainId]
      store.web3.validNetwork = true
    } else {
      console.log('no known contract address, is this a valid network?')
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
    let rollDelay = Math.floor(Math.random() * 20)
    setTimeout(() => {this.getRoll(diceId)}, rollDelay)
  },

  async getRoll(diceId) {
    let nftId = store.ownedDice[diceId].nftId
    store.ownedDice[diceId].isRolling = true
    try {
      const nonce = parseInt(new Date().getTime() % 512);
      const roll = await this.diceContract.getRoll(nftId, nonce)
      store.ownedDice[diceId].lastRoll = roll
      setTimeout(() => {
        store.ownedDice[diceId].isRolling = false
        console.log("Roll for #" + store.ownedDice[diceId].name + ": ", roll)
      }, 1000)
      return roll
    } catch (error) {
      console.log("Error: ", error)
      store.ownedDice[diceId].isRolling = false
      return 'failed'
    }
  },

  async getPriceForDice(qty) {
    try {
      let price = await this.diceContract.getMintingCost(qty)
      return price
    } catch (error) {
      console.log("Error: ", error)
    }
    return 0
  },

  async buyRandomDice(qty) {
    let value = this.getPriceForDice(qty)
    let gasLimit = 500_000 * qty
    try {
      const transaction = await this.diceContract.buyRandomDice(
        qty,
        {
          value: value,
          gasLimit: gasLimit
        }
      )
      this.watchTransaction(transaction)
      console.log(transaction)
      console.log('Minted new dice: ', qty)
      return true
    } catch (error) {
      console.log("Error: ", error)
    }
    return false
  },

  async watchTransaction(transaction) {
    const receipt = await transaction.wait()
    this.getOwnedDice()
    if (receipt) {
      alert ("You have new dice!")
    } else {
      alert ("We regret to inform you that your dice purchase request failed.")
    }
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

  async getOwnedDice() {
    let diceList = []
    try {
      diceList  = await this.diceContract.tokenListOfOwner(store.address)
    } catch (error) {
      console.log("Error: ", error)
    }
    console.log('Checking your dice count: ', diceList)
    diceList.forEach(async (dieId, index) => {
      try {
        let dieTraits = await this.getTraits(dieId)
        store.ownedDice[index] = this.makeDieObject(dieId, dieTraits)
        console.log('Dice loaded, lets play!', store.ownedDice)
      } catch (error) {
        console.log("Error: ", error)
      }
    }, this)
  },

  async getTraits(diceId) {
    try {
      let diceTraits = await this.diceContract.getTraits(diceId)
      return diceTraits
    } catch (error) {
      console.log("Error: ", error)
    }
  },

  makeDieObject(diceId, traits) {
    return {
      nftId: diceId,
      name: traits.name,
      sides: traits.sides,
      fgColor: traits.fgColor,
      bgColor: traits.bgColor,
      font: traits.font,
      lastRoll: Math.floor(Math.random() * traits.sides)
    }
  }

}
