import assert from 'node:assert/strict';
import { validateLinkDestination, isRoutePublished } from '../../src/utils/linkSafety';

console.log('--- Starting Link Safety Suite ---');

// 1. Published route validation
assert.equal(isRoutePublished('/'), true, 'Root route "/" must be published');
assert.equal(isRoutePublished('/favicon.svg'), true, 'Favicon must be an approved static asset');
assert.equal(isRoutePublished('/robots.txt'), true, 'Robots.txt must be an approved static asset');
assert.equal(
  isRoutePublished('/projects/'),
  true,
  'Built "/projects/" must be published in EA-022'
);
assert.equal(isRoutePublished('/about/'), true, 'Built "/about/" must be published in EA-015');
assert.equal(isRoutePublished('/contact/'), true, 'Built "/contact/" must be published in EA-016');
assert.equal(isRoutePublished('/writing/'), false, 'Unbuilt "/writing/" must NOT be published');
assert.equal(
  isRoutePublished('/resume.pdf'),
  false,
  'Unapproved "/resume.pdf" must NOT be published'
);
assert.equal(
  isRoutePublished('/projects/streamforge/'),
  false,
  'Unapproved project detail route must NOT be published'
);
console.log('✓ Published route and asset checks confirmed');

// 2. Safe internal destination validation
const rootResult = validateLinkDestination('/');
assert.equal(rootResult.isValid, true, 'Root "/" must be valid');
assert.equal(rootResult.isExternal, false);
assert.equal(rootResult.sanitizedHref, '/');

const projectsResult = validateLinkDestination('/projects/');
assert.equal(projectsResult.isValid, true, 'Published "/projects/" must be valid');
assert.equal(projectsResult.isExternal, false);
assert.equal(projectsResult.sanitizedHref, '/projects/');

const aboutResult = validateLinkDestination('/about/');
assert.equal(aboutResult.isValid, true, 'Published "/about/" must be valid');
assert.equal(aboutResult.isExternal, false);
assert.equal(aboutResult.sanitizedHref, '/about/');

const contactResult = validateLinkDestination('/contact/');
assert.equal(contactResult.isValid, true, 'Published "/contact/" must be valid');
assert.equal(contactResult.isExternal, false);
assert.equal(contactResult.sanitizedHref, '/contact/');

const faviconResult = validateLinkDestination('/favicon.svg');
assert.equal(faviconResult.isValid, true);
assert.equal(faviconResult.sanitizedHref, '/favicon.svg');
console.log('✓ Safe internal links validated successfully');

// 3. Prohibited unbuilt internal routes
const unbuiltRoutes = [
  '/writing/',
  '/resume.pdf',
  '/projects/streamforge/',
  '/projects/currency-auth-research/',
];
for (const route of unbuiltRoutes) {
  const result = validateLinkDestination(route);
  assert.equal(
    result.isValid,
    false,
    `Unbuilt route "${route}" must be rejected by validateLinkDestination`
  );
  assert.ok(result.error?.includes('not yet published'));
}
console.log('✓ Prohibited unbuilt routes rejected with descriptive errors');

// 4. In-page anchor validation
const validAnchor = validateLinkDestination('#main-content');
assert.equal(validAnchor.isValid, true);
assert.equal(validAnchor.isAnchor, true);
assert.equal(validAnchor.sanitizedHref, '#main-content');

const pageTopAnchor = validateLinkDestination('#page-top');
assert.equal(pageTopAnchor.isValid, true);
assert.equal(pageTopAnchor.isAnchor, true);
assert.equal(pageTopAnchor.sanitizedHref, '#page-top');

const emptyAnchor = validateLinkDestination('#');
assert.equal(emptyAnchor.isValid, false, 'Bare "#" must be rejected');
console.log('✓ In-page anchor validation passed');

// 5. External HTTPS link validation
const externalResult = validateLinkDestination('https://github.com');
assert.equal(externalResult.isValid, true);
assert.equal(externalResult.isExternal, true);
assert.equal(externalResult.sanitizedHref, 'https://github.com');

const malformedUrl = validateLinkDestination('https://');
assert.equal(malformedUrl.isValid, false, 'Malformed URL must be rejected');
console.log('✓ External URL validation passed');

// 6. Mailto link validation
const mailtoResult = validateLinkDestination('mailto:engineer@example.org');
assert.equal(mailtoResult.isValid, true);
assert.equal(mailtoResult.isMailto, true);
assert.equal(mailtoResult.sanitizedHref, 'mailto:engineer@example.org');

const invalidMailto = validateLinkDestination('mailto:not-an-email');
assert.equal(invalidMailto.isValid, false, 'Invalid mailto must be rejected');
console.log('✓ Mailto validation passed');

// 7. Security: Dangerous protocol rejection
const dangerousProtocols = [
  'javascript:alert(1)',
  'JAVASCRIPT:void(0)',
  'data:text/html,<script>alert(1)</script>',
  'vbscript:msgbox(1)',
  'file:///etc/passwd',
];
for (const dangerous of dangerousProtocols) {
  const result = validateLinkDestination(dangerous);
  assert.equal(result.isValid, false, `Dangerous scheme "${dangerous}" must be rejected`);
  assert.ok(result.error?.includes('Unsafe link protocol rejected'));
}
console.log('✓ Dangerous protocol rejection confirmed');

// 8. Security: Protocol-relative URL rejection
const protocolRelative = validateLinkDestination('//malicious-domain.com/steal');
assert.equal(
  protocolRelative.isValid,
  false,
  'Protocol-relative URL "//..." must be strictly rejected'
);
assert.ok(protocolRelative.error?.includes('Protocol-relative URL rejected'));
console.log('✓ Protocol-relative URL rejection confirmed');

// 9. Null / empty / whitespace validation
assert.equal(validateLinkDestination('').isValid, false);
assert.equal(validateLinkDestination('   ').isValid, false);
assert.equal(validateLinkDestination(undefined).isValid, false);
assert.equal(validateLinkDestination(null).isValid, false);
console.log('✓ Empty/null input rejection confirmed');

console.log('--- All Link Safety Tests Passed Cleanly ---');
