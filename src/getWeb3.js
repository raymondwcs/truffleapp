import Web3 from 'web3'
// require('dotenv').config({ path: '../.env' })
// const { API_URL, MNEMONIC } = process.env;

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
            console.log(`provider: ${process.env.REACT_APP_API_URL}`)
            var provider = new Web3.providers.HttpProvider(process.env.REACT_APP_API_URL || 'http://127.0.0.1:8545')
            // var provider = new Web3.providers.HttpProvider("https://eth-ropsten.alchemyapi.io/v2/fMiAOEeNXmbi-ZsNDwTVZKlCnMs5RXLS")

            web3 = new Web3(provider)

            results = {
                web3: web3
            }

            console.log('No web3 instance injected, using Local web3.');

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
