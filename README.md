# hero-scene

Cinematic hero sections for Next.js — image rotation with crossfade, parallax scrolling, mouse tracking, vignette overlays with dominant colors, blur masks, and dot patterns.

## Install

```bash
npm install hero-scene
```

## Usage

```tsx
import { HeroScene } from 'hero-scene'
import type { HeroImage } from 'hero-scene'

const images: HeroImage[] = [
  { src: '/hero-1.jpg', color: '210, 100, 60' },
  { src: '/hero-2.jpg', color: '70, 150, 220' },
  { src: '/hero-3.jpg', color: '120, 80, 200' },
]

export function Hero() {
  return (
    <HeroScene
      images={images}
      initialIndex={0}
      interval={30000}
      className="min-h-svh"
    >
      <div className="container mx-auto px-6 py-32">
        <h1>Your headline here</h1>
      </div>
    </HeroScene>
  )
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `images` | `HeroImage[]` | *required* | Array of `{ src, color }` objects |
| `initialIndex` | `number` | `0` | Starting image index |
| `interval` | `number` | `30000` | Rotation interval (ms). `0` disables |
| `transitionDuration` | `number` | `700` | Crossfade duration (ms) |
| `className` | `string` | — | Extra classes on the root container |
| `parallax` | `ParallaxConfig \| false` | `{}` | Parallax & mouse config, or `false` to disable |
| `vignette` | `VignetteConfig \| false` | `{}` | Vignette overlay config, or `false` to disable |
| `blur` | `BlurConfig \| false` | `{}` | Edge blur mask config, or `false` to disable |
| `pattern` | `PatternConfig \| false` | `{}` | Dot pattern config, or `false` to disable |
| `darkMode` | `DarkModeConfig \| false` | `{}` | Dark mode behavior, or `false` to disable |
| `onIndexChange` | `(index: number) => void` | — | Called when the active image changes |
| `children` | `ReactNode` | — | Content rendered above all layers |

## Configuration

### Parallax

```tsx
<HeroScene
  parallax={{
    speed: 0.4,        // vertical scroll speed (0 = fixed, 1 = normal)
    mouseShiftX: 25,   // max horizontal mouse shift (px)
    mouseShiftY: 15,   // max vertical mouse shift (px)
    mouseLerp: 0.04,   // smoothing (lower = smoother)
  }}
/>
```

### Vignette

The vignette creates a radial gradient using each image's dominant color, with crossfade transitions between them.

```tsx
<HeroScene
  vignette={{
    centerX: 50,       // gradient center X (%)
    centerY: 100,      // gradient center Y (%)
    shape: 'circle',   // 'circle' or 'ellipse'
    stops: [           // [position%, opacity] pairs
      [0, 0],
      [50, 0.3],
      [100, 0.6],
    ],
    transitionDuration: 1000,
  }}
/>
```

### Blur mask

```tsx
<HeroScene
  blur={{
    amount: 24,        // blur intensity (px)
    centerX: 50,       // clear zone center X (%)
    centerY: 65,       // clear zone center Y (%)
    innerRadius: 15,   // where blur starts (%)
    outerRadius: 55,   // where blur is full (%)
  }}
/>
```

### Dot pattern

```tsx
<HeroScene
  pattern={{
    dotSize: 1,
    spacing: 20,
    lightColor: 'rgba(0 0 0 / 0.15)',
    darkColor: 'rgba(255 255 255 / 0.1)',
  }}
/>
```

### Dark mode

Uses Tailwind's `dark:` class strategy. Requires the `dark` class on a parent element.

```tsx
<HeroScene
  darkMode={{
    imageFilter: 'saturate(0)',  // CSS filter for images in dark mode
    overlay: true,               // show dark overlay
    overlayOpacity: 0.4,
  }}
/>
```

## Color format

The `color` property in `HeroImage` uses comma-separated RGB values (e.g. `'210, 100, 60'`). This format is required for CSS `color-mix()` and `rgb()` interpolation.

## Requirements

- React 18+ or 19+
- Next.js 14+
- Tailwind CSS (for dark mode `dark:` variant)

## License

MIT
