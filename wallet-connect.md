---
title: NWC Wallet Connect
nav_order: 4
---

# Connecting a Lightning Wallet

Send sats (satoshis) to other users via Nostr Wallet Connect (NWC). This lets you tip without revealing your node details.

## What is NWC?

Nost Wallet Connect is a protocol that connects your Lightning wallet to apps like Hoot. Instead of exposing your node IP, you share a connection URI that apps use to request payments on your behalf.

**Important**: You're approving a specific connection; the app can't spend freely.

## Supported Wallets

- [Alby](https://getalby.com) — Browser extension, recommended for most users
- [Mutiny](https://mutinywallet.com) — Self-custodial wallet
- [Coracle](https://coracle.social) — Web wallet
- Any wallet supporting NWC

## Set Up Alby

1. Install the [Alby browser extension](https://getalby.com)
2. Create an account or connect your Lightning node
3. Click the Alby icon → **Connect apps** → **Nostr Wallet Connect**
4. Copy the connection URI (starts with `nostr+walletconnect://...`)

## Connect to Hoot

### Via TUI

1. Launch Hoot and log in
2. Select **Tip someone**
3. Enter the recipient's npub or Lightning address
4. Enter the amount in sats

But first, you need to connect your wallet:

### Via CLI

1. Save your NWC URI:

```bash
hoot -nwc "nostr+walletconnect://pubkey?relay=wss://relay.example.com&secret=..."
```

2. Verify it saved:

```bash
# Check config was created
cat ~/.config/nostr-cli/nwc.txt
```

### Save NWC in TUI

Currently, NWC setup requires the CLI. After saving the URI via CLI, the TUI tip feature will use it automatically.

## Sending a Tip

### By Lightning Address

```bash
hoot -tip 100 -user alice@getalby.com
```

Hoot will:
1. Resolve the Lightning address from Alice's Nostr profile
2. Fetch an invoice for 100 sats
3. Pay it via your connected wallet

### By npub

```bash
hoot -tip 50 -user npub1abc123...
```

Hoot looks up the user's profile, finds their Lightning address, and pays.

### By Hex Public Key

```bash
hoot -tip 100 -user 3f2a... (hex pubkey)
```

## Troubleshooting

### "No NWC URI configured"

You haven't saved your NWC connection yet. Run:

```bash
hoot -nwc "nostr+walletconnect://..."
```

### "Could not find lightning address"

The user hasn't set a Lightning address in their profile. Ask them to add one (typically `lud16` field).

### "Payment failed"

Common causes:
- Insufficient balance in your wallet
- Wallet disconnected (check Alby extension is active)
- Invoice expired (try again)

### "Connection timeout"

- Check your internet connection
- Verify the NWC relay URL is accessible
- Try a different relay

### Verify Wallet Connection

Check if your NWC URI is properly saved:

```bash
# Linux/macOS
cat ~/.config/nostr-cli/nwc.txt

# Windows
type %APPDATA%\nostr-cli\nwc.txt
```

The file should contain your full `nostr+walletconnect://...` URI.
