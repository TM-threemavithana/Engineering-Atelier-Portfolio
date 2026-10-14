import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

console.log('--- Starting Primitives Architecture & Semantics Unit Suite ---');

// 1. Verify existence of all primitive component files
const requiredComponentFiles = [
  'src/components/ui/Button.astro',
  'src/components/ui/TextLink.astro',
  'src/components/ui/SectionHeading.astro',
  'src/components/ui/Tag.astro',
  'src/components/ui/StatusLabel.astro',
  'src/components/icons/ArrowRightIcon.astro',
  'src/components/icons/ExternalLinkIcon.astro',
  'src/components/icons/CheckIcon.astro',
  'src/components/icons/DocumentIcon.astro',
  'src/components/icons/SpinnerIcon.astro',
  'src/components/dev/PrimitivesShowcase.astro',
];

for (const filePath of requiredComponentFiles) {
  const fullPath = path.resolve(filePath);
  assert.ok(fs.existsSync(fullPath), `Required component file "${filePath}" must exist`);
}
console.log('✓ All 11 shared UI primitive and icon components exist');

// 2. Verify Button component architecture & token usage
const buttonSrc = fs.readFileSync(path.resolve('src/components/ui/Button.astro'), 'utf-8');
assert.ok(
  buttonSrc.includes('validateLinkDestination'),
  'Button must integrate validateLinkDestination for route safety'
);
assert.ok(
  buttonSrc.includes('min-h-[44px]'),
  'Button must enforce 44px min-height for WCAG 2.2 touch target compliance'
);
assert.ok(
  buttonSrc.includes('ring-[var(--color-focus)]'),
  'Button must use semantic gold focus token for visible keyboard ring'
);
assert.ok(
  buttonSrc.includes('role="link"'),
  'Button must render role="link" when in disabled anchor mode'
);
assert.ok(
  buttonSrc.includes('aria-busy'),
  'Button must support aria-busy for genuine loading states'
);
console.log('✓ Button architecture and accessible touch target compliance confirmed');

// 3. Verify TextLink component architecture
const textLinkSrc = fs.readFileSync(path.resolve('src/components/ui/TextLink.astro'), 'utf-8');
assert.ok(
  textLinkSrc.includes('validateLinkDestination'),
  'TextLink must integrate validateLinkDestination for route safety'
);
assert.ok(
  textLinkSrc.includes('underline-offset-4'),
  'TextLink must use 4px underline offset for legibility'
);
assert.ok(
  textLinkSrc.includes('role="link"'),
  'TextLink must render non-interactive role="link" when disabled'
);
console.log('✓ TextLink architecture and underline decoration confirmed');

// 4. Verify StatusLabel static indicator architecture (Strictly no animation)
const statusLabelSrc = fs.readFileSync(
  path.resolve('src/components/ui/StatusLabel.astro'),
  'utf-8'
);
assert.ok(
  !statusLabelSrc.includes('animate-pulse'),
  'StatusLabel must strictly NOT contain animate-pulse'
);
assert.ok(
  !statusLabelSrc.includes('animate-ping'),
  'StatusLabel must strictly NOT contain animate-ping'
);
assert.ok(
  statusLabelSrc.includes('w-1.5 h-1.5 rounded-full'),
  'StatusLabel must use static 6px indicator dot'
);
console.log('✓ StatusLabel static indicator and zero animation confirmed');

// 5. Verify Tag component informational vs interactive semantics
const tagSrc = fs.readFileSync(path.resolve('src/components/ui/Tag.astro'), 'utf-8');
assert.ok(
  tagSrc.includes('min-h-[44px]'),
  'Interactive Tag must enforce 44px touch target on mobile'
);
assert.ok(tagSrc.includes('font-mono'), 'Tag must use monospace font');
console.log('✓ Tag monospace typography and interactive touch target confirmed');

// 6. Verify SVG Icon Primitives
const iconFiles = [
  'ArrowRightIcon.astro',
  'ExternalLinkIcon.astro',
  'CheckIcon.astro',
  'DocumentIcon.astro',
  'SpinnerIcon.astro',
];
for (const iconFile of iconFiles) {
  const iconSrc = fs.readFileSync(path.resolve('src/components/icons', iconFile), 'utf-8');
  assert.ok(
    iconSrc.includes('aria-hidden="true"'),
    `Icon "${iconFile}" must have aria-hidden="true"`
  );
}
console.log('✓ SVG icons accessibility attributes confirmed');

console.log('--- All Primitives Semantics Tests Passed Cleanly ---');
