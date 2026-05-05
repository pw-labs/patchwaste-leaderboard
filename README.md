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

- [ ] Run depot manifest verification on the seed corpus and upgrade confidence labels where evidence supports it. Runbook in `scripts/verify-depot/`.
- [ ] Replace any `estimated` entries that cannot be upgraded with weaker but verifiable patches.
- [x] Wire the signup form to a real provider. Posts to `/api/signup` (Cloudflare Pages Function) which forwards to Buttondown. Set `BUTTONDOWN_API_KEY` in the Pages project env vars.
- [x] Add favicon and OG image.
- [x] Add `robots.txt` and `sitemap` (Astro plugin).
- [ ] Cloudflare Pages project + custom domain `leaderboard.patchwaste.dev`. See Deploy section below.
- [ ] Set up a weekly GitHub Action that pulls fresh depot data and rebuilds.
- [ ] Legal review of methodology page wording before send to press.

## Deploy (Cloudflare Pages)

1. Create a Cloudflare Pages project pointing at `pw-labs/patchwaste-leaderboard`.
2. Build command `npm run build`. Build output `dist`. Node version 20.
3. In Pages project settings, add environment variable `BUTTONDOWN_API_KEY` (Production scope) with the Buttondown API token. The Pages Function at `functions/api/signup.ts` reads it on POST.
4. Custom domain `leaderboard.patchwaste.dev`. Add a CNAME record `leaderboard` → `<project>.pages.dev` in the `patchwaste.dev` zone. Cloudflare provisions the cert automatically.
5. The `public/_headers` file applies security headers and asset cache rules. The `sitemap-index.xml` is generated at build time by `@astrojs/sitemap`.

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
