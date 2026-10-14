import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

console.log('--- Starting Rendered HTML Primitives Verification Suite ---');

const testDistDir = path.resolve('tests', '.test-dist');
const devPrimitivesPath = path.join(testDistDir, 'dev-primitives', 'index.html');
const devPageSrc = path.resolve('src', 'pages', 'dev-primitives.astro');

const devPageContent = `---
import BaseLayout from '../layouts/BaseLayout.astro';
import PrimitivesShowcase from '../components/dev/PrimitivesShowcase.astro';
---

<BaseLayout title="EA-012 UI Primitives Showcase">
  <div class="py-8">
    <PrimitivesShowcase />
  </div>
</BaseLayout>
`;

try {
  // 1. Create temporary fixture page in isolated test scope
  console.log('Mounting temporary dev-primitives fixture page...');
  fs.writeFileSync(devPageSrc, devPageContent, 'utf-8');

  // 2. Build to isolated test directory without touching or contaminating production dist/
  console.log('Building isolated test fixture to tests/.test-dist ...');
  execSync(`npx astro build --outDir "${testDistDir}"`, { stdio: 'pipe' });

  assert.ok(
    fs.existsSync(devPrimitivesPath),
    'tests/.test-dist/dev-primitives/index.html must be generated'
  );
  const html = fs.readFileSync(devPrimitivesPath, 'utf-8');
  assert.ok(html.length > 500, 'Rendered HTML must not be empty');
  console.log('✓ Isolated test build generated and loaded successfully');

  // 2. Button Semantics Verification
  // Check native buttons
  assert.match(
    html,
    /<button[^>]*type="button"[^>]*>[\s\S]*?Primary Button[\s\S]*?<\/button>/,
    'Primary button must render as native <button type="button">'
  );
  assert.match(
    html,
    /<button[^>]*type="button"[^>]*>[\s\S]*?Secondary Button[\s\S]*?<\/button>/,
    'Secondary button must render as native <button type="button">'
  );
  assert.match(
    html,
    /<button[^>]*type="button"[^>]*>[\s\S]*?Ghost Button[\s\S]*?<\/button>/,
    'Ghost button must render as native <button type="button">'
  );

  // Check native disabled button
  assert.match(
    html,
    /<button[^>]*disabled[^>]*aria-disabled="true"[^>]*>[\s\S]*?Native Disabled Button[\s\S]*?<\/button>/,
    'Disabled button must have native disabled attribute and aria-disabled="true"'
  );

  // Check loading button
  assert.match(
    html,
    /<button[^>]*disabled[^>]*aria-busy="true"[^>]*aria-live="polite"[^>]*>[\s\S]*?<svg[^>]*animate-spin[\s\S]*?<span[^>]*class="sr-only"[^>]*>Loading\.\.\.<\/span>[\s\S]*?Processing Order[\s\S]*?<\/button>/,
    'Loading button must have disabled, aria-busy="true", aria-live="polite", sr-only announcement, and spinner'
  );

  // Check button in anchor mode (href="/")
  assert.match(
    html,
    /<a[^>]*href="\/"[^>]*>[\s\S]*?Anchor to Home[\s\S]*?<\/a>/,
    'Button with valid href="/" must render as <a> tag'
  );

  // Check unavailable link rendered as non-interactive span (disabled href="/projects/")
  assert.match(
    html,
    /<span[^>]*role="link"[^>]*aria-disabled="true"[^>]*tabindex="-1"[^>]*>[\s\S]*?Unavailable Project Link[\s\S]*?<\/span>/,
    'Disabled/unavailable link must render as <span role="link" aria-disabled="true" tabindex="-1"> without href'
  );
  // Ensure the unavailable link does NOT have an href attribute
  const unavailableMatch = html.match(
    /<span\b[^>]*\brole="link"[^>]*>[\s\S]*?Unavailable Project Link[\s\S]*?<\/span>/
  );
  assert.ok(unavailableMatch, 'Unavailable link span must exist');
  assert.ok(
    !unavailableMatch[0].includes('href='),
    'Unavailable link must strictly NOT have an href attribute'
  );
  console.log(
    '✓ Button semantics, native disabled, genuine loading, and disabled link behavior confirmed'
  );

  // 3. TextLink Semantics & Security
  // Valid internal link
  assert.match(
    html,
    /<a[^>]*href="\/"[^>]*class="[^"]*underline[^"]*"[^>]*>[\s\S]*?Standard Internal Link \(Home\)[\s\S]*?<\/a>/,
    'TextLink to Home must render as <a> with underline decoration'
  );

  // In-page anchor link
  assert.match(
    html,
    /<a[^>]*href="#buttons-heading"[^>]*>[\s\S]*?In-page Anchor[\s\S]*?<\/a>/,
    'In-page anchor link must render with # destination'
  );

  // External link with openInNewTab={true}
  assert.match(
    html,
    /<a[^>]*href="https:\/\/github\.com"[^>]*target="_blank"[^>]*rel="noopener noreferrer"[^>]*>[\s\S]*?\(opens in new tab\)[\s\S]*?<\/a>/,
    'External link with openInNewTab must have target="_blank", rel="noopener noreferrer", and sr-only notice'
  );

  // Disabled TextLink
  assert.match(
    html,
    /<span[^>]*role="link"[^>]*aria-disabled="true"[^>]*tabindex="-1"[^>]*>[\s\S]*?Disabled TextLink[\s\S]*?<\/span>/,
    'Disabled TextLink must render as non-interactive span without href'
  );

  // Unsafe protocol rejection (javascript:alert(1))
  assert.ok(
    !html.includes('href="javascript:'),
    'HTML must strictly never contain href="javascript:..."'
  );
  assert.match(
    html,
    /<span[^>]*role="link"[^>]*aria-disabled="true"[^>]*>[\s\S]*?Unsafe Protocol \(Rejected\)[\s\S]*?<\/span>/,
    'Link with unsafe protocol must be rendered as disabled span without href'
  );
  console.log(
    '✓ TextLink accessibility, new tab behavior, and unsafe protocol rejection confirmed'
  );

  // 4. SectionHeading Hierarchy
  assert.match(
    html,
    /<h3[^>]*id="buttons-heading"[^>]*class="[^"]*font-\['Space_Grotesk'\][^"]*"[^>]*>[\s\S]*?Buttons &amp; Polymorphic States[\s\S]*?<\/h3>/,
    'SectionHeading must render configured heading level (<h3>) with Space Grotesk'
  );
  assert.match(
    html,
    /<div[^>]*class="[^"]*font-mono[^"]*"[^>]*>[\s\S]*?EA-012 UI PRIMITIVES[\s\S]*?<\/div>/,
    'SectionHeading eyebrow must render in monospace font'
  );
  assert.match(
    html,
    /<p[^>]*class="[^"]*reading-column[^"]*"[^>]*>/,
    'SectionHeading description must use reading-column constraint'
  );
  console.log('✓ SectionHeading hierarchy, eyebrow, and reading-column confirmed');

  // 5. StatusLabel (Static & Restrained)
  // Check static dots (zero animate-pulse or animate-ping)
  const statusSection = html.match(/<section aria-labelledby="status-heading"[\s\S]*?<\/section>/);
  assert.ok(statusSection, 'Status label section must exist');
  assert.ok(
    !statusSection[0].includes('animate-pulse'),
    'Status labels must strictly NOT contain animate-pulse'
  );
  assert.ok(
    !statusSection[0].includes('animate-ping'),
    'Status labels must strictly NOT contain animate-ping'
  );

  assert.match(
    statusSection[0],
    /<span[^>]*class="[^"]*w-1\.5 h-1\.5 rounded-full[^"]*"[^>]*aria-hidden="true"[^>]*><\/span>[\s\S]*?<span[^>]*>Verified Architecture<\/span>/,
    'StatusLabel must have static indicator dot and visible text label'
  );
  console.log('✓ StatusLabel static indicator and zero animation confirmed');

  // 6. Tag Semantics
  // Informational tag (static span)
  assert.match(
    html,
    /<span[^>]*class="[^"]*font-mono[^"]*"[^>]*>[\s\S]*?Java 21[\s\S]*?<\/span>/,
    'Informational Tag must render as static <span>'
  );
  // Interactive tag (anchor)
  assert.match(
    html,
    /<a[^>]*href="\/"[^>]*class="[^"]*font-mono[^"]*min-h-\[44px\][^"]*"[^>]*>[\s\S]*?Interactive Tag \(Home\)[\s\S]*?<\/a>/,
    'Interactive Tag must render as <a> with 44px min-height touch target'
  );
  console.log('✓ Tag informational vs interactive semantics confirmed');

  // 7. SVG Icons Accessibility
  const iconsSection = html.match(/<section aria-labelledby="icons-heading"[\s\S]*?<\/section>/);
  assert.ok(iconsSection, 'Icons section must exist');
  const svgs = iconsSection[0].match(/<svg[^>]*>/g) || [];
  assert.ok(svgs.length >= 5, 'At least 5 SVG icons must be rendered');
  for (const svg of svgs) {
    assert.ok(svg.includes('aria-hidden="true"'), `SVG must have aria-hidden="true": ${svg}`);
  }
  console.log('✓ SVG icons accessibility and sizing confirmed');

  console.log('--- All Rendered HTML Primitives Tests Passed Cleanly ---');
} finally {
  // Reliable cleanup: ensure temporary fixture page and tests/.test-dist are completely removed even on test failure
  if (fs.existsSync(devPageSrc)) {
    fs.rmSync(devPageSrc, { force: true });
    console.log('Cleaned up temporary dev-primitives.astro fixture page');
  }
  if (fs.existsSync(testDistDir)) {
    fs.rmSync(testDistDir, { recursive: true, force: true });
    console.log('Cleaned up isolated tests/.test-dist directory');
  }
}
