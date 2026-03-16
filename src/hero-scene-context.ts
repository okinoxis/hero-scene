'use client'

import { createContext, useContext } from 'react'
import type { HeroSceneContextValue } from './types'

export const HeroSceneContext = createContext<HeroSceneContextValue | null>(null)

export function useHeroScene(): HeroSceneContextValue {
  const ctx = useContext(HeroSceneContext)
  if (!ctx) {
    throw new Error(
      'HeroScene compound components (Parallax, Vignette, Blur, Pattern, DarkOverlay, Content) ' +
        'must be rendered inside a <HeroScene> parent.',
    )
  }
  return ctx
}
