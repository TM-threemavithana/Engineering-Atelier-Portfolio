# Content and Evidence Status (EA-012 Update)

**Last Updated:** 2026-10-14  
**Current Milestone:** Milestone 2 — Premium Responsive Core  
**Milestone 0 Status:** **COMPLETE** (EA-001 through EA-004 Signed Off)  
**Milestone 1 Status:** **COMPLETE** (EA-005 through EA-010 Gate G1 Verified)  
**Ticket Status:**  
- `EA-001` — **DONE** (Audit and Content Register Complete)  
- `EA-002` — **DONE** (Identity, Sitemap, Feature Flags Approved)  
- `EA-003` — **DONE** (Responsive Wireframes & Visual Architecture Approved)  
- `EA-004` — **DONE** (Tokens, Deterministic Contrast, ADR-001 to ADR-007 Approved)  
- `EA-005` — **DONE** (Scaffold Astro + Strict TypeScript)  
- `EA-006` — **DONE** (Tailwind v4 Global CSS Tokens & Accessible Utilities)  
- `EA-007` — **DONE** (Integrate React, MDX and Sitemap)  
- `EA-008` — **DONE** (Baseline Layout and Metadata Utilities)  
- `EA-009` — **DONE** (Lint, Type, Format, and Check Scripts)  
- `EA-010` — **DONE** (CI Checks and Preview Deployment Plan — Milestone 1 Gate G1 Complete)  
- `EA-011` — **DONE** (Header and Navigation — Sticky Navy Header, Zero Dead Links, Semantic Mobile Disclosure)  
- `EA-012` — **DONE** (Buttons, Links, and Shared UI Primitives — Accessible Polymorphic Buttons, Extensible Link Safety, Static Status Labels, Monospace Tags, SVG Icons)  
- `EA-013` — **TODO** (Homepage Hero — Asymmetric Layout, Technical Vector Illustration, Headline & CTA)  

**Governing Documents:** [AGENTS.md](file:///c:/Project/Engineering-Atelier-Portfolio/AGENTS.md), [docs/MASTER_SPEC.md](file:///c:/Project/Engineering-Atelier-Portfolio/docs/MASTER_SPEC.md), [docs/IDENTITY_AND_SITEMAP.md](file:///c:/Project/Engineering-Atelier-Portfolio/docs/IDENTITY_AND_SITEMAP.md)

---

## 1. Owner Profile Truth Status

| Field | Current State | Approved Value / Working Copy | Verification & Provenance | Publish Gate |
| :--- | :--- | :--- | :--- | :--- |
| **Professional Role** | **CONFIRMED** | `Software Engineer` | Owner instruction | **Approved** |
| **Primary Technical Focus** | **CONFIRMED** | `Java, Scala, Backend Engineering, Distributed Systems, Full-Stack Development` | Owner instruction | **Approved** |
| **Visual Direction** | **CONFIRMED** | `Direction C — Premium Minimalist + Controlled Creative Interactions` | Owner instruction | **Approved** |
| **Positioning Headline** | **CONFIRMED** | *"Building reliable systems. Creating meaningful experiences."* | Owner approval (Option B) | **Approved** |
| **Positioning Subheading** | **CONFIRMED** | *"Software Engineer focused on Java, Scala, backend architecture, distributed systems, and thoughtful full-stack development."* | Owner approval | **Approved** |
| **Full / Display Name** | **Awaiting Confirmation** | Temporary Monogram `EA` (*Engineering Atelier*) | Owner instruction | Safe fallback active |
| **Primary Contact Email** | **Awaiting Confirmation** | `[Awaiting Confirmation]` | Owner input pending | Direct mailto suppressed |
| **GitHub Profile URL** | **Awaiting Confirmation** | `[Awaiting Confirmation]` | Owner input pending | Social icon suppressed |
| **LinkedIn Profile URL** | **Awaiting Confirmation** | `[Awaiting Confirmation]` | Owner input pending | Social icon suppressed |
| **Public Location** | **Awaiting Confirmation** | Omitted from UI by default | Privacy consent pending | Completely hidden |
| **Current Résumé PDF** | **Awaiting Confirmation** | None | Owner input pending | Gated by feature flag (`enableResume: false`) |
| **Portrait / Image** | **Optional / Absent** | None | Owner input pending | Typographic hero used |
| **Education History** | **Awaiting Confirmation** | None | Owner input pending | Omitted until verified |
| **Experience / History** | **Awaiting Confirmation** | None | Owner input pending | Omitted until verified |
| **Availability Status** | **Optional / Absent** | None | Owner input pending | Omitted until verified |

---

## 2. Candidate Projects Status

Per `docs/CONTENT_AND_EVIDENCE.md` and `docs/MASTER_SPEC.md`, all four candidate projects remain in strict **DRAFT** status:

| Candidate Project | Domain | Status | Required Evidence | Action |
| :--- | :--- | :--- | :--- | :--- |
| **StreamForge** | Distributed Systems | **DRAFT** | Verified repository, gRPC/message design, author's exact role, tests | Gated (`draft: true`) |
| **DevForge** | Developer Tooling (Scala) | **DRAFT** | Scala repo/release, CLI UX evidence, author's exact role | Gated (`draft: true`) |
| **Java/Spring Boot Task API** | Java Backend | **DRAFT** | Actual API codebase, OpenAPI spec, test coverage | Gated (`draft: true`) |
| **Currency Authentication Work** | Computer Vision / ML Research | **DRAFT** | Dataset rights, algorithm documentation, prototype codebase | Gated (`draft: true`) |

---

## 3. Active Feature Flags (MVP Defensive Controls)

| Flag Name | Setting | Purpose / Policy |
| :--- | :--- | :--- |
| `enableResume` | `false` | Suppresses résumé download CTA until authentic PDF is placed in `public/resume.pdf` |
| `enableWriting` | `false` | Hides `/writing/` route and navigation link until $\ge 1$ verified article exists |
| `enableArchitectureExplorer` | `false` | Deferred to Milestone 4 (EA-028) once verified project architecture is approved |
| `enableProjectFilter` | `false` | Deferred until $\ge 5$ verified published projects exist (Master Spec §4.2) |
| `enableContactForm` | `false` | Omitted per ADR-003 (static direct contact only) |
| `enableThemeSwitcher` | `false` | Omitted per ADR-005 (single dark theme `#080D17` in MVP) |
| `enableWebGL` | `false` | Omitted per ADR-004 (CSS/SVG only; no heavy 3D in MVP) |
| `enableAnalytics` | `false` | Omitted (privacy-first baseline, zero cookies) |

---

## 4. Next Milestone Gates

1. **Owner Approval of EA-002:** Review brand positioning options, sitemap, and feature flags.
2. **EA-003 (Milestone 0):** High-level responsive wireframes (1440px desktop, 768px tablet, 390px/320px mobile) and first-viewport CTA validation.
3. **EA-004 (Milestone 0):** Finalize design tokens and formalize ADRs before scaffolding in Milestone 1.
