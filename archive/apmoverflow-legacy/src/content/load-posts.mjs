import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

import { paths, site } from '../site.config.mjs';
import { validatePostManifest } from './manifest.mjs';

export function postOutputPath(post) {
  return path.join(paths.root, post.manifest.slug, 'index.html');
}

export function postCanonicalUrl(post) {
  return `${site.url}/${post.manifest.slug}/`;
}

export async function loadMarkdownPosts() {
  const manifestFiles = (await readdir(paths.contentRoot))
    .filter((file) => file.endsWith('.json'))
    .sort();

  if (manifestFiles.length === 0) {
    throw new Error(`No post manifests found in ${paths.contentRoot}`);
  }

  return Promise.all(
    manifestFiles.map(async (file) => {
      const manifestPath = path.join(paths.contentRoot, file);
      const raw = JSON.parse(await readFile(manifestPath, 'utf8'));
      const manifest = validatePostManifest(raw, manifestPath);
      const sourcePath = path.join(paths.contentRoot, manifest.source);
      const sourceMarkdown = await readFile(sourcePath, 'utf8');

      return {
        manifest,
        manifestPath,
        sourcePath,
        sourceMarkdown,
      };
    })
  );
}
