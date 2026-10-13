/** REFERENCE EXAMPLE ONLY. Adjust this to the current installed Astro API and file locations. */
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) => z.object({
    title: z.string().min(3),
    summary: z.string().min(20),
    status: z.enum(['completed', 'prototype', 'in-progress', 'research']),
    role: z.string().min(3),
    individualContribution: z.string().min(12),
    categories: z.array(z.enum(['backend', 'distributed', 'fullstack', 'research', 'frontend'])).min(1),
    technologies: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    featureOrder: z.number().int().optional(),
    publishedAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    repoUrl: z.string().url().optional(),
    demoUrl: z.string().url().optional(),
    coverImage: image().optional(),
    architectureImage: image().optional(),
    evidence: z.array(z.object({
      label: z.string().min(2),
      url: z.string().url(),
      kind: z.enum(['repo', 'demo', 'test', 'document', 'article']),
    })).optional(),
    metrics: z.array(z.object({
      name: z.string().min(2),
      value: z.string().min(1),
      methodology: z.string().min(15),
      evidenceUrl: z.string().url().optional(),
    })).optional(),
    draft: z.boolean().default(true),
    seoDescription: z.string().optional(),
  }),
});

const writing = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writing' }),
  schema: ({ image }) => z.object({
    title: z.string().min(3),
    description: z.string().min(20),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    topics: z.array(z.string()).default([]),
    coverImage: image().optional(),
    draft: z.boolean().default(true),
  }),
});

export const collections = { projects, writing };

// In route getStaticPaths, explicitly filter out draft entries in production:
// const published = await getCollection('projects', ({ data }) => !data.draft);
