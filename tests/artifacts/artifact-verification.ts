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

const devPrimitivesDir = path.join(distDir, 'dev-primitives');
assert.ok(
  !fs.existsSync(devPrimitivesDir),
  'dev-primitives route directory must not exist in production dist/'
);
assert.ok(
  !indexHtml.includes('PrimitivesShowcase'),
  'PrimitivesShowcase must not leak into production index.html'
);
assert.ok(
  !indexHtml.includes('EA-012 UI PRIMITIVES'),
  'Showcase eyebrow must not leak into production index.html'
);
assert.ok(
  !indexHtml.includes('Processing Order'),
  'Showcase test button text must not leak into production index.html'
);
console.log('✓ Development fixture isolation confirmed (dev-test & dev-primitives)');

// 6. Verify exclusion of DRAFT candidate projects (EA-019)
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
assert.ok(
  !fs.existsSync(path.join(distDir, 'java-task-api')),
  'Draft Java Task API page must not exist'
);
assert.ok(
  !fs.existsSync(path.join(distDir, 'currency-auth-research')),
  'Draft Currency Auth page must not exist'
);
assert.ok(
  !fs.existsSync(path.join(distDir, 'currency-auth')),
  'Draft Currency Auth page must not exist'
);
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

// 10. Verify EA-011 Navigation and Header Production Markup
assert.ok(
  indexHtml.includes('<header role="banner"'),
  'dist/index.html must contain header banner'
);
assert.ok(
  indexHtml.includes('Engineering Atelier — Home'),
  'Wordmark accessible text must be present'
);
assert.ok(
  indexHtml.includes('<nav aria-label="Main Navigation"'),
  'Desktop navigation landmark must be present'
);

// Now that About is published alongside Home, mobile disclosure toggle is rendered for mobile viewports
assert.ok(
  indexHtml.includes('<details class="mobile-nav-details'),
  'Mobile disclosure trigger must be present when multiple routes (Home and About) are published'
);
assert.ok(
  !indexHtml.includes('aria-modal'),
  'Non-modal disclosure must strictly NOT contain aria-modal'
);

// Extract all internal links inside <nav> tags
const navMatches = indexHtml.match(/<nav[^>]*>([\s\S]*?)<\/nav>/g) || [];
assert.ok(navMatches.length >= 1, 'At least desktop navigation landmark must be present');

for (const navBlock of navMatches) {
  const hrefMatches = [...navBlock.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
  for (const href of hrefMatches) {
    if (href.startsWith('/')) {
      // Map to physical file in dist/
      const targetFile =
        href === '/'
          ? path.join(distDir, 'index.html')
          : path.join(distDir, href.replace(/^\/|\/$/g, ''), 'index.html');
      assert.ok(
        fs.existsSync(targetFile),
        `Navigation link "${href}" must resolve to an existing generated file: ${targetFile}`
      );
    }
  }
}

// Assert unbuilt or disabled routes are NOT present in navigation
const forbiddenNavRoutes = ['/projects/', '/writing/', '/resume.pdf'];
for (const forbiddenRoute of forbiddenNavRoutes) {
  assert.ok(
    !indexHtml.includes(`href="${forbiddenRoute}"`),
    `Unbuilt or disabled route "${forbiddenRoute}" must not be linked in production navigation`
  );
}
assert.ok(
  indexHtml.includes('href="/about/"'),
  'Published route "/about/" must be linked in production navigation'
);
assert.ok(
  indexHtml.includes('href="/contact/"'),
  'Published route "/contact/" must be linked in production navigation'
);

// Assert only the current page has aria-current="page"
const aTagsWithAriaCurrent = indexHtml.match(/<a\b[^>]*\baria-current="page"[^>]*>/gi) || [];
assert.ok(aTagsWithAriaCurrent.length > 0, 'Current page must have aria-current="page"');
for (const tag of aTagsWithAriaCurrent) {
  const hrefMatch = tag.match(/href="([^"]+)"/i);
  assert.ok(hrefMatch, 'Tag with aria-current="page" must have an href attribute');
  assert.equal(
    hrefMatch[1],
    '/',
    'Only the exact current page ("/") must receive aria-current="page" on index.html'
  );
}
console.log(
  '✓ Header and Navigation production integrity confirmed: zero 404 links, semantic disclosure, correct aria-current'
);

