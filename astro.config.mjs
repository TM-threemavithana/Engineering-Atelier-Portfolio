import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { getValidatedProductionSiteUrl } from './src/utils/domain.ts';

const validatedSiteUrl = getValidatedProductionSiteUrl(process.env.PUBLIC_SITE_URL);

// Whitelist of approved, published routes for production sitemap inclusion
const APPROVED_PUBLISHED_ROUTES = new Set(['/']);

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
