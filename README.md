# Truffle Sample App
A simple, dockerized [Truffle](https://www.trufflesuite.com/) app that demonstrates tracking of  transactions using `events`.

A [Solidity](https://soliditylang.org/) contract [`SimpleStorage`](contracts/SimpleStorage.sol) was deployed to the `Rinkeby` network through [Alchemy](https://www.alchemyapi.io/).  This contract provides a `get` transaction that can be used to read and change an integer value named `StoredData`.  An event `valueChanged`, which tracks changes made to `StoredData`, emits each time the `set` transaction is sent to the network.

# How to run

There are two ways to run this app.  If you have installed [Metamask](https://metamask.io/), you'll be able to interact with the `SimpleStorage` contract on the `Rinkeby` network.  Alternatively, a dockerized [Ethereum simulator](ganache-cli) can be used instead.

## Using `ganache-cli`

1. Start [ganache-cli](https://github.com/trufflesuite/ganache-cli) server at port 8545 and Truffle app at port 3000
```
docker-compose up
```
2. Open `http://localhost:3000` in web broswer.

## Using `Rinkeby`

1. Create `.env` in the project root folder.  Put the following info into `env`.
```
REACT_APP_MNEMONIC="<<MNEMONIC of your MetaMask account>>"
REACT_APP_PROVIDER_URL="https://eth-rinkeby.alchemyapi.io/v2/-VTi1npdRo1HRQh2ciTXwoeqmp9YO5nC"
```

2. Change the `command` line of `truffleapp` in [docker-compose.yml](docker-compose.yml) to:
```
bash -c "truffle migrate --network ganache && export REACT_APP_USE_METAMASK="true" && yarn start"
```

3. Start the `truffleapp` container
```
docker-compose up
```
4. Open `http://localhost:3000` in web broswer.