---
title: Posting Notes
nav_order: 3
---

# Posting Notes

Hoot publishes your note to every relay in your list. The post succeeds if at least one relay accepts it.

## From the TUI

1. Run `hoot` and sign in.
2. Choose **[p] Post a message** (or press `p`).
3. Type your note and press **Enter**.
4. You'll see **Posted successfully!** once a relay accepts it.

## From the CLI

```bash
hoot -m "Hello Nostr! #introduction"
```

Hoot prints which relays accepted the note, then exits. With the CLI, `#hashtags` are also added as `t` tags so they show up in hashtag searches. Notes posted from the TUI don't get these tags yet.

Send a note to specific relays only (instead of your saved list):

```bash
hoot -r "wss://relay1.example.com,wss://relay2.example.com" -m "Just these relays"
```

## Relays

If you haven't set up your own list, Hoot uses:

```
wss://relay.damus.io
wss://relay.nostr.band
wss://nostr.wine
```

### Manage Relays in the TUI

Open **[r] Manage Relays** from the home screen, or **🔗 Configure relays** from the login screen before you sign in.

- **a**: add a relay (must start with `wss://` or `ws://`)
- **d**: delete the selected relay
- **↑/↓**: move between relays
- **Esc**: go back

Changes are saved immediately.

### The relays.txt File

The list is stored in `relays.txt` in your [config directory](getting-started/first-profile.md#where-hoot-stores-things), one URL per line. Lines starting with `//` are ignored:

```
wss://relay.damus.io
wss://nos.lol
// wss://relay.i-dont-use-anymore.com
```

> If there's a `relays.txt` in the **current directory** when you run Hoot, that file is used instead of the one in your config directory.

## If Posting Fails

**"failed to publish to any relay"** means no relay accepted the note:

- Check your internet connection.
- Some relays rate-limit or require payment; add a couple of free public relays such as `wss://nos.lol`.
- If you signed in with Amber, check whether Amber is waiting for you to approve the signature.

## See Your Posts

```bash
hoot -l    # your last 4 notes
```

In the TUI, **[f] View feed** shows the newest notes from everyone on your relays. See [Feed, DMs and Replies](reading.md).
