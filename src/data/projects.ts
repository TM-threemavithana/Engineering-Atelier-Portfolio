/**
 * @file src/data/projects.ts
 * @description Centralized Project Inventory & Publication Filtering.
 *
 * ARCHITECTURAL NOTE & MDX MIGRATION STRATEGY:
 * In Milestone 2, this file serves as the authoritative typed registry and publication filter.
 * In Milestone 3 (EA-019 to EA-023), project content will migrate to Astro Content Collections
 * (`src/content/projects/*.mdx`) backed by Zod schemas. This module will then delegate to
 * Astro's `getCollection('projects')` without altering external component contracts.
 *
 * PUBLICATION GATING POLICY (AC-05):
 * A project is considered publicly publishable ONLY when BOTH of the following are true:
 * 1. `draft: false` (Explicitly verified, cleared, and approved by the owner)
 * 2. An actual published case-study route exists in `isRoutePublished(href)`
 *
 * Both conditions are strictly required. Setting `draft: false` alone will NOT publish a card
 * if its destination route does not exist.
 */

import { isRoutePublished } from '../utils/linkSafety';

export type ProjectProgressStatus = 'completed' | 'prototype' | 'in-progress' | 'research';

export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  problem: string;
  role: string;
  contribution: string;
  stack: string[];
  status: ProjectProgressStatus;
  draft: boolean;
  featured: boolean;
  summary: string;
  href?: string;
  repoUrl?: string;
  demoUrl?: string;
}

export const candidateProjects: ProjectItem[] = [
  {
    id: 'streamforge',
    slug: 'streamforge',
    title: 'StreamForge: Distributed Raft Log Engine',
    problem: 'High-throughput event ingestion bottlenecks under network partition constraints.',
    role: 'Backend Systems Engineer',
    contribution: 'Designed Raft consensus replication and bounded in-memory queue pipelines.',
    stack: ['Java 21', 'gRPC', 'Protocol Buffers', 'RocksDB'],
    status: 'prototype',
    draft: true, // GATED: Awaiting verified repository and clearance (Milestone 3)
    featured: true,
    summary:
      'High-throughput distributed write-ahead log with gRPC streaming and virtual thread persistence.',
    href: '/projects/streamforge/',
  },
  {
    id: 'devforge',
    slug: 'devforge',
    title: 'DevForge: Scala Developer Orchestration CLI',
    problem:
      'Friction in managing complex local multi-service testing and container configurations.',
    role: 'Tooling Engineer',
    contribution:
      'Implemented functional CLI workflows, task orchestration, and Docker integration.',
    stack: ['Scala 3', 'Cats Effect', 'Docker', 'CLI'],
    status: 'in-progress',
    draft: true, // GATED: Awaiting verified repository and clearance (Milestone 3)
    featured: true,
    summary: 'Developer tooling and task orchestration CLI built with functional Scala paradigms.',
    href: '/projects/devforge/',
  },
  {
    id: 'java-task-api',
    slug: 'java-task-api',
    title: 'Task Management & Scheduling Backend',
    problem: 'Reliable task state tracking, authorization boundaries, and RESTful scheduling.',
    role: 'Java Backend Engineer',
    contribution:
      'Engineered Spring Boot REST controllers, JPA/PostgreSQL persistence, and security filters.',
    stack: ['Java', 'Spring Boot', 'PostgreSQL', 'Docker'],
    status: 'prototype',
    draft: true, // GATED: Awaiting verified repository and clearance (Milestone 3)
    featured: false,
    summary: 'Robust RESTful API with relational persistence and role-based access control.',
    href: '/projects/java-task-api/',
  },
  {
    id: 'currency-auth-research',
    slug: 'currency-auth-research',
    title: 'Banknote Authentication Research Prototype',
    problem: 'Automated optical detection of security micro-features on mobile hardware.',
    role: 'Research & Algorithm Engineer',
    contribution: 'Explored computer vision feature extraction and classification prototypes.',
    stack: ['Python', 'Computer Vision', 'ML Research'],
    status: 'research',
    draft: true, // GATED: Awaiting dataset rights and algorithm verification (Milestone 3)
    featured: false,
    summary:
      'Computer vision research prototype investigating banknote micro-structure authentication.',
    href: '/projects/currency-auth/',
  },
];

/**
 * Returns only verified, published, featured projects for the homepage.
 * Strictly enforces dual verification: `draft === false` AND `isRoutePublished(href) === true`.
 */
export function getPublishedFeaturedProjects(
  projects: ProjectItem[] = candidateProjects
): ProjectItem[] {
  return projects.filter((p) => {
    if (p.draft) return false;
    if (!p.featured) return false;
    const targetRoute = p.href || `/projects/${p.slug}/`;
    return isRoutePublished(targetRoute);
  });
}
