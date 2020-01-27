# deposit

This function is responsible for ETH deposits, the respective balance is credited with the amount of ETH included in the transaction.

# depositToken

This function is responsible for ERC20 deposits. It takes 2 arguments, `tokenAddress` and `amount`, `tokenAddress` is the address of the token you would like to deposit, `amount` is the amount you would like to deposit, given in the smallest precision of the token, for example, to deposit 1 token, you would call:

```
depositToken('0xe62cc4212610289d7374f72c2390a40e78583350', '1000000000000000000')
```

**NOTE:** You must first authorize the exchange contract for making transfers by calling the `approve` function on the token contract with the exchange contract as the first argument and the amount to be deposited as the second argument.

# directWithdraw

This function is for withdrawing funds directly from the contract, it can either be used when the exchange has been terminated and `inactive` has been set to `true`, or when the account to be withdrawn from has been ejected using `eject` and a sufficient number of blocks (defined in `accountEjectionTimelock`) has been mined.

To use it the user must provide 2 arguments, `tokenAddress` and `amount`, `tokenAddress` is the address of the token you would like to withdraw, if it is Ether, then it should be `0x0000000000000000000000000000000000000000`, `amount` is the amount you would like to withdraw, represented in wei, for example, to withdraw 1 ether, you would call:

```
directWithdraw('0x0000000000000000000000000000000000000000', '1000000000000000000')
```

# eject

Eject an account for enabling direct withdrawals, after an account has been ejected, it can no longer be used normally from the user interface or with the API, the only possible interaction with an ejected account is calling directWithdraw on the smart contract.
