/**
 * @file src/data/contact.ts
 * @description Centralized, typed definition of verified contact channels and social profiles.
 *
 * CONTENT TRUTH & OWNER APPROVAL GUARDRAILS:
 * - All values configured below are explicitly approved by the portfolio owner for public display.
 * - isVerified signifies explicit owner approval; it does NOT imply independent third-party account ownership verification.
 * - Does not invent display names, degree status, or unconfirmed availability claims.
 * - Validates email syntax and HTTPS profile destinations prior to operational use.
 */

export interface SocialProfile {
  platform: 'GitHub' | 'LinkedIn';
  url: string;
  handle: string;
  description: string;
  isVerified: boolean;
}

export interface ContactConfig {
  eyebrow: string;
  headline: string;
  introParagraph: string;
  email: string;
  isEmailVerified: boolean;
  profiles: SocialProfile[];
  privacyNotice: string;
}

/**
 * Validates basic email syntax (local-part@domain.tld).
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates that a string is a well-formed HTTPS URL.
 */
export function isValidHttpsUrl(rawUrl: string): boolean {
  if (!rawUrl || typeof rawUrl !== 'string') return false;
  try {
    const parsed = new URL(rawUrl.trim());
    return parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export const contactConfig: ContactConfig = {
  eyebrow: 'GET IN TOUCH',
  headline: "Let's build reliable software together.",
  introParagraph:
    'Feel free to reach out regarding backend architecture, distributed systems concepts, engineering collaboration, or technical inquiries.',
  email: 'tharukamaduwantha62@gmail.com',
  isEmailVerified: true,
  profiles: [
    {
      platform: 'GitHub',
      url: 'https://github.com/TM-threemavithana',
      handle: 'TM-threemavithana',
      description: 'GitHub profile',
      isVerified: true,
    },
    {
      platform: 'LinkedIn',
      url: 'https://www.linkedin.com/in/tharuka-madhuwantha/',
      handle: 'tharuka-madhuwantha',
      description: 'Professional LinkedIn profile',
      isVerified: true,
    },
  ],
  privacyNotice:
    'Direct email is used for correspondence. This portfolio does not deploy tracking cookies, marketing databases, or third-party web forms.',
};

/**
 * Returns the verified email address if it passes syntax validation and owner verification.
 */
export function getVerifiedEmail(): string | undefined {
  if (contactConfig.isEmailVerified && isValidEmail(contactConfig.email)) {
    return contactConfig.email.trim();
  }
  return undefined;
}

/**
 * Returns the list of verified social profiles that pass HTTPS validation and owner verification.
 */
export function getVerifiedProfiles(): SocialProfile[] {
  return contactConfig.profiles.filter(
    (profile) => profile.isVerified && isValidHttpsUrl(profile.url)
  );
}

/**
 * Checks whether at least one valid, approved contact method exists.
 * Strictly required before activating the /contact/ route and navigation.
 */
export function hasVerifiedContactMethod(): boolean {
  const email = getVerifiedEmail();
  const profiles = getVerifiedProfiles();
  return Boolean(email) || profiles.length > 0;
}
