---
name: KAPOW!
emoji: "🎤"
tagline: Comic-book karaoke queue manager for bars and parties
seoTitle: KAPOW! — self-hosted karaoke queue | Coral
seoDescription: KAPOW! is an open-source karaoke system for bars and parties. Guests scan a QR code, search for songs, and vote the queue while the host runs the night.
description: Hosts create a room, guests scan a QR code, search for tracks, and vote songs up the queue while the host controls the night from a booth view.
longDescription: KAPOW! is Coral's group karaoke module. It is built for bars, events, and parties where a host needs a live queue, a guest-friendly join flow, collaborative voting, and a dedicated display mode on the projector or TV.
answer: KAPOW! is a free, open-source karaoke queue system for bars, events and parties. The host opens a room, guests join by scanning a QR code on their own phone with nothing to install, everyone searches and votes songs up the queue, and a separate TV view drives the screen in the room.
status: mvp
statusLabel: MVP Built
repo: https://github.com/Get-Coral/KAPOW
docs: https://docs.getcoral.dev/modules/kapow/
containerUrl: https://hub.docker.com/r/getcoral/kapow
accent: coral
category: listen
order: 2
version: 1.0.1
dateModified: "2026-04-13"
dockerImage: getcoral/kapow:latest
port: 3000
bestFor:
  - Bars and karaoke nights
  - Party queue management
  - QR-code join flows
highlights:
  - Host rooms with QR join codes and dedicated host tokens
  - Guest song search and queue submission from a phone, with nothing to install
  - Live voting that pushes the best pending song upward
  - Separate guest, host, and TV display routes for the whole room
stack:
  - TanStack Start
  - Supabase realtime
  - dnd-kit
  - Tailwind v4
requirements:
  - A Supabase project — KAPOW! uses Postgres for realtime room state, not SQLite
  - A YouTube Data API key
  - Docker, or Node.js 24 and pnpm to run it from source
envVars:
  - name: SUPABASE_URL
    description: Your Supabase project URL, for example https://your-project.supabase.co.
    required: true
  - name: SUPABASE_PUBLISHABLE_KEY
    description: The Supabase publishable (anon) key used by the client.
    required: true
  - name: SUPABASE_DB_PASSWORD
    description: Database password for the Supabase project.
    required: true
  - name: YOUTUBE_API_KEY
    description: A YouTube Data API key, used for song search.
    required: true
related:
  - encore
  - marquee
faq:
  - question: Do guests need to install an app?
    answer: No. Guests scan a QR code and land on a web page in their phone's browser. There is no app, no account and no sign-up — which matters a great deal in a bar, where anything requiring a download means most of the room simply does not participate.
  - question: Does KAPOW! need Jellyfin?
    answer: No. KAPOW! is the one Coral module that does not talk to Jellyfin at all. It searches YouTube for tracks and keeps room state in Supabase. You can run it on a laptop at a venue with no media server anywhere in the picture.
  - question: Why does KAPOW! need Supabase when other Coral modules use SQLite?
    answer: Because a karaoke room is a realtime, multi-device problem. Thirty phones, a host tablet and a TV all need to see the same queue update at the same moment. KAPOW! uses Supabase's realtime Postgres for that, where the single-user Coral modules are happy with a local SQLite file.
  - question: How does the voting work?
    answer: Guests vote on songs sitting in the pending queue, and the ones with the most support rise toward the top. The host keeps the final say from the booth view — voting shapes the order rather than dictating it, so the person running the night can still promote, drop or reorder anything.
  - question: What are the three different views for?
    answer: KAPOW! has separate routes for guests, for the host, and for the TV. Guests get search and voting on their phone, the host gets the booth view with queue control, and the TV route is the full-screen display for the room. They are deliberately distinct surfaces rather than one interface with permissions.
  - question: Can I run KAPOW! without an internet connection?
    answer: Not currently. Song search uses the YouTube Data API and room state lives in hosted Supabase, so both need to be reachable. This is the one place where KAPOW! departs from the Coral rule that a module should work with no cloud dependency, and it is a consequence of where the songs come from.
---

## Install with Docker Compose

KAPOW! listens on port 3000. Unlike the other Coral modules it has no SQLite volume, because its state lives in Supabase:

```yaml
services:
  kapow:
    image: getcoral/kapow:latest
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      SUPABASE_URL: ${SUPABASE_URL}
      SUPABASE_PUBLISHABLE_KEY: ${SUPABASE_PUBLISHABLE_KEY}
      SUPABASE_DB_PASSWORD: ${SUPABASE_DB_PASSWORD}
      YOUTUBE_API_KEY: ${YOUTUBE_API_KEY}
```

Before the first run you need two external things: a Supabase project, which provides the realtime Postgres behind the room state, and a YouTube Data API key for song search. Both are free at the volumes a karaoke night generates, but do check your YouTube quota if you are running a busy venue several nights a week.

The published image is `getcoral/kapow` on Docker Hub. Note that the module's own documentation currently walks through a local `pnpm dev` setup rather than the container, so the Compose service above is assembled from the image's own configuration rather than copied from the docs.

## How a night actually runs

The host opens a room. KAPOW! generates a join code and a QR poster you can put on the bar, on tables, or on the screen between songs.

Guests scan it with the camera app they already have and land in a browser. There is no download, no account, and no sign-up — which is the whole design constraint, because in a real bar any friction above "point your phone at this" means most of the room never joins. They search for a track, add it, and vote on what other people have queued.

The host works from a separate booth view: the running order, what is coming next, and direct control over promoting, reordering and dropping songs. Voting shapes the queue; the host still decides.

The TV route is the third surface — a full-screen display for the projector or the screen behind the stage, showing what is playing and who is up next.

## Why Supabase rather than SQLite

Every other Coral module keeps its state in a local SQLite file, and KAPOW! is the exception. The reason is that a karaoke room is a realtime multi-device problem in a way that browsing a media library is not.

When someone adds a song, thirty phones, a host tablet and a TV all need to reflect it within a second or so. That is what Supabase's realtime Postgres is for. A local SQLite file with polling would work badly at exactly the moment it matters — a full room, everyone queueing at once.

The trade is honest and worth stating: KAPOW! depends on a hosted service where the rest of Coral does not, and it needs an internet connection at the venue. If that is a dealbreaker for your setup, [Karaoke Eternal](https://www.karaoke-eternal.app/) is fully local and a better fit.

## KAPOW! vs other self-hosted karaoke systems

The self-hosted karaoke space is small but real, and the existing options solve a meaningfully different problem. Karaoke Eternal and KaraokeParty are built around a **local library** — your own MP3+G or MP4 files, on your own disk, playing with no internet.

KAPOW! searches YouTube instead. For a bar that means you never have to curate a catalogue in advance and no guest ever hits "we don't have that song", which is the failure mode that actually ends a karaoke night. It also means you need connectivity and you are subject to a quota.

Where KAPOW! is distinctive is the social layer on top: collaborative voting, a booth view built for someone running a room professionally, and a comic-book presentation that was designed for a themed bar in Ghent rather than a living room.

The full comparison is in [KAPOW! vs Karaoke Eternal](/compare/kapow-vs-karaoke-eternal). If you want moderated *music* requests rather than karaoke — guests suggesting tracks, host approving — that is [Encore](/apps/encore).
