---
title: Aurora vs the Jellyfin web client
seoTitle: Aurora vs Jellyfin Web — which client? | Coral
seoDescription: How Aurora's cinematic Jellyfin frontend compares to the official web client and Jellyfin Vue, including what the stock client still does better.
module: Aurora
alternative: Jellyfin Web
alternativeUrl: https://jellyfin.org/
answer: The official Jellyfin web client is a complete administrative surface — dashboard, library management, users, plugins and playback in one app. Aurora is a consumption client only, built for a sofa and a big screen. Aurora replaces the browsing experience, not the server, and you can run both side by side on different ports.
dateModified: "2026-09-26"
chooseCoral:
  - The server is fine and it is the interface you want to change
  - The main screen is a TV, and browsing should feel like a streaming service
  - You want per-profile browsing with required sign-in so watch history is attributed correctly
  - You are happy to keep the official client open in another tab for admin work
chooseAlternative:
  - You need Live TV, DVR or SyncPlay
  - You rely on plugins that add UI, such as Intro Skipper's controls
  - You want one interface that does both administration and playback
  - You want something feature-complete today rather than a client still marked In Progress
table:
  - feature: Scope
    coral: Consumption only — browse and play
    alternative: Everything — dashboard, libraries, users, plugins, playback
  - feature: Installation
    coral: A separate Docker container on its own port
    alternative: Ships with the server, nothing to install
  - feature: Server-side changes
    coral: None — connects with a standard API key
    alternative: Not applicable
  - feature: Big-screen browsing
    coral: Full-bleed backdrops, rails, cast and related-title detail pages
    alternative: Functional grid layout designed to work everywhere
  - feature: Watch progress
    coral: Opens a real Jellyfin session, so progress syncs both ways
    alternative: Native
  - feature: Multi-user
    coral: Optional profiles and required sign-in, set with AURORA_MULTI_USER and AURORA_REQUIRE_LOGIN
    alternative: Full native user management
  - feature: Live TV and DVR
    coral: Not available
    alternative: Supported
  - feature: SyncPlay
    coral: Not available
    alternative: Supported
  - feature: Plugin UI
    coral: Not surfaced
    alternative: Plugins can extend the interface
  - feature: Maturity
    coral: In Progress, v1.14.0
    alternative: Years of production use across a very large install base
faq:
  - question: Do I have to stop using the official Jellyfin client?
    answer: No, and you should not. Aurora runs as a separate container on its own port and connects with a standard API key, so both are available at once. Use Aurora on the TV and the official client for anything administrative. Nothing about installing Aurora changes or degrades the stock interface.
  - question: Does Aurora need a plugin installed in Jellyfin?
    answer: No. Aurora requires nothing inside Jellyfin — no plugin, no theme, no server-side patch. It authenticates with an API key from Dashboard → API Keys, which also means it works against a server you do not administer as long as someone gives you a key.
  - question: How is Aurora different from Jellyfin Vue?
    answer: Jellyfin Vue is an official rewrite of the web client in Vue, aiming at broadly the same scope as the existing client, and the project has said it is not intended to replace it. Aurora is third-party and deliberately narrower — it does browsing and playback and nothing else, and it optimises for a large screen.
  - question: Is Aurora just a theme?
    answer: No. Theme projects restyle the official client's markup with CSS, so they inherit its structure and break when it changes. Aurora is a separate application that talks to the Jellyfin API directly, which is why it can have a different information architecture rather than a different colour scheme.
  - question: Will Intro Skipper still work?
    answer: The plugin keeps running on the server, but the skip control it injects into the official web client's player will not appear in Aurora, because Aurora is not that client. Plugins that work purely server-side on metadata behave normally; plugins that add interface elements only affect the client they were written for.
---

## What Aurora actually replaces

Worth being precise, because "alternative Jellyfin frontend" is ambiguous in a way that matters.

Aurora does not replace Jellyfin. Your server keeps doing the scanning, the transcoding, the user accounts, the metadata and the plugins. Aurora replaces one layer: the interface you browse and play from. It talks to your server over the same public HTTP API that every Jellyfin app uses, with an API key you generate from the dashboard.

Nothing is installed into Jellyfin. No plugin, no theme, no patch. Stop the Aurora container and there is no trace of it on the server.

## The design trade

The official web client has to be everything. It is where you add a library, create a user, configure a plugin, check transcoding, and also where you watch things. That breadth is the reason it looks the way it does — an interface that must expose a dashboard cannot also be a ten-foot experience.

Aurora makes the opposite choice. There is no dashboard, no library management, no user administration and no settings beyond its own. It does browsing and playback.

What that buys is an interface designed for one situation: a TV, a sofa, and someone deciding what to watch. Full-bleed backdrops, rails for continue-watching, favourites and recommendations, detail pages with cast and related titles, and transitions that hold up in a TV browser.

Whether that trade is worth a container depends entirely on whether the Jellyfin interface is the thing that bothers you. If your complaint is transcoding or metadata, Aurora changes nothing.

## Aurora is not a theme

There are several good Jellyfin theme projects that restyle the official client with CSS. They are lighter than Aurora and they keep every feature, since they are the same application with a different skin.

The limitation is structural: a theme inherits the client's information architecture. It can change how a row of posters looks; it cannot decide that the home page should lead with a full-bleed hero and a set of rails, because that markup does not exist to restyle. Themes also break when the upstream client changes its DOM.

Aurora is a separate application against the API, which is why it can differ in structure. It is the heavier answer — a whole extra container rather than a stylesheet — and for many people a theme is the right amount of change.

## Multi-user and attribution

A detail that matters in a shared house.

Aurora can run in single-session mode, where it uses one Jellyfin account for playback, or with profiles. Set `AURORA_MULTI_USER=true` for per-profile browsing and `AURORA_REQUIRE_LOGIN=true` to make everyone sign in with their own Jellyfin account.

With required sign-in on, playback and watch progress are attributed to the right person — continue-watching is yours rather than the household's. With it off, everything runs through the shared session user in `JELLYFIN_USERNAME` and the resume points mingle.

## What you give up

**Live TV and DVR.** Not in Aurora. If you use Jellyfin for broadcast, you are in the official client for that.

**SyncPlay.** Watching in sync with someone remote stays in the official client.

**Plugin interface elements.** Intro Skipper is the common case. The plugin keeps working server-side, but its skip button lives in the official web client's player and does not appear in Aurora.

**Completeness.** Aurora is marked **In Progress**, which is accurate. It covers browse-and-play well; it does not cover every corner of Jellyfin, and the official client has years of bug reports behind it that Aurora does not.

## Running both

This is the recommended setup, not a hedge. Aurora on port 3000 for the TV, the official client where it already is for everything else:

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
    volumes:
      - ./aurora-data:/data
```

Because Aurora holds no state that Jellyfin owns, trying it costs one container and removing it costs nothing. See the [Aurora module page](/apps/aurora) for full configuration, or the [Docker Compose stack guide](/guides/jellyfin-docker-compose-stack) to set it up alongside Jellyfin from scratch.
