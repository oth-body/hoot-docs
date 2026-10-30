---
title: Troubleshooting
nav_order: 7
---

# Troubleshooting

Find the message you're seeing below. For tipping messages, see the table in [Tipping with NWC](wallet-connect.md#results-and-errors).

## Signing In

### "Login failed: password verification failed"

The password doesn't match this profile. Passwords can't be recovered. If you still have your nsec, delete the profile's entry by removing `profiles.json` from your [config directory](getting-started/first-profile.md#where-hoot-stores-things) (this removes **all** saved profiles), then add it again.

### "Please enter a valid nsec"

The key must be in `nsec1…` format. If your app only shows a hex private key, convert it to `nsec` first (most Nostr apps can export either).

### Amber / QR sign-in problems

See [Sign In with Amber → Troubleshooting](getting-started/amber-login.md#troubleshooting), including the "refusing to dial relays through HTTPS_PROXY" message.

### The CLI says "Failed to load private key"

The CLI has no key it can use: no key saved with `hoot -s`, and no TUI profile. Add a profile in the TUI, or run:

```bash
hoot -s -k nsec1...
```

With several TUI profiles, the CLI uses the one you last signed in to. Sign in to the right one in the TUI first.

## Posting

### "failed to publish to any relay"

No relay accepted the note.

- Check your internet connection.
- Some relays rate-limit, need payment, or are down. Add a couple of free relays such as `wss://nos.lol` with **[r] Manage Relays**.
- With Amber: check whether Amber is waiting for you to approve the signature.

### My post doesn't show up in other apps

Other apps only see it if they read from at least one of the relays you posted to. Add a widely used relay (e.g. `wss://relay.damus.io` or `wss://nos.lol`) to your list.

## Reading

### The feed is empty

None of your relays answered and nothing is cached yet. Check your internet connection and relay list.

### "No private key available for decrypting DMs"

You signed in with Amber. Reading DMs from Amber isn't supported yet; sign in with an imported profile to read DMs.

### Replies screen shows nothing

Use the 64-character **hex** event ID; `note1…`/`nevent1…` IDs aren't supported yet.

## Display

### The QR code is cut off or garbled

Make the terminal bigger (it redraws on resize) and use a terminal with good Unicode support, such as Windows Terminal, iTerm2, kitty, Alacritty or GNOME Terminal.

### Colors or boxes look wrong

Use a modern terminal emulator; the legacy Windows console (`conhost`) renders poorly.

## Building

### `go: go.mod requires go >= 1.26.0`

Hoot needs Go 1.26 or newer. [Update Go](https://go.dev/dl/), or download a [prebuilt release](https://github.com/oth-body/hoot/releases).

### "go: cannot find main module"

Run `go build -o hoot .` from inside the `hoot` folder.

## Resetting Everything

To start over, delete the config directory. This removes all profiles, your wallet connection, relays and cache:

```bash
# Linux
rm -rf ~/.config/hoot

# macOS
rm -rf ~/Library/Application\ Support/hoot

# Windows (Command Prompt)
rd /s /q %APPDATA%\hoot
```

Make sure you have your nsec saved somewhere else first.

## Getting Help

Search or open an issue at [github.com/oth-body/hoot/issues](https://github.com/oth-body/hoot/issues). Include your `hoot -version` output and the exact error message.
