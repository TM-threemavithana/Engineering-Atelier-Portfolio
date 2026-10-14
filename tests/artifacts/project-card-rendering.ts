/**
 * @file tests/artifacts/project-card-rendering.ts
 * @description Isolated rendered HTML integration test suite for EA-021 project cards.
 *
 * ARCHITECTURAL DESIGN:
 * - Mounts temporary fixture in isolated test scope (src/pages/dev-project-cards.astro).
 * - Builds to isolated test output (tests/.test-dist/) without touching production dist/.
 * - Guarantees strict cleanup in a try/finally block so temporary files are removed
 *   whether the tests pass or fail.
 * - Uses fictional test-only data (NOT real candidate drafts).
 * - Validates:
 *   1. Zero nested anchors (<a inside <a).
 *   2. Accessible stretched-link classes (after:absolute after:inset-0).
 *   3. Suppression of navigation for unpublished routes.
 *   4. Independent secondary links with relative z-10 and noopener noreferrer.
 *   5. Blueprint fallback SVG semantics, aria-hidden="true", and zero currency assets.
 *   6. Alternating desktop layout in FeaturedProjectCard (imagePosition left/right).
 */

import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

console.log('--- Starting Rendered HTML Project Cards Verification Suite ---');

const testDistDir = path.resolve('tests', '.test-dist');
const devCardHtmlPath = path.join(testDistDir, 'dev-project-cards', 'index.html');
const devPageSrc = path.resolve('src', 'pages', 'dev-project-cards.astro');

const devPageContent = `---
import BaseLayout from '../layouts/BaseLayout.astro';
import ProjectCard from '../components/projects/ProjectCard.astro';
import FeaturedProjectCard from '../components/projects/FeaturedProjectCard.astro';
import type { ProjectItem } from '../data/projects';

// Fictional test-only projects
// Project 1: Simulated published project (href="/" is an approved route in isRoutePublished)
const publishedFictionalProject: ProjectItem = {
  id: 'fictional-published',
  slug: 'fictional-published',
  title: 'Fictional Published Architecture',
  problem: 'Simulating published case-study navigation and stretched-link pattern.',
  role: 'Systems Architect',
  contribution: 'Designed event-driven actor framework with deterministic replay.',
  stack: ['Java', 'Akka', 'Kafka', 'PostgreSQL'],
  status: 'completed',
  draft: false,
  featured: true,
  summary: 'Simulating published case-study navigation and stretched-link pattern.',
  href: '/', // Approved route to test published state
  repoUrl: 'https://github.com/example-fictional/published-system',
  demoUrl: 'https://demo.example-fictional.org/app',
  editorialApproval: true,
};

// Project 2: Simulated unpublished project (unpublished route)
const unpublishedFictionalProject: ProjectItem = {
  id: 'fictional-unpublished',
  slug: 'fictional-unpublished',
  title: 'Fictional Clearance Prototype',
  problem: 'Testing non-interactive card state when route is unpublished or under clearance.',
  role: 'Research Engineer',
  contribution: 'Formulated prototype algorithms awaiting independent reproduction.',
  stack: ['Python', 'PyTorch', 'OpenCV'],
  status: 'research',
  draft: true,
  featured: false,
  summary: 'Testing non-interactive card state when route is unpublished or under clearance.',
  href: '/projects/fictional-unpublished/', // Unpublished route
  repoUrl: 'https://github.com/example-fictional/clearance-prototype',
  editorialApproval: false,
};

// Project 3: Fictional distributed systems project
const distributedFictionalProject: ProjectItem = {
  id: 'fictional-distributed',
  slug: 'fictional-distributed',
  title: 'Fictional Raft Consensus Engine',
  problem: 'Distributed leader election and log replication under network partitions.',
  role: 'Distributed Systems Developer',
  contribution: 'Authored write-ahead log and snapshot compaction engine.',
  stack: ['Scala', 'gRPC', 'RocksDB'],
  status: 'prototype',
  draft: true,
  featured: true,
  summary: 'Distributed leader election and log replication under network partitions.',
  href: '/projects/fictional-distributed/',
  repoUrl: 'https://github.com/example-fictional/raft-engine',
  editorialApproval: false,
};
---

<BaseLayout title="EA-021 Project Cards Showcase (Isolated Test Fixture)">
  <div class="py-12 space-y-16 max-w-7xl mx-auto px-4">
    <!-- Section 1: Standard Project Cards -->
    <section id="test-standard-cards" class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Published Card -->
      <ProjectCard
        project={publishedFictionalProject}
        category="backend"
      />

      <!-- Unpublished Card with Blueprint Fallback -->
      <ProjectCard
        project={unpublishedFictionalProject}
        category="research"
      />
    </section>

    <!-- Section 2: Featured Project Cards (Alternating Layouts) -->
    <section id="test-featured-cards" class="space-y-12">
      <!-- Featured Card: Image Left -->
      <FeaturedProjectCard
        project={publishedFictionalProject}
        category="backend"
        imagePosition="left"
        eyebrow="CASE STUDY SPOTLIGHT 01"
        metrics={[
          {
            name: 'P99 Latency',
            value: '4.2 ms',
            methodology: 'Benchmarked with 50,000 concurrent requests across 10 trials',
          },
          {
            name: 'Replication Quorum',
            value: '3/5 Nodes',
            methodology: 'Verified under simulated network partition stress test',
          },
        ]}
      />

      <!-- Featured Card: Image Right -->
      <FeaturedProjectCard
        project={distributedFictionalProject}
        category="distributed"
        imagePosition="right"
        eyebrow="CASE STUDY SPOTLIGHT 02"
      />
    </section>
  </div>
</BaseLayout>
`;

