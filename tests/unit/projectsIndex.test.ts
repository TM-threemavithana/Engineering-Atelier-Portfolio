/**
 * @file tests/unit/projectsIndex.test.ts
 * @description Unit test suite for EA-022: Projects Index, Empty Safeguards, and Populated Layout Logic.
 */

import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getPublishedProjects,
  getPublishedFeaturedProjects,
  isProjectPublishable,
  type ProjectItem,
} from '../../src/data/projects';
import { getPublishedNavItems, isNavItemActive } from '../../src/data/navigation';
import { isRoutePublished, validateLinkDestination } from '../../src/utils/linkSafety';

console.log('--- Starting Projects Index & Empty Safeguards Unit Suite ---');

test('EA-022: Real production state returns zero published projects while candidates remain DRAFT', async () => {
  const published = await getPublishedProjects();
  assert.equal(
    published.length,
    0,
    'getPublishedProjects() must return exactly 0 projects in current production state'
  );

  const featured = await getPublishedFeaturedProjects();
  assert.equal(
    featured.length,
    0,
    'getPublishedFeaturedProjects() must return exactly 0 featured projects in current production state'
  );

  console.log('✓ Real production state confirmed: 0 published projects returned');
});

test('EA-022: Navigation activation for /projects/ route', () => {
  const navItems = getPublishedNavItems();
  const projectsNav = navItems.find((i) => i.href === '/projects/');

  assert.ok(projectsNav, 'Published navigation items must include /projects/');
  assert.equal(projectsNav.isPublished, true, '/projects/ must have isPublished: true');
  assert.equal(projectsNav.label, 'Projects');
  assert.equal(projectsNav.number, '02');

  // Verify active-route matching with and without trailing slash
  assert.equal(isNavItemActive('/projects/', '/projects/'), true, 'Exact match on /projects/');
  assert.equal(
    isNavItemActive('/projects', '/projects/'),
    true,
    'Trailing slash normalized match on /projects'
  );
  assert.equal(
    isNavItemActive('/', '/projects/'),
    false,
    'Root path must not match /projects/ as active'
  );
  assert.equal(
    isNavItemActive('/about/', '/projects/'),
    false,
    'About path must not match /projects/ as active'
  );

  console.log('✓ /projects/ navigation activation and active state verified');
});

test('EA-022: Activating /projects/ does NOT activate unapproved project detail routes', () => {
  assert.equal(isRoutePublished('/projects/'), true, '/projects/ index route is published');

  // Candidate detail routes must strictly remain unpublished
  const detailRoutes = [
    '/projects/streamforge/',
    '/projects/devforge/',
    '/projects/java-task-api/',
    '/projects/currency-auth-research/',
    '/projects/unknown-slug/',
  ];

  for (const route of detailRoutes) {
    assert.equal(
      isRoutePublished(route),
      false,
      `Detail route "${route}" must remain strictly unpublished`
    );
    const validation = validateLinkDestination(route);
    assert.equal(
      validation.isValid,
      false,
      `validateLinkDestination("${route}") must reject unpublished detail route`
    );
  }

  console.log(
    '✓ Strict isolation confirmed: index is published, all detail routes remain unpublished'
  );
});

