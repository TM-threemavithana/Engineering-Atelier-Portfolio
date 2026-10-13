# Engineering Atelier — Identity, Sitemap & Feature Flags (EA-002)

**Version:** 1.0  
**Date:** 2026-10-13  
**Status:** In Review  
**Milestone:** Milestone 0 — Discovery and Design Foundation  
**Governing Documents:** [AGENTS.md](file:///c:/Project/Engineering-Atelier-Portfolio/AGENTS.md), [docs/MASTER_SPEC.md](file:///c:/Project/Engineering-Atelier-Portfolio/docs/MASTER_SPEC.md), [docs/CONTENT_STATUS.md](file:///c:/Project/Engineering-Atelier-Portfolio/docs/CONTENT_STATUS.md)

---

## 1. Professional Branding Strategy & Personal Identity

### 1.1 Brand Archetype: The Thoughtful Systems Builder
The portfolio communicates technical discipline, intentional architecture, rigorous testing, and tasteful visual execution. It deliberately rejects inflated tech industry clichés ("10x engineer", "ninja", "rockstar") in favor of concrete engineering evidence, architectural trade-offs, and measurable constraints.

### 1.2 Core Professional Positioning
- **Primary Role:** `Software Engineer`
- **Core Engineering Domains:**
  1. **Backend Engineering & Robust APIs** (Java, Spring ecosystem, clean domain modeling, persistence)
  2. **Distributed Systems & Platform Architecture** (Concurrency, message-driven design, gRPC, reliability)
  3. **Functional & Systems Programming** (Scala, type safety, developer tooling)
  4. **Disciplined Full-Stack Web Development** (Modern web standards, accessible UI, performance budgets)

### 1.3 Approved Homepage Copy
The owner has confirmed the following identity copy for production development:

| Element | Approved Copy | Verification Status |
| :--- | :--- | :--- |
| **Overline Category** | `SOFTWARE ENGINEER` | **Approved** |
| **Primary H1** | **"Building reliable systems. Creating meaningful experiences."** | **Approved (Option B)** |
| **Supporting Subtitle** | *"Software Engineer focused on Java, Scala, backend architecture, distributed systems, and thoughtful full-stack development."* | **Approved** |
| **Brand Wordmark** | Typographic Monogram `EA` (*Engineering Atelier*) | Temporary brand during development; to be replaced prior to production |
| **Location Tag** | *Omitted from UI* | **Hidden by default** |


---

## 2. Finalized Information Architecture & Sitemap

### 2.1 Route Inventory & Priority Matrix

| Route URL | Page Name | Milestone | Priority | Visibility Policy |
| :--- | :--- | :--- | :--- | :--- |
| `/` | **Home** | M2 | **P0** | Always visible. Core elevator pitch, verified featured work, skills, and contact CTA. |
| `/projects/` | **Projects Index** | M3 | **P0** | Always visible. Curated list of verified projects. |
| `/projects/[slug]/` | **Case Study** | M3 | **P0** | Dynamically generated strictly for entries with `draft: false`. |
| `/about/` | **About** | M2 | **P0** | Always visible. Verified timeline, engineering values, and practical tools. |
| `/contact/` | **Contact** | M2 | **P0** | Always visible. Direct `mailto:` link, verified socials, and `CopyEmail` island. |
| `/404` | **Not Found** | M2 | **P0** | Always active. Branded, accessible recovery route. |
| `/resume.pdf` | **Résumé Asset** | M2 | **P0 (Conditional)** | **Gated by feature flag:** Linked only if verified PDF is supplied; suppressed otherwise. |
| `/writing/` | **Writing Index** | M4 | **P1 (Gated)** | **Gated by feature flag:** Route and nav item hidden until $\ge 1$ verified article exists. |
| `/writing/[slug]/` | **Article Detail** | M4 | **P1 (Gated)** | Generated strictly for verified MDX articles with `draft: false`. |
| `/rss.xml` | **RSS Feed** | M5 | **P2** | Deferred until article publication volume justifies syndication. |
| `/privacy/` | **Privacy Policy** | — | **Conditional** | Omitted in MVP; required only if external telemetry/forms are introduced. |

---

## 3. Feature Flag Configuration (MVP Architecture)

To enforce the non-negotiable rule that **no unpublished or empty route may be linked**, feature flags will govern route generation and UI visibility.

```typescript
// Proposed typed configuration: src/data/featureFlags.ts
export interface FeatureFlags {
  readonly enableResume: boolean;
  readonly enableWriting: boolean;
  readonly enableArchitectureExplorer: boolean;
  readonly enableProjectFilter: boolean;
  readonly enableContactForm: boolean;
  readonly enableThemeSwitcher: boolean;
  readonly enableWebGL: boolean;
  readonly enableAnalytics: boolean;
}

export const featureFlags: FeatureFlags = {
  // P0 Conditional Gates
  enableResume: false, // Set to true ONLY when public/resume.pdf is confirmed and placed

  // P1 Staged Enhancements
  enableWriting: false, // Set to true ONLY when >= 1 verified article exists in src/content/writing
  enableArchitectureExplorer: false, // Staged for EA-028 once project diagram is cleared
  enableProjectFilter: false, // Deferred until >= 5 verified projects exist (Spec §4.2)

  // P2 Deferred Advanced Features (Excluded from MVP)
  enableContactForm: false, // Deferred (ADR-003: static mailto only; no backend/database)
  enableThemeSwitcher: false, // Deferred (ADR-005: single cohesive dark theme in MVP)
  enableWebGL: false, // Deferred (ADR-004: CSS/SVG first, no heavy 3D on critical path)
  enableAnalytics: false, // Deferred (Privacy-first; zero third-party tracking cookies)
};
```

---

## 4. Navigation, Primary CTAs & Interaction Contract

### 4.1 Global Desktop Header (`SiteHeader.astro`)
- **Left Region:** Brand Monogram `EA` (links to `/`).
- **Center/Right Region:**
  - `Projects` (`/projects/`) — Active on `/projects/*`
  - `About` (`/about/`) — Active on `/about/`
  - `Contact` (`/contact/`) — Active on `/contact/`
  - *(Conditional)* `Writing` (`/writing/`) — Rendered only if `featureFlags.enableWriting === true`
- **Right Action CTA:**
  - *(Conditional)* `"Résumé"` (`/resume.pdf`) — Rendered only if `featureFlags.enableResume === true`. When disabled, the button is cleanly suppressed without layout gap.

### 4.2 Mobile Navigation (`MobileNav.tsx`)
- Trigger button with `aria-expanded` and clear accessible name.
- Opens full-screen or sliding accessible drawer.
- Focus is trapped within menu when open; pressing `Escape` or activating a link closes menu and returns focus to the toggle button.
- Body scroll locked while menu is open.

### 4.3 Call-To-Action (CTA) Hierarchy
1. **Hero Primary CTA:** `"Explore Selected Work"` $\to$ Anchors or navigates directly to `/projects/`.
   - *Requirement:* Guaranteed visible on first viewport across mobile (320px/390px) and desktop (1440px).
2. **Hero Secondary CTA:** `"View Résumé"` $\to$ Links to `/resume.pdf` (`target="_blank" rel="noopener noreferrer"`).
   - *Requirement:* Rendered strictly when `featureFlags.enableResume === true`.
3. **Closing Page CTA:** `"Get in Touch"` $\to$ Links to `/contact/`.

### 4.4 Contact & Email Interaction Policy
- **Primary Method:** Semantic `<a href="mailto:...">` element. Works without JavaScript.
- **Progressive Enhancement Island:** `CopyEmail.tsx` React island.
  - Copies email address to clipboard.
  - Provides immediate feedback via an accessible live region (`role="status" aria-live="polite"`).
  - Preserves standard `mailto:` link if clipboard API is unsupported or rejected.
- **Pending Email State:** While email is awaiting owner supply, the contact page and components will display verified alternative routes or clearly denote contact options without exposing non-existent placeholder emails.

---

## 5. Content and Evidence Register Status

| Identity & Content Item | Verification Status | Fallback / Behavior |
| :--- | :--- | :--- |
| Display Name | Awaiting Confirmation | Display Monogram `EA` / "Engineering Atelier" |
| Role Title | Confirmed candidate | `Software Engineer` |
| Primary Technical Focus | Confirmed | Java, Scala, Backend Systems, Distributed Systems, Full-Stack |
| Contact Email | Awaiting Confirmation | Suppress mailto link until provided |
| GitHub Profile URL | Awaiting Confirmation | Suppress GitHub icon/link until confirmed |
| LinkedIn Profile URL | Awaiting Confirmation | Suppress LinkedIn icon/link until confirmed |
| Public Location | Awaiting Confirmation / Optional | Completely omitted from UI |
| Résumé PDF | Awaiting Confirmation | Feature flag `enableResume: false` (CTA hidden) |
| Candidate Projects (4) | DRAFT (Unverified) | All 4 remain `draft: true` (excluded from production routes) |

---

## 6. Architecture Decision Records (ADRs) Summary

- **ADR-001 (Static-First via Astro):** Pre-rendered static HTML output ensures fast LCP, zero client server vulnerabilities, and resilience without JavaScript.
- **ADR-002 (Zero-Hallucination Gate):** Only verified facts and real project evidence may be published. Unverified content remains draft.
- **ADR-003 (Static Direct Contact):** Direct `mailto:` and progressive clipboard copy replace complex serverless forms, eliminating spam, databases, and privacy overhead.
- **ADR-004 (CSS-First Interaction):** Lightweight CSS transitions with WCAG `prefers-reduced-motion` compliance. Heavy WebGL/3D is deferred.
- **ADR-005 (Dark Editorial Palette):** Single cohesive dark theme (`#080D17`) in MVP to ensure contrast fidelity (WCAG 2.2 AA) and focused visual quality.
- **ADR-006 (Feature Flag Route Guarding):** Navigation items and routes for conditional assets (résumé, writing, explorer) are strictly guarded by typed configuration flags.
