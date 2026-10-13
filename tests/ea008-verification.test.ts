import assert from 'node:assert/strict';
import { getValidatedProductionSiteUrl } from '../src/utils/domain';
import { normalizePathname, formatCanonicalUrl, resolvePageMeta } from '../src/utils/seo';
import { featureFlags } from '../src/data/featureFlags';
import { siteConfig } from '../src/data/siteConfig';

console.log('--- Starting EA-008 Verification Suite ---');

// 1. Test Domain Validator
console.log('Testing getValidatedProductionSiteUrl()...');
assert.equal(getValidatedProductionSiteUrl('https://portfolio.engineering'), 'https://portfolio.engineering');
assert.equal(getValidatedProductionSiteUrl('http://sub.domain.org'), 'http://sub.domain.org');
assert.equal(getValidatedProductionSiteUrl('http://localhost:4321'), undefined, 'Should reject localhost');
assert.equal(getValidatedProductionSiteUrl('https://127.0.0.1:8080'), undefined, 'Should reject 127.0.0.1');
assert.equal(getValidatedProductionSiteUrl('https://example.com'), undefined, 'Should reject example.com');
assert.equal(getValidatedProductionSiteUrl('https://test.local'), undefined, 'Should reject .local');
assert.equal(getValidatedProductionSiteUrl('https://internal.test'), undefined, 'Should reject .test');
assert.equal(getValidatedProductionSiteUrl(''), undefined, 'Should reject empty string');
assert.equal(getValidatedProductionSiteUrl(undefined), undefined, 'Should reject undefined');
console.log('✓ Domain validator passed all tests');

// 2. Test normalizePathname()
console.log('Testing normalizePathname()...');
assert.equal(normalizePathname('/'), '/');
assert.equal(normalizePathname('/projects/'), '/projects');
assert.equal(normalizePathname('/projects///deep/'), '/projects/deep');
assert.equal(normalizePathname('/case-study?utm=123'), '/case-study');
assert.equal(normalizePathname('/about#timeline'), '/about');
assert.equal(normalizePathname('/articles?sort=date#comments'), '/articles');
console.log('✓ Pathname normalization passed all tests');

// 3. Test formatCanonicalUrl()
console.log('Testing formatCanonicalUrl()...');
assert.equal(formatCanonicalUrl('/projects', undefined), undefined, 'Must omit canonical when origin is undefined');
assert.equal(formatCanonicalUrl('/projects', 'http://localhost:4321'), undefined, 'Must omit canonical on rejected origin');
assert.equal(
  formatCanonicalUrl('/projects/', 'https://portfolio.engineering'),
  'https://portfolio.engineering/projects'
);
assert.equal(
  formatCanonicalUrl('/projects?sort=date#ref', 'https://portfolio.engineering'),
  'https://portfolio.engineering/projects'
);

// Test canonicalOverride safety
assert.equal(
  formatCanonicalUrl('/projects', 'https://portfolio.engineering', 'https://malicious.com/phish'),
  undefined,
  'Must reject unapproved external domain in canonicalOverride'
);
assert.equal(
  formatCanonicalUrl('/projects', 'https://portfolio.engineering', '/verified-target'),
  'https://portfolio.engineering/verified-target',
  'Must accept safe relative canonicalOverride'
);
assert.equal(
  formatCanonicalUrl('/projects', 'https://portfolio.engineering', 'https://portfolio.engineering/exact-match/'),
  'https://portfolio.engineering/exact-match',
  'Must accept same-origin canonicalOverride'
);
console.log('✓ Canonical URL formatting passed all tests');

// 4. Test resolvePageMeta()
console.log('Testing resolvePageMeta()...');
// Unconfigured site URL (default development)
const defaultMeta = resolvePageMeta({}, '/');
assert.equal(defaultMeta.title, siteConfig.defaultTitle);
assert.equal(defaultMeta.robots, 'noindex, nofollow', 'Default development build must be noindex, nofollow');
assert.equal(defaultMeta.canonicalUrl, undefined, 'Canonical URL must be omitted when site is unconfigured');
assert.equal(defaultMeta.ogUrl, undefined, 'OG URL must be omitted when site is unconfigured');

// Custom page title
const customMeta = resolvePageMeta({ title: 'Baseline Verification' }, '/');
assert.equal(customMeta.title, 'Baseline Verification | Engineering Atelier');
assert.equal(customMeta.robots, 'noindex, nofollow');

// Configured valid site URL
const configuredMeta = resolvePageMeta(
  { title: 'Projects' },
  '/projects',
  'https://portfolio.engineering'
);
assert.equal(configuredMeta.canonicalUrl, 'https://portfolio.engineering/projects');
assert.equal(configuredMeta.ogUrl, 'https://portfolio.engineering/projects');
assert.equal(configuredMeta.robots, 'noindex, nofollow', 'Still noindex because isProductionApproved is false');

console.log('✓ Page metadata resolution passed all tests');

// 5. Test Feature Flags
console.log('Testing feature flags...');
assert.equal(featureFlags.enableResume, false, 'enableResume must be false');
assert.equal(featureFlags.enableWriting, false, 'enableWriting must be false');
assert.equal(featureFlags.enableArchitectureExplorer, false, 'enableArchitectureExplorer must be false');
assert.equal(featureFlags.enableProjectFilter, false, 'enableProjectFilter must be false');
assert.equal(featureFlags.enableContactForm, false, 'enableContactForm must be false');
console.log('✓ Feature flags verified strictly defensive');

console.log('--- All EA-008 Verification Tests Passed Cleanly ---');