// 11. Verify EA-013 Homepage Hero Production Markup
const h1Elements = indexHtml.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi) || [];
assert.equal(h1Elements.length, 1, 'dist/index.html must contain exactly one <h1> element');
assert.match(
  h1Elements[0],
  /Building reliable systems\.\s+Creating meaningful experiences\./,
  'H1 must contain exact approved headline'
);

// Verify overline and positioning text
assert.match(indexHtml, /Software Engineer/, 'dist/index.html must contain overline role');
assert.match(
  indexHtml,
  /Software Engineer focused on Java, Scala, backend architecture, distributed systems, and thoughtful full-stack development\./,
  'dist/index.html must contain exact approved positioning text'
);

// Verify Hero CTA destination and label
assert.match(
  indexHtml,
  /<a[^>]*href="#architecture-blueprint"[^>]*>[\s\S]*?Explore the Blueprint[\s\S]*?<\/a>/,
  'Hero CTA must link to #architecture-blueprint with label "Explore the Blueprint"'
);

// Verify target anchor exists on blueprint card with accessible attributes
assert.match(
  indexHtml,
  /<div[^>]*id="architecture-blueprint"[^>]*tabindex="-1"[^>]*role="region"[^>]*>/,
  'Blueprint target must exist with id="architecture-blueprint", tabindex="-1", and role="region"'
);

// Verify honest conceptual modeling and absence of fabricated claims
assert.ok(indexHtml.includes('Conceptual Model'), 'Blueprint must be labeled "Conceptual Model"');
assert.ok(
  indexHtml.includes('Illustrative Architecture'),
  'Blueprint status must be "Illustrative Architecture"'
);
assert.ok(!indexHtml.includes('In Clearance'), 'Blueprint must not contain "In Clearance"');
assert.ok(
  !indexHtml.includes('P99'),
  'Blueprint must strictly not contain "P99" or latency metrics'
);
assert.ok(
  !indexHtml.includes('2.0ms') && !indexHtml.includes('1.2ms'),
  'Blueprint must strictly not contain fabricated latency numbers'
);

// Verify accessible description and SVG vector labels
assert.match(
  indexHtml,
  /id="blueprint-summary"[^>]*class="sr-only"/,
  'Blueprint must contain screen-reader accessible summary'
);
const diagramLabels = [
  'Client (gRPC)',
  'Buffered Channel',
  'Pipeline Handler',
  'Consensus Log',
  'Storage Engine',
  'Peer Replica',
];
for (const label of diagramLabels) {
  assert.ok(indexHtml.includes(label), `Blueprint must render readable vector label: "${label}"`);
}
console.log(
  '✓ Homepage Hero production integrity confirmed: single H1, approved copy, valid in-page CTA, accessible vector diagram, zero fabricated metrics'
);

// 12. Verify EA-014 Capabilities, Approach, and Featured Work Graceful Omission
// A. Capabilities Section Integrity
assert.match(
  indexHtml,
  /<section[^>]*id="capabilities"[^>]*aria-labelledby="capabilities-heading"[^>]*>/,
  'dist/index.html must contain <section id="capabilities" aria-labelledby="capabilities-heading">'
);
assert.match(
  indexHtml,
  /<h2[^>]*id="capabilities-heading"[^>]*>[\s\S]*?Core Engineering Capabilities[\s\S]*?<\/h2>/,
  'dist/index.html must contain <h2> with id="capabilities-heading" and title "Core Engineering Capabilities"'
);

const expectedCapabilityTitles = [
  'Backend Engineering &amp; APIs',
  'Distributed Systems &amp; Cloud Concepts',
  'Full-Stack Development',
];
for (const title of expectedCapabilityTitles) {
  assert.ok(indexHtml.includes(title), `dist/index.html must contain capability title: "${title}"`);
}

