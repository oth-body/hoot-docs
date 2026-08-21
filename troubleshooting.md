---
title: Troubleshooting
nav_order: 5
---

# Troubleshooting

Common issues and solutions.

## App Won't Start

### "TUI error" on launch

```
TUI error: error connecting to relay
```

**Cause**: No network access or all configured relays are unreachable.

**Fix**: Check your internet connection, then try different relays:

```
wss://relay.damus.io
wss://nos.lol
wss://purplepag.es
```

### Blank screen or rendering issues

**Cause**: Terminal doesn't support the character rendering.

**Fix**: Try a different terminal (Windows Terminal, iTerm2, Alacritty) or resize the window.

## Key and Profile Issues

### "Password verification failed"

**Cause**: Wrong password entered for your profile.

**Fix**: 
- Use the password you created when adding the profile
- Cannot be recovered — you'll need to delete the profile and re-add it

Delete your profile:
```bash
# Manually remove the config directory (Linux/macOS)
rm -rf ~/.config/nostr-cli/

# Or on Windows
rd /s %APPDATA%\nostr-cli
```

### "Invalid nsec"

**Cause**: Private key format is wrong.

**Fix**: Ensure the key starts with `nsec1` (bech32 format). Hex-format keys (`abcd123...`) won't work with Hoot.

### Lost my password

**Cause**: Passwords cannot be recovered.

**Fix**: If you have your original nsec, delete the profile and re-add with a new password:

```bash
rm -rf ~/.config/nostr-cli/
hoot  # Create new profile with same nsec
```

## Posting Issues

### "Failed to publish to any relay"

**Cause**: All relays rejected your event (rate limiting, validation failure).

**Fix**:
- Wait and retry — some relays rate limit
- Remove unreliable relays from your list
- Check your key is valid

### Post appears nowhere

**Cause**: Relays may be slow to propagate, or you're looking at the wrong relay's view.

**Fix**: 
- Posts take a few seconds to appear
- Query a specific relay directly to verify publication
- Try `hoot -l` to see your recent posts

## NWC / Tipping Issues

### "No NWC URI configured"

**Cause**: Wallet connection not saved.

**Fix**: Save your NWC URI:

```bash
hoot -nwc "nostr+walletconnect://your-uri-here"
```

### "Payment request timeout"

**Cause**: Wallet didn't respond in time.

**Fix**:
- Ensure your wallet (Alby, etc.) is connected and unlocked
- Try again — payments can timeout under load

### "Insufficient balance"

**Cause**: Your Lightning wallet doesn't have enough sats.

**Fix**: Add funds to your wallet and retry.

### Zap doesn't work after NWC setup

**Causes to check in order**:

1. **NWC URI saved correctly?**
   ```bash
   cat ~/.config/nostr-cli/nwc.txt
   ```
   Should output a `nostr+walletconnect://...` URI.

2. **Wallet connected and unlocked?**
   Open Alby/Mutiny and verify connection status.

3. **Recipient has Lightning address?**
   Ask them to add one to their profile metadata.

4. **Invoice expired?**
   Retry — invoices expire quickly.

5. **Relay connectivity?**
   NWC communicates via relay; ensure your relay is working.

## Build Errors

### "go: cannot find main module"

**Cause**: Running `go build` outside the project directory.

**Fix**:
```bash
cd hoot
go build -o hoot
```

### "package not found" for dependencies

**Cause**: Dependencies not downloaded.

**Fix**:
```bash
go mod download
go build -o hoot
```

### Go version too old

**Cause**: Project requires Go 1.19+.

**Fix**: [Update Go](https://go.dev/doc/install):

```bash
go version  # Check current version
```

## Getting Help

If these don't solve your issue:

1. Check [existing GitHub issues](https://github.com/oth-body/hoot/issues)
2. Ask in the [Nostr community](https://nostr.how) — use `npub1hoot...` to find Hoot developers
