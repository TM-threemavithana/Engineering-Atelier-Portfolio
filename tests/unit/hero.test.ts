import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

console.log('--- Starting Hero Architecture & Semantics Unit Suite ---');

const heroFile = path.resolve('src/components/sections/Hero.astro');
const blueprintFile = path.resolve('src/components/sections/HeroBlueprint.astro');
const indexFile = path.resolve('src/pages/index.astro');

test('Hero source files exist and are readable', () => {
  assert.ok(fs.existsSync(heroFile), 'Hero.astro must exist');
  assert.ok(fs.existsSync(blueprintFile), 'HeroBlueprint.astro must exist');
  assert.ok(fs.existsSync(indexFile), 'index.astro must exist');
  console.log('✓ Hero and blueprint component files exist');
});

test('Hero enforces single H1 and approved positioning copy', () => {
  const content = fs.readFileSync(heroFile, 'utf-8');

  // Verify single H1
  const h1Matches = content.match(/<h1\b[^>]*>/g) || [];
  assert.equal(h1Matches.length, 1, 'Hero must contain exactly one <h1>');
  assert.match(h1Matches[0], /id="hero-heading"/, 'H1 must have id="hero-heading"');

  // Verify approved headline
  assert.match(
    content,
    /Building reliable systems\.\s+Creating meaningful experiences\./,
    'Hero must contain exact approved headline'
  );

  // Verify approved positioning text
  assert.match(
    content,
    /Software Engineer focused on Java, Scala, backend architecture, distributed systems, and\s+thoughtful full-stack development\./,
    'Hero must contain exact approved positioning text'
  );

  // Verify overline
  assert.match(content, /Software Engineer/, 'Hero must contain overline');

  console.log('✓ Hero H1 and approved positioning copy confirmed');
});

test('Hero CTA points to valid in-page architecture blueprint anchor', () => {
  const heroContent = fs.readFileSync(heroFile, 'utf-8');
  const blueprintContent = fs.readFileSync(blueprintFile, 'utf-8');

  // CTA label and destination
  assert.match(
    heroContent,
    /href="#architecture-blueprint"/,
    'CTA href must be #architecture-blueprint'
  );
  assert.match(heroContent, /Explore the Blueprint/, 'CTA label must be "Explore the Blueprint"');

  // Destination target element exists in blueprint
  assert.match(
    blueprintContent,
    /id="architecture-blueprint"/,
    'Blueprint card must provide target id="architecture-blueprint"'
  );
  assert.match(
    blueprintContent,
    /tabindex="-1"/,
    'Blueprint target must have tabindex="-1" for accessible programmatic focus'
  );

  console.log('✓ Hero CTA in-page destination and accessible focus target confirmed');
});

test('Architecture blueprint enforces honest conceptual labeling and zero fabricated metrics', () => {
  const content = fs.readFileSync(blueprintFile, 'utf-8');

  // Must be labeled Conceptual Model
  assert.match(content, /label="Conceptual Model"/, 'Must have Conceptual Model tag');

  // Must have Status: Illustrative Architecture
  assert.match(content, /Illustrative Architecture/, 'Status must be "Illustrative Architecture"');

  // Strictly prohibited: "In Clearance", "P99", "Target P99", latency claims
  assert.ok(!content.includes('In Clearance'), 'Must not contain "In Clearance"');
  assert.ok(!content.includes('P99'), 'Must not contain "P99"');
  assert.ok(!content.includes('2.0ms'), 'Must not contain "2.0ms"');
  assert.ok(!content.includes('1.2ms'), 'Must not contain "1.2ms"');

  // Must have accessible screen-reader description
  assert.match(content, /id="blueprint-summary"/, 'Must have blueprint-summary element');
  assert.match(content, /class="sr-only"/, 'Description must be accessible via sr-only');
  assert.match(
    content,
    /aria-describedby="blueprint-summary"/,
    'Region must reference description'
  );

  console.log(
    '✓ Conceptual labeling, accessible description, and zero metric fabrication confirmed'
  );
});

test('Architecture blueprint SVG is handcrafted vector with readable labels and no bitmaps', () => {
  const content = fs.readFileSync(blueprintFile, 'utf-8');

  // SVG structure
  assert.match(content, /<svg\b[^>]*viewBox="0 0 540 270"/, 'SVG must have responsive viewBox');
  assert.match(content, /overflow-visible/, 'SVG must have overflow-visible to prevent clipping');

  // Strictly no bitmap tags
  assert.ok(!content.includes('<image'), 'SVG must strictly not contain <image> tags');
  assert.ok(!content.includes('.png'), 'Blueprint must strictly not embed PNGs');
  assert.ok(!content.includes('.jpg'), 'Blueprint must strictly not embed JPGs');

  // Required node technical labels
  const requiredLabels = [
    'Client (gRPC)',
    'Buffered Channel',
    'Pipeline Handler',
    'Consensus Log',
    'Storage Engine',
    'Peer Replica',
  ];

  for (const label of requiredLabels) {
    assert.ok(content.includes(label), `SVG must contain readable label: "${label}"`);
  }

  console.log('✓ Handcrafted vector SVG and readable technical labels confirmed');
});

console.log('--- All Hero Semantics Tests Passed Cleanly ---');
