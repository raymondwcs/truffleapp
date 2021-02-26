import Web3 from 'web3'
// import HDWalletProvider from '@truffle/hdwallet-provider'
const HDWalletProvider = require("@truffle/hdwallet-provider")
require('dotenv').config({ path: "../.env" })

let getWeb3 = new Promise(function (resolve, reject) {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    // window.addEventListener('load', function () {
    window.addEventListener('DOMContentLoaded', () => {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            window.ethereum.enable();   // seek Metamask account use permission 

            let results = {
                web3: window.web3
            }

            console.log('Injected web3 detected.');

            resolve(results)
        } else {
            // Use .env (env-sample as example) to determine provider
            console.log(`MNEMONIC = ${process.env.REACT_APP_MNEMONIC}`)
            var provider = new HDWalletProvider({
                mnemonic: {
                    phrase: process.env.REACT_APP_MNEMONIC
                },
                providerOrUrl: process.env.REACT_APP_API_URL
            })
            let web3 = new Web3(provider)
            let results = {
                web3: web3
            }

            console.log(`No web3 instance injected, using ${process.env.REACT_APP_API_URL}`);

            resolve(results)
        }
    })
})

export default getWeb3
