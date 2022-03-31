import { task, types } from "hardhat/config";
import { Contract } from "ethers";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { env } from "../lib/env";
import { getContract } from "../lib/contract";

task("deploy-all-contracts", "Deploy NFT contract").setAction(async (_, hre) => {
  /*
  const DiceLibraryFactory = await hre.ethers.getContractFactory("DiceLibrary");
  const diceLibrary = await DiceLibraryFactory.deploy();
  await diceLibrary.deployed();
  console.log("DiceLibrary deployed to:", diceLibrary.address);

  const RandomNameFactory = await hre.ethers.getContractFactory("RandomNameLibrary");
  const randomNameLibrary = await RandomNameFactory.deploy();
  await randomNameLibrary.deployed();
  console.log("RandomNameLibrary deployed to:", randomNameLibrary.address);

  const diceOptions = {
    libraries: {
      "DiceLibrary": diceLibrary.address,
      "RandomNameLibrary": randomNameLibrary.address
    }
  };

  console.log("Reminder: Update the library address in \"deploy\" task!!");
  */
  const DiceFactory = await hre.ethers.getContractFactory(
    "TabletopDiceNFT"
  );
  const dice = await DiceFactory.deploy(
    ["Snake", "Hicks", "Railroad", "Jack", "Benny", "Puppy", "Six", "Gear", "Hustle", "Hipster",
    "Phoebe", "Jake", "Red", "Easy", "North", "East", "South", "West", "Fever", "Square",
    "Holding", "Damage", "Dungeon", "Yo", "Brooklyn", "Little", "Metal", "Iron", "Ace",
    "Bigfoot", "Down", "Up", "Rodeo", "Paladin", "Mage", "Devil", "Goddess", "Hack", "Midnight"],
    ["Snake", "Hicks", "Railroad", "Jack", "Benny", "Puppy", "Six", "Gear", "Hustle", "Hipster",
    "Phoebe", "Jake", "Red", "Easy", "North", "East", "South", "West", "Fever", "Square",
    "Holding", "Damage", "Dungeon", "Yo", "Brooklyn", "Little", "Metal", "Iron", "Ace",
    "Bigfoot", "Down", "Up", "Rodeo", "Paladin", "Mage", "Devil", "Goddess", "Hack", "Midnight",
    "🎲", "💥", "🦍", "🐻", "🐅", "🦂", "🐉", "🏦", "🪐", "🚀", "🏹" ]);
  await dice.deployed();
  const name = await dice.name();
  console.log('name: ', name);
  process.stdout.write(`Contract address: ${dice.address}\n`);


  return dice.address;
});

// Deploys only the outer Dice.sol. // TODO: Actually persist owner storage
task("deploy", "Deploy NFT contract").setAction(async (_, hre) => {
  return hre.ethers
    .getContractFactory("TabletopDiceNFT", {
      libraries: {
          "DiceLibrary": "0x73668aF7cC654634cc4EE81da6938416Eb45F4f6",
      }})
    .then((contractFactory) => contractFactory.deploy())
    .then((result) => {
      process.stdout.write(`Contract address: ${result.address}\n`);
      // TODO: Update contract address in .env
    });
});
