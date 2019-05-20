# WebSocket API Documentation

## Table of Contents

* [market_orders](#market_orders)
* [market_trades](#market_trades)
* [market_tickers](#market_tickers)
* [market_chart_data](#market_chart_data)
* [market_order_cancels](#market_order_cancels)
* [account_balances](#account_balances)
* [account_orders](#account_orders)
* [account_order_cancels](#account_order_cancels)
* [account_trades](#account_trades)
* [account_transfers](#account_transfers)

## market_orders

Subscribe for new orders and order updates.

### Request

```
{
    "type": "subscribe",
    "channel": "market_orders",
    "requestId": "123e4567-e89b-12d3-a456-426655440000",
    "payload": {
        "market_symbol": "ETH_SAN"
    }
}
```

### Parameters

*   requestId: a string uuid that will be sent back by the server in response messages so the client can appropriately respond when multiple subscriptions are made

### Reponse

This message is sent whenever the exchange receives a new order, or when the exchange deems an update necessary (such as when the state of the order changes). The scenarios where an update may occur include:
* The exchange received a new order.
* An order was fully or partially filled, so `filled` has changed.
* The order is cancelled.

An update is not necessary for order expiration, as that information can be derived from the `expiryInSeconds` field in the order.

Updates can be sent in bulk since the payload of the message specifies a collection of updated or new trades and orders.

```
{
    "type": "update",
    "channel": "orders",
    "requestId": "123e4567-e89b-12d3-a456-426655440000",
    "payload":  [
        {
            "account": "0x5b0ca08aac665a36158ced95c676fd5a59ed0c73",
            "giveTokenAddress": "0x210113d69873c0389085cc09d24338a9965f8218",
            "giveAmount": "10000000000000000",
            "takeTokenAddress: "0x948e2ffa7bb586f535816eab17642ac395b47284",
            "takeAmount": "20000000000000000",
            "filled": "0",
            "nonce": "1",
            "expiryTimestampInMilliseconds": "1506550595000",
            "orderHash": "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
            "signature": "0xc7943d5ad7d45218a42c2adfb4e01b170e74b9d0fbb5da503347cd6147963b9a3f2df9daf4f07c39cfbfb03e45cbce8764bdfed3f546f23db925ba45b9ed6dc000"
        },
        ...
    ]
}
```

*   `requestId` - a string uuid that corresponds to the requestId sent by the client in the `subscribe` message

## market_trades

Subscribe for new trades.

### Request

```
{
    "type": "subscribe",
    "channel": "market_trades",
    "requestId": "123e4567-e89b-12d3-a456-426655440000",
    "payload": {
        "market_symbol": "ETH_SAN"
    }
}
```

### Parameters

*   requestId: a string uuid that will be sent back by the server in response messages so the client can appropriately respond when multiple subscriptions are made

### Response

This message is sent whenever the exchange receives a new trade.

Updates can be sent in bulk since the payload of the message specifies a collection of updated or new trades and orders.

```
{
    "type": "update",
    "channel": "trades",
    "requestId": "123e4567-e89b-12d3-a456-426655440000",
    "payload":  [
        {
            "id": "1885452",
            "giveTokenAddress": "0x210113d69873c0389085cc09d24338a9965f8218",
            "giveAmount": "10000000000000000",
            "takeTokenAddress": "0x948e2ffa7bb586f535816eab17642ac395b47284",
            "takeAmount": "20000000000000000",
            "orderHash": "0xc0cca964a3b829541841ebdc2d938936b9593924cf2bd0de359bc6a5ff4a0ee8",
            "uuid": "ca5ca940-cd78-11e8-812d-3b7d27265b69",
            "buyerFee": "123300",
            "sellerFee": "23000",
            "gasFee": "4000",
            "makerAddress": "0x1d1fa573d0d1d4ab62cf59273941a27e3862f55b",
            "takerAddress": "0x2d98a4263084f918130410c66d9ecbe5325f7edf",
            "transactionHash": "0x1b651d0c0578008296f0edf237fdbece67797a0bee9a28c5e4313e44844b25a2",
            "created_at": "2018-12-11 17:12:10"
        },
        ...
    ]
}
```

*   `requestId` - a string uuid that corresponds to the requestId sent by the client in the `subscribe` message

## market_ticker

Subscribe for ticker updates.

### Request

```
{
    "type": "subscribe",
    "channel": "market_ticker",
    "requestId": "123e4567-e89b-12d3-a456-426655440000",
    "payload": {
        "market_symbol": "ETH_SAN"
    }
}
```

### Parameters

*   requestId: a string uuid that will be sent back by the server in response messages so the client can appropriately respond when multiple subscriptions are made
*   market_symbol: the symbol of the market to get the ticker from (optional, subscribe to all tickers if omitted)

### Response

Updates can be sent in bulk since the payload of the message specifies a collection of updated or new trades and orders.

```
{
    "type": "update",
    "channel": "ticker",
    "requestId": "123e4567-e89b-12d3-a456-426655440000",
    "payload": [
        {
            "baseTokenAddress": "0x210113d69873c0389085cc09d24338a9965f8218",
            "quoteTokenAddress": "0x948e2ffa7bb586f535816eab17642ac395b47284",
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

## market_chart_data

Subscribe for new candles.

```
{
    "type": "subscribe",
    "channel": "market_chart_data",
    "requestId": "123e4567-e89b-12d3-a456-426655440000",
    "payload": {
        "market_symbol": "ETH_SAN",
        "periodInSeconds": "14400"
    }
}
```

### Parameters

*   periodInSeconds: candlestick period in seconds, valid values are 300, 900, 1800, 7200, 14400, and 86400
*   requestId: a string uuid that will be sent back by the server in response messages so the client can appropriately respond when multiple subscriptions are made

### Response

This message is sent whenever a new candle is recorded.

Updates can be sent in bulk since the payload of the message specifies a collection of updated or new trades and orders.

```
{
    "type": "update",
    "channel": "chart_data",
    "requestId": "123e4567-e89b-12d3-a456-426655440000",
    "payload": [
        { 
            "date": "1540209600",
            "high": "0.03153475",
            "low": "0.031265",
            "open": "0.03151497",
            "close": "0.03141781",
            "volume": "39.82606009",
            "quoteVolume": "1268.53159161",
            "weightedAverage": "0.0313954" 
        }
    ]
}
```

## market_order_cancels

Subscribe to new order cancels occured within a given market

## account_balances

## account_orders

## account_order_cancels

## account_trades

## account_transfers