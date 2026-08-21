---
title: Your First Profile
parent: Getting Started
nav_order: 2
---

# Your First Nostr Profile

A Nostr profile is a key pair. Your private key proves you own the public key everyone sees.

## How It Works

When you create a profile in Hoot:

1. You provide an **nsec** (private key in bech32 format, starts with `nsec1`)
2. Hoot encrypts it with your password and stores it locally
3. Your **npub** (public key) is derived automatically

Your private key never leaves your machine unless you explicitly share it.

## Create a New Key Pair

If you don't have a Nostr key yet, generate one:

```bash
# Generate a random key pair (using nostr CLI tools)
# Or use an online generator like https://nostr.band to get an nsec
```

> **Security note**: Generating keys online means trusting that site. For production use, generate keys locally or use a hardware wallet.

## Add Profile in Hoot TUI

1. Launch Hoot:
   ```bash
   hoot
   ```

2. Select **Create new profile**

3. Enter a name for this profile (e.g., "main" or your handle)

4. Enter your **nsec1...** private key

5. Create a **password** to encrypt this key locally
   - This password decrypts your key each session
   - It's stored only on your machine
   - If forgotten, you cannot recover the key

6. You're logged in and ready to post

## Multiple Profiles

Hoot supports multiple profiles. After creating your first:

- Select **+ Add new profile** to add another account
- Use **Switch Profile** from the home menu to change accounts
- Each profile has its own encrypted key file

## What Gets Created

Hoot stores your data in:

| OS | Location |
|---|---|
| Linux | `~/.config/nostr-cli/` |
| macOS | `~/Library/Application Support/nostr-cli/` |
| Windows | `%APPDATA%\nostr-cli\` |

Files created:
- `profiles.json` — encrypted profile metadata
- `nwc.txt` — NWC wallet connection (if configured)
- `relays.txt` — your relay list (optional)

## Next Steps

Once you have a profile:
- [Post your first note](posting-notes.md)
- [Set up Lightning tipping](wallet-connect.md)
