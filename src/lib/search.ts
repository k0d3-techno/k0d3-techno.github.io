import type { CollectionEntry } from 'astro:content'

export interface SearchItem {
  title: string
  description: string
  slug: string
  tags?: string[]
}

export function generateSearchIndex(posts: CollectionEntry<'blog'>[]) {
  return posts.map((post) => ({
    title: post.data.title,
    description: post.data.description,
    slug: post.id,
    tags: post.data.tags,
  }))
}
