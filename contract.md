# Smart Contract API Documentation

## Table of Contents

*   [Smart Contract](#smart-contract)
    *    [Deposit](#deposit)
    *    [WithdrawEmergency](#withdrawemergency)

## Smart Contract

NinjaTrade's smart contract is deployed at [to be updated](https://www.google.com/)

### Deposit

This is responsible for handling both Ether deposits and ERC20 tokens deposits. It takes 2 arguments, `_token` and `_amount`, `_token` is the address of the token you would like to deposit, if it is Ether, then it should be `0x0000000000000000000000000000000000000000`, `_amount` is the amount you would like to deposit, represented in wei, for example, to deposit 1 ether, you would call:

```
deposit('0x0000000000000000000000000000000000000000', '1000000000000000000')
```

If you are depositing ERC20 tokens, you must first authorize the exchange contract for making transfers by calling the `approve` function on the token contract with the exchange contract as the first argument and the amount to be deposited as the second argument.

### WithdrawEmergency

This function is for withdrawing funds directly from the contract, it takes 2 arguments, `_token` and `_amount`, `_token` is the address of the token you would like to withdraw, if it is Ether, then it should be `0x0000000000000000000000000000000000000000`, `_amount` is the amount you would like to withdraw, represented in wei, for example, to withdraw 1 ether, you would call:

```
WithdrawEmergency('0x0000000000000000000000000000000000000000', '1000000000000000000')
```

This function is only usable when `manualWithdraws` is set to `true`, and the user address has been inactive for a sufficient amount of time.
