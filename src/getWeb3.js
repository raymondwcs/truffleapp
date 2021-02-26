import Web3 from 'web3'
// import HDWalletProvider from '@truffle/hdwallet-provider'
const HDWalletProvider = require("@truffle/hdwallet-provider")
require('dotenv').config({ path: "../.env" })

let getWeb3 = new Promise(function (resolve, reject) {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener('load', function () {
        var results
        var web3 = window.web3

        // Checking if Web3 has been injected by the browser (Mist/MetaMask)
        if (typeof web3 !== 'undefined') {
            if (window.ethereum != null) {
                web3 = new Web3(window.ethereum);
                window.ethereum.enable()
                    .then(console.log(`window.ethereum.enabled() succeed!`))
                    .catch(error => console.log(error))
                /*
                try {
                  // Request account access if needed
                  await window.ethereum.enable();
                  // Acccounts now exposed
                } catch (error) {
                  // User denied account access...
                }
                */
            }
            // Use Mist/MetaMask's provider.
            web3 = new Web3(web3.currentProvider)

            results = {
                web3: web3
            }

            console.log('Injected web3 detected.');

            resolve(results)
        } else {
            // Fallback to localhost if no web3 injection. We've configured this to
            // use the development console's port by default.
            // var provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545')
            // web3 = new Web3(provider)
            console.log(`MNEMONIC = ${process.env.REACT_APP_MNEMONIC}`)
            var provider = new HDWalletProvider({
                mnemonic: {
                    phrase: process.env.REACT_APP_MNEMONIC
                },
                providerOrUrl: process.env.REACT_APP_API_URL
            })
            web3 = new Web3(provider)
            results = {
                web3: web3
            }

            console.log(`No web3 instance injected, using ${process.env.REACT_APP_API_URL}`);

            // optional for HTTPProviders, but if you want to set your own web3 that is
            // different than HttpProvider.
            // Please uncomment below.
            // if (window.moesif) {
            //   window.moesif.useWeb3(web3);
            // }

            resolve(results)
        }
    })
})

export default getWeb3