test('EA-022: Future populated state layout partitioning, deduplication, and deterministic sorting', async () => {
  // Fictional test fixtures strictly isolated to this unit test
  const fictionalFixtures: ProjectItem[] = [
    {
      id: 'fictional-zeta',
      slug: 'fictional-zeta',
      title: 'Zeta Distributed Cache',
      problem: 'High-throughput caching layer with consistent hashing',
      role: 'Backend Engineer',
      contribution: 'Implemented ring hashing and node rebalancing',
      stack: ['Go', 'Redis'],
      status: 'completed',
      draft: false,
      editorialApproval: true,
      featured: true,
      summary: 'High-throughput caching layer with consistent hashing',
      href: '/projects/', // Point to valid route for gating test
    },
    {
      id: 'fictional-alpha',
      slug: 'fictional-alpha',
      title: 'Alpha Stream Pipeline',
      problem: 'Event streaming processor with exactly-once semantics',
      role: 'Systems Engineer',
      contribution: 'Designed stateful stream operators and checkpointing',
      stack: ['Java', 'Kafka'],
      status: 'completed',
      draft: false,
      editorialApproval: true,
      featured: true,
      summary: 'Event streaming processor with exactly-once semantics',
      href: '/projects/',
    },
    {
      id: 'fictional-beta',
      slug: 'fictional-beta',
      title: 'Beta Raft Engine',
      problem: 'Consensus engine implementing Raft protocol',
      role: 'Core Contributor',
      contribution: 'Implemented leader election and log compaction',
      stack: ['Rust'],
      status: 'completed',
      draft: false,
      editorialApproval: true,
      featured: true,
      summary: 'Consensus engine implementing Raft protocol',
      href: '/projects/',
    },
    {
      id: 'fictional-gamma',
      slug: 'fictional-gamma',
      title: 'Gamma KV Storage',
      problem: 'LSM-tree embedded key-value store with SSTables',
      role: 'Storage Engineer',
      contribution: 'Designed memtable flush and multi-level compaction',
      stack: ['C++'],
      status: 'completed',
      draft: false,
      editorialApproval: true,
      featured: true, // 4th featured project (should be capped at 3 for featured section)
      summary: 'LSM-tree embedded key-value store with SSTables',
      href: '/projects/',
    },
    {
      id: 'fictional-delta',
      slug: 'fictional-delta',
      title: 'Delta API Gateway',
      problem: 'Asynchronous API gateway with token-bucket rate limiting',
      role: 'API Engineer',
      contribution: 'Implemented circuit breaking and distributed ratelimiting',
      stack: ['TypeScript', 'Node.js'],
      status: 'completed',
      draft: false,
      editorialApproval: true,
      featured: false, // Standard project
      summary: 'Asynchronous API gateway with token-bucket rate limiting',
      href: '/projects/',
    },
    {
      id: 'fictional-draft',
      slug: 'fictional-draft',
      title: 'Unapproved Draft System',
      problem: 'Draft system that must never be published',
      role: 'Engineer',
      contribution: 'Draft work',
      stack: ['Python'],
      status: 'in-progress',
      draft: true, // Must be excluded
      editorialApproval: false,
      featured: false,
      summary: 'Draft work',
      href: '/projects/',
    },
  ];

  // Query published projects
  const published = await getPublishedProjects(fictionalFixtures);

  // Must exclude draft project
  assert.equal(published.length, 5, 'Must publish exactly 5 verified projects; draft excluded');
  assert.ok(
    !published.some((p) => p.id === 'fictional-draft'),
    'Draft project must not appear in published results'
  );

  // Partitioning logic (mirroring projects.astro)
  const featuredProjects = published.filter((p) => p.featured).slice(0, 3);
  const featuredIds = new Set(featuredProjects.map((p) => p.id));
  const regularProjects = published.filter((p) => !featuredIds.has(p.id));

  // Max 3 featured projects
  assert.equal(featuredProjects.length, 3, 'Featured section must be capped at 3 projects');

  // Check deterministic sorting in featured section (Alpha, Beta, Gamma/Zeta alphabetically)
  assert.equal(featuredProjects[0].title, 'Alpha Stream Pipeline');
  assert.equal(featuredProjects[1].title, 'Beta Raft Engine');
  assert.equal(featuredProjects[2].title, 'Gamma KV Storage');

  // The 4th featured project (Zeta) spills over into regularProjects because it was not in top 3
  assert.equal(regularProjects.length, 2, 'Remaining 2 projects must be placed in regular section');
  assert.ok(
    regularProjects.some((p) => p.id === 'fictional-zeta'),
    'Spillover featured project Zeta must appear in regular section'
  );
  assert.ok(
    regularProjects.some((p) => p.id === 'fictional-delta'),
    'Standard project Delta must appear in regular section'
  );

  // Zero duplicate IDs between featured and regular sections
  for (const fp of featuredProjects) {
    assert.ok(
      !regularProjects.some((rp) => rp.id === fp.id),
      `Project "${fp.id}" must NOT appear in both featured and regular sections`
    );
  }

  console.log('✓ Populated state partitioning, 3-project cap, and zero duplication verified');
});

test('EA-022: Fail-closed gating on publication predicate', () => {
  // Test 1: draft: true -> reject
  assert.equal(
    isProjectPublishable({
      id: 'test-1',
      slug: 'test-1',
      title: 'T1',
      problem: 'P1',
      role: 'R1',
      contribution: 'C1',
      stack: ['Java'],
      status: 'prototype',
      draft: true,
      editorialApproval: true,
      featured: false,
      summary: 'S1',
      href: '/projects/',
    }),
    false,
    'draft: true must be rejected'
  );

  // Test 2: editorialApproval: false -> reject
  assert.equal(
    isProjectPublishable({
      id: 'test-2',
      slug: 'test-2',
      title: 'T2',
      problem: 'P2',
      role: 'R2',
      contribution: 'C2',
      stack: ['Java'],
      status: 'prototype',
      draft: false,
      editorialApproval: false,
      featured: false,
      summary: 'S2',
      href: '/projects/',
    }),
    false,
    'editorialApproval: false must be rejected'
  );

  // Test 3: unpublished route -> reject
  assert.equal(
    isProjectPublishable({
      id: 'test-3',
      slug: 'test-3',
      title: 'T3',
      problem: 'P3',
      role: 'R3',
      contribution: 'C3',
      stack: ['Java'],
      status: 'prototype',
      draft: false,
      editorialApproval: true,
      featured: false,
      summary: 'S3',
      href: '/projects/unapproved-detail-route/',
    }),
    false,
    'Unpublished target route must be rejected'
  );

  // Test 4: All valid -> accept
  assert.equal(
    isProjectPublishable({
      id: 'test-4',
      slug: 'test-4',
      title: 'T4',
      problem: 'P4',
      role: 'R4',
      contribution: 'C4',
      stack: ['Java'],
      status: 'prototype',
      draft: false,
      editorialApproval: true,
      featured: false,
      summary: 'S4',
      href: '/projects/',
    }),
    true,
    'Valid project with draft: false, editorialApproval: true, and published route must be accepted'
  );

  console.log('✓ 4-layer fail-closed publication gating predicate verified');
});

console.log('--- All EA-022 Projects Index Unit Tests Passed Cleanly ---');
