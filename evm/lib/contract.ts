import { Contract, ethers } from "ethers";
import { getContractAt } from "@nomiclabs/hardhat-ethers/internal/helpers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { env } from "./env";
import { default as Addresses } from "../addresses/published-addresses.json"

type addressKeyType = keyof typeof Addresses;

export function getContract(
  name: string,
  hre: HardhatRuntimeEnvironment
): Promise<Contract> {
  const chainId = String(hre.network.config.chainId) as addressKeyType
  const diceContractAddress = Addresses[chainId]
  console.log('address is: ',diceContractAddress)
  return getContractAt(hre, name, diceContractAddress);
}