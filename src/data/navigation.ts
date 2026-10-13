import { featureFlags } from './featureFlags';

export interface NavItemConfig {
  label: string;
  href: string;
  number: string;
  isPublished: boolean;
  external?: boolean;
}

/**
 * Centralized site navigation configuration.
 *
 * Non-negotiable rule: No unpublished or empty route may be linked in production UI.
 * Future routes remain configured below but isPublished is strictly false
 * until their respective ticket implementation is complete.
 */
export const navigationConfig: NavItemConfig[] = [
  {
    label: 'Home',
    href: '/',
    number: '01',
    isPublished: true, // Baseline route implemented and verified in EA-005..008
  },
  {
    label: 'Projects',
    href: '/projects/',
    number: '02',
    isPublished: false, // Milestone 3 (EA-022) — hidden until route exists
  },
  {
    label: 'About',
    href: '/about/',
    number: '03',
    isPublished: false, // Milestone 2 (EA-015) — hidden until route exists
  },
  {
    label: 'Contact',
    href: '/contact/',
    number: '04',
    isPublished: false, // Milestone 2 (EA-016) — hidden until route exists
  },
  {
    label: 'Writing',
    href: '/writing/',
    number: '05',
    isPublished: featureFlags.enableWriting, // Milestone 4 (EA-029) — gated by feature flag
  },
  {
    label: 'Résumé',
    href: '/resume.pdf',
    number: '06',
    isPublished: featureFlags.enableResume, // Gated by feature flag
    external: true,
  },
];

/**
 * Returns strictly the verified, published navigation items.
 * Guaranteed to never produce dead links or 404 targets.
 */
export function getPublishedNavItems(): NavItemConfig[] {
  return navigationConfig.filter((item) => item.isPublished);
}

/**
 * Determines whether a given navigation item represents the active page.
 */
export function isNavItemActive(currentPathname: string, targetHref: string): boolean {
  const normalize = (p: string) => (p.endsWith('/') && p.length > 1 ? p.slice(0, -1) : p);
  return normalize(currentPathname) === normalize(targetHref);
}
