import { deployContract, getTestWallet } from "./test-helpers";
import { run } from "hardhat";
import { expect } from "chai";
import sinon from "sinon";

describe("tasks", () => {
  beforeEach(async () => {
    // await hre.ethers.getSigners()
  });

  describe("deploy", () => {
    //TODO: seems strange to test this but also not use it to deploy in the tests themselves?
    it("calls through and returns the transaction object", async () => {
      sinon.stub(process.stdout, "write");

      await run("deploy");
      await expect(process.stdout.write).to.have.been.calledWithMatch(
        /Contract address: 0x[0-9a-fA-F]{40}/
      );
    });
  });

  describe("mint-die", () => {
    beforeEach(async () => {
      const deployedContract = await deployContract("TabletopDiceNFT");

      process.env.NFT_CONTRACT_ADDRESS = deployedContract.address;
    });

    it("calls through and returns the transaction object", async () => {
      const wallet = await getTestWallet();
      sinon.stub(process.stdout, "write");

      await run("mint-die", {
          name: "Le 🎲",
          sides: 20,
          fgColor: "fffff",
          bgColor: "00134e",
          font: 1,
          owner: wallet.address,
        });

      // 3 Tx, each with logged messages (REMOVING console.log will break this!)
      await expect(process.stdout.write).to.have.been.calledWithMatch(
        /(Creating Die .*|Created NFT:.*|TX hash: 0x[0-9a-fA-F]{40})/
      );
    });
  });
});