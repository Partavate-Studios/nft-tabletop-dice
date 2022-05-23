import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "hardhat-gas-reporter";
import dotenv from "dotenv";
// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

dotenv.config();

import("./tasks/accounts");
import("./tasks/deploy");
import("./tasks/mint");
import("./tasks/roll");
import("./tasks/verify");
import("./tasks/setAccountsRecievable");

import { HardhatUserConfig } from "hardhat/config";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.6",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000
      }
    }
  },
  networks: {
    hardhat: {
    },
    localhost: {
      chainId: 1337
    },
    ganache: {
      chainId: 1337,
      url: process.env.GANACHE_RPC_URI,
      accounts:
        process.env.GANACHE_PRIVATE_KEY !== undefined ? [process.env.GANACHE_PRIVATE_KEY] : [],
    },
    rinkeby: {
      url: process.env.RINKEBY_GETH_URI,
      accounts:
        process.env.RINKEBY_GETH_PRIVATE_KEY !== undefined ? [process.env.RINKEBY_GETH_PRIVATE_KEY] : [],
    },
    mumbai: {
      chainId: 80001,
      url: process.env.MUMBAI_RPC_URI,
      accounts:
        process.env.MUMBAI_PRIVATE_KEY !== undefined ? [process.env.MUMBAI_PRIVATE_KEY] : [],
    },
    polygon: {
      chainId: 137,
      url: process.env.POLYGON_RPC_URI,
      accounts:
        process.env.POLYGON_PRIVATE_KEY !== undefined ? [process.env.POLYGON_PRIVATE_KEY] : [],
    },
  },
  gasReporter: {
    enabled: (process.env.REPORT_GAS) ? true : false,
    currency: "USD",
    //gasPrice: 44, // 2022.02.24 - Ethereum mainnet
    gasPriceApi: 'Binance',
    token: 'BNB',
    coinmarketcap: process.env.COINMARKETCAP_API_KEY, // API Key
  },
  etherscan: {
    apiKey: {
      rinkeby: process.env.ETHERSCAN_API_KEY,
      polygonMumbai: process.env.POLYSCAN_API_KEY,
      polygon: process.env.POLYSCAN_API_KEY,
    }
  }
};

export default config;