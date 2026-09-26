---
name: Marquee
emoji: "📺"
tagline: Ambient now-playing display for Jellyfin spaces
seoTitle: Marquee — a Jellyfin now-playing display | Coral
seoDescription: Marquee turns a spare screen into an ambient Jellyfin display showing what is playing, what is next, and what was recently added. Open source, Dockerised.
description: A passive, always-on screen for TVs and monitors that surfaces what is playing, what is next, and what was recently added without demanding interaction.
longDescription: Marquee is the Coral module for presence instead of control. It is meant to turn a spare display into a beautiful ambient layer for your media setup, whether that is a living room TV, hallway panel, or wall-mounted dashboard.
answer: Marquee is a free, open-source ambient display for Jellyfin. It runs as one Docker container and turns a spare TV, tablet or wall panel into an always-on screen showing what is playing now, what is up next, and what was recently added — with nothing to click.
status: mvp
statusLabel: MVP Built
repo: https://github.com/Get-Coral/marquee
docs: https://docs.getcoral.dev/modules/marquee/
containerUrl: https://hub.docker.com/r/getcoral/marquee
accent: coral
category: display
order: 5
version: 1.0.2
dateModified: "2026-04-14"
dockerImage: getcoral/marquee:latest
port: 3000
volumes:
  - ./marquee-data:/data
bestFor:
  - Wall displays
  - Passive household screens
  - Now-playing ambience
highlights:
  - Designed as a passive screen rather than an interactive client
  - Surfaces now-playing, up-next, and recently-added moments
  - Built to sit on a TV, hallway display, or dashboard monitor
  - Uses Coral's shared app shell and Jellyfin integration foundations
stack:
  - TanStack Start
  - Tailwind v4
  - Jellyfin API
  - Coral UI
requirements:
  - A running Jellyfin server and an API key
  - A screen that can run a browser in kiosk mode — a tablet, Raspberry Pi or smart TV browser is plenty
  - Docker, or Node.js 22.5+ to run from source
envVars:
  - name: JELLYFIN_URL
    description: Your Jellyfin server URL, for example http://jellyfin:8096.
  - name: JELLYFIN_API_KEY
    description: A Jellyfin API key from Dashboard → API Keys.
  - name: JELLYFIN_USER_ID
    description: The UUID of the Jellyfin user — not their username.
  - name: JELLYFIN_USERNAME
    description: Optional. With JELLYFIN_PASSWORD, opens a real playback session.
  - name: JELLYFIN_PASSWORD
    description: Optional password for that session user.
  - name: MARQUEE_DATA_DIR
    description: Directory for the SQLite state file.
related:
  - aurora
  - encore
faq:
  - question: Is Marquee a Jellyfin client I can play things from?
    answer: No, and that is the point. Marquee is a display, not a player. It shows what is happening on your server — what is playing, what is next, what arrived recently — and offers nothing to click. If you want to browse and play, that is Aurora.
  - question: What hardware do I point at it?
    answer: Anything that can run a browser full-screen. A Raspberry Pi behind a wall-mounted monitor, an old tablet on a shelf, a smart TV's built-in browser, or a spare laptop. Marquee itself runs on your server as a container; the screen just needs to load the page in kiosk mode.
  - question: Does Marquee need to be on the same machine as Jellyfin?
    answer: No. It talks to Jellyfin over HTTP with an API key, so it can run anywhere that can reach your server. Running it in the same Compose stack is simply convenient, because then you can use the internal hostname and skip exposing anything extra.
  - question: Will it wake or interrupt playback?
    answer: No. Marquee only reads from the Jellyfin API. It does not start sessions, control playback, or change any server state, so nothing it does can interfere with what someone is watching elsewhere in the house.
  - question: How current is the display?
    answer: Marquee polls Jellyfin for session and library state, so what you see tracks the server closely enough for an ambient screen. It is built for glanceability rather than frame-accurate now-playing, which is the right trade for something that lives on a hallway wall.
---

## Install with Docker Compose

Marquee listens on port 3000:

```yaml
services:
  marquee:
    image: getcoral/marquee:latest
    restart: unless-stopped
    depends_on: [jellyfin]
    ports:
      - "3004:3000"
    environment:
      MARQUEE_DATA_DIR: /data
      JELLYFIN_URL: http://jellyfin:8096
      JELLYFIN_API_KEY: ${JELLYFIN_API_KEY}
      JELLYFIN_USER_ID: ${JELLYFIN_USER_ID}
    volumes:
      - ./marquee-data:/data
    networks: [coral]
```

Then point a screen at it. Anything that runs a browser full-screen will do — a Raspberry Pi behind a wall-mounted monitor, an old tablet propped on a shelf, a smart TV's built-in browser, a spare laptop. On a Pi, Chromium in kiosk mode is the usual approach:

```bash
chromium-browser --kiosk --noerrdialogs --disable-infobars http://your-nas:3004
```

You can also run it straight from the source checkout if you would rather build locally:

```bash
docker build -t marquee .
docker run -p 3000:3000 \
  -e JELLYFIN_URL=http://your-nas:8096 \
  -e JELLYFIN_API_KEY=your-key \
  -e JELLYFIN_USER_ID=your-user-id \
  marquee
```

## Presence, not control

Every other module in Coral is something you use. Marquee is something you glance at.

That single decision shapes all of it. There are no menus, no navigation, no settings surfaced on screen and nothing to click, because the screen it runs on is usually three metres away on a wall and nobody is holding a remote for it. What it shows is what is true right now: what is playing, who is next in the queue, and what landed in the library recently.

It is read-only against Jellyfin. Marquee never starts a session, never controls playback and never writes server state, so it cannot interfere with what someone is watching in the other room.

The obvious pairing is with [Aurora](/apps/aurora) on the TV and Marquee on a second screen — one to choose with, one to look at. At a party, running it next to [Encore](/apps/encore) means guests can see what is playing and what they queued without asking.

## What Marquee is not

It is not a dashboard. It will not show you disk usage, transcoding load, or server health — for that you want Grafana or one of the homelab dashboard projects, and they do it far better.

It is not a client either. There is no browsing and no playback in Marquee. If you point it at a TV expecting to watch something, you want [Aurora](/apps/aurora).

Marquee is marked **MVP Built**: the shape is right and it runs, but it is one of the younger modules in the reef and there is more ahead of it than behind.
