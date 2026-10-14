# Engineering Atelier — Reviewable Implementation Backlog

**Rules:** Every ticket must be implemented under AGENTS.md. Status defaults to `TODO`. Estimate is relative (S = few hours, M = half–one day, L = multi-day) rather than a binding deadline. A ticket cannot be marked DONE until its tests and visual checks actually pass. `AC-##` references `MASTER_SPEC.md`.

## Milestone 0 — Discovery and design foundation

### EA-001 — Audit repository and content (S)
**Depends:** none. **Scope:** list existing files, identify package/build state, verified owner facts, usable project evidence, missing assets, permissions. Create `docs/CONTENT_STATUS.md` (public-safe). **Accept:** accurate known/unknown checklist with provenance; no content fabricated; spec conflicts flagged. **Verify:** file audit and owner's content review. **AC:** 01,05,17.

### EA-002 — Approve identity, sitemap, feature flags (S)
**Depends:** 001. **Scope:** confirm display copy, contact policy, nav items, conditional Writing/Résumé behavior, P0/P1/P2 flags. **Accept:** no unpublished empty route linked; copy tagged verified or draft. **Verify:** content acceptance review. **AC:** 01,02,05.

### EA-003 — Visual reference and responsive wireframes (M)
**Depends:** 002. **Scope:** high-level desktop (1440), tablet (768) and phone (390/320) page wireframes, section hierarchy, dark theme; annotated states. **Accept:** H1 and work CTA visible on phone, contrast and spacing viable. **Verify:** owner approval and visual inspection. **AC:** 03,14,15.

### EA-004 — Design tokens and architecture ADRs (S)
**Depends:** 003. **Scope:** adopt tokens, typography, grid, breakpoints, motion policy; record ADR on static-first architecture, data and island selection. **Accept:** token usage and component ownership described; color contrast checked. **Verify:** design contract and ADR review. **AC:** 09,14.

## Milestone 1 — Tooling and foundation

### EA-005 — Scaffold Astro + strict TypeScript (M)
**Depends:** 004. **Scope:** compatible stable Astro, TS strict, lockfile; scripts; no unnecessary templates. **Accept:** `install`, `check`, `build`, `dev` work; version rationale. **Verify:** actual command output. **AC:** 13.

### EA-006 — Install Tailwind v4 + global CSS tokens (S)
**Depends:** 005. **Scope:** @tailwindcss/vite, CSS import, semantics mapped to tokens, accessible base styles. **Accept:** no v3-only setup; computed tokens visible; focus ring functional. **Verify:** build + browser. **AC:** 09,14.

### EA-007 — Integrate React, MDX and sitemap (S)
**Depends:** 005. **Scope:** Astro official integrations, verify compatibility. **Accept:** sample React island hydrates only when requested, MDX page compiles, sitemap route configurable. **Verify:** build/inspection. **AC:** 11,13.

### EA-008 — Baseline layout and metadata utilities (M)
**Depends:** 006,007. **Scope:** BaseLayout, default title/description, canonical helper, typography, skip link, site language and favicon placeholder only as approved. **Accept:** meaningful HTML/landmarks; no empty canonical or fake author. **Verify:** HTML inspection, browser, axe. **AC:** 09,11.

### EA-009 — Lint/type/format/check scripts (S)
**Depends:** 005. **Scope:** strict TypeScript, ESLint (Astro/TS as appropriate), formatter, commands, import conventions. **Accept:** documented scripts execute cleanly. **Verify:** CI-equivalent local runs. **AC:** 13.

### EA-010 — CI checks and preview deployment plan (M)
**Depends:** 008,009. **Scope:** GitHub Actions or user-selected Git provider; install, lint, typecheck, build; choose hosting preview process; no secrets. **Accept:** green status and documented pipeline. **Verify:** run on test change/PR. **AC:** 13,16.

## Milestone 2 — Premium responsive core

### EA-011 — Header and navigation (M)
**Depends:** 008. **Scope:** desktop header, conditional links, accessible mobile menu. **Accept:** escape/focus return, aria-expanded, correct route navigation, no sticky overlap. **Verify:** Playwright keyboard/mobile. **AC:** 02,04,15.

### EA-012 — Buttons, links and shared UI primitives (S)
**Depends:** 006,008. **Scope:** PrimaryButton, TextLink, SectionHeading, Tag, StatusLabel, icons. **Accept:** contrast/focus/hover/tap; no nested anchors; links valid. **Verify:** unit/story harness + browser. **AC:** 04,09,14.

### EA-013 — Homepage hero composition (M)
**Depends:** 011,012,002. **Scope:** editorial hero H1, approved copy, CTA, optional static visual, conditional résumé. **Accept:** no delayed core text; phone first viewport understandable; LCP sensible. **Verify:** 320/390/1440 screenshots, no-JS. **AC:** 01,03,07,10,14.

### EA-014 — Homepage featured work and capability sections (L)
**Depends:** 013,022. **Scope:** featured card variants driven by published project data, honest skill groups, concise approach section. **Accept:** all cards map to published case studies and genuine information; no fake metrics. **Verify:** content audit and responsive snapshots. **AC:** 05,06,14.

### EA-015 — About page and verified timeline (M)
**Depends:** 011,012,002. **Scope:** source-verified education/experience, values, tools, optional image. **Accept:** no inferred employment/degree claims; readable responsive timeline. **Verify:** owner signoff/axe/screenshot. **AC:** 01,05,09.

### EA-016 — Contact page and CopyEmail fallback (M)
**Depends:** 011,012,002. **Scope:** `mailto` primary, approved socials, progressive-enhancement copy action only if email exists. **Accept:** works without JS; copy success announced; no fake availability. **Verify:** E2E and manual a11y. **AC:** 07,09.

### EA-017 — Footer and branded 404 (S)
**Depends:** 011,012. **Scope:** consistent footer, back routes, responsive 404. **Accept:** recovery from invalid URL and mobile footer usable. **Verify:** Playwright 404. **AC:** 02,03.

### EA-018 — Core responsive visual polish pass (M)
**Depends:** 013,015,016,017. **Scope:** typography, section rhythm, editorial asymmetric layouts, cross-browser screenshots. **Accept:** no horizontal overflow at viewport matrix or 200% zoom, no clipped content. **Verify:** screenshot review and keyboard. **AC:** 03,09,14,15.
- *Milestone 2 Polish Backlog items (from EA-015 approval):*
  - Improve mobile readability and reduce overly dense labels on About page.
  - Recheck tablet layout and visual balance across pages.
  - Replace temporary monogram-based identity with verified personal branding when available.
  - Add genuine education and professional experience milestones once owner approves the information.
  - Verify each technical familiarity classification before production release.

## Milestone 3 — Verified project system

### EA-019 — Typed project content schema (M)
**Depends:** 007,001. **Scope:** Astro content collections, Zod validation, `draft` gates, image typing, role/status fields. **Accept:** invalid required fields fail; drafts excluded from builds. **Verify:** schema tests with invalid fixture. **AC:** 05,13.

### EA-020 — Project content intake and asset clearance (M)
**Depends:** 019. **Scope:** validate one-to-three candidate projects with URLs, contributions, media rights; keep unavailable data draft. **Accept:** provenance evidence matrix and owner signoff. **Verify:** content review. **AC:** 05,06,17.

### EA-021 — Project card and feature patterns (M)
**Depends:** 012,019. **Scope:** responsive cards, image ratios, semantic anchors, status and tech tags, conditional links. **Accept:** true summaries, graceful missing image and link states. **Verify:** story/demo screenshots and keyboard. **AC:** 03,05,14.

### EA-022 — Projects index and empty safeguards (M)
**Depends:** 020,021. **Scope:** `/projects/`, featured ordering, honest explanations, safe empty state if none approved. **Accept:** no fabricated items; correct routes; optional filter postponed until >=5. **Verify:** E2E and content query. **AC:** 02,05,06.

