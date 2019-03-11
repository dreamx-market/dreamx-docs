# HTTP REST API Specification

## Table of Contents

*   [General](#general)
    *   [Pagination](#pagination)
    *   [Network Id](#network-id)
    *   [Link Header](#link-header)
    *   [Rate Limits](#rate-limits)
    *   [Errors](#errors)
    *   [Misc](#misc)
*   [REST API](#rest-api)
    *   [GET /tokens](#get-tokens)
    *   [GET /markets](#get-markets)
    *   [POST /orders](#post-orders)
    *   [GET /orders/:order_hash](#get-ordersorder_hash)
    *   [POST /delete_orders](#post-delete_orders)
    *   [GET /orderbook/:market_symbol](#get-orderbookmarket_symbol)
    *   [GET /tickers/:market_symbol](#get-tickersmarket_symbol)
    *   [GET /balances/:account_address](#get-balancesaccount_address)
    *   [POST /get_transfers](#post-get_transfers)
    *   [POST /withdraw](#post-withdraw)
    *   [POST /get_trades](#post-get_trades)
    *   [POST /trades](#post-trades)
    *   [GET /return_contract_address](#get-return_contract_address)
    *   [GET /chart_data/:market_symbol](#get-chart_datamarket_symbol)
    *   [POST /get_fee_info](#post-get_fee_info)

## General

### Pagination

Requests that return potentially large collections should respond to the **?page** and **?per_page** parameters. For example:

```
curl https://api.ninja.trade/asset_pairs?page=3&per_page=20
```

Page numbering should be 1-indexed, not 0-indexed. If a query provides an unreasonable (ie. too high) **per_page** value, the response can return a validation error as specified in the [errors section](#errors). If the query specifies a **page** that does not exist (ie. there are not enough **records**), the response should just return an empty **records** array.

All endpoints that are paginated should return a **total**, **page**, **per_page** and a **records** value in the top level of the collection.  The value of **total** should be the total number of records for a given query, whereas **records** should be an array representing the response to the query for that page. **page** and **per_page**, are the same values that were specified in the request. 

### Network Id
All requests should be able to specify a **?networkId** query param for all supported networks. For example:
```
curl https://api.ninja.trade/asset_pairs?networkId=1
```
If the query param is not provided, it should default to **1** (mainnet).

Networks and their Ids:

| Network Id| Network Name |
| ----------| ------------ |
| 1         | Mainnet      |
| 42        | Kovan        |
| 3         | Ropsten      |
| 4         | Rinkeby      |

 If a certain network is not supported, the response should **400**  as specified in the [error response](#error-response) section. For example:
 
```
{
    "code": 100,
    "reason": "Validation failed",
    "validationErrors": [
        {
            "field": "networkId",
            "code": 1006,
            "reason": "Network id 42 is not supported",
        }
    ]
}
```

### Link Header

A [Link Header](https://tools.ietf.org/html/rfc5988) can be included in a response to provide clients with more context about paging
For example:

```
Link: <https://api.ninja.trade/asset_pairs?page=3&per_page=20>; rel="next",
<https://api.github.com/user/repos?page=10&per_page=20>; rel="last"
```

This `Link` response header contains one or more Hypermedia link relations.

The possible `rel` values are:

| Name  | Description                                                   |
| ----- | ------------------------------------------------------------- |
| next  | The link relation for the immediate next page of results.     |
| last  | The link relation for the last page of results.               |
| first | The link relation for the first page of results.              |
| prev  | The link relation for the immediate previous page of results. |

### Rate Limits

Rate limit guidance for clients can be optionally returned in the response headers:

| Header Name           | Description                                                                  |
| --------------------- | ---------------------------------------------------------------------------- |
| X-RateLimit-Limit     | The maximum number of requests you're permitted to make per hour.            |
| X-RateLimit-Remaining | The number of requests remaining in the current rate limit window.           |
| X-RateLimit-Reset     | The time at which the current rate limit window resets in UTC epoch seconds. |

For example:

```
curl -i https://api.ninja.trade/asset_pairs
HTTP/1.1 200 OK
Date: Mon, 20 Oct 2017 12:30:06 GMT
Status: 200 OK
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 56
X-RateLimit-Reset: 1372700873
```
When a rate limit is exceeded, a status of **429 Too Many Requests** should be returned.

### Errors

Unless the spec defines otherwise, errors to bad requests should respond with HTTP 4xx or status codes.

#### Common error response headers

| Code | Reason                                  |
| ---- | --------------------------------------- |
| 400  | Bad request – Invalid request format    |
| 404  | Not found                               |
| 422  | Unprocessable entity                    |
| 429  | Too many requests - Rate limit exceeded |
| 500  | Internal server error                   |
| 501  | Not implemented                         |

#### Error reporting format

```
{
    "code": 100,
    "reason": "Validation failed",
    "validationErrors": [
        {
            "field": "maker",
            "reason": ["Invalid address"]
        }
    ]
}
```
A field can have multiple errors, each error is a seperate string 

Error codes:

```
100 - Validation failed
101 - Malformed JSON
102 - Order submission disabled
103 - Throttled
104 - Conflict
```


### Misc.

*   All requests and responses should be of **application/json** content type
*   All token amounts are sent in amounts of the smallest level of precision (base units). (e.g if a token has 18 decimal places, selling 1 token would show up as selling `'1000000000000000000'` units by this API).
*   All addresses are sent as lower-case (non-checksummed) Ethereum addresses with the `0x` prefix.
*   All parameters should use `snake_case`.
*   Interactions with Ether should specify `0x0000000000000000000000000000000000000000` as its token address.

## REST API

### GET /tokens

Return all available tokens. This endpoint should be [paginated](#pagination).

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
        "symbol": "ETH"
      },
      {
        "decimals": "8",
        "address": "0xc853ba17650d32daba343294998ea4e33e7a48b9",
        "name": "Reputation",
        "symbol": "REP"
      },
      {
        "decimals": "8",
        "address": "0xf59fad2879fb8380ffa6049a48abf9c9959b3b5c",
        "name": "Tron",
        "symbol": "TRX"
      }
      ...
    ]
}
```

### GET /markets

Return all available markets. This endpoint should be [paginated](#pagination).

#### Response

```
{
    "total": 43,
    "page": 1,
    "per_page": 100,
    "records": [
      {
        base_token: {
          "decimals": "18",
          "address": "0x0000000000000000000000000000000000000000",
          "name": "Ether",
          "symbol": "ETH"
        },
        quote_token: {
          "decimals": "8",
          "address": "0xc853ba17650d32daba343294998ea4e33e7a48b9",
          "name": "Reputation",
          "symbol": "REP"
        }
      }
      ...
    ]
}
```

### POST /orders

Submit a signed order to the exchange.

#### Payload

```
{
    "account_address": "0xcd8b267f78f37e947dbadb4239fc0a47ce0c8d09",
    "give_token_address": "0xa2b31dacf30a9c50ca473337c01d8a201ae33e32",
    "give_amount": "10000000000000000",
    "take_token_address": "0x12459c951127e0c374ff9105dda097662a027093",
    "take_amount": "20000000000000000",
    "nonce": "1551036154000",
    "expiry_timestamp_in_milliseconds": "1506550595000",
    "order_hash": "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
    "signature": "0xc7943d5ad7d45218a42c2adfb4e01b170e74b9d0fbb5da503347cd6147963b9a3f2df9daf4f07c39cfbfb03e45cbce8764bdfed3f546f23db925ba45b9ed6dc000"
}
```

#### Parameters
*   give_amount [string]: giving amount specified in the smallest level of precision of the giving token, precision information can be obtained from [POST get_token_pairs](#post-get_token_pairs)
*   take_amount [string]: taking amount specified in the smallest level of precision of the taking token, precision information can be obtained from [POST get_token_pairs](#post-get_token_pairs)
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

###### Success Response

Returns upon success with the new order.

```
{
    "account_address": "0xcd8b267f78f37e947dbadb4239fc0a47ce0c8d09",
    "give_token_address": "0xa2b31dacf30a9c50ca473337c01d8a201ae33e32",
    "give_amount": "10000000000000000",
    "take_token_address: "0x12459c951127e0c374ff9105dda097662a027093",
    "take_amount": "20000000000000000",
    "filled": "0",
    "nonce": "1551036154000",
    "expiry_timestamp_in_milliseconds": "1506550595000",
    "order_hash": "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
    "created_at": "1506550595"
}
```

###### Error Response

Error response will be sent with a non-2xx HTTP status code. See the [Errors](#errors) section for more information.

### GET /orders/:order_hash

Retrieves a list of orders given query parameters. This endpoint should be [paginated](#pagination). For querying an entire orderbook snapshot, the [orderbook endpoint](#get-orderbook) is recommended.

#### Request

```
curl https://api.ninja.trade/orders/0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b
```

#### Parameters

*   order_hash [string]: the order_hash for the order to be returned (optional, return all orders if omitted)
*   account_address [string]: return all orders for `account_address` (optional)

#### Response

Return all orders by default, if `order_hash` was supplied, return a specific order, if `account_address` was supplied, return all the orders owned by `account_address`.

```
{
    "total": 984,
    "page": 1,
    "per_page": 100,
    "records": [
        {
            "account_address": "0xcd8b267f78f37e947dbadb4239fc0a47ce0c8d09",
            "give_token_address": "0xa2b31dacf30a9c50ca473337c01d8a201ae33e32",
            "give_amount": "10000000000000000",
            "take_token_address": "0x12459c951127e0c374ff9105dda097662a027093",
            "take_amount": "20000000000000000",
            "filled": "0",
            "nonce": "1551036154000",
            "expiry_timestamp_in_milliseconds": "1506550595000",
            "hash": "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
            "created_at": "1506550595"
        },
        ...
    ]
}
```

Returns HTTP 404 if no order with specified order_hash was found.

### POST /order_cancels

Cancels an order.

#### Request

```
{
    "order_hash": "0x57a69889d35410e74bed6f1b6849868da2d0b062b47c87b6d11ba894f3690633",
    "account_address": "0xe37a4faa73fced0a177da51d8b62d02764f2fc45",
    "nonce": "1551351258000",
    "cancel_hash": "0x315dafa1085bbc984fe641c037faeb40c43dbce3ba26400b6fd65cf65bca0ddc",
    "signature": "0x3c0fdad5fa4495bae51c59447156218d7f1077dd516938d97e7d8524dd0e12cc6a57f7a55739a6e44dcb16ec8c407ee931a6706c773291585e35868b10da125f1c"
}
```

#### Parameter

*   order_hash [string]: the to-be-cancelled order's order_hash
*   account_address [string]: the address of the order's owner
*   nonce [string]: the current UNIX timestamp in milliseconds
*   cancel_hash [string]: the result of running [soliditySha3](https://web3js.readthedocs.io/en/1.0/web3-utils.html#soliditysha3) on the following parameters in their corresponding order:
    1. contract_address (obtained from [GET /return_contract_address](#get-return_contract_address))
    2. account_address
    3. order_hash
    4. nonce
*   signature [string]: the result of calling [ecsign](https://github.com/ethereumjs/ethereumjs-util/blob/master/docs/README.md#ecsign) with `salted_cancel_hash` and the private key for `account_address` as its parameters, `salted_cancel_hash` is obtained by passing `cancel_hash` into [hashPersonalMessage](https://github.com/ethereumjs/ethereumjs-util/blob/master/docs/README.md#hashpersonalmessage), the values returned by [ecsign](https://github.com/ethereumjs/ethereumjs-util/blob/master/docs/README.md#ecsign) is then unified into one string using [toRpcSig](https://github.com/ethereumjs/ethereumjs-util/blob/master/docs/README.md#torpcsig)

**NOTE:** See this [example](scripts/cancel_order_payload.js) for a detailed instruction on creating the payload

#### Response

Returns upon success with the new order cancel.

```
{
    "order_hash": "0x57a69889d35410e74bed6f1b6849868da2d0b062b47c87b6d11ba894f3690633",
    "account_address": "0xe37a4faa73fced0a177da51d8b62d02764f2fc45",
    "cancel_hash": "0x315dafa1085bbc984fe641c037faeb40c43dbce3ba26400b6fd65cf65bca0ddc",
    "created_at": "2018-12-11 17:12:10"
}
```

### GET /orderbook/:market_symbol

Retrieves the orderbook for a given token pair sorted by best price (lowest ask first, and highest bid first). This endpoint should be [paginated](#pagination).

#### Request

```
curl https://api.ninja.trade/orderbook/ETH_SAN
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
                "give_token_address": "0xa2b31dacf30a9c50ca473337c01d8a201ae33e32",
                "give_amount": "10000000000000000",
                "take_token_address: "0x12459c951127e0c374ff9105dda097662a027093",
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
                "account_address": "0xcd8b267f78f37e947dbadb4239fc0a47ce0c8d09",
                "give_token_address": "0xa2b31dacf30a9c50ca473337c01d8a201ae33e32",
                "give_amount": "10000000000000000",
                "take_token_address: "0x12459c951127e0c374ff9105dda097662a027093",
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

Bids will be sorted in descending order by price, and asks will be sorted in ascending order by price. Within the price sorted orders, the orders are further sorted by date in ascending order.

The way pagination works for this endpoint is that the **page** and **per_page** query params apply to both `bids` and `asks` collections, and if `page` * `per_page` > `total` for a certain collection, the `records` for that collection should just be empty. 

### GET /tickers/:market_symbol

Designed to behave similar to the API call of the same name provided by the Poloniex HTTP API, with the addition of highs and lows. Returns all necessary 24 hr data. This endpoint should be [paginated](#pagination)

**Please note**: If any field is unavailable due to a lack of trade history or a lack of 24hr data, the field will be set to `nil`. `percent_change`, `base_volume`, and `quote_volume` will never be `nil` but may be 0.

#### Request

```
curl https://api.ninja.trade/tickers/ETH_SAN
```

#### Parameters

*   market_symbol [string]: the symbol for the market to be returned, e.g: "ETH_SAN" (optional, return all tickers if omitted)

#### Response

```
{
    "total": 43,
    "page": 1,
    "per_page": 100,
    "records": [
        {
            "base_token_address": "0xa2b31dacf30a9c50ca473337c01d8a201ae33e32",
            "quote_token_address": "0x12459c951127e0c374ff9105dda097662a027093",
            "symbol": "ETH_SAN",
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

Retrieves all balances associated with an `address`. A balance is only created after the first deposit. This endpoint should be [paginated](#pagination).

#### Request

```
GET /balances/0x8a37b79E54D69e833d79Cac3647C877Ef72830E1
```

#### Response

```
{
    "total": 43,
    "page": 1,
    "per_page": 100,
    "records": [
        {
            "token": "0xe41d2489571d322189246dafa5ebde1f4699f498",
            "balance": 500000000000000000,
            "hold_balance": 300000000000000000
        },
        ...
    ]
}
```

### POST /get_transfers

Returns your deposit and withdrawal history within a range, specified by the "start" and "end" properties of the JSON input, both of which must be UNIX timestamps. Withdrawals can be marked as "PENDING" if they are queued for dispatch, "PROCESSING" if the transaction has been dispatched, and "COMPLETE" if the transaction has been mined. This endpoint should be [paginated](#pagination).

```
{
    "account_address": "0xcd8b267f78f37e947dbadb4239fc0a47ce0c8d09",
    "startingTimestampInMilliseconds": "1548264003367",
    "endingTimestampInMilliseconds": "1548264032666"
}
```

#### Parameters:
*   startingTimestampInMilliseconds [string]: Inclusive starting UNIX timestamp of returned results in milliseconds. Defaults to 0 (optional)
*   endingTimestampInMilliseconds [string]: Inclusive ending UNIX timestamp of returned results in milliseconds. Defaults to current timestamp (optional)

#### Response

```
{
    "total": 43,
    "page": 1,
    "per_page": 100,
    "records": [
        {
            "id": "174",
            "type": "deposit",
            "token": "0xe41d2489571d322189246dafa5ebde1f4699f498",
            "amount": "1000000000000000000",
            "status": "pending",
            "transaction_hash": "0xb844692c9c29ae7d7cb246bacac84f8a435a402d2074a85c37bbf03af928f60f",
            "blockHash": "0x55d9972705ab92ed16dcbc5491e282df2456131a9404f4b812457c23cffb535c",
            "blockNumber": 371,
            "created_at": "1506550595"
        },
        ...
    ]
}
```

### POST /withdraw

Withdraws funds associated with `account_address`. You cannot withdraw funds that are tied up in open orders.

#### Request

```
{
    "account_address": "0xe37a4faa73fced0a177da51d8b62d02764f2fc45",
    "amount": "100000000000000000000",
    "token_address": "0x0000000000000000000000000000000000000000",
    "nonce": "1551375034000",
    "withdraw_hash": "0xc9fb6082a0aee990e62f5c8824c9009da8086abace0e061eefb7ed265a63ad7b",
    "signature": "0xd4c7632c3c23462cb61f2506b43b00a8fddf2a6743ee36c3d6a9bde24a63663217ec7400761309109bc241d07311d5a3f8004ac19e45be89fb713d9ab943f23c1c"
}
```

#### Parameters

*   account_address [string]: the address of the owner
*   amount [string]: the amount to be withdrawn
*   token_address [string]: the address of the token to be withdrawn, `0x0000000000000000000000000000000000000000` for Ether
*   nonce [string]: the current UNIX timestamp in milliseconds
*   withdraw_hash [string]: the result of running [soliditySha3](https://web3js.readthedocs.io/en/1.0/web3-utils.html#soliditysha3) on the following parameters in their corresponding order:
    1. contract_address (obtained from [POST get_contract_address](#post-get_contract_address))
    2. account_address
    3. token_address
    4. amount
    5. nonce
*   signature [string]: the result of calling [ecsign](https://github.com/ethereumjs/ethereumjs-util/blob/master/docs/README.md#ecsign) with `salted_withdraw_hash` and the private key for `account_address` as its parameters, `salted_withdraw_hash` is obtained by passing `withdraw_hash` into [hashPersonalMessage](https://github.com/ethereumjs/ethereumjs-util/blob/master/docs/README.md#hashpersonalmessage), the values returned by [ecsign](https://github.com/ethereumjs/ethereumjs-util/blob/master/docs/README.md#ecsign) is then unified into one string using [toRpcSig](https://github.com/ethereumjs/ethereumjs-util/blob/master/docs/README.md#torpcsig)

**NOTE:** See this [example](scripts/withdraw_payload.js) for a detailed instruction on creating the payload

#### Response

Returns upon success with the new withdraw.

```
{
  "account_address": "0xcd8b267f78f37e947dbadb4239fc0a47ce0c8d09",
  "amount": "1000000000000000000",
  "token_address": "0xa2b31dacf30a9c50ca473337c01d8a201ae33e32",
  "withdraw_hash": "0x2e337f6d1fa78ac49f11f9507087ab757e5f7bce3ab8333ed2ca60c916ce9d54",
  "created_at": "2018-12-11 17:12:10" 
}
```

### POST /get_trades

Returns a paginated list of all trades for a given market, order or user, sorted by date. This endpoint should be [paginated](#pagination).

#### Payload

```
{
    "order_hash": "0x22a9ba7f8dd37ed24ae327b14a8a941b0eb072d60e54bcf24640c2af819fc7ec",
    "market": "ETH_SAN,
    "account_address": "0x2dbdcec64db33e673140fbd0ceef610a273b84db",
    "startingTimestampInMilliseconds": "1548264003367",
    "endingTimestampInMilliseconds": "1548264032666",
    "sort": "desc"
}
```

#### Parameters

*   order_hash [string]: the order hash to query for associated trades. (required)
*   account [string]: the address of the order's owner (required)
*   startingTimestampInMilliseconds [string]: Starting UNIX timestamp of returned results. Defaults to 0 (optional)
*   endingTimestampInMilliseconds [string]: Ending UNIX timestamp of returned results. Defaults to current timestamp (optional)
*   sort [string]: Possible values are asc (oldest first) and desc (newest first). Defaults to desc.

Must provide at least either an `order_hash`, a `market` or a `account`.

#### Response

```
{
    "total": 43,
    "page": 1,
    "per_page": 100,
    "records": [
        {
            "id": "1885452",
            "give_token_address": "0xa2b31dacf30a9c50ca473337c01d8a201ae33e32",
            "give_amount": "10000000000000000",
            "take_token_address": "0x12459c951127e0c374ff9105dda097662a027093",
            "take_amount": "20000000000000000",
            "order_hash": "0xc0cca964a3b829541841ebdc2d938936b9593924cf2bd0de359bc6a5ff4a0ee8",
            "uuid": "ca5ca940-cd78-11e8-812d-3b7d27265b69",
            "buyer_fee": 123300,
            "seller_fee": 23000,
            "gas_fee": 4000,
            "maker_address": "0x1d1fa573d0d1d4ab62cf59273941a27e3862f55b",
            "taker_address": "0x2d98a4263084f918130410c66d9ecbe5325f7edf",
            "transaction_hash": "0x1b651d0c0578008296f0edf237fdbece67797a0bee9a28c5e4313e44844b25a2",
            "created_at": "2018-12-11 17:12:10"
        }
    ]
}
```

### POST /trades

Making a trade involves signing a message for each order you wish to fill across and passing in an array of trades. For trades that fill a single order, the usual array with 1 object, or the object alone. The benefit of passing in multiple objects to fill across is that your action is atomic. All trades either succeed or none succeed.

**NOTE**: Currently, all orders being filled in a trade must be for the same give_token_address/take_token_address pair, and must all be signed from the same address.

#### Request

```
[
    {
        "account_address": "0x2dbdcec64db33e673140fbd0ceef610a273b84db",
        "order_hash": "0x57a69889d35410e74bed6f1b6849868da2d0b062b47c87b6d11ba894f3690633",
        "amount": "1000000000000000000",
        "nonce": "1551036154000",
        "trade_hash": "0xc0cca964a3b829541841ebdc2d938936b9593924cf2bd0de359bc6a5ff4a0ee8",
        "signature": "0xc7943d5ad7d45218a42c2adfb4e01b170e74b9d0fbb5da503347cd6147963b9a3f2df9daf4f07c39cfbfb03e45cbce8764bdfed3f546f23db925ba45b9ed6dc000"
    }
]
```

#### Parameters

*   account_address [string]: the address of the trader
*   order_hash [string]: the hash of the order that is being traded
*   amount [string]: the amount of the order to be traded
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
        "market": "ETH_NJA"
    }
]
```

### GET /return_contract_address

Returns the contract address used for depositing, withdrawing, and posting orders.

#### Response

```
{
    "address": "0x2a0c0dbecc7e4d658f48e01e3fa353f44050c208"
}
```

### GET /chart_data/:market_symbol

Returns chart data for given market symbol.

#### Request

```
curl https://api.ninja.trade/chart_data/ETH_SAN?start=1548264003367&end=1548264032666&period=14400
```

#### Parameters

*   start=&end [string]: UNIX timestamps used to specify the date range for the data returned (optional, if not supplied, return all available data)
*   period [string]: candlestick period in seconds, valid values are 300 (5 minutes), 900 (15 minutes), 1800 (30 minutes), 3600 (1 hour), 7200 (2 hours), 14400 (4 hours), and 86400 (1 day)

#### Response

```
[ 
    { 
        "date": "2019-03-11T12:38:31.000Z",
        "high": "0.03149999",
        "low": "0.031",
        "open": "0.03144307",
        "close": "0.03124064",
        "volume": "64.36480422",
        "quote_volume": "2055.56810329",
        "average": "0.03131241" 
    },
    { 
        "date": "2019-03-11T12:38:31.000Z",
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

### POST /get_fee_info

Returns current trading fees.

#### Response

```
{ 
    "makerFee": "0.00100000",
    "takerFee": "0.00200000"
}
```