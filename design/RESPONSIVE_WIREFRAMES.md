# Engineering Atelier — Responsive Wireframes & Visual Architecture (EA-003)

**Version:** 1.0  
**Date:** 2026-10-13  
**Status:** In Review  
**Milestone:** Milestone 0 — Discovery and Design Foundation  
**Governing Documents:** [AGENTS.md](file:///c:/Project/Engineering-Atelier-Portfolio/AGENTS.md), [docs/MASTER_SPEC.md](file:///c:/Project/Engineering-Atelier-Portfolio/docs/MASTER_SPEC.md), [design/INTERACTION_RULES.md](file:///c:/Project/Engineering-Atelier-Portfolio/design/INTERACTION_RULES.md), [design/tokens.reference.css](file:///c:/Project/Engineering-Atelier-Portfolio/design/tokens.reference.css)  
**Visual Artifacts (Inspectable in Workspace):**
- [Desktop 1440px Wireframe](file:///c:/Project/Engineering-Atelier-Portfolio/design/visual-references/desktop-home-wireframe.jpg)
- [Mobile 390px Opening Viewport Wireframe](file:///c:/Project/Engineering-Atelier-Portfolio/design/visual-references/mobile-home-wireframe.jpg)
- [Technical Case Study Wireframe](file:///c:/Project/Engineering-Atelier-Portfolio/design/visual-references/case-study-wireframe.jpg)
- [Interactive Prototype / Preview](file:///c:/Project/Engineering-Atelier-Portfolio/design/preview.html)

---

## 1. Visual Direction C: Foundations & Principles

**Visual Direction C** embodies **Restrained Cinematic Polish** and **The Thoughtful Systems Builder**:
- **Palette Foundation:** Deep navy-black canvas (`--color-bg: #080D17`), elevated dark slate panels (`--color-surface: #111C2B`, `--color-surface-alt: #17263A`), subtle hairline borders (`--color-border: #34465D`), crisp high-contrast text (`--color-fg: #F3F7FF`, `--color-muted: #A5B7CE`), and focused cyan accents (`--color-accent: #5EEAD4`, hover `#94F5E6`).
- **Typography:**
  - **Display:** `Space Grotesk` (Geometric, technical, tight tracking `tracking-tight`).
  - **Body / Prose:** `Inter` (Legible, neutral, line height `1.65`).
  - **Monospace / Accents:** `JetBrains Mono` (Overlines, tags, metrics, code snippets).
- **Core Principles:**
  1. *Substance over spectacle:* No gratuitous WebGL, full-page loaders, or glowing neons. Visual prestige comes from typography, asymmetric rhythm, and clean architectural diagrams.
  2. *Progressive disclosure:* Fast first-viewport scanning for recruiters; deep architectural trade-off rigor for engineering managers.
  3. *Accessibility by default:* Full WCAG 2.2 AA compliance, visible focus rings (`--color-focus: #F0CF78`), 44x44px minimum tap targets, and semantic degradation without JavaScript.

---

## 2. Responsive Grid System & Breakpoint Matrix

| Breakpoint | Viewport Width | Columns | Margins / Gutters | Max Width | Primary Device Target |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`phone-sm`** | **320px** | 4 col | 16px margins, 12px gutters | 100% | Small phones (iPhone SE, narrow Android) |
| **`phone`** | **390px** | 4 col | 20px margins, 16px gutters | 100% | Standard phones (iPhone 14/15/16, Pixel) |
| **`tablet`** | **768px** | 8 col | 32px margins, 20px gutters | 768px | iPad Mini, small tablets, folded screens |
| **`desktop`** | **1024px** | 12 col | 48px margins, 24px gutters | 1024px | Laptops, small desktop monitors |
| **`desktop-wide`**| **1440px** | 12 col | Auto margins, 32px gutters | **1200px container** | Standard desktop / high-res displays |

---

## 3. Hero Layout Architectural Decision: Alternative 1 vs Alternative 2

### Alternative 1: Asymmetric Editorial Two-Column (Recommended)
- **Desktop (1440px):**
  - Left Column (7 cols / ~58%): Small mono overline `SOFTWARE ENGINEER`, massive clamp H1 *"Building reliable systems. Creating meaningful experiences."*, crisp subheading *"Software Engineer focused on Java, Scala, backend architecture, distributed systems, and thoughtful full-stack development."*, followed by primary CTA *"Explore Selected Work"* $\to$ `/projects/` and conditional secondary action.
  - Right Column (5 cols / ~42%): Minimalist, interactive architectural blueprint card showing a clean vector diagram (Event Stream $\to$ Consensus Node $\to$ Persistent Storage) with subtle cyan hairline connectors and status badges.
- **Mobile (390px/320px):**
  - Left content stacks first. The H1, subtitle, and primary CTA are rendered directly within the first 460px of vertical space, guaranteeing immediate visibility above the fold before any diagram.

### Alternative 2: Centered Monospace Hero
- Single centered column (max-width 840px), centered H1, centered subtitle, dual centered buttons, followed by an immediate horizontal capability ribbon.

### Decision & Trade-off Rationale
**Alternative 1 is officially selected and approved** because:
1. It immediately signals serious engineering capability through the architectural blueprint graphic without delaying text visibility.
2. It breaks the generic "cookie-cutter developer template" look and delivers the high-end editorial feel of Visual Direction C.
3. On mobile, it naturally cascades into a linear vertical hierarchy with zero horizontal overflow.

---

## 4. Homepage Wireframe (`/`)

### 4.1 Desktop (1440px) Layout Structure
```text
+--------------------------------------------------------------------------------------------------+
| [EA] Wordmark                              Projects        About        Contact    [Resume (Gated)]|
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
| [Overline: SOFTWARE ENGINEER]                     +--------------------------------------------+ |
|                                                   | [Interactive Architecture Blueprint Card]  | |
| Building reliable systems.                        |                                            | |
| Creating meaningful                               |  [Ingestion Engine] ---> [Raft Consensus]  | |
| experiences.                                      |          |                      |          | |
|                                                   |          v                      v          | |
| Software Engineer focused on Java, Scala,         |  [Event Log]            [Storage Node]     | |
| backend architecture, distributed systems,        |                                            | |
| and thoughtful full-stack development.            |  Status: Healthy       P99: 1.2ms          | |
|                                                   +--------------------------------------------+ |
| [Explore Selected Work ->]  [View Resume (Gated)]                                                |
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
| FEATURED WORK (TEASER)                                                                           |
|                                                                                                  |
| +--------------------------------------+  +----------------------------------------------------+ |
| | [Card 1: Distributed Engine] (Large) |  | [Card 2: Developer Tooling / API] (Compact)        | |
| | Status: Prototype (DRAFT)            |  | Status: In-Progress (DRAFT)                        | |
| | Tags: [Java 21] [gRPC] [Kafka]       |  | Tags: [Scala] [CLI] [Docker]                       | |
| | Summary: High-throughput log engine  |  | Summary: Developer tooling and task orchestration  | |
| +--------------------------------------+  +----------------------------------------------------+ |
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
| CORE ENGINEERING CAPABILITIES (3-COLUMN GRID)                                                    |
|                                                                                                  |
| +-------------------------------+ +-------------------------------+ +--------------------------+ |
| | Backend & Systems             | | Distributed & Cloud           | | Full-Stack Experience    | |
| | - Java (Core, Virtual Threads)| | - Distributed Consensus       | | - Modern Web Standards   | |
| | - Scala & Functional Paradigms| | - Event-Driven Architecture   | | - Accessible TypeScript  | |
| | - Spring Boot & REST/gRPC APIs| | - Containerization & Docker   | | - Astro / Tailwind v4    | |
| | - Relational & Key-Value DBs  | | - Resiliency & Failure Modes  | | - Responsive Design & INP| |
| +-------------------------------+ +-------------------------------+ +--------------------------+ |
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
| ENGINEERING APPROACH (4-STEP HORIZONTAL FLOW)                                                    |
|                                                                                                  |
| [1. Understand] -------> [2. Model & Design] -------> [3. Build & Test] -------> [4. Verify]     |
| Problem domain, bounds   Data flows & trade-offs      Type safety & unit/E2E     Benchmarks & QA |
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
| PERSONAL CALL-TO-ACTION                                                                          |
| "Have an engineering challenge or platform to build?"                                            |
| [Get in Touch -> (/contact/)]                                                                    |
+--------------------------------------------------------------------------------------------------+
| FOOTER: (c) 2026 Engineering Atelier. Handcrafted with Astro & TypeScript.                       |
+--------------------------------------------------------------------------------------------------+
```

### 4.2 Mobile (390px) First-Viewport Proof
```text
+--------------------------------------+  0px (Top of Screen)
| [EA]                            [==] |  Header (56px)
+--------------------------------------+  56px
|                                      |
| SOFTWARE ENGINEER                    |  Overline (14px)
|                                      |
| Building reliable                    |
| systems. Creating                    |  H1 Title
| meaningful                           |  clamp(2.1rem, 7vw, 2.75rem)
| experiences.                         |  ~140px height
|                                      |
| Software Engineer focused on Java,   |  Subheading
| Scala, backend architecture, and     |  ~60px height
| distributed systems.                 |
|                                      |
| +----------------------------------+ |  Primary CTA Button
| | Explore Selected Work        ->  | |  48px touch target
| +----------------------------------+ |
|                                      |  --- 440px SCREEN FOLD (SAFE) ---
| +----------------------------------+ |  (On a 390x844 viewport,
| | [Blueprint / Architecture Card]  | |   first CTA is fully visible
| +----------------------------------+ |   with >380px headroom!)
+--------------------------------------+  844px (Bottom of Screen)
```

---

## 5. Projects Index Wireframe (`/projects/`)

### 5.1 Architecture & Filtering State
- **Header:** Title `Selected Work`, subtitle explaining technical problem spaces (concurrency, data pipelines, scalable services).
- **Filter Bar:** Omitted initially (per Master Spec §4.2, filters are enabled only when $\ge 5$ published projects exist).
- **Curated Project Grid:** 
  - Featured items render as wide asymmetric cards.
  - Secondary items render in a balanced 2-column grid.
  - Each card displays: Title, 1-sentence problem, personal role, verified status tag (`Completed` / `Prototype` / `In-Progress`), technology pills, and link to Case Study.
- **Honest Empty / DRAFT Safeguard:**
  - If 0 candidate projects have cleared evidence verification, the page displays:
    ```text
    +----------------------------------------------------------------------+
    | Engineering Case Studies in Clearance                                |
    | Technical write-ups and architecture diagrams are currently          |
    | undergoing evidence and repository clearance.                        |
    | [Explore Capabilities on About ->]                                   |
    +----------------------------------------------------------------------+
    ```

---

## 6. Case Study Template Wireframe (`/projects/[slug]/`)

### 6.1 Layout Structure (Desktop & Tablet)
```text
+--------------------------------------------------------------------------------------------------+
| Projects / StreamForge Distributed Log Engine                                                    |
|                                                                                                  |
| StreamForge: Distributed Raft-Consensus Log Engine                                               |
| High-throughput distributed write-ahead log with gRPC streaming and virtual thread persistence.  |
|                                                                                                  |
| +----------------------------------------------------------------------------------------------+ |
| | TECHNICAL FACT PANEL                                                                         | |
| | Role: Backend Systems Engineer      | Architecture: Raft Distributed Consensus               | |
| | Status: Prototype (Verified)        | Technologies: Java 21, gRPC, Protocol Buffers, RocksDB | |
| | My Ownership: Raft cluster state    | Repository: [github.com/org/streamforge (Verified)]    | |
| +----------------------------------------------------------------------------------------------+ |
|                                                                                                  |
| 1. THE PROBLEM & CONSTRAINTS                                                                     |
| Detailed context on event ingestion bottlenecks and network partition requirements.             |
| Prose column width constrained to 72ch for optimal readability.                                 |
|                                                                                                  |
| 2. ARCHITECTURE DIAGRAM & DATA FLOW                                                              |
| +----------------------------------------------------------------------------------------------+ |
| | [Vector Architectural Diagram: Producer -> Leader Node -> Raft Quorum -> Persistent Log]     | |
| | Fig 1: Cluster replication and write quorum flow under network partitions.                   | |
| +----------------------------------------------------------------------------------------------+ |
|                                                                                                  |
| 3. KEY ENGINEERING DECISIONS & TRADE-OFFS                                                        |
| +----------------------------------------------------------------------------------------------+ |
| | DECISION BLOCK: Adopting Zero-Copy Netty Buffering vs Standard Java NIO                      | |
| | Context: Ingestion pipeline experienced GC pressure under 50k msgs/sec throughput.          | |
| | Options Considered: (A) Off-heap direct ByteBuffers, (B) Managed Java Heap Buffers.          | |
| | Decision: Selected off-heap pooled ByteBuffers via Netty to eliminate heap allocation.       | |
| | Consequences: Reduced GC pause times by 68%; required manual reference count lifecycle checks.| |
| | Validation: Verified via JMH benchmark suite and Prometheus JVM metrics.                     | |
| +----------------------------------------------------------------------------------------------+ |
|                                                                                                  |
| 4. TESTING, SECURITY & RELIABILITY                                                               |
| Real integration tests, Jepsen partition simulation tests, and failure injection.               |
|                                                                                                  |
| 5. WHAT DID NOT WORK & LESSONS LEARNED                                                           |
| Candid technical reflection on cluster rebalancing edge cases.                                  |
|                                                                                                  |
| [<- Back to Projects]                                                [Discuss This System ->]    |
+--------------------------------------------------------------------------------------------------+
```

---

## 7. About Page Wireframe (`/about/`)

- **Introduction:** Short, confident statement of engineering principles.
- **Experience & Training Timeline:**
  - Vertical line with node markers (`--color-accent: #5EEAD4`).
  - Strict fields: Organization, Position, Verified Period, Specific individual responsibilities.
  - Zero inflated job claims; academic/intern roles accurately contextualized.
- **Technical Capabilities Grid (Honest Familiarity Groups):**
  - Group 1: `Primary Focus` (Java, Scala, Backend Systems, REST/gRPC, Distributed Design).
  - Group 2: `Working Knowledge` (Docker, PostgreSQL, Kafka, Astro, TypeScript).
  - Group 3: `Actively Exploring` (Rust, Advanced Cluster Orchestration).
  - *No arbitrary percentage bars or fake 95% skill meters.*
- **Engineering Values:** 3 clear principles (Understand Before Solving, Write Software for Humans to Maintain, Verify Through Empirical Testing).

---

## 8. Contact Page Wireframe (`/contact/`)

```text
+--------------------------------------------------------------------------------------------------+
| Let's build reliable software together.                                                          |
| Feel free to reach out regarding distributed systems, backend engineering, or collaboration.    |
|                                                                                                  |
| +----------------------------------------------------------------------------------------------+ |
| | PRIMARY CONTACT                                                                              | |
| |                                                                                              | |
| | [Email Icon]  engineer@domain.com                                                            | |
| |                                                                                              | |
| | [Send Mail (mailto:)]                      [Copy Email Address (Progressive Island)]         | |
| |                                            Announces "Email copied to clipboard!" via live UI| |
| +----------------------------------------------------------------------------------------------+ |
|                                                                                                  |
| VERIFIED PROFESSIONAL PROFILES                                                                   |
| [GitHub -> github.com/user]     [LinkedIn -> linkedin.com/in/user]                               |
|                                                                                                  |
| * Note: No contact form tracking. Communication is handled via direct, encrypted email.        |
+--------------------------------------------------------------------------------------------------+
```

---

## 9. System 404 Wireframe (`/404`)

- Branded, clean, friendly error state.
- H1: `404 — Route Not Found`.
- Explanatory copy: *"The system or page you requested does not exist or has been relocated."*
- Primary Recovery Action: `Return to Homepage` (`/`).
- Secondary Recovery Action: `Explore Selected Work` (`/projects/`).

---

## 10. Interactive Component States & Accessibility Contract

Per `design/INTERACTION_RULES.md`:

| Component | Default State | Hover State | Focus-Visible State | Active / Pressed | Reduced-Motion State |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **PrimaryButton** | Cyan border, dark bg, text `#F3F7FF` | Cyan bg (`#5EEAD4`), dark text, translateY(-2px) 180ms | 3px gold ring (`#F0CF78`), outline-offset: 3px | translateY(0), brightness(0.9) | Color/border change only; zero transform |
| **ProjectCard** | Slate panel `#111C2B`, hairline border `#34465D` | Border `#5EEAD4`, translateY(-4px) 220ms, subtle glow | 3px gold ring, border `#5EEAD4` | Scale(0.995) | Border highlight only; zero translateY |
| **TextLink** | Accent color or subtle underline | Full underline, color `#94F5E6`, 150ms | 2px gold outline | Underline persists | Instant color change |
| **MobileNav Toggle** | 44x44px button, 2 horizontal bars | Icon tint `#5EEAD4` | 3px gold ring | Pressed opacity 0.8 | Instant icon transition |
| **CopyEmail Island** | Standard button style | Button hover style | 3px gold ring | State toggles to "Copied!" for 2000ms | Text updates instantly with `aria-live` announcement |

---

## 11. Recruiter Usability, Accessibility & Performance Proofs

### 11.1 The 20-Second Recruiter Usability Journey
1. **0–3 seconds:** Land on `/`. First viewport clearly states role (`SOFTWARE ENGINEER`) and domain (`Java, Scala, backend architecture, distributed systems`).
2. **3–8 seconds:** Tap prominent CTA `"Explore Selected Work"` without needing to scroll.
3. **8–15 seconds:** Scan project cards, recognize key technologies (Java 21, gRPC, Raft, Kafka).
4. **15–20 seconds:** Tap `"Get in Touch"` or copy email via accessible one-click action.

### 11.2 Deterministic Color Contrast Ratios (WCAG 2.2 AA / AAA Verified)
- **Primary Text (`#F3F7FF`) on Canvas (`#080D17`):** Contrast ratio **18.11 : 1** (Passes AAA).
- **Primary Text (`#F3F7FF`) on Surface (`#111C2B`):** Contrast ratio **15.97 : 1** (Passes AAA).
- **Muted Text (`#A5B7CE`) on Canvas (`#080D17`):** Contrast ratio **9.50 : 1** (Passes AAA).
- **Muted Text (`#A5B7CE`) on Surface (`#111C2B`):** Contrast ratio **8.38 : 1** (Passes AAA).
- **Cyan Accent (`#5EEAD4`) on Surface (`#111C2B`):** Contrast ratio **11.59 : 1** (Passes AAA).
- **Focus Ring (`#F0CF78`) on Surface (`#111C2B`):** Contrast ratio **11.35 : 1** (Passes AAA).
- **Strong Semantic UI Border (`#5A7597`) on Surface (`#111C2B`):** Contrast ratio **3.61 : 1** (Exceeds WCAG 2.2 SC 1.4.11 $\ge 3.0:1$ standard for essential UI component boundaries).
- **Decorative Container Border (`#34465D`) on Surface (`#111C2B`):** Contrast ratio **1.78 : 1** (Decorative containment; surface fill difference provides boundary separation under WCAG 2.2 SC 1.4.11).
- **Mobile Body Typography:** Explicitly set to strict **16px (`1rem`)** on viewports under 1024px to prevent unwanted iOS form zooming and ensure maximum readability; scales to 17px (`1.0625rem`) on desktop.

