# Content and Evidence Register

This is the *publishing gate* for Engineering Atelier. No assumption from a project idea, past conversation or technology interest becomes a publicly claimed credential without owner verification.

## 1. Owner-approved profile fields
Fill this table only with confirmed information. Leave pending items unknown; do not invent them.

| Field | Value | Status | Evidence/approval | Publish? |
| --- | --- | --- | --- | --- |
| Preferred public display name | `[OWNER TO SUPPLY]` | pending | — | no |
| Professional title | `Software Engineer` (candidate wording) | pending | owner approval | no |
| Headline/subtitle | `[APPROVE COPY]` | pending | owner approval | no |
| Contact email | `[OWNER TO SUPPLY]` | pending | owner approval | no |
| GitHub URL | `[OWNER TO SUPPLY]` | pending | confirm accessible and owned | no |
| LinkedIn URL | `[OWNER TO SUPPLY]` | pending | confirm accessible and owned | no |
| Location/timezone | `[OPTIONAL]` | pending | consent | no |
| Résumé PDF | `[CURRENT RESUME]` | pending | check content, embedded links | no |
| Portrait | `[OPTIONAL IMAGE]` | pending | author/rights/consent | no |
| Education name and credential status | `[VERIFY]` | pending | owner's approved record | no |
| Employment/training dates and contributions | `[VERIFY]` | pending | owner-approved exact details | no |
| Current job availability | `[OPTIONAL]` | pending | explicit current statement | no |

**Publishing rule:** No placeholder in public HTML. Hide any missing item. A verified, owned public social link may be added after approval. External target behavior must be intentional.

## 2. Candidate project inventory
These entries are **concepts to audit**, not finished portfolio work. None should be default `draft:false` until reviewed.

| Candidate | Domain | Potential engineering evidence | Required verification | Initial status |
| --- | --- | --- | --- | --- |
| StreamForge | Distributed systems | service boundaries, gRPC/REST, message flow, deployment, tests | real repository, implemented components, author's contributions, run/test screenshots | DRAFT |
| DevForge | Developer tool, Scala | packaging, CLI UX, architecture, tool security, published usage examples | Scala implementation status, tests, repo/release, what is implemented | DRAFT |
| Java/Spring Boot task API | Java backend | OOP/design decisions, auth, persistence, tests, Docker | actual API code, OpenAPI/README, DB, security, coverage evidence | DRAFT |
| Currency-authentication work | CV/ML research | dataset/algorithm/methods, benchmarks, app UI (if built) | research vs prototype distinction, dataset rights, experiment methods/metrics | DRAFT |

**Ownership:** If collaborators were involved, ask: which parts did *you* code/design/test? What was inherited? Which diagrams/screenshots may be publicly used? Never claim all team outcomes as individual output.

## 3. Per-project evidence template
Duplicate before publishing:

```text
Project title:
One-sentence outcome/problem:
Status: completed | prototype | in-progress | research
Dates (optional, verified):
Project type: personal | academic | collaborative | employment-related
My specific role:
Contributors/collaborators and boundaries:
Problem and users:
Functional requirements:
Non-functional constraints:
Architecture/components:
Key decision #1 with alternatives and trade-offs:
Key decision #2 (optional):
Testing/security/reliability work actually performed:
Evidence: repository / demo / tests / screenshots / write-up:
Quantitative outcomes + measurement method (optional):
What did not work:
Lessons and future work:
Public-use permissions (screenshots/code/IP):
Owner approval date:
Ready for draft:false? YES / NO
```

## 4. Project case-study editorial rubric
Score each 0 = missing, 1 = partial, 2 = demonstrated. A featured study should score **at least 14/18**, with no zero in ownership, problem, key decision or truth/evidence.

| Criterion | Score 0–2 | Proof |
| --- | --- | --- |
| Specific user or engineering problem | | |
| Personal ownership clearly separated | | |
| Constraints/requirements documented | | |
| Architecture explains data/control flow | | |
| At least one decision + rejected alternative | | |
| Testing/security/reliability explained accurately | | |
| Genuine evidence/repo/demo or reason unavailable | | |
| Outcomes/learning honest, no manufactured numbers | | |
| Legible media, captions, mobile and alt text | | |

## 5. Technical skills evidence
Group technologies as `Primary focus`, `Used in projects`, `Currently learning` only after confirming real use. Do not create skill percentage bars or score Java 95% / Scala 90% without a legitimate basis. Keep years-of-experience off the site unless independently verifiable and relevant. Concrete examples are stronger than logo grids.

## 6. Project image/source ledger
| Asset path | Source/creator | License or permission | Project association | Alt/caption ready | Approved |
| --- | --- | --- | --- | --- | --- |
| `[fill after actual asset exists]` | | | | | |

Avoid real private API keys, institution data that cannot be public, source code belonging to employers, or unlicensed stock assets. Architecture diagrams may be newly drawn, but labels must match an actual system.

## 7. Draft example publication states
- `draft: true` = excluded from production.
- `status: in-progress` with `draft: false` = permitted **only** if the limited actual accomplishment is meaningful, correctly labeled and evidence-backed.
- `status: completed` = permitted only after honest completion and owner review.
- `repoUrl`/`demoUrl` absent = no broken buttons; provide explanation if relevant.
- `metrics` absent = no made-up speed/scale/coverage claims.

## 8. Editorial review before each deployment
Check spelling, résumé consistency, date/year accuracy, employment context, link accessibility, disclosure of prototypes, citations/sources, SEO descriptions, alt text, copyright and individual ownership. The owner approves every new claim about their own work.
