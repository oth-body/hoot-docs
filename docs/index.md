---
title: Home
nav_order: 1
---

# Hoot

A terminal client for Nostr. Post notes, read the feed and your DMs, and tip people in sats without leaving the command line.

![Hoot's feed in a terminal: posts from Mara Okafor, Theo Lin, June and kestrel in bordered boxes, with key hints for reply, like and zap underneath](assets/screenshots/feed.webp)

Hoot has two modes:

- **TUI**: run `hoot` with no arguments for a full-screen, menu-driven app.
- **CLI**: run `hoot` with flags (`hoot -m "gm"`) for scripts and one-off commands.

## What is Nostr?

Nostr is an open protocol for decentralized social networking. Your identity is a key pair:

- **Private key** (`nsec1…`): proves you are you. Never share it.
- **Public key** (`npub1…`): your identity, which others see.

Your posts are stored on relays (servers) that you choose, not by a single company.

## What Hoot Does

- **Sign in your way**: import an `nsec` (encrypted locally with a password), or sign in with **Amber** on your phone by scanning a QR code, so your key never touches your computer. Hoot remembers the pairing for next time.
- **Multiple accounts**: save several profiles and switch between them.
- **A real feed**: global or just the people you follow, with names, threads, and **reply / like / zap** on any post.
- **Private DMs**: read and send NIP-17 gift-wrapped messages (and read older NIP-04 ones), with a local key or with Amber.
- **Zaps and tips in sats** with any Nostr Wallet Connect (NWC) wallet, by Lightning address, npub or straight from a post. Hoot waits for your wallet to confirm.
- **Fast**: relays are queried in parallel and the screen never freezes while loading.
- **Manage relays** from inside the app, even before you sign in.

## Quick Start

1. [Install Hoot](getting-started/installation.md)
2. Sign in: [import a key](getting-started/first-profile.md) or [use Amber](getting-started/amber-login.md)
3. [Post your first note](posting-notes.md)
4. [Read the feed, reply and DM](reading.md)
5. [Connect a Lightning wallet](wallet-connect.md) to zap and tip

## All Pages

- [Installation](getting-started/installation.md)
- [Your First Profile](getting-started/first-profile.md)
- [Sign In with Amber](getting-started/amber-login.md)
- [Posting Notes](posting-notes.md)
- [Feed, DMs and Replies](reading.md)
- [Tipping and Zaps](wallet-connect.md)
- [CLI Reference](cli-reference.md)
- [Troubleshooting](troubleshooting.md)
