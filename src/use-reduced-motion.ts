'use client'

import { useEffect, useState } from 'react'

/**
 * Returns true when the user has enabled "prefers-reduced-motion: reduce"
 * in their OS or browser settings. SSR-safe — defaults to false.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mql = globalThis.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mql.matches)

    function onChange(e: MediaQueryListEvent) {
      setReduced(e.matches)
    }

    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return reduced
}
