---
title: CLI Reference
nav_order: 6
---

# Command Line Reference

Use Hoot flags for scripting or quick one-off actions.

## Quick Reference

| Flag | Description |
|------|-------------|
| `-m "message"` | Post a message |
| `-p` | View your profile |
| `-l` | List your last 4 posts |
| `-k <key>` | Private key to store (use with `-s`) |
| `-s` | Store a new private key |
| `-r "relay1,relay2"` | Custom relays for this command |
| `-nwc "uri"` | Set NWC URI for tipping |
| `-tip <sats>` | Amount to tip (requires `-user`) |
| `-user <npub/hex/lud16>` | User to tip |
| `-version` | Show version |

## Examples

### Post a note

```bash
hoot -m "Hello from the terminal! #cli"
```

### View your profile

```bash
hoot -p
```

### List your recent posts

```bash
hoot -l
```

### Post with custom relays

```bash
hoot -r "wss://relay1.com,wss://relay2.com" -m "Using specific relays"
```

### Update your profile

```bash
hoot -u '{"name":"Alice","about":"Terminal enthusiast","lud16":"alice@getalby.com"}'
```

### Tip via Lightning address

```bash
hoot -tip 100 -user alice@getalby.com
```

### Tip via npub

```bash
hoot -tip 50 -user npub1abc123...
```

### Connect a wallet

```bash
hoot -nwc "nostr+walletconnect://pubkey?relay=..."
```

### Show version

```bash
hoot -version
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `HOOT_PASSWORD` | Encryption password for scripting |

> **Warning**: Using `HOOT_PASSWORD` exposes your password. Only use in trusted environments.
