import { task, types } from "hardhat/config";
import { Contract } from "ethers";
import { getContract } from "../lib/contract";


task("add-sides", "Add a possible number of sides")
  .addParam("sides", "number of sides", 20, types.string)
  .setAction(async (taskArgs, hre) => {
  return getContract("TabletopDiceNFT", hre)
    .then((contract: Contract) => {
      const result = contract.addPossibleSides(
        taskArgs.sides,
        { gasLimit: 500_000 }
      );
      return result;
    })
    .then((result: number) => {
      console.log("The response: ", result, "\n");
    })
    .catch(e => console.log("error", e.message));
});


