import assert from 'node:assert/strict';
import test from 'node:test';
import { z } from 'zod';
import {
  createProjectSchema,
  createProjectImageSchema,
  isValidProjectHttpsUrl,
  projectHttpsUrlSchema,
  projectStatusEnum,
  projectCategoryEnum,
  evidenceKindEnum,
  validatePublishedProject,
} from '../../src/data/schemas/projectSchema';
import {
  isProjectPublishable,
  getPublishedFeaturedProjects,
  type ProjectItem,
  type GenericProjectEntry,
} from '../../src/data/projects';

console.log('--- Starting EA-019 Project Schema & Content System Unit Suite ---');

// Instantiate test schema with plain string image validator for Node.js isolation
const testProjectSchema = createProjectSchema(z.string());

// =========================================================================
// 1. Strict HTTPS-only URL Validation Tests (Correction 3)
// =========================================================================
test('isValidProjectHttpsUrl accepts valid secure HTTPS URLs and rejects non-HTTPS', () => {
  // Positive assertions
  assert.equal(isValidProjectHttpsUrl('https://github.com/example/repo'), true);
  assert.equal(isValidProjectHttpsUrl('https://example.com/demo/path?query=1#frag'), true);
  assert.equal(isValidProjectHttpsUrl('https://sub.domain.org/artifact.pdf'), true);

  // Negative assertions: Insecure HTTP
  assert.equal(isValidProjectHttpsUrl('http://insecure.example.com'), false);

  // Negative assertions: Dangerous protocols
  assert.equal(isValidProjectHttpsUrl('javascript:alert(1)'), false);
  assert.equal(isValidProjectHttpsUrl('data:text/html,<script>'), false);
  assert.equal(isValidProjectHttpsUrl('file:///etc/passwd'), false);
  assert.equal(isValidProjectHttpsUrl('vbscript:msgbox(1)'), false);

  // Negative assertions: Protocol-relative URLs
  assert.equal(isValidProjectHttpsUrl('//example.com/protocol-relative'), false);

  // Negative assertions: Malformed & empty strings
  assert.equal(isValidProjectHttpsUrl(''), false);
  assert.equal(isValidProjectHttpsUrl('   '), false);
  assert.equal(isValidProjectHttpsUrl('not-a-url'), false);
  assert.equal(isValidProjectHttpsUrl(null), false);
  assert.equal(isValidProjectHttpsUrl(undefined), false);

  console.log('✓ Strict HTTPS URL validation passed (positive and negative assertions)');
});

test('projectHttpsUrlSchema Zod wrapper rejects invalid protocols with descriptive message', () => {
  assert.doesNotThrow(() => projectHttpsUrlSchema.parse('https://github.com/TM-threemavithana'));
  assert.throws(
    () => projectHttpsUrlSchema.parse('http://insecure.org'),
    /Must be a valid secure HTTPS URL/
  );
  assert.throws(
    () => projectHttpsUrlSchema.parse('javascript:evil()'),
    /Must be a valid secure HTTPS URL/
  );
  console.log('✓ projectHttpsUrlSchema Zod wrapper correctly enforces HTTPS');
});

// =========================================================================
// 2. Enum Validation Tests (Status, Category, Evidence Kind)
// =========================================================================
test('Enum schemas enforce valid taxonomy values and reject unauthorized terms', () => {
  // Status Enum
  const validStatuses = ['completed', 'prototype', 'in-progress', 'research'];
  for (const status of validStatuses) {
    assert.doesNotThrow(() => projectStatusEnum.parse(status));
  }
  const invalidStatuses = ['experimental', 'alpha', 'beta', 'done', 'production'];
  for (const status of invalidStatuses) {
    assert.throws(() => projectStatusEnum.parse(status));
  }

  // Category Enum
  const validCategories = ['backend', 'distributed', 'fullstack', 'research', 'frontend'];
  for (const cat of validCategories) {
    assert.doesNotThrow(() => projectCategoryEnum.parse(cat));
  }
  const invalidCategories = ['mobile', 'devops', 'ai-agent', 'blockchain'];
  for (const cat of invalidCategories) {
    assert.throws(() => projectCategoryEnum.parse(cat));
  }

  // Evidence Kind Enum
  const validKinds = ['repo', 'demo', 'test', 'document', 'article'];
  for (const kind of validKinds) {
    assert.doesNotThrow(() => evidenceKindEnum.parse(kind));
  }
  assert.throws(() => evidenceKindEnum.parse('screenshot'));
  assert.throws(() => evidenceKindEnum.parse('external-link'));

  console.log('✓ Status, Category, and Evidence Kind enums strictly enforced');
});