// B. Engineering Approach Section Integrity
assert.match(
  indexHtml,
  /<section[^>]*id="approach"[^>]*aria-labelledby="approach-heading"[^>]*>/,
  'dist/index.html must contain <section id="approach" aria-labelledby="approach-heading">'
);
assert.match(
  indexHtml,
  /<h2[^>]*id="approach-heading"[^>]*>[\s\S]*?Engineering Approach[\s\S]*?<\/h2>/,
  'dist/index.html must contain <h2> with id="approach-heading" and title "Engineering Approach"'
);

const expectedApproachStages = [
  'Understand',
  'Model &amp; Design',
  'Build &amp; Test',
  'Verify &amp; Maintain',
];
for (const stage of expectedApproachStages) {
  assert.ok(indexHtml.includes(stage), `dist/index.html must contain approach stage: "${stage}"`);
}

// C. Strict Draft Gating & Graceful Empty Omission for Featured Work
assert.ok(
  !indexHtml.includes('id="featured-work"'),
  'Featured Work section must be gracefully omitted when 0 verified projects exist'
);
assert.ok(
  !indexHtml.includes('Featured Engineering Projects'),
  'Featured Engineering Projects heading must be absent when 0 verified projects exist'
);
assert.ok(
  !indexHtml.includes('StreamForge: Distributed Raft Log Engine'),
  'Draft candidate StreamForge must strictly not appear in public index.html'
);
assert.ok(
  !indexHtml.includes('DevForge: Scala Developer Orchestration CLI'),
  'Draft candidate DevForge must strictly not appear in public index.html'
);

// D. Heading IDs and aria-labelledby consistency check
const sectionsWithLabelledBy = [
  ...indexHtml.matchAll(/<section[^>]*\baria-labelledby="([^"]+)"[^>]*>/gi),
];
assert.ok(
  sectionsWithLabelledBy.length >= 3,
  'At least 3 labelled sections must exist (hero, capabilities, approach)'
);
for (const match of sectionsWithLabelledBy) {
  const headingId = match[1];
  assert.ok(
    indexHtml.includes(`id="${headingId}"`),
    `Section aria-labelledby="${headingId}" must correspond to an element with id="${headingId}"`
  );
}
console.log(
  '✓ Capabilities and Engineering Approach confirmed; Featured Work gracefully omitted; aria-labelledby references validated'
);

// 13. Verify EA-015 About Page Production Artifact Integrity
const aboutHtmlPath = path.join(distDir, 'about', 'index.html');
assert.ok(
  fs.existsSync(aboutHtmlPath),
  'dist/about/index.html must exist in production build output'
);
const aboutHtml = fs.readFileSync(aboutHtmlPath, 'utf8');

// A. Exactly Single H1 Element
const aboutH1Matches = [...aboutHtml.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)];
assert.equal(
  aboutH1Matches.length,
  1,
  `dist/about/index.html must contain exactly one <h1> element, found ${aboutH1Matches.length}`
);
assert.ok(
  aboutHtml.includes('Disciplined engineering. Systems built with intentionality.'),
  'dist/about/index.html must contain approved H1 title copy'
);
assert.ok(
  aboutHtml.includes('Software Engineer focused on Java, Scala, backend architecture'),
  'dist/about/index.html must contain approved positioning copy'
);

// B. Engineering Values Section & 3 Approved Principles
assert.match(
  aboutHtml,
  /<section[^>]*id="values"[^>]*aria-labelledby="values-heading"[^>]*>/,
  'dist/about/index.html must contain <section id="values" aria-labelledby="values-heading">'
);
assert.match(
  aboutHtml,
  /<h2[^>]*id="values-heading"[^>]*>[\s\S]*?Engineering Values[\s\S]*?<\/h2>/,
  'dist/about/index.html must contain <h2> with id="values-heading" and title "Engineering Values"'
);

const expectedValues = [
  'Understand Before Solving',
  'Design for Maintainability',
  'Verify Through Empirical Testing',
];
for (const val of expectedValues) {
  assert.ok(
    aboutHtml.includes(val),
    `dist/about/index.html must contain engineering value: "${val}"`
  );
}

