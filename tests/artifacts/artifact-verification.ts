import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

console.log('--- Starting Post-Build Production Artifact Verification Suite ---');

const distDir = path.resolve('dist');
const indexHtmlPath = path.join(distDir, 'index.html');

// 1. Invariant: Output directory dist/ and dist/index.html must exist from a prior build.
// Strict failure if dist/ is absent: tests must never silently rebuild or mask missing output.
assert.ok(
  fs.existsSync(distDir),
  'Output directory dist/ must exist. Run npm run build before verifying artifacts.'
);
assert.ok(
  fs.existsSync(indexHtmlPath),
  'dist/index.html must exist. Run npm run build before verifying artifacts.'
);

const indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');
assert.ok(indexHtml.length > 500, 'dist/index.html must not be empty or truncated');
console.log('✓ dist/index.html exists and contains valid markup');

// 2. Verify mandatory unindexed preview protection
assert.match(
  indexHtml,
  /<meta\s+name="robots"\s+content="noindex,\s*nofollow"\s*\/?>/i,
  'Preview build must contain <meta name="robots" content="noindex, nofollow">'
);
console.log('✓ Preview indexing protection confirmed: noindex, nofollow present');

// 3. Verify omission of canonical and OG URLs when PUBLIC_SITE_URL is unset
assert.ok(
  !indexHtml.includes('rel="canonical"'),
  'Canonical link tag must be strictly omitted when site URL is unconfigured'
);
assert.ok(
  !indexHtml.includes('property="og:url"'),
  'og:url meta tag must be strictly omitted when site URL is unconfigured'
);
console.log('✓ Canonical and og:url safety confirmed: absent when unconfigured');

// 4. Verify omission of sitemap files when PUBLIC_SITE_URL is unset
const sitemapIndex = path.join(distDir, 'sitemap-index.xml');
const sitemapZero = path.join(distDir, 'sitemap-0.xml');
assert.ok(
  !fs.existsSync(sitemapIndex),
  'sitemap-index.xml must not exist when site is unconfigured'
);
assert.ok(!fs.existsSync(sitemapZero), 'sitemap-0.xml must not exist when site is unconfigured');
console.log('✓ Sitemap suppression confirmed: XML sitemaps absent');

// 5. Verify exclusion of development fixtures from production output
const devTestDir = path.join(distDir, 'dev-test');
assert.ok(
  !fs.existsSync(devTestDir),
  'dev-test route directory must not exist in production dist/'
);
assert.ok(
  !indexHtml.includes('TestInteractiveIsland'),
  'TestInteractiveIsland must not leak into production index.html'
);
assert.ok(
  !indexHtml.includes('TestMdxNote'),
  'TestMdxNote must not leak into production index.html'
);
console.log('✓ Development fixture isolation confirmed');

// 6. Verify exclusion of DRAFT candidate projects
const projectsDir = path.join(distDir, 'projects');
assert.ok(
  !fs.existsSync(projectsDir),
  'No /projects/ directory may exist while projects remain DRAFT'
);
assert.ok(
  !fs.existsSync(path.join(distDir, 'streamforge')),
  'Draft StreamForge page must not exist'
);
assert.ok(!fs.existsSync(path.join(distDir, 'devforge')), 'Draft DevForge page must not exist');
console.log('✓ Candidate project draft protection confirmed: zero draft project routes');

// 7. Verify exclusion of unapproved writing and résumé routes
const writingDir = path.join(distDir, 'writing');
const resumePdf = path.join(distDir, 'resume.pdf');
assert.ok(!fs.existsSync(writingDir), 'No /writing/ route may exist until articles are verified');
assert.ok(!fs.existsSync(resumePdf), 'No resume.pdf may exist until authentic PDF is approved');
console.log('✓ Unapproved route gating confirmed: writing and résumé routes absent');

// 8. Verify absence of fake personal data, credentials, and placeholder domains
const forbiddenPatterns = [
  'example.com',
  'localhost:4321',
  '127.0.0.1',
  'fake@',
  'test@email.com',
  'Lorem ipsum',
  'Acme Corp',
  '[Awaiting Confirmation]',
];

for (const pattern of forbiddenPatterns) {
  assert.ok(
    !indexHtml.includes(pattern),
    `Production HTML must not contain placeholder pattern "${pattern}"`
  );
}
console.log('✓ Content truth confirmed: zero placeholder patterns detected');

// 9. Verify generated static assets and CSS bundles
const astroAssetsDir = path.join(distDir, '_astro');
assert.ok(fs.existsSync(astroAssetsDir), 'Asset directory dist/_astro/ must exist');

const assetFiles = fs.readdirSync(astroAssetsDir);
const hasCssBundle = assetFiles.some((f) => f.endsWith('.css'));
assert.ok(hasCssBundle, 'Compiled CSS bundle must exist in dist/_astro/');

const faviconPath = path.join(distDir, 'favicon.svg');
assert.ok(fs.existsSync(faviconPath), 'Favicon must exist in dist/favicon.svg');
console.log('✓ Static asset integrity confirmed: CSS bundle and favicon present');

console.log('--- All Production Artifact Verification Tests Passed Cleanly ---');
