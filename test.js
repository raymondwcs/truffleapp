require('dotenv').config();
const API_URL = process.env.API_URL;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const path = require('path');
const SimpleStorageABI = require(path.join(__dirname, './src/contracts/SimpleStorage'))
const Web3 = require('web3');
const HDWalletProvider = require("@truffle/hdwallet-provider");
const provider = new HDWalletProvider(PRIVATE_KEY, API_URL)

const contract = require("@truffle/contract");
const { exit } = require('process');

const web3 = new Web3(provider)
const SimpleStorage = contract(SimpleStorageABI);
SimpleStorage.setProvider(provider);

const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
}

const get = async () => {
    let instance = await SimpleStorage.deployed()
    let results = await instance.get()
    console.log(`StoredData: ${results.toNumber()}`)
}

const set = async () => {
    let instance = await SimpleStorage.deployed()
    let x = getRandomInt(9999)
    console.log(`Set storedData to ${x}...`)
    await instance.set(x, { from: PUBLIC_KEY })
}

SimpleStorage.deployed().then(instance => {
    let x = getRandomInt(9999)
    console.log(`Set storedData to ${x}`)
    instance.set(x, { from: PUBLIC_KEY }).then(results => {
        console.dir(results)
        console.log(`set() done`)
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
}).catch(error => {
    console.error(error.message)
    exit(-1)
})