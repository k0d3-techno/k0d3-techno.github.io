import { defineCollection, z } from 'astro:content'

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    image: z.object({
      src: z.string(),
      alt: z.string().optional(),
      width: z.number().optional().default(1200),
      height: z.number().optional().default(300)
    }).optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().optional()
  })
})

// Only export the blog collection
export const collections = {
  'blog': blog
}
