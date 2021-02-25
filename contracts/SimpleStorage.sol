// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

contract SimpleStorage {
  uint public storedData = 0;
  uint storedOldData;

  event ValueChanged(uint oldValue, uint256 newValue);

  function set(uint x) public {
    storedOldData = storedData;
    storedData = x;

    emit ValueChanged(storedOldData, storedData);
  }

  function get() public view returns (uint) {
    return storedData;
  }
}
