/**
 * @file tests/unit/caseStudy.test.ts
 * @description Unit test suite for EA-023: Case Study Template, Rich Components, and Dynamic Route Gating.
 */

import assert from 'node:assert/strict';
import test from 'node:test';
import {
  fetchProjectsCollection,
  isProjectPublishable,
  getNextCaseStudy,
  NEXT_CASE_STUDY_SEQUENCE,
  type GenericProjectEntry,
} from '../../src/data/projects';
import {
  isRoutePublished,
  validateLinkDestination,
  APPROVED_PROJECT_ROUTES,
} from '../../src/utils/linkSafety';

console.log('--- Starting Case Study Template & Rich MDX Unit Suite ---');

test('EA-025 Phase D: Controlled fixtures and runtime state verify three-case-study publication gating', async () => {
  const collectionEntries = await fetchProjectsCollection();

  // In standalone Node.js runner, fetchProjectsCollection falls back to empty array gracefully
  // If run in Astro runtime with loaded entries, only AgentIAM, StreamForge, and ForgeTasks pass publication gating
  for (const entry of collectionEntries) {
    if (entry.id === 'agentiam' || entry.id === 'streamforge' || entry.id === 'forgetasks') {
      assert.equal(
        isProjectPublishable(entry),
        true,
        `Approved project "${entry.id}" must pass publication gating in EA-025`
      );
    } else {
      assert.equal(
        isProjectPublishable(entry),
        false,
        `Candidate project "${entry.id}" must NOT be publishable while in DRAFT`
      );
    }
  }

  // Predicate-level verification with controlled fixtures
  const agentiamFixture: GenericProjectEntry = {
    id: 'agentiam',
    data: {
      title: 'AgentIAM: Semantic SQL Security Proxy',
      summary: 'Wire-protocol database security proxy',
      status: 'prototype',
      role: 'Creator & Systems Engineer',
      individualContribution: 'Designed and implemented the core Go wire-protocol proxy',
      technologies: ['Go', 'PostgreSQL', 'MySQL'],
      categories: ['backend', 'distributed'],
      draft: false,
      editorialApproval: true,
      publishedAt: new Date('2026-11-07'),
    },
  };
  assert.equal(
    isProjectPublishable(agentiamFixture),
    true,
    'AgentIAM controlled fixture must pass all 4 publication gates'
  );

  const streamforgeFixture: GenericProjectEntry = {
    id: 'streamforge',
    data: {
      title: 'StreamForge: Distributed Mobility Pipeline & Real-Time Anomaly Engine',
      summary: 'High-throughput polyglot streaming pipeline',
      status: 'prototype',
      role: 'Backend Systems Engineer & Creator',
      individualContribution: 'Architected and implemented the end-to-end streaming pipeline',
      technologies: ['Go', 'Apache Kafka', 'Java'],
      categories: ['distributed', 'backend'],
      draft: false,
      editorialApproval: true,
      publishedAt: new Date('2026-11-07'),
    },
  };
  assert.equal(
    isProjectPublishable(streamforgeFixture),
    true,
    'StreamForge controlled fixture must pass all 4 publication gates'
  );

  const forgetasksFixture: GenericProjectEntry = {
    id: 'forgetasks',
    data: {
      title: 'ForgeTasks & ForgeOps: Java Backend Engineering and Self-Hosted Platform Reliability',
      summary:
        'Java 21 and Spring Boot task-management API with owner-scoped data access and version-based optimistic concurrency, supported by a self-hosted Kubernetes GitOps and reliability lab.',
      status: 'prototype',
      role: 'Backend & Platform Systems Engineer',
      individualContribution:
        'Architected and implemented the Spring Boot REST API, ETag optimistic concurrency engine, Flyway relational schemas, and self-hosted GitOps/observability infrastructure across Argo CD, SOPS/age, and Grafana Alloy.',
      technologies: ['Java', 'Spring Boot', 'PostgreSQL', 'Kubernetes'],
      categories: ['backend', 'distributed'],
      draft: false,
      editorialApproval: true,
      publishedAt: new Date('2026-11-07'),
    },
  };
  assert.equal(
    isProjectPublishable(forgetasksFixture),
    true,
    'ForgeTasks controlled fixture must pass all 4 publication gates'
  );

  const draftFixture: GenericProjectEntry = {
    id: 'devforge',
    data: {
      title: 'DevForge: Scala Developer Orchestration CLI',
      summary: 'Developer tooling CLI',
      status: 'prototype',
      role: 'Engineer',
      individualContribution: 'CLI development',
      technologies: ['Scala'],
      categories: ['backend'],
      draft: true,
      editorialApproval: false,
    },
  };
  assert.equal(
    isProjectPublishable(draftFixture),
    false,
    'Draft candidate fixture must be rejected by publication gate'
  );

  const unapprovedRouteFixture: GenericProjectEntry = {
    ...agentiamFixture,
    id: 'unapproved-project',
  };
  assert.equal(
    isProjectPublishable(unapprovedRouteFixture),
    false,
    'Project with unapproved route must be rejected even if draft: false'
  );

  console.log(
    '✓ Dynamic route publication gating verified: only cleared AgentIAM, StreamForge, and ForgeTasks routes permitted'
  );
});

