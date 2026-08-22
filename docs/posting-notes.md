---
title: Posting Notes
nav_order: 3
---

# Posting Notes

Send notes to the Nostr network. Your message publishes to all configured relays.

## Using the TUI

1. Launch Hoot and log in to your profile:
   ```bash
   hoot
   ```

2. From the home menu, select **Post a message**

3. Type your note and press Enter

4. You'll see "Posted successfully!" when published

Hashtags like `#hello` are automatically extracted and tagged.

## Using the CLI

Post directly without the TUI:

```bash
hoot -m "Hello Nostr! #introduction"
```

The message publishes immediately and exits.

## Relays

By default, Hoot uses three public relays:

```
wss://relay.damus.io
wss://relay.nostr.band
wss://nostr.wine
```

### Add Your Own

From the TUI:
1. Select **Manage Relays** from home menu
2. Press `a` to add a relay
3. Enter the WebSocket URL (e.g., `wss://my-relay.example.com`)
4. Press Enter to save

The relay list is saved to `relays.txt` in your config directory.

### Relay Configuration File

Create `relays.txt` in your config directory:

```
wss://relay.damus.io
wss://relay.nostr.band
wss://nostr.wine
wss://my-custom-relay.com
```

Lines starting with `//` are ignored as comments.

## Troubleshooting Failed Posts

If posting fails:

1. **No relay connection** — Check your internet and relay URLs
2. **Relay timeout** — Some relays are slow; Hoot publishes to all configured relays and succeeds if any accept
3. **Invalid key** — Your private key may be corrupted; try logging in again

## Viewing Your Posts

From the TUI:
- Select **View feed** to see recent posts

From CLI:
```bash
hoot -l
```

This shows your last 4 posts.
