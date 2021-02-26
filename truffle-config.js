const path = require("path");
require('dotenv').config()
const HDWalletProvider = require("@truffle/hdwallet-provider");
const { API_URL, MNEMONIC } = process.env;

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "/src/contracts"),
  networks: {
    develop: {
      port: 8545
    },
    ganache: {
      host: "ganache-cli",
      port: 8545,
      network_id: "*"
    },
    ropsten: {
      provider: function () {
        return new HDWalletProvider(MNEMONIC, API_URL)
      },
      network_id: 3
    }
  }
};
