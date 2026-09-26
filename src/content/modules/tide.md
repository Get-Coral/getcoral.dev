---
name: Tide
emoji: "🌊"
logo: /logos/tide-mark.svg
tagline: Torrent downloads with a calmer control surface
seoTitle: Tide — a self-hosted torrent web UI | Coral
seoDescription: Tide is an open-source, Docker-native torrent client with a queue-first web UI, per-file piece priorities, a memory guard, and optional Jellyfin sign-in.
description: Add torrents fast, enforce active queue limits, reprioritize files by piece selection, and inspect peers, trackers, and a piece map when you need the deep view.
longDescription: Tide is Coral's torrent download manager. It is designed for self-hosters who want Transmission-like practicality with a cleaner home board, stronger queue controls, SQLite-backed state, better swarm visibility, and an optional Jellyfin sign-in that keeps management in the hands of administrators.
answer: Tide is a free, open-source torrent client with a web interface, built for self-hosted download boxes. It runs as one Docker container, enforces real active-download and seeding limits, lets you set per-file piece priorities, and pauses torrents automatically when it approaches its memory cap.
status: active
statusLabel: Shipping
repo: https://github.com/Get-Coral/tide
docs: https://docs.getcoral.dev/modules/tide/
containerUrl: https://hub.docker.com/r/getcoral/tide
accent: teal
category: manage
order: 3
version: 1.4.0
dateModified: "2026-09-26"
dockerImage: getcoral/tide:latest
port: 3000
volumes:
  - ./tide-data:/data
  - ./library:/library
bestFor:
  - Media acquisition workflows
  - Self-hosted download boxes
  - Queue-first torrent management
highlights:
  - Quick-add flow with clipboard paste and inline board controls
  - Max active downloads and seeders with real queue enforcement
  - Default ratio and seed-time goals applied to every new torrent
  - Optional Jellyfin sign-in, with management limited to administrators
  - Per-file piece priorities, compact piece maps, tracker health, and peer views
stack:
  - TanStack Start
  - WebTorrent
  - SQLite
  - Tailwind v4
  - Biome
requirements:
  - Docker, with a memory limit set on the container
  - A single mount holding both the complete and incomplete download directories
  - A Jellyfin server only if you want Jellyfin sign-in — Tide runs fine without one
envVars:
  - name: TIDE_DOWNLOADS_DIR
    description: Where finished downloads land. Tide derives the in-progress directory as a sibling, so /library/downloads/complete implies /library/downloads/incomplete.
  - name: TIDE_DATA_DIR
    description: Directory for the SQLite state file, tide.sqlite.
  - name: TIDE_AUTH_USERNAME
    description: HTTP basic auth username. Leave blank only if Tide is unreachable beyond localhost.
  - name: TIDE_AUTH_PASSWORD
    description: HTTP basic auth password.
  - name: TIDE_JELLYFIN_URL
    description: Optional. Points Tide at a Jellyfin server used purely as an identity provider — no API key is stored.
  - name: TIDE_REQUIRE_LOGIN
    description: Forces the Jellyfin sign-in requirement on or off, overriding what is stored in SQLite. Setting it to false is the way back in if you lock yourself out.
  - name: TIDE_MEMORY_LIMIT_MB
    description: Overrides the memory cap Tide reads from cgroups.
  - name: TIDE_MEMORY_PAUSE_MB
    description: Torrents pause when memory use rises above this threshold.
  - name: TIDE_MEMORY_RESUME_MB
    description: Torrents resume when memory use falls back below this threshold.
  - name: TIDE_MEMORY_CHECK_INTERVAL_MS
    description: How often the memory guard samples, in milliseconds. Defaults to 5000.
related:
  - librarian
  - aurora
faq:
  - question: Does Tide need Jellyfin to run?
    answer: No. Tide is a standalone torrent client and works with no Jellyfin server anywhere near it. Jellyfin is optional and used only as an identity provider — if you set TIDE_JELLYFIN_URL, people sign in with their Jellyfin account and only administrators can manage torrents. Tide stores no Jellyfin API key either way.
  - question: Why does the Compose example bind Tide to 127.0.0.1?
    answer: Because Tide has no authentication enabled by default. Binding to loopback means only the host can reach it, which is the safe default for a fresh install. If you want to publish it on your network, set TIDE_AUTH_USERNAME and TIDE_AUTH_PASSWORD first, then change the port mapping.
  - question: Why do I have to set mem_limit on the container?
    answer: Tide reads the container's memory limit from cgroups and pauses torrents as it approaches it, then resumes them once use drops. Without mem_limit there is no cap to read and nothing to pause against, so a large swarm can grow until the host starts swapping. You can also set the thresholds explicitly with TIDE_MEMORY_LIMIT_MB.
  - question: Why must complete and incomplete downloads share one mount?
    answer: Tide derives the in-progress directory as a sibling of TIDE_DOWNLOADS_DIR, so /library/downloads/complete implies /library/downloads/incomplete. When both live under the same mount, finishing a torrent is a rename. Split them across separate mounts and every completed download becomes a full file copy instead.
  - question: How does Tide compare to qBittorrent or Transmission?
    answer: Tide targets the same job with a queue-first interface and a memory guard built in, and it is a single container with no plugin layer. qBittorrent and Transmission are far more mature, have RSS and richer *arr integrations, and are what most automation expects. See the full comparison for where each one wins.
  - question: Can I pin Tide to a specific version?
    answer: Not by tag. Docker Hub publishes latest and main for getcoral/tide, plus a stale 1.2.0-beta; the semver tags the release workflow asks for have not landed. Pin by digest with getcoral/tide@sha256:… if you need reproducible deploys.