// C. Technical Familiarity Section & 3 Honest Categories
assert.match(
  aboutHtml,
  /<section[^>]*id="familiarity"[^>]*aria-labelledby="familiarity-heading"[^>]*>/,
  'dist/about/index.html must contain <section id="familiarity" aria-labelledby="familiarity-heading">'
);
assert.match(
  aboutHtml,
  /<h2[^>]*id="familiarity-heading"[^>]*>[\s\S]*?Technical Familiarity[\s\S]*?<\/h2>/,
  'dist/about/index.html must contain <h2> with id="familiarity-heading" and title "Technical Familiarity"'
);

const expectedFamiliarityTiers = ['Primary Focus', 'Working Knowledge', 'Actively Exploring'];
for (const tier of expectedFamiliarityTiers) {
  assert.ok(
    aboutHtml.includes(tier),
    `dist/about/index.html must contain familiarity tier: "${tier}"`
  );
}

// Ensure no percentage meters or arbitrary scores in production About page
assert.ok(
  !/\d+%\s*(mastery|proficiency|skill)/i.test(aboutHtml),
  'dist/about/index.html must not contain arbitrary percentage scores'
);

// D. Timeline Graceful Omission (Zero Unverified Milestones)
assert.ok(
  !aboutHtml.includes('id="timeline"'),
  'Timeline section must be gracefully omitted from dist/about/index.html when 0 verified milestones exist'
);
assert.ok(
  !aboutHtml.includes('Experience &amp; Education'),
  'Timeline heading must be absent from dist/about/index.html when 0 verified milestones exist'
);

// E. Published Navigation Item Checks (About & Contact appear in site header)
assert.ok(aboutHtml.includes('href="/about/"'), 'Site header on About page must link to /about/');
assert.ok(indexHtml.includes('href="/about/"'), 'Site header on Homepage must link to /about/');
assert.ok(
  aboutHtml.includes('href="/contact/"'),
  'Site header on About page must link to published /contact/'
);
assert.ok(
  indexHtml.includes('href="/contact/"'),
  'Site header on Homepage must link to published /contact/'
);

// F. Heading IDs and aria-labelledby consistency check on About page
const aboutSectionsWithLabelledBy = [
  ...aboutHtml.matchAll(/<section[^>]*\baria-labelledby="([^"]+)"[^>]*>/gi),
];
assert.ok(
  aboutSectionsWithLabelledBy.length >= 3,
  'At least 3 labelled sections must exist on About page (about-intro, values, familiarity)'
);
for (const match of aboutSectionsWithLabelledBy) {
  const headingId = match[1];
  assert.ok(
    aboutHtml.includes(`id="${headingId}"`),
    `Section aria-labelledby="${headingId}" in dist/about/index.html must correspond to element with id="${headingId}"`
  );
}

console.log(
  '✓ About page production integrity confirmed: single H1, 3 values, 3 familiarity tiers, timeline gracefully omitted, aria-labelledby consistent'
);

// 14. Verify EA-016 Contact Page Production Artifact Integrity
const contactHtmlPath = path.join(distDir, 'contact', 'index.html');
assert.ok(
  fs.existsSync(contactHtmlPath),
  'dist/contact/index.html must exist in production build output'
);
const contactHtml = fs.readFileSync(contactHtmlPath, 'utf8');

// A. Exactly Single H1 Element
const contactH1Matches = [...contactHtml.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)];
assert.equal(
  contactH1Matches.length,
  1,
  `dist/contact/index.html must contain exactly one <h1> element, found ${contactH1Matches.length}`
);
assert.ok(
  contactHtml.includes('Let&#39;s build reliable software together.') ||
    contactHtml.includes("Let's build reliable software together."),
  'dist/contact/index.html must contain approved H1 headline copy'
);

