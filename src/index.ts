export {
  HeroScene,
  HeroParallax,
  HeroVignette,
  HeroBlur,
  HeroPattern,
  HeroDarkOverlay,
  HeroContent,
} from './hero-scene'

/** Event name dispatched on `globalThis` when the active image changes. `event.detail` is the new index. */
export const HERO_SCENE_INDEX_EVENT = 'hero-scene-index-change'
export { buildVignetteGradient, buildBlurMask } from './utils'
export { useReducedMotion } from './use-reduced-motion'

export type {
  HeroSceneProps,
  HeroImage,
  ParallaxProps,
  VignetteProps,
  BlurProps,
  PatternProps,
  DarkOverlayProps,
  ContentProps,
} from './types'
