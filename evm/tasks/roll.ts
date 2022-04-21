import { task, types } from "hardhat/config";
import { Contract } from "ethers";
import { getContract } from "../lib/contract";

task("roll", "Roll a die that I own")
  .addParam("tokenid", "NFT token id", 0, types.int)
  .addParam("nonce", "NFT token id", 3, types.int)
  .setAction(async (taskArgs, hre) => {
    console.log("Rolling Dice on NFT #", taskArgs.tokenid);

    return getContract("TabletopDiceNFT", hre)
      .then((contract: Contract) => {
        const result = contract.getRoll(taskArgs.tokenid, taskArgs.nonce);
        return result;
      })
      .then((result: number) => {
        console.log("The roll was: ", result, "\n");
      })
      .catch(error => console.log(error.error));
  });
