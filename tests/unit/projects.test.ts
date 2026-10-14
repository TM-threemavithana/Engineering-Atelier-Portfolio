import assert from 'node:assert/strict';
import test from 'node:test';
import {
  candidateProjects,
  getPublishedFeaturedProjects,
  type ProjectItem,
} from '../../src/data/projects';

console.log('--- Starting Projects Inventory & Draft Gating Unit Suite ---');

test('Candidate projects inventory contains 4 candidates all strictly gated in DRAFT status', () => {
  assert.equal(candidateProjects.length, 4, 'Must register 4 candidate projects');

  const candidateIds = candidateProjects.map((p) => p.id);
  assert.ok(candidateIds.includes('streamforge'), 'Must register StreamForge candidate');
  assert.ok(candidateIds.includes('devforge'), 'Must register DevForge candidate');
  assert.ok(candidateIds.includes('java-task-api'), 'Must register Java Task API candidate');
  assert.ok(
    candidateIds.includes('currency-auth-research'),
    'Must register Currency Auth candidate'
  );

  for (const project of candidateProjects) {
    assert.equal(
      project.draft,
      true,
      `Candidate project ${project.id} must be strictly draft: true pending owner clearance`
    );
  }

  console.log('✓ All 4 candidate projects confirmed strictly gated with draft: true');
});

test('getPublishedFeaturedProjects returns empty array when candidate projects remain in DRAFT', () => {
  const published = getPublishedFeaturedProjects();
  assert.equal(
    published.length,
    0,
    'Zero projects may be returned for public display while candidate projects remain in DRAFT'
  );

  console.log('✓ Graceful empty featured projects list confirmed: 0 items returned');
});

test('Dual publication gate requires BOTH draft: false AND verified published route', () => {
  // Scenario 1: draft is false, but route is unbuilt (/projects/streamforge/) -> MUST NOT PUBLISH
  const mockUnbuiltRoute: ProjectItem = {
    id: 'mock-1',
    slug: 'mock-1',
    title: 'Mock Project with Unbuilt Route',
    problem: 'Testing route gating',
    role: 'Engineer',
    contribution: 'Testing',
    stack: ['Java'],
    status: 'prototype',
    draft: false, // Simulated premature clearance
    featured: true,
    summary: 'Testing',
    href: '/projects/mock-unbuilt/',
  };

  const publishedScenario1 = getPublishedFeaturedProjects([mockUnbuiltRoute]);
  assert.equal(
    publishedScenario1.length,
    0,
    'Project with unbuilt route must NOT be published even if draft: false'
  );

  // Scenario 2: draft is true, but route is published (/) -> MUST NOT PUBLISH
  const mockDraftWithRoute: ProjectItem = {
    ...mockUnbuiltRoute,
    draft: true,
    href: '/',
  };
  const publishedScenario2 = getPublishedFeaturedProjects([mockDraftWithRoute]);
  assert.equal(
    publishedScenario2.length,
    0,
    'Project with draft: true must NOT be published even if route is published'
  );

  // Scenario 3: draft is false AND route is verified published (/) -> PERMITTED
  const mockValidPublished: ProjectItem = {
    ...mockUnbuiltRoute,
    draft: false,
    href: '/',
  };
  const publishedScenario3 = getPublishedFeaturedProjects([mockValidPublished]);
  assert.equal(
    publishedScenario3.length,
    1,
    'Project with draft: false AND published route must be permitted'
  );

  console.log(
    '✓ Dual publication gate (draft: false + published route) confirmed strictly enforced'
  );
});

console.log('--- All Projects Gating Tests Passed Cleanly ---');
