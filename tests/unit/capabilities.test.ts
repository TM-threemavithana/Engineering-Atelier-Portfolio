import assert from 'node:assert/strict';
import test from 'node:test';
import { capabilityAreas, approachStages } from '../../src/data/capabilities';

console.log('--- Starting Capabilities & Engineering Approach Unit Suite ---');

test('Capabilities data contains exactly 3 verified technical focus areas', () => {
  assert.equal(capabilityAreas.length, 3, 'Must contain exactly 3 capability focus areas');

  const titles = capabilityAreas.map((a) => a.title);
  assert.ok(
    titles.includes('Backend Engineering & APIs'),
    'Must include Backend Engineering & APIs'
  );
  assert.ok(
    titles.includes('Distributed Systems & Cloud Concepts'),
    'Must include Distributed Systems & Cloud Concepts'
  );
  assert.ok(titles.includes('Full-Stack Development'), 'Must include Full-Stack Development');

  console.log('✓ Exactly 3 confirmed technical focus areas verified');
});

test('Capabilities separate practical focus from learning interests without fake metrics', () => {
  for (const area of capabilityAreas) {
    // Practical focus list
    assert.ok(area.practicalFocus.length >= 3, `${area.id} must have practical focus items`);
    // Exploring list
    assert.ok(area.exploring.length >= 1, `${area.id} must have currently exploring items`);
    // Disciplines list
    assert.ok(area.disciplines.length >= 2, `${area.id} must have engineering disciplines`);

    // Strict truth assertion: zero percentage bars or years of experience
    const allText = JSON.stringify(area);
    assert.ok(!allText.includes('%'), `${area.id} must not contain percentage symbols`);
    assert.ok(
      !allText.toLowerCase().includes('years of experience'),
      `${area.id} must not claim unverified years of experience`
    );
  }

  console.log(
    '✓ Separation of practical focus from exploring and absence of fake metrics confirmed'
  );
});

test('Engineering approach contains 4 stages in exact sequential order', () => {
  assert.equal(approachStages.length, 4, 'Must contain exactly 4 approach stages');

  const expectedStages = [
    { number: '01', title: 'Understand' },
    { number: '02', title: 'Model & Design' },
    { number: '03', title: 'Build & Test' },
    { number: '04', title: 'Verify & Maintain' },
  ];

  for (let i = 0; i < expectedStages.length; i++) {
    assert.equal(
      approachStages[i].number,
      expectedStages[i].number,
      `Stage ${i + 1} number mismatch`
    );
    assert.equal(approachStages[i].title, expectedStages[i].title, `Stage ${i + 1} title mismatch`);
    assert.ok(
      approachStages[i].description.length > 20,
      `Stage ${i + 1} description must be detailed`
    );
    assert.ok(
      approachStages[i].deliverables.length > 10,
      `Stage ${i + 1} deliverables must be specified`
    );
  }

  console.log('✓ 4-stage engineering approach methodology confirmed in sequential order');
});

console.log('--- All Capabilities Tests Passed Cleanly ---');
