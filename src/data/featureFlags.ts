/**
 * Defensive Feature Flags Architecture (ADR-006 / ADR-009).
 * Controls visibility, navigation, and static route generation for unverified assets and features.
 * All unverified features default to false to protect owner credibility.
 */
export interface FeatureFlags {
  readonly enableResume: boolean;
  readonly enableWriting: boolean;
  readonly enableArchitectureExplorer: boolean;
  readonly enableProjectFilter: boolean;
  readonly enableContactForm: boolean;
}

export const featureFlags: FeatureFlags = {
  // Gated until owner provides authentic, up-to-date PDF résumé
  enableResume: false,
  // Gated until >= 1 real authored engineering article is verified and approved
  enableWriting: false,
  // Gated until Milestone 4 (EA-028) architecture explorer interactive model is ready
  enableArchitectureExplorer: false,
  // Gated until >= 5 verified published projects exist (Master Spec §4.2)
  enableProjectFilter: false,
  // Gated per ADR-003: static direct mailto only, no backend contact endpoint
  enableContactForm: false,
};
