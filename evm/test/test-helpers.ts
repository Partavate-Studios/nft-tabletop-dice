import sinon from "sinon";
import chai from "chai";
import sinonChai from "sinon-chai";
import { ethers as hardhatEthers, waffle } from "hardhat";
import { Contract, Wallet } from "ethers";
import type { FactoryOptions } from "@nomiclabs/hardhat-ethers/types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

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
  //return waffle.provider.getWallets()[0];
}