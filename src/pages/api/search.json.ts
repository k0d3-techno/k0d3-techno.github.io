import { getCollection } from 'astro:content'
import { generateSearchIndex } from '@/lib/search'

export async function GET() {
  const posts = await getCollection('blog')
  const searchIndex = generateSearchIndex(posts)

  return new Response(JSON.stringify(searchIndex), {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
