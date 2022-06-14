import { task, types } from "hardhat/config";
import { Contract } from "ethers";
import { env } from "../lib/env";
import { getContract } from "../lib/contract";
import { tsvToJson, jsonToTsv, jsonToTsvLine } from "../lib/tsvJson"
import * as fs from "fs"

// Minting Process for Batch Issues:
// Export a spreadsheet to a TSV with `email<tab>address` (No Header row) to ../addresses/
// const addressesTSV = "addresses/mint-recipients-dygycon.tsv"
const addressesTSV = "addresses/mumbai-test.tsv"
type MintResult = {
  email: string;
  wallet: string;
  explorerUrl?: string;
  error?: string;
};

task("mint-event-batch", "Batch Recipients for NFT Mint")
  .addParam("count", "The number of Dice to issue", 1, types.int)
  .addParam('addressFile', 'TSV file with "email<tab>walletAddress" on each row. No headers.')
  .addParam('outputFile', "Path to save resulting transactions to (as TSV)")
  .setAction(async (taskArgs, hre) => {

    const tsv = fs.readFileSync(taskArgs.addressFile, {encoding:'utf8', flag:'r'});
    var recipientList: Array<Array<string>> = tsvToJson(tsv);
    var mintResults: Array<MintResult> = [];
    
    await getContract("TabletopDiceNFT", hre)
    .then(async (contract: Contract) => {
      for (const recipient of recipientList) {
        let mintRes: MintResult = {
          email: recipient[0],
          wallet: recipient[1],
          explorerUrl: '', // Needed for TSV positioning
          error: ''
        }
        mintResults.push(await mintToRecipient(contract, mintRes, taskArgs.count));
      }
      return mintResults;
    })
    .then((mintResults: Array<MintResult>) => {
      console.log("Minting Results:");
      console.log(jsonToTsv(mintResults));
    })
    .catch(e => console.log("Error Invoking Contract: ", e.message));

    // This has to happen sequentially due to EVM API, so don't use in Promise.all(Array.map())
    async function mintToRecipient(contract: Contract, mintRes: MintResult, count: number) {
      try {
        console.log(`Minting to ${mintRes['wallet']}...`)
        const transaction = await contract.mintRandomDice(
          count,
          mintRes['wallet'],
          { gasLimit: 700000 * count }
        );
        const tx = await transaction.wait();
        // TODO: Use hardhat-etherscan to get correct network URL. I spent 2 hours trying :(
        mintRes['explorerUrl'] = `https://polygonscan.com/tx/${tx.transactionHash}`;
      } catch (e) {
        console.log(`ERROR MINTING: ${e}`)
        mintRes['error'] = (e as Error).message;
      } finally {
        // Print TSV row of this result
        fs.appendFileSync(taskArgs.outputFile, jsonToTsvLine(mintRes))
        return mintRes;
      }
    }

     
  });