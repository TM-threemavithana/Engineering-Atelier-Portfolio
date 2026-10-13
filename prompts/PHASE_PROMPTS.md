# Antigravity follow-up prompts

**Use only after the preceding gate is approved.** Paste one prompt, review the generated plan, then allow implementation. Work on genuine project data separately from placeholder templates.

## After content audit — EA-002 to EA-004
```text
/plan Implement EA-002 through EA-004 only. First propose a public-safe positioning statement and sitemap conditional on verified content, then create responsive wireframes for 1440/768/390/320px and final design token decisions. Show how the first-screen CTA works, describe every component state, check initial contrast, and record architecture ADRs. Do not scaffold the entire application yet. Require my design approval.
```

## Project baseline — EA-005 to EA-010
```text
/plan Implement EA-005 through EA-010 with current stable compatible Astro, React, MDX, Tailwind v4 @tailwindcss/vite, strict TypeScript, linting, lockfile, CI and metadata layout. Compare installed versions against official docs. Show commands and exact results. Do not add database, auth, server API, 3D or CMS. Provide a reviewable plan first.
```

## Core pages — EA-011 to EA-018
```text
/plan Implement EA-011 through EA-018 only using approved tokens and layout. Build responsive header/menu, hero, UI primitives, About, Contact and 404. Featured work is driven only by verified content; if none is available, use an honest empty/progress state without made-up cards. Capture desktop 1440px and mobile 390px screenshots and keyboard/focus states. Check all acceptance criteria and ask for visual review.
```

## Engineering evidence — EA-019 to EA-026
```text
/plan Implement EA-019 through EA-026 only. Build Zod-validated Astro content collections, draft gates, Projects page and Case Study template. Before publishing each project, compare its status, ownership, links, measurements, screenshots and evidence against docs/CONTENT_AND_EVIDENCE.md. Drafts must not appear in production. Create one rigorous case study from verified owner-provided facts; don't invent an impressive story.
```

## Polished interactions — EA-027 to EA-031
```text
/plan Evaluate and implement EA-027 through EA-031 one feature at a time. CSS-first, Motion only where justified. Honor reduced-motion and keyboard. ArchitectureExplorer must use a real project diagram, include a meaningful text/list fallback and work without live APIs. Writing pages only become public with real authored content. Do not add WebGL to MVP.
```

## Launch — EA-032 to EA-036
```text
/plan Implement the release gates EA-032 through EA-036. Verify content integrity, metadata, robots/sitemap, security headers and CSP behavior, optimized images, Playwright E2E, axe scans, keyboard/reduced-motion/manual viewport QA, CI and actual production smoke tests. Report real results and any unfinished criteria honestly. Do not claim the site is live or scores pass unless actually verified.
```

## Bug review prompt
```text
Read the failing criterion [AC-ID] and ticket [EA-ID]. Reproduce the problem before editing. Explain root cause and smallest safe fix, identify regression tests, then make only the necessary code changes. Show before/after test evidence and mention residual risks.
```
