// Performance optimizations and preloading
;(function () {
  'use strict'

  // Enable hardware acceleration
  function enableHardwareAcceleration() {
    const style = document.createElement('style')
    style.textContent = `
      * {
        transform: translateZ(0);
        backface-visibility: hidden;
      }
    `
    document.head.appendChild(style)
  }

  // Preload critical resources
  function preloadCriticalResources() {
    const criticalUrls = [
      '/fonts/GeistVF.woff2',
      '/fonts/GeistMonoVF.woff2',
      '/static/logo.svg',
    ]

    criticalUrls.forEach((url) => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = url
      link.as = url.includes('.woff2') ? 'font' : 'image'
      if (link.as === 'font') {
        link.type = 'font/woff2'
        link.crossOrigin = 'anonymous'
      }
      document.head.appendChild(link)
    })
  }

  // Optimize images
  function optimizeImages() {
    const images = document.querySelectorAll('img')
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target
          img.style.transition = 'opacity 0.3s ease-in-out'
          imageObserver.unobserve(img)
        }
      })
    })

    images.forEach((img) => {
      imageObserver.observe(img)
    })
  }

  // Smooth scroll polyfill for better performance
  function initSmoothScroll() {
    if (!('scrollBehavior' in document.documentElement.style)) {
      const script = document.createElement('script')
      script.src =
        'https://cdn.jsdelivr.net/gh/iamdustan/smoothscroll@master/smoothscroll.min.js'
      document.head.appendChild(script)
    }
  }

  // Reduce motion for accessibility
  function respectReducedMotion() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const style = document.createElement('style')
      style.textContent = `
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
      `
      document.head.appendChild(style)
    }
  }

  // Optimize scroll performance
  function optimizeScroll() {
    let ticking = false

    function updateScrollPosition() {
      // Add scroll-based optimizations here
      ticking = false
    }

    function requestScrollUpdate() {
      if (!ticking) {
        requestAnimationFrame(updateScrollPosition)
        ticking = true
      }
    }

    window.addEventListener('scroll', requestScrollUpdate, { passive: true })
  }

  // Register service worker
  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log(
              'ServiceWorker registration successful with scope:',
              registration.scope,
            )
          })
          .catch((error) => {
            console.log('ServiceWorker registration failed:', error)
          })
      })
    }
  }

  // Initialize all optimizations
  function init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init)
      return
    }

    enableHardwareAcceleration()
    preloadCriticalResources()
    initSmoothScroll()
    respectReducedMotion()
    optimizeScroll()
    registerServiceWorker()

    // Defer non-critical optimizations
    setTimeout(() => {
      optimizeImages()
    }, 100)
  }

  init()
})()
