# @okinoxis/hero-scene

Compound component for cinematic hero backgrounds in Next.js — image rotation, parallax, vignettes, blur, and patterns.

## Install

```bash
npm install @okinoxis/hero-scene
```

## Usage

```tsx
import { HeroScene } from '@okinoxis/hero-scene'

const images = [
  { src: '/karate.jpg', color: '70, 150, 220' },
  { src: '/surf.jpg', color: '220, 160, 60' },
  { src: '/tennis.jpg', color: '200, 110, 50' },
]

<HeroScene images={images} interval={30000} className="min-h-svh">
  <HeroScene.Parallax />
  <HeroScene.Vignette />
  <HeroScene.Blur />
  <HeroScene.Pattern />
  <HeroScene.DarkOverlay />
  <HeroScene.Content>
    <h1>Your headline</h1>
  </HeroScene.Content>
</HeroScene>
```

Only include the sub-components you need. All are optional.

## Layers

```
Background    z:0   — images (crossfade) + fallback color, moved by Parallax
DarkOverlay   z:10  — dark mode only overlay
Blur          z:15  — backdrop blur with radial mask (clear center)
Vignette      z:20  — color-matched radial gradient per image
Pattern       z:20  — repeating dot grid
Content       z:30  — your content
```

## API

### `<HeroScene>`

| Prop | Type | Default |
|------|------|---------|
| `images` * | `{ src: string, color: string }[]` | — |
| `initialIndex` | `number` | `0` |
| `interval` | `number` | `30000` |
| `transitionDuration` | `number` | `700` |
| `className` | `string` | — |
| `onIndexChange` | `(index: number) => void` | — |

`color` is `"r, g, b"` (e.g. `"210, 100, 60"`) for CSS `color-mix()`.

### `<HeroScene.Parallax>`

| Prop | Type | Default |
|------|------|---------|
| `speed` | `number` | `0.4` |
| `mouseShiftX` | `number` | `25` |
| `mouseShiftY` | `number` | `15` |
| `mouseLerp` | `number` | `0.04` |

### `<HeroScene.Vignette>`

| Prop | Type | Default |
|------|------|---------|
| `centerX` | `number` | `50` |
| `centerY` | `number` | `100` |
| `shape` | `'circle' \| 'ellipse'` | `'circle'` |
| `stops` | `[number, number][]` | `[[0,0]...[100,0.6]]` |
| `transitionDuration` | `number` | `1000` |

### `<HeroScene.Blur>`

| Prop | Type | Default |
|------|------|---------|
| `amount` | `number` | `24` |
| `centerX` | `number` | `50` |
| `centerY` | `number` | `65` |
| `innerRadius` | `number` | `15` |
| `outerRadius` | `number` | `55` |

### `<HeroScene.Pattern>`

| Prop | Type | Default |
|------|------|---------|
| `dotSize` | `number` | `1` |
| `spacing` | `number` | `20` |
| `lightColor` | `string` | `'rgba(0 0 0 / 0.15)'` |
| `darkColor` | `string` | `'rgba(255 255 255 / 0.1)'` |

### `<HeroScene.DarkOverlay>`

| Prop | Type | Default |
|------|------|---------|
| `opacity` | `number` | `0.4` |

### `<HeroScene.Content>`

| Prop | Type | Default |
|------|------|---------|
| `className` | `string` | — |

## Accessibility

- Respects `prefers-reduced-motion` — disables all animations
- Pauses off-screen via Intersection Observer
- All decorative layers are `aria-hidden`

## Requirements

React 18+, Next.js 14+, Tailwind CSS (for `dark:` variant)

## License

MIT
