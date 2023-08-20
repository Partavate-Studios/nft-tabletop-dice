import { Contract, ethers } from "ethers";
import { getContractAt } from "@nomiclabs/hardhat-ethers/internal/helpers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { getDeployment } from "./logDeployment"

export function getContract(
  name: string,
  hre: HardhatRuntimeEnvironment
): Promise<Contract> {
  const chainId = hre.network.config.chainId
  const diceContractAddress = getDeployment(chainId)
  console.log('address is: ',diceContractAddress)
  return getContractAt(hre, name, diceContractAddress);
}