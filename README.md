# NinjaTrade API documentation

* [HTTP](http.md)
* [WebSocket](ws.md)
* [Smart Contract](contract.md)

# TODOS

* update deployed contract address in contract.md
* WebSocket API compatibility with 3rd-party clients
* replacing the frontend matching engine with a matching engine more scalable

# PRE-PRODUCTION

* API rate-limiting
* home page
* recovery page
* documentation page
* test recovery of non-listed token deposits
* test recovery of funds locked inside deprecated contracts

# HANDLING SUPPORT ISSUES

## Deposits of non-listed tokens:

* validate its authenticity, list the tokens as non-tradable and manually create the deposits to match with their on-chain balances for them to withdraw, if happens too frequently, figure out a more effective solution