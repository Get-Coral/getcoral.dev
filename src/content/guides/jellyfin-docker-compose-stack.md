---
title: A Jellyfin Docker Compose stack with Aurora, Tide and Librarian
seoTitle: Jellyfin Docker Compose stack guide | Coral
seoDescription: A complete docker-compose.yml for Jellyfin with a cinematic frontend, a torrent client and library cleanup — including the mount layout that makes it work.
answer: "This is a complete docker-compose.yml running Jellyfin alongside three Coral modules — Aurora for playback, Tide for downloads, and Librarian for importing and cleanup. The important part is the mount layout: one ./library tree at the same path in every container, which is what lets Librarian import by hardlink instead of copying."
datePublished: "2026-09-26"
dateModified: "2026-09-26"
faq:
  - question: Why does every container mount ./library at the same path?
    answer: Because Librarian imports by hardlinking, and a hardlink cannot cross a filesystem or a mount point — even when both sides are the same filesystem. One tree mounted at one path in every container keeps imports instant. Split downloads and media into separate mounts and every import silently becomes a full file copy.
  - question: Why are Tide and Librarian bound to 127.0.0.1?
    answer: Tide has no authentication enabled by default, and Librarian can move and delete files. Binding them to loopback means only the host can reach them until you have decided how to expose them. Put them behind a reverse proxy with auth, or set TIDE_AUTH_USERNAME and TIDE_AUTH_PASSWORD, before changing those mappings.
  - question: What do I put in PUID and PGID?
    answer: Your own user and group ID — run `id -u` and `id -g`. The three containers that share files need to agree on ownership, and Librarian deliberately never chowns anything. If they disagree, imports fail on permissions rather than doing something surprising to your file ownership.
  - question: Do I have to run all of these?
    answer: No. Every Coral module is independent and none depends on another. Delete any service you do not want and the rest carry on. Aurora alone is a perfectly reasonable stack if all you want is a better interface on the TV.
  - question: Should I add the downloads folder as a Jellyfin library?
    answer: No. Point Jellyfin at the media tree only. If you index incoming downloads you get half-written files appearing in your library, duplicates of everything Librarian later imports, and constant scan churn. Let Librarian move things into the media tree and let Jellyfin watch only that.
  - question: Can I pin these images to a version?
    answer: Not by tag today. Docker Hub publishes only latest and main for the Coral images, even though the repositories have tagged releases. If you need reproducible deploys, resolve the digest with `docker buildx imagetools inspect getcoral/aurora:latest` and pin with getcoral/aurora@sha256:… instead.
---

## What this builds

Four containers on one Docker network:

- **Jellyfin** — the media server, and the source of truth for everything else here
- **[Aurora](/apps/aurora)** — a cinematic frontend for browsing and playback, on port 3000
- **[Tide](/apps/tide)** — a torrent client with queue control, on loopback port 3001
- **[Librarian](/apps/librarian)** — imports finished downloads and keeps the library tidy, on loopback port 3002

Each module is independent. Delete any of them and the rest keep working — nothing here depends on anything else in the file except Jellyfin.

## The directory layout comes first

Get this wrong and everything else works but badly, so it is worth doing before you write any YAML.

```
coral/
├── docker-compose.yml
├── .env
├── jellyfin-config/
├── jellyfin-cache/
├── aurora-data/
├── tide-data/
├── librarian-data/
└── library/              ← one tree, one mount
    ├── downloads/
    │   ├── complete/
    │   └── incomplete/
    └── media/
        ├── movies/
        └── tv/
```

The single rule: **downloads and media live under one `library/` tree**, and every container that touches files mounts that tree at the same path.

The reason is hardlinking. Librarian imports a finished download into your media tree by creating a hardlink — a second name for the same bytes on disk. A 40 GB file is imported instantly, costs no extra space, and the torrent keeps seeding from the original path.

A hardlink cannot cross a filesystem. Less obviously, it cannot cross a *mount point* either, even when both sides are the same physical filesystem. So mounting `./downloads` and `./media` separately breaks linking, and every import silently becomes a full copy: slower, and double the disk.

Tide has the same constraint for its own reason. It derives its in-progress directory as a sibling of `TIDE_DOWNLOADS_DIR`, so `/library/downloads/complete` implies `/library/downloads/incomplete`. Under one mount, finishing a torrent is a rename. Across two, it is a copy.

## The .env file

```ini
TZ=Europe/Brussels

# Your own user, so the containers that share files agree on ownership.
# Find them with: id -u  and  id -g
PUID=1000
PGID=1000

# From Jellyfin: Dashboard -> API Keys
JELLYFIN_API_KEY=
# The user's UUID, not their username
JELLYFIN_USER_ID=
JELLYFIN_USERNAME=
JELLYFIN_PASSWORD=
```

