import { task, types } from "hardhat/config";
import { Contract } from "ethers";
import { env } from "../lib/env";
import { getContract } from "../lib/contract";
import { tsvToJson, jsonToTsv } from "../lib/tsvJson"
import * as fs from "fs"
import { any } from "hardhat/internal/core/params/argumentTypes";

// Minting Process for Batch Issues:
// Export a spreadsheet to a TSV with `email<tab>address` (No Header row) to ../addresses/
// const addressesTSV = "addresses/mint-recipients-dygycon.tsv"
const addressesTSV = "addresses/mumbai-test.tsv"
const countPerRecipient = 1;

task("mint-event-batch", "Batch Recipients for NFT Mint")
  .setAction(async (taskArgs, hre) => {
    const tsv = fs.readFileSync(addressesTSV, {encoding:'utf8', flag:'r'});
    var recipientList: Array<Array<string>> = tsvToJson(tsv);
    
    await Promise.all(recipientList.map(async (entry: Array<string>, index: number) => {

      recipientList[index][2] = await getContract("TabletopDiceNFT", hre)
        .then(async (contract: Contract) => {
          let email = entry[0];
          let addr = entry[1];
          const transaction = await contract.mintRandomDice(
            countPerRecipient,
            addr,
            { gasLimit: 700000 * countPerRecipient }
          );
          return transaction.wait();
        })
        .then((receipt: any) => {
          return `https://polygonscan.com/tx/${receipt.transactionHash}`;
        })
        .catch(e => "ERROR:" + e.message);

    }));

    // Prints a TSV of `email<tab>address<tab>polygonscan-tx-url|error`
    // Paste this into Thunderbird MailMerge-P
    console.log(jsonToTsv(recipientList))
     
  });