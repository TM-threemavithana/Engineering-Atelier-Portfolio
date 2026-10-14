/**
 * @file src/data/projects.ts
 * @description Centralized Project Inventory & Publication Filtering backed by Astro Content Collections.
 *
 * ARCHITECTURAL DESIGN (EA-019):
 * - Integrates with Astro 5 Content Collections (`projects` collection defined in src/content.config.ts).
 * - Enforces strict 4-layer publication gating:
 *   1. draft: false (Explicitly verified, cleared, and approved by the owner)
 *   2. editorialApproval: true (Explicit editorial signoff per rubric in docs/CONTENT_AND_EVIDENCE.md)
 *   3. isRoutePublished(href) (Target case-study route exists and is approved)
 *   4. validatePublishedProject(data) (All required fields complete with zero placeholder text)
 * - Seamless backward-compatibility with ProjectItem interface for existing components (FeaturedWork, ProjectCard).
 * - Supports safe execution in both Astro runtime/Vite build and standalone Node.js test runners.
 */

import { isRoutePublished } from '../utils/linkSafety';
import {
  type ProjectStatus,
  type ProjectCategory,
  validatePublishedProject,
} from './schemas/projectSchema';

export type ProjectProgressStatus = ProjectStatus;

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
  editorialApproval?: boolean;
}

/**
 * Generic minimal collection entry representation to avoid hard dependency
 * on Astro virtual modules during standalone Node.js testing.
 */
export interface GenericProjectEntry {
  id: string;
  data: {
    title: string;
    summary: string;
    status: ProjectProgressStatus;
    role: string;
    individualContribution?: string;
    technologies: string[];
    categories: ProjectCategory[];
    featured?: boolean;
    featureOrder?: number;
    repoUrl?: string;
    demoUrl?: string;
    draft: boolean;
    editorialApproval?: boolean;
    publishedAt?: Date;
    updatedAt?: Date;
    seoDescription?: string;
    [key: string]: unknown;
  };
}

/**
 * Safely fetches the projects collection from Astro Content Layer.
 * In standalone Node.js environments (where astro:content is unavailable), falls back to empty array.
 * In Astro runtime/build, rethrows unexpected errors to preserve fail-closed integrity.
 */
export async function fetchProjectsCollection(): Promise<GenericProjectEntry[]> {
  try {
    const { getCollection } = await import('astro:content');
    return (await getCollection('projects')) as unknown as GenericProjectEntry[];
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };
    const isVirtualModuleNotFound =
      err?.code === 'ERR_MODULE_NOT_FOUND' ||
      err?.code === 'MODULE_NOT_FOUND' ||
      err?.code === 'ERR_UNSUPPORTED_ESM_URL_SCHEME' ||
      (typeof err?.message === 'string' &&
        (err.message.includes('astro:') || err.message.includes('astro:content')));

    if (isVirtualModuleNotFound) {
      return [];
    }
    // Fail-closed: rethrow real content-loading or schema validation errors in Astro runtime
    throw error;
  }
}

/**
 * Maps a content collection entry to the ProjectItem interface expected by UI components.
 */
export function mapEntryToProjectItem(entry: GenericProjectEntry): ProjectItem {
  return {
    id: entry.id,
    slug: entry.id,
    title: entry.data.title,
    problem: entry.data.summary,
    role: entry.data.role,
    contribution: entry.data.individualContribution || 'Contribution details pending verification',
    stack: entry.data.technologies,
    status: entry.data.status,
    draft: entry.data.draft,
    featured: Boolean(entry.data.featured),
    summary: entry.data.summary,
    href: `/projects/${entry.id}/`,
    repoUrl: entry.data.repoUrl,
    demoUrl: entry.data.demoUrl,
    editorialApproval: Boolean(entry.data.editorialApproval),
  };
}

/**
 * Multi-layer publication gating predicate.
 * Evaluates whether a project is cleared for public presentation.
 */
export function isProjectPublishable(project: ProjectItem | GenericProjectEntry): boolean {
  const isEntry = 'data' in project;
  const draft = isEntry ? project.data.draft : project.draft;
  const editorialApproval = isEntry ? project.data.editorialApproval : project.editorialApproval;
  const id = project.id;
  const targetRoute = isEntry ? `/projects/${id}/` : project.href || `/projects/${id}/`;

  // Gate 1: draft must be explicitly false
  if (draft !== false) return false;

  // Gate 2: explicit editorial approval required
  if (editorialApproval !== true) return false;

  // Gate 3: target route must exist in published routes registry
  if (!isRoutePublished(targetRoute)) return false;

  // Gate 4: published rubric validation (if full entry data is available)
  if (isEntry) {
    const validation = validatePublishedProject(project.data as Record<string, unknown>);
    if (!validation.isValid) return false;
  }

  return true;
}

/**
 * Returns all candidate projects mapped to ProjectItem.
 */
export async function getAllProjects(): Promise<ProjectItem[]> {
  const entries = await fetchProjectsCollection();
  return entries.map(mapEntryToProjectItem);
}

/**
 * Returns all verified, published projects for the /projects/ index.
 * Strictly enforces the 4-layer publication gate.
 * Deterministically sorted:
 * 1. Featured projects first (by title ascending)
 * 2. Non-featured projects (by title ascending)
 */
export async function getPublishedProjects(
  customEntries?: Array<GenericProjectEntry | ProjectItem>
): Promise<ProjectItem[]> {
  const items: ProjectItem[] = [];

  if (customEntries) {
    for (const item of customEntries) {
      if (isProjectPublishable(item)) {
        items.push('data' in item ? mapEntryToProjectItem(item) : item);
      }
    }
  } else {
    const collectionEntries = await fetchProjectsCollection();
    for (const entry of collectionEntries) {
      if (isProjectPublishable(entry)) {
        items.push(mapEntryToProjectItem(entry));
      }
    }
  }

  // Deterministic sort:
  // Featured first (by title), then non-featured (by title)
  return items.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return a.title.localeCompare(b.title);
  });
}

/**
 * Returns only verified, published, featured projects for the homepage.
 * Strictly enforces the 4-layer publication gate.
 * Limited to up to three explicitly approved featured projects (EA-022).
 */
export async function getPublishedFeaturedProjects(
  customEntries?: Array<GenericProjectEntry | ProjectItem>
): Promise<ProjectItem[]> {
  const published = await getPublishedProjects(customEntries);
  return published.filter((item) => item.featured).slice(0, 3);
}
