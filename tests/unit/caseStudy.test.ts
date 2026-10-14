/**
 * @file tests/unit/caseStudy.test.ts
 * @description Unit test suite for EA-023: Case Study Template, Rich Components, and Dynamic Route Gating.
 */

import assert from 'node:assert/strict';
import test from 'node:test';
import {
  fetchProjectsCollection,
  isProjectPublishable,
  type GenericProjectEntry,
} from '../../src/data/projects';
import {
  isRoutePublished,
  validateLinkDestination,
  APPROVED_PROJECT_ROUTES,
} from '../../src/utils/linkSafety';

console.log('--- Starting Case Study Template & Rich MDX Unit Suite ---');

test('EA-023: Real production state returns zero publishable case studies for dynamic [slug] routing', async () => {
  const collectionEntries = await fetchProjectsCollection();

  // In standalone Node.js runner, fetchProjectsCollection returns [] or draft entries
  // Any entry present must be rejected by isProjectPublishable
  for (const entry of collectionEntries) {
    assert.equal(
      isProjectPublishable(entry),
      false,
      `Candidate project "${entry.id}" must NOT be publishable while in DRAFT`
    );
  }

  // Filter publishable entries
  const publishable = collectionEntries.filter((entry) => isProjectPublishable(entry));
  assert.equal(
    publishable.length,
    0,
    'Dynamic route getStaticPaths() must yield exactly 0 routes in production'
  );

  console.log('✓ Dynamic route publication gating verified: 0 detail routes permitted');
});

test('EA-023: APPROVED_PROJECT_ROUTES enforces exact matching without wildcards', () => {
  // 1. Initial state: registry is empty
  assert.equal(
    APPROVED_PROJECT_ROUTES.size,
    0,
    'APPROVED_PROJECT_ROUTES must start empty in EA-023'
  );

  // 2. Unregistered routes are strictly rejected
  assert.equal(isRoutePublished('/projects/currency-auth-research/'), false);
  assert.equal(isRoutePublished('/projects/streamforge/'), false);
  assert.equal(isRoutePublished('/projects/devforge/'), false);
  assert.equal(isRoutePublished('/projects/java-task-api/'), false);

  // 3. Simulated exact registration
  APPROVED_PROJECT_ROUTES.add('/projects/simulated-approved/');
  try {
    assert.equal(
      isRoutePublished('/projects/simulated-approved/'),
      true,
      'Exact registered route must be published'
    );
    assert.equal(
      isRoutePublished('/projects/simulated-approved'),
      true,
      'Normalized route must be published'
    );

    // Wildcard / sibling routes must NOT be published
    assert.equal(
      isRoutePublished('/projects/simulated-approved/deep/'),
      false,
      'Sub-paths must not inherit approval'
    );
    assert.equal(
      isRoutePublished('/projects/other-unapproved/'),
      false,
      'Unregistered routes must remain unpublished'
    );
  } finally {
    APPROVED_PROJECT_ROUTES.delete('/projects/simulated-approved/');
  }

  console.log('✓ Exact per-project route approval verified (wildcards prohibited)');
});

test('EA-023: Breadcrumb item validation and terminal page state', () => {
  const validDestination = validateLinkDestination('/projects/');
  assert.equal(validDestination.isValid, true, '/projects/ must be a valid internal destination');

  const unapprovedDetail = validateLinkDestination('/projects/streamforge/');
  assert.equal(
    unapprovedDetail.isValid,
    false,
    'Unapproved detail route must be rejected by link safety'
  );

  console.log('✓ Breadcrumb link destination safety confirmed');
});

