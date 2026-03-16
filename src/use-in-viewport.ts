'use client'

import { useEffect, useState } from 'react'
import type { RefObject } from 'react'

/**
 * Returns true when the referenced element is at least partially visible
 * in the viewport, using IntersectionObserver. SSR-safe — defaults to true
 * so effects run immediately on first paint before the observer fires.
 */
export function useInViewport(ref: RefObject<HTMLElement | null>): boolean {
  const [inViewport, setInViewport] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInViewport(entry.isIntersecting)
      },
      { threshold: 0 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])

  return inViewport
}
