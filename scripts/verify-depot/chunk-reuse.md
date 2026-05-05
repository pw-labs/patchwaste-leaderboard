# Chunk reuse computation

A Steam depot `.manifest` file lists files and the chunks each file consumes.
Each chunk has a SHA1 hash and a decompressed size. When a depot updates,
the new manifest references the same chunks where unchanged and new chunks
where bytes differ.

`bytes_downloaded` for a patch is the sum of decompressed sizes of all chunks
in the new manifest whose SHA1 is not present in the old manifest.
`bytes_actual_change` is the sum of decompressed sizes of all chunks in the
*content* portion (excluding shader caches, padding sentinels, and asset
package reseal blobs) that are net new between the manifests.

## Format

The manifest binary format is documented in SteamKit
(https://github.com/SteamRE/SteamKit) under `SteamKit2/SteamKit2/Steam/CDN/`
and in the unofficial steam_protobufs repo. Key types.

* `ContentManifestPayload`. Lists files, each with a chunk list.
* `ContentManifestMetadata`. Header (depot id, manifest id, creation time).
* Each `ChunkData`. SHA1 (20 bytes), offset, compressed size, uncompressed size.

## Implementation plan

A Rust port belongs in the main `patchwaste` repo as a new module
`patchwaste-core::depot::manifest`, reusing the existing `pak` and
`assetbundle` chunk diff primitives. The leaderboard repo would then call it
via a small CLI wrapper. Until that lands, run the Python reference
(`scripts/verify-depot/parse-manifest.py`, TODO) on a per-patch basis.

## Why not just use SteamDB

SteamDB shows manifest IDs and download sizes per build, but not chunk reuse.
Two updates with identical "download size" can be 10 percent and 90 percent
new bytes depending on packing strategy. The leaderboard's whole point is to
distinguish those.
