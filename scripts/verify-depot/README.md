# Depot manifest verification runbook

Goal. Upgrade `confidence` on patch entries from `estimated` to `reported` or
`verified` by reproducing redownload size from Steam depot manifests.

## Definitions

* `verified`. Both manifest IDs are public, both manifests have been downloaded
  via `steamcmd`, chunk reuse computed, and `bytes_downloaded` matches within
  a 5 percent tolerance.
* `reported`. At least one number is from a primary studio or engineering
  source (forum post, postmortem, talk).
* `estimated`. Numbers are from press or community measurement only.

## Prerequisites

1. `steamcmd` installed locally.
   On Debian/Ubuntu (with multiverse enabled):
       sudo apt install steamcmd
   Or download the standalone tarball:
       mkdir -p ~/.local/steamcmd && cd ~/.local/steamcmd
       curl -sL https://steamcdn-a.akamaihd.net/client/installer/steamcmd_linux.tar.gz | tar xz
       ./steamcmd.sh +quit
2. Steam account that owns the games being verified, with Steam Guard codes
   ready. Anonymous login works for some Source/Source 2 dedicated server
   depots only.

## Procedure per patch

1. Open the patch JSON file. Identify `game_slug` and `version`.
2. Locate the two manifest IDs that correspond to the patch boundary.
   The studio postmortem or SteamDB history page usually pins this. Record
   `manifest_before` and `manifest_after`.
3. Run `fetch-app-info.sh <appid>` to dump the public app info, including
   depot list and current public branch manifest IDs. This confirms depot IDs.
4. Download both manifests:
       steamcmd +login <user> +download_depot <appid> <depotid> <manifest_before> +quit
       steamcmd +login <user> +download_depot <appid> <depotid> <manifest_after> +quit
   The output prints to `~/.steam/steamapps/content/...`.
5. Parse both `.manifest` files with the chunk-reuse helper (TODO. See
   `chunk-reuse.md` for the format and the planned Rust port path).
6. Compute `bytes_downloaded` as the sum of unique chunks in `manifest_after`
   that are not present in `manifest_before`, multiplied by chunk decompressed
   size.
7. If observed `bytes_downloaded` is within 5 percent of the seed value,
   set `confidence` to `verified` and add a `depot_evidence` block to the
   patch JSON. Otherwise correct the seed value and set `reported`.

## Known infra debt

A native chunk-reuse parser is not yet shipped. The format is documented in
SteamKit (https://github.com/SteamRE/SteamKit) under `Depot/DepotManifest`.
Until the Rust port lands, the verification flow above is partially manual.

## Tracking progress

Maintain a checklist in this directory. Tick a row when verification lands.

| Patch | Verified | Notes |
|---|---|---|
| enshrouded-2024-asset-repack | [ ] | studio-confirmed cause, manifests on SteamDB |
| modern-warfare-2020-warzone-launch | [ ] | depot 1962662 |
| modern-warfare-2020-routine-patch | [ ] |  |
| halo-mcc-h2a-rebuild | [ ] | 343i blog quoted |
| cyberpunk-2077-1-5 | [ ] | next-gen update |
| destiny-2-shadowkeep | [ ] | new light free-to-play split |
| ark-survival-evolved-tek-update | [ ] |  |
| rainbow-six-siege-y8s4 | [ ] |  |
| apex-legends-season-19 | [ ] |  |
