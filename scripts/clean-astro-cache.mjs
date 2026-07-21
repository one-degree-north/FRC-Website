// Runs before every `astro build` (npm "prebuild" hook).
//
// Astro's content layer keeps a persisted store (.astro/ and
// node_modules/.astro/data-store.json). When lesson files are moved or
// renamed, that store can hold stale entries — the generated
// .astro/content-modules.mjs then tries to import an index.mdx that no
// longer exists and the build fails with:
//   Rollup failed to resolve import "astro:content-layer-deferred-module?…index.mdx…"
// It doesn't reproduce locally (Astro invalidates on change), but Vercel
// restores the cache between builds, so a deploy right after a rename breaks.
//
// Clearing the store forces a fresh content collection each build. The site's
// content set is tiny, so the lost incremental caching costs nothing. The
// optimized-image cache under node_modules/.astro/assets is left intact.
import { rmSync } from 'node:fs';

for (const path of ['.astro', 'node_modules/.astro/data-store.json']) {
	rmSync(path, { recursive: true, force: true });
}
