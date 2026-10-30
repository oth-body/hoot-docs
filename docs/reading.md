---
title: Feed, DMs and Replies
nav_order: 4
---

# Feed, DMs and Replies

## Feed

**[f] View feed** shows the 20 newest notes from everyone on your relays, newest first. This is a global feed, not just people you follow. Scroll with **↑/↓** (or **j/k**).

If none of your relays can be reached, Hoot shows the most recent posts it cached locally instead.

To see only your own notes from the CLI:

```bash
hoot -l    # your last 4 notes
```

## Direct Messages

**[d] View DMs** shows your encrypted direct messages (NIP-04): both messages you received and messages you sent, newest first, up to 50.

- Received messages show as `[DM from]: …`, with the sender's key as the author.
- Sent messages show as `[DM to 1a2b3c4d...]: …`.

From the CLI:

```bash
hoot -dms
```

DMs need your private key on this computer to decrypt them, so they work with an imported profile but **not yet with Amber sign-in**.

## Replies and Reactions

**[e] View replies/reactions** asks for a note's event ID, then lists the replies and reactions (likes, emoji) to it, newest first. Reactions show as `[Reacted: +]`.

Enter the **64-character hex event ID**. `note1…` and `nevent1…` IDs aren't supported yet; most Nostr clients can show the hex ID in a note's "copy ID" or "details" menu.

From the CLI:

```bash
hoot -replies <hex-event-id>
```

## View Your Profile

```bash
hoot -p    # prints your profile (kind 0) as JSON
```

To change it, see [`-u` in the CLI Reference](cli-reference.md#update-your-profile).