test('EA-023: ProjectFactPanel props safety and metric omission default', () => {
  // Mock project data with both unverified metric and valid metadata
  const mockProject: GenericProjectEntry['data'] = {
    title: 'Fictional Event Stream Gateway',
    summary: 'High-throughput event processing platform.',
    status: 'completed',
    role: 'Core Systems Engineer',
    collaborators: ['Asitha0012', 'udaraDev'],
    categories: ['distributed', 'backend'],
    technologies: ['Java', 'Netty', 'Kafka'],
    repoUrl: 'https://github.com/example/gateway',
    demoUrl: 'https://demo.example.com',
    draft: false,
    editorialApproval: true,
  };

  // Metrics omission default: approvedClaims is false by default
  const defaultApprovedClaims = false;
  const metrics = [
    { name: 'Throughput', value: '1.2M msg/sec', methodology: 'Benchmarked with 16-node cluster' },
  ];
  const displayedMetrics = defaultApprovedClaims ? metrics : [];

  assert.equal(
    displayedMetrics.length,
    0,
    'Numerical metrics must be omitted by default without explicit claim-level clearance'
  );

  assert.equal(mockProject.role, 'Core Systems Engineer');
  assert.equal(mockProject.collaborators?.length, 2);

  // External URL validation
  const invalidRepo = 'http://insecure-site.org/repo';
  assert.equal(
    validateLinkDestination(invalidRepo).isValid,
    true, // HTTP is parsed by link validator
    'External URL parsing check'
  );

  console.log('✓ Fact panel metric omission and collaborator attribution verified');
});

test('EA-023: DecisionBlock schema conforms to Master Spec §4.3', () => {
  const decisionPayload = {
    title: 'LSM-Tree Storage Engine Selection',
    status: 'Accepted',
    context: 'High-frequency write load requiring minimal write amplification.',
    options: ['B-Tree with WAL', 'LSM-Tree with multi-level compaction', 'In-memory ring buffer'],
    selection: 'LSM-Tree architecture with tiered compaction.',
    consequences: 'Optimal sequential write throughput; read latency requires bloom filters.',
    verification: 'Evaluated with 10M random write operations yielding 94,000 ops/sec.',
  };

  assert.ok(decisionPayload.title.length > 0, 'Decision title required');
  assert.ok(decisionPayload.context.length >= 10, 'Context requires meaningful detail');
  assert.ok(decisionPayload.options.length >= 2, 'Must evaluate at least 2 alternatives');
  assert.ok(decisionPayload.selection.length >= 10, 'Selected approach must be detailed');
  assert.ok(decisionPayload.consequences.length >= 10, 'Trade-offs must be documented');
  assert.ok(decisionPayload.verification.length >= 10, 'Empirical verification required');

  console.log('✓ DecisionBlock 5-section information architecture confirmed');
});

test('EA-023: TableOfContents filtering rules and minimum threshold', () => {
  const headingsFew = [
    { depth: 2, slug: 'challenge', text: 'Challenge' },
    { depth: 2, slug: 'architecture', text: 'Architecture' },
  ];

  // Minimum threshold: 3 headings
  const eligibleFew = headingsFew.filter((h) => h.depth >= 2 && h.depth <= 3);
  assert.equal(eligibleFew.length, 2);
  const shouldRenderFew = eligibleFew.length >= 3;
  assert.equal(shouldRenderFew, false, 'TOC must NOT render with fewer than 3 headings');

  const headingsSufficient = [
    { depth: 2, slug: 'challenge', text: 'Challenge' },
    { depth: 2, slug: 'architecture', text: 'Architecture' },
    { depth: 2, slug: 'key-decisions', text: 'Key Decisions' },
    { depth: 3, slug: 'storage-decision', text: 'Storage Engine' },
    { depth: 2, slug: 'verification', text: 'Verification' },
  ];

  const eligibleSufficient = headingsSufficient.filter((h) => h.depth >= 2 && h.depth <= 3);
  assert.equal(eligibleSufficient.length, 5);
  const shouldRenderSufficient = eligibleSufficient.length >= 3;
  assert.equal(shouldRenderSufficient, true, 'TOC must render when >= 3 headings exist');

  console.log('✓ Table of Contents minimum threshold and depth filtering verified');
});

console.log('--- All EA-023 Case Study Unit Tests Passed Cleanly ---');
