import { task, types } from "hardhat/config";
import { Contract } from "ethers";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { env } from "../lib/env";
import { getContract } from "../lib/contract";


task("mint-die", "Mint Dice NFT")
  .addParam("owner", "Who will own the NFT", env("ETH_PUBLIC_KEY"), types.string)
  .addParam("name", "The Name of the Die NFT", "Default 🎲", types.string)
  .addParam("sides", "The Number of Faces", 20, types.int)
  .addParam("styleId", "The Style Number (0-30)", 0, types.int)
  .addParam("font", "The Font Id", 1, types.int)
  .setAction(async (taskArgs, hre) => {
    return getContract("TabletopDiceNFT", hre)
      .then((contract: Contract) => {
        const result = contract.mintDie(
          taskArgs.name,
          taskArgs.sides,
          taskArgs.styleId,
          taskArgs.font,
          taskArgs.owner,
          { gasLimit: 500_000 }
        );
        return result;
      })
      .then((result: number) => {
        console.log("The new tokenId is: ", result, "\n");
      })
      .catch(e => console.log("error", e.message));
  });



  task("mint-batch", "Mint Dice Batch")
  .addParam("owner", "Who will own the NFT", env("ETH_PUBLIC_KEY"), types.string)
  .addParam("count", "The number of Dice", 5, types.int)
  .setAction(async (taskArgs, hre) => {
    return getContract("TabletopDiceNFT", hre)
      .then(async (contract: Contract) => {
        const transaction = await contract.mintRandomDice(
          taskArgs.count,
          taskArgs.owner,
          { gasLimit: 100_000 * taskArgs.count }
        );
        return transaction.wait();
      })
      .then((receipt: any) => {
        console.log("Tokens minted: ", taskArgs.count, "\n");
        console.log("Receipt: ", receipt, "\n");
      })
      .catch(e => console.log("error", e.message));
  });