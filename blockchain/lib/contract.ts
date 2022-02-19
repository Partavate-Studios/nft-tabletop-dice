import { Contract, ethers } from "ethers";
import { getContractAt } from "@nomiclabs/hardhat-ethers/internal/helpers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { env } from "./env";

export function getContract(
  name: string,
  hre: HardhatRuntimeEnvironment
): Promise<Contract> {
  // Use --network to source wallet keys from Hardhat
  return getContractAt(hre, name, env("NFT_CONTRACT_ADDRESS"));
}