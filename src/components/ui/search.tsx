'use client'

import * as React from 'react'
import { useEffect, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import type { SearchItem } from '@/lib/search'

export function Search() {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [posts, setPosts] = useState<SearchItem[]>([])
  const [filteredPosts, setFilteredPosts] = useState<SearchItem[]>([])

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/search.json')
        const data = await response.json()
        setPosts(data)
      } catch (error) {
        console.error('Error fetching posts:', error)
      }
    }
    fetchPosts()
  }, [])

  useEffect(() => {
    const filtered = posts.filter((post) => {
      const searchContent =
        `${post.title} ${post.description} ${post.tags?.join(' ')}`.toLowerCase()
      return searchContent.includes(searchQuery.toLowerCase())
    })
    setFilteredPosts(filtered)
  }, [searchQuery, posts])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-muted-foreground hover:bg-accent flex h-9 w-9 items-center justify-center rounded-md border transition-colors"
        aria-label="Search posts"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-search"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </button>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
          <Dialog.Content className="bg-background fixed top-[20%] left-[50%] z-50 w-full max-w-[85%] translate-x-[-50%] rounded-lg border p-0 shadow-lg sm:max-w-[600px]">
            <div className="flex border-b px-3 py-4">
              <div className="flex w-full items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-search opacity-50"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Type to search..."
                  className="placeholder:text-muted-foreground flex h-8 w-full bg-transparent text-base outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  autoFocus
                />
              </div>
              <Dialog.Close className="text-muted-foreground hover:text-foreground -mr-1 rounded-sm opacity-70 transition-colors focus:outline-none disabled:pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-x"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
                <span className="sr-only">Close</span>
              </Dialog.Close>
            </div>

            {searchQuery && (
              <div className="scrollbar-none max-h-[60vh] overflow-y-auto px-3 py-4">
                {filteredPosts.length > 0 ? (
                  <div className="space-y-4">
                    {filteredPosts.map((post) => (
                      <a
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className="hover:bg-accent block rounded-md p-4 transition-colors"
                        onClick={() => setOpen(false)}
                      >
                        <h3 className="text-lg font-medium">{post.title}</h3>
                        <p className="text-muted-foreground line-clamp-2 text-sm">
                          {post.description}
                        </p>
                        {post.tags && post.tags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                              <span
                                key={tag}
                                className="bg-secondary/60 text-secondary-foreground rounded-sm px-2 py-0.5 text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center text-sm">
                    No posts found.
                  </p>
                )}
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}
