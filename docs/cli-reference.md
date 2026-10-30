---
title: CLI Reference
nav_order: 6
---

# CLI Reference

Run `hoot` with flags for scripts and quick one-off actions. Run it with **no** flags to open the TUI.

## Which Key the CLI Uses

The CLI signs with a key stored on this computer:

1. the key saved with `hoot -s`, if there is one; otherwise
2. the TUI profile you last signed in to (or your only profile).

It asks for that key's password, or reads it from `HOOT_PASSWORD`. If there's no stored key, commands fail with "Failed to load private key". Add a profile in the TUI or run `hoot -s -k <nsec>` first. Amber sign-in isn't available from the CLI.

## Flags

### Posting and Profile

| Flag | Description |
|------|-------------|
| `-m "text"` | Post a note. `#hashtags` become `t` tags. |
| `-r "url1,url2"` | Relays to use for `-m` and `-u` instead of your saved list |
| `-l` | Show your last 4 notes |
| `-p` | Show your profile (kind 0) as JSON |
| `-u '<json>'` | Publish a new profile (kind 0). **Replaces your whole profile**, see below. |

### Reading

| Flag | Description |
|------|-------------|
| `-dms` | Show your DMs, sent and received |
| `-replies <event-id>` | Show replies and reactions to a note (64-char hex event ID) |

### Keys

| Flag | Description |
|------|-------------|
| `-npub` | Print your npub. TUI profiles don't need a password for this. |
| `-s -k <nsec>` | Store a private key on this computer, encrypted with a password |

### Tipping

| Flag | Description |
|------|-------------|
| `-nwc "nostr+walletconnect://…"` | Save your wallet connection ([guide](wallet-connect.md)) |
| `-tip <sats> -user <who>` | Tip someone. `<who>` is a Lightning address, `npub1…` or hex pubkey. |

### App Handlers (NIP-89)

| Flag | Description |
|------|-------------|
| `-register-handler "1,6"` | Announce this key as a handler app for event kinds (needs `-url-template`) |
| `-url-template "https://…/<bech32>"` | URL template for the handler |
| `-platform web` | Platform for the handler or recommendation: `web`, `ios` or `android` (default `web`) |
| `-recommend "pubkey:d-tag:kind"` | Recommend a handler app for a kind |
| `-find-handlers <kind>` | List handler apps announced for a kind |

### Other

| Flag | Description |
|------|-------------|
| `-version` | Print version, commit and build date |

## Examples

### Post a note

```bash
hoot -m "Hello from the terminal! #cli"
```

### Post to specific relays

```bash
hoot -r "wss://relay1.example.com,wss://relay2.example.com" -m "Using specific relays"
```

### Update your profile

`-u` publishes exactly the JSON you give it as your new profile, so **any field you leave out is removed**. Start from your current profile:

```bash
hoot -p     # copy the JSON it prints, edit it, then:
hoot -u '{"name":"Alice","about":"Terminal enthusiast","picture":"https://…","nip05":"alice@example.com","lud16":"alice@getalby.com"}'
```

### Tip someone

```bash
hoot -tip 21 -user alice@getalby.com
hoot -tip 21 -user npub1...
```

### Save a wallet connection

```bash
hoot -nwc "nostr+walletconnect://<wallet-pubkey>?relay=wss://...&secret=<secret>"
```

### Get your npub in a script

```bash
NPUB=$(hoot -npub)
```

Password prompts and progress messages go to stderr, so only the npub is captured.

### Scripted posting

```bash
HOOT_PASSWORD="$(pass show nostr/hoot)" hoot -m "Automated post"
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `HOOT_PASSWORD` | Password for your stored key, so the CLI doesn't prompt |
| `XDG_CONFIG_HOME` (Linux), `APPDATA` (Windows) | Change where the [config directory](getting-started/first-profile.md#where-hoot-stores-things) lives |

> **Careful with `HOOT_PASSWORD`.** Environment variables can be visible to other processes and end up in shell history. Prefer reading it from a password manager, as in the example above.

## Exit Status

`hoot` exits with status `0` on success and `1` on failure (for example, a wrong password, or no relay accepting a post), so you can use it in scripts:

```bash
hoot -m "gm" || echo "post failed"
```
