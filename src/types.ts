export type HeroImage = {
  /** Image URL */
  src: string
  /** Dominant color as "r, g, b" string — used for vignette and fallback bg */
  color: string
}

export type ParallaxConfig = {
  /** Vertical parallax speed (0 = fixed, 1 = normal scroll). Default: 0.4 */
  speed?: number
  /** Max horizontal shift from mouse in px. Default: 25 */
  mouseShiftX?: number
  /** Max vertical shift from mouse in px. Default: 15 */
  mouseShiftY?: number
  /** Mouse follow lerp factor (0-1, lower = smoother). Default: 0.04 */
  mouseLerp?: number
}

export type VignetteConfig = {
  /** Whether to show the vignette. Default: true */
  enabled?: boolean
  /** Vignette shape center X position (%). Default: 50 */
  centerX?: number
  /** Vignette shape center Y position (%). Default: 100 */
  centerY?: number
  /** Vignette shape type. Default: 'circle' */
  shape?: 'circle' | 'ellipse'
  /** Opacity stops — array of [percentage, opacity] pairs from center to edge.
   *  Default: [[0, 0], [15, 0.08], [30, 0.15], [45, 0.25], [60, 0.35], [75, 0.45], [88, 0.55], [100, 0.6]] */
  stops?: [number, number][]
  /** Transition duration in ms when color changes. Default: 1000 */
  transitionDuration?: number
}

export type BlurConfig = {
  /** Whether to show the blur mask. Default: true */
  enabled?: boolean
  /** Blur amount in px. Default: 24 (backdrop-blur-xl) */
  amount?: number
  /** Blur mask center X (%). Default: 50 */
  centerX?: number
  /** Blur mask center Y (%). Default: 65 */
  centerY?: number
  /** Inner radius where blur starts (%). Default: 15 */
  innerRadius?: number
  /** Outer radius where blur is full (%). Default: 55 */
  outerRadius?: number
}

export type PatternConfig = {
  /** Whether to show the dot pattern. Default: true */
  enabled?: boolean
  /** Dot size in px. Default: 1 */
  dotSize?: number
  /** Grid spacing in px. Default: 20 */
  spacing?: number
  /** Dot color for light mode. Default: 'rgba(0 0 0 / 0.15)' */
  lightColor?: string
  /** Dot color for dark mode. Default: 'rgba(255 255 255 / 0.1)' */
  darkColor?: string
}

export type DarkModeConfig = {
  /** Filter to apply to images in dark mode. Default: 'saturate(0)' */
  imageFilter?: string
  /** Whether to show an overlay in dark mode. Default: true */
  overlay?: boolean
  /** Overlay opacity. Default: 0.4 */
  overlayOpacity?: number
}

export type HeroSceneProps = {
  /** Array of images to rotate through */
  images: HeroImage[]
  /** Index of the initial image to show. Default: 0 */
  initialIndex?: number
  /** Rotation interval in ms. 0 disables rotation. Default: 30000 */
  interval?: number
  /** Image transition duration in ms. Default: 700 */
  transitionDuration?: number
  /** Extra className for the container */
  className?: string
  /** Parallax & mouse tracking config */
  parallax?: ParallaxConfig | false
  /** Vignette overlay config */
  vignette?: VignetteConfig | false
  /** Edge blur mask config */
  blur?: BlurConfig | false
  /** Dot pattern overlay config */
  pattern?: PatternConfig | false
  /** Dark mode behavior */
  darkMode?: DarkModeConfig | false
  /** Callback when the active image index changes */
  onIndexChange?: (index: number) => void
  /** Children rendered above all layers (for CTA content etc.) */
  children?: React.ReactNode
}
