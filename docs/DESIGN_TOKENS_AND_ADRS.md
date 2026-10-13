# Engineering Atelier — Design Tokens & Architecture ADRs (EA-004)

**Version:** 1.1 (Corrected & Deterministically Audited)  
**Date:** 2026-10-13  
**Status:** In Review / Ready for Final Owner Signoff  
**Milestone:** Milestone 0 — Discovery and Design Foundation  
**Governing Documents:** [AGENTS.md](file:///c:/Project/Engineering-Atelier-Portfolio/AGENTS.md), [docs/MASTER_SPEC.md](file:///c:/Project/Engineering-Atelier-Portfolio/docs/MASTER_SPEC.md), [design/tokens.reference.css](file:///c:/Project/Engineering-Atelier-Portfolio/design/tokens.reference.css), [design/INTERACTION_RULES.md](file:///c:/Project/Engineering-Atelier-Portfolio/design/INTERACTION_RULES.md), [design/RESPONSIVE_WIREFRAMES.md](file:///c:/Project/Engineering-Atelier-Portfolio/design/RESPONSIVE_WIREFRAMES.md)

---

## 1. Executive Summary & Resolution of EA-004 Corrections

Following the owner's review, this document implements all required corrections to complete **EA-004**:
1. **Deterministic Contrast Verification:** Recalculated all color pairings using official WCAG relative-luminance formulas ($L = 0.2126R + 0.7152G + 0.0722B$). Clarified the role of `--color-border: #34465D` (1.78:1, decorative containment backed by distinct background fills) and introduced `--color-border-strong: #5A7597` (3.61:1, exceeding WCAG 2.2 SC 1.4.11 3:1 non-text UI component contrast).
2. **Typography Corrections:** Explicitly set base body typography to `16px` (`1rem`) on mobile viewports (<1024px) and `17px` (`1.0625rem`) on desktop ($\ge 1024px$).
3. **Realistic Performance Standards:** Removed pre-claimed LCP guarantees from ADR-001; reframed as measurable target budgets (field LCP $\le$ 2.5s p75, lab target < 1.5s).
4. **Hydration & Non-JS Resilience:** Refined ADR-007 for `MobileNav.tsx` hydration via `client:idle` / `client:media("(max-width: 768px)")`, ensuring all navigation links remain accessible in semantic HTML without JavaScript.
5. **Truth & Evidence Integrity:** Re-generated and verified all three visual mockups in [design/visual-references/](file:///c:/Project/Engineering-Atelier-Portfolio/design/visual-references/): removed duplicate words, removed speculative metrics/throughput numbers, and labeled all candidate projects as `DRAFT // Under Clearance`.

---

## 2. Design Tokens & Tailwind CSS v4 `@theme` Specification

Below is the verified production token contract for `src/styles/tokens.css`:

```css
@theme {
  /* Surface & Background Colors */
  --color-bg: #080d17;               /* Deep navy canvas */
  --color-surface: #111c2b;          /* Raised container & card fill */
  --color-surface-alt: #17263a;      /* Secondary pill / nested code fill */
  --color-border: #34465d;           /* Decorative container stroke (1.78:1; fill provides boundary) */
  --color-border-strong: #5a7597;    /* Semantic UI component boundary (3.61:1 against surface, >=3:1) */
  --color-border-hover: #94f5e6;     /* Accent sheen on interactive hover */

  /* Typography Colors */
  --color-fg: #f3f7ff;               /* High-contrast primary text (18.11:1 on bg, 15.97:1 on surface) */
  --color-muted: #a5b7ce;            /* Secondary body & metadata text (9.50:1 on bg, 8.38:1 on surface) */

  /* Accent & State Colors */
  --color-accent: #5eead4;           /* Refined cyan accent (13.14:1 on bg, 11.59:1 on surface) */
  --color-accent-hover: #94f5e6;     /* Accent hover sheen */
  --color-focus: #f0cf78;            /* High-visibility gold focus outline (12.87:1 on bg, 11.35:1 on surface) */
  --color-danger: #ff9eab;           /* Accessible warning / error (8.76:1 on surface) */
  --color-warning: #fcd34d;          /* DRAFT status badge (11.89:1 on surface) */

  /* Typography Families */
  --font-display: 'Space Grotesk', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, monospace;

  /* Typography Scale Clamps */
  --text-h1: clamp(2.4rem, 4.5vw, 4.2rem);
  --text-h2: clamp(1.8rem, 3.2vw, 2.75rem);
  --text-h3: clamp(1.35rem, 2.2vw, 1.75rem);
  --text-body-mobile: 1rem;          /* Strict 16px requirement on mobile */
  --text-body-desktop: 1.0625rem;    /* 17px on desktop viewports */
  --text-sm: 0.875rem;               /* 14px */
  --text-xs: 0.75rem;                /* 12px mono overlines / tags */

  /* Radii & Motion */
  --radius-card: 0.875rem;           /* 14px */
  --radius-button: 0.5rem;           /* 8px */
  --radius-tag: 0.25rem;             /* 4px */
  --ease-premium: cubic-bezier(0.22, 1, 0.36, 1);
  --duration-tap: 150ms;
  --duration-hover: 180ms;
  --duration-card: 220ms;
  --duration-enter: 450ms;
}
```

---

## 3. Deterministic WCAG 2.2 Contrast Calculation Matrix

Contrast calculated via deterministic algorithm:
$$\text{Contrast Ratio} = \frac{L_{\text{lighter}} + 0.05}{L_{\text{darker}} + 0.05}$$

| UI Pairing | Hex Values | Contrast Ratio | WCAG Standard | Classification & Compliance |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Text on Canvas** | `#F3F7FF` on `#080D17` | **18.11 : 1** | $\ge 4.5:1$ (Normal text) | **WCAG AAA Passed** |
| **Primary Text on Surface** | `#F3F7FF` on `#111C2B` | **15.97 : 1** | $\ge 4.5:1$ (Normal text) | **WCAG AAA Passed** |
| **Muted Text on Canvas** | `#A5B7CE` on `#080D17` | **9.50 : 1** | $\ge 4.5:1$ (Normal text) | **WCAG AAA Passed** |
| **Muted Text on Surface** | `#A5B7CE` on `#111C2B` | **8.38 : 1** | $\ge 4.5:1$ (Normal text) | **WCAG AAA Passed** |
| **Muted Text on Nested Pill** | `#A5B7CE` on `#17263A` | **7.47 : 1** | $\ge 4.5:1$ (Normal text) | **WCAG AAA Passed** |
| **Cyan Accent on Surface** | `#5EEAD4` on `#111C2B` | **11.59 : 1** | $\ge 4.5:1$ (Normal text) | **WCAG AAA Passed** |
| **Cyan Accent on Canvas** | `#5EEAD4` on `#080D17` | **13.14 : 1** | $\ge 4.5:1$ (Normal text) | **WCAG AAA Passed** |
| **Button Text on Accent Fill**| `#080D17` on `#5EEAD4` | **13.14 : 1** | $\ge 4.5:1$ (Normal text) | **WCAG AAA Passed** |
| **Focus Ring on Surface** | `#F0CF78` on `#111C2B` | **11.35 : 1** | $\ge 3.0:1$ (UI Control) | **Exceeds AAA Requirement** |
| **Focus Ring on Canvas** | `#F0CF78` on `#080D17` | **12.87 : 1** | $\ge 3.0:1$ (UI Control) | **Exceeds AAA Requirement** |
| **DRAFT Warning Badge** | `#FCD34D` on `#111C2B` | **11.89 : 1** | $\ge 4.5:1$ (Normal text) | **WCAG AAA Passed** |
| **Strong UI Border on Surface**| `#5A7597` on `#111C2B` | **3.61 : 1** | $\ge 3.0:1$ (UI Boundary) | **WCAG 2.2 SC 1.4.11 Passed** |
| **Strong UI Border on Canvas** | `#5A7597` on `#080D17` | **4.10 : 1** | $\ge 3.0:1$ (UI Boundary) | **WCAG 2.2 SC 1.4.11 Passed** |
| **Decorative Border on Surface**| `#34465D` on `#111C2B` | **1.78 : 1** | Non-essential boundary | **Decorative Containment** (Surface fill separation provides boundary) |

> [!NOTE]
> **Border Distinction Rule:** Under WCAG 2.2 Success Criterion 1.4.11 (Non-text Contrast), borders on elements that already possess distinct background fills (such as cards with fill `#111C2B` against canvas `#080D17`) are classified as decorative styling and do not require 3:1 contrast. Where a boundary is the *sole* visual indicator of a control (such as standalone inputs or node boxes), the semantic token `--color-border-strong: #5A7597` (3.61:1) is strictly applied.

---

## 4. Component Token Binding Matrix

| Component | Element / State | Applied Token | Computed Value | Role / Semantics |
| :--- | :--- | :--- | :--- | :--- |
| **SiteHeader** | Background | `--color-bg` | `#080D17` (80% backdrop blur) | Landmark navigation container |
| | Bottom Border | `--color-border` | `1px solid rgba(52, 70, 93, 0.4)` | Decorative separator |
| | Brand Wordmark | `--font-display` | `Space Grotesk 700` | Architectural identity |
| **PrimaryButton** | Background Fill | `--color-surface` | `#111C2B` | Interactive CTA surface |
| | Border | `--color-accent` | `1.5px solid #5EEAD4` | High-contrast interactive boundary (11.59:1) |
| | Text | `--color-fg` | `#F3F7FF` | High-contrast label (15.97:1) |
| | Hover Fill | `--color-accent` | `#5EEAD4` | Dynamic state transition |
| | Hover Text | `--color-bg` | `#080D17` | High-contrast inverted label (13.14:1) |
| | Focus-Visible | `--color-focus` | `3px solid #F0CF78, offset 3px` | WCAG 2.2 AA Focus Appearance (11.35:1) |
| **ProjectCard** | Surface | `--color-surface` | `#111C2B` | Content card fill |
| | Border | `--color-border` | `1px solid #34465D` | Decorative hairline stroke |
| | Active Boundary | `--color-border-strong`| `1px solid #5A7597` | Standalone UI boundary (3.61:1) |
| | Hover Border | `--color-accent` | `1px solid #5EEAD4` | Interactive card hover highlight |
| **FactPanel** | Surface | `--color-surface-alt` | `#17263A` | Elevated technical metadata container |
| | Labels | `--color-muted` | `#A5B7CE` (font: `JetBrains Mono`) | Secondary descriptive text (7.47:1) |
| | Values | `--color-fg` | `#F3F7FF` (font: `Inter`) | Primary metadata text (15.97:1) |
| **DecisionBlock** | Surface | `--color-surface` | `#111C2B` | Editorial technical trade-off container |
| | Header Fill | `--color-surface-alt` | `#17263A` | Distinct section header |
| | Body Text | `--color-muted` | `#A5B7CE` (font: `Inter`) | Technical trade-off prose (8.38:1) |
| **CopyEmail** | Island Button | `--color-surface` | `#111C2B` | Progressive enhancement interactive island |
| | Announcement | `--color-accent` | `#5EEAD4` | Live region confirmation message |

---

## 5. Interaction & Reduced-Motion Specification

Per [design/INTERACTION_RULES.md](file:///c:/Project/Engineering-Atelier-Portfolio/design/INTERACTION_RULES.md):
- **Hover/Tap Timings:** 150ms to 220ms with maximum translation of `4px`.
- **Card Hover:** 180ms to 260ms with `translateY(-4px)` via cubic-bezier `(0.22, 1, 0.36, 1)`.
- **No Heavy Animations:** Zero WebGL canvases, zero scroll hijacking, zero forced autoplay.
- **Reduced-Motion Fallback:**
  ```css
  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto !important; }
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
  ```
  On React islands: Globally governed by `<MotionConfig reducedMotion="user">`.

---

## 6. Formal Architecture Decision Records (ADRs)

### ADR-001: Static-First Delivery via Astro
- **Context:** The portfolio must achieve near-instant initial rendering, resilient access across varying network conditions, and flawless search engine crawlability.
- **Decision:** Build with Astro in static prerender mode (`output: 'static'`).
- **Target Performance Budgets (Measurable Targets, Not Pre-Claimed Guarantees):**
  - Target LCP $\le$ 2.5s p75 field once traffic volume permits (lab target < 1.5s).
  - Target INP $\le$ 200ms p75 field.
  - Target CLS $\le$ 0.1 p75 field.
  - Target Initial Static JS < 50KB gzip.
- **Consequences:** Eliminates server maintenance; guarantees all primary content renders semantically without JavaScript.

### ADR-002: Zero-Hallucination Gate & Evidence Gating
- **Context:** Unverified candidate projects or biographical claims would damage professional credibility.
- **Decision:** Content collections enforce strict Zod validation. Candidate projects default to `draft: true`. Production route queries explicitly exclude drafts: `getCollection('projects', ({ data }) => !data.draft)`.
- **Consequences:** Speculative or unverified project case studies cannot be built into production pages or listed in the sitemap.

### ADR-003: Static Direct Contact (`mailto:` + Progressive Island)
- **Context:** Contact forms introduce backend endpoints, databases, anti-spam complexity, and privacy policy liabilities.
- **Decision:** Primary contact mechanism is a semantic `<a href="mailto:...">` link, augmented by a lightweight progressive enhancement React island (`CopyEmail.tsx`) for clipboard copy with accessible `aria-live` feedback.
- **Consequences:** Zero backend attack surface; works 100% without JavaScript; zero database maintenance.

### ADR-004: Restrained CSS-First Interaction (No WebGL in MVP)
- **Context:** 3D canvases and heavy animation libraries degrade mobile responsiveness and increase bundle weight.
- **Decision:** Use native CSS transitions and vector SVG diagrams for architectural models. Defer Three.js/WebGL to P2.
- **Consequences:** Keeps initial JavaScript minimal; preserves mobile battery and high INP responsiveness.

### ADR-005: Dark-First Single Theme (Visual Direction C) for MVP
- **Context:** Multiple themes double visual QA surface area and token permutations during initial release.
- **Decision:** Implement a single cohesive dark theme (`--color-bg: #080D17`) tailored to the engineering atelier aesthetic.
- **Consequences:** Guarantees strict WCAG 2.2 AA contrast compliance across all components; simplifies design maintenance.

### ADR-006: Feature Flag Defensive Guards for Conditional Assets
- **Context:** Exposing broken links to missing assets (e.g., unavailable résumé or unpublished articles) degrades user trust.
- **Decision:** Control navigation visibility and route generation using typed configuration (`src/data/featureFlags.ts`).
- **Consequences:** Links to `/resume.pdf` and `/writing/` are cleanly suppressed until verified assets exist.

### ADR-007: Component Ownership Boundary & Progressive Hydration
- **Context:** Balancing static rendering and client-side interactivity without unnecessary JavaScript overhead.
- **Decision:**
  - **Astro Server Markup (0KB JS):** `BaseLayout`, `SiteHeader`, `SiteFooter`, `PrimaryButton`, `TextLink`, `HeroIntro`, `ProjectCard`, `FactPanel`, `DecisionBlock`, `AboutTimeline`.
  - **React Islands (Selective Hydration):**
    - `MobileNav.tsx`: Hydrated via `client:idle` or `client:media("(max-width: 768px)")`. Crucially, semantic fallback links remain present in HTML so navigation operates without JavaScript.
    - `CopyEmail.tsx`: Hydrated via `client:idle`. Semantic `mailto:` anchor operates natively without JavaScript.
    - `ArchitectureExplorer.tsx`: Hydrated via `client:visible` (staged for Milestone 4 / EA-028).
- **Consequences:** Maximum performance and resilience; essential page content and links work without JavaScript.

---

## 7. Acceptance Criteria Verification for EA-004

| Criteria ID | Target | Verification Method | Status |
| :--- | :--- | :--- | :--- |
| **AC-09** | WCAG 2.2 AA conformance; visible focus, reduced motion | Deterministic contrast table verified (all text $\ge 7.47:1$, focus 11.35:1, strong border 3.61:1); focus and motion CSS defined | **PASS** |
| **AC-14** | Complete token mapping, typography hierarchy, component bindings | Tailwind v4 `@theme` block, 16px mobile typography, and Component Token Binding table complete | **PASS** |
| **ADR Rigor** | ADR-001 through ADR-007 formalized without unverified claims | Realistic performance budgets established; hydration & non-JS resilience specified | **PASS** |

---

## 8. Milestone 0 Handover

Upon your final approval of **EA-004**:
1. Mark **EA-004 as DONE** in [docs/IMPLEMENTATION_BACKLOG.md](file:///c:/Project/Engineering-Atelier-Portfolio/docs/IMPLEMENTATION_BACKLOG.md).
2. **Milestone 0 is officially complete.**
3. Proceed to **EA-005: Scaffold Astro + Strict TypeScript** (Milestone 1 Kickoff).
