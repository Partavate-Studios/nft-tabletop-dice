import * as dotenv from "dotenv";
import { task } from "hardhat/config";

dotenv.config();

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (let i = 0; i < accounts.length; i++) {
    console.log(`\nAccount ${i}: ${accounts[i].address}`);
    console.log(`Balance: ${hre.ethers.utils.formatEther(await accounts[i].getBalance())} (ETH)`);
  }
});

