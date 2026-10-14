/**
 * @file src/data/about.ts
 * @description Centralized, typed data for the About page, engineering values, technical familiarity, and verified timeline.
 *
 * CONTENT TRUTH GUARDRAILS:
 * - Never invent university or degree credentials, employment history, internships, company names, or employment dates.
 * - If education or experience information is not approved for publication, verifiedTimelineMilestones remains empty ([]).
 * - When no verified chronological entries exist, the timeline section is gracefully omitted from the DOM.
 * - Technical familiarity is strictly classified into Primary Focus, Working Knowledge, and Actively Exploring.
 * - Zero arbitrary skill percentages, ratings, or unverified claims.
 */

export interface TimelineMilestone {
  period: string;
  datetime?: string; // Valid ISO-8601 string (e.g., '2025-01' or '2024')
  title: string;
  organization?: string;
  statusTag?: string;
  description: string;
  highlights?: string[];
  isVerified: boolean;
}

export interface EngineeringValue {
  number: string;
  title: string;
  practice: string;
  description: string;
}

export interface TechnicalFamiliarityCategory {
  category: 'Primary Focus' | 'Working Knowledge' | 'Actively Exploring';
  description: string;
  technologies: string[];
}

export interface AboutBio {
  eyebrow: string;
  title: string;
  role: string;
  positioning: string;
  narrative: string[];
}

export const aboutBio: AboutBio = {
  eyebrow: 'ABOUT & BACKGROUND',
  title: 'Disciplined engineering. Systems built with intentionality.',
  role: 'Software Engineer',
  positioning:
    'Software Engineer focused on Java, Scala, backend architecture, distributed systems, and thoughtful full-stack development.',
  narrative: [
    'My approach to software engineering centers on architectural discipline, predictability, and craft. Rather than chasing ephemeral trends or premature complexity, I focus on building reliable systems with well-defined service boundaries, robust concurrency models, and resilient data flows.',
    'With primary grounding in Java and backend ecosystem design, alongside exploration in Scala and functional paradigms, I prioritize type safety, deterministic testing, and maintainable domain structures. When crafting web interfaces, I champion progressive enhancement, strict WCAG 2.2 AA accessibility, and zero-runtime overhead.',
  ],
};

export const engineeringValues: EngineeringValue[] = [
  {
    number: '01',
    title: 'Understand Before Solving',
    practice: 'Domain Modeling & Boundary Definition',
    description:
      'Clarify constraints, failure domains, and operational requirements prior to code authoring. High-leverage systems begin with precise problem statements, not assumptions.',
  },
  {
    number: '02',
    title: 'Design for Maintainability',
    practice: 'Type Safety & Explicit Contracts',
    description:
      'Code is read, debugged, and evolved far more often than it is written. Clear abstractions, modular separation, and self-documenting types always outweigh clever shortcuts.',
  },
  {
    number: '03',
    title: 'Verify Through Empirical Testing',
    practice: 'Deterministic Verification & Telemetry',
    description:
      'System correctness and performance cannot be assumed from good intentions. Every critical path demands reproducible test assertions, observable metrics, and explicit verification.',
  },
];

export const technicalFamiliarityTiers: TechnicalFamiliarityCategory[] = [
  {
    category: 'Primary Focus',
    description:
      'Core languages, architectural patterns, and frameworks used in daily engineering design.',
    technologies: [
      'Java (Core & Modern)',
      'Spring Boot',
      'RESTful API Design',
      'Relational Databases & SQL',
      'Object-Oriented Modeling',
      'Backend Architecture',
    ],
  },
  {
    category: 'Working Knowledge',
    description:
      'Operational tooling, interface standards, and environments applied across full-stack delivery.',
    technologies: [
      'TypeScript',
      'Docker & Containers',
      'Modern HTML5 & CSS',
      'Astro',
      'React',
      'Tailwind CSS',
      'Git & CI Automation',
    ],
  },
  {
    category: 'Actively Exploring',
    description:
      'Paradigms, protocols, and architectural models under active technical investigation.',
    technologies: [
      'Scala & Functional Paradigms',
      'gRPC & Protocol Buffers',
      'Distributed Systems Concepts',
      'Web Performance & INP Budgets',
    ],
  },
];

/**
 * Verified chronological education and employment milestones.
 *
 * Current state: Empty ([]), awaiting owner-supplied verified records.
 * Per project guardrails, zero unverified credentials or artificial periods may be fabricated.
 */
export const verifiedTimelineMilestones: TimelineMilestone[] = [];

/**
 * Returns strictly verified timeline milestones.
 */
export function getVerifiedTimelineMilestones(): TimelineMilestone[] {
  return verifiedTimelineMilestones.filter((milestone) => milestone.isVerified);
}
