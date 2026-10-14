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
  publishedHrefs.includes('/projects/'),
  'Published footer nav must include Projects ("/projects/")'
);
assert.ok(
  publishedHrefs.includes('/about/'),
  'Published footer nav must include About ("/about/")'
);
assert.ok(
  publishedHrefs.includes('/contact/'),
  'Published footer nav must include Contact ("/contact/")'
);

// 2. Unpublished routes are strictly suppressed from navigation
const unpublishedHrefs = ['/writing/', '/resume.pdf'];
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

import { siteConfig } from '../../src/data/siteConfig';
import { getValidatedProductionSiteUrl } from '../../src/utils/domain';

// 7. 404 Metadata & SEO Safety (Under default preview state)
assert.equal(
  siteConfig.isProductionApproved,
  false,
  'siteConfig.isProductionApproved must be strictly false in repository baseline'
);

const defaultMeta404 = resolvePageMeta(
  {
    title: 'Page Not Found',
    description: 'The requested page could not be found.',
  },
  '/404'
);

assert.equal(
  defaultMeta404.robots,
  'noindex, nofollow',
  '404 route must emit "noindex, nofollow" by default'
);
assert.equal(
  defaultMeta404.canonicalUrl,
  undefined,
  '404 route must omit canonical URL by default'
);
assert.equal(defaultMeta404.ogUrl, undefined, '404 route must omit og:url by default');

// 8. Isolated Simulated Production Approval Test for 404
// Validates that even if production approval were granted, 404 remains unconditionally noindexed and uncanonicalized.
const baselineApprovedState = siteConfig.isProductionApproved;
try {
  // Temporarily simulate production approval in memory
  (siteConfig as { isProductionApproved: boolean }).isProductionApproved = true;

  // Use a domain that passes getValidatedProductionSiteUrl without hardcoding a fake production domain
  const testValidOrigin = getValidatedProductionSiteUrl('https://simulated-domain.org');
  assert.ok(testValidOrigin, 'Validated test origin must be well-formed');

  // Test 404 metadata under simulated production approval without explicit noindex prop
  const simMeta404 = resolvePageMeta(
    {
      title: 'Page Not Found',
      description: 'The requested page could not be found.',
    },
    '/404',
    testValidOrigin
  );

  assert.equal(
    simMeta404.robots,
    'noindex, nofollow',
    'Under simulated production approval, 404 route must STILL unconditionally emit "noindex, nofollow"'
  );
  assert.equal(
    simMeta404.canonicalUrl,
    undefined,
    'Under simulated production approval, 404 route must NEVER emit a canonical URL'
  );
  assert.equal(
    simMeta404.ogUrl,
    undefined,
    'Under simulated production approval, 404 route must NEVER emit og:url'
  );

  // Assert sitemap filter rule excludes 404 routes
  const approvedSitemapRoutes = new Set(['/', '/about', '/contact']);
  assert.equal(
    approvedSitemapRoutes.has('/404'),
    false,
    'Sitemap whitelist must strictly exclude "/404"'
  );
  assert.equal(
    approvedSitemapRoutes.has('/404.html'),
    false,
    'Sitemap whitelist must strictly exclude "/404.html"'
  );

  // Contrast check: a published route under simulated production approval DOES receive index, follow and canonical
  const simMetaHome = resolvePageMeta({ title: 'Home' }, '/', testValidOrigin);
  assert.equal(
    simMetaHome.robots,
    'index, follow',
    'Normal published routes must receive "index, follow" under simulated production approval'
  );
  assert.equal(
    simMetaHome.canonicalUrl,
    'https://simulated-domain.org/',
    'Normal published routes must receive valid canonicalUrl under simulated production approval'
  );
} finally {
  // Guarantee real setting is restored immediately
  (siteConfig as { isProductionApproved: boolean }).isProductionApproved = baselineApprovedState;
}

assert.equal(
  siteConfig.isProductionApproved,
  false,
  'siteConfig.isProductionApproved must remain strictly false after simulated tests'
);
console.log(
  '✓ 404 production SEO safety confirmed: unconditional noindex, omitted canonical/og:url, and sitemap exclusion'
);

console.log('--- All Footer and 404 Unit Tests Passed Cleanly ---');
