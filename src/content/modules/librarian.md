---
name: Librarian
emoji: "🗂️"
logo: /logos/librarian-mark.svg
tagline: Media hygiene and enrichment for self-hosted libraries
seoTitle: Librarian — clean up a Jellyfin library | Coral
seoDescription: Librarian imports, organises and deduplicates a self-hosted media library, hardlinking files into place and keeping Jellyfin as the source of truth.
description: Scan, organize, enrich, and maintain your Jellyfin library with a management layer focused on metadata quality and long-term cleanliness.
longDescription: Librarian is Coral's module for media hygiene. It is aimed at people who want stronger organization, metadata enrichment, duplicate detection, and bulk library operations while keeping Jellyfin as the source of truth.
answer: Librarian is a free, open-source tool for keeping a self-hosted media library tidy. It runs as one Docker container, imports finished downloads by hardlinking them into your media tree, flags missing metadata and duplicates, and queues bulk renaming and tagging — without Jellyfin ever losing ownership of the library.
status: mvp
statusLabel: MVP Built
repo: https://github.com/Get-Coral/librarian
docs: https://docs.getcoral.dev/modules/librarian/
containerUrl: https://hub.docker.com/r/getcoral/librarian
accent: coral
category: manage
order: 7
version: 1.1.0
dateModified: "2026-09-26"
dockerImage: getcoral/librarian:latest
port: 3000
volumes:
  - ./librarian-data:/data
  - ./library:/library
bestFor:
  - Cleaning large libraries
  - Metadata QA
  - Bulk enrichment workflows
highlights:
  - Identify missing metadata, weak posters, and duplicates
  - Import finished downloads by hardlink, falling back to a verified copy
  - Queue bulk renaming, tagging, and enrichment operations
  - Requires a Jellyfin sign-in by default, because it can move and delete files
  - Store local connection details in SQLite for self-hosted installs
stack:
  - TanStack Start
  - TanStack Query
  - Tailwind v4
  - SQLite
  - Jellyfin API
requirements:
  - A running Jellyfin server and an API key
  - The same ./library mount, at the same path, as Jellyfin and Tide
  - A user and group ID that matches the other containers sharing those files
envVars:
  - name: JELLYFIN_URL
    description: Your Jellyfin server URL.
    required: true
  - name: JELLYFIN_API_KEY
    description: A Jellyfin API key from Dashboard → API Keys.
    required: true
  - name: JELLYFIN_USER_ID
    description: The UUID of the Jellyfin user — not their username.
    required: true
  - name: LIBRARIAN_DATA_DIR
    description: Directory for the SQLite state file, librarian.sqlite.
  - name: LIBRARIAN_REQUIRE_LOGIN
    description: Defaults to true. Setting it pins the value and removes the toggle from the UI.
  - name: LIBRARIAN_DOWNLOADS_DIR
    description: Seeds a downloads root. Seeded roots arrive switched off and must be enabled in the UI.
  - name: LIBRARIAN_MEDIA_DIR
    description: Seeds a media root. Also arrives switched off.
  - name: CORAL_SERVICE_TOKEN
    description: Grants another Coral module full access without issuing a token in the UI. Never stored, and cannot be revoked from the Connections page.
related:
  - tide
  - aurora
  - fathom
faq:
  - question: Does Librarian replace Radarr and Sonarr?
    answer: No, and it does not try to. Radarr and Sonarr are acquisition tools — they watch for releases, search indexers and push downloads to a client. Librarian starts after that, at the point where files exist and need to be organised, enriched and deduplicated. The two sit on different halves of the same pipeline.
  - question: Will Librarian move or delete my files?
    answer: It can, which is exactly why it defaults to requiring a Jellyfin sign-in while the read-only Coral modules do not. Filesystem roots you seed through environment variables arrive switched off and a human has to enable each one in the UI — a mounted directory is not treated as permission to write to it.
  - question: Why does Librarian have to use the same mount path as Jellyfin and Tide?
    answer: Because it imports by hardlinking, and a hardlink cannot cross a filesystem or even a mount point, including when both sides are the same filesystem. Mounting one ./library tree at /library in every container that touches files keeps imports instant. If linking does fail, Librarian falls back to a verified copy — correct, just slower and twice the space.
  - question: Why does it attempt a link instead of checking device IDs?
    answer: Because nothing that inspects statSync().dev can reliably predict whether a link will succeed across bind mounts. Librarian decides by trying, and falls back cleanly when the attempt fails. That is more robust than guessing from metadata that does not describe mount boundaries.
  - question: Should I add the downloads directory as a Jellyfin library?
    answer: No. Jellyfin should index your media tree, not the downloads tree. If you point a Jellyfin library at incoming downloads you get half-written files, duplicates of everything Librarian imports, and scan churn. Let Librarian move things into the media tree and let Jellyfin watch only that.
  - question: What is CORAL_SERVICE_TOKEN for?
    answer: It is an escape hatch for operators who configure everything through Compose and never open a UI. It grants another Coral module full access to Librarian, is never stored, and cannot be revoked from the Connections page. Leave it unset and issue scoped tokens from the UI instead unless you specifically need it.
