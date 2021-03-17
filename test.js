require('dotenv').config();
const API_URL = process.env.API_URL;
const MNEMONIC = process.env.MNEMONIC;

const { exit } = require('process');
const path = require('path');
const SimpleStorageABI = require(path.join(__dirname, './src/build/contracts/SimpleStorage'))
const Web3 = require('web3');
const contract = require("@truffle/contract");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const provider = new HDWalletProvider({
    mnemonic: {
        phrase: MNEMONIC
    },
    providerOrUrl: API_URL
})
const web3 = new Web3(provider)

const SimpleStorage = contract(SimpleStorageABI);
SimpleStorage.setProvider(provider);

const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
}

const main = async () => {
    try {
        let simpleStorage = await SimpleStorage.deployed()
        let accounts = await web3.eth.getAccounts()
        let storedData = await simpleStorage.storedData()
        console.log(`storedData = ${storedData.toNumber()}`)

        let x = getRandomInt(9999)
        console.log(`Set storedData to ${x}`)
        let tx = await simpleStorage.set(x, { from: accounts[0] })
        console.log(tx)

        storedData = await simpleStorage.storedData()
        console.log(`storedData = ${storedData.toNumber()}`)

        exit(0)
    } catch (error) {
        console.error(error.message)
        exit(-1)
    }
}

main()