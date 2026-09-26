---
name: Aurora
emoji: "🎬"
logo: /logos/aurora-mark.svg
tagline: High-end cinematic Jellyfin frontend
seoTitle: Aurora — a cinematic Jellyfin frontend | Coral
seoDescription: Aurora is an open-source, Docker-native Jellyfin frontend with cinematic browsing, rich detail views, and playback that syncs back to Jellyfin.
description: The Netflix-quality client Jellyfin deserves. Full-bleed backdrops, smooth transitions, rich playback, and a proper big-screen feel.
longDescription: Aurora is Coral's premium Jellyfin frontend. It keeps Jellyfin as the source of truth while layering on a more cinematic home experience, richer detail views, embedded playback, favorites, genre browsing, and translation-ready UI foundations.
answer: Aurora is a free, open-source alternative web client for Jellyfin. It runs as a single Docker container alongside your existing server, reads your libraries over the Jellyfin API, and gives you a full-bleed, big-screen interface with rails, rich detail pages and playback that reports progress back to Jellyfin.
status: active
statusLabel: In Progress
repo: https://github.com/Get-Coral/aurora
docs: https://docs.getcoral.dev/modules/aurora/
containerUrl: https://hub.docker.com/r/getcoral/aurora
accent: teal
category: watch
order: 1
version: 1.14.0
dateModified: "2026-09-26"
dockerImage: getcoral/aurora:latest
port: 3000
volumes:
  - ./aurora-data:/data
bestFor:
  - Living room playback
  - Modern Jellyfin browsing
  - Shared household installs
highlights:
  - Featured, continue-watching, favorites, and recommendation rails
  - Embedded playback with progress sync back to Jellyfin
  - Rich movie and series detail views with cast and related titles
  - Genre browsing, pagination, and local-first onboarding with SQLite
  - Multi-user profiles with optional required sign-in, so playback and watch progress are attributed to each Jellyfin account
stack:
  - TanStack Start
  - React 19
  - TanStack Router
  - TanStack Query
  - Tailwind v4
requirements:
  - A running Jellyfin server and an API key from Dashboard → API Keys
  - Docker, or Node.js 22.5+ if you run it from source
  - Around 300 MB of disk for the image and its SQLite database
envVars:
  - name: JELLYFIN_URL
    description: Your Jellyfin server URL, for example http://jellyfin:8096 inside a Compose network.
  - name: JELLYFIN_API_KEY
    description: A Jellyfin API key. Generate one under Dashboard → API Keys.
  - name: JELLYFIN_USER_ID
    description: The UUID of the primary Jellyfin user — not their username.
  - name: JELLYFIN_USERNAME
    description: Used together with JELLYFIN_PASSWORD to open a real playback session when sign-in is not required.
  - name: JELLYFIN_PASSWORD
    description: Password for the playback session user.
  - name: AURORA_REQUIRE_LOGIN
    description: Set to true to force required sign-in and lock the in-app toggle.
  - name: AURORA_MULTI_USER
    description: Set to true to force multi-user profiles and lock the in-app toggle.
  - name: AURORA_DATA_DIR
    description: Where the local SQLite database lives. Defaults to ./data.
related:
  - marquee
  - fathom
  - librarian
faq:
  - question: Does Aurora replace Jellyfin?
    answer: No. Aurora is a client, not a server. Your Jellyfin server keeps doing the scanning, transcoding, user management and metadata work, and remains the source of truth. Aurora talks to it over the public Jellyfin HTTP API and stores nothing except its own connection details. Remove Aurora and your library is untouched.
  - question: Do I need to install a Jellyfin plugin to use Aurora?
    answer: No. Aurora needs nothing installed inside Jellyfin — no plugin, no server-side patch, no theme. It authenticates with a standard API key you generate from the Jellyfin dashboard, which means it also works against a Jellyfin instance you do not administer, as long as you have a key.
  - question: Does watch progress sync back to Jellyfin?
    answer: Yes. Aurora opens a real Jellyfin playback session rather than streaming files behind Jellyfin's back, so resume points, played state and watch history are written back to your server. Progress you make in Aurora shows up in the official apps, and vice versa.
  - question: Can several people in one household use Aurora?
    answer: Yes. Set AURORA_MULTI_USER to true for per-profile browsing, and AURORA_REQUIRE_LOGIN to true if you want everyone to sign in with their own Jellyfin account. With required sign-in on, playback and watch progress are attributed to the right person instead of a single shared session user.
  - question: Can I pin Aurora to a specific version?
    answer: Not yet. Docker Hub currently publishes only latest and main for getcoral/aurora, so :latest is the only usable tag even though tagged GitHub releases exist. If you want reproducible deploys today, pin by digest with getcoral/aurora@sha256:… rather than by tag.
  - question: Does Aurora work with Jellyfin 12?
    answer: Jellyfin 12 removed three authentication mechanisms that older versions of the shared @get-coral/jellyfin client relied on. Versions after 1.9.0 of that client handle both Jellyfin 10.x and 12.x. If you are on Jellyfin 12 and see 401 responses, pull a fresh Aurora image before anything else.
