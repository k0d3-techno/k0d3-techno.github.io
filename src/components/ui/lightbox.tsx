'use client'

import { useState, useEffect, useRef, memo } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'

interface LightboxProps {
  src: string
  alt: string
  className?: string
}

export const Lightbox = memo(function Lightbox({
  src,
  alt,
  className,
}: LightboxProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const lightboxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (
        lightboxRef.current &&
        !lightboxRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.addEventListener('mousedown', handleClickOutside)
    document.body.style.overflow = 'hidden' // Prevent scrolling when lightbox is open

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = '' // Restore scrolling when lightbox closes
    }
  }, [isOpen])

  const handleImageClick = () => {
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const LightboxContent = () => (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <button
        onClick={handleClose}
        className="bg-background/80 text-foreground hover:bg-background fixed top-4 right-4 z-[60] flex h-10 w-10 items-center justify-center rounded-full transition-all"
        aria-label="Close lightbox"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
      <div
        ref={lightboxRef}
        className="relative max-h-[90vh] max-w-[90vw] overflow-auto"
      >
        <img
          src={src}
          alt={alt}
          className="max-h-[85vh] max-w-[85vw] rounded-lg object-contain"
        />
      </div>
    </div>
  )

  return (
    <>
      <img
        src={src}
        alt={alt}
        onClick={handleImageClick}
        className={cn(
          'cursor-zoom-in rounded-md transition-transform hover:brightness-105',
          className,
        )}
      />
      {isOpen && mounted && createPortal(<LightboxContent />, document.body)}
    </>
  )
})

export default Lightbox
