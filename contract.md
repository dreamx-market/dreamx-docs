# Smart Contract API Specification

## Table of Contents

*   [Smart Contract](#smart-contract)
    *    [Deposit](#deposit)
    *    [WithdrawEmergency](#withdrawemergency)

## Smart Contract

The smart contract is currently deployed at [to be updated](https://www.google.com/)

### Deposit

To deposit into the contract, you must use the public deposit(address,uint) contract call. The first argument to depositToken is the address of the token you are depositing, and the second argument is the raw amount you are depositing. For Ether, `address` should be `0x0000000000000000000000000000000000000000`, for ERC20, the exchange contract must first be approved by calling the token's approve(address,uint256) function for that amount using the contract address as the first argument.

### WithdrawEmergency

You can withdraw directly from the contract using withdrawEmergency(address,uint). The first argument to withdrawEmergency is the address of the token you are withdrawing, and the second argument is the raw amount you are withdrawing. This method only becomes available to use after a period of inactivity.