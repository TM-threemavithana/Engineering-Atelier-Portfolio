/**
 * @file src/data/capabilities.ts
 * @description Centralized, typed definition of Core Technical Focus Areas and Engineering Approach.
 *
 * CONTENT TRUTH GUARDRAILS:
 * - Capabilities represent confirmed technical focus areas, NOT arbitrary percentages or mastery claims.
 * - Distinguishes practical focus from exploring/learning interests.
 * - Contains zero fabricated certifications, client badges, or unverifiable experience timelines.
 */

export interface CapabilityArea {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  practicalFocus: string[];
  exploring: string[];
  disciplines: string[];
}

export interface ApproachStage {
  number: string;
  title: string;
  description: string;
  deliverables: string;
}

export const capabilityAreas: CapabilityArea[] = [
  {
    id: 'backend',
    eyebrow: 'CORE SYSTEMS',
    title: 'Backend Engineering & APIs',
    description:
      'Constructing reliable server applications with strong concurrency models, clean architectural boundaries, and type-safe persistence.',
    practicalFocus: [
      'Java (Core, Virtual Threads)',
      'Scala & Functional Paradigms',
      'Spring Boot',
      'REST & gRPC Design',
      'PostgreSQL & Relational DBs',
    ],
    exploring: ['Netty Pipeline Internals', 'Event Sourcing Patterns'],
    disciplines: [
      'Clean architectural separation',
      'Defensive boundary validation',
      'Automated unit & integration tests',
    ],
  },
  {
    id: 'distributed',
    eyebrow: 'SCALABILITY',
    title: 'Distributed Systems & Cloud Concepts',
    description:
      'Reasoning about networked state, message streaming, failure boundaries, and reproducible container environments.',
    practicalFocus: [
      'Distributed Consensus Concepts',
      'Event-Driven Architectures',
      'Message Queues & Streaming',
      'Docker Containerization',
      'Resiliency & Failure Modes',
    ],
    exploring: ['Raft Replication Internals', 'Kubernetes Orchestration'],
    disciplines: [
      'Asynchronous boundary isolation',
      'Graceful degradation under partition',
      'Idempotent state handling',
    ],
  },
  {
    id: 'fullstack',
    eyebrow: 'INTERFACE CRAFT',
    title: 'Full-Stack Development',
    description:
      'Building accessible, high-performance web interfaces with strict type systems, progressive enhancement, and deterministic design tokens.',
    practicalFocus: [
      'Modern Web Standards & HTML5',
      'Strict TypeScript Systems',
      'Astro (Static-First SSG)',
      'Tailwind CSS v4 Token Architecture',
      'Core Web Vitals & INP',
    ],
    exploring: ['Fine-grained React Islands', 'Micro-interactions with Motion'],
    disciplines: [
      'Zero-JS essential reading resilience',
      'WCAG 2.2 AA accessibility target',
      'Fluid responsive typography',
    ],
  },
];

export const approachStages: ApproachStage[] = [
  {
    number: '01',
    title: 'Understand',
    description:
      'Clarify system requirements, domain boundaries, operational constraints, and failure modes before writing code.',
    deliverables: 'Problem domain & requirements bounds',
  },
  {
    number: '02',
    title: 'Model & Design',
    description:
      'Map state lifecycles, service contracts, and data flows while evaluating trade-offs between architectural alternatives.',
    deliverables: 'Architecture diagrams & decision records',
  },
  {
    number: '03',
    title: 'Build & Test',
    description:
      'Implement modular, type-safe solutions backed by reproducible unit tests, semantic markup, and deterministic styling.',
    deliverables: 'Strict TypeScript & comprehensive tests',
  },
  {
    number: '04',
    title: 'Verify & Maintain',
    description:
      'Validate accessibility, responsive viewports, contrast ratios, and automated CI gates before release.',
    deliverables: 'Automated CI gates & release verification',
  },
];
