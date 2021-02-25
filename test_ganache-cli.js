const path = require('path');
var SimpleStorageABI = require(path.join(__dirname, './src/contracts/SimpleStorage'))
var Web3 = require('web3');
var provider = new Web3.providers.HttpProvider("http://ganache-cli:8545");
var contract = require("@truffle/contract");
const { exit } = require('process');

var web3 = new Web3(provider)
var SimpleStorage = contract(SimpleStorageABI);
SimpleStorage.setProvider(provider);
web3.eth.getAccounts((error, accounts) => {
    SimpleStorage.deployed().then((instance) => {
        return instance.set(5, { from: accounts[0] })
    }).then((results) => {
        console.log(results)
        exit()
    })
})
