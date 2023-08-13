require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.0",
      },
      {
        version: "0.7.0",
      },
      {
        version: "0.6.6",
      },
      {
        version: "0.6.0",
      },
    ],
  },
  networks: {
    'truffle-dashboard': {
      url: "http://localhost:24012/rpc",
      timeout: 400_000
    },
    hardhat: {
      forking: {
        url: "https://rpc.goerli.eth.gateway.fm",
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
