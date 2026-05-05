export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB', 'TB'];
  let v = bytes / 1024;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v.toFixed(v >= 100 ? 0 : v >= 10 ? 1 : 2)} ${units[i]}`;
}

export function wasteRatio(downloaded: number, actual: number): number {
  if (actual === 0) return Infinity;
  return downloaded / actual;
}

export function formatRatio(r: number): string {
  if (!isFinite(r)) return '∞';
  if (r < 10) return `${r.toFixed(1)}x`;
  return `${Math.round(r)}x`;
}

export function causeLabel(tag: string): string {
  const map: Record<string, string> = {
    asset_repacking: 'Asset repacking',
    shader_cache_regen: 'Shader cache regeneration',
    mega_archive_reseal: 'Mega-archive reseal',
    engine_upgrade: 'Engine upgrade',
    localisation_repack: 'Localisation repack',
    unknown: 'Cause unknown'
  };
  return map[tag] ?? tag;
}

export function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function confidenceBadge(c: string): string {
  const map: Record<string, string> = {
    verified: 'Verified',
    reported: 'Reported',
    estimated: 'Estimated'
  };
  return map[c] ?? c;
}