// B. Exact Verified Contact Details Present
assert.ok(
  contactHtml.includes('tharukamaduwantha62@gmail.com'),
  'dist/contact/index.html must visibly display the approved email address'
);
assert.ok(
  contactHtml.includes('href="mailto:tharukamaduwantha62@gmail.com"'),
  'dist/contact/index.html must contain valid mailto link to approved email'
);
assert.ok(
  contactHtml.includes('href="https://github.com/TM-threemavithana"'),
  'dist/contact/index.html must contain link to exact approved GitHub profile'
);
assert.ok(
  contactHtml.includes('href="https://www.linkedin.com/in/tharuka-madhuwantha/"'),
  'dist/contact/index.html must contain link to exact approved LinkedIn profile'
);

// C. External Link Security Attributes
assert.ok(
  contactHtml.includes('rel="noopener noreferrer"'),
  'External profile links must contain rel="noopener noreferrer"'
);
assert.ok(
  contactHtml.includes('target="_blank"'),
  'External profile links must contain target="_blank"'
);

// D. CopyEmail Island & Accessibility Live Region
assert.ok(
  contactHtml.includes('aria-live="polite"') && contactHtml.includes('role="status"'),
  'dist/contact/index.html must contain accessible aria-live status live region for CopyEmail'
);

// E. Heading IDs and aria-labelledby consistency check on Contact page
const contactSectionsWithLabelledBy = [
  ...contactHtml.matchAll(/<section[^>]*\baria-labelledby="([^"]+)"[^>]*>/gi),
];
assert.ok(
  contactSectionsWithLabelledBy.length >= 2,
  'At least 2 labelled sections must exist on Contact page (contact-hero, direct-contact)'
);
for (const match of contactSectionsWithLabelledBy) {
  const headingId = match[1];
  assert.ok(
    contactHtml.includes(`id="${headingId}"`),
    `Section aria-labelledby="${headingId}" in dist/contact/index.html must correspond to element with id="${headingId}"`
  );
}

// F. Negative Truth Checks: Zero Placeholder or Invented Strings
const forbiddenPlaceholders = ['example.com', 'your-name', 'FILL_IN', '123-456-7890'];
for (const ph of forbiddenPlaceholders) {
  assert.ok(
    !contactHtml.toLowerCase().includes(ph.toLowerCase()),
    `dist/contact/index.html must not contain placeholder string "${ph}"`
  );
}

// G. Neutral Social Profile Labelling (EA-018)
assert.ok(
  contactHtml.includes('PROFESSIONAL PROFILES'),
  'dist/contact/index.html must contain neutral overline "PROFESSIONAL PROFILES"'
);
assert.ok(
  !contactHtml.includes('VERIFIED PROFILES'),
  'dist/contact/index.html must NOT contain misleading "VERIFIED PROFILES" overline'
);

console.log(
  '✓ Contact page production integrity confirmed: single H1, exact verified email/social links, no-JS mailto, aria-live CopyEmail island, neutral profile labelling, zero placeholders'
);

// 15. Verify EA-017 Footer and Branded 404 Production Artifact Integrity
const p404HtmlPath = path.join(distDir, '404.html');
assert.ok(fs.existsSync(p404HtmlPath), 'dist/404.html must exist in production build output');
const p404Html = fs.readFileSync(p404HtmlPath, 'utf8');

// A. Exactly Single H1 Element on 404 page
const p404H1Matches = [...p404Html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)];
assert.equal(
  p404H1Matches.length,
  1,
  `dist/404.html must contain exactly one <h1> element, found ${p404H1Matches.length}`
);
assert.ok(
  p404Html.includes('Page Not Found') || p404Html.includes('Route Not Found'),
  'dist/404.html must contain approved H1 error heading'
);

// B. 404 Robots & Canonical Security
assert.ok(
  p404Html.includes('<meta name="robots" content="noindex, nofollow"'),
  'dist/404.html must contain robots directive "noindex, nofollow"'
);
assert.ok(
  !p404Html.includes('<link rel="canonical"'),
  'dist/404.html must NOT contain a canonical link tag'
);

// C. 404 Recovery Actions (Return Home & Published Pages Only)
assert.ok(
  p404Html.includes('href="/"'),
  'dist/404.html must contain prominent recovery link to homepage "/"'
);
assert.ok(
  p404Html.includes('href="/about/"'),
  'dist/404.html must contain recovery link to published "/about/"'
);
assert.ok(
  p404Html.includes('href="/contact/"'),
  'dist/404.html must contain recovery link to published "/contact/"'
);

