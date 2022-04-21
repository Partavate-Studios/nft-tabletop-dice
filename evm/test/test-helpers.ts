import sinon from "sinon";
import chai from "chai";
import sinonChai from "sinon-chai";
import chaiAsPromised from "chai-as-promised";
import { ethers as hardhatEthers } from "hardhat";
import { Contract, Transaction, providers, utils } from "ethers";
import type { FactoryOptions } from "@nomiclabs/hardhat-ethers/types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { waffleChai } from "./waffle-bits/waffle-chai";

chai.use(chaiAsPromised);
chai.use(waffleChai);
chai.use(sinonChai);

afterEach(() => {
  sinon.restore();
});

export async function deployContract(name: string): Promise<Contract> {
  const DiceFactory = await hardhatEthers.getContractFactory(
    "TabletopDiceNFT"
  )
  const dice = await DiceFactory.deploy(
    ["Benny"],
    ["Hicks"])

  return await dice.deployed();
}

export async function getTestWallet(): Promise<SignerWithAddress> {
  return (await hardhatEthers.getSigners())[0];
}
