# Public API

All endpoints are read-only. Neither creates a transaction nor accepts a signing key.

## `GET /api/markets`

Returns market references, a fetched sample of Solana pools, a SOL/USDT exchange trade reference and the latest confirmed Solana slot.

```json
{
  "asOf": "ISO-8601 retrieval time",
  "snapshot": false,
  "markets": [],
  "pools": [],
  "tape": [],
  "network": { "name": "Solana mainnet", "slot": null },
  "sources": {},
  "errors": []
}
```

Market entries include `symbol`, `price`, `change`, `high`, `low`, `volume`, `sourceTime` and `candles`. Daily candles include `time`, `open`, `high`, `low`, `close` and `volume`.

Pools include `id`, `url`, `dex`, `base`, `quote`, `price`, `change`, `liquidity`, `volume`, `buys`, `sells` and `image`. The fetched sample is filtered to Solana pairs with more than $10,000 quoted liquidity and ordered by 24-hour volume. This is not a comprehensive listing or an endorsement.

Unavailable values are nullable. Partial source failures appear in `errors`. If all market sources fail, the endpoint uses its last response or bundled public snapshot with `snapshot: true`; the original `asOf` is preserved. Without a usable snapshot it returns empty arrays and an error. Non-GET requests return 405.

## `GET /api/balance?address=<Solana-public-address>`

Reads the public account's confirmed native SOL balance.

```json
{
  "address": "public account address",
  "lamports": 0,
  "slot": 0,
  "asOf": "ISO-8601 retrieval time"
}
```

One SOL equals 1,000,000,000 lamports. Base58 format and address length are checked before the RPC query. Invalid input returns 400, RPC failure 503, and non-GET methods 405. Responses use `Cache-Control: no-store`.

The public address is sent to Solana's public RPC. Do not pass recovery phrases, private keys or other secrets to any endpoint.

## GET /api/candles?symbol=SOL&interval=1h

Returns 240 public exchange candles with OHLCV fields, source name, symbol, interval and retrieval time. Symbols: SOL, BTC, ETH, XRP, BNB, DOGE. Intervals: 1m, 5m, 15m, 1h, 6h, 1d. Unsupported query values return 400 before a network request. Source failure returns 503; non-GET returns 405.

## GET /api/launches

Returns a fetched sample of public Solana token profiles and their most liquid quoted pair. The pump.fun-origin filter uses the mint suffix; verify the original token launch independently. The pair venue determines the displayed Trading / Market pool state; bonding-curve progress is not inferred. Includes source and retrieval time, and snapshot=true for a saved fallback. No token is deployed here.
