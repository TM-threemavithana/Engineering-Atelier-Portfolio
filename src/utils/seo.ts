import { siteConfig } from '../data/siteConfig';
import { getValidatedProductionSiteUrl } from './domain';

export interface PageMetaProps {
  title?: string;
  description?: string;
  canonicalOverride?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  noindex?: boolean;
}

export interface ResolvedPageMeta {
  title: string;
  description: string;
  canonicalUrl?: string; // Strictly undefined when no verified production domain exists
  ogTitle: string;
  ogDescription: string;
  ogType: 'website' | 'article';
  ogUrl?: string; // Strictly undefined when no verified production domain exists
  ogImage?: string;
  robots: string;
  language: string;
  themeColor: string;
}

/**
 * Normalizes a pathname:
 * - Strips query parameters (?...) and URL fragments (#...)
 * - Collapses repeated slashes (// -> /)
 * - Removes trailing slashes on subpaths (/about/ -> /about) while preserving root ('/')
 */
export function normalizePathname(rawPath: string): string {
  if (!rawPath || typeof rawPath !== 'string') return '/';

  // Strip query parameters and hash fragments
  const cleaned = rawPath.split(/[?#]/)[0] || '/';

  // Collapse multiple slashes
  const collapsed = cleaned.replace(/\/+/g, '/');

  if (collapsed === '' || collapsed === '/') {
    return '/';
  }

  // Remove trailing slash for consistent canonical formatting
  return collapsed.replace(/\/$/, '');
}

/**
 * Constructs a safe canonical URL (ADR-008).
 * - Requires a validated production site origin (reusing getValidatedProductionSiteUrl)
 * - Returns undefined if origin is unconfigured or invalid (omits <link rel="canonical"> completely)
 * - Strips query parameters and fragments
 * - Rejects unapproved foreign/external domains passed via canonicalOverride
 */
export function formatCanonicalUrl(
  pathname: string,
  siteOrigin?: string,
  override?: string
): string | undefined {
  const validatedOrigin = getValidatedProductionSiteUrl(siteOrigin);
  if (!validatedOrigin) return undefined;

  if (override && typeof override === 'string') {
    const trimmed = override.trim();
    try {
      if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        const parsed = new URL(trimmed);
        // Security check: reject foreign or external canonical overrides
        if (parsed.origin.toLowerCase() !== validatedOrigin.toLowerCase()) {
          return undefined;
        }
        return `${validatedOrigin}${normalizePathname(parsed.pathname)}`;
      } else {
        // Safe relative override
        return `${validatedOrigin}${normalizePathname(trimmed)}`;
      }
    } catch {
      return undefined;
    }
  }

  return `${validatedOrigin}${normalizePathname(pathname)}`;
}

/**
 * Resolves comprehensive metadata for BaseLayout.
 * Enforces noindex, nofollow default during development to prevent indexing unfinished builds.
 */
export function resolvePageMeta(
  props: PageMetaProps = {},
  currentPathname = '/',
  siteUrl?: string | URL
): ResolvedPageMeta {
  const rawSiteUrl = siteUrl instanceof URL ? siteUrl.origin : siteUrl;
  const validatedOrigin = getValidatedProductionSiteUrl(rawSiteUrl);

  let title = siteConfig.defaultTitle;
  if (props.title) {
    const trimmedTitle = props.title.trim();
    title = trimmedTitle.endsWith(siteConfig.brandName)
      ? trimmedTitle
      : `${trimmedTitle} | ${siteConfig.brandName}`;
  }

  const description = props.description ? props.description.trim() : siteConfig.defaultDescription;

  // 404 safety guard: 404 routes must NEVER emit a canonical URL or be indexed
  const is404Route = normalizePathname(currentPathname) === '/404';

  const canonicalUrl = is404Route
    ? undefined
    : formatCanonicalUrl(currentPathname, validatedOrigin, props.canonicalOverride);

  // Robots directive:
  // Default to 'noindex, nofollow' unless siteConfig.isProductionApproved is explicitly true.
  // 404 pages unconditionally emit 'noindex, nofollow'.
  const shouldNoindex = props.noindex ?? (is404Route || !siteConfig.isProductionApproved);
  const robots = shouldNoindex ? 'noindex, nofollow' : 'index, follow';

  return {
    title,
    description,
    canonicalUrl,
    ogTitle: title,
    ogDescription: description,
    ogType: props.ogType || siteConfig.defaultOgType,
    ogUrl: canonicalUrl,
    ogImage: props.ogImage,
    robots,
    language: siteConfig.language,
    themeColor: siteConfig.themeColor,
  };
}