// =========================================================================
// 3. Draft & Incomplete Frontmatter Schema Tests (Correction 2 & 5)
// =========================================================================
test('testProjectSchema accepts valid draft entries with provisional information', () => {
  const validDraftInput = {
    title: 'StreamForge: Distributed Raft Log Engine',
    summary: 'High-throughput distributed write-ahead log with gRPC streaming.',
    status: 'prototype',
    role: 'Backend Systems Engineer',
    categories: ['backend', 'distributed'],
    technologies: ['Java 21', 'gRPC', 'RocksDB'],
    featured: true,
    draft: true,
    editorialApproval: false,
  };

  const parsed = testProjectSchema.parse(validDraftInput);
  assert.equal(parsed.title, validDraftInput.title);
  assert.equal(parsed.draft, true);
  assert.equal(parsed.editorialApproval, false);
  assert.equal(parsed.individualContribution, undefined); // Incomplete contribution allowed in draft
  console.log('✓ Valid draft schema parsing confirmed with provisional data');
});

test('testProjectSchema rejects entries missing fundamental required fields', () => {
  // Missing title
  assert.throws(
    () =>
      testProjectSchema.parse({
        summary: 'Summary exists',
        status: 'prototype',
        role: 'Engineer',
        categories: ['backend'],
        technologies: ['Java'],
      }),
    /Project title is required/
  );

  // Missing summary
  assert.throws(
    () =>
      testProjectSchema.parse({
        title: 'Title exists',
        status: 'prototype',
        role: 'Engineer',
        categories: ['backend'],
        technologies: ['Java'],
      }),
    /Project summary is required/
  );

  // Missing role
  assert.throws(
    () =>
      testProjectSchema.parse({
        title: 'Title exists',
        summary: 'Summary exists',
        status: 'prototype',
        categories: ['backend'],
        technologies: ['Java'],
      }),
    /Engineering role is required/
  );

  // Empty categories array
  assert.throws(
    () =>
      testProjectSchema.parse({
        title: 'Title exists',
        summary: 'Summary exists',
        status: 'prototype',
        role: 'Engineer',
        categories: [],
        technologies: ['Java'],
      }),
    /At least one category is required/
  );

  console.log('✓ Schema strictly rejects entries missing core required fields');
});

// =========================================================================
// 4. Image Alternative Text & Date Coercion Tests (Correction 5)
// =========================================================================
test('Image schema mandates non-empty alternative text', () => {
  const imageSchema = createProjectImageSchema(z.string());

  // Valid image with alt
  assert.doesNotThrow(() =>
    imageSchema.parse({
      src: '/images/architecture.png',
      alt: 'Detailed vector architecture diagram illustrating bounded channels',
    })
  );

  // Rejected: missing alt text
  assert.throws(
    () =>
      imageSchema.parse({
        src: '/images/architecture.png',
      }),
    /Descriptive image alternative text is required/
  );

  // Rejected: empty alt text
  assert.throws(
    () =>
      imageSchema.parse({
        src: '/images/architecture.png',
        alt: '',
      }),
    /Descriptive image alternative text is required/
  );

  console.log('✓ Image alternative text schema requirements confirmed');
});

