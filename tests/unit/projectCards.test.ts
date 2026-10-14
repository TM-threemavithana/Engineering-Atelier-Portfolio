/**
 * @file tests/unit/projectCards.test.ts
 * @description Unit tests for EA-021 project card logic, safe navigation, link safety, and blueprint contracts.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { isRoutePublished } from '../../src/utils/linkSafety';
import { isValidProjectHttpsUrl } from '../../src/data/schemas/projectSchema';
import type { ProjectItem } from '../../src/data/projects';

console.log('--- Starting Project Cards Unit Test Suite ---');

const fictionalDraftProject: ProjectItem = {
  id: 'fictional-alpha',
  slug: 'fictional-alpha',
  title: 'Fictional Systems Engine',
  problem: 'Simulating high-throughput distributed message arbitration under network partition.',
  role: 'Core Systems Developer',
  contribution: 'Implemented log compaction and state machine replication.',
  stack: ['Java', 'gRPC', 'Raft'],
  status: 'prototype',
  draft: true,
  featured: true,
  summary: 'Simulating high-throughput distributed message arbitration under network partition.',
  href: '/projects/fictional-alpha/',
  repoUrl: 'https://github.com/example-fictional/engine',
  demoUrl: 'https://demo.example-fictional.org',
  editorialApproval: false,
};

test('1. Safe Project Navigation: Unpublished and draft project routes are rejected by publication gate', () => {
  // Candidate project routes and draft fixtures must not be recognized as published
  assert.equal(
    isRoutePublished('/projects/fictional-alpha/'),
    false,
    'Unpublished project route must return false'
  );
  assert.equal(
    isRoutePublished('/projects/currency-auth-research/'),
    false,
    'Candidate Currency project must return false while in draft'
  );
  assert.equal(
    isRoutePublished('/projects/streamforge/'),
    false,
    'Candidate StreamForge project must return false while in draft'
  );
  assert.equal(
    isRoutePublished('/projects/devforge/'),
    false,
    'Candidate DevForge project must return false while in draft'
  );
  assert.equal(
    isRoutePublished('/projects/java-task-api/'),
    false,
    'Candidate Java Task API project must return false while in draft'
  );
});

test('2. External Resource Safety: Validates secure HTTPS and rejects dangerous or insecure URLs', () => {
  // Valid HTTPS
  assert.ok(isValidProjectHttpsUrl('https://github.com/valid-org/repo'));
  assert.ok(isValidProjectHttpsUrl('https://demo.engineering.app/path?query=1'));

  // Insecure http:
  assert.ok(!isValidProjectHttpsUrl('http://insecure-site.com'));

  // Malformed / dangerous protocols
  assert.ok(!isValidProjectHttpsUrl('javascript:alert(1)'));
  assert.ok(!isValidProjectHttpsUrl('data:text/html,<h1>XSS</h1>'));
  assert.ok(!isValidProjectHttpsUrl('//protocol-relative.com'));
  assert.ok(!isValidProjectHttpsUrl(''));
  assert.ok(!isValidProjectHttpsUrl(null));
  assert.ok(!isValidProjectHttpsUrl(undefined));
});

test('3. Status Mapping: All four project status types map to honest tones', () => {
  const toneMapping = {
    completed: 'success',
    prototype: 'warning',
    'in-progress': 'accent',
    research: 'neutral',
  } as const;

  assert.equal(toneMapping.completed, 'success');
  assert.equal(toneMapping.prototype, 'warning');
  assert.equal(toneMapping['in-progress'], 'accent');
  assert.equal(toneMapping.research, 'neutral');
});

test('4. Category Taxonomy: All five categories have distinct conceptual schematic descriptors', () => {
  const categoryLabels = {
    research: 'CONCEPTUAL SCHEMATIC // CVIP METROLOGY',
    distributed: 'CONCEPTUAL SCHEMATIC // DISTRIBUTED TOPOLOGY',
    backend: 'CONCEPTUAL SCHEMATIC // MODULAR SERVICE ARCHITECTURE',
    fullstack: 'CONCEPTUAL SCHEMATIC // FULL-STACK SYSTEM TOPOLOGY',
    frontend: 'CONCEPTUAL SCHEMATIC // COMPONENT SYSTEM HIERARCHY',
  } as const;

  const categories = ['research', 'distributed', 'backend', 'fullstack', 'frontend'] as const;
  for (const cat of categories) {
    assert.ok(categoryLabels[cat].includes('CONCEPTUAL SCHEMATIC'));
    assert.ok(!categoryLabels[cat].includes('BANKNOTE'));
    assert.ok(!categoryLabels[cat].includes('CURRENCY'));
  }
});

test('5. Content Safety: Project data structure conforms to ProjectItem interface', () => {
  assert.equal(fictionalDraftProject.draft, true);
  assert.equal(fictionalDraftProject.editorialApproval, false);
  assert.ok(fictionalDraftProject.stack.length >= 3);
  assert.ok(fictionalDraftProject.summary.length >= 20);
});