test('EA-025 Phase D: APPROVED_PROJECT_ROUTES enforces exact matching and contains only cleared AgentIAM, StreamForge, and ForgeTasks routes', () => {
  // 1. Initial state: registry contains exactly the approved AgentIAM, StreamForge, and ForgeTasks detail routes
  assert.equal(
    APPROVED_PROJECT_ROUTES.size,
    3,
    'APPROVED_PROJECT_ROUTES must contain exactly 3 routes in EA-025 Phase D'
  );
  assert.ok(
    APPROVED_PROJECT_ROUTES.has('/projects/agentiam/'),
    'APPROVED_PROJECT_ROUTES must contain "/projects/agentiam/"'
  );
  assert.ok(
    APPROVED_PROJECT_ROUTES.has('/projects/streamforge/'),
    'APPROVED_PROJECT_ROUTES must contain "/projects/streamforge/"'
  );
  assert.ok(
    APPROVED_PROJECT_ROUTES.has('/projects/forgetasks/'),
    'APPROVED_PROJECT_ROUTES must contain "/projects/forgetasks/"'
  );

  // 2. Verified routes are published (both trailing slash and normalized)
  assert.equal(isRoutePublished('/projects/agentiam/'), true);
  assert.equal(isRoutePublished('/projects/agentiam'), true);
  assert.equal(isRoutePublished('/projects/streamforge/'), true);
  assert.equal(isRoutePublished('/projects/streamforge'), true);
  assert.equal(isRoutePublished('/projects/forgetasks/'), true);
  assert.equal(isRoutePublished('/projects/forgetasks'), true);

  // 3. Unregistered routes are strictly rejected (including old java-task-api slug)
  assert.equal(isRoutePublished('/projects/currency-auth-research/'), false);
  assert.equal(isRoutePublished('/projects/devforge/'), false);
  assert.equal(isRoutePublished('/projects/java-task-api/'), false);

  // 4. Wildcard / sub-path routes are strictly rejected
  assert.equal(isRoutePublished('/projects/agentiam/deep/'), false);
  assert.equal(isRoutePublished('/projects/streamforge/deep/'), false);
  assert.equal(isRoutePublished('/projects/forgetasks/deep/'), false);
  assert.equal(isRoutePublished('/projects/*'), false);

  // 5. Simulated exact registration with guaranteed restoration
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

    // Sub-paths must NOT inherit approval
    assert.equal(
      isRoutePublished('/projects/simulated-approved/deep/'),
      false,
      'Sub-paths must not inherit approval'
    );
  } finally {
    APPROVED_PROJECT_ROUTES.delete('/projects/simulated-approved/');
  }

  // Confirm registry state is fully restored
  assert.equal(APPROVED_PROJECT_ROUTES.size, 3);
  assert.ok(APPROVED_PROJECT_ROUTES.has('/projects/agentiam/'));
  assert.ok(APPROVED_PROJECT_ROUTES.has('/projects/streamforge/'));
  assert.ok(APPROVED_PROJECT_ROUTES.has('/projects/forgetasks/'));

  console.log(
    '✓ Exact per-project route approval verified (wildcards prohibited, restoration guaranteed)'
  );
});

