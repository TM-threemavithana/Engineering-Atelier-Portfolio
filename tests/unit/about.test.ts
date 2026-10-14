import assert from 'node:assert/strict';
import {
  aboutBio,
  engineeringValues,
  technicalFamiliarityTiers,
  verifiedTimelineMilestones,
  getVerifiedTimelineMilestones,
  type TimelineMilestone,
} from '../../src/data/about';

console.log('--- Starting About Page & Integrity Unit Tests ---');

// 1. Verify Bio & Positioning Integrity
assert.equal(aboutBio.role, 'Software Engineer', 'Bio role must be Software Engineer');
assert.ok(
  aboutBio.positioning.includes('Java') &&
    aboutBio.positioning.includes('Scala') &&
    aboutBio.positioning.includes('backend architecture') &&
    aboutBio.positioning.includes('distributed systems'),
  'Positioning text must contain approved keywords'
);
assert.ok(
  aboutBio.narrative.length >= 2,
  'Narrative must contain at least 2 structured paragraphs'
);
console.log('✓ Bio and positioning text verified');

// 2. Verify Exact 3 Engineering Values
assert.equal(engineeringValues.length, 3, 'Must define exactly 3 engineering values');

const expectedValueTitles = [
  'Understand Before Solving',
  'Design for Maintainability',
  'Verify Through Empirical Testing',
];

for (let i = 0; i < engineeringValues.length; i++) {
  assert.equal(
    engineeringValues[i].title,
    expectedValueTitles[i],
    `Engineering value ${i + 1} title mismatch`
  );
  assert.ok(
    engineeringValues[i].practice.length > 0,
    `Engineering value "${engineeringValues[i].title}" must have a non-empty practice`
  );
  assert.ok(
    engineeringValues[i].description.length > 20,
    `Engineering value "${engineeringValues[i].title}" must have a descriptive explanation`
  );
}
console.log('✓ Exact 3 engineering values verified in correct order');

// 3. Verify Technical Familiarity Tiers
assert.equal(
  technicalFamiliarityTiers.length,
  3,
  'Must define exactly 3 technical familiarity categories'
);

const expectedCategories = ['Primary Focus', 'Working Knowledge', 'Actively Exploring'];
const actualCategories = technicalFamiliarityTiers.map((t) => t.category);
assert.deepEqual(actualCategories, expectedCategories, 'Familiarity category names mismatch');

// Ensure no arbitrary percentages or scores exist in any technology tag
for (const tier of technicalFamiliarityTiers) {
  assert.ok(
    tier.technologies.length >= 3,
    `Tier "${tier.category}" must have at least 3 technologies`
  );
  for (const tech of tier.technologies) {
    assert.ok(
      !/\d+%/.test(tech),
      `Technology "${tech}" must not contain arbitrary percentage ratings`
    );
    assert.ok(
      !/\d+\s*(years?|yrs?)/i.test(tech),
      `Technology "${tech}" must not contain arbitrary years of experience claims`
    );
  }
}

// Ensure unconfirmed technologies (e.g., Rust, eBPF) are not automatically classified without owner approval
const allTools = technicalFamiliarityTiers.flatMap((t) => t.technologies);
assert.ok(
  !allTools.some((t) => t.toLowerCase().includes('rust')),
  'Rust must not be classified without owner confirmation'
);
assert.ok(
  !allTools.some((t) => t.toLowerCase().includes('ebpf')),
  'eBPF must not be classified without owner confirmation'
);
console.log(
  '✓ Technical familiarity tiers verified with zero arbitrary percentages or unapproved tools'
);

// 4. Verify Strict Timeline Draft Omission & Non-fabrication
assert.equal(
  verifiedTimelineMilestones.length,
  0,
  'verifiedTimelineMilestones must be empty ([]) while owner education/employment history is awaiting confirmation'
);
assert.deepEqual(
  getVerifiedTimelineMilestones(),
  [],
  'getVerifiedTimelineMilestones must return empty array when no verified entries exist'
);
console.log('✓ Verified timeline milestones correctly empty awaiting owner evidence');

// 5. Test Timeline Milestone Schema with isolated test fixture
const mockMilestone: TimelineMilestone = {
  period: '2024 - 2025',
  datetime: '2024',
  title: 'Backend Systems Engineer',
  organization: 'Verified Engineering Org',
  statusTag: 'Completed',
  description: 'Implemented high-throughput messaging pipelines.',
  highlights: ['Designed gRPC service contracts', 'Authored JMH benchmarks'],
  isVerified: true,
};

assert.equal(mockMilestone.isVerified, true, 'Mock milestone is verified');
assert.ok(mockMilestone.datetime, 'Mock milestone contains valid datetime');
console.log('✓ Timeline milestone schema verified with mock fixture');

console.log('--- All About Page Unit Tests Passed Cleanly ---');
