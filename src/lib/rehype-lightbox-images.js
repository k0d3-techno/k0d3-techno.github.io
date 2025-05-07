/**
 * A rehype plugin that transforms markdown images to use lightbox component
 */
import { visit } from 'unist-util-visit'
import { h } from 'hastscript'

export function rehypeLightboxImages() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      // Only process images that aren't already in a lightbox
      if (
        node.tagName === 'img' &&
        (!node.properties.className ||
          !node.properties.className.includes('no-lightbox'))
      ) {
        const src = node.properties.src
        const alt = node.properties.alt || ''

        // Skip if src is empty or starts with http (external images)
        if (!src || src.startsWith('http')) return

        // Create figure element
        const figure = h('figure', { className: ['lightbox-figure'] }, [
          h('lightbox-image', {
            src: src,
            alt: alt,
            'client:visible': true,
          }),
        ])

        // Replace the image with our lightbox component
        Object.assign(node, figure)
      }
    })
  }
}

export default rehypeLightboxImages
