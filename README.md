# Engineering Atelier — Antigravity Portfolio Starter Pack

**What this is:** A full production-ready specification, reference assets, content templates and review-gated implementation backlog for a premium and interactive software engineer portfolio. It is **not yet a working website** and contains no verified personal biography or completed project content.

## Folder contents
- `docs/MASTER_SPEC.md` — definitive requirements, site UX, design, accessibility, engineering architecture, acceptance criteria.
- `docs/IMPLEMENTATION_BACKLOG.md` — 36 execution-ready tickets with dependencies, completion tests and milestones.
- `docs/CONTENT_AND_EVIDENCE.md` — truthful-content intake and candidate project audit.
- `docs/QUALITY_PLAN.md` — test matrix, budgets, quality gates, launch checklist.
- `design/tokens.reference.css` — source design tokens for incorporation into `src/styles/tokens.css`.
- `design/INTERACTION_RULES.md` — accessibility and animation contract.
- `AGENTS.md` — operating rules for Google Antigravity agent.
- `prompts/START_HERE.txt` — copy-paste kickoff prompt.
- `prompts/PHASE_PROMPTS.md` — staged follow-up prompts for Antigravity.
- `templates/project-case-study.mdx` — clearly fake-free DRAFT project template.
- `templates/writing-article.mdx` — DRAFT technical article template.
- `templates/content.config.reference.ts` — non-runnable until imported/adjusted and integrated, illustrative collection schema.

## How to use in Google Antigravity IDE
1. Create an empty folder, e.g., `engineering-atelier-portfolio` on your computer.
2. Extract this ZIP *into the folder*, keeping `AGENTS.md` in the root and the `docs/`, `design/`, `templates/`, `prompts/` folders intact.
3. Open the folder as the Antigravity IDE workspace.
4. Set the agent's artifact review policy to **Request review** if that option is available. Google's implementation plan docs describe reviewing and commenting on plans before clicking **Proceed**.
5. Open `prompts/START_HERE.txt`, copy its prompt into the Antigravity agent; use `/plan` if available in your version (Google's 2026 documentation describes this planning command).
6. Read the resulting proposed plan and correct it before Proceed. Approve **only EA-001**, not an unchecked bulk implementation.
7. After EA-001, follow each ticket in `docs/IMPLEMENTATION_BACKLOG.md` sequentially or by dependency grouping. Validate the actual browser result after each UI milestone.
8. Supply real name/email/links/résumé/projects only when you approve them for publication; never replace empty facts with invention.

## Before first public deployment
- Actual accurate display name and role
- Approved preferred email and relevant profiles
- Current genuine résumé (otherwise hide link)
- At least one evidence-backed published project; target 2–3 strong ones
- Rights to screenshots/code/diagrams
- Domain, DNS and deployment host

## First deliverable from Antigravity
A reviewed implementation plan for **EA-001: Repository audit + verified content availability**, covering existing files, risk notes and precise scope. No substantial code required in this initial step.

## Notes
All framework version pins must be checked against official documentation at implementation time. The pack's source links are in `docs/MASTER_SPEC.md`.
