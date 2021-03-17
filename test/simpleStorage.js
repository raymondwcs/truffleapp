const SimpleStorage = artifacts.require("SimpleStorage");

// Import utilities from Test Helpers
const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

const newValue = 1987

contract("1st Coupon test", async accounts => {
    it(`store ${newValue} and verify result`, async () => {
        let instance = await SimpleStorage.deployed()

        console.log(`accounts: ${accounts[0]}`)

        let storedData = await instance.storedData()
        console.log(`storedData = ${storedData.toNumber()}`)

        const BN = web3.utils.BN;

        let receipt = await instance.set(newValue, { from: accounts[0] })
        expectEvent(receipt, 'valueChanged', {
            oldValue: storedData,
            newValue: new BN(newValue),
        })

        storedData = await instance.storedData()
        console.log(`storedData = ${storedData.toNumber()}`)

        assert.equal(storedData.toNumber(), newValue)
    })
});