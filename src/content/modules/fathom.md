---
name: Fathom
emoji: "📖"
tagline: Modern reading room for Jellyfin libraries
seoTitle: Fathom — a reading room for Jellyfin | Coral
seoDescription: Fathom is an open-source, Docker-native reader for books, manga, comics and PDFs held in Jellyfin, with a calm, cover-first browsing interface.
description: A calm, cover-first interface for books, manga, comics, PDFs, and grouped collections pulled from your Jellyfin reading libraries.
longDescription: Fathom is Coral's reading room. It turns Jellyfin libraries into a quieter browsing experience with featured shelves, recent additions, collection views, detailed title metadata, and local SQLite-backed connection storage.
answer: Fathom is a free, open-source reading interface for books, manga, comics and PDFs that already live in Jellyfin. It runs as one Docker container, reads your Jellyfin reading libraries over the API, and presents them cover-first with featured shelves, collections and recent additions.
status: mvp
statusLabel: MVP Built
repo: https://github.com/Get-Coral/fathom
docs: https://docs.getcoral.dev/modules/fathom/
containerUrl: https://hub.docker.com/r/getcoral/fathom
accent: teal
category: read
order: 4
version: 1.0.0
dateModified: "2026-04-13"
dockerImage: getcoral/fathom:latest
port: 3000
volumes:
  - ./fathom-data:/data
bestFor:
  - Books and manga on a NAS
  - Cover-first browsing
  - Calm reading interfaces
highlights:
  - Featured shelves and recent additions for reading libraries
  - Collection and library browsing with title detail views
  - Support for books, manga, comics, PDFs, and audiobooks
  - Jellyfin onboarding that can live in environment variables or local SQLite
stack:
  - TanStack Start
  - React 19
  - Tailwind v4
  - SQLite
  - Jellyfin API
requirements:
  - A running Jellyfin server with at least one reading library configured
  - A Jellyfin API key and the UUID of the user whose libraries you want to read
  - Docker, or Node.js 22.5+ to run from source
envVars:
  - name: JELLYFIN_URL
    description: Your Jellyfin server URL, for example http://jellyfin:8096.
  - name: JELLYFIN_API_KEY
    description: A Jellyfin API key from Dashboard → API Keys.
  - name: JELLYFIN_USER_ID
    description: The UUID of the Jellyfin user — not their username.
  - name: JELLYFIN_USERNAME
    description: Optional. With JELLYFIN_PASSWORD, opens a real playback session so progress syncs back.
  - name: JELLYFIN_PASSWORD
    description: Optional password for that session user.
  - name: FATHOM_DATA_DIR
    description: Directory for the SQLite state file, fathom.sqlite.
related:
  - aurora
  - librarian
faq:
  - question: Does Fathom store my books separately from Jellyfin?
    answer: No. Fathom holds no copy of your library. It reads whatever Jellyfin has indexed over the API and keeps only its own connection details in a local SQLite file. Delete the container and your books, your metadata and your reading libraries are exactly where they were.
  - question: What formats does Fathom handle?
    answer: Whatever your Jellyfin reading libraries contain — books in EPUB and PDF, manga, comics and audiobooks. Fathom does not do its own format detection or conversion; it presents what Jellyfin has already catalogued, which means adding support for a format is a Jellyfin question rather than a Fathom one.
  - question: How is this different from Kavita or Komga?
    answer: Kavita and Komga are complete servers — they scan your disks, hold their own database and metadata, and manage users. Fathom is a client over Jellyfin. If your books already live in Jellyfin next to your films, Fathom avoids running a second server; if they do not, Kavita and Komga are more capable and more mature for reading specifically.
  - question: Do I need a separate Jellyfin library for books?
    answer: Yes — Fathom reads Jellyfin's reading libraries, so the content has to be catalogued as books, manga or comics rather than sitting in a video library. Set that up in Jellyfin first and Fathom will pick it up with no additional configuration on its side.
  - question: Can I configure Fathom without environment variables?
    answer: Yes. Start the container with no Jellyfin configuration and Fathom walks you through connecting on first run, storing the result in SQLite at fathom.sqlite under FATHOM_DATA_DIR. Mount that directory if you want the setup to survive a rebuild.
---

## Install with Docker Compose

Fathom listens on port 3000, like every Coral module:

```yaml
services:
  fathom:
    image: getcoral/fathom:latest
    restart: unless-stopped
    depends_on: [jellyfin]
    ports:
      - "3003:3000"
    environment:
      FATHOM_DATA_DIR: /data
      JELLYFIN_URL: http://jellyfin:8096
      JELLYFIN_API_KEY: ${JELLYFIN_API_KEY}
      JELLYFIN_USER_ID: ${JELLYFIN_USER_ID}
    volumes:
      - ./fathom-data:/data
    networks: [coral]
```

`JELLYFIN_USER_ID` is the user's **UUID**, not their username — read it out of the URL when you open that user in the Jellyfin dashboard.

Every one of those environment variables is optional. Start the container bare and Fathom will ask for the Jellyfin connection on first run and store it in `fathom.sqlite` under `FATHOM_DATA_DIR`. Mount that directory if you want the setup to survive a container rebuild.

The published image is `getcoral/fathom` on Docker Hub. The module's own documentation currently walks through running from source rather than the container, so the Compose service above is assembled from the image's configuration.

## Reading is a different browsing problem

A film library and a book library want different interfaces, which is the reason Fathom exists as a separate module rather than a tab inside [Aurora](/apps/aurora).

Video browsing is driven by momentum — continue watching, what is next, what was just added. Reading is slower. You come back to a shelf you were partway through, or you browse covers looking for something to start, and the useful unit is the collection or the series rather than the individual episode.

So Fathom is cover-first and deliberately quiet. Featured shelves, recent additions, collection views, and title detail pages with the metadata Jellyfin holds. No autoplaying trailers, no rails competing for attention.

Everything it shows comes from Jellyfin at request time. Fathom keeps no copy of your library and no second metadata store — just its own connection details in SQLite.

## Fathom vs Kavita and Komga

This is the comparison most people actually need, and the answer depends entirely on where your books already live.

Kavita and Komga are full reading *servers*. They scan your disks, maintain their own database and metadata, handle users and reading progress, and are considerably more mature at reading specifically — better readers, better series handling, better manga support.

Fathom is not a server. It is a client over Jellyfin, and that is the whole proposition: if your books, manga and comics already sit in Jellyfin alongside your films, Fathom gives them a proper interface without you running and maintaining a second server, a second user list and a second backup.

If your reading collection is large and reading is the main event, Kavita or Komga will serve you better. If it is a shelf sitting in the media server you already run, Fathom is the smaller answer.

The full breakdown is in [Fathom vs Kavita and Komga](/compare/fathom-vs-kavita-komga).
