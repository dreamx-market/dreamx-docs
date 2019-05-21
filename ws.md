# WebSocket API Documentation

## Table of Contents

* [market_orders](#market_orders)
* [market_trades](#market_trades)
* [market_chart_data](#market_chart_data)
* [account_balances](#account_balances)
* [account_orders](#account_orders)
* [account_trades](#account_trades)
* [account_transfers](#account_transfers)
* [tickers](#tickers)

## market_orders

Subscribe to new orders in a market.

### Request

```
{
    "type": "subscribe",
    "channel": "market_orders",
    "request_id": "123e4567-e89b-12d3-a456-426655440000",
    "payload": {
        "market_symbol": "ETH_ONE"
    }
}
```

### Parameters

*   request_id: a random string that will be included in the responses to distinguish between responses made by different subscriptions

### Response

This event is emitted when the market has a new order, or an existing order has changed, such as when an order has been filled or cancelled.

```
{
    "type": "update",
    "channel": "market_orders",
    "request_id": "123e4567-e89b-12d3-a456-426655440000",
    "payload":  [
        {
            "account": "0x5b0ca08aac665a36158ced95c676fd5a59ed0c73",
            "give_token_address": "0x210113d69873c0389085cc09d24338a9965f8218",
            "give_amount": "10000000000000000",
            "take_token_address: "0x948e2ffa7bb586f535816eab17642ac395b47284",
            "take_amount": "20000000000000000",
            "filled": "0",
            "status": "open",
            "nonce": "1",
            "expiry_timestamp_in_milliseconds": "1506550595000",
            "order_hash": "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
            "signature": "0xc7943d5ad7d45218a42c2adfb4e01b170e74b9d0fbb5da503347cd6147963b9a3f2df9daf4f07c39cfbfb03e45cbce8764bdfed3f546f23db925ba45b9ed6dc000"
        },
        ...
    ]
}
```

## market_trades

Subscribe for new trades in a market.

### Request

```
{
    "type": "subscribe",
    "channel": "market_trades",
    "request_id": "123e4567-e89b-12d3-a456-426655440000",
    "payload": {
        "market_symbol": "ETH_ONE"
    }
}
```

### Parameters

*   request_id: a random string that will be included in the responses to distinguish between responses made by different subscriptions.

### Response

This event is emitted when the market has a new trade.

```
{
    "type": "update",
    "channel": "market_trades",
    "request_id": "123e4567-e89b-12d3-a456-426655440000",
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

## market_chart_data

Subscribe for candlestick chart data of a market in a particular period.

```
{
    "type": "subscribe",
    "channel": "market_chart_data",
    "request_id": "123e4567-e89b-12d3-a456-426655440000",
    "payload": {
        "market_symbol": "ETH_ONE",
        "period": "14400"
    }
}
```

### Parameters

*   period [string]: the interval period between the candles, defaults to 3600, can be set to 300 (5 minutes), 900 (15 minutes), 3600 (1 hour), and 86400 (1 day)
*   request_id [string]: a random string that will be included in the responses to distinguish between responses made by different subscriptions.

### Response

This event is emitted when a new candle has been recorded for the subscribed period.

```
{
    "type": "update",
    "channel": "chart_data",
    "request_id": "123e4567-e89b-12d3-a456-426655440000",
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

## account_balances

## account_orders

## account_trades

## account_transfers

## tickers

Subscribe for ticker data of a specific market or of all markets if `market_symbol` is omitted.

### Request

```
{
    "type": "subscribe",
    "channel": "tickers",
    "request_id": "123e4567-e89b-12d3-a456-426655440000",
    "payload": {
        "market_symbol": "ETH_ONE"
    }
}
```

### Parameters

*   request_id: a random string that will be included in the responses to distinguish between responses made by different subscriptions.
*   market_symbol: the symbol of the market to subscribe to (optional)

### Response

```
{
    "type": "update",
    "channel": "tickers",
    "request_id": "123e4567-e89b-12d3-a456-426655440000",
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