---

## Install with Docker Compose

Librarian listens on port 3000. The example binds it to loopback on 3002 and shares the same `./library` mount that Jellyfin and Tide use:

```yaml
services:
  librarian:
    image: getcoral/librarian:latest
    restart: unless-stopped
    user: "${PUID}:${PGID}"
    depends_on: [jellyfin]
    ports:
      - "127.0.0.1:3002:3000"
    environment:
      LIBRARIAN_DATA_DIR: /data
      JELLYFIN_URL: http://jellyfin:8096
      JELLYFIN_API_KEY: ${JELLYFIN_API_KEY}
      JELLYFIN_USER_ID: ${JELLYFIN_USER_ID}
      # Seeds the roots. They arrive switched off — turn them on in the UI.
      LIBRARIAN_DOWNLOADS_DIR: /library/downloads/complete
      LIBRARIAN_MEDIA_DIR: /library/media/movies
    volumes:
      - ./librarian-data:/data
      # The same single mount, at the same path, as Jellyfin and Tide.
      - ./library:/library
    networks: [coral]
```

`user: "${PUID}:${PGID}"` matters. Librarian never chowns anything, so it has to run as a user that can already read and write the files it is moving — the same one Jellyfin and Tide run as. Find yours with `id -u` and `id -g`.

Open Librarian at `http://localhost:3002` on first run. The roots you seeded through environment variables will be listed but **disabled**, and you enable each one by hand. That is deliberate: mounting a directory into a container is not the same as granting permission to reorganise it.

## One mount, not one per directory

This is the single rule that determines whether Librarian is fast or slow, and it is worth understanding before you write your Compose file.

Librarian imports finished downloads by **hardlinking** them into your media tree. A hardlink is a second name for the same bytes on disk, so importing a 40 GB remux is instantaneous and costs no extra space, and the torrent keeps seeding from the original path.

A hardlink cannot cross a filesystem. Less obviously, it cannot cross a *mount point* either — even when both sides are the same physical filesystem. So this does not work:

```yaml
    volumes:
      - ./downloads:/downloads    # separate mount
      - ./media:/media            # separate mount — links across these will fail
```

And this does:

```yaml
    volumes:
      - ./library:/library        # one mount containing downloads/ and media/
```

Nothing that inspects `statSync().dev` can predict this correctly, which is why Librarian decides by attempting the link rather than comparing device IDs. If the attempt fails, nothing breaks — the import becomes a verified copy. Correct, just slower and twice the space.

## What Librarian actually does

Import is the front half. Librarian watches the roots you enable, recognises finished downloads, and moves them into your media tree under names Jellyfin will parse cleanly.

The back half is hygiene on what is already there. It surfaces the things that quietly degrade a large library over time: titles with missing or thin metadata, weak or absent posters, and duplicates that accumulated from re-downloads and re-encodes. Bulk renaming, tagging and enrichment operations are queued rather than applied one file at a time.

Throughout, Jellyfin stays the source of truth. Librarian does not maintain a parallel metadata database or a second idea of what your library contains — it reads Jellyfin, changes files on disk, and asks Jellyfin to rescan.

## Where Librarian sits next to the *arr stack

If you already run Radarr and Sonarr, Librarian is not a replacement and installing it does not mean tearing anything out. Those tools solve acquisition: watch for a release, search indexers, hand it to a download client. Librarian starts one step later, when files exist and the question becomes whether the library is actually in good shape.

If you do not run the *arr stack — because you acquire media by hand and only want the organising and cleanup half — then Librarian covers that half on its own, paired with [Tide](/apps/tide) for the downloads themselves.

The comparison against a dedicated metadata tool is in [Librarian vs tinyMediaManager](/compare/librarian-vs-tinymediamanager).
