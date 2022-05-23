import { task, types } from "hardhat/config";
import { Contract } from "ethers";
import { getContract } from "../lib/contract";

task("setAccountsRecievable")
  .addParam("address", "Accounts Recievable Address", 0, types.string)
  .setAction(async (taskArgs, hre) => {
  console.log("Changing Accounts Recievable #", taskArgs.address);

  return getContract("TabletopDiceNFT", hre)
    .then((contract: Contract) => {
      const result = contract.setAccountsRecievable(taskArgs.address);
      return result;
    })
    .then((result: number) => {
      console.log("Transaction response: ", result, "\n");
    })
    .catch(e => console.log(e.message));
});