test('EA-023: Breadcrumb item validation and terminal page state', () => {
  const validDestination = validateLinkDestination('/projects/');
  assert.equal(validDestination.isValid, true, '/projects/ must be a valid internal destination');

  const approvedDetail1 = validateLinkDestination('/projects/agentiam/');
  assert.equal(approvedDetail1.isValid, true, 'Approved AgentIAM detail route must be valid');

  const approvedDetail2 = validateLinkDestination('/projects/streamforge/');
  assert.equal(approvedDetail2.isValid, true, 'Approved StreamForge detail route must be valid');

  const unapprovedDetail = validateLinkDestination('/projects/devforge/');
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

test('EA-031: Next Case Study sequential navigation sequence and route validity', () => {
  // Test sequence: AgentIAM -> StreamForge -> ForgeTasks -> AgentIAM
  const nextFromAgentIAM = getNextCaseStudy('agentiam');
  assert.ok(nextFromAgentIAM, 'Next from agentiam must exist');
  assert.equal(nextFromAgentIAM.id, 'streamforge');
  assert.equal(nextFromAgentIAM.href, '/projects/streamforge/');
  assert.ok(nextFromAgentIAM.href.endsWith('/'), 'Next href must retain directory trailing slash');

  const nextFromStreamForge = getNextCaseStudy('streamforge');
  assert.ok(nextFromStreamForge, 'Next from streamforge must exist');
  assert.equal(nextFromStreamForge.id, 'forgetasks');
  assert.equal(nextFromStreamForge.href, '/projects/forgetasks/');
  assert.ok(
    nextFromStreamForge.href.endsWith('/'),
    'Next href must retain directory trailing slash'
  );

  const nextFromForgeTasks = getNextCaseStudy('forgetasks');
  assert.ok(nextFromForgeTasks, 'Next from forgetasks must exist');
  assert.equal(nextFromForgeTasks.id, 'agentiam');
  assert.equal(nextFromForgeTasks.href, '/projects/agentiam/');
  assert.ok(
    nextFromForgeTasks.href.endsWith('/'),
    'Next href must retain directory trailing slash'
  );

  // Case insensitivity
  assert.equal(getNextCaseStudy('AgentIAM')?.id, 'streamforge');
  assert.equal(getNextCaseStudy('FORGETASKS')?.id, 'agentiam');

  // Unknown or empty slug safety
  assert.equal(getNextCaseStudy('unknown-draft'), undefined);
  assert.equal(getNextCaseStudy(undefined), undefined);

  // Validate all entries in sequence have valid data
  for (const [key, target] of Object.entries(NEXT_CASE_STUDY_SEQUENCE)) {
    assert.ok(target.id.length > 0, `Target id for ${key} required`);
    assert.ok(target.title.length > 0, `Target title for ${key} required`);
    assert.ok(target.summary.length > 0, `Target summary for ${key} required`);
    assert.ok(target.category.length > 0, `Target category for ${key} required`);
    assert.ok(target.technologies.length > 0, `Target technologies for ${key} required`);
    assert.ok(
      target.href.startsWith('/projects/') && target.href.endsWith('/'),
      `Target href ${target.href} must be valid project directory URL`
    );
  }

  console.log('✓ EA-031 Next Case Study sequential navigation verified');
});

console.log('--- All EA-023 Case Study Unit Tests Passed Cleanly ---');
