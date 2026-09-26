---
title: KAPOW! vs Karaoke Eternal
seoTitle: KAPOW! vs Karaoke Eternal — karaoke | Coral
seoDescription: A self-hosted karaoke comparison — KAPOW! searches YouTube and runs a voting queue, Karaoke Eternal plays your own local library with no internet.
module: KAPOW!
alternative: Karaoke Eternal
alternativeUrl: https://www.karaoke-eternal.app/
answer: Karaoke Eternal plays karaoke files you already own, fully offline, and is the mature choice for a home setup. KAPOW! searches YouTube instead, so there is no catalogue to curate and guests rarely hit a missing song — but it needs internet, a Supabase project and a YouTube API key. Venue versus living room.
dateModified: "2026-09-26"
chooseCoral:
  - You run a bar or a public night where "we don't have that song" ends the evening
  - You do not want to build and maintain a karaoke file library
  - You want crowd voting to shape the queue, with the host keeping final say
  - You want a dedicated TV display separate from the host and guest views
chooseAlternative:
  - You already own MP3+G or MP4 karaoke files
  - The venue has unreliable internet, or none
  - You want no external service dependency and no API quota
  - You want something battle-tested with an established community
table:
  - feature: Song source
    coral: YouTube search via the YouTube Data API
    alternative: Your own local MP3+G and MP4 library
  - feature: Works offline
    coral: "No — needs YouTube and hosted Supabase"
    alternative: "Yes — fully local, no internet required"
  - feature: Catalogue setup
    coral: None; anything on YouTube is available immediately
    alternative: You source, tag and organise the files yourself
  - feature: Guest join
    coral: Scan a QR code, browser only, no account
    alternative: Browser on the local network, optional accounts
  - feature: Queue ordering
    coral: Crowd voting promotes songs, host has final say
    alternative: Host-managed queue with per-singer rotation
  - feature: TV display
    coral: Dedicated TV route separate from host and guest views
    alternative: Browser-based player with visualisations
  - feature: External dependencies
    coral: Supabase project and a YouTube Data API key
    alternative: None
  - feature: Pitch and scoring
    coral: Not available
    alternative: Not the focus; see Nightingale for scoring
  - feature: Maturity
    coral: MVP Built, v1.0.1
    alternative: Established project with an active community
  - feature: License
    coral: MIT
    alternative: Open source
faq:
  - question: Can KAPOW! play my own karaoke files?
    answer: Not currently. KAPOW! searches YouTube, which is the deliberate trade — no catalogue to build, and guests can request effectively anything. If you already own a curated MP3+G library, that investment carries over to Karaoke Eternal and not to KAPOW!, which is a real argument for staying where you are.
  - question: What happens if the venue's internet drops mid-night?
    answer: KAPOW! stops working. Song search goes through the YouTube API and room state lives in hosted Supabase, so both need to be reachable. If your venue's connectivity is unreliable, this is disqualifying and Karaoke Eternal — which is fully local — is the safer choice.
  - question: Will I hit the YouTube API quota?
    answer: The free YouTube Data API tier is generous for a normal karaoke night, but a busy venue running several nights a week should check its usage. Quota is consumed per search, so a room of thirty people browsing hard uses noticeably more than five people who know what they want.
  - question: Why does KAPOW! need Supabase when Karaoke Eternal needs nothing?
    answer: Because KAPOW! syncs realtime state across many devices — thirty phones, a host tablet and a TV all need the same queue within a second. It uses Supabase's realtime Postgres for that. Karaoke Eternal solves the same problem locally, which is simpler and is exactly why it works offline.
  - question: Which is better for a house party?
    answer: Probably Karaoke Eternal, if you have files. At home the catalogue is smaller, the crowd is forgiving, and offline is one less thing to worry about. KAPOW!'s advantages — unlimited catalogue, crowd voting, a booth view for someone running the room — matter most when strangers are paying for the night.
---

## Two different nights

Both projects run a karaoke queue that guests join from their phones. The difference is where the songs come from, and it decides almost everything else.

**Karaoke Eternal** plays a library you own. MP3+G, MP4, sitting on your disk. Everything is local, so it works with the router unplugged, and there is no quota, no API key and no external service.

**KAPOW!** searches YouTube. There is no library to build, and a guest can request essentially any song that exists. In exchange it needs internet, a YouTube Data API key and a Supabase project.

If you already own karaoke files, that is an investment Karaoke Eternal honours and KAPOW! does not. If you do not, building one is a real project before your first night.

## Why KAPOW! exists

It was written for a comic-themed bar in Ghent that was managing its karaoke queue with coasters.

That setting explains the design choices. In a bar, guests are strangers, they are not installing anything, and the failure mode that ends a night is somebody asking for a song you do not have. A curated local library makes that failure mode routine; YouTube search makes it rare.

It also explains the three separate surfaces. Guests get search and voting on their phones. The host gets a booth view with direct queue control — promote, reorder, drop. The TV gets its own full-screen route. Those are different jobs for different people, so they are different routes rather than one interface with permission checks.

## Voting

Karaoke Eternal's queue is host-managed with per-singer rotation, which is fair and predictable: everyone gets a turn in order.

KAPOW! adds crowd voting. Guests vote on pending songs and the popular ones rise. The host still decides — voting shapes order rather than dictating it — but the room has a say.

Which you want is genuinely a matter of venue. Rotation is fairer and better for a small group where everybody wants to sing. Voting is better with a large crowd where most people are watching rather than performing, because it surfaces what the room wants to hear.

## The dependency question

This is where KAPOW! departs from Coral's own stated principles, and it is worth being direct about it rather than glossing over it.

Every other Coral module runs with no cloud dependency, keeps state in local SQLite, and needs no internet. KAPOW! needs hosted Supabase for realtime room state and the YouTube API for search.

The Supabase part is defensible on technical grounds. A karaoke room is a realtime multi-device problem — thirty phones, a host tablet and a TV need the same queue within a second — and local SQLite with polling degrades exactly when the room is full. The YouTube part is inherent to sourcing songs from YouTube.

But the consequence is real: a venue with flaky internet should run Karaoke Eternal. There is no workaround.

## Other options worth knowing

The self-hosted karaoke space is small, so the honest comparison is not just these two.

**[Karaoke Eternal](https://www.karaoke-eternal.app/)** — local library, browser-based playback for MP3+G and MP4, WebGL visualisations. The mature default.

**[KaraokeParty](https://github.com/matt-antone/KaraokeParty)** — local library, QR-code join, runs on a Pi or Mac mini. Closest in spirit to KAPOW! on the guest-experience side while staying fully local.

**[Nightingale](https://github.com/Akkudrak/nightingale)** — different problem entirely. It scans a Jellyfin server, separates vocals from instrumentals with an AI model, transcribes word-level lyrics, and does pitch scoring. If you want *scoring*, neither KAPOW! nor Karaoke Eternal does that and Nightingale does.

**[karaoke-for-jellyfin](https://github.com/johnpc/karaoke-for-jellyfin)** — plays karaoke tracks already in your Jellyfin library, with phone queueing and a TV view. The best fit if your karaoke files are already catalogued in Jellyfin.

## Trying KAPOW!

Two external accounts before you start: a Supabase project, and a YouTube Data API key.

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

Full setup is on the [KAPOW! module page](/apps/kapow). If what you actually want is moderated *music* requests rather than karaoke — guests suggesting tracks from your own Jellyfin library, host approving — that is [Encore](/apps/encore) and it is a different module.
