import { importLegacyHtml } from '../src/import/legacy-html.mjs';

const results = await importLegacyHtml();

for (const result of results) {
  if (result.skipped) {
    console.log(`skip ${result.slug}: ${result.reason}`);
  } else {
    console.log(`import ${result.slug}`);
  }
}
