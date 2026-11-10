# Solveil

A Solana market workspace: discover liquidity, prepare a token launch and model a position before deciding what to sign.

**Independent project · Solana mainnet data · no custody**

[Open the workspace](https://solveil-site-release.vercel.app/) · [Launches](https://solveil-site-release.vercel.app/app/launch)

## Get started

Requires Node.js 20 or later. No third-party runtime dependencies.

```sh
npm run dev
```

Open `http://127.0.0.1:4448`. Set `PORT` to use another port.

```sh
npm test
npm run check
```

## Product

| Workspace | Available behavior |
| --- | --- |
| Markets | Public SOL, BTC, ETH, XRP, BNB and DOGE references; daily and intraday history |
| Pools | Solana liquidity and volume discovery, search and local watchlist |
| Swap | Indicative SOL/USDC estimate and explicit Jupiter handoff |
| Launch | Separate launch listing and creation routes; public token data, local drafts, JSON import/export and pump.fun handoff |
| Positions | Local leverage simulator, direction, size and liquidation estimates |
| Wallet | Phantom / Wallet Standard connection and confirmed public SOL balance |

This version **does not execute swaps, deploy tokens or open perpetual positions**. External venues provide their own quotes, transactions and rules. Connecting a wallet requests its public address only. No recovery phrase, private key, token approval or transaction signature is requested here.

## Architecture

```text
dist/
  index.html       Landing, app and documentation shells
  style.css        Responsive layout and Solana colors
  app.js           Routes, data, wallet and local drafts
  motion.js        Procedural hero pixel fields
  landing-demos.js Pixel candle, curve and position-replay demonstrations
  terminal.js      Perps, swap, pool, launch and vault screens
  terminal-visuals.js Candlestick rendering and procedural app artwork
  terminal.css     Dense app layout
  landing-detail.css Landing demonstration composition
  math.js          Position calculation and input validation
  api/
    markets.js     Public market aggregation and marked fallback
    balance.js     Read-only Solana balance endpoint
    candles.js     Six markets and six candle intervals
    launches.js    Public token-market discovery and marked fallback
  assets/          Local fonts and project artwork
  data/            Public market fallback snapshot
docs/              API, architecture and model reference
tests/             Domain and endpoint-validation tests
server.mjs         Local server
```

Browser → same-origin API → public sources. The server stores no user account, signing key, seed phrase or wallet session. Drafts, watchlists and paper positions stay in browser local storage.

## Data sources

- [DexScreener API](https://docs.dexscreener.com/api/reference): Solana pools, liquidity, volume and venue links.
- [Binance public market data](https://github.com/binance/binance-spot-api-docs/blob/master/rest-api.md): exchange references and daily candles, not trades executed by Solveil.
- [Solana JSON RPC](https://solana.com/docs/rpc): confirmed slot and public SOL balance.
- [Phantom provider](https://docs.phantom.com/solana/establishing-a-connection) and Wallet Standard: address connection.

Data refreshes every 30 seconds while visible. Requests are deduplicated and cached briefly. Fallback data retains its original retrieval timestamp and is visibly marked **Saved snapshot**. Failed sources are reported rather than replaced with invented activity.

## Deploy

Deploy the contents of `dist/` to Vercel as an Other project with Node serverless functions. `dist/vercel.json` contains route rewrites. No API keys or build step are required. Public upstream rate limits and availability apply.

## Documentation

- [API reference](docs/API.md)
- [Architecture and wallet boundaries](docs/ARCHITECTURE.md)
- [Position model](docs/POSITION_MODEL.md)
- [Contributing](CONTRIBUTING.md)
- [Third-party notices](THIRD_PARTY.md)

## Status

Early working interface. No contract deployment, audit, shielded-transfer system, project mint or financial return is claimed. The landing liquidity distribution and launch progression are illustrative.

Layout study inspired by Curveil, rebuilt for Solana with a separate implementation. Not affiliated with Curveil, Solana Foundation, Jupiter, Binance or pump.fun. Third-party marks remain their owners' property.

MIT license applies to the original code. Font notices are included separately.
