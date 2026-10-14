import assert from 'node:assert/strict';
import {
  contactConfig,
  getVerifiedEmail,
  getVerifiedProfiles,
  hasVerifiedContactMethod,
  isValidEmail,
  isValidHttpsUrl,
} from '../../src/data/contact';

console.log('--- Starting Contact Page & Truth Unit Suite ---');

// 1. Verify Email Approval & Syntax
assert.equal(
  contactConfig.email,
  'tharukamaduwantha62@gmail.com',
  'Email must match owner-approved address'
);
assert.equal(contactConfig.isEmailVerified, true, 'isEmailVerified must be true');
assert.equal(
  isValidEmail(contactConfig.email),
  true,
  'Approved email must pass standard email syntax validation'
);
assert.equal(isValidEmail('invalid-address'), false, 'Invalid email string must be rejected');
assert.equal(isValidEmail(''), false, 'Empty email string must be rejected');
assert.equal(
  getVerifiedEmail(),
  'tharukamaduwantha62@gmail.com',
  'getVerifiedEmail must return approved email'
);
console.log('✓ Email syntax and owner approval verified');

// 2. Verify Social Profiles Approval & HTTPS Protocol
assert.equal(contactConfig.profiles.length, 2, 'Exactly 2 social profiles must be configured');

const githubProfile = contactConfig.profiles.find((p) => p.platform === 'GitHub');
assert.ok(githubProfile, 'GitHub profile must exist');
assert.equal(
  githubProfile.url,
  'https://github.com/TM-threemavithana',
  'GitHub URL must match exact approved destination'
);
assert.equal(
  githubProfile.handle,
  'TM-threemavithana',
  'GitHub username must match exact approved capitalization'
);
assert.equal(githubProfile.isVerified, true, 'GitHub profile must be owner verified');
assert.equal(isValidHttpsUrl(githubProfile.url), true, 'GitHub URL must use HTTPS protocol');

const linkedinProfile = contactConfig.profiles.find((p) => p.platform === 'LinkedIn');
assert.ok(linkedinProfile, 'LinkedIn profile must exist');
assert.equal(
  linkedinProfile.url,
  'https://www.linkedin.com/in/tharuka-madhuwantha/',
  'LinkedIn URL must match exact approved destination'
);
assert.equal(
  linkedinProfile.handle,
  'tharuka-madhuwantha',
  'LinkedIn handle must match exact approved string'
);
assert.equal(linkedinProfile.isVerified, true, 'LinkedIn profile must be owner verified');
assert.equal(isValidHttpsUrl(linkedinProfile.url), true, 'LinkedIn URL must use HTTPS protocol');

const verifiedProfiles = getVerifiedProfiles();
assert.equal(verifiedProfiles.length, 2, 'getVerifiedProfiles must return both verified profiles');
console.log('✓ Social profiles, handles, and HTTPS URLs verified');

// 3. Verify Contact Method Presence & Route Activation Gate
assert.equal(
  hasVerifiedContactMethod(),
  true,
  'hasVerifiedContactMethod must return true when verified email and profiles exist'
);
console.log('✓ Contact method availability gate verified');

// 4. Content Truth Guardrails (Zero Placeholder or Invented Data)
const placeholderTerms = [
  'example.com',
  'placeholder',
  'TODO',
  'your-name',
  'FILL_IN',
  '123-456-7890',
];
for (const term of placeholderTerms) {
  assert.ok(
    !contactConfig.email.toLowerCase().includes(term.toLowerCase()),
    `Email must not contain placeholder term "${term}"`
  );
  for (const profile of contactConfig.profiles) {
    assert.ok(
      !profile.url.toLowerCase().includes(term.toLowerCase()),
      `Profile URL must not contain placeholder term "${term}"`
    );
  }
}
console.log('✓ Negative truth assertions passed: zero placeholder or invented strings');

console.log('--- All Contact Unit Tests Passed Cleanly ---');
