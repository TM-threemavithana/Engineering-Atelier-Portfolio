/**
 * @file src/data/schemas/projectSchema.ts
 * @description Authoritative Zod schemas and validation rules for the projects content collection.
 *
 * ARCHITECTURAL DESIGN:
 * - Pure TypeScript + Zod implementation: independently testable in Node.js test runners
 *   without depending on Astro virtual modules (astro:content).
 * - Separates engineering progress status from editorial publication status (Correction 2).
 * - Implements strict HTTPS-only URL validation (Correction 3).
 * - Enforces meaningful image alt text and structured evidence/metrics metadata (Correction 5).
 */

import { z } from 'zod';

/**
 * Valid project engineering status enum values (Master Spec §8.2).
 * Represents technical implementation maturity, distinct from publication clearance.
 */
export const projectStatusEnum = z.enum(['completed', 'prototype', 'in-progress', 'research']);
export type ProjectStatus = z.infer<typeof projectStatusEnum>;

/**
 * Approved technical category classifications.
 */
export const projectCategoryEnum = z.enum([
  'backend',
  'distributed',
  'fullstack',
  'research',
  'frontend',
]);
export type ProjectCategory = z.infer<typeof projectCategoryEnum>;

/**
 * Evidence kind taxonomy for verifiable engineering artifacts.
 */
export const evidenceKindEnum = z.enum(['repo', 'demo', 'test', 'document', 'article']);
export type EvidenceKind = z.infer<typeof evidenceKindEnum>;

/**
 * Strict HTTPS-only URL validator for external project resources.
 * Rejects insecure http:, dangerous javascript:, data:, protocol-relative (//), and malformed strings.
 */
export function isValidProjectHttpsUrl(rawUrl: unknown): boolean {
  if (typeof rawUrl !== 'string') return false;
  const trimmed = rawUrl.trim();
  if (trimmed.length === 0) return false;
  if (trimmed.startsWith('//')) return false; // Reject protocol-relative URLs

  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Zod schema for validated external HTTPS URLs.
 */
export const projectHttpsUrlSchema = z.string().trim().refine(isValidProjectHttpsUrl, {
  message:
    'Must be a valid secure HTTPS URL (http, relative, and non-HTTPS protocols are rejected)',
});

/**
 * Verified evidence link schema.
 */
export const projectEvidenceSchema = z.object({
  label: z.string().min(1, 'Evidence label cannot be empty'),
  url: projectHttpsUrlSchema,
  kind: evidenceKindEnum,
});
export type ProjectEvidence = z.infer<typeof projectEvidenceSchema>;

/**
 * Engineering metric schema with mandatory methodology to avoid unverified bare numbers.
 */
export const projectMetricSchema = z.object({
  name: z.string().min(1, 'Metric name cannot be empty'),
  value: z.string().min(1, 'Metric value cannot be empty'),
  methodology: z
    .string()
    .min(10, 'Methodology explaining measurement method is required (min 10 chars)'),
  evidenceUrl: projectHttpsUrlSchema.optional(),
});
export type ProjectMetric = z.infer<typeof projectMetricSchema>;

/**
 * Image reference with mandatory descriptive alternative text.
 */
export function createProjectImageSchema(imageValidator: z.ZodTypeAny) {
  return z.object({
    src: imageValidator,
    alt: z
      .string({ required_error: 'Descriptive image alternative text is required' })
      .min(1, 'Descriptive image alternative text is required'),
    caption: z.string().optional(),
  });
}

/**
 * Factory function creating the project frontmatter Zod schema.
 * Accepts an image validator (e.g. Astro context.image() or z.string() in unit tests).
 */
export function createProjectSchema(imageValidator: z.ZodTypeAny = z.string()) {
  const imageSchema = createProjectImageSchema(imageValidator);

  return z.object({
    // Core Identity
    title: z
      .string({ required_error: 'Project title is required' })
      .min(1, 'Project title is required'),
    summary: z
      .string({ required_error: 'Project summary is required' })
      .min(1, 'Project summary is required'),
    status: projectStatusEnum,

    // Dates (coerced safely)
    publishedAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),

    // Role & Contributions
    role: z
      .string({ required_error: 'Engineering role is required' })
      .min(1, 'Engineering role is required'),
    collaborators: z.array(z.string().min(1)).optional(),
    individualContribution: z.string().optional(),

    // Taxonomy & Tech Stack
    categories: z
      .array(projectCategoryEnum, { required_error: 'At least one category is required' })
      .min(1, 'At least one category is required'),
    technologies: z
      .array(z.string().min(1), { required_error: 'At least one technology is required' })
      .min(1, 'At least one technology is required'),

    // Presentation & Ordering
    featured: z.boolean().default(false),
    featureOrder: z.number().int().positive().optional(),

    // External Resources (Strict HTTPS)
    repoUrl: projectHttpsUrlSchema.optional(),
    demoUrl: projectHttpsUrlSchema.optional(),

    // Visual Media
    coverImage: imageSchema.optional(),
    architectureImage: imageSchema.optional(),

    // Verification & Evidence
    evidence: z.array(projectEvidenceSchema).optional(),
    metrics: z.array(projectMetricSchema).optional(),

    // Publication Gating (Correction 2)
    draft: z.boolean().default(true),
    editorialApproval: z.boolean().default(false),

    // Metadata
    seoDescription: z.string().optional(),
  });
}

/**
 * Validates whether a project data object satisfies the full publication rubric.
 * A project with draft: false MUST pass this check before public display.
 */
export function validatePublishedProject(data: Record<string, unknown>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // 1. Must have explicit editorial approval
  if (data.editorialApproval !== true) {
    errors.push('Published projects require explicit editorial approval (editorialApproval: true)');
  }

  // 2. Draft flag must be false
  if (data.draft !== false) {
    errors.push('Published projects must have draft: false');
  }

  // 3. Individual contribution must be documented
  if (
    !data.individualContribution ||
    typeof data.individualContribution !== 'string' ||
    data.individualContribution.trim().length < 10
  ) {
    errors.push('Published projects must specify individualContribution (min 10 characters)');
  }

  // 4. Must have a valid publishedAt date
  if (
    !data.publishedAt ||
    !(data.publishedAt instanceof Date) ||
    isNaN(data.publishedAt.getTime())
  ) {
    errors.push('Published projects must specify a valid publishedAt date');
  }

  // 5. Check for placeholder patterns in title, summary, role, contribution
  const placeholderPatterns = ['[Awaiting Confirmation]', 'FILL_IN', 'TODO', 'example.com'];
  const textFields = [
    String(data.title || ''),
    String(data.summary || ''),
    String(data.role || ''),
    String(data.individualContribution || ''),
  ];

  for (const text of textFields) {
    for (const pattern of placeholderPatterns) {
      if (text.includes(pattern)) {
        errors.push(`Published project text contains forbidden placeholder pattern: "${pattern}"`);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export type ProjectFrontmatter = z.infer<ReturnType<typeof createProjectSchema>>;
