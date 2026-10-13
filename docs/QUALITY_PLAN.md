# Engineering Atelier — Quality Plan and Release Gates

## 1. Must-pass automated commands
The scaffolded project's `package.json` must provide commands analogous to:

```sh
npm ci
npm run check
npm run lint
npm run test
npm run build
npm run test:e2e
```

The agent must **not** report these as executed if not actually run. Tests should be configured appropriate to the installed Astro/TypeScript and E2E versions. Unit testing may be minimal if logic is minimal; E2E, typecheck and build are non-optional for final release.

## 2. Functional E2E scenarios

| ID | Scenario | Expected outcome |
| --- | --- | --- |
| E2E-01 | Open `/` | Correct H1, visible CTA, landmark `<main>`, no client errors |
| E2E-02 | Navigate Home -> Projects | Published cards shown, each internal URL valid |
| E2E-03 | Open case study | Role, contribution, trade-off, evidence accessible |
| E2E-04 | Click back/breadcrumb | Returns to Projects without broken state |
| E2E-05 | Open About | Verified timeline and contact route |
| E2E-06 | Open Contact | Approved mailto accessible even JS-disabled |
| E2E-07 | Copy email if included | Success announced; fallback mailto still works |
| E2E-08 | Open mobile menu | Toggle announces state, Escape closes and returns focus |
| E2E-09 | Simulate reduced motion | No large entrance/scroll transforms |
| E2E-10 | Open unknown route | Branded 404 and valid recovery link |
| E2E-11 | Verify no draft routes | Draft slugs absent in static output and sitemap |
| E2E-12 | Validate internal links | No broken href, missing asset or placeholder |
| E2E-13 | Browser without JS | Core readable content and contact/projects links remain |
| E2E-14 | Keyboard tab navigation | All actionable UI reachable in logical order |

## 3. Accessibility audit
- axe scan: home, project index, one project detail, about, contact, writing if published, mobile menu open, architecture explorer if shipped.
- Manual: navigate all action flows with Tab/Shift+Tab/Enter/Space/Escape, skip link first, focus visible against surfaces, no focus hidden under sticky header, document zoom 200%, browser text resizing, 320px reflow, contrast check, mobile touch size and non-hover fallback.
- Reduced-motion: check on OS/browser preference and emulate in Playwright; no parallax or animated large container translations; content immediately readable.
- Screen reader spot check with available reader: main nav labeling, H1 hierarchy, project-card links, code/figure labeling, diagram text alternative.
- Save results and record exceptions; no assertion of complete WCAG conformance solely because axe passed.

## 4. Performance test
| Category | Target or rule | Verification |
| --- | --- | --- |
| LCP | <=2.5s p75 field once volume permits | CrUX/RUM when available; not synthetic alone |
| INP | <=200ms p75 field | Field measurement |
| CLS | <=0.1 p75 field | Field measurement + local layout audits |
| Lighthouse | Aim >=90 each category mobile representative | Repeat tests, note lab variability |
| Static page initial JS | Aim <100KB gzip | DevTools/build analyze; exceptions documented |
| Hero image | No unnecessary lazy loading; optimal priority | Waterfall |
| Below-fold media | responsive, lazy, specified dimensions | HTML and network inspect |
| Animations | no long JS animation on main thread | Performance panel |

**Before optimizing scores:** test whether real user content is loading. Do not hide content to game performance metrics. Test one midrange mobile device where accessible.

## 5. Browser and viewport matrix
Browsers: current Chrome/Chromium, Firefox, Safari or WebKit if available. Viewports: `320x568, 375x812, 390x844, 430x932, 768x1024, 1024x768, 1280x800, 1440x900, 1920x1080`. Include 200% zoom and a device with reduced motion.

Visual checks: H1 wraps elegantly, projects align, controls not cut off, fixed header not overlaying section IDs, main content not hidden by mobile menu, no horizontal page scrollbar, footers not floating awkwardly, image ratio/caption consistent, diagrams scroll or reflow predictably.

## 6. SEO/crawl acceptance
- Verify every published route has accurate title, meta description, canonical and OG summary/image.
- Homepage/about Person/ProfilePage data only when accurate and eligible; no schema spam.
- Static sitemap includes only canonical approved routes, not draft or preview.
- robots.txt doesn't accidentally block production.
- JSON-LD is syntactically valid; no invented occupation, education, employer or identity URLs.
- Check share previews on at least one tool where available; Google Search Console submission can follow launch.

## 7. Security/privacy audit
- No credentials, private emails, unreleased employer code, unpublished photos or secret files in Git/client JS.
- Build dependencies reviewed and lockfile committed; supply-chain alerts monitored.
- External anchors have safe targets/rel; third-party embeds avoided unless approved.
- Security headers/CSP configured *and verified on deployed host*; don't break Astro hydration and pretend success.
- No cookie banners required if no nonessential tracking is installed; if analytics/forms added, reassess applicable privacy requirements.
- No publicly accessible contact POST endpoint in MVP.

## 8. Formal milestone gates
- **G0 (after EA-004):** owner approves honest story, IA, wireframes, palette.
- **G1 (after EA-010):** reproducible toolchain and CI build; architecture ADR reviewed.
- **G2 (after EA-018):** real browser screenshot set, keyboard tests, responsive design accepted.
- **G3 (after EA-026):** authentic project narratives, actual media, source links and individual contribution accepted.
- **G4 (after EA-031):** optional interactions and writing only if evidence exists and speed/a11y remain healthy.
- **G5 (EA-036):** all P0 acceptance criteria passed; production smoke checks, rollback and final owner content signoff.

## 9. Launch checklist
- [ ] Approved and proofread headline + About + employment and education
- [ ] Approved contact information and tested social links
- [ ] Case studies and claims evidence-backed
- [ ] Image/source rights recorded; no unlicensed private material
- [ ] Résumé present/verified or link removed
- [ ] Mobile and keyboard flows pass
- [ ] Accessibility and reduced-motion audit documented
- [ ] All automated checks green in CI
- [ ] Lighthouse/performance report recorded and exceptions accepted
- [ ] Canonical URL, favicon, social preview, sitemap, robots validated
- [ ] Production HTTPS/DNS/headers work
- [ ] Production 404 + case-study deep links work
- [ ] Owner visually accepts final site on phone and desktop
- [ ] Release tag/commit and rollback strategy recorded

## 10. Handover checklist
README instructions for adding project/article, draft/publication lifecycle, replacing résumé, building/testing locally, deployment process, known limitations, contact link updates and maintenance cadence.
