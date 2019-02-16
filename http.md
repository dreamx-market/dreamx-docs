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
    *   [POST /create_orders](#post-create_orders)
    *   [POST /get_orders](#post-get_orders)
    *   [POST /delete_orders](#post-delete_orders)
    *   [POST /get_orderbook](#post-get_orderbook)
    *   [POST /get_ticker](#post-get_ticker)
    *   [GET /balances/:account_address](#get-balancesaccount_address)
    *   [POST /get_transfers](#post-get_transfers)
    *   [POST /create_transfers](#post-create_transfers)
    *   [POST /get_trades](#post-get_trades)
    *   [POST /create_trades](#post-create_trades)
    *   [GET /helpers/return_contract_address](#get-helpersreturn_contract_address)
    *   [POST /get_chart_data](#post-get_chart_data)
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

### POST /create_orders

Submit a signed order to the exchange.

#### Payload

```
{
    "account_address": "0xcd8b267f78f37e947dbadb4239fc0a47ce0c8d09",
    "give_token_address": "0xa2b31dacf30a9c50ca473337c01d8a201ae33e32",
    "give_amount": "10000000000000000",
    "take_token_address": "0x12459c951127e0c374ff9105dda097662a027093",
    "take_amount": "20000000000000000",
    "nonce": "1",
    "expiry_timestamp_in_milliseconds": "1506550595000",
    "order_hash": "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
    "signature": "0xc7943d5ad7d45218a42c2adfb4e01b170e74b9d0fbb5da503347cd6147963b9a3f2df9daf4f07c39cfbfb03e45cbce8764bdfed3f546f23db925ba45b9ed6dc000"
}
```

#### Parameters
*   give_amount [string]: giving amount specified in the smallest level of precision of the giving token, precision information can be obtained from [POST get_token_pairs](#post-get_token_pairs)
*   take_amount [string]: taking amount specified in the smallest level of precision of the taking token, precision information can be obtained from [POST get_token_pairs](#post-get_token_pairs)
*   nonce [string]: the current UNIX timestamp in milliseconds
*   order_hash [string]: the result of running `soliditySha3` on the following parameters in their corresponding order:
    1. contract_address (obtained from [POST get_contract_address](#post-get_contract_address))
    2. account_address
    3. give_token_address
    4. give_token_amount
    5. take_token_address
    6. take_token_amount
    7. nonce
    8. expiry_timestamp_in_milliseconds
    ([web3 docs](https://web3js.readthedocs.io/en/1.0/web3-utils.html#soliditysha3))
*   signature [string]: the result of calling `ecsign` with `salted_order_hash` and the private key for `account_address` as its parameters, `salted_order_hash` is obtained by by calling `hashPersonalMessage` with `order_hash`, the values returned by ecsign is then unified into one string using `toRpcSig` ([ethereumjs-util docs](https://github.com/ethereumjs/ethereumjs-util/blob/master/docs/README.md#ecsign))

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
    "nonce": "1",
    "expiry_timestamp_in_milliseconds": "1506550595000",
    "order_hash": "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
    "created_at": "1506550595"
}
```

###### Error Response

Error response will be sent with a non-2xx HTTP status code. See the [Errors](#errors) section for more information.

### POST /get_orders

Retrieves a list of orders given query parameters. This endpoint should be [paginated](#pagination). For querying an entire orderbook snapshot, the [orderbook endpoint](#get-orderbook) is recommended.

#### Payload

```
{
    "account_address": "0xf10105f862C1cB10550F4EeB38697308c7A290Fc",
    "order_hash": "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b"
}
```

Must supply either a `account` or an `order_hash`.

#### Response

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
            "nonce": "1",
            "expiry_timestamp_in_milliseconds": "1506550595000",
            "hash": "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
            "created_at": "1506550595"
        },
        ...
    ]
}
```

Returns HTTP 404 if no order with specified order_hash was found.

### POST /delete_orders

Cancels an order associated with the address.

#### Request

```
{
    "order_hash": "0x22a9ba7f8dd37ed24ae327b14a8a941b0eb072d60e54bcf24640c2af819fc7ec",
    "account_address": "0x257986867faede943786b822282687aacc826b03",
    "nonce": "0",
    "signature": "0xc7943d5ad7d45218a42c2adfb4e01b170e74b9d0fbb5da503347cd6147963b9a3f2df9daf4f07c39cfbfb03e45cbce8764bdfed3f546f23db925ba45b9ed6dc000"
}
```

#### Parameter

*   order_hash [string]: the to-be-cancelled order's order_hash
*   account [string]: the address of the order's owner
*   nonce [string]: the current UNIX timestamp in milliseconds
*   signature [string]: the result of calling `web3.eth.accounts.sign` with `cancelHash` and `account` as its parameters ([web3 docs](https://web3js.readthedocs.io/en/1.0/web3-eth.html#sign)), `cancelHash` is obtained by running `web3.utils.soliditySha3` on the following parameters in their respective order:
    1. order_hash
    2. nonce

#### Response

```
{
    "success": "0"
}
```

### POST /get_orderbook

Retrieves the orderbook for a given token pair sorted by best price (lowest ask first, and highest bid first). This endpoint should be [paginated](#pagination).

#### Payload

```
{
    "market": "ETH_SAN"
}
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
                "nonce": "1",
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
                "nonce": "1",
                "expiry_timestamp_in_milliseconds": "1506550595000",
                "order_hash": "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
                "created_at": "1506550595"
            },
            ...
        ]  
    }
}
```

Bids will be sorted in descending order by price, and asks will be sorted in ascending order by price. Within the price sorted orders, the orders are further sorted by expiration in ascending order.

The way pagination works for this endpoint is that the **page** and **per_page** query params apply to both `bids` and `asks` collections, and if `page` * `per_page` > `total` for a certain collection, the `records` for that collection should just be empty. 

### POST /get_ticker

Designed to behave similar to the API call of the same name provided by the Poloniex HTTP API, with the addition of highs and lows. Returns all necessary 24 hr data. This endpoint should be [paginated](#pagination)

**Please note**: If any field is unavailable due to a lack of trade history or a lack of 24hr data, the field will be set to `'N/A'`. `percentChange`, `baseVolume`, and `quoteVolume` will never be `'N/A'` but may be 0.

#### Payload

```
{
    "market": "ETH_SAN"
}
```

#### Parameters

*   market: return only ticker of given market, eg: "ETH_SAN" (optional)

#### Response

```
{
    "total": 43,
    "page": 1,
    "per_page": 100,
    "records": [
        {
            "baseTokenAddress": "0xa2b31dacf30a9c50ca473337c01d8a201ae33e32",
            "quoteTokenAddress": "0x12459c951127e0c374ff9105dda097662a027093",
            "last": "0.000981",
            "high": "0.0010763",
            "low": "0.0009777",
            "lowestAsk": "0.00098151",
            "highestBid": "0.0007853",
            "percentChange": "-1.83619353",
            "baseVolume": "7.3922603247161",
            "quoteVolume": "7462.998433"
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

### POST /create_transfers

Withdraws funds associated with the address. You cannot withdraw funds that are tied up in open orders.

#### Request

```
{
    "account_address": "0xcd8b267f78f37e947dbadb4239fc0a47ce0c8d09",
    "amount": "1000000000000000000",
    "tokenAddress": "0xa2b31dacf30a9c50ca473337c01d8a201ae33e32",
    "nonce": "100",
    "signature": "0xc7943d5ad7d45218a42c2adfb4e01b170e74b9d0fbb5da503347cd6147963b9a3f2df9daf4f07c39cfbfb03e45cbce8764bdfed3f546f23db925ba45b9ed6dc000"
}
```

#### Parameters

*   account [string]: the address of the order's owner
*   tokenAddress [string]: the address of the token to be withdrawn, `0x0000000000000000000000000000000000000000` for Ether
*   nonce [string]: the current UNIX timestamp in milliseconds
*   signature [string]: the result of calling `web3.eth.accounts.sign` with `withdrawHash` and `account` as its parameters ([web3 docs](https://web3js.readthedocs.io/en/1.0/web3-eth.html#sign)), `withdrawHash` is obtained by running `web3.utils.soliditySha3` on the following parameters in their respective order:
    1. contract_address (obtained from [POST get_contract_address](#post-get_contract_address))
    2. tokenAddress
    3. amount
    4. account
    5. nonce

#### Response

```
{
    "success": "0"
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

### POST /create_trades

Making a trade involves signing a message for each order you wish to fill across and passing in an array of trades. For trades that fill a single order, the usual array with 1 object, or the object alone. The benefit of passing in multiple objects to fill across is that your action is atomic. All trades either succeed or none succeed.

**NOTE**: Currently, all orders being filled in a trade must be for the same give_token_address/take_token_address pair, and must all be signed from the same address.

#### Request

```
[
    {
        "account_address": "0x2dbdcec64db33e673140fbd0ceef610a273b84db",
        "amount": "1000000000000000000",
        "order_hash": "0xc0cca964a3b829541841ebdc2d938936b9593924cf2bd0de359bc6a5ff4a0ee8",
        "nonce": "100",
        "signature": "0xc7943d5ad7d45218a42c2adfb4e01b170e74b9d0fbb5da503347cd6147963b9a3f2df9daf4f07c39cfbfb03e45cbce8764bdfed3f546f23db925ba45b9ed6dc000"
    }
]
```

#### Parameters

*   order_hash [string]: the to-be-cancelled order's order_hash
*   account [string]: the address of the order's owner
*   nonce [string]: the current UNIX timestamp in milliseconds
*   signature [string]: the result of calling `web3.eth.accounts.sign` with `tradeHash` and `account` as its parameters ([web3 docs](https://web3js.readthedocs.io/en/1.0/web3-eth.html#sign)), `tradeHash` is obtained by running `web3.utils.soliditySha3` on the following parameters in their respective order:
    1. contract_address (obtained from [POST get_contract_address](#post-get_contract_address))
    2. order_hash
    3. amount
    4. account
    5. nonce

#### Response

```
[
    {
        "amount": "700000000000000",
        "date": "2017-10-13 16:25:36",
        "total": "49000000000000000",
        "baseTokenAddress": "0xa2b31dacf30a9c50ca473337c01d8a201ae33e32",
        "quoteTokenAddress": "0x12459c951127e0c374ff9105dda097662a027093",
        "type": "buy",
        "price": "70000000000000000",
        "order_hash": "0xcfe4018c59e50e0e1964c979e6213ce5eb8c751cbc98a44251eb48a0985adc52",
        "uuid": "250d51a0-b033-11e7-9984-a9ab79bb8f35"
    }
]
```

### GET /helpers/return_contract_address

Returns the contract address used for depositing, withdrawing, and posting orders.

#### Response

```
{
    "address": "0x2a0c0dbecc7e4d658f48e01e3fa353f44050c208"
}
```

### POST /get_chart_data

Returns candlestick chart data. Required GET parameters are "market", "period" (candlestick period in seconds; valid values are 300, 900, 1800, 7200, 14400, and 86400), "start", and "end". "Start" and "end" are given in UNIX timestamp format and used to specify the date range for the data returned. Fields include:

#### Request

```
[
    {
        "market": "ETH_SAN",
        "startingTimestampInMilliseconds": "1548264003367",
        "endingTimestampInMilliseconds": "1548264032666",
        "periodInSeconds": "14400"
    }
]
```

#### Parameters

*   startingTimestampInMilliseconds=&endingTimestampInMilliseconds [string]: UNIX timestamps used to specify the date range for the data returned
*   periodInSeconds [string]: candlestick period in seconds, valid values are 300, 900, 1800, 7200, 14400, and 86400

#### Response

```
[ 
    { 
        "date": "1539864000",
        "high": "0.03149999",
        "low": "0.031",
        "open": "0.03144307",
        "close": "0.03124064",
        "volume": "64.36480422",
        "quoteVolume": "2055.56810329",
        "weightedAverage": "0.03131241" 
    },
    { 
        "date": "1540209600",
        "high": "0.03153475",
        "low": "0.031265",
        "open": "0.03151497",
        "close": "0.03141781",
        "volume": "39.82606009",
        "quoteVolume": "1268.53159161",
        "weightedAverage": "0.0313954" 
    },
    ...
]
```

#### Response

```
{
    "address": "0x2a0c0dbecc7e4d658f48e01e3fa353f44050c208"
}
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