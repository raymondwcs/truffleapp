# Truffle Sample App
A simple, dockerized [Truffle](https://www.trufflesuite.com/) app that demonstrates tracking of contract transactions.

A [Solidity](https://soliditylang.org/) contract [`SimpleStorage`](contracts/SimpleStorage.sol) was deployed to the `ropsten` network using the [Alchemy](https://www.alchemyapi.io/) service.  This contract offers a `get` and `set` transactions which can be used to read and change an integer value named `StoredData`.  An event `ValueChanged`, which tracks changes made to `StoredData`, emits each time the `set` transaction is sent to the network.

# How to run

There are two ways to run this app.  If you have installed [Metamask](https://metamask.io/), you'll be able to interact with the `SimpleStorage` contract in the `ropsten` network.  Alternatively, a dockerized [Ethereum simulator](ganache-cli) can be used instead.

## Steps

1. Start [ganache-cli](https://github.com/trufflesuite/ganache-cli) server at port 8545 and Truffle app at port 3000
```
docker-compose up
```
2. Open `http://localhost:3000` in web broswer.
