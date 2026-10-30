---
title: Home
nav_order: 1
---

# Hoot

A terminal client for Nostr. Post notes, read the feed and your DMs, and tip people in sats without leaving the command line.

Hoot has two modes:

- **TUI**: run `hoot` with no arguments for a full-screen, menu-driven app.
- **CLI**: run `hoot` with flags (`hoot -m "gm"`) for scripts and one-off commands.

## What is Nostr?

Nostr is an open protocol for decentralized social networking. Your identity is a key pair:

- **Private key** (`nsec1…`): proves you are you. Never share it.
- **Public key** (`npub1…`): your identity, which others see.

Your posts are stored on relays (servers) that you choose, not by a single company.

## What Hoot Does

- **Sign in your way**: import an `nsec` (encrypted locally with a password), or sign in with **Amber** on your phone by scanning a QR code, so your key never touches your computer.
- **Multiple accounts**: save several profiles and switch between them.
- **Post notes** to all your relays at once.
- **Read**: the global feed, your encrypted DMs, and the replies and reactions to any note.
- **Tip in sats** with any Nostr Wallet Connect (NWC) wallet, by Lightning address or npub. Hoot waits for your wallet to confirm the payment.
- **Manage relays** from inside the app, even before you sign in.

## Quick Start

1. [Install Hoot](getting-started/installation.md)
2. Sign in: [import a key](getting-started/first-profile.md) or [use Amber](getting-started/amber-login.md)
3. [Post your first note](posting-notes.md)
4. [Connect a Lightning wallet](wallet-connect.md) to send tips

## All Pages

- [Installation](getting-started/installation.md)
- [Your First Profile](getting-started/first-profile.md)
- [Sign In with Amber](getting-started/amber-login.md)
- [Posting Notes](posting-notes.md)
- [Feed, DMs and Replies](reading.md)
- [Tipping with NWC](wallet-connect.md)
- [CLI Reference](cli-reference.md)
- [Troubleshooting](troubleshooting.md)
