/**
 * @file tests/artifacts/case-study-rendering.ts
 * @description Isolated rendered HTML integration test suite for EA-023: Case Study Template & Rich MDX.
 *
 * ARCHITECTURAL DESIGN:
 * - Builds to isolated test directory (tests/.test-dist/) without touching production dist/.
 * - Mounts a temporary fixture page (src/pages/dev-case-study.astro) using strictly fictional data.
 * - Validates compiled HTML output: single H1, heading hierarchy, breadcrumbs, fact panel,
 *   decision block, code block scrollability, figure caption, and TOC anchor integrity.
 * - Guarantees 100% cleanup of fixture and test directory in a try/finally block.
 */

import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

console.log('--- Starting Rendered HTML Case Study Verification Suite ---');

const testDistDir = path.resolve('tests', '.test-dist');
const devCaseStudyPath = path.join(testDistDir, 'dev-case-study', 'index.html');
const devPageSrc = path.resolve('src', 'pages', 'dev-case-study.astro');

const devPageContent = `---
import BaseLayout from '../layouts/BaseLayout.astro';
import Breadcrumbs from '../components/projects/Breadcrumbs.astro';
import ProjectFactPanel from '../components/projects/ProjectFactPanel.astro';
import DecisionBlock from '../components/projects/DecisionBlock.astro';
import Figure from '../components/projects/Figure.astro';
import CodeBlock from '../components/projects/CodeBlock.astro';
import TableOfContents from '../components/projects/TableOfContents.astro';
import ProjectBlueprintFallback from '../components/projects/ProjectBlueprintFallback.astro';
import Button from '../components/ui/Button.astro';
import ArrowRightIcon from '../components/icons/ArrowRightIcon.astro';

// Fictional test data
const mockHeadings = [
  { depth: 2, slug: 'challenge-and-constraints', text: 'Challenge & Constraints' },
  { depth: 2, slug: 'system-architecture', text: 'System Architecture' },
  { depth: 2, slug: 'storage-decision', text: 'Key Engineering Decisions' },
  { depth: 2, slug: 'implementation-details', text: 'Implementation Details' },
  { depth: 2, slug: 'testing-and-verification', text: 'Testing & Reliability' },
];

const javaCodeSample = \`public final class StreamDispatcher {
    private final RingBuffer<EventEnvelope> buffer;
    private final AtomicLong sequence = new AtomicLong(0);

    public StreamDispatcher(int bufferSize) {
        this.buffer = new RingBuffer<>(bufferSize, ClaimStrategy.MULTI_PRODUCER);
    }

    public boolean tryPublish(EventEnvelope event) {
        long current = sequence.get();
        return buffer.tryPublishEvent((entry, seq) -> entry.copyFrom(event));
    }
}\`;
---

<BaseLayout
  title="Fictional Event Stream Gateway | Projects"
  description="Verification harness for technical case study template."
  noindex={true}
>
  <main
    id="main-content"
    tabindex="-1"
    class="focus:outline-none scroll-mt-16 sm:scroll-mt-20 py-10 sm:py-16"
  >
    <div class="container-atelier w-full space-y-10 sm:space-y-12">
      <!-- 1. Breadcrumbs Navigation -->
      <Breadcrumbs currentTitle="Fictional Event Stream Gateway" />

      <!-- 2. Case Study Hero Header -->
      <header class="space-y-4 max-w-4xl">
        <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-[var(--radius-tag)] bg-[var(--color-surface-alt)] border border-[var(--color-border-strong)] text-[var(--color-accent)] font-mono text-xs uppercase tracking-wider select-none">
          <span class="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" aria-hidden="true"></span>
          <span>ENGINEERING CASE STUDY</span>
        </div>

        <h1 class="font-['Space_Grotesk'] text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--color-fg)] leading-tight">
          Fictional Event Stream Gateway
        </h1>

        <p class="reading-column text-base sm:text-lg text-[var(--color-muted)] leading-relaxed max-w-[74ch]">
          A high-throughput distributed event ingestion platform designed for sub-millisecond p99 fan-out latency and partitioned WAL durability.
        </p>
      </header>

      <!-- 3. Visual Banner / Fallback Blueprint -->
      <div class="relative w-full aspect-video rounded-[var(--radius-card)] border border-[var(--color-border)] overflow-hidden bg-[var(--color-surface)]">
        <ProjectBlueprintFallback
          title="Fictional Event Stream Gateway"
          category="distributed"
          status="completed"
          aspectRatio="16/9"
        />
      </div>

      <!-- 4. Main Grid: Fact Panel + Narrative MDX Body -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <!-- Sidebar -->
        <aside class="lg:col-span-4 space-y-8 lg:sticky lg:top-24">
          <ProjectFactPanel
            role="Core Systems Engineer"
            collaborators={['Engineer Alpha', 'Engineer Beta']}
            status="completed"
            categories={['distributed', 'backend']}
            technologies={['Java', 'Netty', 'Kafka', 'Prometheus']}
            repoUrl="https://github.com/example/stream-gateway"
            demoUrl="https://demo.example.com"
            approvedClaims={false}
          />

          <TableOfContents headings={mockHeadings} />
        </aside>

        <!-- Narrative Column (<= 74ch) -->
        <article class="lg:col-span-8 reading-column max-w-[74ch] space-y-10 text-[var(--color-fg)] leading-relaxed">
          <section id="challenge-and-constraints" class="space-y-4">
            <h2 class="font-['Space_Grotesk'] text-2xl font-bold tracking-tight text-[var(--color-fg)]">
              Challenge &amp; Constraints
            </h2>
            <p class="text-[var(--color-muted)]">
              Handling 500,000 incoming telemetry events per second over persistent TLS connections while maintaining strict in-order guarantees per partition without head-of-line blocking.
            </p>
          </section>

          <section id="system-architecture" class="space-y-4">
            <h2 class="font-['Space_Grotesk'] text-2xl font-bold tracking-tight text-[var(--color-fg)]">
              System Architecture
            </h2>
            <p class="text-[var(--color-muted)]">
              The ingestion layer decouples network I/O from disk writes using a multi-ring buffer queue.
            </p>

            <Figure
              caption="Three-tier ingestion topology separating Netty worker event loops from disk serialization workers."
              figureNumber="1"
              alt="Architectural schematic of event ingestion pipeline"
            >
              <div class="p-6 text-center font-mono text-xs text-[var(--color-accent)]">
                [INGESTION GATEWAY] ---> [DISRUPTOR RING BUFFER] ---> [WAL SEGMENT COMMITTER]
              </div>
            </Figure>
          </section>

          <section id="storage-decision">
            <DecisionBlock
              title="Ring Buffer In-Memory Queue vs BlockingQueue"
              status="Accepted"
              context="Concurrent event dispatch required zero lock contention across 16 worker threads."
              options={[
                'java.util.concurrent.ArrayBlockingQueue with condition locks',
                'LMAX Disruptor lock-free RingBuffer with memory barriers',
                'Custom spinlock linked-list queue',
              ]}
              selection="Adopted LMAX Disruptor ring buffer pre-allocated to 1,048,576 slots."
              consequences="Eliminated lock contention; requires fixed pre-allocated JVM heap footprint."
              verification="Sustained 4.8x higher throughput in empirical 16-thread benchmark."
            />
          </section>

          <section id="implementation-details" class="space-y-4">
            <h2 class="font-['Space_Grotesk'] text-2xl font-bold tracking-tight text-[var(--color-fg)]">
              Implementation Details
            </h2>
            <p class="text-[var(--color-muted)]">
              The event dispatcher implementation uses memory sequence barriers for zero-copy handoff:
            </p>

            <CodeBlock
              filename="StreamDispatcher.java"
              language="java"
              code={javaCodeSample}
            />
          </section>

          <section id="testing-and-verification" class="space-y-4">
            <h2 class="font-['Space_Grotesk'] text-2xl font-bold tracking-tight text-[var(--color-fg)]">
              Testing &amp; Reliability
            </h2>
            <p class="text-[var(--color-muted)]">
              Fault injection tests simulated network partition events and disk stall conditions.
            </p>
          </section>

          <div class="border-t border-[var(--color-border)]/60 pt-8 mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Button href="/projects/" variant="secondary" size="md" class="w-full sm:w-auto">
              <span>&larr; Back to Case Studies</span>
            </Button>
            <Button href="/contact/" variant="primary" size="md" class="w-full sm:w-auto">
              <span>Discuss Architecture</span>
              <ArrowRightIcon class="w-4 h-4 ml-1" />
            </Button>
          </div>
        </article>
      </div>
    </div>
  </main>
</BaseLayout>
\`;
`;

