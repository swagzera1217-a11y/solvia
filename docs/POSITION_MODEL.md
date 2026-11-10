# Position model

The simulator is an educational local calculation. It is not an executable order or venue quotation.

For entry price `E`, mark `P`, margin `M`, leverage `L` and direction `d` (+1 long, -1 short):

```text
notional = M × L
raw PnL = d × (P − E) / E × notional
displayed PnL = max(−M, raw PnL)
equity = max(0, M + raw PnL)
estimated liquidation = E × [1 − d × (1/L − maintenance)]
```

Maintenance is fixed at 2%. Leverage is constrained to 1–20× in the calculation module. A liquidation threshold is reached below the estimate for a long and above it for a short. Saved paper positions use subsequent reference prices when available.

The model excludes fees, funding, slippage, oracle differences, collateral changes, margin tiers and venue rules. Real losses and liquidation prices can differ materially. USDC values assume one USDC equals one dollar.

The replay is a price study, not execution history. It does not establish that a real position could have entered, remained open or exited at those prices.
