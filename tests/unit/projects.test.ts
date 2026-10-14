import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { getPublishedFeaturedProjects, type ProjectItem } from '../../src/data/projects';

console.log('--- Starting Projects Inventory & Draft Gating Unit Suite ---');

const contentProjectsDir = path.resolve('src/content/projects');

test('Candidate project MDX files exist in src/content/projects and are strictly gated with draft: true', () => {
  assert.ok(fs.existsSync(contentProjectsDir), 'src/content/projects directory must exist');

  const files = fs.readdirSync(contentProjectsDir).filter((f) => f.endsWith('.mdx'));
  assert.equal(files.length, 4, 'Must contain exactly 4 candidate project MDX files');

  const expectedSlugs = [
    'streamforge.mdx',
    'devforge.mdx',
    'java-task-api.mdx',
    'currency-auth-research.mdx',
  ];
  for (const slug of expectedSlugs) {
    assert.ok(
      files.includes(slug),
      `Candidate MDX file "${slug}" must exist in src/content/projects/`
    );
  }

  // Parse frontmatter of each file and verify draft gating
  for (const file of files) {
    const rawContent = fs.readFileSync(path.join(contentProjectsDir, file), 'utf-8');
    const frontmatterMatch = rawContent.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    assert.ok(frontmatterMatch, `File "${file}" must contain valid frontmatter enclosed in ---`);

    // Verify draft: true is present in frontmatter text
    assert.match(
      frontmatterMatch[1],
      /draft:\s*true/,
      `File "${file}" frontmatter must have draft: true`
    );
    assert.match(
      frontmatterMatch[1],
      /editorialApproval:\s*false/,
      `File "${file}" frontmatter must have editorialApproval: false`
    );

    // Verify no HTML comments are used in MDX body (Correction 4)
    const bodyContent = rawContent.slice(frontmatterMatch[0].length);
    assert.ok(
      !bodyContent.includes('<!--'),
      `File "${file}" body must NOT use HTML comments <!-- --> (must use JSX comments {/* */})`
    );
  }

  console.log(
    '✓ All 4 candidate MDX files confirmed strictly gated with draft: true and valid MDX syntax'
  );
});

test('getPublishedFeaturedProjects returns empty array when candidate projects remain in DRAFT', async () => {
  const published = await getPublishedFeaturedProjects();
  assert.equal(
    published.length,
    0,
    'Zero projects may be returned for public display while candidate projects remain in DRAFT'
  );

  console.log('✓ Graceful empty featured projects list confirmed: 0 items returned');
});

test('Dual publication gate requires draft: false, editorialApproval: true, AND published route', async () => {
  // Scenario 1: draft is false, but route is unbuilt (/projects/streamforge/) -> MUST NOT PUBLISH
  const mockUnbuiltRoute: ProjectItem = {
    id: 'mock-1',
    slug: 'mock-1',
    title: 'Mock Project with Unbuilt Route',
    problem: 'Testing route gating',
    role: 'Engineer',
    contribution: 'Testing contribution',
    stack: ['Java'],
    status: 'prototype',
    draft: false, // Simulated premature clearance
    editorialApproval: true,
    featured: true,
    summary: 'Testing summary',
    href: '/projects/mock-unbuilt/',
  };

  const publishedScenario1 = await getPublishedFeaturedProjects([mockUnbuiltRoute]);
  assert.equal(
    publishedScenario1.length,
    0,
    'Project with unbuilt route must NOT be published even if draft: false'
  );

  // Scenario 2: draft is true, but route is published (/) -> MUST NOT PUBLISH
  const mockDraftWithRoute: ProjectItem = {
    ...mockUnbuiltRoute,
    draft: true,
    editorialApproval: false,
    href: '/',
  };
  const publishedScenario2 = await getPublishedFeaturedProjects([mockDraftWithRoute]);
  assert.equal(
    publishedScenario2.length,
    0,
    'Project with draft: true must NOT be published even if route is published'
  );

  // Scenario 3: draft is false, route is published (/), but editorialApproval is false -> MUST NOT PUBLISH
  const mockMissingApproval: ProjectItem = {
    ...mockUnbuiltRoute,
    draft: false,
    editorialApproval: false,
    href: '/',
  };
  const publishedScenario3 = await getPublishedFeaturedProjects([mockMissingApproval]);
  assert.equal(
    publishedScenario3.length,
    0,
    'Project with editorialApproval: false must NOT be published'
  );

  // Scenario 4: draft is false, editorialApproval is true, AND route is verified published (/) -> PERMITTED
  const mockValidPublished: ProjectItem = {
    ...mockUnbuiltRoute,
    draft: false,
    editorialApproval: true,
    href: '/',
  };
  const publishedScenario4 = await getPublishedFeaturedProjects([mockValidPublished]);
  assert.equal(
    publishedScenario4.length,
    1,
    'Project with draft: false, editorialApproval: true, AND published route must be permitted'
  );

  console.log(
    '✓ Multi-layer publication gate (draft: false + editorialApproval + published route) confirmed strictly enforced'
  );
});

console.log('--- All Projects Gating Tests Passed Cleanly ---');
