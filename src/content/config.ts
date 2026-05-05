import { defineCollection, z } from 'astro:content';

const games = defineCollection({
  type: 'data',
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    publisher: z.string(),
    developer: z.string().optional(),
    engine: z.enum(['Unreal', 'Unity', 'Source', 'Source 2', 'IW', 'Frostbite', 'REDengine', 'Decima', 'Proprietary', 'Unknown']),
    steam_app_id: z.number().optional(),
    notes: z.string().optional()
  })
});

const patches = defineCollection({
  type: 'data',
  schema: z.object({
    game_slug: z.string(),
    version: z.string(),
    released: z.string(),
    bytes_downloaded: z.number().int().nonnegative(),
    bytes_actual_change: z.number().int().nonnegative(),
    cause_tag: z.enum([
      'asset_repacking',
      'shader_cache_regen',
      'mega_archive_reseal',
      'engine_upgrade',
      'localisation_repack',
      'unknown'
    ]),
    confidence: z.enum(['verified', 'reported', 'estimated']),
    sources: z.array(z.object({
      label: z.string(),
      url: z.string().url()
    })),
    summary: z.string()
  })
});

export const collections = { games, patches };
