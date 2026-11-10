# Architecture

The UI is a buildless ES-module application. Browser history routes between the landing page, documentation and five workspaces. The local server and Vercel rewrites return `index.html` for these routes.

Canvas fields use procedural pixel rendering, pause work when the document is hidden and respect reduced-motion preferences. Charts use fetched exchange reference data. No external animation service or analytics collector is required.

## Wallet boundary

The browser discovers Wallet Standard wallets and supports Phantom's injected provider. Connection requests public account information. The balance endpoint performs `getBalance` with confirmed commitment.

There is no signing method, delegation, custodial wallet, automatic token approval or recovery-phrase input. The wallet connection is not persisted on the server. Users complete financial actions themselves on an explicitly linked external venue.

## Local storage

Namespaced `solvia:` keys (with a read-only fallback for legacy `solveil:` keys) contain paper positions, a watchlist and launch drafts. Imports validate names, tickers, HTTPS links and image data. Images are limited to PNG, JPEG or WebP. Exports use portable JSON.

Local storage is neither encrypted backup nor shared server storage. Clearing site data can erase it. Export important drafts first.

## Operational limits

Public APIs may rate-limit, geo-restrict or fail. Requests have timeouts; market data uses a marked fallback. A native balance failure is shown as unavailable, never as a confirmed zero.

The repository has no on-chain program, minting service, matching engine, shielded vault or production perpetual exchange. These require separate design, verification and deployment.
