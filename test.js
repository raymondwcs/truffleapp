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

const get = async () => {
    let accounts = await web3.eth.getAccounts()
    console.log(`accounts: ${accounts}`)
    let instance = await SimpleStorage.deployed()
    let results = await instance.get()
    console.log(`StoredData: ${results.toNumber()}`)
}

const set = async () => {
    let accounts = await web3.eth.getAccounts()
    console.log(`accounts: ${accounts}`)
    let instance = await SimpleStorage.deployed()
    let x = getRandomInt(9999)
    console.log(`Set storedData to ${x}...`)
    await instance.set(x, { from: accounts[0] })
}

var simpleStorageInstance
SimpleStorage.deployed().then(instance => {
    simpleStorageInstance = instance
    web3.eth.getAccounts().then(accounts => {
        let x = getRandomInt(9999)
        console.log(`Set storedData to ${x}`)
        instance.set(x, { from: accounts[0] }).then(results => {
            console.dir(results)
            console.log(`set(${x}) done`)
            return instance
        }).then(instance => {
            console.log(`Get storedData`)
            instance.get().then(results => {
                console.log(`storedData is now ${results.toNumber()}`)
                exit(0)
            })
        }).catch(error => {
            console.error(error.message)
            exit(-1)
        })
    })
}).catch(error => {
    console.error(error.message)
    exit(-1)
})
