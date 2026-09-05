import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().optional(),
  }),
});

const work = defineCollection({
  type: "content",
  schema: z.object({
    company: z.string(),
    role: z.string(),
    dateStart: z.coerce.date(),
    dateEnd: z.union([z.coerce.date(), z.string()]),
  }),
});

const projects = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().optional(),
    demoURL: z.string().optional(),
    docsURL: z.string().optional(),
    repoURL: z.string().optional(),
    tools: z.array(z.string()).optional(),
  }),
});

const siteMetadata = z.object({
  NAME: z.string(),
  EMAIL: z.string(),
  NUM_POSTS_ON_HOMEPAGE: z.number().int().nonnegative(),
  NUM_WORKS_ON_HOMEPAGE: z.number().int().nonnegative(),
  NUM_PROJECTS_ON_HOMEPAGE: z.number().int().nonnegative(),
});

const pageMetadata = z.object({
  TITLE: z.string(),
  DESCRIPTION: z.string(),
});

const homeMetadata = pageMetadata.extend({
  GREETING: z.string(),
  GREETING_EMOJI: z.string().optional(),
  BIO: z.string(),
});

const socials = z.array(
  z.object({
    NAME: z.string(),
    HREF: z.string(),
  })
);

const settings = defineCollection({
  type: "data",
  schema: z.object({
    SITE: siteMetadata,
    HOME: homeMetadata,
    BLOG: pageMetadata,
    WORK: pageMetadata,
    PROJECTS: pageMetadata,
    SOCIALS: socials,
  }),
});

export const collections = { blog, work, projects, settings };
