import { task } from "hardhat/config"
import { logDeployment } from "../lib/logDeployment"

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
  process.stdout.write(`Contract name: ${name}\n`)
  process.stdout.write(`Contract address: ${dice.address}\n`)

  let chaindata = await hre.ethers.provider.getNetwork()
  logDeployment(chaindata.chainId, dice.address)

  return dice.address
})

