/**
 * Shared Production Domain Validator.
 * Reused by both astro.config.mjs and src/utils/seo.ts to ensure sitemap and canonical URLs always agree.
 * Rejects localhost, 127.0.0.1, example domains, private/internal domains, malformed strings, and non-HTTP/HTTPS schemes.
 */
export function getValidatedProductionSiteUrl(rawUrl?: string): string | undefined {
  if (!rawUrl || typeof rawUrl !== 'string') return undefined;
  const trimmed = rawUrl.trim();
  if (!trimmed) return undefined;

  try {
    const parsed = new URL(trimmed);
    const hostname = parsed.hostname.toLowerCase();

    // Reject local, private, test, and reserved RFC 2606 / RFC 6761 example domains
    const rejectedHosts = [
      'localhost',
      '127.0.0.1',
      '0.0.0.0',
      'example.com',
      'example.org',
      'example.net',
    ];

    if (
      rejectedHosts.includes(hostname) ||
      hostname.endsWith('.local') ||
      hostname.endsWith('.internal') ||
      hostname.endsWith('.test') ||
      hostname.endsWith('.example')
    ) {
      return undefined;
    }

    // Require standard http or https protocol (https strongly preferred)
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return undefined;
    }

    return parsed.origin;
  } catch {
    return undefined;
  }
}
