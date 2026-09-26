---
title: Librarian vs tinyMediaManager
seoTitle: Librarian vs tinyMediaManager | Coral
seoDescription: Two approaches to media library hygiene — Librarian is a web app that hardlinks imports and reads Jellyfin, tinyMediaManager is a mature desktop scraper.
module: Librarian
alternative: tinyMediaManager
alternativeUrl: https://www.tinymediamanager.org/
answer: tinyMediaManager is a mature desktop application that scrapes metadata and writes NFO files next to your media — thorough, offline, and not tied to any server. Librarian is a web app that runs beside Jellyfin, imports finished downloads by hardlinking, and treats Jellyfin as the source of truth.
dateModified: "2026-09-26"
chooseCoral:
  - You want a web interface you can reach from anywhere, not a desktop app
  - You want finished downloads imported by hardlink rather than copied
  - Jellyfin is already your source of truth and you do not want NFO files as a second one
  - You want it running continuously as a container rather than opened when you remember
chooseAlternative:
  - You want deep, configurable scraping from many metadata providers
  - You want NFO files on disk so your metadata survives any server you switch to
  - You need renaming patterns with fine-grained control over the naming scheme
  - You want something with many years of production use behind it
table:
  - feature: Form factor
    coral: Web app in a Docker container
    alternative: Desktop application, Java-based, also runnable headless
  - feature: Source of truth
    coral: Jellyfin
    alternative: NFO files on disk
  - feature: Import from downloads
    coral: Hardlinks into the media tree, falling back to a verified copy
    alternative: Not its job — it works on media already in place
  - feature: Metadata scraping
    coral: Enrichment against what Jellyfin exposes
    alternative: Deep, multi-provider scraping with per-field control
  - feature: Renaming
    coral: Queued bulk renaming
    alternative: Highly configurable naming patterns
  - feature: Duplicate detection
    coral: Built in
    alternative: Available
  - feature: Portability of metadata
    coral: Lives in Jellyfin
    alternative: NFO files travel with the files to any server
  - feature: Access control
    coral: Requires Jellyfin sign-in by default, because it can move and delete files
    alternative: Local application security
  - feature: Cost
    coral: MIT, free, all features
    alternative: Free tier, with a paid version for some features
  - feature: Maturity
    coral: MVP Built, v1.1.0
    alternative: Many years of releases
faq:
  - question: Does Librarian write NFO files?
    answer: No. Librarian treats Jellyfin as the source of truth rather than the filesystem, so enrichment lives in Jellyfin rather than in sidecar files. If you specifically want metadata that travels with your files to any future server, that is tinyMediaManager's model and it is a genuine advantage.
  - question: Can I use both?
    answer: Yes, and they overlap less than it looks. Use tinyMediaManager for deep scraping and NFO generation, and Librarian for importing finished downloads and day-to-day hygiene. They both touch the same files, so do not run a bulk operation in both at once.
  - question: Does Librarian replace Radarr and Sonarr?
    answer: No. Radarr and Sonarr handle acquisition — watching for releases, searching indexers, handing downloads to a client. Librarian starts after that, when files exist and need organising and cleaning. If you run the *arr stack, Librarian complements it rather than displacing it.
  - question: Why does Librarian care so much about mount layout?
    answer: Because it imports by hardlinking, and a hardlink cannot cross a filesystem or a mount point — even when both sides are the same filesystem. One ./library mount at the same path in every container that touches files keeps imports instant. If linking fails it falls back to a verified copy, which is correct but slower and doubles the space.
  - question: Is it safe to point Librarian at my media?
    answer: It can move and delete files, which is why it defaults to requiring a Jellyfin sign-in while the read-only Coral modules do not. Roots you seed through environment variables arrive switched off and a human enables each one in the UI — a mounted directory is deliberately not treated as permission to reorganise it.
---

## Two different philosophies about where metadata lives

The interesting difference here is not features. It is what each tool considers authoritative.

**tinyMediaManager writes to disk.** It scrapes from multiple providers and puts the result in NFO files next to your media, with artwork alongside. The filesystem is the record. Switch from Jellyfin to Plex to Emby and your metadata comes with you, because it was never in the server to begin with.

**Librarian treats Jellyfin as the record.** It reads what Jellyfin knows, changes files on disk when it needs to, and asks Jellyfin to rescan. There is no second metadata store and no sidecar file, which means nothing to keep in sync — and also nothing to take with you if you leave Jellyfin.

Neither is wrong. They suit different people, and which one you are depends on how likely you think you are to change media servers.

## What Librarian does that tinyMediaManager does not

**Import.** This is the clearest split. tinyMediaManager works on media that is already where it belongs; getting it there is someone else's job. Librarian watches your downloads root, recognises finished items, and moves them into the media tree with names Jellyfin parses cleanly.

It does that by **hardlinking**, which is why it is fast. A hardlink is a second name for the same bytes, so importing a 40 GB remux is instant, costs nothing extra on disk, and the torrent keeps seeding from the original path.

The constraint that follows is the thing most people get wrong. A hardlink cannot cross a filesystem, and — less obviously — it cannot cross a mount point either, even when both sides are the same filesystem. So this fails:

```yaml
    volumes:
      - ./downloads:/downloads    # separate mount
      - ./media:/media            # links across these will not work
```

and this works:

```yaml
    volumes:
      - ./library:/library        # one mount containing downloads/ and media/
```

Librarian decides by attempting the link rather than comparing device IDs, because nothing that inspects `statSync().dev` predicts mount boundaries correctly. If the attempt fails, the import becomes a verified copy — correct, just slower and twice the space.

**A web interface that is always on.** tinyMediaManager is a desktop application you open when you remember to. Librarian runs continuously as a container and is reachable from a phone.

## What tinyMediaManager does that Librarian does not

**Serious scraping.** Multiple providers, per-field control over what gets written, manual match correction for the titles that scrape badly. Librarian's enrichment is shallower.

**Renaming patterns.** tinyMediaManager gives you fine-grained control over the naming scheme. Librarian queues bulk renames toward Jellyfin-friendly names but does not expose the same depth of configuration.

**Portable metadata.** NFO files travel. If there is any chance you move to Plex or Emby, that is worth real money in re-scraping time you never have to spend.

**Maturity.** Many years of releases against every strange filename and every broken metadata provider. Librarian is on v1.1.0.

## Neither of these replaces the *arr stack

Worth stating because it comes up constantly.

Radarr and Sonarr solve acquisition: watch for a release, search indexers, hand the result to a download client. Both tools here start after that, at the point where files exist.

If you already run the *arr stack, Librarian is not a replacement and adding it does not mean removing anything. It sits at the organise-and-clean end of the same pipeline.

If you do not run the *arr stack — you acquire by hand and only want the organising half — [Tide](/apps/tide) plus Librarian covers that ground without Radarr, Sonarr or Prowlarr anywhere in it.

## A note on safety

Librarian can move and delete files, and it is the only Coral module that defaults to requiring a Jellyfin sign-in for exactly that reason. The read-only modules do not.

The filesystem roots you seed through `LIBRARIAN_DOWNLOADS_DIR` and `LIBRARIAN_MEDIA_DIR` arrive **switched off**. A human has to enable each one in the UI on first run. That is deliberate: mounting a directory into a container is not the same as granting permission to reorganise it.

Full setup is on the [Librarian module page](/apps/librarian), or see the [Jellyfin Docker Compose stack guide](/guides/jellyfin-docker-compose-stack) for the mount layout that makes hardlinking work across Jellyfin, Tide and Librarian.
