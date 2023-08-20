import { task } from "hardhat/config"
import { logDeployment } from "../lib/logDeployment"
import constructorArgs from "../lib/arguments"
// const constructorArgs = require("./arguments");

task("deploy", "Deploy NFT contract").setAction(async (_, hre) => {
  const DiceFactory = await hre.ethers.getContractFactory(
    "TabletopDiceNFT"
  )
  const dice = await DiceFactory.deploy(...constructorArgs)

  await dice.deployed()
  const name = await dice.name()
  process.stdout.write(`Contract name: ${name}\n`)
  process.stdout.write(`Contract address: ${dice.address}\n`)

  let chaindata = await hre.ethers.provider.getNetwork()
  logDeployment(chaindata.chainId, dice.address)

  return dice.address
})

