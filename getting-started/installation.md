---
title: Installation
parent: Getting Started
nav_order: 1
---

# Installing Hoot

Hoot runs as a single binary on your machine. No dependencies beyond Go.

## Prerequisites

Before installing, verify you have:

- **Go 1.19 or later** — [install guide](https://go.dev/doc/install)
- **Git** — [install guide](https://git-scm.com/downloads)

Check your versions:

```bash
go version    # should output something like: go version go1.21.0
git --version # should output: git version 2.x.x
```

## Install

### Option 1: Build from Source

```bash
git clone https://github.com/oth-body/hoot.git
cd hoot
go build -o hoot
```

This creates an executable named `hoot` in the current directory.

### Option 2: Add to Your PATH

After building, move the binary somewhere convenient:

```bash
# Linux/macOS
sudo mv hoot /usr/local/bin/

# Windows
# Move hoot.exe to a folder in your PATH, like C:\Users\YourName\bin\
```

## Verify It Works

Run without arguments to launch the TUI:

```bash
hoot
```

You should see the welcome screen:

```
🦉 Welcome to Hoot!

No profiles yet. Let's create one!
→ Create new profile
→ Scan QR with Amber (NIP-46)
```

## Troubleshooting Build Errors

### `command not found: go`

Go isn't installed or not in your PATH. Download and install from [go.dev](https://go.dev/dl/).

### `package not found`

Run `go mod download` to fetch dependencies:

```bash
go mod download
go build -o hoot
```

### Windows: "Windows protected your PC"

Click "More info" → "Run anyway" when Windows blocks the unsigned executable.
