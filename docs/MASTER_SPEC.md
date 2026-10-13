# ENGINEERING ATELIER
## Premium Interactive Software Engineer Portfolio — Master Specification

**Spec ID:** EA-SPEC-001  
**Version:** 1.0  
**Date:** 13 October 2026  
**Status:** Approved design direction / proposed implementation specification  
**Target environment:** Google Antigravity IDE  
**Design direction:** C — Hybrid premium minimalist + controlled interactive  
**Primary goal:** A distinctive, fast, accessible, evidence-led engineering portfolio that helps visitors evaluate genuine software engineering work.

> **Implementation rule:** This document is the product specification, not an instruction to claim unverified work. The agent must not invent biography, job titles, availability, code repositories, numerical outcomes, client testimonials, published articles, or completed project status. Content with missing evidence remains draft and is excluded from the live site.

---

# 1. Executive decision record

## 1.1 What is being built
A personalized, content-first, static-first portfolio for a software engineer interested in Java, Scala, backend platforms, distributed systems, full-stack development, and high-quality frontend experiences. Its visual identity is sophisticated dark editorial design with subtle cyan details and occasional purposeful animation. Every substantive feature must support one of three outcomes: (1) understand the engineer, (2) evaluate their work, (3) contact or review their professional material.

The site uses **Astro + TypeScript** for most markup, **React islands** only for meaningful interactions, **Tailwind CSS 4 through `@tailwindcss/vite`** for styling, **MDX + typed content collections** for written work, and **Motion for React** only where its extra JavaScript is justified. It deploys as prerendered static output unless a later requirement establishes a need for server rendering.

## 1.2 Priorities
- **P0 / MVP:** Home, project index, at least two verifiable project case studies (or fewer if evidence is unavailable), About, contact, downloadable valid résumé, custom 404, metadata, navigation, mobile behavior, accessibility, automated checks, deployment.
- **P1 / Polished release:** Writing index/article routes with actual content, interactive architecture explorer for one real project, progressive page animation, improved previews and optional project filtering when enough published projects exist.
- **P2 / Optional:** Theme switcher, search, downloadable case-study PDF, live project demos, selective WebGL experiment, RSS feed, content CMS, contact form, analytics. Never block P0 with P2.

**Release-blocking truth rule:** If verifiable content is insufficient, release a smaller honest site. Do not substitute fictitious case studies or broken placeholders.

## 1.3 Audience, questions, actions
| Audience | Question they need answered | Primary action |
| --- | --- | --- |
| Recruiter / talent partner | What roles, experience and skills are relevant? | Open résumé or contact |
| Engineering manager | Can the candidate make sound decisions and explain trade-offs? | Read a case study |
| Senior engineer | Does the code, design and test evidence hold up? | Open repository, review architecture |
| Collaborator / client | What problems can this engineer solve? | Contact |
| Mobile visitor | Can I get a reliable overview in under a minute? | Scan top projects |

The opening viewport must communicate role, value proposition and a prominent route to selected work without requiring a scroll, animation, or hover. Every published case study must distinguish individual contributions from team work.

## 1.4 Success criteria and analytics policy
- **Operational acceptance:** All specified P0 journeys work at 320px through 1440px+; no dead links; no placeholder data in published pages.
- **Qualitative acceptance:** In an informal test, a visitor can identify the engineer's target domain and reach a substantive project within 20 seconds. This is a usability hypothesis, not a pre-claimed measured outcome.
- **Technical targets:** zero critical accessibility findings; no horizontal overflow at supported widths; passing build/tests; representative Lighthouse runs aiming >=90 per category; field Core Web Vitals targets LCP <=2.5s, INP <=200ms, CLS <=0.1 at p75 when field data exists.
- **Telemetry:** No third-party analytics by default. If opted in later, document provider, consent/privacy obligations, retention, and accessibility; never claim conversion gains without actual measurement.

# 2. Positioning and truthful editorial strategy

## 2.1 Positioning
Brand archetype: **The Thoughtful Systems Builder**. The website communicates careful trade-offs, maintainable implementation, measured technical curiosity and tasteful visual execution. The tone is confident but evidence-led; never boastful.

