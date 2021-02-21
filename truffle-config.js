const path = require("path");

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
    }
  }
};
