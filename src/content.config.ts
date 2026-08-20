import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const locale = z.enum(['it', 'en']);
const shared = {
  translationKey: z.string().min(1),
  locale,
  title: z.string().min(1),
  summary: z.string().min(1),
  draft: z.boolean().default(true),
  noindex: z.boolean().default(true),
};

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    ...shared,
    category: z.enum(['software', 'av-automation', 'infrastructure']),
    status: z.enum(['concept', 'active', 'complete', 'maintained', 'archived']),
    period: z.string().min(1),
    role: z.string().min(1),
    contribution: z.string().min(1),
    problem: z.string().min(1),
    approach: z.string().min(1),
    technology: z.array(z.string().min(1)),
    outcome: z.string().min(1),
    attribution: z.string().min(1),
    links: z
      .array(z.object({ label: z.string().min(1), url: z.url() }))
      .default([]),
    media: z
      .array(z.object({ src: z.string().min(1), alt: z.string().min(1) }))
      .default([]),
    featured: z.boolean().default(false),
  }),
});

const notes = defineCollection({
  loader: glob({ base: './src/content/notes', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    ...shared,
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    tags: z.array(z.string().min(1)).default([]),
    series: z.string().min(1).optional(),
  }),
});

const lab = defineCollection({
  loader: glob({ base: './src/content/lab', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    ...shared,
    startedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    status: z.enum(['idea', 'experimenting', 'paused', 'complete']),
    tags: z.array(z.string().min(1)).default([]),
    repository: z.url().optional(),
    demo: z.url().optional(),
  }),
});

const cvRole = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  period: z.string().min(1),
  assignment: z.string().min(1).optional(),
  relatedProject: z.string().min(1).optional(),
  summary: z.string().min(1),
  highlights: z.array(z.string().min(1)).default([]),
});

const cvExperience = z
  .object({
    id: z.string().min(1),
    employer: z.string().min(1),
    period: z.string().min(1),
    startMonth: z
      .string()
      .regex(/^\d{4}-(0[1-9]|1[0-2])$/)
      .optional(),
    duration: z.string().min(1).optional(),
    roles: z.array(cvRole).min(1),
  })
  .refine((experience) => experience.startMonth || experience.duration, {
    message: 'Provide startMonth or a fixed duration',
    path: ['duration'],
  });

const cvEducation = z.object({
  id: z.string().min(1),
  qualification: z.string().min(1),
  institution: z.string().min(1),
  period: z.string().min(1),
});

const cvCertification = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  issuer: z.string().min(1),
});

const cvSkillGroup = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  items: z.array(z.string().min(1)).min(1),
});

const cvLanguage = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  proficiency: z.string().min(1),
});

const cv = defineCollection({
  loader: glob({ base: './src/content/cv', pattern: '**/*.json' }),
  schema: z.object({
    translationKey: z.literal('public-cv'),
    locale,
    headline: z.string().min(1),
    summary: z.string().min(1),
    location: z.string().min(1),
    experience: z.array(cvExperience).default([]),
    education: z.array(cvEducation).default([]),
    certifications: z.array(cvCertification).default([]),
    skills: z.array(cvSkillGroup).default([]),
    languages: z.array(cvLanguage).default([]),
  }),
});

// Notes and Lab stay schema-ready but dormant until their first real entries.
// Spread this map into collections when content is authored.
export const dormantCollections = { notes, lab };
export const collections = { projects, cv };
