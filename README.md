# patchwaste-leaderboard

Public ranking of game patches by bytes redownloaded per byte of actual content change.

Built as a distribution wedge for [patchwaste](https://github.com/pw-labs/patchwaste): the leaderboard is press bait, SEO surface, and signup funnel for the paid CI gate.

## Status

Pre-publish. Built locally, verified to compile, not yet deployed. Most seed entries are at confidence level `estimated`. Depot manifest verification pass required before public launch.

## Stack

- Astro 5 static site
- Tailwind for styling
- Content collections for games and patches (typed via Zod)
- Output is fully static; deploy target is Cloudflare Pages or any static host

## Local development

```bash
npm install
npm run dev
```

Build the static site:

```bash
npm run build
```

## Adding a patch

1. Add a game file at `src/content/games/<slug>.json` if the game does not already exist.
2. Add a patch file at `src/content/patches/<game-slug>-<short-id>.json`.
3. Set `confidence` honestly:
   - `verified`: reproducible from public depot manifest via steamcmd.
   - `reported`: at least one number is from a primary studio or engineering source.
   - `estimated`: numbers are from press or community measurement only.
4. Cite at least one public source per entry.

The build will fail if a patch references a non-existent game slug or violates schema.

## Pre-publish checklist

- [ ] Run depot manifest verification on the seed corpus and upgrade confidence labels where evidence supports it.
- [ ] Replace any `estimated` entries that cannot be upgraded with weaker but verifiable patches.
- [ ] Wire the signup form to a real provider (Buttondown, Loops, Resend, or a Cloudflare Worker writing to D1).
- [ ] Add favicon and OG image.
- [ ] Add `robots.txt` and `sitemap` (Astro plugin).
- [ ] Cloudflare Pages project + custom domain `leaderboard.patchwaste.dev`.
- [ ] Set up a weekly GitHub Action that pulls fresh depot data and rebuilds.
- [ ] Legal review of methodology page wording before send to press.

## Pre-publish risks

- **SteamDB ToS**. Manual data curation only for MVP. No automated scraping until a usage path is cleared.
- **Studio pushback**. Stick to public sources, methodology open, corrections within 7 days.
- **Numeric drift**. Many seed entries are estimates. Mark them clearly. Do not promote the leaderboard publicly until at least 50% of entries are upgraded to `reported` or `verified`.

## Layout

```
src/
  content/
    config.ts           Zod schemas for games and patches
    games/<slug>.json   One file per game
    patches/<id>.json   One file per patch
  layouts/
    Base.astro          Header, footer, CTA
  components/
    PatchRow.astro      Row used on leaderboard and game pages
    ConfidenceBadge.astro
  pages/
    index.astro         Leaderboard
    games/[slug]/index.astro      Per-game page
    games/[slug]/[version].astro  Per-patch page
    methodology.astro
    about.astro
    signup.astro
  lib/
    format.ts           Byte / ratio formatting
```

## Why this exists

See `/about` page or the patchwaste main repo. Short version: the Enshrouded 30 GB redownload for a 299 KB content change is not unusual; it is the default behaviour of game build pipelines, and nobody measures the cost. This site makes it visible.
