# HTTP REST API Documentation

NinjaTrade's HTTP API is currently located at https://api.ninja.trade

## Table of Contents

*   [Pagination](#pagination)
*   [Rate Limits](#rate-limits)
*   [Errors](#errors)
*   [Misc](#misc)
*   [Endpoints](#enpoints)
    *   [GET /tokens](#get-tokens)
    *   [GET /markets](#get-markets)
    *   [POST /orders](#post-orders)
    *   [GET /orders/:order_hash](#get-ordersorder_hash)
    *   [POST /order_cancels](#post-order_cancels)
    *   [GET /order_books/:market_symbol](#get-order_booksmarket_symbol)
    *   [GET /tickers/:market_symbol](#get-tickersmarket_symbol)
    *   [GET /balances/:account_address](#get-balancesaccount_address)
    *   [GET /transfers/:account_address](#get-transfersaccount_address)
    *   [POST /withdraws](#post-withdraws)
    *   [GET /trades](#get-trades)
    *   [POST /trades](#post-trades)
    *   [GET /return_contract_address](#get-return_contract_address)
    *   [GET /chart_data/:market_symbol](#get-chart_datamarket_symbol)
    *   [GET /fees](#get-fees)

## Pagination

Endpoints with large responses are paginated via the `page` and `per_page` query parameters, for example:

```
curl https://api.ninja.trade/tokens?page=3&per_page=20
```

Example of a paginated response:

```
{
    "total": 43,
    "page": 1,
    "per_page": 100,
    "records": [
      {
        "decimals": "18",
        "address": "0x0000000000000000000000000000000000000000",
        "name": "Ether",
        "symbol": "ETH",
        "withdraw_minimum": "20000000000000000",
        "withdraw_fee": "10000000000000000"
      },
      {
        "decimals": "8",
        "address": "0x210113d69873c0389085cc09d24338a9965f8218",
        "name": "One",
        "symbol": "ONE",
        "withdraw_minimum": "20000000000000000",
        "withdraw_fee": "10000000000000000"
      },
      {
        "decimals": "8",
        "address": "0x948e2ffa7bb586f535816eab17642ac395b47284",
        "name": "Two",
        "symbol": "TWO",
        "withdraw_minimum": "20000000000000000",
        "withdraw_fee": "10000000000000000"
      }
      ...
    ]
}
```

## Rate Limits (TO BE IMPLEMENTED)

Information on rate limits will be included in the following headers:

```
X-RateLimit-Limit - The total amount of requests you can make per hour. 
X-RateLimit-Remaining - The number of remaining requests.
X-RateLimit-Reset - When the limit will reset in UNIX seconds.
```

Example:

```
curl -i https://api.ninja.trade/tokens
HTTP/1.1 200 OK
Date: Mon, 20 Oct 2017 12:30:06 GMT
Status: 200 OK
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 56
X-RateLimit-Reset: 1372700873
```

When your quota is depleted, a `429 Too Many Requests` error will be returned.

## Errors

Errors can have one of the following status codes:

```
400 - Bad request – Invalid request format   
404 - Not found                              
422 - Unprocessable entity                   
429 - Too many requests - Rate limit exceeded
500 - Internal server error                  
501 - Not implemented                        
```

A Bad Request error can be caused by various reasons, each has a reason code:

```
100 - Validation failed
101 - Malformed JSON
102 - Order submission disabled
103 - Throttled
104 - Conflict
```

An example error:

```
{
    "code": 100,
    "reason": "Validation failed",
    "validation_errors": [
        {
            "field": "maker",
            "reason": ["Invalid address"]
        }
    ]
}
```

A field may have multiple reasons for error, each error is a seperate string.


## Misc.

*   Addresses should be without checksums and prefixed with `0x`
*   Parameters should use `snake_case`.
*   Interactions with Ether should specify `0x0000000000000000000000000000000000000000` as its token address.
*   Token amounts should be given in the smallest precision, for example: `1000000000000000000` for 1
*   Library methods mentioned in this documentation such as `ecsign`, `soliditySha3` or `hashPersonalMessage` etc can be swapped for their equivalent alternatives in other libraries.

## Endpoints

### GET /tokens

Get all listed tokens, returns a [paginated](#pagination) response.

#### Response

```
{
    "total": 43,
    "page": 1,
    "per_page": 100,
    "records": [
      {
        "decimals": "18",
        "address": "0x0000000000000000000000000000000000000000",
        "name": "Ether",
        "symbol": "ETH",
        "withdraw_minimum": "20000000000000000",
        "withdraw_fee": "10000000000000000"
      },
      {
        "decimals": "8",
        "address": "0x210113d69873c0389085cc09d24338a9965f8218",
        "name": "One",
        "symbol": "ONE",
        "withdraw_minimum": "20000000000000000",
        "withdraw_fee": "10000000000000000"
      },
      {
        "decimals": "8",
        "address": "0x948e2ffa7bb586f535816eab17642ac395b47284",
        "name": "Two",
        "symbol": "TWO",
        "withdraw_minimum": "20000000000000000",
        "withdraw_fee": "10000000000000000"
      }
      ...
    ]
}
```

### GET /markets

Get all listed markets, returns a [paginated](#pagination) response.

#### Response

```
{
    "total": 43,
    "page": 1,
    "per_page": 100,
    "records": [
      symbol: "ETH_ONE",
      status: "active",
      {
        base_token: {
          "decimals": "18",
          "address": "0x0000000000000000000000000000000000000000",
          "name": "Ether",
          "symbol": "ETH"
        },
        quote_token: {
          "decimals": "8",
          "address": "0x210113d69873c0389085cc09d24338a9965f8218",
          "name": "One",
          "symbol": "ONE"
        }
      }
      ...
    ]
}
```

### POST /orders

Submit a signed order.

#### Request

```
{
    "account_address": "0x5b0ca08aac665a36158ced95c676fd5a59ed0c73",
    "give_token_address": "0x210113d69873c0389085cc09d24338a9965f8218",
    "give_amount": "10000000000000000",
    "take_token_address": "0x948e2ffa7bb586f535816eab17642ac395b47284",
    "take_amount": "20000000000000000",
    "nonce": "1551036154000",
    "expiry_timestamp_in_milliseconds": "1506550595000",
    "order_hash": "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
    "signature": "0xc7943d5ad7d45218a42c2adfb4e01b170e74b9d0fbb5da503347cd6147963b9a3f2df9daf4f07c39cfbfb03e45cbce8764bdfed3f546f23db925ba45b9ed6dc000"
}
```

#### Parameters
*   give_amount [string]: the amount you are giving
*   take_amount [string]: the amount you are giving
*   nonce [string]: the current UNIX timestamp in milliseconds
*   order_hash [string]: the result of running [soliditySha3](https://web3js.readthedocs.io/en/1.0/web3-utils.html#soliditysha3) on the following parameters in their corresponding order:
    1. contract_address (obtained from [POST get_contract_address](#post-get_contract_address))
    2. account_address
    3. give_token_address
    4. give_token_amount
    5. take_token_address
    6. take_token_amount
    7. nonce
    8. expiry_timestamp_in_milliseconds
*   signature [string]: the result of calling [ecsign](https://github.com/ethereumjs/ethereumjs-util/blob/master/docs/README.md#ecsign) with `salted_order_hash` and the private key for `account_address` as its parameters, `salted_order_hash` is obtained by passing `order_hash` into [hashPersonalMessage](https://github.com/ethereumjs/ethereumjs-util/blob/master/docs/README.md#hashpersonalmessage), the values returned by [ecsign](https://github.com/ethereumjs/ethereumjs-util/blob/master/docs/README.md#ecsign) is then unified into one string using [toRpcSig](https://github.com/ethereumjs/ethereumjs-util/blob/master/docs/README.md#torpcsig)

**NOTE:** See this [example](scripts/create_order_payload.js) for a detailed instruction on creating the payload

#### Response

Returns the new order on success.

```
{
    "account_address": "0x5b0ca08aac665a36158ced95c676fd5a59ed0c73",
    "give_token_address": "0x210113d69873c0389085cc09d24338a9965f8218",
    "give_amount": "10000000000000000",
    "take_token_address: "0x948e2ffa7bb586f535816eab17642ac395b47284",
    "take_amount": "20000000000000000",
    "filled": "0",
    "status": "open",
    "nonce": "1551036154000",
    "expiry_timestamp_in_milliseconds": "1506550595000",
    "order_hash": "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
    "created_at": "1506550595"
}
```

### GET /orders/:order_hash

Get the order with the given `:order_hash`, for getting an entire orderbook, use [GET /order_books/:market_symbol](#get-order_booksmarket_symbol) instead, returns a [paginated](#pagination) response.

#### Request

```
curl https://api.ninja.trade/orders/0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b
```

#### Parameters

*   order_hash [string]: the order_hash for the order to be returned (optional, return all orders if omitted)
*   account_address [string]: return all orders for `account_address` (optional)

#### Response

```
{
    "total": 984,
    "page": 1,
    "per_page": 100,
    "records": [
        {
            "account_address": "0x5b0ca08aac665a36158ced95c676fd5a59ed0c73",
            "give_token_address": "0x210113d69873c0389085cc09d24338a9965f8218",
            "give_amount": "10000000000000000",
            "take_token_address": "0x948e2ffa7bb586f535816eab17642ac395b47284",
            "take_amount": "20000000000000000",
            "filled": "0",
            "status": "open",
            "nonce": "1551036154000",
            "expiry_timestamp_in_milliseconds": "1506550595000",
            "order_hash": "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
            "created_at": "2019-06-07T15:15:44.498Z"
        },
        ...
    ]
}
```

### POST /order_cancels

Cancel an order or a batch of orders, batch cancelling is atomic, meaning all orders are cancelled or none cancelled.

**NOTE:** When cancelling a batch of orders, cancel messages must be signed by the same address.

#### Request

```
[
  {
      "order_hash": "0x57a69889d35410e74bed6f1b6849868da2d0b062b47c87b6d11ba894f3690633",
      "account_address": "0x2601eacc505aa1719aacba4de8cd9fd0c069afed",
      "nonce": "1551351258000",
      "cancel_hash": "0x315dafa1085bbc984fe641c037faeb40c43dbce3ba26400b6fd65cf65bca0ddc",
      "signature": "0x3c0fdad5fa4495bae51c59447156218d7f1077dd516938d97e7d8524dd0e12cc6a57f7a55739a6e44dcb16ec8c407ee931a6706c773291585e35868b10da125f1c"
  }
]
```

#### Parameter

*   order_hash [string]: the hash of the order to be cancelled
*   account_address [string]: the address of the owner
*   nonce [string]: the current UNIX timestamp in milliseconds
*   cancel_hash [string]: the result of running [soliditySha3](https://web3js.readthedocs.io/en/1.0/web3-utils.html#soliditysha3) on the following parameters in their corresponding order:
    1. contract_address (obtained from [GET /return_contract_address](#get-return_contract_address))
    2. account_address
    3. order_hash
    4. nonce
*   signature [string]: the result of calling [ecsign](https://github.com/ethereumjs/ethereumjs-util/blob/master/docs/README.md#ecsign) with `salted_cancel_hash` and the private key for `account_address` as its parameters, `salted_cancel_hash` is obtained by passing `cancel_hash` into [hashPersonalMessage](https://github.com/ethereumjs/ethereumjs-util/blob/master/docs/README.md#hashpersonalmessage), the values returned by [ecsign](https://github.com/ethereumjs/ethereumjs-util/blob/master/docs/README.md#ecsign) is then unified into one string using [toRpcSig](https://github.com/ethereumjs/ethereumjs-util/blob/master/docs/README.md#torpcsig)

**NOTE:** See this [example](scripts/cancel_order_payload.js) for a detailed instruction on creating the payload

#### Response

Returns the new order cancels on success.

```
[
  {
    "order_hash": "0x57a69889d35410e74bed6f1b6849868da2d0b062b47c87b6d11ba894f3690633",
    "account_address": "0x2601eacc505aa1719aacba4de8cd9fd0c069afed",
    "cancel_hash": "0x315dafa1085bbc984fe641c037faeb40c43dbce3ba26400b6fd65cf65bca0ddc",
    "created_at": "2018-06-28 12:21:15"
  }
]
```

### GET /order_books/:market_symbol

Get the orderbook for a given market, returns a [paginated](#pagination) collection for each side, sellbook will be sorted ascendingly (lowest first), buybook will be sorted descendingly (highest first).

#### Request

```
curl https://api.ninja.trade/orderbook/ONE_TWO
```

#### Response

```
{
    "bids": {
        "total": 325,
        "page": 2,
        "per_page": 100,
        "records": [
            {
                "account_address": "0xcd8b267f78f37e947dbadb4239fc0a47ce0c8d09",
                "give_token_address": "0x210113d69873c0389085cc09d24338a9965f8218",
                "give_amount": "10000000000000000",
                "take_token_address: "0x948e2ffa7bb586f535816eab17642ac395b47284",
                "take_amount": "20000000000000000",
                "filled": "0",
                "nonce": "1551036154000",
                "expiry_timestamp_in_milliseconds": "1506550595000",
                "order_hash": "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
                "created_at": "1506550595"
            },
            ...
        ]
    },
    "asks": {
        "total": 500,
        "page": 2,
        "per_page": 100,
        "records": [
            {
                "account_address": "0x5b0ca08aac665a36158ced95c676fd5a59ed0c73",
                "give_token_address": "0x210113d69873c0389085cc09d24338a9965f8218",
                "give_amount": "10000000000000000",
                "take_token_address: "0x948e2ffa7bb586f535816eab17642ac395b47284",
                "take_amount": "20000000000000000",
                "filled": "0",
                "nonce": "1551036154000",
                "expiry_timestamp_in_milliseconds": "1506550595000",
                "order_hash": "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
                "created_at": "1506550595"
            },
            ...
        ]  
    }
}
```

### GET /tickers/:market_symbol

Get 24h ticker data for a market, if `:market_symbol` is omitted, returns a [paginated](#pagination) collection of all available tickers, if a field is empty, it will be set to `nil`, `percent_change`, `base_volume` and `quote_volume` will be set to 0 instead.

#### Request

```
curl https://api.ninja.trade/tickers/ETH_ONE
```

#### Response

```
{
    "total": 43,
    "page": 1,
    "per_page": 100,
    "records": [
        {
            "market_symbol": "ETH_ONE",
            "last": "0.000981",
            "high": "0.0010763",
            "low": "0.0009777",
            "lowest_ask": "0.00098151",
            "highest_bid": "0.0007853",
            "percent_change": "-1.83619353",
            "base_volume": "7.3922603247161",
            "quote_volume": "7462.998433"
        }
    ]
}
```

### GET /balances/:account_address

Get all non-empty balances of an account, returns a [paginated](#pagination) response.

#### Request

```
GET /balances/0x5b0ca08aac665a36158ced95c676fd5a59ed0c73
```

#### Response

```
{
    "total": 43,
    "page": 1,
    "per_page": 100,
    "records": [
        {
            "token": "0x210113d69873c0389085cc09d24338a9965f8218",
            "balance": 500000000000000000,
            "hold_balance": 300000000000000000
        },
        ...
    ]
}
```

### GET /transfers/:account_address

Get all transfers of an account, results may be filtered by date by the `start` and `end` query parameters, returns a [paginated](#pagination) response.

```
curl https://api.ninja.trade/transfers/0x5b0ca08aac665a36158ced95c676fd5a59ed0c73?start=1551734309&end=1552339097
```

#### Parameters: [LEFT HERE]
*   start [string]: starting timestamp of returned results in UNIX seconds (optional)
*   end [string]: ending timestamp of returned results in UNIX seconds (optional)

#### Response

```
{
    "total": 50,
    "page": 1,
    "per_page": 100,
    "records": [
        {
            "id": "169",
            "type": "deposit",
            "token_address": "0x210113d69873c0389085cc09d24338a9965f8218",
            "amount": "1000000000000000000",
            "transaction_hash": "0xb844692c9c29ae7d7cb246bacac84f8a435a402d2074a85c37bbf03af928f60f",
            "block_hash": nil,
            "block_number": nil,
            "created_at": "1506550595"
        },
        {
            "id": "174",
            "type": "withdraw",
            "token_address": "0x210113d69873c0389085cc09d24338a9965f8218",
            "amount": "1000000000000000000",
            "transaction_hash": "0xb844692c9c29ae7d7cb246bacac84f8a435a402d2074a85c37bbf03af928f60f",
            "block_hash": "0x55d9972705ab92ed16dcbc5491e282df2456131a9404f4b812457c23cffb535c",
            "block_number": "371",
            "created_at": "1506550595"
        },
        ...
    ]
}
```

Records will be sorted by date in descending order by default.

### POST /withdraws

Submit a signed withdrawal.

#### Request

```
{
    "account_address": "0x2601eacc505aa1719aacba4de8cd9fd0c069afed",
    "amount": "100000000000000000000",
    "token_address": "0x0000000000000000000000000000000000000000",
    "nonce": "1551375034000",
    "withdraw_hash": "0xc9fb6082a0aee990e62f5c8824c9009da8086abace0e061eefb7ed265a63ad7b",
    "signature": "0xd4c7632c3c23462cb61f2506b43b00a8fddf2a6743ee36c3d6a9bde24a63663217ec7400761309109bc241d07311d5a3f8004ac19e45be89fb713d9ab943f23c1c"
}
```

#### Parameters

*   nonce [string]: the current UNIX timestamp in milliseconds
*   withdraw_hash [string]: the result of running [soliditySha3](https://web3js.readthedocs.io/en/1.0/web3-utils.html#soliditysha3) on the following parameters in their corresponding order:
    1. contract_address (obtained from [POST get_contract_address](#post-get_contract_address))
    2. token_address
    3. amount
    4. account_address
    5. nonce
*   signature [string]: the result of calling [ecsign](https://github.com/ethereumjs/ethereumjs-util/blob/master/docs/README.md#ecsign) with `salted_withdraw_hash` and the private key for `account_address` as its parameters, `salted_withdraw_hash` is obtained by passing `withdraw_hash` into [hashPersonalMessage](https://github.com/ethereumjs/ethereumjs-util/blob/master/docs/README.md#hashpersonalmessage), the values returned by [ecsign](https://github.com/ethereumjs/ethereumjs-util/blob/master/docs/README.md#ecsign) is then unified into one string using [toRpcSig](https://github.com/ethereumjs/ethereumjs-util/blob/master/docs/README.md#torpcsig)

**NOTE:** See this [example](scripts/withdraw_payload.js) for a detailed instruction on creating the payload

#### Response

Returns the new withdraw on success.

```
{
  "id" : "1",
  "type": "withdraw",
  "token_address": "0x210113d69873c0389085cc09d24338a9965f8218",
  "amount": "1000000000000000000",
  "transaction_hash": "0xb844692c9c29ae7d7cb246bacac84f8a435a402d2074a85c37bbf03af928f60f",
  "block_hash": nil,
  "block_number": nil,
  "created_at": "1506550595" 
}
```

### GET /trades

Get a list of trades filtered by the provided parameters, returns a [paginated](#pagination) response.

#### Payload

```
curl https://api.ninja.trade/trades?account_address=0x5b0ca08aac665a36158ced95c676fd5a59ed0c73&start=1551734309&end=1552339097&market_symbol=ETH_ONE
```

#### Parameters

*   order_hash [string]: filter by order_hash to get a specific order (optional)
*   account_address [string]: filter by account_address to get orders belong to a specific account (optional)
*   start [string]: starting timestamp of returned results in UNIX seconds (optional)
*   end [string]: ending timestamp of returned results in UNIX seconds (optional)
*   sort [string]: possible values are asc (oldest first) and desc (newest first) (optional, defaults to desc)

#### Response

```
{
    "total": 43,
    "page": 1,
    "per_page": 100,
    "records": [
        {
            "id": "1885452",
            "give_token_address": "0x210113d69873c0389085cc09d24338a9965f8218",
            "give_amount": "10000000000000000",
            "take_token_address": "0x948e2ffa7bb586f535816eab17642ac395b47284",
            "take_amount": "20000000000000000",
            "order_hash": "0xc0cca964a3b829541841ebdc2d938936b9593924cf2bd0de359bc6a5ff4a0ee8",
            "uuid": "ca5ca940-cd78-11e8-812d-3b7d27265b69",
            "maker_fee": "23000",
            "taker_fee": "123300",
            "maker_address": "0x5b0ca08aac665a36158ced95c676fd5a59ed0c73",
            "taker_address": "0x7e85cad78cf70b62a6e1087cbe77ca126dbede00",
            "transaction_hash": "0x1b651d0c0578008296f0edf237fdbece67797a0bee9a28c5e4313e44844b25a2",
            "created_at": "2018-06-28 12:21:15"
        }
    ]
}
```

### POST /trades

Submit a signed trade or a batch of signed trades, submitting a batch is atomic, the whole batch either succeed or none succeed

**NOTE**: When submitting a batch of trades, they must be signed by the same address and the orders they fill must be of the same give_token_address/take_token_address pair.

#### Request

```
[
    {
        "account_address": "0x5b0ca08aac665a36158ced95c676fd5a59ed0c73",
        "order_hash": "0x57a69889d35410e74bed6f1b6849868da2d0b062b47c87b6d11ba894f3690633",
        "amount": "1000000000000000000",
        "nonce": "1551036154000",
        "trade_hash": "0xc0cca964a3b829541841ebdc2d938936b9593924cf2bd0de359bc6a5ff4a0ee8",
        "signature": "0xc7943d5ad7d45218a42c2adfb4e01b170e74b9d0fbb5da503347cd6147963b9a3f2df9daf4f07c39cfbfb03e45cbce8764bdfed3f546f23db925ba45b9ed6dc000"
    }
]
```

#### Parameters

*   account_address [string]: the address of the account that is making the trade
*   order_hash [string]: the hash of the order that is being traded
*   amount [string]: the amount to be traded
*   nonce [string]: the current UNIX timestamp in milliseconds
*   trade_hash [string]: the result of running [soliditySha3](https://web3js.readthedocs.io/en/1.0/web3-utils.html#soliditysha3) on the following parameters in their corresponding order:
    1. contract_address (obtained from [GET /return_contract_address](#get-return_contract_address))
    2. order_hash
    3. account_address (the address of the trader)
    4. amount
    5. nonce
*   signature [string]: the result of calling [ecsign](https://github.com/ethereumjs/ethereumjs-util/blob/master/docs/README.md#ecsign) with `salted_trade_hash` and the private key for `account_address` as its parameters, `salted_trade_hash` is obtained by passing `trade_hash` into [hashPersonalMessage](https://github.com/ethereumjs/ethereumjs-util/blob/master/docs/README.md#hashpersonalmessage), the values returned by [ecsign](https://github.com/ethereumjs/ethereumjs-util/blob/master/docs/README.md#ecsign) is then unified into one string using [toRpcSig](https://github.com/ethereumjs/ethereumjs-util/blob/master/docs/README.md#torpcsig)
    
**NOTE:** See this [example](scripts/trade_payload.js) for a detailed instruction on creating the payload

#### Response

```
[
    {
        "amount": "700000000000000",
        "date": "2017-10-13 16:25:36",
        "total": "49000000000000000",
        "type": "buy",
        "price": "70000000000000000",
        "order_hash": "0xcfe4018c59e50e0e1964c979e6213ce5eb8c751cbc98a44251eb48a0985adc52",
        "uuid": "250d51a0-b033-11e7-9984-a9ab79bb8f35",
        "market": "ETH_ONE"
    }
]
```

### GET /return_contract_address

Get the address of the exchange's smart contract

#### Response

```
{
    "address": "0x9cb8b96256e67976f3337001b88da95e1bfb41a0",
    "network_id": "3"
}
```

### GET /chart_data/:market_symbol

Get chart data of a market

#### Request

```
curl https://api.ninja.trade/chart_data/ETH_ONE?start=1551734309&end=1552339097&period=3600
```

#### Parameters

*   start [string]: starting timestamp of returned results in UNIX seconds (optional)
*   end [string]: ending timestamp of returned results in UNIX seconds (optional)
*   period [string]: the interval period between the candles, defaults to 3600, can be set to 300 (5 minutes), 900 (15 minutes), 3600 (1 hour), and 86400 (1 day)

#### Response

```
[ 
    { 
        "created_at": "2019-03-11T12:38:31.000Z",
        "high": "0.03149999",
        "low": "0.031",
        "open": "0.03144307",
        "close": "0.03124064",
        "volume": "64.36480422",
        "quote_volume": "2055.56810329",
        "average": "0.03131241" 
    },
    { 
        "created_at": "2019-03-11T12:38:31.000Z",
        "high": "0.03153475",
        "low": "0.031265",
        "open": "0.03151497",
        "close": "0.03141781",
        "volume": "39.82606009",
        "quote_volume": "1268.53159161",
        "average": "0.0313954" 
    },
    ...
]
```

### GET /fees

Get current trading fees.

#### Response

```
{ 
    "maker_fee_per_ether": "0.001",
    "taker_fee_per_ether": "0.002"
}
```