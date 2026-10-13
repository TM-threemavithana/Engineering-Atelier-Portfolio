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
- Status: TODO (Next ticket)
- Scope: Integrate React, MDX and sitemap; verify official Astro integrations and compatibility








