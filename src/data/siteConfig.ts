/**
 * Site Configuration & Verified Brand Copy.
 * Stores approved positioning copy and architectural branding defaults.
 * Contains ZERO invented personal details, contact data, or employer history.
 */
export interface SiteConfig {
  readonly brandName: string;
  readonly wordmark: string;
  readonly headline: string;
  readonly positioning: string;
  readonly defaultTitle: string;
  readonly defaultDescription: string;
  readonly defaultOgType: 'website' | 'article';
  readonly language: string;
  readonly themeColor: string;
  /**
   * Safety gate: Controls whether search engine indexing is permitted.
   * Default is false (emitting 'noindex, nofollow' metadata) during development.
   * Must remain false until domain, identity, and public content are explicitly approved.
   */
  readonly isProductionApproved: boolean;
}

export const siteConfig: SiteConfig = {
  brandName: 'Engineering Atelier',
  wordmark: 'EA',
  headline: 'Building reliable systems. Creating meaningful experiences.',
  positioning:
    'Software Engineer focused on Java, Scala, backend architecture, distributed systems, and thoughtful full-stack development.',
  defaultTitle: 'Engineering Atelier — Software Engineer Portfolio',
  defaultDescription:
    'Building reliable systems. Creating meaningful experiences. Software Engineer focused on Java, Scala, backend architecture, distributed systems, and thoughtful full-stack development.',
  defaultOgType: 'website',
  language: 'en',
  themeColor: '#080d17',
  isProductionApproved: false,
};