---

## Install with Docker Compose

Tide listens on port 3000 inside the container. This example binds it to loopback on port 3001, which is the right default until you have set a username and password:

```yaml
services:
  tide:
    image: getcoral/tide:latest
    restart: unless-stopped
    user: "${PUID}:${PGID}"
    ports:
      # loopback only until TIDE_AUTH_USERNAME / TIDE_AUTH_PASSWORD are set
      - "127.0.0.1:3001:3000"
    environment:
      TIDE_DATA_DIR: /data
      TIDE_DOWNLOADS_DIR: /library/downloads/complete
      TIDE_MEMORY_LIMIT_MB: "4096"
      TIDE_MEMORY_PAUSE_MB: "3584"
      TIDE_MEMORY_RESUME_MB: "3072"
    volumes:
      - ./tide-data:/data
      - ./library:/library
    mem_limit: 4g
    networks: [coral]
```

Two things in there are load-bearing rather than decorative.

**`mem_limit` is required.** Tide reads the container's memory cap from cgroups and pauses torrents as it approaches it. With no limit set there is nothing to read and nothing to pause against, and a big swarm will happily consume whatever the host has.

**`./library` is one mount, not several.** Tide derives its in-progress directory as a sibling of `TIDE_DOWNLOADS_DIR`, so `/library/downloads/complete` implies `/library/downloads/incomplete`. When both sit under the same mount, finishing a torrent is a rename — near-instant, no extra disk. Mount them separately and every completed download turns into a full copy. The same rule is why Librarian and Jellyfin mount that identical `./library` tree at the identical path.

For a quick look without Compose:

```bash
docker run -p 3000:3000 \
  -e TIDE_DOWNLOADS_DIR=/downloads \
  -e TIDE_AUTH_USERNAME=admin \
  -e TIDE_AUTH_PASSWORD=change-me \
  getcoral/tide:latest
```

## Queue control, not just a list

Most torrent web interfaces show you a table and let you start things. Tide's default view is a board built around the questions you actually ask: what is running right now, what is waiting, what has stalled, and what is seeding past its goal.

The limits are enforced rather than advisory. Set a maximum number of active downloads and active seeders and Tide holds the rest in a queue, promoting them as slots free up. Default ratio and seed-time goals apply to every torrent as it arrives, so you are not configuring retention one item at a time.

When you do need the deep view it is there: per-file priorities driven by piece selection, a compact piece map showing exactly what has landed, tracker health, and the peer list. That detail is one click away rather than being the default surface.

## Access control

Tide has no authentication on by default, which is why every example here binds it to loopback. There are two ways to open it up.

HTTP basic auth is the simple one — set `TIDE_AUTH_USERNAME` and `TIDE_AUTH_PASSWORD` and you are done. The other is Jellyfin sign-in, added in 1.3.0: point `TIDE_JELLYFIN_URL` at your server and people sign in with the Jellyfin account they already have, with torrent management restricted to administrators. Tide uses Jellyfin purely as an identity provider and stores no API key for it.

If you lock yourself out, `TIDE_REQUIRE_LOGIN=false` overrides whatever is in SQLite and gets you back in.

## Tide vs qBittorrent

qBittorrent is the default answer for self-hosted torrenting, and for good reason: it is mature, it has an RSS engine, and every guide and every *arr integration assumes it. If you are building an automated acquisition pipeline today, that ecosystem is a real argument.

Tide is aimed at the person running downloads by hand who finds that interface heavier than the job warrants. The queue rules are first-class rather than buried in settings, the memory guard is built in rather than something you enforce from outside, and Jellyfin sign-in means one fewer separate credential. It is also one container with no plugin layer.

Where qBittorrent wins outright: RSS automation, maturity, the breadth of tooling that already speaks to it, and the ability to pin a version. The full side-by-side is in [Tide vs qBittorrent](/compare/tide-vs-qbittorrent).
