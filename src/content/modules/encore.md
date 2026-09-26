---
name: Encore
emoji: "🎶"
tagline: Moderated guest music requests for house-party mode
seoTitle: Encore — moderated guest music requests | Coral
seoDescription: Encore lets party guests browse your Jellyfin music and request tracks while you approve what actually plays. Open source, self-hosted, Docker-native.
description: Guests browse Jellyfin music and send queue requests while the host approves, rejects, and controls what actually plays next.
longDescription: Encore is Coral's guest request layer for music playback. It is meant for parties and shared spaces where you want collaborative input from guests without giving up host control over the queue.
answer: Encore is a free, open-source request layer for your Jellyfin music library. Share a link at a party, guests browse your catalogue from their own phones and request tracks, and you approve or reject each one before it reaches the queue — so the room gets a say without anyone hijacking the speakers.
status: mvp
statusLabel: MVP Built
repo: https://github.com/Get-Coral/encore
docs: https://docs.getcoral.dev/modules/encore/
containerUrl: https://hub.docker.com/r/getcoral/encore
accent: teal
category: listen
order: 6
dateModified: "2026-09-26"
dockerImage: getcoral/encore:latest
port: 3000
volumes:
  - ./encore-data:/data
bestFor:
  - House parties
  - Guest queue moderation
  - Jellyfin music sharing
highlights:
  - Host-controlled guest request workflow for music sessions
  - Share a URL and let guests browse your Jellyfin music catalog
  - Approve or reject requests before they enter playback
  - Simple local deployment with Coral's standard app stack
stack:
  - TanStack Start
  - Tailwind v4
  - Jellyfin API
  - SQLite
  - Biome
requirements:
  - A running Jellyfin server with a music library
  - A Jellyfin API key and the UUID of the user whose library guests will browse
  - Docker, or Node.js 24 and pnpm to run from source
envVars:
  - name: HOST
    description: Interface the server binds to. Defaults to 0.0.0.0.
  - name: PORT
    description: Port the server listens on inside the container. Defaults to 3000.
  - name: JELLYFIN_URL
    description: Your Jellyfin server URL. The documentation lists this as a setup variable; the in-app connection flow covers the same ground.
  - name: JELLYFIN_API_KEY
    description: A Jellyfin API key from Dashboard → API Keys.
  - name: JELLYFIN_USER_ID
    description: The UUID of the Jellyfin user whose music library guests browse.
related:
  - kapow
  - marquee
faq:
  - question: How is Encore different from KAPOW!?
    answer: Encore is about music playing in the background; KAPOW! is about people singing. Encore guests request tracks from your own Jellyfin library and the host approves each one. KAPOW! searches YouTube, runs a karaoke queue with voting, and drives a TV display. Different evenings, different modules.
  - question: Do guests need accounts or an app?
    answer: No. You share a URL — at a party, usually as a QR code on the fridge — and guests open it in their phone browser. They browse your Jellyfin music catalogue and send requests without signing in or installing anything.
  - question: Can a guest skip or stop what is playing?
    answer: No. Guests can only request. Every request lands in a moderation list where you approve or reject it before it reaches the queue, so nobody can cut off the track you are in the middle of or clear the queue on their way to the kitchen.
  - question: Does Encore play the music itself?
    answer: Encore manages the request and approval flow against your Jellyfin music library. Jellyfin remains the source of truth for the catalogue and the playback session, exactly as with every other Coral module — Encore does not maintain a second copy of your music or its metadata.
  - question: Can I pin Encore to a version?
    answer: Not yet. Encore has no tagged GitHub releases, and Docker Hub publishes only latest and main for getcoral/encore even though the image is rebuilt regularly. If you need a reproducible deploy, pin by digest with getcoral/encore@sha256:… rather than by tag.
  - question: Is Encore production-ready?
    answer: It is marked MVP Built, which is honest. The request-and-approve loop works and the deployment is standard Coral, but it is among the younger modules and has no tagged releases yet. Treat it as something to run at a party rather than something to build a venue around.
---

## Install with Docker Compose

Encore listens on port 3000:

```yaml
services:
  encore:
    image: getcoral/encore:latest
    restart: unless-stopped
    depends_on: [jellyfin]
    ports:
      - "3005:3000"
    environment:
      JELLYFIN_URL: http://jellyfin:8096
      JELLYFIN_API_KEY: ${JELLYFIN_API_KEY}
      JELLYFIN_USER_ID: ${JELLYFIN_USER_ID}
    volumes:
      - ./encore-data:/data
    networks: [coral]
```

A note on configuration, because Encore is the least settled of the seven here. Its published `.env.example` lists only `HOST` and `PORT`, while the documentation walks you through setting the three `JELLYFIN_*` variables. If the environment variables do not take, connect through the in-app setup flow instead — that path is the one the module is built around.

To build and run from the source checkout:

```bash
docker build -t encore .
docker run -p 3000:3000 \
  -e JELLYFIN_URL=http://your-nas:8096 \
  -e JELLYFIN_API_KEY=your-key \
  -e JELLYFIN_USER_ID=your-user-id \
  encore
```

## The problem Encore solves

There are two bad options for music at a party.

Hand someone your phone, and you lose control of the speakers for the rest of the night. Or keep it to yourself, and you spend the evening as a DJ taking verbal requests over the noise instead of talking to anyone.

Encore is the middle path. Guests get a URL — usually a QR code stuck to the fridge — and browse your Jellyfin music library from their own phones. They can request anything in it. What they cannot do is skip the current track, clear the queue, or put anything into playback directly.

Every request arrives in a moderation list. You approve the good ones, reject the ones you would rather not hear at 2am, and the room genuinely contributes without anyone being able to hijack the evening.

## Encore or KAPOW!?

Both are party modules with a guest-phone join flow, and they are easy to confuse. The distinction is whether people are listening or performing.

[KAPOW!](/apps/kapow) is karaoke. It searches YouTube rather than your library, runs a voting queue, and drives a dedicated TV display for the room. It is built for bars and for nights where singing is the event.

Encore is background music with a say in it. It plays from your own Jellyfin catalogue, has no TV display, and replaces voting with host approval. It is built for a house party where the music matters but is not the point.

They coexist happily — different containers, different ports, different evenings. For the third screen in the room, [Marquee](/apps/marquee) shows what is playing without anyone having to ask.
