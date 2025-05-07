'use client'

import { useEffect } from 'react'

export function LightboxWrapper() {
  useEffect(() => {
    // Find all images in the article content
    const findAndProcessImages = () => {
      console.log('Finding and processing images')
      // Target only images in article or prose sections
      const articleImages = document.querySelectorAll(
        '.prose img:not(.no-lightbox), article img:not(.no-lightbox)',
      )

      console.log(`Found ${articleImages.length} images to process`)

      if (articleImages.length === 0) return

      // Replace images with lightbox component
      articleImages.forEach((img) => {
        if (img.parentNode?.nodeName === 'A') {
          console.log('Skipping image in link')
          return // Skip images that are already wrapped in links
        }
        if (img.classList.contains('processed-lightbox')) {
          console.log('Skipping already processed image')
          return // Skip already processed images
        }

        // Mark as processed
        img.classList.add('processed-lightbox')
        img.classList.add('cursor-zoom-in')
        // Fix TypeScript error by casting img to HTMLImageElement
        const imgElement = img as HTMLImageElement
        imgElement.style.transition = 'transform 0.3s ease, filter 0.3s ease'

        // Get image attributes for React
        const src = img.getAttribute('src') || ''
        const alt = img.getAttribute('alt') || ''

        console.log(`Processing image: ${src}`)

        // Instead of hiding original image, just add click handler
        img.addEventListener('click', (e) => {
          e.preventDefault()

          // Create full-screen overlay
          const overlay = document.createElement('div')
          overlay.className =
            'fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm'
          overlay.setAttribute('role', 'dialog')
          overlay.setAttribute('aria-modal', 'true')
          overlay.style.opacity = '0'
          overlay.style.transition = 'opacity 0.3s ease'

          // Create container for image
          const container = document.createElement('div')
          container.className =
            'relative max-h-[90vh] max-w-[90vw] overflow-auto'

          // Create close button - now positioned at top-right corner of screen
          const closeButton = document.createElement('button')
          closeButton.className =
            'fixed top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 text-foreground hover:bg-background z-[60] transition-all'
          closeButton.innerHTML =
            '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>'
          closeButton.setAttribute('aria-label', 'Close lightbox')

          // Create zoomed image
          const zoomedImage = document.createElement('img')
          zoomedImage.src = src
          zoomedImage.alt = alt
          zoomedImage.className =
            'max-h-[85vh] max-w-[85vw] rounded-lg object-contain transform scale-95 opacity-0 transition-all duration-300 ease-out cursor-zoom-out'

          // Append elements (close button directly to overlay for fixed positioning)
          overlay.appendChild(closeButton)
          container.appendChild(zoomedImage)
          overlay.appendChild(container)
          document.body.appendChild(overlay)

          // Prevent scrolling
          document.body.style.overflow = 'hidden'

          // Handle close events
          const closeOverlay = () => {
            // Fade out animation
            overlay.style.opacity = '0'
            zoomedImage.style.transform = 'scale(0.95)'
            zoomedImage.style.opacity = '0'

            // Actual removal after animation completes
            setTimeout(() => {
              document.body.style.overflow = ''
              document.body.removeChild(overlay)
            }, 300)
          }

          // Add fade-in animation after elements are added to DOM
          setTimeout(() => {
            overlay.style.opacity = '1'
            zoomedImage.style.transform = 'scale(1)'
            zoomedImage.style.opacity = '1'
          }, 10)

          closeButton.addEventListener('click', closeOverlay)
          zoomedImage.addEventListener('click', closeOverlay)
          overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
              closeOverlay()
            }
          })

          // Close on escape key
          window.addEventListener('keydown', function handleKeyDown(e) {
            if (e.key === 'Escape') {
              closeOverlay()
              window.removeEventListener('keydown', handleKeyDown)
            }
          })
        })
      })
    }

    // Initial processing
    setTimeout(findAndProcessImages, 500) // Delay to ensure images are loaded

    // Setup mutation observer to handle dynamic content
    const observer = new MutationObserver((mutations) => {
      let hasNewImages = false
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          // Check if new nodes have images
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as HTMLElement
              if (element.tagName === 'IMG' || element.querySelector('img')) {
                hasNewImages = true
              }
            }
          })
        }
      })

      if (hasNewImages) {
        console.log('Detected new images, reprocessing')
        findAndProcessImages()
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  return null
}

export default LightboxWrapper
