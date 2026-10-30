---
title: Tipping and Zaps
nav_order: 5
---

# Tipping and Zaps with Nostr Wallet Connect

Hoot sends tips (sats over the Lightning Network) through your own wallet using **Nostr Wallet Connect** ([NIP-47](https://github.com/nostr-protocol/nips/blob/master/47.md)). You create a connection in your wallet, give its connection string to Hoot once, and Hoot asks the wallet to pay each tip.

## 1. Get a Connection String from Your Wallet

Any wallet that supports NWC works, for example:

- [Alby Hub](https://getalby.com): self-custodial, with the most complete NWC support.
- [Rizful](https://rizful.com): quick to start, but custodial.
- Others listed at [nwc.dev](https://nwc.dev).

In your wallet, create a new **app connection** for Hoot and copy its **connection secret**. Make sure the connection is allowed to **send** payments: some wallets also offer receive-only connections, which can't pay tips.

The connection string looks like:

```
nostr+walletconnect://<wallet-pubkey>?relay=wss://relay.example.com&secret=<secret>
```

> **Treat it like a password.** Anyone with this string can spend from the connection. Most wallets let you set a **spending budget** for a connection; set one.

## 2. Give It to Hoot

```bash
hoot -nwc "nostr+walletconnect://..."
```

Hoot checks the string before saving it (correct scheme, a hex wallet key and secret, a relay) and stores it in `nwc.txt` in your [config directory](getting-started/first-profile.md#where-hoot-stores-things). Run the command again to replace it.

## 3. Send a Tip

### From the TUI

1. Choose **[t] Tip someone**.
2. Enter who to tip: a Lightning address (`alice@getalby.com`), an `npub1…`, or a hex public key. Press **Enter**.
3. Enter the amount in sats and press **Enter**.
4. Hoot shows **Waiting for your wallet to pay...**, then the result, e.g. **⚡ Paid 21 sats to alice@getalby.com (fee 3000 msat)**.

### From the CLI

```bash
hoot -tip 21 -user alice@getalby.com     # Lightning address
hoot -tip 21 -user npub1...              # npub
hoot -tip 21 -user <hex-pubkey>          # hex public key
```

The CLI prints each step and, on success, the payment preimage (proof of payment).

### Zap a Post

In the feed or a thread, select a post and press **`z`**, then enter an amount. If the author's Lightning address supports Nostr zaps (NIP-57), Hoot attaches a signed zap request, so **the zap shows up on Nostr** against that post, like zaps from other apps. If it doesn't support zaps, the sats are sent as a plain tip and Hoot tells you so.

## What Hoot Does

1. **Finds the Lightning address.** For an npub or hex key, Hoot reads the `lud16` field from that person's Nostr profile.
2. **Gets an invoice** from the address's LNURL server, after checking the amount is within the recipient's minimum and maximum.
3. **Checks the invoice** is for exactly the amount you asked for, and refuses to pay if it isn't.
4. **Asks your wallet to pay** over NWC, then **waits up to 60 seconds** for the wallet's answer.

Wallet requests are encrypted with NIP-44 when your wallet advertises support for it, and NIP-04 otherwise.

## Results and Errors

| You see | Meaning |
|---|---|
| **Paid N sats to …** | Done. The wallet confirmed the payment. |
| **wallet error INSUFFICIENT_BALANCE: …** | The wallet refused; it says why. Other codes include `QUOTA_EXCEEDED` (connection budget used up) and `PAYMENT_FAILED` (no route). |
| **wallet did not respond in time; the payment may still complete…** | Hoot didn't hear back within 60s. **Check your wallet's history before trying again** so you don't pay twice. |
| **wallet error RESTRICTED** or **UNAUTHORIZED** | The connection isn't allowed to send payments (e.g. receive-only), or was revoked. Create a new connection that can send, and save it with `hoot -nwc`. |
| **no wallet connected: run `hoot -nwc …`** | You haven't saved a connection string yet. |
| **could not find a lightning address for that user** | Their profile has no `lud16`. Ask them for a Lightning address and tip that directly. |
| **alice@… accepts 1–100000 sats, not 500000** | The amount is outside the recipient's limits. |
| **LNURL server error: …** | The recipient's Lightning address provider returned an error. |
| **invoice is for … msat but … msat was requested; refusing to pay** | The recipient's server sent a wrong invoice. Hoot didn't pay it. |

## Check Your Saved Connection

```bash
# Linux
cat ~/.config/hoot/nwc.txt

# macOS
cat ~/Library/Application\ Support/hoot/nwc.txt

# Windows
type %APPDATA%\hoot\nwc.txt
```

Avoid pasting the output anywhere: it contains your connection secret.
