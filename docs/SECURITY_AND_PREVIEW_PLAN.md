# Security Risk Assessment and Preview Deployment Plan (EA-010)

**Document Version:** 1.0  
**Associated Ticket:** `EA-010` (CI Checks and Preview Deployment Plan)  
**Governing Documents:** [`AGENTS.md`](file:///c:/Project/Engineering-Atelier-Portfolio/AGENTS.md), [`docs/MASTER_SPEC.md`](file:///c:/Project/Engineering-Atelier-Portfolio/docs/MASTER_SPEC.md), [`docs/QUALITY_PLAN.md`](file:///c:/Project/Engineering-Atelier-Portfolio/docs/QUALITY_PLAN.md)  
**Status:** Canonical Reference & Security Risk Register  

---

## 1. Security Architecture & Threat Model

The **Engineering Atelier** architecture is strictly **static-first** (`output: "static"` via Astro 5, compiled to standard HTML, CSS, client-side JS bundles, and SVG). 

### 1.1 Architecture & Risk Surface Boundaries
- **Runtime Web Environment (Low Exposure):**
  - There is no Node.js runtime, Python process, serverless API route, database connection, or containerized backend running in production.
  - No server-side dynamic image conversion or file upload handling exists.
  - Static hosting removes the need for an application server, significantly narrowing the attack surface of web-facing requests.
- **Build-Time & Toolchain Environment (Managed Exposure):**
  - Static compilation (`astro build`) and code quality verification (`eslint`, `prettier`, `astro check`, `tsx --test`) execute inside Node.js on local developer workstations and CI runners.
  - Dependencies processed at build-time still carry supply-chain, memory-safety, and denial-of-service risks that must be actively tracked, analyzed, and mitigated.
  - Static hosting does **not** eliminate build-time, CI workflow, or local development environment risks.
- **Non-Negotiable Policy:**
  - `npm audit fix --force` is strictly prohibited. It introduces breaking major upgrades (e.g., forcing unsupported `astro@7.3.8`) and unverified parser downgrades that destabilize the verified architecture.

---

## 2. Comprehensive Security Remediation Matrix

The dependency audit (`npm audit`) reports **9 vulnerabilities** (1 critical, 6 high, 2 low):

| Package & Path | Advisory ID & Severity | Installed Version | Affected Range | Available Patch | Dev / CI / Prod Exposure | Mitigations & Context | Remediation / Accepted Risk | Current Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`braces`**<br>`eslint-plugin-astro` &rarr; `astro-eslint-parser` &rarr; `fast-glob` &rarr; `micromatch` &rarr; `braces` | [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)<br>**High** | `3.0.3` | `<=3.0.3` | **None**<br>(3.0.3 is latest npm release) | **Dev/CI:** Triggered if processing deeply nested brace patterns in globs.<br>**Prod:** Zero (tooling only). | The vulnerability causes stack-exhaustion DoS when expanding malicious brace syntax. In this repo, glob patterns are developer-authored static strings (`**/*.astro`). No unpatched fix exists upstream. | **Accepted Temporary Risk.** Monitored for future upstream patch in `micromatch`/`braces`. Do not force downgrade to `eslint-plugin-astro@1.5.0` (which breaks TS-ESLint v8). | **Unresolved (Mitigated by trusted input)** |
| **`sharp`**<br>`astro` &rarr; `sharp` | [GHSA-f88m-g3jw-g9cj](https://github.com/advisories/GHSA-f88m-g3jw-g9cj)<br>[GHSA-rgj7-g3m4-5g8c](https://github.com/advisories/GHSA-rgj7-g3m4-5g8c)<br>[GHSA-wq5f-xc86-pv6w](https://github.com/advisories/GHSA-wq5f-xc86-pv6w)<br>**High** | `0.33.5` | `<=0.35.5-rc.1` | `0.35.5`<br>(via `astro@7.3.8`) | **Dev/CI:** Memory corruption in C libraries (`libvips`, `libheif`, `librsvg`) when parsing crafted images.<br>**Prod:** Zero (static assets). | Vulnerabilities occur when parsing malformed or untrusted image files. The portfolio contains zero user-upload endpoints; all images are maintainer-curated static assets. | **Accepted Temporary Risk.** Remediation requires major breaking upgrade to `astro@7.3.8`. Will be reassessed in Milestone 5 hardening before public release. | **Unresolved (Mitigated by maintainer asset control)** |
| **`esbuild`**<br>`astro` &rarr; `esbuild` | [GHSA-g7r4-m6w7-qqqr](https://github.com/advisories/GHSA-g7r4-m6w7-qqqr)<br>**Low** | `0.27.3` | `0.27.3 - 0.28.0` | `0.28.1`<br>(via `astro@7.3.8`) | **Dev:** Arbitrary file read via dev server on Windows.<br>**CI:** Zero (dev server not run).<br>**Prod:** Zero (static build). | Exploit requires accessing the active dev server on Windows with crafted HTTP requests. Development server runs strictly on local loopback (`localhost:4321`) without remote network exposure. | **Accepted Temporary Risk.** Development server bound to local interface. Reassess during Astro maintenance updates. | **Unresolved (Mitigated by local loopback binding)** |
| **`astro`**<br>`@astrojs/mdx` &rarr; `astro` | [GHSA-j687-52p2-xcff](https://github.com/advisories/GHSA-j687-52p2-xcff)<br>**Moderate** | `5.18.2` | `<=7.2.7` | `7.2.8` | **Dev/Prod:** Incomplete script sanitization in `define:vars`. | Flaw exists when dynamic untrusted data is injected into `<script define:vars={{...}}>`. All component props in this codebase are statically typed and author-controlled. | **Mitigated by Coding Standard.** Strictly forbid passing external or unverified user strings to `define:vars`. | **Mitigated** |
| **`astro`**<br>`@astrojs/mdx` &rarr; `astro` | [GHSA-xr5h-phrj-8vxv](https://github.com/advisories/GHSA-xr5h-phrj-8vxv)<br>**High** | `5.18.2` | `<=7.0.9` | `7.0.10` | **Dev/Prod:** Parameter replay in deferred server islands. | Server islands (`server:defer`) allow encrypted parameter replay. This site uses static generation (`output: "static"`) and does not use server islands. | **Feature Unused.** Architecture does not employ deferred server islands. | **Mitigated (Feature inactive)** |
| **`astro`**<br>`@astrojs/mdx` &rarr; `astro` | [GHSA-jrpj-wcv7-9fh9](https://github.com/advisories/GHSA-jrpj-wcv7-9fh9)<br>[GHSA-f48w-9m4c-m7f5](https://github.com/advisories/GHSA-f48w-9m4c-m7f5)<br>**Moderate** | `5.18.2` | `<=7.0.9` | `7.0.10` | **Dev/Prod:** Unescaped attribute names in HTML spread props. | Applies when dynamic user objects provide attribute keys in component spreads. Component spreads in this project only use compile-time typed props. | **Mitigated by Coding Standard.** Do not spread unvalidated object keys into HTML elements. | **Mitigated** |
| **`astro`**<br>`@astrojs/mdx` &rarr; `astro` | [GHSA-7pw4-f3q4-r2p2](https://github.com/advisories/GHSA-7pw4-f3q4-r2p2)<br>[GHSA-4g3v-8h47-v7g6](https://github.com/advisories/GHSA-4g3v-8h47-v7g6)<br>**High** | `5.18.2` | `<=7.0.9` | `7.0.10` | **Dev/Prod:** XSS via transition directive values. | Reflected XSS when view transition names accept unsanitized user query parameters. View transition identifiers in this site are fixed CSS tokens. | **Mitigated by Coding Standard.** All transition names must remain hardcoded design system tokens. | **Mitigated** |
| **`astro`**<br>`@astrojs/mdx` &rarr; `astro` | [GHSA-2pvr-wf23-7pc7](https://github.com/advisories/GHSA-2pvr-wf23-7pc7)<br>**High** | `5.18.2` | `<6.4.6` | `6.4.6` | **Dev/Prod:** Host header SSRF in prerendered error page fetch. | SSR servers fetching error pages can be manipulated via host headers. In static output mode, `404.html` is generated at compile time and served as a static file. | **Feature Unused.** Static builds emit physical static 404 files, bypassing SSR request handling. | **Mitigated (Static output)** |
| **`astro`**<br>`@astrojs/mdx` &rarr; `astro` | [GHSA-8hv8-536x-4wqp](https://github.com/advisories/GHSA-8hv8-536x-4wqp)<br>**High** | `5.18.2` | `<6.3.3` | `6.3.3` | **Dev/Prod:** Reflected XSS via unescaped slot names. | Flaw occurs when slot names reflect dynamic request parameters. All template slot names are static compile-time identifiers (`<slot />`). | **Feature Unused.** Dynamic runtime slot reflection is not used. | **Mitigated** |
| **`astro`**<br>`@astrojs/mdx` &rarr; `astro` | [GHSA-26w7-cxv4-gfx2](https://github.com/advisories/GHSA-26w7-cxv4-gfx2)<br>**Critical** | `5.18.2` | `<7.2.8` | `7.2.8` | **Dev/CI:** Out-of-bounds write in image processor when decoding untrusted AVIF images. | Occurs when processing untrusted AVIF files through the image pipeline. The repository only contains verified developer-committed graphics. | **Asset Policy.** Forbid downloading or processing third-party untrusted AVIF files. Maintainer directly vets all media files before commit. | **Unresolved (Mitigated by asset intake policy)** |

---

## 3. GitHub Actions CI Security & Environment Analysis

### 3.1 Token and Permission Scoping
- The workflow [`ci.yml`](file:///c:/Project/Engineering-Atelier-Portfolio/.github/workflows/ci.yml) strictly applies:
  ```yaml
  permissions:
    contents: read
  ```
- **Security Context:** GitHub Actions automatically issues an ephemeral `GITHUB_TOKEN` for workflow jobs. Declaring `contents: read` explicitly downscopes this token to read-only access to repository files. It does **not** possess write permissions, deployment credentials, or package publishing rights.
- **Workflow Triggers:** Configured for `push` and `pull_request` on `master` and `main`. `pull_request_target` is strictly avoided to prevent privilege escalation from fork PRs.
- **Secrets Management:** The CI pipeline references zero repository secrets or external environment tokens. Verification executes entirely offline.

### 3.2 Action Pinning Strategy
- `actions/checkout@v4`: Pinned to major version `@v4` (official GitHub-maintained action). Runs on Node 20 runtime and provides native Git sparse-checkout and shallow fetch capabilities.
- `actions/setup-node@v4`: Pinned to major version `@v4` (official GitHub-maintained action). Manages Node.js toolchain setup and provisions native npm dependency cache keyed to `package-lock.json`.

### 3.3 Environmental Parity (Windows Host vs. Linux CI Runner)
| Dimension | Local Development (Host) | CI Runner (`ubuntu-latest`) | Parity Safeguards |
| :--- | :--- | :--- | :--- |
| **OS** | Windows 11 / PowerShell | Ubuntu Linux / bash | Cross-platform Node scripts in `package.json`; path handling uses `node:path`. |
| **File System** | Case-insensitive (NTFS) | Case-sensitive (ext4) | ESLint and TypeScript strict checking enforce exact case sensitivity on all imports. |
| **Line Endings** | CRLF / LF | LF | Git handles autocrlf; Prettier enforces normalized whitespace across all code files. |
| **Node Version** | `v22.22.0` | `22.x` (LTS) | Pinned engine compatibility verified; both satisfy `eslint-plugin-astro` engine constraints. |
| **Shell Tools** | PowerShell | POSIX `sh`/`bash` | Post-build artifact verification implemented as pure Node/TypeScript test (`tests/artifact-verification.test.ts`), guaranteeing 100% identical execution across Windows and Linux. |

---

## 4. Preview Deployment Strategy & Access-Control Architecture

### 4.1 Indexing Directives vs. Genuine Access Control
- **`robots.txt` is NOT an Access Control Mechanism:** RFC 9309 and search engine specifications establish that `robots.txt` is an advisory directive for cooperative web crawlers. It does not authenticate requests, prevent unauthorized human viewing, or stop search engines from indexing a URL if linked from an external website.
- **`noindex` is an Indexing Directive, NOT Authentication:** The `<meta name="robots" content="noindex, nofollow">` tag prevents search engines from indexing pages in their search results, but it provides zero access restriction to unauthorized visitors who navigate directly to the URL.
- **Policy for Current Stage (Milestone 1):** Zero external preview deployments exist. The project runs exclusively on local developer environments with `isProductionApproved: false`.

### 4.2 Future Access-Controlled Staging Options (Evaluated for Milestone 5)

When preview staging is deployed for stakeholder review in Milestone 5, one of the following true access-control mechanisms will be selected:

#### Option A: Cloudflare Pages + Cloudflare Access (Zero Trust) — *Recommended*
- **Mechanism:** The preview domain (`*.pages.dev` or custom staging subdomain) is placed behind a Cloudflare Access Zero Trust application policy.
- **Access Control:** Visitors must authenticate via a One-Time PIN (OTP) sent to the owner's approved email address or via GitHub OAuth before any HTTP response is returned from the edge.
- **Protection Level:** Enterprise-grade. Unauthenticated users and web scrapers receive an HTTP 302/403 challenge and never see HTML markup or assets.

#### Option B: Vercel Deployment Protection
- **Mechanism:** Vercel project settings configure Deployment Protection (Password Protection or Vercel Team Login).
- **Access Control:** Every preview deployment URL requires a pre-shared passphrase or active Vercel team session to view.
- **Protection Level:** Strong. All automated crawlers and unauthenticated visitors are blocked at the edge.

#### Option C: Edge HTTP Basic Authentication
- **Mechanism:** Edge middleware (Cloudflare Worker or edge function) checks incoming `Authorization` headers and challenges unauthenticated requests with `401 Unauthorized`.
- **Access Control:** Standard browser username/password modal.
- **Protection Level:** Good. Blocks search engine spiders and accidental discovery.

### 4.3 Staging Constraints & Guardrails
- **No Hosting Configuration in EA-010:** No cloud accounts, DNS records, or hosting integrations will be configured during EA-010.
- **Draft Content Guarantee:** All 4 candidate projects remain strictly marked `draft: true` and will not be compiled into preview or production routes until verified with authentic source evidence.
- **Brand Protection:** Canonical URLs and production sitemap XML generation remain disabled while `isProductionApproved: false`.
