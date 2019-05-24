# WebSocket API Documentation

NinjaTrade's WebSocket API is currently located at wss://api.ninja.trade/websocket

## Table of Contents

* [MarketOrders](#MarketOrders)
* [MarketTrades](#MarketTrades)
* [MarketChartData](#MarketChartData)
* [AccountBalances](#AccountBalances)
* [AccountOrders](#AccountOrders)
* [AccountTrades](#AccountTrades)
* [AccountTransfers](#AccountTransfers)
* [Tickers](#Tickers)

## MarketOrders

Subscribe to new orders and order state changes in a market.

### Request

```
{
    "command": "subscribe",
    "identifier": {
        "channel": "MarketOrders",
        "market_symbol": "ETH_ONE"
    }
}
```

### Parameters


### Response

This event is emitted when the market has a new order, or an existing order has changed, such as when an order has been filled or cancelled.

```
{
    "channel": "MarketOrders",
    "payload":  [
        {
            "account_address": "0x5b0ca08aac665a36158ced95c676fd5a59ed0c73",
            "give_token_address": "0x210113d69873c0389085cc09d24338a9965f8218",
            "give_amount": "10000000000000000",
            "take_token_address: "0x948e2ffa7bb586f535816eab17642ac395b47284",
            "take_amount": "20000000000000000",
            "filled": "0",
            "status": "open",
            "nonce": "1",
            "expiry_timestamp_in_milliseconds": "1506550595000",
            "order_hash": "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
            "created_at": "2019-05-23T06:49:28.110Z"
        },
        ...
    ]
}
```

## MarketTrades

Subscribe for new trades in a market.

### Request

```
{
    "command": "subscribe",
    "identifier": {
        "channel": "MarketTrades",
        "market_symbol": "ETH_ONE"
    }
}
```

### Parameters


### Response

This event is emitted when the market has a new trade.

```
{
    "channel": "MarketTrades",
    "payload":  [
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
            "gas_fee": "4000",
            "maker_address": "0x5b0ca08aac665a36158ced95c676fd5a59ed0c73",
            "taker_address": "0x7e85cad78cf70b62a6e1087cbe77ca126dbede00",
            "transaction_hash": "0x1b651d0c0578008296f0edf237fdbece67797a0bee9a28c5e4313e44844b25a2",
            "created_at": "2018-06-28 12:21:15"
        },
        ...
    ]
}
```

## MarketChartData

Subscribe for candlestick chart data of a market in a particular period.

### Request

```
{
    "command": "subscribe",
    "identifier": {
        "channel": "MarketChartData",
        "market_symbol": "ETH_ONE",
        "period": "14400"
    }
}
```

### Parameters

*   period [string]: the interval period between the candles, defaults to 3600, can be set to 300 (5 minutes), 900 (15 minutes), 3600 (1 hour), and 86400 (1 day)

### Response

This event is emitted when a new candle has been recorded for the subscribed period.

```
{
    "channel": "chart_data",
    "payload": [
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
    ]
}
```

## AccountBalances

Subscribe to balance changes in an account.

### Request

```
{
    "command": "subscribe",
    "identifier": {
        "channel": "AccountBalances",
        "account_address": "0x5b0ca08aac665a36158ced95c676fd5a59ed0c73"
    }
}
```

### Parameters

*   account_address [string]: the address of the account to subscribe to.

### Response

This event is emitted when there have been new changes to to an account's balances

```
{
    "channel": "AccountBalances",
    "payload": [
        {
            "token": "0x210113d69873c0389085cc09d24338a9965f8218",
            "balance": 500000000000000000,
            "hold_balance": 300000000000000000
        },
        ...
    ]
}
```

## AccountOrders

Subscribe to new orders and order state changes in an account.

### Request

```
{
    "command": "subscribe",
    "identifier": {
        "channel": "AccountOrders",
        "account_address": "0x5b0ca08aac665a36158ced95c676fd5a59ed0c73"
    }
}
```

### Parameters

*   account_address [string]: the address of the account to subscribe to.

### Response

```
{
    "channel": "AccountOrders",
    "payload":  [
        {
            "account_address": "0x5b0ca08aac665a36158ced95c676fd5a59ed0c73",
            "give_token_address": "0x210113d69873c0389085cc09d24338a9965f8218",
            "give_amount": "10000000000000000",
            "take_token_address: "0x948e2ffa7bb586f535816eab17642ac395b47284",
            "take_amount": "20000000000000000",
            "filled": "0",
            "status": "open",
            "nonce": "1",
            "expiry_timestamp_in_milliseconds": "1506550595000",
            "order_hash": "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
            "created_at": "2019-05-23T06:49:28.110Z"
        },
        ...
    ]
}
```

## AccountTrades

Subscribe to new trades of an account

### Request

```
{
    "command": "subscribe",
    "identifier": {
        "channel": "AccountTrades",
        "account_address": "0x5b0ca08aac665a36158ced95c676fd5a59ed0c73"
    }
}
```

### Parameter

*   account_address [string]: the address of the account to subscribe to.

### Response

```
{
    "channel": "Tickers",
    "payload": [
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
            "gas_fee": "4000",
            "maker_address": "0x5b0ca08aac665a36158ced95c676fd5a59ed0c73",
            "taker_address": "0x7e85cad78cf70b62a6e1087cbe77ca126dbede00",
            "transaction_hash": "0x1b651d0c0578008296f0edf237fdbece67797a0bee9a28c5e4313e44844b25a2",
            "created_at": "2018-06-28 12:21:15"
        }
    ]
}
```

## AccountTransfers

Subscribe to new transfers of an account.

### Request

```
{
    "command": "subscribe",
    "identifier": {
        "channel": "AccountTransfers",
        "account_address": "0x5b0ca08aac665a36158ced95c676fd5a59ed0c73"
    }
}
```

### Parameters

*   account_address [string]: the address of the account to subscribe to.

### Response

```
{
    "channel": "Tickers",
    "payload": [
        {
            "id": "169",
            "type": "deposit",
            "token_address": "0x210113d69873c0389085cc09d24338a9965f8218",
            "amount": "1000000000000000000",
            "transaction_hash": "0xb844692c9c29ae7d7cb246bacac84f8a435a402d2074a85c37bbf03af928f60f",
            "block_hash": nil,
            "block_number": nil,
            "created_at": "1506550595"
        }
    ]
}
```

## Tickers

Subscribe for ticker data of a specific market or of all markets if `market_symbol` is omitted.

### Request

```
{
    "command": "subscribe",
    "identifier": {
        "channel": "Tickers",
        "market_symbol": "ETH_ONE"
    }
}
```

### Parameters

*   market_symbol: the symbol of the market to subscribe to (optional)

### Response

```
{
    "channel": "Tickers",
    "payload": [
        {
            "base_token_address": "0x210113d69873c0389085cc09d24338a9965f8218",
            "quote_token_address": "0x948e2ffa7bb586f535816eab17642ac395b47284",
            "symbol": "ETH_ONE",
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