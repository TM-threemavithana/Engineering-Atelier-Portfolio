# AGENTS.md — Engineering Atelier

You are implementing the **Engineering Atelier** software engineer portfolio. This is a user-facing, credibility-critical, design-focused project. Read every document listed below before any work and follow it over generic template conventions:

1. `docs/MASTER_SPEC.md` — product, visual, technical and acceptance requirements.
2. `docs/IMPLEMENTATION_BACKLOG.md` — tasks and dependencies.
3. `docs/CONTENT_AND_EVIDENCE.md` — content truth, required owner facts.
4. `docs/QUALITY_PLAN.md` — verification and release gates.
5. `design/INTERACTION_RULES.md` and `design/tokens.reference.css` — design contract.

## Non-negotiable guardrails
- **Never invent personal data**: no fake name, current employer, degree status, job dates, certifications, LinkedIn/GitHub URL, contact email, metrics, repository, project completion, testimonial or screenshot. Draft content is excluded from production. Use an explicit clearly tagged TODO in content source or conditional omission.
- Astro static-first, TypeScript strict, React islands only for meaningful interactivity, Tailwind CSS v4 Vite plugin, MDX collections. No full backend, auth, CMS or WebGL in MVP.
- Semantics and progressive enhancement first: essential page content and links work without JavaScript.
- Accessibility to WCAG 2.2 AA target, visible focus, mobile keyboard operation, respect `prefers-reduced-motion`.
- Keep dependency count small; verify package versions/integrations against official current docs before changing package files.
- No protected brand assets, copyrighted mockups, private employer code, credentials, or user identity data in public source without explicit owner approval.
- Use desktop/mobile browser visual verification when available; verify actual rendered site, not merely code generation.
- Do not silently expand ticket scope or redesign accepted architecture. Write ADR for material deviations and request review.

## Review-driven workflow — EACH ticket
1. State the ticket ID, requirements, assumptions, changed files, and acceptance checks.
2. Inspect existing code and cite relevant docs. Produce an **Implementation Plan artifact**. Wait for review/proceed before major modifications if review setting allows it.
3. Implement one scoped ticket or strongly related ticket batch.
4. Run the required relevant validation commands; include exact executed commands and outcomes.
5. Capture desktop and mobile browser evidence for UI changes, or explicitly state why browser access was unavailable.
6. Provide a concise walkthrough: files changed, what works, what remains, risks and TODOs. Do not claim tests ran unless they actually ran.
7. Update backlog state only after passing its acceptance criteria and owner review where required.

## Definition of Done
A ticket is done only when: requirements met, no fabricated content, relevant automated tests pass, manual visual/keyboard checks performed where applicable, no unapproved scope expansion, docs updated, and the result is reviewable. “Code compiled” alone is never sufficient for UI tickets.

## Source of truth priority
Owner's direct confirmed information > `docs/CONTENT_AND_EVIDENCE.md` verified fields > master spec > templates > agent assumptions. When sources conflict, stop the affected change and report the discrepancy; continue independent tasks.

## Project command policy
Use the scripts defined in `package.json`; expected tasks: `dev`, `check`, `lint`, `test`, `test:e2e`, `build`, and optional `audit`. Initially create and document these; don't pretend they exist before setup.

## Start instruction
**Start with EA-001 only.** Audit the folder and evidence; create a plan. Do not jump straight to generating a complete site. If this starter pack has just been extracted into an empty working folder, first preserve `docs/`, `design/`, `templates/`, and `AGENTS.md`, then scaffold the Astro project around them after plan approval.