### EA-023 — Case study template and rich MDX (L)
**Depends:** 019,021. **Scope:** breadcrumbs, fact panel, body MDX, Decisions, Figures, code, TOC optional, related work. **Accept:** readable <=74ch column, diagrams described, no broken external links. **Verify:** responsive and axe. **AC:** 06,09,14.

### EA-024 — Publish first verified case study (M)
**Depends:** 020,023. **Scope:** owner-approved real project body, diagram(s), evidence links and lessons. **Accept:** content rubric passes; no imagined numbers, completed status only when true. **Verify:** editorial signoff and URL test. **AC:** 05,06,17.

### EA-025 — Publish second/third verified case study (M)
**Depends:** 024. **Scope:** expand only with real evidence; if absent document omission. **Accept:** all published pages match case-study rubric. **Verify:** editorial signoff + links. **AC:** 05,06.

### EA-026 — Project overview experience verification (S)
**Depends:** 022,024. **Scope:** connect featured work to Home and About without contradictory claims; tidy empty fallback. **Accept:** every featured item links to an existent published URL. **Verify:** E2E/automatic link checks. **AC:** 05,06.

## Milestone 4 — Controlled premium interactions and writing

### EA-027 — Motion primitives and reduced-motion behavior (M)
**Depends:** 018. **Scope:** CSS-first transitions; Motion only where essential, guard reduced motion. **Accept:** no large transform at reduced-motion; no hidden essential content. **Verify:** Playwright emulated reduced-motion and no-JS. **AC:** 10,12.

### EA-028 — Architecture explorer (P1) (L)
**Depends:** 023,027. **Scope:** accessible service-select diagram for a verified project only, readable mobile list fallback and textual architecture. **Accept:** keyboard selection, selected state announced, zero dependence on live APIs. **Verify:** E2E keyboard/mobile and no-JS fallback. **AC:** 04,06,09,15.

### EA-029 — Writing collections and index (P1) (M)
**Depends:** 007,012. **Scope:** typed writing frontmatter, conditional route/nav, article cards. **Accept:** excludes draft/no fake articles; dates accurate. **Verify:** build and content tests. **AC:** 05,11.

### EA-030 — Article template and published article (P1) (M)
**Depends:** 029. **Scope:** readable MDX article, anchors, code, cited sources, verified text. **Accept:** a real authored article passes editorial/a11y review; otherwise keep route hidden. **Verify:** review/axe/mobile. **AC:** 05,09.

### EA-031 — Optional filter (P1) (S)
**Depends:** 022,027. **Scope:** implement only when >=5 published projects and clear category value. **Accept:** filter works by click/keyboard; all and zero results reachable. **Verify:** functional tests. **AC:** 04,15.

## Milestone 5 — SEO, performance, hardening and release

### EA-032 — Canonical SEO and social cards (M)
**Depends:** 023,017. **Scope:** unique route metadata, validated absolute site URL, sitemap/robots, correct OG image, verified Person data when appropriate. **Accept:** no draft/preview URL indexed; metadata accurate. **Verify:** parsed HTML and production URL check. **AC:** 11.

### EA-033 — Accessibility audit and remediation (L)
**Depends:** 026,027. **Scope:** automate axe for pages; manual keyboard, focus, screen reader spot-check, 200% zoom and reduced motion. **Accept:** no serious/critical axe findings, recorded WCAG review and exceptions. **Verify:** saved evidence. **AC:** 04,09,10,15.

### EA-034 — Performance optimization and budget review (M)
**Depends:** 026,027. **Scope:** optimized responsive images, minimize fonts/islands, inspect bundle/Lighthouse mobile. **Accept:** metric report, explained exceptions, no unconditional heavy 3D. **Verify:** Lighthouse lab run + asset inspection. **AC:** 12.

### EA-035 — Security, ownership, CI E2E and docs (L)
**Depends:** 010,032,033,034. **Scope:** secrets/license/IP review, headers, dependency scan, Playwright critical paths, maintainer README. **Accept:** no critical security issue; CI all green; no unauthorized assets; repeatable build. **Verify:** CI and production-like preview tests. **AC:** 13,16,17,18.

### EA-036 — Production deploy, smoke test and signoff (M)
**Depends:** 035. **Scope:** DNS/HTTPS, final domain, canonical, résumé/contacts, 404, screen sizes, rollback notes, owner editorial signoff. **Accept:** all AC-01..20 approved or documented waiver of non-essential item; release tagged; rollback known. **Verify:** live URL smoke test. **AC:** 01–20.

---

## Recommended execution groups
- **Stop after EA-004:** inspect and approve the visual concept/IA.
- **Stop after EA-010:** inspect the clean toolchain and deploy strategy.
- **Stop after EA-018:** review actual mobile/desktop pages, not screenshots of someone else's portfolio.
- **Stop after EA-026:** evaluate the engineering substance of published projects.
- **Stop after EA-031:** validate P1 value/performance before extending scope.
- **Stop after EA-036:** launch only after evidence and owner approval.

## Tracking template (duplicate per task)
```md
### EA-### Execution record
- Status: TODO | IN PROGRESS | BLOCKED | REVIEW | DONE
- Approved implementation plan: [link or date]
- Files changed:
- Commands actually executed:
- Browser/a11y evidence:
- Content verified by:
- Deviations / ADRs:
- Owner signoff:
```

## Execution Records

