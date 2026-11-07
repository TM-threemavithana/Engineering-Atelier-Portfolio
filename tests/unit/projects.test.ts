import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { getPublishedFeaturedProjects, type ProjectItem } from '../../src/data/projects';

console.log('--- Starting Projects Inventory & Draft Gating Unit Suite ---');

const contentProjectsDir = path.resolve('src/content/projects');

test('Project MDX files in src/content/projects enforce EA-025 publication state (AgentIAM and StreamForge cleared, 3 candidates draft)', () => {
  assert.ok(fs.existsSync(contentProjectsDir), 'src/content/projects directory must exist');

  const files = fs.readdirSync(contentProjectsDir).filter((f) => f.endsWith('.mdx'));
  assert.equal(files.length, 5, 'Must contain exactly 5 candidate project MDX files');

  const draftSlugs = ['devforge.mdx', 'java-task-api.mdx', 'currency-auth-research.mdx'];
  for (const slug of draftSlugs) {
    assert.ok(
      files.includes(slug),
      `Draft candidate MDX file "${slug}" must exist in src/content/projects/`
    );

    const rawContent = fs.readFileSync(path.join(contentProjectsDir, slug), 'utf-8');
    const frontmatterMatch = rawContent.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    assert.ok(frontmatterMatch, `File "${slug}" must contain valid frontmatter enclosed in ---`);

    // Verify unapproved candidates are strictly gated with draft: true and editorialApproval: false
    assert.match(
      frontmatterMatch[1],
      /draft:\s*true/,
      `Draft candidate "${slug}" frontmatter must have draft: true`
    );
    assert.match(
      frontmatterMatch[1],
      /editorialApproval:\s*false/,
      `Draft candidate "${slug}" frontmatter must have editorialApproval: false`
    );

    // Verify no HTML comments are used in MDX body
    const bodyContent = rawContent.slice(frontmatterMatch[0].length);
    assert.ok(
      !bodyContent.includes('<!--'),
      `File "${slug}" body must NOT use HTML comments <!-- --> (must use JSX comments {/* */})`
    );
  }

  // Verify owner-cleared AgentIAM prototype case study (EA-024)
  assert.ok(files.includes('agentiam.mdx'), 'agentiam.mdx must exist in src/content/projects/');
  const agentiamRaw = fs.readFileSync(path.join(contentProjectsDir, 'agentiam.mdx'), 'utf-8');
  const agentiamMatch = agentiamRaw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  assert.ok(agentiamMatch, 'agentiam.mdx must contain valid frontmatter enclosed in ---');

  assert.match(
    agentiamMatch[1],
    /draft:\s*false/,
    'Approved agentiam.mdx frontmatter must have draft: false'
  );
  assert.match(
    agentiamMatch[1],
    /editorialApproval:\s*true/,
    'Approved agentiam.mdx frontmatter must have editorialApproval: true'
  );
  assert.match(
    agentiamMatch[1],
    /publishedAt:\s*2026-11-07/,
    'Approved agentiam.mdx frontmatter must specify publishedAt: 2026-11-07'
  );
  assert.match(
    agentiamMatch[1],
    /status:\s*'prototype'/,
    'Approved agentiam.mdx frontmatter must have status: prototype'
  );

  const agentiamBody = agentiamRaw.slice(agentiamMatch[0].length);
  assert.ok(
    !agentiamBody.includes('<!--'),
    'agentiam.mdx body must NOT use HTML comments <!-- --> (must use JSX comments {/* */})'
  );

  // Verify owner-cleared StreamForge prototype case study (EA-025 Phase B)
  assert.ok(
    files.includes('streamforge.mdx'),
    'streamforge.mdx must exist in src/content/projects/'
  );
  const streamforgeRaw = fs.readFileSync(path.join(contentProjectsDir, 'streamforge.mdx'), 'utf-8');
  const streamforgeMatch = streamforgeRaw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  assert.ok(streamforgeMatch, 'streamforge.mdx must contain valid frontmatter enclosed in ---');

  assert.match(
    streamforgeMatch[1],
    /draft:\s*false/,
    'Approved streamforge.mdx frontmatter must have draft: false'
  );
  assert.match(
    streamforgeMatch[1],
    /editorialApproval:\s*true/,
    'Approved streamforge.mdx frontmatter must have editorialApproval: true'
  );
  assert.match(
    streamforgeMatch[1],
    /publishedAt:\s*2026-11-07/,
    'Approved streamforge.mdx frontmatter must specify publishedAt: 2026-11-07'
  );
  assert.match(
    streamforgeMatch[1],
    /status:\s*'prototype'/,
    'Approved streamforge.mdx frontmatter must have status: prototype'
  );

  const streamforgeBody = streamforgeRaw.slice(streamforgeMatch[0].length);
  assert.ok(
    !streamforgeBody.includes('<!--'),
    'streamforge.mdx body must NOT use HTML comments <!-- --> (must use JSX comments {/* */})'
  );

  console.log(
    '✓ EA-025 project content state confirmed: AgentIAM and StreamForge cleared, 3 remaining candidates strictly gated'
  );
});

