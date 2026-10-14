import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { createProjectSchema } from './data/schemas/projectSchema';

export const collections = {
  projects: defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
    schema: ({ image }) => createProjectSchema(image()),
  }),
};