// D. 404 Gating: Zero Links to Unpublished Routes
const prohibited404Links = ['href="/projects/"', 'href="/writing/"', 'href="/resume.pdf"'];
for (const link of prohibited404Links) {
  assert.ok(
    !p404Html.includes(link),
    `dist/404.html must NOT contain link to unpublished route: ${link}`
  );
}

// E. Global Landmark Structure across ALL Pages (Home, About, Contact, 404)
const allPageEntries = [
  { name: 'Home', path: path.join(distDir, 'index.html') },
  { name: 'About', path: path.join(distDir, 'about', 'index.html') },
  { name: 'Contact', path: path.join(distDir, 'contact', 'index.html') },
  { name: '404', path: path.join(distDir, '404.html') },
];

const currentYearStr = String(new Date().getFullYear());

for (const page of allPageEntries) {
  assert.ok(fs.existsSync(page.path), `${page.name} (${page.path}) must exist`);
  const html = fs.readFileSync(page.path, 'utf8');

  // Exactly one header role="banner"
  const headerCount = (html.match(/<header[^>]*\brole="banner"[^>]*>/gi) || []).length;
  assert.equal(headerCount, 1, `${page.name} must contain exactly one <header role="banner">`);

  // Exactly one main id="main-content"
  const mainCount = (html.match(/<main[^>]*\bid="main-content"[^>]*>/gi) || []).length;
  assert.equal(mainCount, 1, `${page.name} must contain exactly one <main id="main-content">`);

  // Exactly one footer role="contentinfo"
  const footerCount = (html.match(/<footer[^>]*\brole="contentinfo"[^>]*>/gi) || []).length;
  assert.equal(footerCount, 1, `${page.name} must contain exactly one <footer role="contentinfo">`);

  // Distinct skip link (#main-content) and back-to-top (#page-top) anchors
  assert.ok(
    html.includes('href="#main-content"'),
    `${page.name} must contain skip link targeting #main-content`
  );
  assert.ok(
    html.includes('id="main-content"'),
    `${page.name} must contain element with id="main-content"`
  );
  assert.ok(
    html.includes('href="#page-top"'),
    `${page.name} must contain back-to-top link targeting #page-top`
  );
  assert.ok(html.includes('id="page-top"'), `${page.name} must contain element with id="page-top"`);

  // Footer Navigation Landmark & Items
  assert.ok(
    html.includes('aria-label="Footer Navigation"'),
    `${page.name} must contain <nav aria-label="Footer Navigation">`
  );
  assert.ok(
    html.includes('Built with Astro &amp; TypeScript') ||
      html.includes('Built with Astro & TypeScript'),
    `${page.name} must contain technology attribution`
  );
  assert.ok(
    html.includes(currentYearStr),
    `${page.name} footer must contain dynamic current copyright year "${currentYearStr}"`
  );

  // Footer social links
  assert.ok(
    html.includes('href="mailto:tharukamaduwantha62@gmail.com"'),
    `${page.name} footer must contain approved mailto link`
  );
  assert.ok(
    html.includes('href="https://github.com/TM-threemavithana"'),
    `${page.name} footer must contain approved GitHub profile link`
  );
  assert.ok(
    html.includes('href="https://www.linkedin.com/in/tharuka-madhuwantha/"'),
    `${page.name} footer must contain approved LinkedIn profile link`
  );

  // Prohibited draft/unbuilt routes in footer
  for (const link of prohibited404Links) {
    assert.ok(
      !html.includes(link),
      `${page.name} must NOT contain link to unpublished route: ${link}`
    );
  }
}

console.log(
  '✓ Footer and 404 production integrity confirmed: dist/404.html generated, single H1, robots noindex, recovery links verified, global landmarks intact, published navigation synchronized, zero placeholders'
);

console.log('--- All Production Artifact Verification Tests Passed Cleanly ---');