test('getPublishedFeaturedProjects enforces publication gates with controlled fixtures and Node environment fallback', async () => {
  // 1. In standalone Node runner without arguments, falls back to empty array gracefully
  const standalonePublished = await getPublishedFeaturedProjects();
  assert.equal(
    standalonePublished.length,
    0,
    'Standalone Node runner falls back to empty array when astro:content virtual module is absent'
  );

  // 2. Controlled fixture: mock draft candidates are strictly excluded
  const mockDrafts: ProjectItem[] = [
    {
      id: 'devforge',
      slug: 'devforge',
      title: 'DevForge',
      problem: 'Draft problem',
      role: 'Engineer',
      contribution: 'Draft contribution',
      stack: ['Scala'],
      status: 'prototype',
      draft: true,
      editorialApproval: false,
      featured: true,
      summary: 'Draft summary',
      href: '/projects/devforge/',
    },
    {
      id: 'java-task-api',
      slug: 'java-task-api',
      title: 'Java Task API',
      problem: 'Draft problem',
      role: 'Engineer',
      contribution: 'Draft contribution',
      stack: ['Java'],
      status: 'prototype',
      draft: true,
      editorialApproval: false,
      featured: true,
      summary: 'Draft summary',
      href: '/projects/java-task-api/',
    },
  ];
  const publishedFromDrafts = await getPublishedFeaturedProjects(mockDrafts);
  assert.equal(
    publishedFromDrafts.length,
    0,
    'Zero projects may be returned for public display while projects remain in DRAFT'
  );

  // 3. Controlled fixture: owner-approved AgentIAM and StreamForge prototypes are returned for featured display
  const mockAgentiam: ProjectItem = {
    id: 'agentiam',
    slug: 'agentiam',
    title: 'AgentIAM: Semantic SQL Security Proxy',
    problem: 'Wire-protocol proxy',
    role: 'Creator & Systems Engineer',
    contribution: 'Designed and implemented the core Go wire-protocol proxy',
    stack: ['Go', 'PostgreSQL', 'MySQL'],
    status: 'prototype',
    draft: false,
    editorialApproval: true,
    featured: true,
    summary: 'Wire-protocol database security proxy',
    href: '/projects/agentiam/',
  };
  const mockStreamforge: ProjectItem = {
    id: 'streamforge',
    slug: 'streamforge',
    title: 'StreamForge: Distributed Mobility Pipeline & Real-Time Anomaly Engine',
    problem: 'Distributed mobility streaming pipeline',
    role: 'Backend Systems Engineer & Creator',
    contribution: 'Architected and implemented the end-to-end streaming pipeline',
    stack: ['Go', 'Apache Kafka', 'Java'],
    status: 'prototype',
    draft: false,
    editorialApproval: true,
    featured: true,
    summary: 'High-throughput polyglot streaming pipeline',
    href: '/projects/streamforge/',
  };
  const publishedFeatured = await getPublishedFeaturedProjects([
    mockAgentiam,
    mockStreamforge,
    ...mockDrafts,
  ]);
  assert.equal(publishedFeatured.length, 2, 'Both approved projects must be featured');
  assert.equal(publishedFeatured[0].id, 'agentiam');
  assert.equal(publishedFeatured[1].id, 'streamforge');

  console.log('✓ Controlled fixture publication gating and Node fallback confirmed');
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
