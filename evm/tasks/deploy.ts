import { task, types } from "hardhat/config"
import { Contract } from "ethers"
import { TransactionResponse } from "@ethersproject/abstract-provider"
import { env } from "../lib/env"
import { getContract } from "../lib/contract"
import * as fs from "fs"
import { string } from "hardhat/internal/core/params/argumentTypes"

task("deploy", "Deploy NFT contract").setAction(async (_, hre) => {
  const DiceFactory = await hre.ethers.getContractFactory(
    "TabletopDiceNFT"
  )
  const dice = await DiceFactory.deploy(
    ["Snake", "Hicks", "Railroad", "Jack", "Benny", "Puppy", "Six", "Gear", "Hustle", "Hipster",
    "Phoebe", "Jake", "Red", "Easy", "North", "East", "South", "West", "Fever", "Square",
    "Holding", "Damage", "Dungeon", "Yo", "Brooklyn", "Little", "Metal", "Iron", "Ace",
    "Bigfoot", "Down", "Up", "Rodeo", "Paladin", "Mage", "Devil", "Goddess", "Hack", "Midnight"],
    ["Snake", "Hicks", "Railroad", "Jack", "Benny", "Puppy", "Six", "Gear", "Hustle", "Hipster",
    "Phoebe", "Jake", "Red", "Easy", "North", "East", "South", "West", "Fever", "Square",
    "Holding", "Damage", "Dungeon", "Yo", "Brooklyn", "Little", "Metal", "Iron", "Ace",
    "Bigfoot", "Down", "Up", "Rodeo", "Paladin", "Mage", "Devil", "Goddess", "Hack", "Midnight",
    "🎲", "💥", "🦍", "🐻", "🐅", "🦂", "🐉", "🏦", "🪐", "🚀", "🏹" ])
  await dice.deployed()
  const name = await dice.name()
  console.log('name: ', name)
  process.stdout.write(`Contract address: ${dice.address}\n`)

  let chaindata = await hre.ethers.provider.getNetwork()
  let addressDirectory = 'addresses'
  let addressFile = 'published-addresses.json'
  let filePath = addressDirectory + '/' + addressFile
  if (!fs.existsSync(addressDirectory)){
      fs.mkdirSync(addressDirectory);
  }
  let addressData: {[key: string]: string} = {}
  if (fs.existsSync(filePath)){
    let data = fs.readFileSync(filePath, {encoding:'utf8', flag:'r'});
    addressData = JSON.parse(data)
  }
  addressData[chaindata.chainId.toString()] = dice.address
  fs.writeFileSync(filePath, JSON.stringify(addressData)+'\n')

  return dice.address
})