try {
  // 1. Create temporary fixture page in isolated test scope
  console.log('Mounting temporary dev-case-study fixture page...');
  fs.writeFileSync(devPageSrc, devPageContent, 'utf-8');

  // 2. Build to isolated test directory without touching production dist/
  console.log('Building isolated test fixture to tests/.test-dist ...');
  execSync(`npx astro build --outDir "${testDistDir}"`, { stdio: 'pipe' });

  assert.ok(
    fs.existsSync(devCaseStudyPath),
    'tests/.test-dist/dev-case-study/index.html must be generated'
  );
  const html = fs.readFileSync(devCaseStudyPath, 'utf-8');
  assert.ok(html.length > 500, 'Rendered HTML must not be empty');
  console.log('✓ Isolated case-study test build generated and loaded successfully');

  // 3. Exactly Single H1 Element
  const h1Matches = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)];
  assert.equal(
    h1Matches.length,
    1,
    `Case study must contain exactly one <h1> element, found ${h1Matches.length}`
  );
  assert.ok(
    html.includes('Fictional Event Stream Gateway'),
    'Rendered HTML must contain H1 project title'
  );
  console.log('✓ Heading hierarchy verified: single H1');

  // 4. Breadcrumb Navigation Landmark & Hierarchy
  assert.match(
    html,
    /<nav[^>]*aria-label="Breadcrumb"[^>]*>/,
    'Breadcrumbs must render <nav aria-label="Breadcrumb">'
  );
  assert.match(html, /<ol[^>]*>/, 'Breadcrumbs must use semantic <ol>');
  assert.match(
    html,
    /<span[^>]*aria-current="page"[^>]*>[\s\S]*?Fictional Event Stream Gateway[\s\S]*?<\/span>/,
    'Terminal breadcrumb item must have aria-current="page"'
  );
  assert.ok(html.includes('href="/projects/"'), 'Breadcrumbs must link to /projects/');
  console.log('✓ Breadcrumb semantics and terminal page state verified');

  // 5. Fact Panel Metadata & Safety
  assert.match(
    html,
    /<aside[^>]*aria-labelledby="fact-panel-heading"[^>]*>/,
    'Fact panel must render accessible <aside aria-labelledby="fact-panel-heading">'
  );
  assert.ok(
    html.includes('Core Systems Engineer'),
    'Fact panel must display confirmed engineering role'
  );
  assert.ok(
    html.includes('Engineer Alpha, Engineer Beta'),
    'Fact panel must display collaborative team attribution'
  );
  assert.ok(
    html.includes('https://github.com/example/stream-gateway'),
    'Fact panel must contain verified HTTPS repo URL'
  );
  assert.ok(
    html.includes('https://demo.example.com'),
    'Fact panel must contain verified HTTPS demo URL'
  );
  assert.ok(
    html.includes('rel="noopener noreferrer"') && html.includes('target="_blank"'),
    'External links must have secure rel and target'
  );
  console.log('✓ Fact panel role attribution, team credit, and link safety verified');

  // 6. DecisionBlock Architecture
  assert.match(
    html,
    /<section[^>]*id="decision-[^"]*"[^>]*aria-labelledby="[^"]*-title"[^>]*>/,
    'DecisionBlock must render accessible <section> with aria-labelledby'
  );
  assert.ok(
    html.includes('Ring Buffer In-Memory Queue vs BlockingQueue'),
    'DecisionBlock must display decision title'
  );
  assert.ok(
    html.includes('1. Context &amp; Constraints'),
    'DecisionBlock must contain Context section'
  );
  assert.ok(html.includes('2. Options Evaluated'), 'DecisionBlock must contain Options section');
  assert.ok(html.includes('3. Selected Approach'), 'DecisionBlock must contain Selection section');
  assert.ok(
    html.includes('4. Consequences &amp; Operational Trade-offs'),
    'DecisionBlock must contain Consequences section'
  );
  assert.ok(
    html.includes('5. Empirical Verification'),
    'DecisionBlock must contain Verification section'
  );
  console.log('✓ DecisionBlock 5-section information architecture confirmed');

  // 7. Figure with Semantic Figcaption & Alt Text
  assert.match(html, /<figure[^>]*>/, 'Figure must render semantic <figure>');
  assert.match(html, /<figcaption[^>]*>/, 'Figure must render semantic <figcaption>');
  assert.ok(
    html.includes('Fig. 1') || html.includes('Figure 1'),
    'Figcaption must include figure number'
  );
  assert.ok(
    html.includes('Three-tier ingestion topology'),
    'Figcaption must include descriptive caption text'
  );
  console.log('✓ Semantic figure and figcaption verified');

  // 8. CodeBlock Scrollability & Progressive Copy
  assert.match(
    html,
    /<div[^>]*class="[^"]*code-scroll-region[^"]*"[^>]*tabindex="0"[^>]*role="region"[^>]*>/,
    'Code block must have scroll region with tabindex="0" and role="region"'
  );
  assert.ok(html.includes('StreamDispatcher.java'), 'Code block must display filename header');
  assert.ok(html.includes('JAVA'), 'Code block must display language badge');
  assert.ok(
    html.includes('class="copy-code-btn hidden'),
    'Copy button must be hidden by default (progressive enhancement)'
  );
  assert.ok(
    html.includes('role="status"') && html.includes('aria-live="polite"'),
    'Accessible live region must be present for copy status announcements'
  );
  console.log('✓ CodeBlock keyboard accessibility, scroll region, and progressive copy verified');

  // 9. Table of Contents Integrity
  assert.match(
    html,
    /<nav[^>]*aria-label="Table of Contents"[^>]*>/,
    'TOC must render <nav aria-label="Table of Contents">'
  );
  assert.ok(
    html.includes('href="#challenge-and-constraints"'),
    'TOC must target #challenge-and-constraints'
  );
  assert.ok(html.includes('href="#system-architecture"'), 'TOC must target #system-architecture');
  assert.ok(
    html.includes('href="#testing-and-verification"'),
    'TOC must target #testing-and-verification'
  );
  // Verify matching target IDs exist in the document
  assert.ok(
    html.includes('id="challenge-and-constraints"'),
    'Target heading id="challenge-and-constraints" must exist'
  );
  assert.ok(
    html.includes('id="system-architecture"'),
    'Target heading id="system-architecture" must exist'
  );
  assert.ok(
    html.includes('id="testing-and-verification"'),
    'Target heading id="testing-and-verification" must exist'
  );
  console.log('✓ Table of Contents anchors and target heading IDs confirmed');

  // 10. HTML Semantics: Zero Nested Anchors
  const nestedAnchorMatch = html.match(/<a\b[^>]*>(?:(?!<\/a>)[\s\S])*?<a\b/gi);
  assert.equal(
    nestedAnchorMatch,
    null,
    'Rendered HTML must strictly contain ZERO nested <a> anchor tags'
  );
  console.log('✓ HTML validity confirmed: zero nested <a> anchor tags');

  // 11. Content Truth & Isolation
  assert.ok(
    !html.includes('Currency Authentication Research'),
    'Real draft project title must not appear in case study harness'
  );
  assert.ok(!html.includes('96.67%'), 'Research metric must not appear in case study harness');
  console.log('✓ Content truth confirmed: zero draft project or metric leakage');

  console.log('--- All Rendered HTML Case Study Tests Passed Cleanly ---');
} finally {
  // Guaranteed cleanup of temporary test fixture and isolated test-dist
  if (fs.existsSync(devPageSrc)) {
    fs.unlinkSync(devPageSrc);
    console.log('Cleaned up temporary dev-case-study.astro fixture page');
  }
  if (fs.existsSync(testDistDir)) {
    fs.rmSync(testDistDir, { recursive: true, force: true });
    console.log('Cleaned up isolated tests/.test-dist directory');
  }
}