---

## Install with Docker Compose

Aurora ships as a single container that listens on port 3000. This service definition assumes Jellyfin is on the same Compose network under the hostname `jellyfin`:

```yaml
services:
  aurora:
    image: getcoral/aurora:latest
    restart: unless-stopped
    depends_on: [jellyfin]
    ports:
      - "3000:3000"
    environment:
      AURORA_DATA_DIR: /data
      JELLYFIN_URL: http://jellyfin:8096
      JELLYFIN_API_KEY: ${JELLYFIN_API_KEY}
      JELLYFIN_USER_ID: ${JELLYFIN_USER_ID}
      JELLYFIN_USERNAME: ${JELLYFIN_USERNAME}
      JELLYFIN_PASSWORD: ${JELLYFIN_PASSWORD}
    volumes:
      - ./aurora-data:/data
    networks: [coral]
    healthcheck:
      test: ["CMD", "node", "-e", "fetch('http://127.0.0.1:3000/healthz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"]
      interval: 30s
      timeout: 5s
      retries: 5
      start_period: 20s
```

`JELLYFIN_USER_ID` is the user's **UUID**, not their username — you can read it out of the URL when you open that user in the Jellyfin dashboard. The API key alone is enough to browse the library; adding the username and password is what lets Aurora open a real playback session so watch progress syncs back.

If you would rather not put anything in a `.env` file, every one of those variables is optional. Start the container with no configuration at all and Aurora will walk you through connecting to Jellyfin on first run, storing the result in `/data/aurora.sqlite`:

```bash
docker run -d -p 3000:3000 -v aurora-data:/data getcoral/aurora:latest
```

For the full stack — Jellyfin, Aurora, Tide and Librarian in one file — see the [Jellyfin Docker Compose stack guide](/guides/jellyfin-docker-compose-stack).

## How Aurora fits alongside Jellyfin

Aurora deliberately does not own any state that Jellyfin already owns. It has no user database, no separate watch history and no second metadata store. Everything it displays is fetched from the Jellyfin API at request time, and everything you do in it — marking a favorite, resuming an episode, finishing a film — is written straight back.

The practical consequence is that Aurora is safe to try and safe to delete. It sits beside the official web client rather than replacing it, so you can run both on different ports and let people in the house pick. If you decide Aurora is not for you, stopping the container leaves no trace on the server.

The one piece of state Aurora does keep is its own: the Jellyfin connection details, and any UI preferences, in a SQLite file under `AURORA_DATA_DIR`. Mount that directory if you want the setup to survive a container rebuild.

## Aurora vs the default Jellyfin web client

The stock Jellyfin web interface is built to be a complete administrative surface. It exposes the dashboard, library management, user settings, plugin configuration and playback in one app, and the design reflects that breadth. Aurora makes the opposite trade: it is a consumption client only. There is no dashboard, no library editing and no server administration in it at all — for those you open Jellyfin.

What you get in exchange is a browsing experience built for a sofa and a large screen: full-bleed backdrops, rails for continue-watching and recommendations, detail pages with cast and related titles, and transitions that hold up on a TV browser. If what bothers you about Jellyfin is the interface rather than the server, that is precisely the part Aurora replaces.

The honest counterpoint: the official client is feature-complete, has years of bug reports behind it, and supports Live TV, SyncPlay and the full plugin surface. Aurora is marked **In Progress** for a reason, and it covers the browse-and-play path rather than every corner of Jellyfin. Running both costs one extra container.

A fuller breakdown lives in [Aurora vs the Jellyfin web client](/compare/aurora-vs-jellyfin-web).
