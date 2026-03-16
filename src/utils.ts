import type { VignetteConfig, BlurConfig } from './types'

const DEFAULT_STOPS: [number, number][] = [
  [0, 0],
  [15, 0.08],
  [30, 0.15],
  [45, 0.25],
  [60, 0.35],
  [75, 0.45],
  [88, 0.55],
  [100, 0.6],
]

export function buildVignetteGradient(
  color: string,
  config: VignetteConfig,
): string {
  const shape = config.shape ?? 'circle'
  const cx = config.centerX ?? 50
  const cy = config.centerY ?? 100
  const stops = config.stops ?? DEFAULT_STOPS

  const gradientStops = stops
    .map(([pos, opacity]) =>
      opacity === 0
        ? `transparent ${pos}%`
        : `color-mix(in srgb, rgb(${color}) ${Math.round(opacity * 100)}%, transparent) ${pos}%`,
    )
    .join(', ')

  return `radial-gradient(${shape} at ${cx}% ${cy}%, ${gradientStops})`
}

export function buildBlurMask(config: BlurConfig): string {
  const cx = config.centerX ?? 50
  const cy = config.centerY ?? 65
  const inner = config.innerRadius ?? 15
  const outer = config.outerRadius ?? 55

  return `radial-gradient(circle at ${cx}% ${cy}%, transparent ${inner}%, black ${outer}%)`
}
