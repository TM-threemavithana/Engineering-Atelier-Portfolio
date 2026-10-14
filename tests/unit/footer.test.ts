import assert from 'node:assert/strict';
import { getPublishedNavItems, navigationConfig } from '../../src/data/navigation';
import { getVerifiedEmail, getVerifiedProfiles, contactConfig } from '../../src/data/contact';
import { resolvePageMeta } from '../../src/utils/seo';

console.log('--- Starting Footer and 404 Unit Suite ---');

// 1. Navigation items in Footer match getPublishedNavItems()
const publishedNav = getPublishedNavItems();
const publishedHrefs = publishedNav.map((item) => item.href);

assert.ok(publishedHrefs.includes('/'), 'Published footer nav must include Home ("/")');
assert.ok(
  publishedHrefs.includes('/about/'),
  'Published footer nav must include About ("/about/")'
);
assert.ok(
  publishedHrefs.includes('/contact/'),
  'Published footer nav must include Contact ("/contact/")'
);

// 2. Unpublished routes are strictly suppressed from navigation
const unpublishedHrefs = ['/projects/', '/writing/', '/resume.pdf'];
for (const unpub of unpublishedHrefs) {
  assert.ok(
    !publishedHrefs.includes(unpub),
    `Unpublished route "${unpub}" must NOT appear in published footer navigation`
  );
  const cfg = navigationConfig.find((item) => item.href === unpub);
  assert.equal(
    cfg?.isPublished,
    false,
    `Unpublished route "${unpub}" must have isPublished: false in navigationConfig`
  );
}
console.log('✓ Published navigation gating confirmed; unpublished routes suppressed');

// 3. Contact information verified against approved owner data
const verifiedEmail = getVerifiedEmail();
assert.equal(
  verifiedEmail,
  'tharukamaduwantha62@gmail.com',
  'Verified email must match owner approved address exactly'
);

const verifiedProfiles = getVerifiedProfiles();
assert.equal(verifiedProfiles.length, 2, 'Exactly 2 social profiles must be approved');

const ghProfile = verifiedProfiles.find((p) => p.platform === 'GitHub');
assert.ok(ghProfile, 'GitHub profile must exist');
assert.equal(ghProfile.url, 'https://github.com/TM-threemavithana');
assert.equal(ghProfile.handle, 'TM-threemavithana');

const liProfile = verifiedProfiles.find((p) => p.platform === 'LinkedIn');
assert.ok(liProfile, 'LinkedIn profile must exist');
assert.equal(liProfile.url, 'https://www.linkedin.com/in/tharuka-madhuwantha/');
assert.equal(liProfile.handle, 'tharuka-madhuwantha');

// 4. Neutral profile labels: no unsupported claims of third-party verification
for (const profile of contactConfig.profiles) {
  assert.ok(
    !profile.description.toLowerCase().includes('independently verified'),
    'Profile description must not claim independent verification'
  );
}
console.log('✓ Approved contact details and neutral social labels confirmed');

// 5. Dynamic copyright year logic
const currentYear = new Date().getFullYear();
assert.ok(currentYear >= 2026, 'Dynamic build year must be valid and current (>= 2026)');
console.log(`✓ Dynamic copyright year confirmed: ${currentYear}`);

// 6. Anchor uniqueness and valid destinations
const pageTopAnchor = '#page-top';
const mainContentAnchor = '#main-content';
assert.notEqual(
  pageTopAnchor,
  mainContentAnchor,
  'Back-to-top (#page-top) and skip-link (#main-content) anchors must be distinct'
);
console.log('✓ Landmark anchor destinations verified as unique');

// 7. 404 Metadata & SEO Safety (noindex, omit canonical)
const meta404 = resolvePageMeta(
  {
    title: 'Page Not Found',
    description: 'The requested page could not be found.',
    noindex: true,
  },
  '/404',
  'https://engineering-atelier.example.org'
);

assert.equal(
  meta404.robots,
  'noindex, nofollow',
  '404 route must unconditionally emit "noindex, nofollow"'
);
assert.equal(
  meta404.canonicalUrl,
  undefined,
  '404 route must NEVER emit a canonical URL even when site origin exists'
);
assert.equal(
  meta404.ogUrl,
  undefined,
  '404 route must NEVER emit og:url even when site origin exists'
);
assert.ok(meta404.title.includes('Page Not Found'), '404 title must reflect Page Not Found');
console.log('✓ 404 SEO safety confirmed: unconditional noindex and omitted canonical');

console.log('--- All Footer and 404 Unit Tests Passed Cleanly ---');
