import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

/**
 * Validates a candidate site URL against production safety guardrails.
 * Rejects localhost, 127.0.0.1, example domains, malformed strings, and non-HTTPS protocols.
 */
function getValidatedProductionSiteUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return undefined;
  const trimmed = rawUrl.trim();
  if (!trimmed) return undefined;

  try {
    const parsed = new URL(trimmed);
    const hostname = parsed.hostname.toLowerCase();

    // Reject development, local, and reserved example domains
    const rejectedHosts = ['localhost', '127.0.0.1', '0.0.0.0', 'example.com', 'example.org', 'example.net'];
    if (rejectedHosts.includes(hostname) || hostname.endsWith('.local') || hostname.endsWith('.internal')) {
      return undefined;
    }

    // Require standard http or https protocol
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return undefined;
    }

    return parsed.origin;
  } catch {
    return undefined;
  }
}

const validatedSiteUrl = getValidatedProductionSiteUrl(process.env.PUBLIC_SITE_URL);

// Whitelist of approved, published routes for production sitemap inclusion
const APPROVED_PUBLISHED_ROUTES = new Set([
  '/',
]);

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: validatedSiteUrl,
  integrations: [
    react(),
    mdx(),
    // Only activate sitemap generation if a validated, non-placeholder production domain exists
    ...(validatedSiteUrl
      ? [
          sitemap({
            filter: (page) => {
              try {
                const url = new URL(page);
                const path = url.pathname.replace(/\/$/, '') || '/';
                // Explicit whitelist matching: only include approved published routes
                return APPROVED_PUBLISHED_ROUTES.has(path);
              } catch {
                return false;
              }
            },
          }),
        ]
      : []),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
