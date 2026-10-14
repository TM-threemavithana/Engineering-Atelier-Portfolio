import { getPublishedNavItems } from '../data/navigation';

export interface LinkValidationResult {
  isValid: boolean;
  isExternal: boolean;
  isAnchor: boolean;
  isMailto: boolean;
  sanitizedHref: string;
  error?: string;
}

/**
 * Registry of currently approved and published routes and static assets.
 * Extensible for future tickets (e.g. verified project case studies).
 */
export const APPROVED_STATIC_ASSETS = new Set<string>(['/favicon.svg', '/robots.txt']);

/**
 * Registry of individually cleared and published project detail routes.
 * Strictly exact-matching: wildcards (e.g. /projects/*) are strictly prohibited (EA-023).
 * In EA-023, all candidate projects remain unpublished, so this registry is empty.
 */
export const APPROVED_PROJECT_ROUTES = new Set<string>();

/**
 * Check if an internal route is currently verified and published.
 * Extensible: Checks published navigation items plus exact approved project routes.
 */
export function isRoutePublished(pathname: string): boolean {
  const normalize = (p: string) => (p.endsWith('/') && p.length > 1 ? p.slice(0, -1) : p);
  const normalizedPath = normalize(pathname);

  // Check approved static assets
  if (APPROVED_STATIC_ASSETS.has(pathname)) {
    return true;
  }

  // Check published navigation items
  const publishedItems = getPublishedNavItems();
  const isNavPublished = publishedItems.some((item) => normalize(item.href) === normalizedPath);
  if (isNavPublished) {
    return true;
  }

  // Check individually approved project detail routes (exact match only, zero wildcards)
  for (const approved of APPROVED_PROJECT_ROUTES) {
    if (normalize(approved) === normalizedPath) {
      return true;
    }
  }

  return false;
}

/**
 * Validates any link destination across Button, TextLink, and Tag primitives.
 * Enforces security, protocol safety, and zero dead links.
 */
export function validateLinkDestination(href: string | undefined | null): LinkValidationResult {
  if (!href || typeof href !== 'string' || href.trim().length === 0) {
    return {
      isValid: false,
      isExternal: false,
      isAnchor: false,
      isMailto: false,
      sanitizedHref: '',
      error: 'Empty link destination',
    };
  }

  const trimmed = href.trim();
  const lower = trimmed.toLowerCase();

  // 1. Reject unsafe protocols and dangerous schemes
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('file:')
  ) {
    return {
      isValid: false,
      isExternal: false,
      isAnchor: false,
      isMailto: false,
      sanitizedHref: '',
      error: `Unsafe link protocol rejected: "${trimmed}"`,
    };
  }

  // 2. Reject protocol-relative external URLs (e.g. "//malicious.com")
  if (trimmed.startsWith('//')) {
    return {
      isValid: false,
      isExternal: true,
      isAnchor: false,
      isMailto: false,
      sanitizedHref: '',
      error: `Protocol-relative URL rejected: "${trimmed}". Explicit protocol required.`,
    };
  }

  // 3. Anchor links on the current page (e.g. #main-content)
  if (trimmed.startsWith('#')) {
    if (trimmed.length === 1) {
      return {
        isValid: false,
        isExternal: false,
        isAnchor: true,
        isMailto: false,
        sanitizedHref: '',
        error: 'Empty anchor reference "#" is invalid',
      };
    }
    return {
      isValid: true,
      isExternal: false,
      isAnchor: true,
      isMailto: false,
      sanitizedHref: trimmed,
    };
  }

  // 4. Mailto links
  if (lower.startsWith('mailto:')) {
    const email = trimmed.slice(7).split('?')[0];
    if (!email || !email.includes('@')) {
      return {
        isValid: false,
        isExternal: true,
        isAnchor: false,
        isMailto: true,
        sanitizedHref: '',
        error: `Invalid email in mailto link: "${trimmed}"`,
      };
    }
    return {
      isValid: true,
      isExternal: true,
      isAnchor: false,
      isMailto: true,
      sanitizedHref: trimmed,
    };
  }

  // 5. External absolute URLs
  if (lower.startsWith('http://') || lower.startsWith('https://')) {
    try {
      const parsed = new URL(trimmed);
      if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
        return {
          isValid: false,
          isExternal: true,
          isAnchor: false,
          isMailto: false,
          sanitizedHref: '',
          error: `Unsupported URL protocol: "${parsed.protocol}"`,
        };
      }
      return {
        isValid: true,
        isExternal: true,
        isAnchor: false,
        isMailto: false,
        sanitizedHref: trimmed,
      };
    } catch {
      return {
        isValid: false,
        isExternal: true,
        isAnchor: false,
        isMailto: false,
        sanitizedHref: '',
        error: `Malformed external URL: "${trimmed}"`,
      };
    }
  }

  // 6. Internal absolute paths
  if (trimmed.startsWith('/')) {
    if (isRoutePublished(trimmed)) {
      return {
        isValid: true,
        isExternal: false,
        isAnchor: false,
        isMailto: false,
        sanitizedHref: trimmed,
      };
    }
    return {
      isValid: false,
      isExternal: false,
      isAnchor: false,
      isMailto: false,
      sanitizedHref: '',
      error: `Internal route "${trimmed}" is not yet published. Dead links are prohibited.`,
    };
  }

  return {
    isValid: false,
    isExternal: false,
    isAnchor: false,
    isMailto: false,
    sanitizedHref: '',
    error: `Invalid destination format: "${trimmed}"`,
  };
}