**Candidate headline (requires owner's approval):** “Building reliable systems. Creating meaningful experiences.”

**Candidate supporting copy (may be edited):** “Software engineer focused on backend systems, scalable architectures and thoughtful web experiences. I turn complex requirements into software that is understandable, testable and useful.”

**Primary CTA:** `Explore my work` -> `/projects/`.  
**Secondary CTA:** `View résumé` -> `/resume.pdf` (only if a current file is available).  
**Tertiary action:** `Get in touch` -> `/contact/`.

## 2.2 Voice and copy rules
Use first person in About and case study reflections; concise neutral professional descriptions elsewhere. State the problem and result before dumping the tech stack. Replace adjectives such as “world-class”, “revolutionary”, and “industry-leading” with facts, constraints or demos. Numbers require sources and methodology. A team project must name what the owner actually did. A learning/prototype project must say that it is a prototype. Experience and certifications must be verified before publishing.

## 2.3 Work-in-progress and asset controls
Possible portfolio topics: **StreamForge** (distributed systems), **DevForge** (developer tooling with Scala focus), a **Java/Spring Boot API project**, and **currency-authentication CV/ML research**. These are *candidates*, not claims of completed outcomes. Do not publish them until their scope, artifacts and individual contributions have been confirmed. Tag draft or WIP items with clear status. Do not let generic concept art masquerade as an actual product screenshot. Use actual screenshots or clearly labeled conceptual diagrams.

# 3. Scope and information architecture

## 3.1 Page map and routability
| URL | Page | Priority | Notes |
| --- | --- | --- | --- |
| `/` | Home | P0 | Elevator pitch, featured verified work, expertise, story, CTA |
| `/projects/` | Projects | P0 | Selected work, status, tags, evidence links |
| `/projects/[slug]/` | Case study | P0 | Real technical narrative and diagrams |
| `/about/` | About | P0 | Education, actual experience, engineering values, tools |
| `/contact/` | Contact | P0 | Email and verified professional links; no backend needed |
| `/writing/` | Writing index | P1 | Only publish when at least one real article exists |
| `/writing/[slug]/` | Article | P1 | Table of contents, accessible code blocks |
| `/404` | Not found | P0 | Clear recoverable path home/projects |
| `/resume.pdf` | Résumé asset | P0 conditional | Only link when genuine, current PDF supplied |
| `/rss.xml` | RSS feed | P2 | Optional when publication volume justifies it |
| `/privacy/` | Privacy notice | Conditional | Required when collecting data/using relevant tracking |

Routes using `[slug]` are generated from validated content and exclude `draft: true` during production. If the résumé is unavailable, hide rather than break its CTA. If no approved articles exist, remove Writing from primary navigation until launch of P1. A static contact page is preferred over an unnecessary form.

## 3.2 Primary journeys
**Journey A, recruiter (mobile):** land -> understand role at first viewport -> tap Projects -> read project summary -> open résumé/contact in <=3 clear interactions.  
**Journey B, engineering manager:** land -> selected work -> case study -> problem -> architecture -> trade-offs -> source/demo -> contact.  
**Journey C, technical reader:** direct article/case study URL -> readable text/code and contextual back link -> related work -> contact.

## 3.3 Navigation taxonomy
Desktop: wordmark `EA` or owner's initials, Projects, About, Writing (when published), Contact, understated résumé action (when available). Mobile: visible logo, menu toggle with `aria-expanded`, accessible dialog-like navigation or region with keyboard focus management, close on Escape/navigation, body scroll lock only while open. Do not hide important links behind hover-only menus.

# 4. Detailed page specifications

## 4.1 HOME — `/`
**Goal:** Establish identity, surface credible work, and create a clear recruiter path.  
**Desktop composition:** Sticky or fixed-width top navigation; hero two-column (roughly 7/5) on wide screens, stacked on mobile; editorial rhythm with contrasting dense and open sections. Hero visual should be tasteful abstract visual/diagram, NOT a heavy 3D scene or random portrait substitute.

**Sections in order:**
1. **Navigation** — accessible anchored header; logo link home; active route state.
2. **Hero** — small overline “SOFTWARE ENGINEER”; distinctive H1 (no text scramble); <=2 short supporting sentences; primary Explore Work link; conditional résumé secondary action; optional small `Based in Sri Lanka` only if owner approves location disclosure.
3. **Featured projects** — 2–3 verified project cards, each with title, one-sentence problem, contribution, key technologies (max four visible tags), evidence CTA. No fabricated metrics. Cards use mixed-size editorial layouts but same semantic order.
4. **Capabilities** — 3 grouped areas: Backend & APIs; Distributed Systems & Cloud; Frontend Experience. Skills must be validated with owner; don't label all as expert.
5. **Approach / process** — “Understand / Design / Build / Validate” in a 4-step succinct block, connected to specific documented work where possible.
6. **Experience teaser** — most relevant verified professional experience, organization, role, period, ownership. No fake employer badges. Link to About.
7. **Selected writing** — only if at least one published article; otherwise section omitted.
8. **Personal call-to-action** — “Have an engineering problem worth solving?” Email and social links.
9. **Footer** — copyright generated from current year, meaningful internal links, optional back-to-top, privacy when relevant.

**First-screen criteria:** H1 and project CTA visible on a representative 390x844 viewport without waiting for animation. Hero assets lazy-loading only if not LCP; prominent meaningful visual gets optimized priority load. No loader/splash screen.

## 4.2 PROJECTS — `/projects/`
**Goal:** Scan work by value rather than buzzwords.  
**Header:** `Selected Work`, 1–2 sentence description of kinds of problems tackled.  
**Main:** All published work in date/order priority; first featured 3 are emphasized; each includes title, problem, contribution, role, year if verified, status, technology tags, thumbnail with accurate alt, route to case study. External repo and demo link are secondary with visible indication they leave the site.

**Filtering:** Implement only with >=5 published case studies; accessible filters “All / Backend / Distributed Systems / Full-stack / Research”, category counts optional; state should not make content inaccessible to screen readers; empty filter state gives reset. No animated masonry that reorders focus unpredictably. If fewer than five projects, omit filtering.

## 4.3 CASE STUDY — `/projects/[slug]/`
**Goal:** Validate technical reasoning and evidence.  
**Template order:** Breadcrumbs -> project title and truthful status -> concise summary -> fact panel (role, collaborators, dates, technologies, links) -> actual cover/architecture image -> Challenge -> Constraints -> Your Contribution -> Solution overview -> Architecture (diagram + text equivalent) -> Key Engineering Decisions (alternatives, trade-offs) -> Implementation details (code, API or schema where relevant) -> Testing/Reliability/Security -> Outcomes/Evidence (measured only) -> What I learned/Next iteration -> Related projects -> Contact CTA.

**Conditional sections:** Omit unsupported results, hide nonexistent demo/repo links, show `Under development` explicitly for legitimate WIP. Maintain references for external sources. If a team project, clearly label team effort. Require text alternative to each diagram, and a linked full-size image if detail is too dense.

**Sample decision block:** `Decision / Context / Options considered / Selection / Consequences / Verification`. This is essential; mere stack lists are insufficient.

**Readability:** max prose column 68–74ch, code horizontally scrollable within its own region, headings as anchors, optional sticky TOC for long case studies, accessible copy-button optional, <=1 H1. On small screens TOC collapses into simple jump links.

## 4.4 ABOUT — `/about/`
**Goal:** Build trust and show learning mindset without duplicating the CV.  
**Sections:** one short personal introduction, real background/education, verified experience timeline, actual tools grouped by practical familiarity (primary / working knowledge / exploring), how I work, selected interests, CTA. A portrait is optional; only use a user-approved real image. Avoid artificial personality badges, self-rated skill bars and unsupported impact claims.

Experience timeline entries must include organization, position, period, concise tasks and individually owned work. Education entries must use verified degree/degree status and dates. Each mention of training or internship must be accurately attributed and not inflated to full-time experience.

## 4.5 CONTACT — `/contact/`
**Goal:** Remove friction to contacting the owner.  
**Sections:** warm short H1, preferred email mailto link, copy-email control with live region success message, verified GitHub/LinkedIn links, optional location/time zone only if consented, optional availability statement only if current and confirmed. Footer.

**No default contact form:** This static-first release should not collect personal data. If a form is later justified, plan anti-spam, serverless validation, rate limiting, email delivery, data retention, privacy notice, accessible errors, and abuse handling before implementation.

## 4.6 WRITING INDEX — `/writing/` (P1)
Header + brief explanation; list of approved articles with title, summary, publish date, topic labels, estimated reading time computed from content; one-featured item optional. No fictitious blog entries or dates. If no published articles, route may be withheld from production and nav.

## 4.7 ARTICLE — `/writing/[slug]/` (P1)
Semantic article H1, verified date, editorial summary, MDX body, headings with stable IDs, linked sources, responsive figures/captions, highlighted code with accessible language label, previous/next or related work, author info, back-to-writing. Reading progress indicator is optional and must not be necessary to use the page.

## 4.8 SYSTEM PAGES
**404:** branded plain language, “Page not found”, Return Home and View Projects; no dead ends.  
**Privacy (conditional):** accurate disclosure of analytics, third-party embeds, and form data; don't invent legal claims.  
**Résumé:** professionally proofread real PDF, accessible selectable text, up-to-date links; provide accessible anchor link, not forced download.  
**Robots/sitemap:** index only approved canonical pages. No draft pages or accidental preview URLs in production sitemap.

# 5. Visual identity and design tokens

## 5.1 Brand aesthetics
Dark premium editorial, subtle engineering references (grid/connector geometry), restrained cyan/teal accent, deliberate whitespace, asymmetrical but orderly composition, soft hairline strokes, occasional outline cards, polished hover/focus states. Avoid common “glowing rainbow developer template” clichés, neon overload, noise that affects readability, fake terminal clichés, excessive rounded-glass cards, and large background videos.

## 5.2 Token set
| Token | Value | Usage |
| --- | --- | --- |
| `--color-bg` | `#080D17` | Page background |
| `--color-surface` | `#111C2B` | Raised surfaces and panels |
| `--color-surface-alt` | `#17263A` | Subtle emphasis |
| `--color-fg` | `#F3F7FF` | Primary text |
| `--color-muted` | `#A5B7CE` | Secondary text; verify contrast |
| `--color-accent` | `#5EEAD4` | Selected emphasis, link states |
| `--color-accent-hover` | `#94F5E6` | Accent hover |
| `--color-border` | `#34465D` | Hairlines (adjust contrast as needed) |
| `--color-danger` | `#FF9EAB` | Error states |
| `--color-focus` | `#F0CF78` | Visible keyboard focus ring |
| `--font-display` | `Space Grotesk` (fallback sans) | Hero/headings |
| `--font-body` | `Inter` (fallback sans) | Prose/UI |
| `--font-mono` | `JetBrains Mono` (fallback mono) | Overlines, code |

Self-host woff2 subsets if licenses permit; avoid loading more than necessary font weights. Provide system font fallbacks and use `font-display: swap` or comparable technique. Validate actual contrast; a token name does not guarantee WCAG conformance.

## 5.3 Type hierarchy
Desktop H1 `clamp(3rem, 6vw, 6.25rem)` with slightly tight tracking and line-height ~1.03; H2 `clamp(2rem, 3.5vw, 3.5rem)`; H3 `1.35–1.75rem`; body `1rem` to `1.125rem`, line-height 1.65; small editorial overlines `0.75rem`/mono, spaced capitals, never used for long paragraphs. Mobile H1 uses clamp minimum 2.5rem and line wraps reviewed at 320px. Links distinguishable beyond color in body prose.

## 5.4 Layout rhythm
Max outer width ~1200px; article prose width ~72ch; desktop 12-column conceptual grid with responsive CSS Grid; 24–32px side padding at desktop (up to 64px wide); 16–20px at narrow phone; section spacing `clamp(4rem, 8vw, 9rem)`; core spacing 4, 8, 12, 16, 24, 32, 48, 64, 96 px. Cards use border radius ~12–18px, avoid huge pill surfaces except buttons/labels. Mobile stacked order must preserve narrative.

**Reference viewports:** 320x568, 375x812, 390x844, 430x932, 768x1024, 1024x768, 1280x800, 1440x900, 1920x1080; test zoom 200% and large text. Do not implement hard-coded viewport heights that clip content.

## 5.5 Imagery and architecture diagrams
Prioritize actual product screenshots, annotated UI captures, project diagrams, screenshots of CI coverage/deployments (if safe), and approved portrait. Each image has source/ownership, caption and alt. Decorative SVG shapes are allowed but `aria-hidden`. Project thumbnails maintain stable aspect ratio ~16:10 or 16:9; vary featured-card layout using CSS, not unrelated image dimensions. No AI-generated mock screenshot may be presented as an operational product.

Technical diagrams: accessible SVG or HTML/CSS with text equivalence; labels understandable without color; controls have keyboard activation; mobile view switches to linear list/detail pattern if pan/zoom would be needed; no live system endpoint dependencies for diagram display.

# 6. Component specifications (contract + states)

Each component must have documented props and states in code or Storybook-equivalent examples. Use Astro for display-only units, React only for interactive state.

| Component | Contract / behavior | States / accessibility |
| --- | --- | --- |
| `SiteHeader` | Brand link, route links, conditional résumé | Rest, sticky, focus; landmark navigation |
| `MobileNav` | Menu button + route list | Open/closed; aria-expanded; Escape; focus return; keyboard |
| `PrimaryButton` | Internal/external CTA | Normal/hover/focus/disabled; minimum 44x44 touch target where practical |
| `TextLink` | Inline or underlined link | Persistent distinguishability; visible focus |
| `ThemeAccent` | Decorative abstract geometry | CSS/SVG; non-interactive; aria-hidden |
| `HeroIntro` | Overline, H1, description, CTA(s) | No animation-dependent visibility |
| `SectionHeading` | Heading, optional summary/eyebrow | Valid heading level; anchor optional |
| `ProjectCard` | Image, title, contribution, labels, action | Normal/hover/focus; entire card *or* clear link; no nested anchors |
| `ProjectFeature` | Large featured project composition | Image/text position reverses desktop, logical DOM order |
| `TechnologyTag` | Text technology labels | Never sole proof of skill; non-interactive unless genuinely filters |
| `StatusLabel` | Verified complete/prototype/WIP/research | Status rendered as text, not color alone |
| `ProjectFilter` | Optional client-side filter | All/selected/zero results; announce counts; preserve tab order |
| `ArchitectureExplorer` | Focusable node/detail content | Select/hover/focus; `button` nodes, explanatory adjacent panel; mobile list fallback |
| `DecisionBlock` | Context/options/decision/consequence | Semantic headings; no hidden details |
| `ExperienceTimeline` | Verified roles and dates | Reading order works without layout CSS |
| `SkillGroup` | Contextual technology group | Real mastery labels not arbitrary progress bars |
| `ArticleCard` | Title/date/summary/topic | Opens valid article route |
| `ArticleToc` | Anchor links for long articles | Visible focus; skip absent headings |
| `CodeBlock` | Language, code, optional copy | Keyboard copy, response in aria-live; no broken wrap |
| `Figure` | Image/SVG + caption | Correct alt and dimensions; link full resolution if needed |
| `ContactLinks` | mailto/social URLs | Human-readable destination and accessible labels |
| `CopyEmail` | Optional clipboard write | Success/error/unsupported fallback; never hides normal email link |
| `SiteFooter` | Internal and verified external links | Always present, distinct from main navigation |
| `NotFound` | Recovery actions | Simple, no trap |
| `SkipLink` | Skip to main content | First keyboard-focusable action |

**Required component checks:** semantic tags, single H1/page, stable keys where interactive, focus visibility, hover parity on touch, no nested interactive controls, sufficient contrast, no loading flash, source link validity.

# 7. Motion and interaction specification

## 7.1 Philosophy
Motion should guide attention, communicate interaction and reinforce hierarchy — never hide essential content or slow primary navigation. CSS transitions suffice for simple hover/focus states; reserve Motion for genuinely coordinated React-island interactions.

| Interaction | Default | Timing | Reduced-motion alternative |
| --- | --- | --- | --- |
| First hero reveal | Small opacity + 8–16px rise | 450–650ms, once | Immediate or short opacity fade |
| Nav appearance | Simple subtle opacity | <=250ms | None |
| Button hover | Border/background, optional arrow shift <=4px | 150–220ms | Color/border only |
| Card hover | TranslateY <=4px, border highlight | 180–260ms | No movement; focus border |
| Image hover | Scale <=1.025 in clipped frame | 250–450ms | Static |
| Section enter | Opacity + <=16px on first visibility | <=500ms | Static or fade; never `display:none` wait |
| Filter change | Simple state update; optional fade | <=220ms | Instant state |
| Architecture selection | Smooth highlight + adjacent info | <=220ms | Instant state |
| Page transition | Native/standard navigation by default | None | None |
| Scroll progress | Optional thin indicator | Lightweight | Static/hidden |

**Easing:** use a consistent ease-out such as `cubic-bezier(0.22, 1, 0.36, 1)` for short transitions; no endless pulsing/glow, no custom cursor that harms usability, no forced smooth scrolling and no scroll hijacking. All content exists in document before animation. Limit to 1–2 simultaneous emphasized movements per viewport.

## 7.2 Accessibility and performance guardrails
Follow `prefers-reduced-motion`; on React islands use `MotionConfig reducedMotion="user"` and adapt via `useReducedMotion`. Test keyboard interactions while motion is active. Avoid frequent layout-triggering properties; prefer opacity/transform where appropriate; do not animate layout dimensions for long passages. Pause or disable any decorative continuous motion offscreen and on reduced-motion devices. Three.js is P2-only after its separate performance budget and fallback are justified.

# 8. Content model and publishing requirements

## 8.1 Content truth and minimum standards
Each project entry requires `title`, `slug`/ID, `summary`, `problem`, `role`, `individualContribution`, `status`, `categories`, `technologies`, at least one substantial body section, and `draft`. `repoUrl`, `liveUrl`, measurements, dates and images are optional but **must be real** when present. Published cards without a publicly accessible code repo are acceptable when work is confidential, but explain evidence limitations and use truthful anonymized details only with permission.

**Minimum case study standard:** 350+ meaningful words or equivalent well-supported visual explanation, one concrete engineering decision, genuine contribution, relevant challenge, and clear outcome/learning. Publishing status checks completeness of evidence, not length alone.

**No hallucination rule:** The agent must ask for exact missing facts or create TODO entries. On default builds, `draft: true` entries are excluded. Keep all placeholder project text visibly marked `DRAFT ONLY` inside source files. Never display placeholder emails, fake resumes, empty UI captures or numeric claims on production.

## 8.2 Astro content collections
Use `src/content.config.ts` with `defineCollection`, `glob`, and a Zod schema. One collection `projects`, one `writing`; keep global profile data in a small typed `src/data/profile.ts` checked by schema or in a `site.json` validated at build time. Content pages as MDX; metadata in frontmatter. Prefer `getCollection('projects', ({data}) => !data.draft)` for production route generation, validating links and images through tests.

**Project schema fields:**
- `title: string` nonempty; `summary: string` 1–2 sentences
- `publishedAt?: Date`; `updatedAt?: Date`; avoid faked values
- `status: 'completed' | 'prototype' | 'in-progress' | 'research'`
- `role: string`; `collaborators?: string[]`; `individualContribution: string`
- `categories: ('backend'|'distributed'|'fullstack'|'research'|'frontend')[]`
- `technologies: string[]`; `featured: boolean`; `featureOrder?: number`
- `repoUrl?: url`; `demoUrl?: url`; `architectureImage?: image()`; `coverImage?: image()`
- `evidence?: {label: string, url: url, kind: 'repo'|'demo'|'test'|'document'|'article'}[]`
- `metrics?: {name: string, value: string, methodology: string, evidenceUrl?: url}[]`
- `draft: boolean`; `seoDescription?: string`; `readingMinutes` computed, not fabricated

**Writing schema fields:** title, description, date (required if public), optional updated date, topics, cover image optional, `draft`, citations/source links inside body. Tags should be normalized against known taxonomy.

## 8.3 Source content checklist
The owner must provide or approve: accurate preferred display name, headline, target roles, location disclosure policy, contact email, verified GitHub and LinkedIn, résumé asset, education credential/date, work history contributions/date, project repository and screenshots, honest project statuses, diagrams, and preferred photo (optional). The site generator must keep a per-field verification table and not infer missing biography from prior chats.

The separate `docs/CONTENT_AND_EVIDENCE.md` contains a fillable intake matrix and a case-study writing rubric.

# 9. Technical architecture

## 9.1 Stack and rationale
- **Astro (current supported release at execution):** HTML-forward prerendering, routes, collections, static output; efficient for content-heavy portfolio.
- **TypeScript strict mode:** typed content, no `any` without justification.
- **@astrojs/react:** selective client hydration; choose `client:visible` for below-fold interactive diagrams, `client:idle` for noncritical controls, `client:load` only for genuinely necessary immediate interactivity.
- **@astrojs/mdx:** longform project articles; guard against executing untrusted MDX. All authored content is trusted local source.
- **Tailwind v4 with @tailwindcss/vite:** one semantic design token layer; do not use obsolete Tailwind configuration/install patterns from v3 tutorials.
- **Motion (`motion/react`):** only interactive React islands requiring rich transitions; simple website effects use CSS.
- **Astro `<Image />` and `<Picture />`:** optimize assets; explicit dimensions; responsive `sizes`.
- **@astrojs/sitemap:** canonical approved URLs only.
- **Playwright:** E2E, mobile, navigation, core user journeys; plus `@axe-core/playwright` for automated accessibility checks.
- **Vitest or built-in unit test approach:** pure helpers/schemas if logic warrants it; no testing framework solely for vanity.
- **GitHub Actions:** lint, typecheck, build, tests; separate deploy workflow or hosting Git integration.

Pin compatible package versions in lockfile after evaluating the then-current stable documentation; do not assert version numbers without checking release compatibility. Avoid a full backend/database/authentication unless an explicitly approved feature requires one. Avoid portfolio-specific microservices.

## 9.2 Proposed repository structure
```text
portfolio/
  AGENTS.md
  README.md
  docs/
    MASTER_SPEC.md
    IMPLEMENTATION_BACKLOG.md
    CONTENT_AND_EVIDENCE.md
    QUALITY_PLAN.md
    adr/
  public/
    favicon.svg
    robots.txt
    resume.pdf                  # only if genuine/current
  src/
    assets/
      projects/
      profile/
    components/
      layout/ SiteHeader.astro MobileNav.tsx SiteFooter.astro
      ui/ Button.astro TextLink.astro SectionHeading.astro
      projects/ ProjectCard.astro ProjectFeature.astro ArchitectureExplorer.tsx
      content/ Figure.astro DecisionBlock.astro ArticleToc.astro
      contact/ CopyEmail.tsx
    content/
      projects/                 # .mdx entries
      writing/                  # .mdx entries
    content.config.ts
    data/
      profile.ts
      navigation.ts
    layouts/
      BaseLayout.astro
      CaseStudyLayout.astro
      ArticleLayout.astro
    pages/
      index.astro
      about.astro
      contact.astro
      projects/index.astro
      projects/[slug].astro
      writing/index.astro
      writing/[slug].astro
      404.astro
    styles/
      global.css
      tokens.css
    utils/
      seo.ts
      links.ts
  tests/
    e2e/
    a11y/
    unit/
  .github/workflows/
  astro.config.mjs
  package.json
  tsconfig.json
  playwright.config.ts
```
The agent can refine component boundaries in a reviewed ADR, but must maintain Astro-first/React-as-needed principles.

## 9.3 Data flow
Build reads validated local profile data + MDX collections -> Astro prerenders semantically correct HTML -> optimized static assets/CDN -> browser loads minimal JS -> React islands hydrate only when necessary. No third-party runtime API is needed to render core content. Failure of JS must not prevent seeing projects, links or contact. Interactive filtering or diagram detail may enhance but not gate content.

## 9.4 Build, environments and configuration
Local/preview/prod environments share code; define `SITE_URL`/Astro `site` as verified final domain before release; previews are non-indexed using deployment settings and robots/header policy as appropriate. No secrets in public source, client bundles or tracked `.env`. Default CSP should limit scripts/connects; test any Astro hydration or deployed nonce/hash needs before strict enforcement. Set security response headers through host configuration. External links with `target="_blank"` require `rel="noopener noreferrer"`; optionally open same tab to reduce complexity.

## 9.5 Search engine and structured data
One title and description per route, `lang="en"` (or accurate site language), canonical absolute URL, Open Graph/Twitter card image with real branding, favicon/manifest as needed, `sitemap.xml`, `robots.txt`. Homepage `Person` JSON-LD may reference only verified identity/profiles; use `ProfilePage` markup on a qualifying About page if current Google requirements are met. Schema is not a guarantee of search appearance. Don't include unverified job role, awards or sameAs links. Use the final public domain, not placeholders at deploy time.

## 9.6 Security and privacy
No auth, database or contact form in MVP = smaller attack surface. Dependabot or equivalent dependency monitoring, pinned lockfile, minimal npm dependencies, no unsafe HTML injection, avoid remote fonts/tracking scripts, sanitize any external embedded content, secure headers, apply least-privilege deployment token, avoid exposing personal address/phone unless explicitly approved. Secret scanning CI strongly recommended. Source maps/public repo decisions documented. Do not embed private intern or employer code.

# 10. Engineering quality, performance and accessibility

## 10.1 Real user experience thresholds
Core Web Vitals *field* targets at p75: LCP <=2.5s, INP <=200ms, CLS <=0.1. For prelaunch audits, run Lighthouse on representative mobile conditions and target >=90 Performance/Accessibility/Best Practices/SEO where feasible; distinguish simulated lab scores from field metrics. Aim initial JS <100KB gzip for typical static pages, subject to actual bundler reporting; budget interactive pages separately, and document each exception. Initial fonts (subset), optimized images and zero large JS hero components are key.

## 10.2 Accessibility baseline
Target WCAG 2.2 AA: semantic regions, ordered headings, skip link, visible focus, keyboard navigation, accessible mobile menu, minimum contrast (4.5:1 ordinary text, 3:1 large text and meaningful UI graphics where applicable), purposeful alt, no keyboard trap, target sizing considerations, logical reading order, error messages, zoom/reflow, reduced motion and color independence. Test real keyboard navigation, screen-reader spot checks, high contrast where available, 200% zoom, and screen widths down to 320px. Automated axe checks are necessary but not sufficient.

## 10.3 Performance budgets and optimizations
- No autoplay videos, no bulky 3D dependency in critical rendering path.
- Use optimized Astro Image/Picture responsive variants; stable width/height; no lazy-load for LCP hero image; lazy-load below-fold media.
- Preload only essential font asset(s), avoid font weight explosion.
- Cache immutable fingerprinted assets aggressively through hosting.
- Use CSS for simple animations; lazy-load heavy architecture interaction code.
- Inspect bundle report before accepting a new dependency; document costs.
- Long code samples use scroll inside article, not page-width overflow.

## 10.4 Test matrix
| Layer | Tool/process | Minimum coverage |
| --- | --- | --- |
| Static correctness | Astro check, TypeScript strict, lint | No failures |
| Content schema | Content collection validation / dedicated tests | Invalid dates/URLs/required fields fail build |
| Unit | Vitest or minimal equivalent | Filters, slugs, evidence formatting if logic exists |
| Functional E2E | Playwright | Home -> projects -> study -> contact; menu; 404; no broken internal links |
| Accessibility automation | axe with Playwright | Home, project index, one case study, contact, mobile nav |
| Manual a11y | Keyboard/zoom/screen reader | All critical flows and diagram fallback |
| Visual QA | Screenshots per breakpoint | No horizontal overflow, overlap, clipped headlines |
| Performance | Lighthouse and network waterfalls | Track scores, JS/image sizes, CWV lab proxies |
| Content QA | Human review and link crawler | Claims verified, no draft leak, all links valid |
| Security | npm audit awareness, secrets scan, header checks | No critical exploitable dependency, no secrets |

# 11. Milestones, deliverables and task discipline

See `docs/IMPLEMENTATION_BACKLOG.md` for execution-ready tickets with IDs `EA-001...EA-036`. Every ticket requires: scoped implementation plan, changed files, automated verification results, visual browser review where relevant, trade-offs recorded, and owner approval at gate. Do not batch all milestones in a single agent request.

**M0 Discovery/Content Gate:** inspect workspace, document state, determine real identity data/evidence availability, approve sitemap/design tokens; no unnecessary code.  
**M1 Baseline Gate:** repository, correct current dependencies, lint/type/build/CI, metadata skeleton, document standards.  
**M2 Design/Pages Gate:** reusable responsive layout, navigation, hero, Home/About/Contact/404; visual QA.  
**M3 Work Gate:** typed collections, project index and evidence-based case study(s); add verified links/assets.  
**M4 Enhancement Gate:** writing when genuine content exists, architecture explorer for genuine diagram, motion with reduced-motion fallback.  
**M5 Launch Gate:** complete content and all P0 acceptance tests, domain/SEO, optimized assets, prod smoke test, documentation.

**Stop condition:** if a required owner's fact, asset, authorization or public link is missing, implement a graceful omission and flag it for content review; do not fabricate or block unrelated tasks.

# 12. Formal acceptance criteria

- **AC-01 Identity:** H1 describes professional positioning accurately; no unverified professional claims.
- **AC-02 Navigation:** All published P0 pages reachable from global navigation or clear secondary links, including mobile keyboard operation.
- **AC-03 Responsiveness:** No horizontal scrolling at 320/375/390/430/768/1024/1440 tested viewports; no clipped controls at 200% zoom.
- **AC-04 Keyboard:** All controls operable by keyboard, visible focus, Escape closes mobile nav, focus returns appropriately.
- **AC-05 Content integrity:** Build contains zero draft MDX entries, placeholders, fake numbers, unauthorized screenshots or dead source links.
- **AC-06 Case study:** Each published project explains problem, role, contribution, decision/trade-off, testing/evidence and lessons, or explicitly explains unavailable evidence.
- **AC-07 Contact:** Real approved email accessible without JavaScript; social links verified; `CopyEmail` graceful fallback.
- **AC-08 Résumé:** Real up-to-date PDF exists, or links are absent until approved.
- **AC-09 A11y:** Automated axe produces no serious/critical findings on critical pages; manual keyboard and reduced-motion checklist passes; aim WCAG 2.2 AA, with any exceptions recorded.
- **AC-10 Animation:** Primary content remains visible without JS; reduced-motion removes large translation/parallax; no scroll hijack or autoplay.
- **AC-11 SEO:** Correct unique page titles/descriptions, canonical URLs, sitemap, robots, Open Graph, no drafts in sitemap.
- **AC-12 Performance:** Measure and report representative Lighthouse results and image/JS budgets; investigate below-target performance; never claim field CWV without real-world measurements.
- **AC-13 Reliability:** `install` (lockfile), typecheck, lint, build and Playwright smoke checks succeed in CI and deployment preview.
- **AC-14 Design fidelity:** Screens at agreed breakpoints match approved spacing, typography, hierarchy, colors, hover/focus, and consistent asset presentation.
- **AC-15 Mobile usability:** No hover dependency, tap targets practically sized, menu accessible, diagrams have readable linear fallbacks.
- **AC-16 Security:** No secrets in client/repo; dependency review performed; security headers and CSP tested in production.
- **AC-17 Ownership:** Code/assets/licenses and any employer/IP content are cleared for publication.
- **AC-18 Handover:** README documents content updates, adding project/article, test/build/deploy, known limitations and recovery steps.
- **AC-19 Rollback:** Hosting supports previous stable deployment or documented rollback.
- **AC-20 Final review:** Owner signs off on copy, links, project statuses, screenshots, résumé and primary visual identity.

# 13. Launch and ongoing maintenance

## 13.1 Prelaunch
Confirm real identity/contact/profile links; finalize two or more strong honest projects if available; assess intellectual property; update résumé; confirm optimized images; ensure logo/brand spelling; run link checker, keyboard/axe tests, browser screenshots, mobile performance, metadata preview, OG card preview, build checks and dependency scan. Link final production domain, add DNS/HTTPS; confirm canonical URLs and sitemap, site is indexable while previews are not.

## 13.2 Launch
Merge verified release branch through PR, deploy, test fresh live pages, click all major actions on phone and desktop, verify 404 path, PDF/links, canonical URLs, JS-disabled content, reduced motion and external URLs. Record date and deployed commit; keep rollback instructions.

## 13.3 Maintenance
Monthly broken-link/content/status check; quarterly image/bundle/SEO/a11y review; update credentials and dependencies responsibly; revisit featured work after meaningful project milestones; log externally observable impacts only after measurement; do not update status labels automatically from repo activity.

# 14. Key risks and mitigations
| Risk | Impact | Mitigation |
| --- | --- | --- |
| Invented content by coding agent | Credibility loss | Evidence matrix, required owner confirmation, draft filtering |
| Design-first over-engineering | Delayed usable portfolio | P0 before P1/P2; no 3D blocking launch |
| Excessive animation | Low accessibility / poor mobile performance | reduced-motion, CSS-first, perf budgets |
| Thin project descriptions | Weak engineering signal | mandatory case-study decisions + verification |
| Astro/React/Tailwind version drift | Build failures | official docs, compatible release pins, lockfile, CI |
| Incomplete images and résumé | Broken user journey | conditionally omit, block publish checks |
| Exposure of employer IP | Legal/reputational harm | clearance and anonymization review |
| SEO or third-party tracking assumptions | Misleading performance/privacy claims | accurate metadata, privacy by default |
| Complex interactions hiding content | No-JS failure | progressive enhancement, semantic HTML |

# 15. Architecture decision records
- **ADR-001 Astro static-first:** Content-heavy site favors pre-rendered HTML, smaller JS surface; react-islands only where necessary.
- **ADR-002 Evidence before polish:** Publish only verified case studies; a small authentic portfolio outranks many shallow demos.
- **ADR-003 No backend/form at MVP:** `mailto` contact and static content reduce implementation, security, ops and privacy burden.
- **ADR-004 No 3D in baseline:** optional only if useful, profiled and accessible, not for visual novelty alone.
- **ADR-005 Dark-first one theme:** aesthetic coherence and reduced QA scope, future alternative theme if needed.
- **ADR-006 Review-gated Antigravity delivery:** each task begins with plan and ends with evidence, not unchecked generated code.

# 16. Official implementation references (checked 13 October 2026)
- Astro content collections: https://docs.astro.build/en/guides/content-collections/
- Astro MDX integration: https://docs.astro.build/en/guides/integrations-guide/mdx/
- Astro React integration: https://docs.astro.build/en/guides/integrations-guide/react/
- Astro image pipeline: https://docs.astro.build/en/guides/images/
- Astro view transitions (optional): https://docs.astro.build/en/guides/view-transitions/
- Tailwind CSS with Astro (v4 Vite plugin): https://tailwindcss.com/docs/installation/framework-guides/astro
- Motion for React: https://motion.dev/docs/react
- Motion reduced motion: https://motion.dev/docs/react-use-reduced-motion
- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- Web Vitals: https://web.dev/articles/vitals
- Google sitemaps: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Google profile structured data: https://developers.google.com/search/docs/appearance/structured-data/profile-page
- Google Antigravity implementation plans: https://www.antigravity.google/docs/ide-implementation-plan
- Google Antigravity `/plan`: https://www.antigravity.google/docs/plan/

**Specification boundary:** This is a product/build specification, not a representation that the website has been implemented or that referenced candidate projects are complete. The accompanying `AGENTS.md`, backlog, templates and prompts translate the specification into agent-ready work.