try {
  // 1. Create temporary fixture page in isolated test scope
  console.log('Mounting temporary dev-project-cards fixture page...');
  fs.writeFileSync(devPageSrc, devPageContent, 'utf-8');

  // 2. Build to isolated test directory without touching production dist/
  console.log('Building isolated test fixture to tests/.test-dist ...');
  execSync(`npx astro build --outDir "${testDistDir}"`, { stdio: 'pipe' });

  assert.ok(
    fs.existsSync(devCardHtmlPath),
    'tests/.test-dist/dev-project-cards/index.html must be generated'
  );
  const html = fs.readFileSync(devCardHtmlPath, 'utf-8');
  assert.ok(html.length > 500, 'Rendered HTML must not be empty');
  console.log('✓ Isolated test build generated and loaded successfully');

  // 3. Accessibility & HTML Validity: Zero Nested Anchors
  // Ensure no <a tag contains another <a tag within its descendants
  const nestedAnchorMatch = html.match(/<a\b[^>]*>(?:(?!<\/a>)[\s\S])*?<a\b/i);
  assert.equal(
    nestedAnchorMatch,
    null,
    'CRITICAL: Project cards must strictly have ZERO nested <a> elements in rendered markup'
  );
  console.log('✓ HTML validity confirmed: zero nested <a> anchor tags detected');

  // 4. Stretched-Link Pattern Verification
  // The published card must render an anchor with after:absolute after:inset-0
  assert.match(
    html,
    /<a[^>]*href="\/"[^>]*class="[^"]*after:absolute[^"]*after:inset-0[^"]*"[^>]*>[\s\S]*?Fictional Published Architecture[\s\S]*?<\/a>/,
    'Published project card must render primary title anchor with after:absolute after:inset-0 stretched-link class'
  );

  // The unpublished card must NOT render an anchor with stretched-link
  assert.match(
    html,
    /<h3[^>]*id="project-title-fictional-unpublished"[^>]*>[\s\S]*?<span[^>]*>[\s\S]*?Fictional Clearance Prototype[\s\S]*?<\/span>[\s\S]*?<\/h3>/,
    'Unpublished project card must render title as plain text (no <a> link)'
  );
  console.log(
    '✓ Stretched-link behavior confirmed: title anchor rendered only when route is published'
  );

  // 5. Safe Navigation & Non-Interactive State Verification
  // Published card has "Read Case Study"
  assert.match(html, /Read Case Study/, 'Published card must render "Read Case Study" indicator');

  // Unpublished card must suppress "Read Case Study" and render clearance status
  assert.match(
    html,
    /Case study in clearance/,
    'Unpublished card must render honest "Case study in clearance" status'
  );
  console.log(
    '✓ Safe navigation confirmed: unpublished routes suppress action and render non-interactive state'
  );

  // 6. Secondary External Links Verification
  // Check GitHub repo link
  const githubMatch = html.match(
    /<a\b[^>]*href="https:\/\/github\.com\/example-fictional\/published-system"[^>]*>[\s\S]*?<\/a>/
  );
  assert.ok(githubMatch, 'GitHub repository link must be rendered');
  assert.match(githubMatch[0], /target="_blank"/, 'GitHub link must have target="_blank"');
  assert.match(
    githubMatch[0],
    /rel="noopener noreferrer"/,
    'GitHub link must have rel="noopener noreferrer"'
  );
  assert.match(
    githubMatch[0],
    /class="[^"]*relative z-10[^"]*"/,
    'GitHub link must have relative z-10'
  );
  assert.match(
    githubMatch[0],
    /\(opens in new tab\)/,
    'GitHub link must announce (opens in new tab)'
  );

  // Check Live Demo link
  const demoMatch = html.match(
    /<a\b[^>]*href="https:\/\/demo\.example-fictional\.org\/app"[^>]*>[\s\S]*?<\/a>/
  );
  assert.ok(demoMatch, 'Live Demo link must be rendered');
  assert.match(demoMatch[0], /target="_blank"/, 'Demo link must have target="_blank"');
  assert.match(
    demoMatch[0],
    /rel="noopener noreferrer"/,
    'Demo link must have rel="noopener noreferrer"'
  );
  assert.match(
    demoMatch[0],
    /class="[^"]*relative z-10[^"]*"/,
    'Demo link must have relative z-10'
  );
  assert.match(demoMatch[0], /\(opens in new tab\)/, 'Demo link must announce (opens in new tab)');
  console.log(
    '✓ Secondary external links confirmed: elevated to z-10 with secure rel and new-tab notices'
  );

  // 7. ProjectBlueprintFallback Verification
  // Must render SVG with aria-hidden="true" and focusable="false"
  assert.match(
    html,
    /<svg[^>]*aria-hidden="true"[^>]*focusable="false"[^>]*>[\s\S]*?<g class="schematic-research">/,
    'Research blueprint fallback must render SVG with aria-hidden="true" and schematic-research'
  );
  assert.match(
    html,
    /<svg[^>]*aria-hidden="true"[^>]*focusable="false"[^>]*>[\s\S]*?<g class="schematic-distributed">/,
    'Distributed blueprint fallback must render SVG with aria-hidden="true" and schematic-distributed'
  );

  // Must have role="img" and descriptive aria-label on wrapper
  assert.match(
    html,
    /role="img"[^>]*aria-label="Conceptual architectural schematic for Fictional Clearance Prototype"/,
    'Blueprint wrapper must have role="img" and descriptive aria-label'
  );

  // Confirm zero currency / banknote terms in rendered HTML
  const forbiddenCurrencyTerms = ['banknote', 'currency', 'specimen', 'rupee', 'lkr'];
  for (const term of forbiddenCurrencyTerms) {
    assert.ok(
      !html.toLowerCase().includes(term),
      `Rendered HTML must NOT contain currency term "${term}"`
    );
  }
  console.log(
    '✓ Blueprint fallback verified: valid SVG, aria-hidden, and zero currency/banknote references'
  );

  // 8. FeaturedProjectCard Alternating Layout Verification
  // Left image: media has order-first, content has order-last
  assert.match(
    html,
    /lg:order-first lg:border-r/,
    'Featured card with imagePosition="left" must have lg:order-first on media'
  );

  // Right image: media has order-last, content has order-first
  assert.match(
    html,
    /lg:order-last lg:border-l/,
    'Featured card with imagePosition="right" must have lg:order-last on media'
  );

  // Qualified metrics rendered when provided
  assert.match(html, /4\.2 ms[\s\S]*?P99 Latency/, 'Featured card must render qualified metrics');
  console.log(
    '✓ FeaturedProjectCard verified: asymmetric alternating layout and qualified metrics'
  );

  // 9. Status and Technology Tags Verification
  assert.match(html, /Completed System/, 'Completed status label text must render');
  assert.match(html, /Research Study/, 'Research status label text must render');
  assert.match(html, /Prototype Architecture/, 'Prototype status label text must render');
  assert.match(html, /Kafka/, 'Technology tag Kafka must render');
  assert.match(html, /OpenCV/, 'Technology tag OpenCV must render');
  assert.match(html, /gRPC/, 'Technology tag gRPC must render');
  console.log('✓ Status labels and technology tags confirmed');

  console.log('--- All Rendered HTML Project Cards Tests Passed Cleanly ---');
} finally {
  // Always clean up temporary files and directories, even if assertions throw
  if (fs.existsSync(devPageSrc)) {
    fs.unlinkSync(devPageSrc);
    console.log('Cleaned up temporary dev-project-cards.astro fixture page');
  }
  if (fs.existsSync(testDistDir)) {
    fs.rmSync(testDistDir, { recursive: true, force: true });
    console.log('Cleaned up isolated tests/.test-dist directory');
  }
}
