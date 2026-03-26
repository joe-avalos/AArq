import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    category: z.enum(['residential', 'commercial', 'arts_and_culture', 'places_of_worship']),
    location: z.string(),
    thumbnail: z.string().url(),
    images: z.array(z.object({
      src: z.string().url(),
      alt: z.object({ en: z.string(), es: z.string() }),
    })),
    order: z.number().optional(),
    year: z.string().optional(),
    size: z.object({ lot: z.string(), roof: z.string().optional() }).optional(),
    subtitle: z.object({ en: z.string(), es: z.string() }).optional(),
    body: z.array(z.object({ en: z.string(), es: z.string() })).optional(),
    description: z.object({
      en: z.string(),
      es: z.string(),
    }),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    lang: z.enum(['en', 'es']),
    date: z.date(),
    excerpt: z.string(),
    author: z.string().optional(),
  }),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    lang: z.enum(['en', 'es']),
    tab: z.enum(['design', 'construction', 'property-management']),
    order: z.number(),
  }),
});

const testimonials = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/testimonials' }),
  schema: z.object({
    author: z.string(),
    project: z.string(),
    text: z.object({ en: z.string(), es: z.string() }),
  }),
});

export const collections = { projects, blog, services, testimonials };
