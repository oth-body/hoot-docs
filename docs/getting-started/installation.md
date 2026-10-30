---
title: Installation
parent: Getting Started
nav_order: 2
---

# Installing Hoot

Hoot is a single binary with no runtime dependencies.

## Option 1: Download a Release

Prebuilt binaries for Linux, macOS and Windows (amd64 and arm64) are on the [Releases page](https://github.com/oth-body/hoot/releases).

1. Download the archive for your system, e.g. `hoot_<version>_linux_amd64.tar.gz` or `hoot_<version>_windows_amd64.zip`.
2. Extract it and put `hoot` (or `hoot.exe`) somewhere on your `PATH`.
3. Optionally verify the download against `SHA256SUMS.txt`:
   ```bash
   sha256sum --check --ignore-missing SHA256SUMS.txt
   ```

> These docs describe the latest code on `master`. If a feature described here is missing from your release (for example tipping from the TUI), build from source as shown below.

## Option 2: Build from Source

You need **Go 1.26 or later** ([install guide](https://go.dev/doc/install)) and Git.

```bash
go version   # should print go1.26 or newer
```

```bash
git clone https://github.com/oth-body/hoot.git
cd hoot
go build -o hoot .
```

This creates a `hoot` executable in the current directory. Move it onto your `PATH`:

```bash
# Linux/macOS
sudo mv hoot /usr/local/bin/

# Windows: move hoot.exe to a folder on your PATH, e.g. C:\Users\YourName\bin\
```

## Verify It Works

```bash
hoot -version
```

Then run `hoot` with no arguments to launch the TUI. On first run you'll see:

```
🦉 Welcome to Hoot!

No profiles yet. Let's create one!

→ Create new profile
  Scan QR with Amber (NIP-46)
  🔗 Configure relays
```

Use **↑/↓** (or **j/k**) to move, **Enter** to choose, **Esc** to go back, and **Ctrl+C** to quit from anywhere.

Next: [create your first profile](first-profile.md) or [sign in with Amber](amber-login.md).

## Build Problems

### `go: go.mod requires go >= 1.26.0`

Your Go is too old. [Update Go](https://go.dev/dl/). With Go 1.21 or newer and network access, Go can also fetch the right toolchain automatically (`GOTOOLCHAIN=auto`, the default).

### `command not found: go`

Go isn't installed or isn't on your `PATH`. Install it from [go.dev/dl](https://go.dev/dl/).

### Windows: "Windows protected your PC"

The binaries aren't code-signed. Click **More info → Run anyway**.