You cannot fill in the Jellyfin values yet — the server has to exist first. Start Jellyfin on its own, complete the setup wizard, generate an API key, then come back and fill these in before starting the rest.

`JELLYFIN_USER_ID` is the user's **UUID**, not their username. Open that user in the Jellyfin dashboard and read it out of the URL.

## docker-compose.yml

```yaml
services:
  jellyfin:
    image: jellyfin/jellyfin:latest
    restart: unless-stopped
    user: "${PUID}:${PGID}"
    ports:
      - "8096:8096"
    environment:
      TZ: ${TZ}
    volumes:
      - ./jellyfin-config:/config
      - ./jellyfin-cache:/cache
      - ./library:/library
    networks: [coral]

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
      - ./library:/library
    networks: [coral]

networks:
  coral:
```

## Three things in there that are load-bearing

**`mem_limit: 4g` on Tide is required, not decorative.** Tide reads the container memory cap from cgroups and pauses torrents as it approaches it, resuming once use drops. With no limit set there is nothing to read and nothing to pause against, and a large swarm will use whatever the host has.

**Tide and Librarian are on `127.0.0.1`.** Tide ships with no authentication, and Librarian can move and delete files. Loopback means only the host can reach them. Before you change that, set `TIDE_AUTH_USERNAME` and `TIDE_AUTH_PASSWORD`, or put both behind a reverse proxy that handles auth.

**`user: "${PUID}:${PGID}"` is on every container that touches files.** Librarian never chowns anything, so it has to run as a user that can already read and write what it is moving. If Jellyfin, Tide and Librarian disagree about ownership, imports fail on permissions.

## Bringing it up

Start the server first, because the other three need an API key that does not exist yet:

```bash
docker compose up -d jellyfin
```

Open `http://localhost:8096`, complete the setup wizard, and add your libraries pointing at `/library/media/movies` and `/library/media/tv`.

**Do not add `/library/downloads` as a Jellyfin library.** Indexing incoming downloads gets you half-written files in your library, duplicates of everything Librarian later imports, and constant scan churn.

Then go to Dashboard → API Keys, create one, and put it in `.env` along with the user UUID. Now start the rest:

```bash
docker compose up -d
```

## First run

**Aurora** at `http://localhost:3000` should show your library straight away. If the environment variables are set it connects on boot; if not, it walks you through connecting and stores the result in `/data/aurora.sqlite`.

**Tide** at `http://localhost:3001`. Set your queue limits, and your default ratio and seed-time goals, before adding anything — they apply to every torrent as it arrives.

**Librarian** at `http://localhost:3002`. The two roots you seeded will be listed but **disabled**, and you enable each one by hand. That is deliberate: mounting a directory into a container is not permission to reorganise it.

## Adding the rest of the reef

The same pattern extends to the other modules. All four remaining ones listen on port 3000 inside the container, so pick free host ports:

```yaml
  fathom:
    image: getcoral/fathom:latest
    ports: ["3003:3000"]
    environment:
      FATHOM_DATA_DIR: /data
      JELLYFIN_URL: http://jellyfin:8096
      JELLYFIN_API_KEY: ${JELLYFIN_API_KEY}
      JELLYFIN_USER_ID: ${JELLYFIN_USER_ID}
    volumes: ["./fathom-data:/data"]
    networks: [coral]

  marquee:
    image: getcoral/marquee:latest
    ports: ["3004:3000"]
    environment:
      MARQUEE_DATA_DIR: /data
      JELLYFIN_URL: http://jellyfin:8096
      JELLYFIN_API_KEY: ${JELLYFIN_API_KEY}
      JELLYFIN_USER_ID: ${JELLYFIN_USER_ID}
    volumes: ["./marquee-data:/data"]
    networks: [coral]
```

[Fathom](/apps/fathom) gives your books, manga and comics a reading interface. [Marquee](/apps/marquee) turns a spare screen into an ambient now-playing display. [Encore](/apps/encore) adds moderated guest music requests for parties. [KAPOW!](/apps/kapow) is the karaoke module and is the one exception to everything above — it does not use Jellyfin at all and needs Supabase plus a YouTube API key instead.

The full list is on the [modules page](/apps).

## Pinning versions

Worth knowing before you build anything you cannot afford to have change under you.

The Coral images currently publish only `latest` and `main` on Docker Hub, even though the repositories carry tagged releases. Until semver tags land, reproducible deploys mean pinning by digest:

```bash
docker buildx imagetools inspect getcoral/aurora:latest
```

Then use the digest in your Compose file:

```yaml
    image: getcoral/aurora@sha256:...
```
