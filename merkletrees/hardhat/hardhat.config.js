require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.10",
  localhost: {
    timeout: 100_000
  },
  networks: {
  'truffle-dashboard': {
    url: "http://localhost:24012/rpc",
    timeout: 400_000
  },
  hardhat: {
    forking: {
      url: "https://sepolia-rpc.scroll.io/",
    },
  }
},
settings: {
  optimizer: {
    enabled: true,
    runs: 200,
  },
  evmVersion: "istanbul",
  debug: {
    // Enable Solidity stack traces
    stacktrace: true,
  },
},
};