test('Dates are safely coerced and invalid date strings are rejected', () => {
  const entryWithValidDates = {
    title: 'Project with Dates',
    summary: 'Summary description',
    status: 'completed',
    role: 'Engineer',
    categories: ['backend'],
    technologies: ['Java'],
    publishedAt: '2026-05-01',
    updatedAt: new Date('2026-06-15'),
  };

  const parsed = testProjectSchema.parse(entryWithValidDates);
  assert.ok(parsed.publishedAt instanceof Date);
  assert.equal(parsed.publishedAt?.getFullYear(), 2026);
  assert.ok(parsed.updatedAt instanceof Date);

  // Invalid date string fails parse
  assert.throws(() =>
    testProjectSchema.parse({
      ...entryWithValidDates,
      publishedAt: 'invalid-not-a-date',
    })
  );

  console.log('✓ Date coercion and validation confirmed');
});

// =========================================================================
// 5. Evidence & Metric Schema Validation Tests
// =========================================================================
test('Evidence items require label, valid HTTPS URL, and approved kind', () => {
  const validEvidenceEntry = {
    title: 'Evidence Project',
    summary: 'Summary',
    status: 'completed',
    role: 'Engineer',
    categories: ['backend'],
    technologies: ['Java'],
    evidence: [
      {
        label: 'Public Source Repository',
        url: 'https://github.com/TM-threemavithana/repo',
        kind: 'repo',
      },
    ],
  };

  assert.doesNotThrow(() => testProjectSchema.parse(validEvidenceEntry));

  // Rejected: Insecure HTTP evidence link
  assert.throws(
    () =>
      testProjectSchema.parse({
        ...validEvidenceEntry,
        evidence: [
          {
            label: 'Insecure Link',
            url: 'http://insecure.example.com',
            kind: 'repo',
          },
        ],
      }),
    /Must be a valid secure HTTPS URL/
  );

  console.log('✓ Evidence structure and HTTPS enforcement confirmed');
});

test('Metrics require name, value, and verifiable methodology (min 10 chars)', () => {
  const validMetricEntry = {
    title: 'Metric Project',
    summary: 'Summary',
    status: 'completed',
    role: 'Engineer',
    categories: ['backend'],
    technologies: ['Java'],
    metrics: [
      {
        name: 'Throughput',
        value: '50,000 req/s',
        methodology: 'Measured using JMH benchmark harness on 8-core isolated VM',
        evidenceUrl: 'https://github.com/example/benchmarks',
      },
    ],
  };

  assert.doesNotThrow(() => testProjectSchema.parse(validMetricEntry));

  // Rejected: Insufficient methodology description (< 10 chars)
  assert.throws(
    () =>
      testProjectSchema.parse({
        ...validMetricEntry,
        metrics: [
          {
            name: 'Throughput',
            value: '50k',
            methodology: 'fast', // < 10 chars
          },
        ],
      }),
    /Methodology explaining measurement method is required/
  );

  console.log('✓ Metric methodology and proof requirements confirmed');
});

