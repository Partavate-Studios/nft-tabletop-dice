import { store } from './store.js'
import { ethers, BigNumber } from "ethers"
import Dice from '../../evm/artifacts/contracts/Dice.sol/TabletopDiceNFT.json'
import Addresses from '../../evm/addresses/published-addresses.json'
import detectEthereumProvider from '@metamask/detect-provider'

export const web3dice = {
  provider: null,
  signer: null,
  diceContract: null,

  diceContractAddress: null,

  log(msg) {
    console.log ('Message: ', msg)
    store.alert = msg
  },

  async init() {
    try {
      let provider = await detectEthereumProvider()
      this.provider = new ethers.providers.Web3Provider(provider, "any")
    } catch (e) {
      this.log(e.message)
      return
    }


    store.web3.hasWallet = true
    console.log ('Wallet provider discovered.')
  },

  async connect() {
    try {
      store.web3.accounts = await this.provider.send("eth_requestAccounts", [])
    } catch(e) {
      this.log(e.message)
      return
    }
    console.log ('Wallet connected.')

    await this.getSigner()

    window.ethereum.on('accountsChanged', async () => {
      location.reload()
    })
    window.ethereum.on('disconnect', async () => {
      location.reload()
    })

    await this.getChainData()

    window.ethereum.on('chainChanged', async () => {
      location.reload()
    })
  },


  async getSigner() {
    store.web3.isConnected = false
    try {
      this.signer = await this.provider.getSigner()
      store.web3.activeAccount = await this.signer.getAddress()
    } catch (e) {
      this.log(e.message)
      return
    }
    store.web3.isConnected = true
    console.log('Signer address found: ', store.web3.activeAccount)
  },

  async getChainData() {
    store.web3.validNetwork = false
    try {
      store.web3.chain = await this.provider.getNetwork()
    } catch (e) {
      this.log(e.message)
      return
    }
    console.log ('Compatible EVM network discovered.')


    //Choose the contract address based on the chainId
    if (String(store.web3.chain.chainId) in Addresses) {
      this.diceContractAddress = Addresses[store.web3.chain.chainId]
      console.log ('ChainID ' + store.web3.chain.chainId +' is a supprted network.')
    } else {
      console.log('no known contract address, is this a valid network?')
      return
    }
    store.web3.validNetwork = true

    try {
      this.diceContract = new ethers.Contract(this.diceContractAddress, Dice.abi, this.signer)
      this.dieContract
      this.diceContract.connect(this.signer)
    } catch(e) {
      this.log(e.message)
      return
    }
    console.log('Connected to contract: ', await this.diceContract.address)

    store.web3.blockExplorer = this.getBlockExplorerUrl()
    store.web3.openSea = this.getOpenSeaUrl()
    await this.preloadDiceData()
  },

  async preloadDiceData() {
    try {
      await this.refreshDiceData()
      await this.getOwnedDice()
    } catch (e) {
      this.log(e.message)
      return
    }

    this.provider.on("block", async () => {
      if (store.web3.isConnected) {
        await this.refreshDiceData()
      }
    })
  },

  async refreshDiceData() {
    let balance = await this.provider.getBalance(store.web3.activeAccount)
    store.web3.balance = ethers.utils.formatEther(balance)
    console.log('Balance: ', store.web3.balance)

    let weiPrice = await this.diceContract.getMintingCost()
    store.web3.weiPrice = weiPrice
    store.web3.price = ethers.utils.formatEther(weiPrice)
    console.log('Current die cost: ' + store.web3.price + ' Matic each')
  },

  async switchNetwork() {
    const chainId = '0x89'
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainId }]
      });
    } catch (e) {
      console.log('Error requesting network.', e.message)
      if (confirm('Polygon Mainnet was not found. Would you like us to try to add it?')) {
        let data = [{
          chainId: chainId,
          chainName: 'Polygon Mainnet',
          nativeCurrency: {
            name: 'MATIC',
            symbol: 'MATIC',
            decimals: 18
          },
          rpcUrls: ['https://polygon-rpc.com'],
          blockExplorerUrls: ['https://polygonscan.com/']
        }]
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: data
          });
        } catch (e) {
          console.log('Error requesting network.', e.message)
          store.alert = 'We were unable to add the network.'
        }
      }
    }
  },

  async delayedRoll(diceId) {
    let rollDelay = Math.floor(Math.random() * 20)
    setTimeout(() => {this.getRollFromContract(diceId)}, rollDelay)
  },

  async getRollFromContract(diceId) {
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
    } catch (e) {
      this.log("Error: ", e.message)
      store.ownedDice[diceId].isRolling = false
      return 'failed'
    }
  },

  async buyRandomDice(qty) {
    let price = BigNumber.from(store.web3.weiPrice).mul(qty)
    let estimate = 0
    try {
      estimate = await this.diceContract.estimateGas.buyRandomDice(qty, {value: price})
    } catch (e) {
      this.log(e.message)
      return
    }
    let lowerBound = (500_000 * qty)
    let gasLimit = (estimate > lowerBound) ? estimate + 100_000 : lowerBound + 100_000
    try {
      const transaction = await this.diceContract.buyRandomDice(
        qty,
        {
          value: price,
          gasLimit: gasLimit
        }
      )
      this.watchTransaction(transaction)
      console.log('Waiting on purchase transacton: ' + transaction)
      this.log('Minting ' + qty +  'new dice: ')
      return true
    } catch (error) {
      this.log("Error: ", error)
    }
    return false
  },

  async watchTransaction(transaction) {
    store.alert = "Your dice order was submitted."
    const receipt = await transaction.wait()
    if (receipt) {
      this.log("Your new dice have arrived!")
      this.getOwnedDice()
    } else {
      this.log("Regretfully, your dice minting failed.")
    }
  },

  async getOwnedDice() {
    let diceList = []
    try {
      diceList  = await this.diceContract.tokenListOfOwner(store.web3.activeAccount)
    } catch (e) {
      this.log('Error loading your dice.')
      console.log("Error: ", e.message)
      return
    }
    console.log('Dice found, loading details: ', diceList)
    diceList.forEach(async (dieId, index) => {
      try {
        let dieTraits = await this.getTraits(dieId)
        store.addDie(this.makeDieObject(dieId, dieTraits))
      } catch (e) {
        console.log("Error: ", e.message)
        return
      }
    }, this)
    console.log('Dice loaded, lets play!', typeof store.ownedDice)
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
      lastRoll: diceId % traits.sides + 1,
      isRolling: false
    }
  },


  getBlockExplorerUrl () {
    //Polygon Mumbai Test Network
    if (String(store.web3.chain.chainId) == '80001') {
      return 'https://mumbai.polygonscan.com/address/' + this.diceContractAddress
    }
    //Polygon Main Net
    if (String(store.web3.chain.chainId) == '137') {
      return 'https://polygonscan.com/address/' + this.diceContractAddress
    }
    return null
  },

  getOpenSeaUrl () {
    //Polygon Mumbai Test Network
    if (String(store.web3.chain.chainId) == '80001') {
      return 'https://testnets.opensea.io/assets?search%5Bquery%5D=' + this.diceContractAddress
    }
    //Polygon Main Net
    if (String(store.web3.chain.chainId) == '137') {
      return 'https://opensea.io/collection/polydice'
    }
    return null
  },

}