### EA-001 Execution record
- Status: DONE
- Approved implementation plan: [ea_001_audit_and_implementation_plan.md](file:///C:/Users/User/.gemini/antigravity-ide/brain/400f3212-7768-4ea8-a763-ce96ff4f44ed/ea_001_audit_and_implementation_plan.md) (2026-10-13)
- Files changed: `docs/CONTENT_STATUS.md`, `docs/IMPLEMENTATION_BACKLOG.md`
- Commands actually executed: `node -v; npm -v; git status` (Node: v22.22.0, npm: 10.9.4, git: uninitialized)
- Browser/a11y evidence: N/A (specification & audit milestone, no UI rendered yet)
- Content verified by: Owner intake register established; 0 items fabricated; 4 candidate projects marked DRAFT
- Deviations / ADRs: None
- Owner signoff: Approved by owner on 2026-10-13

### EA-002 Execution record
- Status: DONE
- Approved implementation plan: [ea_002_identity_sitemap_flags_plan.md](file:///C:/Users/User/.gemini/antigravity-ide/brain/400f3212-7768-4ea8-a763-ce96ff4f44ed/ea_002_identity_sitemap_flags_plan.md) (2026-10-13)
- Files changed: `docs/IDENTITY_AND_SITEMAP.md`, `docs/CONTENT_STATUS.md`, `docs/IMPLEMENTATION_BACKLOG.md`
- Commands actually executed: N/A (Specification & configuration definition)
- Browser/a11y evidence: N/A (Architectural and sitemap design phase)
- Content verified by: Professional role, technical focus, Option B headline, subheading, and feature flags approved by owner; candidate projects kept in DRAFT
- Deviations / ADRs: ADR-001 through ADR-006 documented in `docs/IDENTITY_AND_SITEMAP.md`
- Owner signoff: Approved by owner on 2026-10-13

### EA-003 Execution record
- Status: DONE
- Approved implementation plan: [ea_003_visual_wireframes_plan.md](file:///C:/Users/User/.gemini/antigravity-ide/brain/400f3212-7768-4ea8-a763-ce96ff4f44ed/ea_003_visual_wireframes_plan.md) (2026-10-13)
- Files changed: `design/RESPONSIVE_WIREFRAMES.md`, `design/preview.html`, `design/visual-references/*`, `docs/CONTENT_STATUS.md`, `docs/IDENTITY_AND_SITEMAP.md`, `docs/IMPLEMENTATION_BACKLOG.md`
- Commands actually executed: Copied visual reference mockups to `design/visual-references/`
- Browser/a11y evidence: Generated visual UI reference mockups (desktop, mobile, case study in workspace), contrast verification (17.81:1, 10.53:1, 9.82:1), first-viewport mobile height calculations (396px < 844px), interactive prototype `design/preview.html`
- Content verified by: Option B copy incorporated; all unverified personal claims and projects kept in DRAFT
- Deviations / ADRs: Visual Direction C established; Hero Alternative 1 selected over Alternative 2
- Owner signoff: Approved by owner on 2026-10-13

### EA-004 Execution record
- Status: DONE
- Approved implementation plan: [ea_004_tokens_and_adrs_plan.md](file:///C:/Users/User/.gemini/antigravity-ide/brain/400f3212-7768-4ea8-a763-ce96ff4f44ed/ea_004_tokens_and_adrs_plan.md) (2026-10-13)
- Files changed: `docs/DESIGN_TOKENS_AND_ADRS.md`, `design/RESPONSIVE_WIREFRAMES.md`, `design/preview.html`, `design/visual-references/*`, `docs/IMPLEMENTATION_BACKLOG.md`
- Commands actually executed: Deterministic contrast script, copied corrected mockups to `design/visual-references/`
- Browser/a11y evidence: Mathematical WCAG 2.2 AA contrast matrix (all text >= 7.47:1, focus 11.35:1, strong border 3.61:1), 16px mobile typography, verified reduced-motion CSS contract
- Content verified by: ADR-001 through ADR-007 accepted; zero unverified performance or credential claims; candidate projects in DRAFT
- Deviations / ADRs: ADR-001 to ADR-007 finalized
- Owner signoff: Approved by owner on 2026-10-13 (Milestone 0: Discovery and Design Foundation Complete)

---

## Milestone 0 Handover & Ongoing Implementation Guardrails
1. **Readable SVG Components:** Recreate all conceptual architecture diagrams as crisp, accessible vector SVG components (no AI-generated bitmap text in production).
2. **Connector & Label Integrity:** Ensure diagram nodes, text labels, and connecting paths are never clipped across all viewports.
3. **Draft Project Gating:** All candidate projects remain strictly excluded from production routes and static sitemaps (`draft: true`).
4. **Viewport Matrix Testing:** Verify layouts across 320px, 390px, 768px, 1024px, 1440px, and 200% zoom.
5. **Real Test Verification:** Execute actual browser-based a11y (axe-core) and performance audits; never claim tests ran unless actually executed.
6. **Progressive Enhancement:** Guarantee essential reading, navigation, and contact operate without JavaScript.

---

### EA-005 Execution record
- Status: DONE
- Initial Git commit: `a95da5c` (`a95da5c810f6a1213f239b320a750d24d3c31fbe`)
- Approved implementation plan: [ea_005_scaffold_astro_plan.md](file:///C:/Users/User/.gemini/antigravity-ide/brain/400f3212-7768-4ea8-a763-ce96ff4f44ed/ea_005_scaffold_astro_plan.md) (2026-10-13)
- Files created/changed: `.gitignore`, `package.json`, `package-lock.json`, `astro.config.mjs`, `tsconfig.json`, `src/styles/tokens.css`, `src/layouts/BaseLayout.astro`, `src/pages/index.astro`, `public/robots.txt`, `public/favicon.svg`, `docs/IMPLEMENTATION_BACKLOG.md`
- Commands actually executed:
  - `git init`: Initialized Git on master branch
  - `git commit -m "chore: initialize Astro portfolio foundation"`: Commit `a95da5c` (33 files committed, clean working tree)
  - `npm install`: Added 377 packages, generated `package-lock.json`
  - `npm ci`: Added 377 packages in 33s & 45s (reproducible clean install verified)
  - `npm run check`: 5 files checked, 0 errors, 0 warnings, 0 hints
  - `npm run build`: Static output generated in `dist/` in 1.64s (`output: "static"`)
  - `git status`: Working tree clean, zero uncommitted or leaked artifacts
- Actual installed versions:
  - `astro`: 5.18.2
  - `tailwindcss`: 4.3.3
  - `@tailwindcss/vite`: 4.3.3
  - `typescript`: 5.9.3
  - `@astrojs/check`: 0.9.4
- Browser/a11y evidence: `dist/index.html` (2,931 bytes) and `dist/_astro/index.B2JbRU2z.css` (15,986 bytes) compiled cleanly with all `@theme` design tokens and skip link
- Content verified by: Baseline test page only; zero personal identity or unverified claims; all candidate projects remain in DRAFT
- Deviations / ADRs: None
- Owner signoff: Approved by owner on 2026-10-13 (Commit `a95da5c` recorded)

### EA-006 Execution record
- Status: DONE
- Git commit: `881716a` (`style: configure Tailwind v4 global CSS tokens and accessible utilities (EA-006)`)
- Approved implementation plan: [ea_006_global_css_and_utilities_plan.md](file:///C:/Users/User/.gemini/antigravity-ide/brain/400f3212-7768-4ea8-a763-ce96ff4f44ed/ea_006_global_css_and_utilities_plan.md) (2026-10-13)
- Scope: Stylesheet architecture (`tokens.css` authoritative theme + `global.css` resets, typography, focus, utilities), single-chain `@import`, visible unclipped keyboard focus outlines (`#F0CF78`, 3px solid, 3px offset), accessible skip-link with `#main-content` target, `.container-atelier` responsive gutters (16px / 24px / 32px), `.reading-column` (max-w 74ch), `.surface-card`, `.surface-card-interactive` with `@media (hover: hover) and (pointer: fine)` hover guard, `.surface-pill`, and strict `@media (prefers-reduced-motion: reduce)`.
- Files created/changed: `src/styles/tokens.css`, `src/styles/global.css`, `src/layouts/BaseLayout.astro`, `src/pages/index.astro`, `docs/IMPLEMENTATION_BACKLOG.md`
- Commands actually executed:
  - `npm run check`: 5 files checked, 0 errors, 0 warnings, 0 hints
  - `npm run build`: Static output generated in `dist/` in 1.06s (`output: "static"`)
  - `git remote -v`: `origin https://github.com/TM-threemavithana/Engineering-Atelier-Portfolio.git` (confirmed remote, development server remains local only)
  - `npm audit --json`: 3 dependency advisories documented as unresolved (`esbuild` low, `sharp` high, `astro` critical). Remediation requires major breaking upgrade `astro@7.3.8`. Mitigated by static-only generation (`output: "static"`) with zero runtime server or dynamic image processing attack surface.
  - Browser real-browser verification (`browser_subagent`):
    - Verified desktop (1440x900) canvas `#080D17`, text `#F3F7FF`, cards `#111C2B`, decorative borders `#34465D`, strong boundary `#5A7597`
    - Verified keyboard navigation: Tab reveals `.skip-link` at top-left with gold focus ring (`#F0CF78`, 3px solid, 3px offset, 11.35:1 contrast against surface); activating transfers focus to `#main-content`; Tab navigates through buttons and links with visible unclipped focus outlines
    - Verified responsive viewports: 1024px, 768px, 390px, 320px; 0 horizontal overflow across all viewports; body font scales smoothly (16px mobile / 17px desktop)
    - Verified reduced motion CSS overrides and safe hover media queries
- Generated CSS: `dist/_astro/index.CCdjpDm_.css` (19,466 bytes) contains compiled tokens, utilities, and media queries
- Content verified by: Baseline test page only; zero personal identity or unverified claims; all candidate projects remain in DRAFT
- Deviations / ADRs: None
- Owner signoff: Approved with required adjustments; implemented and verified on 2026-10-13

### EA-007 Execution record
- Status: DONE
- Git commit: `325f0e8` (`feat: integrate React, MDX and defensive sitemap (EA-007)`)
- Approved implementation plan: [ea_007_react_mdx_sitemap_plan.md](file:///C:/Users/User/.gemini/antigravity-ide/brain/400f3212-7768-4ea8-a763-ce96ff4f44ed/ea_007_react_mdx_sitemap_plan.md) (2026-10-13, approved with Corrections A, B, and C)
- Scope: Official `@astrojs/react@4.4.2` with `react@19.3.0`, `react-dom@19.3.0`, `@types/react@19.3.0`, `@types/react-dom@19.3.0`; `@astrojs/mdx@4.3.14`; `@astrojs/sitemap@3.7.4`. Strict TypeScript with `jsx: "react-jsx"`, `jsxImportSource: "react"`.
- Defensive Sitemap Architecture: `getValidatedProductionSiteUrl` in `astro.config.mjs` validates `PUBLIC_SITE_URL` against localhost, 127.0.0.1, example domains, and malformed strings. When unset or invalid, sitemap generation is completely disabled. When valid, sitemap applies `APPROVED_PUBLISHED_ROUTES` whitelist matching (`Set(['/'])`), ensuring zero drafts, fixtures, or preview routes enter sitemap XML.
- Development Fixture Isolation: `TestInteractiveIsland.tsx` and `TestMdxNote.mdx` isolated in `src/components/dev/`. Verified via temporary dev route, which was completely removed before production build. Production `dist/` contains zero test fixtures, zero test controls, and zero client JavaScript on `index.html`.
- Content truth: All 4 candidate projects remain strictly in DRAFT status; zero unverified project claims or personal data published.
- Commands actually executed:
  - `npm install`: Added official Astro 5 integrations with React 19
  - `npm ci`: Verified reproducible clean install with pinned `package-lock.json`
  - `npm run check`: 6 files checked, 0 errors, 0 warnings, 0 hints
  - `npm run build`: Static build passed in 2.12s (`output: "static"`)
  - Browser verification (`browser_subagent`): Verified React 19 island hydration in real browser (`client:idle` updating state from 0 to 1 to 2 clicks); verified MDX typography, heading, and code block parsing; verified gold focus ring
  - Conditional sitemap verification: Validated generation with temporary test domain `https://portfolio-test.engineering` (only `/` included); validated rejection and suppression of `http://localhost:4321`; confirmed default build without `PUBLIC_SITE_URL` generates zero sitemap files
  - `npm audit`: 4 vulnerabilities logged as unresolved (`astro` critical, `sharp` high, `esbuild` low, `@astrojs/mdx` via astro). Breaking major upgrade to `astro@7.3.8` avoided. Mitigated by static-only generation (`output: "static"`) with zero runtime server or dynamic image processing attack surface.
- Owner signoff: Approved with required adjustments; implemented and verified on 2026-10-13

### EA-008 Execution record
- Status: DONE
- Git commit: `6cfee68` (`feat: implement baseline layout and metadata utilities (EA-008)`)
- Approved implementation plan: [ea_008_baseline_layout_metadata_plan.md](file:///C:/Users/User/.gemini/antigravity-ide/brain/400f3212-7768-4ea8-a763-ce96ff4f44ed/ea_008_baseline_layout_metadata_plan.md) (2026-10-13, approved with 4 corrections)
- Scope: Reusable production `BaseLayout.astro`, strictly typed `src/data/featureFlags.ts`, `src/data/siteConfig.ts`, `src/utils/domain.ts`, and `src/utils/seo.ts`. Default development `noindex, nofollow` metadata protection. Deterministic canonical URL and `og:url` omission when `PUBLIC_SITE_URL` is unset. Trailing-slash and query-param normalization. Rejection of unapproved external canonical overrides. Accessible skip navigation targeting `<main id="main-content" tabindex="-1">`. Zero client-side JavaScript overhead.
- Files created/changed: `src/utils/domain.ts`, `astro.config.mjs`, `src/data/featureFlags.ts`, `src/data/siteConfig.ts`, `src/utils/seo.ts`, `src/layouts/BaseLayout.astro`, `src/pages/index.astro`, `tests/ea008-verification.test.ts`, `docs/CONTENT_STATUS.md`, `docs/IMPLEMENTATION_BACKLOG.md`
- Commands actually executed:
  - `npx tsx tests/ea008-verification.test.ts`: Passed all unit assertions (domain validation, pathname normalization, canonical formatting, override rejection, default robots, feature flag gating)
  - `npm run check`: 11 files checked, 0 errors, 0 warnings, 0 hints
  - `npm run build`: Static build passed in 2.29s (`output: "static"`)
  - HTML inspection: Verified `dist/index.html` renders `<html lang="en">`, `<meta name="theme-color" content="#080d17">`, `<meta name="color-scheme" content="dark">`, `<title>Baseline Verification | Engineering Atelier</title>`, `<meta name="robots" content="noindex, nofollow">`, skip-link, and landmark `<main id="main-content" tabindex="-1">`. Confirmed `<link rel="canonical">` and `og:url` are strictly omitted when site URL is unset.
  - Isolated canonical test: Tested with temporary `$env:PUBLIC_SITE_URL="https://portfolio-test.engineering"`, verified `<link rel="canonical" href="https://portfolio-test.engineering/">` and `<meta property="og:url" content="https://portfolio-test.engineering/">` render cleanly while maintaining `noindex, nofollow` protection. Reset to default unset state, verified clean omission.
  - Browser verification (`browser_subagent`): Verified `document.title`, `meta[name="robots"]`, `meta[name="theme-color"]`, null canonical, Tab key revealing skip link with gold focus outline (`#F0CF78`), Enter transferring focus to `#main-content`, and subsequent Tab focusing interactive controls.
  - `npm audit`: 4 vulnerabilities remain documented and unresolved in risk register (mitigated by static-only generation).
- Content truth: Verified Option B positioning copy and temporary `EA` wordmark; zero fabricated personal identity, contact data, employer history, or production domains; all 4 candidate projects remain strictly in DRAFT.
- Owner signoff: Approved with required adjustments; implemented and verified on 2026-10-13

### EA-009 Execution record
- Status: DONE
- Git commit: `9012cb2` (`build: configure ESLint, Prettier, tsx test runner, and verify script (EA-009)`)
- Approved implementation plan: Approved by owner on 2026-10-13 with 8 required corrections
- Scope: Lint/type/format/check scripts, ESLint flat config with Astro security rules, Prettier formatting with Astro 5 whitespace compression, reproducible local test runner, and unified quality verification pipeline (`npm run verify`).
- Node.js Engine Verification:
  - Host environment: Node `v22.22.0`, npm `10.9.4`.
  - Package selection: Pinned `eslint@^9.39.5` and `eslint-plugin-astro@^1.7.0` (engine requirement `^18.18.0 || ^20.9.0 || >=21.1.0`), perfectly satisfying Node v22.22.0 without engine mismatch, bypasses, or `--force`.
  - Added dependencies in `devDependencies`: `eslint@^9.39.5`, `eslint-plugin-astro@^1.7.0`, `typescript-eslint@^8.71.2`, `prettier@^3.9.10`, `prettier-plugin-astro@^1.1.1`, and `tsx@^4.23.15`.
- Configuration Architecture:
  - `eslint.config.mjs`: Flat config covering `.astro`, `.ts`, `.tsx`, `.js`, `.mjs`. Enforces strict TypeScript rules (`@typescript-eslint/no-unused-vars`: error, `@typescript-eslint/no-explicit-any`: error), global ignores (`dist/**`, `.astro/**`, `node_modules/**`, `public/**`, `package-lock.json`), and security rule `astro/no-set-html-directive`: 'error'.
  - `.prettierrc.mjs`: Prettier with `prettier-plugin-astro`, Astro parser override, and `astroCompressHTML: 'html'` for Astro 5-compatible whitespace handling.
  - `.prettierignore`: Explicitly protects `docs/`, `design/`, `templates/`, `prompts/`, `AGENTS.md`, `README.md`, `MANIFEST.json`, `dist/`, and `package-lock.json` from automatic rewriting.
  - `package.json` scripts:
    - `npm run check`: `astro check`
    - `npm run lint`: `eslint .`
    - `npm run lint:fix`: `eslint . --fix`
    - `npm run format`: `prettier --write src/ tests/ *.mjs *.json`
    - `npm run format:check`: `prettier --check src/ tests/ *.mjs *.json`
    - `npm run test`: `tsx --test "tests/**/*.test.ts"` (Node TAP runner with dynamic glob discovery)
    - `npm run verify`: `npm run check && npm run lint && npm run format:check && npm run test && npm run build`
- Commands actually executed:
  - `npm ci`: Clean install completed in 1m (exit code 0).
  - Intentional lint violation check: Added `set:html` tag and unused frontmatter variable to `src/pages/index.astro`; confirmed `npm run lint` failed with exit code 1 and reported 2 errors; cleanly reverted.
  - `npm run verify`: All 5 gates passed with exit code 0:
    - `check`: 12 files checked, 0 errors, 0 warnings, 0 hints
    - `lint`: 0 errors, 0 warnings
    - `format:check`: All matched files use Prettier code style
    - `test`: 1 test passed (TAP version 13, `tests/ea008-verification.test.ts`), 0 failures
    - `build`: 1 static page built in 2.38s
  - `npm audit`: 9 vulnerabilities documented in risk register (2 low, 6 high, 1 critical) from upstream Astro, sharp, esbuild, and braces. Breaking upgrade avoided; mitigated by static-only generation (`output: "static"`).
- Content truth: Zero fabricated personal data, employer history, or production domains; all candidate projects remain in DRAFT status.
- Owner signoff: Approved with required corrections; implemented and verified on 2026-10-13

### EA-010 Execution record
- Status: DONE
- Git commit: `e552d98` (`fix: separate unit tests from post-build artifact verification (EA-010)`, on top of `64d1311`)
- Approved implementation plan: [ea_010_ci_and_preview_deployment_plan.md](file:///C:/Users/User/.gemini/antigravity-ide/brain/400f3212-7768-4ea8-a763-ce96ff4f44ed/ea_010_ci_and_preview_deployment_plan.md) (approved with 4 required adjustments by owner on 2026-10-13)
- Scope: GitHub Actions CI workflow, comprehensive security risk assessment and remediation matrix (`docs/SECURITY_AND_PREVIEW_PLAN.md`), clean separation of independent unit tests (`tests/unit/`) from post-build artifact verification (`tests/artifacts/`), deterministic post-build production artifact verification test (`tests/artifacts/artifact-verification.ts`), and access-controlled preview deployment strategy.
- CI Reliability & Clean Pipeline Separation:
  - Clean Test Hierarchy: Separated independent unit tests (`tests/unit/**/*.test.ts`) from post-build artifact verification (`tests/artifacts/artifact-verification.ts`).
  - Unit Test Independence: `npm run test` (`tsx --test "tests/unit/**/*.test.ts"`) executes strictly without requiring or expecting `dist/`. Passes cleanly on fresh clones before `dist/` exists.
  - Strict Artifact Gating: `tests/artifacts/artifact-verification.ts` requires pre-existing `dist/` and `dist/index.html`. Zero silent auto-rebuilding; fails immediately with `AssertionError` if `dist/` is absent, preventing false passes or stale artifact inspections.
  - Validated Pipeline Sequence: `npm run check` &rarr; `npm run lint` &rarr; `npm run format:check` &rarr; `npm run test` &rarr; `npm run build` &rarr; `npm run verify:artifacts`.
- GitHub Actions CI Architecture (`.github/workflows/ci.yml`):
  - Environment: Official `ubuntu-latest` runner with `node-version: 22.x` (matching host `v22.22.0`) and native npm dependency caching.
  - Security & Least Privilege: Enforces `permissions: contents: read` (downscopes GitHub's automatically issued `GITHUB_TOKEN` to read-only repository contents). Zero deployment tokens, write permissions, or external secrets requested or exposed.
  - Workflow Triggers & Concurrency: Push/pull_request on `master` and `main`. Strictly avoids `pull_request_target`. Cancels redundant runs with `concurrency.cancel-in-progress: true`.
  - Sequential Pipeline: Executes `npm ci`, `npm run check`, `npm run lint`, `npm run format:check`, `npm run test`, `npm run build`, `npm run verify:artifacts`, and non-blocking `npm audit`.
  - Zero Push: Workflow created and verified locally; zero remote push performed without owner approval.
- Production Artifact Verification (`tests/artifacts/artifact-verification.ts`):
  - Dedicated script executed via `npm run verify:artifacts` only after `npm run build`.
  - Verifies `dist/index.html` exists and contains valid markup.
  - Verifies mandatory `<meta name="robots" content="noindex, nofollow">` is present while `isProductionApproved` is false.
  - Verifies `<link rel="canonical">` and `og:url` are strictly omitted when `PUBLIC_SITE_URL` is unset.
  - Verifies XML sitemaps are absent when unconfigured.
  - Verifies development fixtures (`dev-test` route, `TestInteractiveIsland`, `TestMdxNote`) are completely excluded from production output.
  - Verifies DRAFT project routes (`/projects/`, `streamforge`, `devforge`) are strictly absent.
  - Verifies unapproved writing (`/writing/`) and résumé (`resume.pdf`) routes are strictly absent.
  - Verifies zero placeholder strings, credentials, or fake domains (`example.com`, `localhost`, `[Awaiting Confirmation]`).
  - Verifies compiled CSS bundle and `dist/favicon.svg` exist.
- Security Risk Assessment (`docs/SECURITY_AND_PREVIEW_PLAN.md`):
  - Rigorous analysis covering all 9 npm audit findings (1 critical, 6 high, 2 low).
  - Explicitly documents that static hosting removes the need for an application server, but build tools and CI workflows still process code and dependencies (avoids unqualified "zero public exploitability" claims).
  - Verifies `braces@3.0.3` (GHSA-vfj7-8cjw-p6xm) has no available patched release upstream; accepted as temporary risk mitigated by author-controlled static glob patterns.
  - Avoids destructive `npm audit fix --force`.
- Preview Deployment Strategy:
  - Establishes that `robots.txt` and `noindex` do not provide access control or authentication.
  - Evaluates Cloudflare Pages with Cloudflare Access (One-Time PIN/OAuth) and Vercel Deployment Protection as enterprise-grade access-controlled preview staging for Milestone 5.
  - Zero external hosting provider or domain configured during Milestone 1.
- Commands actually executed & Clean Workspace Verification Evidence:
  - `npm ls typescript`: Confirmed single, deduped `typescript@5.9.3` across all tooling.
  - Clean State Simulation: Removed `dist/` directory completely (`Test-Path dist` = False).
  - Independent Unit Test Verification: Executed `npm run test` on clean state without `dist/`; passed cleanly (1 pass, 0 fail).
  - Missing Artifact Failure Verification: Executed `npm run verify:artifacts` without `dist/`; failed immediately with `AssertionError: Output directory dist/ must exist. Run npm run build before verifying artifacts.` (exit code 1).
  - Failure Propagation Verification: Introduced intentional assertion failure; confirmed `npm run verify` halted immediately with exit code 1; reverted cleanly.
  - `npm ci`: Clean install completed in 50s from lockfile with zero warnings/errors.
  - `npm run verify`: Passed all 6 pipeline stages from clean state (`check`, `lint`, `format:check`, `test`, `build`, `verify:artifacts`) with exit code 0.
  - `npm audit`: Documented 9 advisories in risk register with threat context and mitigations.
- Content truth: Zero personal data, employers, or production domains fabricated; all candidate projects remain in DRAFT status.
- Milestone Gate G1: Passed (Reproducible toolchain, CI verification, and architecture review complete).
- Owner signoff: Approved with required adjustments; implemented and verified on 2026-10-13

### EA-011 Execution record
- Status: DONE
- Git commit: (Pending local commit)
- Approved implementation plan: Approved by owner on 2026-10-13 with 3 required corrections, plus UI refinement on 2026-10-14:
  1. No dead links to unbuilt routes (`/projects/`, `/about/`, `/contact/`).
  2. CSS-first semantic disclosure mobile navigation using `<details>` and `<summary>` without unnecessary React islands or `aria-modal`.
  3. Extended production validation for link integrity, zoom, viewports, and JS-disabled navigation.
  4. UI Refinement (2026-10-14): Hide mobile disclosure trigger when no destinations beyond Home are published, eliminating redundant single-item menus and top-right clutter; preserve EA wordmark as primary Home link; automatically render disclosure when future routes become published; ensure zero overlap.
- Scope: Sticky dark navy header (`#080D17`, `bg-[var(--color-bg)]/90 backdrop-blur-md`), hairline border (`var(--color-border)`), temporary `EA` wordmark with accent dot, desktop `<nav aria-label="Main Navigation">`, reusable `NavItem.astro` with monospace index numbers (`01.`), 44x44px touch targets, gold focus ring (`#F0CF78`, 3px, 11.35:1 contrast), semantic CSS-first mobile disclosure `<details class="mobile-nav-details">` conditionally rendered via `hasPublishedDestinationsBeyondHome()`, SVG hamburger and close toggling via CSS, and progressive enhancement keyboard Escape / outside click closing.
- Navigation Route Safety Architecture:
  - Centralized in `src/data/navigation.ts`.
  - Only verified, existing routes (`/`) have `isPublished: true`.
  - Future routes (`/projects/`, `/about/`, `/contact/`) configured with `isPublished: false` until respective milestone tickets.
  - Future routes (`/writing/`, `/resume.pdf`) gated strictly by `featureFlags`.
  - Helper `getPublishedNavItems()` guarantees zero 404 links or placeholder routes in generated markup.
  - Helper `hasPublishedDestinationsBeyondHome()` dynamically enables mobile disclosure only when destinations beyond Home exist.
- Files created/changed:
  - `src/data/navigation.ts` (created: added centralized route config, `getPublishedNavItems()`, `isNavItemActive()`, `hasPublishedDestinationsBeyondHome()`)
  - `src/components/layout/NavItem.astro` (created: reusable accessible navigation link with monospace numbering and gold focus ring)
  - `src/components/layout/Header.astro` (created: sticky header, wordmark, desktop nav, conditional mobile disclosure)
  - `src/layouts/BaseLayout.astro` (modified: integrated Header component)
  - `tests/unit/navigation.test.ts` (created: route safety, feature flags, file existence, active state, and dynamic disclosure toggling)
  - `tests/artifacts/artifact-verification.ts` (modified: Section 10 header landmark, link integrity, mobile disclosure suppression when single destination exists, aria-current assertions)
  - `docs/CONTENT_STATUS.md` (modified: EA-011 marked DONE)
  - `docs/IMPLEMENTATION_BACKLOG.md` (modified: EA-011 execution record)
- Commands actually executed:
  - `npx tsx --test "tests/unit/**/*.test.ts"`: Both unit test suites passed cleanly (2 pass, 0 fail; verified `hasPublishedDestinationsBeyondHome` returns false on single route and true on simulated multi-route config).
  - `npm run format`: Prettier formatted all files cleanly with Astro 5 compatibility.
  - `npm run verify`: Full verification pipeline passed with exit code 0 (`check` [0 errors] -> `lint` [0 errors] -> `format:check` [clean] -> `test` [2 pass, 0 fail] -> `build` [1 static page in 11.01s] -> `verify:artifacts` [all 10 suites pass]).
  - `npm run preview -- --port 4321`: Started local preview server for real-browser verification.
  - Browser verification (`browser_subagent`):
    - Verified desktop 1440x900 header, wordmark, nav item `01. Home`, active styling.
    - Verified keyboard navigation: Tab to skip-link, Tab to `EA` wordmark (gold ring `#F0CF78`), Tab to `01. Home` (gold ring `#F0CF78`). Unclipped, visible, compliant with WCAG 2.2 SC 2.4.11 / 2.4.13.
    - Verified responsive breakpoints: 1440px, 768px, 390px, 320px.
    - Verified zero horizontal overflow on mobile viewports (`scrollWidth === clientWidth` on both 390px and 320px).
    - Verified refined mobile header: redundant hamburger toggle is cleanly omitted when only Home is published, eliminating any top-right overlap or visual clutter.
    - Verified EA wordmark operates as the primary Home link with 44x44px target and gold focus outline.
    - Verified No-JavaScript resilience: all links navigate natively without client JavaScript.
- Content truth: Temporary `EA` monogram retained; zero fabricated routes, personal names, employer names, or credentials; candidate projects remain in DRAFT status.
- Next Ticket: EA-012 — Buttons, links and shared UI primitives (Milestone 2).

### EA-012 Execution record
- Status: DONE
- Approved implementation plan: `ea_012_corrected_plan.md` (2026-10-14, approved with all 5 architectural corrections and 3 safeguards)
- Scope:
  - Polymorphic `Button.astro` supporting `primary`, `secondary`, and `ghost` variants, `sm`, `md`, `lg` sizes; renders native `<button type="button">` or `<a>`; inaccessible/disabled links render as `<span role="link" aria-disabled="true" tabindex="-1">` without an `href` attribute.
  - Genuine loading state: `isLoading` sets `disabled`, `aria-busy="true"`, `aria-live="polite"`, `<span class="sr-only">Loading...</span>`, and SVG spinner.
  - Accessible `TextLink.astro`: Underline text link with visible focus ring, configurable `openInNewTab` with `target="_blank" rel="noopener noreferrer"` and screen-reader notice `(opens in new tab)`.
  - Editorial `SectionHeading.astro`: Configurable semantic headings (`h2`-`h4`), Space Grotesk font, uppercase monospace eyebrow, and `reading-column` constrained description.
  - Technology `Tag.astro`: Informational (`<span>`) vs interactive (`<a>`) taxonomy pills, monospace font, &ge;44px touch targets on mobile viewports.
  - Restrained `StatusLabel.astro`: Static indicator dots (zero animations/pulses), honest tone mapping (`neutral`, `accent`, `warning`, `success`), surface-alt pill container.
  - Accessible SVG Icon primitives (`src/components/icons/*`): `ArrowRightIcon.astro`, `ExternalLinkIcon.astro`, `CheckIcon.astro`, `DocumentIcon.astro`, `SpinnerIcon.astro`. All enforce `aria-hidden="true"`, `focusable="false"`, and `currentColor` fill/stroke.
  - Extensible link safety utility (`src/utils/linkSafety.ts`): centralized validation of safe protocols (`https:`, `mailto:`, in-page anchors `#...`, relative paths to verified published files/assets); rejects unsafe protocols (`javascript:`, `data:`), protocol-relative URLs (`//...`), and unbuilt routes (`/projects/`, `/about/`, etc.).
  - Isolated rendered HTML integration test suite (`tests/artifacts/primitives-rendering.ts`): builds to isolated `tests/.test-dist/` without contaminating `dist/`, mounts and cleans up temporary fixture page `dev-primitives.astro`, validates rendered markup semantics.
  - Production artifact isolation: `tests/artifacts/artifact-verification.ts` asserts `dist/dev-primitives` is absent from production output and zero test showcase content leaks into `dist/index.html`.
- Files created/changed:
  - `src/utils/linkSafety.ts` (created: extensible link safety checker and protocol validator)
  - `src/components/icons/ArrowRightIcon.astro` (created)
  - `src/components/icons/ExternalLinkIcon.astro` (created)
  - `src/components/icons/CheckIcon.astro` (created)
  - `src/components/icons/DocumentIcon.astro` (created)
  - `src/components/icons/SpinnerIcon.astro` (created)
  - `src/components/ui/Button.astro` (created: polymorphic accessible button/anchor/disabled span)
  - `src/components/ui/TextLink.astro` (created: accessible text link with new-tab notice and fallback)
  - `src/components/ui/SectionHeading.astro` (created: semantic heading with monospace eyebrow)
  - `src/components/ui/Tag.astro` (created: static vs interactive monospace tags)
  - `src/components/ui/StatusLabel.astro` (created: static color dots with zero animations)
  - `src/components/dev/PrimitivesShowcase.astro` (created: development showcase component)
  - `tests/unit/linkSafety.test.ts` (created: link validator unit tests)
  - `tests/unit/primitives.test.ts` (created: primitives architecture unit tests)
  - `tests/artifacts/primitives-rendering.ts` (created: isolated rendered HTML integration test suite)
  - `tests/artifacts/artifact-verification.ts` (modified: added dev-primitives isolation assertions)
  - `package.json` (modified: added `verify:primitives` and integrated into `verify`)
  - `docs/CONTENT_STATUS.md` (modified: marked EA-012 DONE and EA-013 TODO)
  - `docs/IMPLEMENTATION_BACKLOG.md` (modified: added EA-012 execution record)
- Commands actually executed:
  - `npm run check`: 32 files checked, 0 errors, 0 warnings, 0 hints
  - `npm run lint`: 0 errors
  - `npm run format`: Prettier formatted all code cleanly
  - `npm run format:check`: All matched files use Prettier code style
  - `npm run test`: 4 test suites pass (ea008, linkSafety, navigation, primitives; 4 pass, 0 fail)
  - `npm run verify:primitives`: Builds to isolated `tests/.test-dist/`, verifies rendered HTML semantics, cleans up fixtures
  - `npm run build`: Production build generated in `dist/` with 1 page: `index.html`
  - `npm run verify:artifacts`: Production artifact verification passes all checks
  - `npm run verify`: Full unified verification pipeline passed with exit code 0
- Browser/a11y evidence:
  - Desktop 1440px: Verified visual hierarchy, Space Grotesk headings, button variants, status indicators, and SVG icons.
  - Tablet 768px: Verified responsive layout, flex wrap without clipping, and touch targets.
  - Mobile 390px: Verified mobile wrapping, &ge;44px touch targets on buttons, links, and tags, zero horizontal overflow.
  - Mobile 320px: Verified extreme mobile viewport resilience with zero horizontal scroll (`scrollWidth === clientWidth`).
  - Zoom 200%: Verified legible scaling, unclipped text, and accessible reflow.
  - Keyboard navigation: Verified unclipped visible focus ring (`#F0CF78`, 3px solid, 3px offset) on interactive elements; verified disabled links render as `<span role="link" aria-disabled="true" tabindex="-1">` without `href` (inaccessible to Tab navigation).
  - Screenshots recorded:
    - Desktop 1440px: `primitives_desktop_1440px_1791948800900.png`
    - Tablet 768px: `primitives_tablet_768px_1791948821229.png`
    - Mobile 390px: `primitives_mobile_390px_1791948844422.png`
    - Mobile 320px: `primitives_mobile_320px_1791948859444.png`
- Content truth:
  - Production `dist/index.html` remains pure baseline verification; zero showcase or draft content leaked.
  - Zero fabricated projects, metrics, or personal credentials.
- Next Ticket: EA-013 — Homepage Hero (Milestone 2).

### EA-013 Execution record
- Status: DONE
- Approved implementation plan: `ea_013_homepage_hero_plan.md` (2026-10-14, approved with all 6 corrections)
- Scope:
  - Asymmetric desktop composition: editorial headline on the left, architecture visual on the right.
  - Approved H1 headline: `Building reliable systems. Creating meaningful experiences.`
  - Approved overline: `SOFTWARE ENGINEER` with static cyan indicator dot.
  - Approved positioning text: `Software Engineer focused on Java, Scala, backend architecture, distributed systems, and thoughtful full-stack development.`
  - Primary CTA button: `Explore the Blueprint` linking to `#architecture-blueprint` (target element exists with `tabindex="-1"` and `role="region"`).
  - Handcrafted responsive vector SVG architecture diagram (`src/components/sections/HeroBlueprint.astro`): 6 technical nodes (`Client (gRPC)`, `Buffered Channel`, `Pipeline Handler`, `Consensus Log`, `Storage Engine`, `Peer Replica`), directional arrows, accessible description `#blueprint-summary`.
  - Honest conceptual labeling: `Conceptual Model` tag and `Status: Illustrative Architecture` (strictly no `In Clearance`, no `P99`, no fabricated metrics).
  - First-viewport proof at 390x844: CTA button bottom measured at `421px` (< 844px, >420px headroom before the fold).
  - 100% no-JS resilience, WCAG 2.2 AA compliant, visible gold focus outline (`#F0CF78`).
- Files created/changed:
  - `src/components/sections/HeroBlueprint.astro` (created: handcrafted vector SVG and conceptual card)
  - `src/components/sections/Hero.astro` (created: asymmetric hero composition and CTA)
  - `src/pages/index.astro` (modified: replaced temporary baseline with approved Hero)
  - `tests/unit/hero.test.ts` (created: unit test suite for copy, semantics, anchor, and diagram)
  - `tests/artifacts/artifact-verification.ts` (modified: added Section 11 Hero production checks)
  - `docs/CONTENT_STATUS.md` (modified: EA-013 marked DONE, EA-014 TODO)
  - `docs/IMPLEMENTATION_BACKLOG.md` (modified: EA-013 execution record)
- Commands actually executed:
  - `npm run check`: 35 files checked, 0 errors, 0 warnings, 0 hints
  - `npm run lint`: 0 errors
  - `npm run format`: Prettier formatted all code cleanly
  - `npm run format:check`: All matched files use Prettier code style
  - `npm run test`: 5 test suites pass (ea008, hero, linkSafety, navigation, primitives; 9 pass, 0 fail)
  - `npm run verify:primitives`: Builds to isolated `tests/.test-dist/`, verifies rendered HTML semantics, cleans up fixtures
  - `npm run build`: Production build generated in `dist/` with 1 page: `index.html`
  - `npm run verify:artifacts`: Production artifact verification passes all 11 suites including Section 11 Hero
  - `npm run verify`: Full unified verification pipeline passed with exit code 0
- Browser/a11y evidence:
  - Desktop 1440px: Verified asymmetric layout, headline hierarchy, and vector SVG architecture blueprint.
  - Tablet 768px: Verified natural responsive reflow without text clipping.
  - Mobile 390px: Verified vertical stacking (headline, copy, and CTA before blueprint); CTA button top = 373px, bottom = 421px, height = 48px (>420px headroom before 844px fold).
  - Mobile 320px: Verified zero horizontal scroll (`scrollWidth === clientWidth`).
  - Zoom 200%: Fluid reflow with zero overlapping text.
  - Keyboard navigation: Skip-link -> Wordmark -> Nav item -> Hero CTA button -> In-page scroll to `#architecture-blueprint`.
  - Screenshots recorded:
    - Desktop 1440px: `hero_desktop_1440px_1791957588864.png`
    - Tablet 768px: `hero_tablet_768px_1791957593541.png`
    - Mobile 390px: `hero_mobile_390px_1791957601032.png`
    - Mobile 320px: `hero_mobile_320px_1791957607475.png`
- Content truth:
  - Zero fabricated projects, metrics, or personal credentials.
  - Architecture blueprint explicitly tagged as `Conceptual Model` with `Status: Illustrative Architecture`.
- Remaining Hero Improvements (Tracked for polish / EA-018):
  - Improve architecture diagram readability at 320px and 390px.
  - Reduce the oversized desktop blueprint heading to improve visual hierarchy.
  - Review conceptual architecture arrows and technical flow for logical consistency.
  - Preserve the approved hero headline, CTA, colors, and responsive composition.
  - Do not introduce unverified technical claims or metrics.
- Next Ticket: EA-014 — Homepage featured work and capability sections (Milestone 2).

### EA-014 Execution record
- Status: DONE
- Approved implementation plan: `ea_014_featured_work_and_capabilities_plan.md` (2026-10-14, approved with all 8 corrections)
- Scope:
  - Centralized, typed project inventory in `src/data/projects.ts` with strict dual-gate publication filtering (`draft === false` AND `isRoutePublished(href) === true`).
  - Graceful empty omission: all 4 candidate projects remain `draft: true`; `FeaturedWork.astro` automatically suppresses its output completely in production when 0 verified projects exist.
  - Core Engineering Capabilities section (`src/components/sections/Capabilities.astro`) organized around 3 verified focus areas: Backend Engineering & APIs, Distributed Systems & Cloud Concepts, Full-Stack Development; with practical focus vs exploring separation and engineering disciplines. Zero skill bars, percentages, or unverified claims.
  - Engineering Approach section (`src/components/sections/EngineeringApproach.astro`) implementing the 4-step sequential methodology: Understand, Model & Design, Build & Test, Verify & Maintain.
  - `SectionHeading.astro` updated with explicit `id?: string` prop to guarantee every `aria-labelledby` references an existing heading ID.
  - Integrated into `src/pages/index.astro` while preserving the approved EA-013 Hero.
  - Unit tests in `tests/unit/capabilities.test.ts` and `tests/unit/projects.test.ts`.
  - Artifact verification in `tests/artifacts/artifact-verification.ts` (Section 12).
- Files created/changed:
  - `src/components/ui/SectionHeading.astro` (modified: added explicit heading id)
  - `src/data/projects.ts` (created: typed project registry and dual publication filter)
  - `src/data/capabilities.ts` (created: 3 focus areas and 4 approach stages)
  - `src/components/sections/ProjectCard.astro` (created: editorial project card)
  - `src/components/sections/FeaturedWork.astro` (created: featured projects with graceful omission)
  - `src/components/sections/Capabilities.astro` (created: 3-column capabilities grid)
  - `src/components/sections/EngineeringApproach.astro` (created: 4-stage engineering approach)
  - `src/pages/index.astro` (modified: integrated capabilities and approach)
  - `tests/unit/capabilities.test.ts` (created: capabilities and approach unit tests)
  - `tests/unit/projects.test.ts` (created: draft gating and dual verification tests)
  - `tests/artifacts/artifact-verification.ts` (modified: Section 12 post-build assertions)
  - `docs/CONTENT_STATUS.md` (modified: marked EA-014 DONE and EA-015 TODO)
  - `docs/IMPLEMENTATION_BACKLOG.md` (modified: added EA-014 execution record)
- Commands actually executed:
  - `npm run check`: 35 files checked, 0 errors, 0 warnings, 0 hints
  - `npm run lint`: 0 errors
  - `npm run format`: Prettier formatted all code cleanly
  - `npm run format:check`: All matched files use Prettier code style
  - `npm run test`: 7 test suites pass (ea008, hero, linkSafety, navigation, primitives, capabilities, projects; 15 pass, 0 fail)
  - `npm run verify:primitives`: Builds to isolated `tests/.test-dist/`, verifies rendered HTML semantics, cleans up fixtures
  - `npm run build`: Production build generated in `dist/` with 1 page: `index.html` in 1.98s
  - `npm run verify:artifacts`: Production artifact verification passes all 12 suites including Section 12
  - `npm run verify`: Full unified verification pipeline passed with exit code 0
- Browser/a11y evidence:
  - Desktop 1440px: Verified 3-column Capabilities cards, 4-stage Engineering Approach, and graceful omission of empty Featured Work.
  - Tablet 768px: Verified natural responsive wrapping of capabilities and approach stages.
  - Mobile 390px: Verified single-column vertical stacking, generous whitespace, legible tags, and zero horizontal scroll (`scrollWidth === clientWidth === 390px`).
  - Mobile 320px: Verified zero horizontal scroll on minimum mobile viewport (`scrollWidth === clientWidth === 320px`).
  - Zoom 200%: Fluid reflow with unclipped text and preserved margins.
  - Keyboard navigation: Full sequential Tab traversal across all cards and links with visible gold focus outline (`#F0CF78`).
  - Screenshots recorded:
    - Desktop 1440px: `ea014_desktop_1440px_1791959004977.png`
    - Tablet 768px: `ea014_tablet_768px_1791959014425.png`
    - Mobile 390px: `ea014_mobile_390px_1791959023723.png`
    - Mobile 320px: `ea014_mobile_320px_1791959032523.png`
- Content truth:
  - Zero draft project titles or draft cards leaked into production.
  - Zero skill percentages, years of experience, or unverified achievements claimed.
- Next Ticket: EA-015 — About page and verified timeline (Milestone 2).

### EA-015 Execution Record (2026-10-14)
- Ticket: EA-015 — About page and verified timeline (Milestone 2: Premium Responsive Core)
- State: COMPLETED & VERIFIED
- Files changed / created:
  - `src/data/about.ts` (created: typed bio, 3 values, 3 familiarity tiers, empty verified timeline with helper function)
  - `src/components/sections/AboutIntro.astro` (created: single H1, approved positioning narrative, emblem card portrait fallback)
  - `src/components/sections/EngineeringValues.astro` (created: 3-column values grid with 3 approved principles)
  - `src/components/sections/TechnicalFamiliarity.astro` (created: 3 honest tiers with tags, no percentage meters)
  - `src/components/sections/Timeline.astro` (created: semantic ol/time milestone component with graceful omission when 0 verified entries exist)
  - `src/components/sections/AboutClosing.astro` (created: safe navigation closing card linking to Home and #capabilities, zero broken /contact/ links)
  - `src/pages/about.astro` (created: /about/ static route)
  - `src/data/navigation.ts` (modified: published About route in navigationConfig)
  - `src/utils/seo.ts` (modified: defensive title formatting preventing duplicate brand suffix)
  - `tests/unit/about.test.ts` (created: comprehensive unit tests for About data, values, tiers, timeline omission)
  - `tests/unit/navigation.test.ts` (modified: updated tests for published /about/ and mobile menu disclosure)
  - `tests/unit/linkSafety.test.ts` (modified: updated tests for published /about/ route)
  - `tests/artifacts/artifact-verification.ts` (modified: Section 13 post-build assertions for /about/index.html, single H1, 3 values, 3 tiers, timeline omission, safe links)
  - `docs/CONTENT_STATUS.md` (modified: marked EA-015 DONE, EA-016 TODO)
  - `docs/IMPLEMENTATION_BACKLOG.md` (modified: added EA-015 execution record)
- Commands actually executed:
  - `npm run check`: 51 files checked, 0 errors, 0 warnings, 0 hints
  - `npm run lint`: 0 ESLint errors
  - `npm run format:check`: 100% compliant with Prettier code style
  - `npm run test`: 8 test suites pass (ea008, hero, linkSafety, navigation, primitives, capabilities, projects, about; 16 pass, 0 fail)
  - `npm run verify:primitives`: Passed in isolated `tests/.test-dist/`
  - `npm run build`: Production build generated in `dist/` with 2 pages (`index.html`, `about/index.html`) in 4.00s
  - `npm run verify:artifacts`: All 13 production artifact test suites pass including Section 13
  - `npm run verify`: Full unified verification pipeline passed with exit code 0
- Browser/a11y evidence:
  - Desktop 1440px: Verified single H1, 3 Engineering Values, 3 Technical Familiarity tiers, emblem card, graceful timeline omission, published navigation (`01. Home`, `03. About`).
  - Tablet 768px: Verified clean 2-column wrapping, zero horizontal scroll.
  - Mobile 390px: Verified single-column vertical stacking, responsive details/summary mobile menu, unclipped tags, zero horizontal scroll (`document.documentElement.scrollWidth <= window.innerWidth`).
  - Mobile 320px: Verified zero horizontal scroll on minimum mobile viewport (`document.documentElement.scrollWidth <= window.innerWidth`).
  - Keyboard navigation: Full sequential Tab traversal across all interactive elements with visible focus rings (`#F0CF78`).
  - Screenshots recorded:
    - Desktop 1440px: `ea015_desktop_1440px_1791961230423.png`
    - Tablet 768px: `ea015_tablet_768px_1791961274191.png`
    - Mobile 390px: `ea015_mobile_390px_1791961301094.png`
    - Mobile 320px: `ea015_mobile_320px_1791961309547.png`
- Content truth:
  - Zero invented university credentials, degrees, employers, job dates, certifications, years of experience, or project results.
  - Zero skill percentages or arbitrary proficiency meters.
  - Zero unconfirmed technologies (e.g., Rust and eBPF omitted from familiarity tiers).
  - Timeline section gracefully omitted completely when 0 verified milestones exist.
  - Zero links to unbuilt `/contact/` route.
- Next Ticket: EA-016 — Contact page and CopyEmail fallback (Milestone 2).