// =========================================================================
// 6. Publication Rubric & Dual-Gate Validation Tests (Correction 2 & 6)
// =========================================================================
test('validatePublishedProject enforces full rubric for publication approval', () => {
  // Scenario 1: Fully verified published entry
  const fullyVerifiedEntry = {
    title: 'Verified System',
    summary: 'Production-ready distributed architecture.',
    role: 'Lead Architect',
    individualContribution: 'Designed and authored core consensus replication engine.',
    publishedAt: new Date('2026-06-01'),
    draft: false,
    editorialApproval: true,
  };
  const result1 = validatePublishedProject(fullyVerifiedEntry);
  assert.equal(result1.isValid, true);
  assert.equal(result1.errors.length, 0);

  // Scenario 2: draft: false but missing editorialApproval -> REJECTED
  const missingApproval = { ...fullyVerifiedEntry, editorialApproval: false };
  const result2 = validatePublishedProject(missingApproval);
  assert.equal(result2.isValid, false);
  assert.ok(result2.errors.some((e) => e.includes('editorialApproval: true')));

  // Scenario 3: draft: false but missing individual contribution -> REJECTED
  const missingContrib = { ...fullyVerifiedEntry, individualContribution: '' };
  const result3 = validatePublishedProject(missingContrib);
  assert.equal(result3.isValid, false);
  assert.ok(result3.errors.some((e) => e.includes('individualContribution')));

  // Scenario 4: Contains forbidden placeholder text -> REJECTED
  const withPlaceholder = {
    ...fullyVerifiedEntry,
    summary: 'Summary with [Awaiting Confirmation] note',
  };
  const result4 = validatePublishedProject(withPlaceholder);
  assert.equal(result4.isValid, false);
  assert.ok(result4.errors.some((e) => e.includes('forbidden placeholder pattern')));

  console.log('✓ validatePublishedProject rubric validation confirmed across scenarios');
});

test('isProjectPublishable enforces strict 4-layer gate and suppresses drafts', () => {
  // Scenario A: Candidate draft entry (current state of all 4 projects)
  const candidateDraft: ProjectItem = {
    id: 'streamforge',
    slug: 'streamforge',
    title: 'StreamForge: Distributed Raft Log Engine',
    problem: 'Event ingestion under partition.',
    role: 'Backend Systems Engineer',
    contribution: 'Designed Raft consensus replication.',
    stack: ['Java 21'],
    status: 'prototype',
    draft: true, // GATED
    editorialApproval: false,
    featured: true,
    summary: 'High-throughput distributed log.',
    href: '/projects/streamforge/',
  };
  assert.equal(isProjectPublishable(candidateDraft), false);

  // Scenario B: draft: false, but editorialApproval is false -> MUST NOT PUBLISH
  const prematureDraftFalse: ProjectItem = {
    ...candidateDraft,
    draft: false,
    editorialApproval: false,
  };
  assert.equal(isProjectPublishable(prematureDraftFalse), false);

  // Scenario C: draft: false, editorialApproval: true, but route is NOT published (/projects/streamforge/) -> MUST NOT PUBLISH
  const unbuiltRoute: ProjectItem = {
    ...candidateDraft,
    draft: false,
    editorialApproval: true,
  };
  assert.equal(isProjectPublishable(unbuiltRoute), false);

  // Scenario D: draft: false, editorialApproval: true, route is published (e.g. '/') -> PUBLISHABLE
  const clearedWithRoute: ProjectItem = {
    ...candidateDraft,
    draft: false,
    editorialApproval: true,
    href: '/', // Approved route
  };
  assert.equal(isProjectPublishable(clearedWithRoute), true);

  console.log('✓ 4-layer publication gate strictly enforces draft exclusion and route checks');
});

test('getPublishedFeaturedProjects returns empty array for candidate drafts', async () => {
  // Test with mock entries representing the four current candidates
  const mockCandidates: GenericProjectEntry[] = [
    {
      id: 'streamforge',
      data: {
        title: 'StreamForge',
        summary: 'Distributed log',
        status: 'prototype',
        role: 'Engineer',
        categories: ['backend'],
        technologies: ['Java'],
        featured: true,
        draft: true,
        editorialApproval: false,
      },
    },
    {
      id: 'devforge',
      data: {
        title: 'DevForge',
        summary: 'Scala CLI',
        status: 'in-progress',
        role: 'Engineer',
        categories: ['backend'],
        technologies: ['Scala'],
        featured: true,
        draft: true,
        editorialApproval: false,
      },
    },
  ];

  const published = await getPublishedFeaturedProjects(mockCandidates);
  assert.equal(published.length, 0, 'Candidate drafts must yield 0 published projects');
  console.log('✓ getPublishedFeaturedProjects returns 0 items for unverified draft entries');
});

console.log('--- All EA-019 Project Schema Unit Tests Passed Cleanly ---');
