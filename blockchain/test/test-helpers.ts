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

export async function deployContractWithLibrary(name: string, library: string): Promise<Contract> {
    // First deploy the Library, since an address is required
    const LibraryPromise = hardhatEthers.getContractFactory(library);
    const libraryDeployed = await LibraryPromise.then((contractFactory) => contractFactory.deploy());

    const factoryOptions:FactoryOptions = {
      signer: await getTestWallet(),
      libraries: {
          [library]: libraryDeployed.address,
      }
    };

    return hardhatEthers
      .getContractFactory(name, factoryOptions)
      .then((contractFactory) => contractFactory.deploy());
}


export async function deployTestContract(name: string): Promise<Contract> {
  return hardhatEthers
    .getContractFactory(name, await getTestWallet())
    .then((contractFactory) => contractFactory.deploy());
}

export async function getTestWallet(): Promise<SignerWithAddress> {
  return (await hardhatEthers.getSigners())[0];
  //return waffle.provider.getWallets()[0];
}