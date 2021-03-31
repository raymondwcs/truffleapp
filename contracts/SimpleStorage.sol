// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

contract SimpleStorage {
  uint public storedData = 0;

  event valueChanged(address changedBy, uint oldValue, uint256 newValue, uint256 timestamp);

  function set(uint x) public {
    uint previousData = storedData;
    storedData = x;

    emit valueChanged(msg.sender, previousData, storedData, now);
  }
}
