import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { getPublishedNavItems, navigationConfig, isNavItemActive } from '../../src/data/navigation';
import { featureFlags } from '../../src/data/featureFlags';

console.log('--- Starting Navigation Safety Suite ---');

// 1. Verify that only published routes are returned for navigation
const publishedItems = getPublishedNavItems();
console.log(`Published navigation items count: ${publishedItems.length}`);

for (const item of publishedItems) {
  assert.equal(
    item.isPublished,
    true,
    `Navigation item "${item.label}" returned by getPublishedNavItems must have isPublished: true`
  );
}
console.log('✓ All returned navigation items have isPublished: true');

// 2. Verify that unbuilt future routes are strictly hidden
const projectsConfig = navigationConfig.find((i) => i.href === '/projects/');
assert.ok(projectsConfig, 'Projects entry must be present in master navigationConfig');
assert.equal(
  projectsConfig.isPublished,
  false,
  'Projects nav link must be isPublished: false until EA-022'
);

const aboutConfig = navigationConfig.find((i) => i.href === '/about/');
assert.ok(aboutConfig, 'About entry must be present in master navigationConfig');
assert.equal(
  aboutConfig.isPublished,
  false,
  'About nav link must be isPublished: false until EA-015'
);

const contactConfig = navigationConfig.find((i) => i.href === '/contact/');
assert.ok(contactConfig, 'Contact entry must be present in master navigationConfig');
assert.equal(
  contactConfig.isPublished,
  false,
  'Contact nav link must be isPublished: false until EA-016'
);
console.log('✓ Unbuilt routes (Projects, About, Contact) are strictly gated from public nav');

// 3. Verify feature flag gating for Writing and Resume
const writingConfig = navigationConfig.find((i) => i.href === '/writing/');
assert.ok(writingConfig, 'Writing entry must be present in navigationConfig');
assert.equal(
  writingConfig.isPublished,
  featureFlags.enableWriting,
  'Writing visibility must strictly mirror featureFlags.enableWriting'
);

const resumeConfig = navigationConfig.find((i) => i.href === '/resume.pdf');
assert.ok(resumeConfig, 'Resume entry must be present in navigationConfig');
assert.equal(
  resumeConfig.isPublished,
  featureFlags.enableResume,
  'Resume visibility must strictly mirror featureFlags.enableResume'
);
console.log('✓ Feature-flagged routes (Writing, Resume) mirror feature flags');

// 4. Verify that every published internal navigation link resolves to an actual page in src/pages
const srcPagesDir = path.resolve('src', 'pages');

for (const item of publishedItems) {
  if (!item.external) {
    // '/' maps to index.astro, '/about/' would map to about.astro or about/index.astro
    const isRoot = item.href === '/';
    const directFile = isRoot
      ? path.join(srcPagesDir, 'index.astro')
      : path.join(srcPagesDir, `${item.href.replace(/^\/|\/$/g, '')}.astro`);
    const indexFile = path.join(srcPagesDir, item.href.replace(/^\/|\/$/g, ''), 'index.astro');

    const exists = fs.existsSync(directFile) || fs.existsSync(indexFile);
    assert.ok(
      exists,
      `Published navigation item "${item.label}" (${item.href}) must correspond to an existing page file in src/pages`
    );
  }
}
console.log('✓ Every published navigation item resolves to a verified file in src/pages');

// 5. Test isNavItemActive active-route logic
assert.equal(isNavItemActive('/', '/'), true, 'Home must be active on /');
assert.equal(isNavItemActive('/', '/projects/'), false, 'Home must not be active on /projects/');
assert.equal(
  isNavItemActive('/about', '/about/'),
  true,
  'Trailing slash normalization in active state'
);
assert.equal(isNavItemActive('/about/', '/about'), true, 'Trailing slash normalization reverse');
assert.equal(isNavItemActive('/about', '/'), false, 'Subpage must not match root as exact page');
console.log('✓ isNavItemActive logic correctly identifies active page');

console.log('--- All Navigation Safety Tests Passed Cleanly ---');
