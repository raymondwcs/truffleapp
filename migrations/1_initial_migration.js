var Migrations = artifacts.require("./SimpleStorage.sol");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
};
