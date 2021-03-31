const path = require("path");
require('dotenv').config()
const HDWalletProvider = require("@truffle/hdwallet-provider");
const { REACT_APP_PROVIDER_URL, REACT_APP_MNEMONIC } = process.env;

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "/src/build/contracts"),
  networks: {
    development: {
      port: 8545
    },
    ganache: {
      host: "ganache-cli",
      port: 8545,
      network_id: "*"
    },
    geth: {
      host: "http://127.0.0.1",
      port: 8545,
      network_id: "3"
    },
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(REACT_APP_MNEMONIC, REACT_APP_PROVIDER_URL)
      },
      network_id: 4
    }
  }
};
