'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import type {
  BlurConfig,
  DarkModeConfig,
  HeroSceneProps,
  ParallaxConfig,
  PatternConfig,
  VignetteConfig,
} from './types'
import { buildBlurMask, buildVignetteGradient } from './utils'

// ─── Defaults ────────────────────────────────────────────────
const DEFAULTS = {
  interval: 30_000,
  transitionDuration: 700,
  parallax: {
    speed: 0.4,
    mouseShiftX: 25,
    mouseShiftY: 15,
    mouseLerp: 0.04,
  } satisfies Required<ParallaxConfig>,
  vignette: {
    enabled: true,
    centerX: 50,
    centerY: 100,
    shape: 'circle' as const,
    stops: [
      [0, 0],
      [15, 0.08],
      [30, 0.15],
      [45, 0.25],
      [60, 0.35],
      [75, 0.45],
      [88, 0.55],
      [100, 0.6],
    ] as [number, number][],
    transitionDuration: 1000,
  } satisfies Required<VignetteConfig>,
  blur: {
    enabled: true,
    amount: 24,
    centerX: 50,
    centerY: 65,
    innerRadius: 15,
    outerRadius: 55,
  } satisfies Required<BlurConfig>,
  pattern: {
    enabled: true,
    dotSize: 1,
    spacing: 20,
    lightColor: 'rgba(0 0 0 / 0.15)',
    darkColor: 'rgba(255 255 255 / 0.1)',
  } satisfies Required<PatternConfig>,
  darkMode: {
    imageFilter: 'saturate(0)',
    overlay: true,
    overlayOpacity: 0.4,
  } satisfies Required<DarkModeConfig>,
}

// ─── Component ───────────────────────────────────────────────
export function HeroScene({
  images,
  initialIndex = 0,
  interval = DEFAULTS.interval,
  transitionDuration = DEFAULTS.transitionDuration,
  className,
  parallax: parallaxProp,
  vignette: vignetteProp,
  blur: blurProp,
  pattern: patternProp,
  darkMode: darkModeProp,
  onIndexChange,
  children,
}: HeroSceneProps) {
  const [index, setIndex] = useState(initialIndex)
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollY = useRef(0)
  const targetMouseX = useRef(0)
  const targetMouseY = useRef(0)
  const currentMouseX = useRef(0)
  const currentMouseY = useRef(0)

  // Resolve configs (false = disabled)
  const parallax =
    parallaxProp === false
      ? null
      : { ...DEFAULTS.parallax, ...parallaxProp }
  const vignette =
    vignetteProp === false
      ? null
      : { ...DEFAULTS.vignette, ...vignetteProp }
  const blur =
    blurProp === false ? null : { ...DEFAULTS.blur, ...blurProp }
  const pattern =
    patternProp === false
      ? null
      : { ...DEFAULTS.pattern, ...patternProp }
  const darkMode =
    darkModeProp === false
      ? null
      : { ...DEFAULTS.darkMode, ...darkModeProp }

  // ── Image rotation ──
  useEffect(() => {
    if (interval <= 0 || images.length <= 1) return

    let current = initialIndex
    const id = setInterval(() => {
      const next = (current + 1) % images.length
      current = next
      setIndex(next)
      setTimeout(() => {
        onIndexChange?.(next)
      }, 0)
    }, interval)
    return () => clearInterval(id)
  }, [initialIndex, interval, images.length, onIndexChange])

  // ── Parallax + mouse tracking ──
  useEffect(() => {
    if (!parallax) return

    let rafId: number
    let running = true

    function loop() {
      if (!running) return

      currentMouseX.current +=
        (targetMouseX.current - currentMouseX.current) * parallax!.mouseLerp
      currentMouseY.current +=
        (targetMouseY.current - currentMouseY.current) * parallax!.mouseLerp

      if (containerRef.current) {
        const y = scrollY.current * parallax!.speed
        const mx = currentMouseX.current * parallax!.mouseShiftX
        const my = currentMouseY.current * parallax!.mouseShiftY
        containerRef.current.style.transform = `translate3d(${mx}px, ${y + my}px, 0)`
      }

      rafId = requestAnimationFrame(loop)
    }

    function onScroll() {
      scrollY.current = globalThis.scrollY
    }

    function onMouseMove(e: MouseEvent) {
      targetMouseX.current = (e.clientX / globalThis.innerWidth - 0.5) * 2
      targetMouseY.current = (e.clientY / globalThis.innerHeight - 0.5) * 2
    }

    globalThis.addEventListener('scroll', onScroll, { passive: true })
    globalThis.addEventListener('mousemove', onMouseMove, { passive: true })
    rafId = requestAnimationFrame(loop)

    return () => {
      running = false
      globalThis.removeEventListener('scroll', onScroll)
      globalThis.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(rafId)
    }
  }, [parallax])

  const activeColor = images[index]?.color ?? '128, 128, 128'
  const transitionMs = `${transitionDuration}ms`
  const vignetteTransitionMs = vignette
    ? `${vignette.transitionDuration}ms`
    : '0ms'

  return (
    <div
      className={className}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {/* ── Background images with parallax ── */}
      <div
        ref={containerRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: parallax ? '-15%' : '0',
          willChange: parallax ? 'transform' : undefined,
          backgroundColor: `rgb(${activeColor})`,
          transition: 'background-color 1s ease',
        }}
      >
        {images.map((img, i) => (
          <Image
            key={img.src}
            src={img.src}
            alt=""
            width={1920}
            height={1080}
            priority={i === initialIndex}
            sizes="100vw"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: i === index ? 1 : 0,
              transition: `opacity ${transitionMs} ease`,
              filter:
                darkMode?.imageFilter
                  ? undefined
                  : undefined,
            }}
            className={darkMode ? `dark:[filter:${darkMode.imageFilter}]` : undefined}
          />
        ))}
      </div>

      {/* ── Dark mode overlay ── */}
      {darkMode?.overlay && (
        <div
          aria-hidden="true"
          className="pointer-events-none hidden dark:block"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 10,
            backgroundColor: `rgba(0 0 0 / ${darkMode.overlayOpacity})`,
          }}
        />
      )}

      {/* ── Blur mask ── */}
      {blur && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 15,
            backdropFilter: `blur(${blur.amount}px)`,
            WebkitBackdropFilter: `blur(${blur.amount}px)`,
            maskImage: buildBlurMask(blur),
            WebkitMaskImage: buildBlurMask(blur),
            pointerEvents: 'none',
          }}
        />
      )}

      {/* ── Vignette overlays — crossfade between colors ── */}
      {vignette &&
        images.map((img, i) => (
          <div
            key={`vignette-${img.color}`}
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 20,
              pointerEvents: 'none',
              opacity: i === index ? 1 : 0,
              transition: `opacity ${vignetteTransitionMs} ease`,
              background: buildVignetteGradient(img.color, vignette),
            }}
          />
        ))}

      {/* ── Dot pattern ── */}
      {pattern && (
        <>
          <div
            aria-hidden="true"
            className="dark:hidden"
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 20,
              pointerEvents: 'none',
              backgroundImage: `radial-gradient(circle, ${pattern.lightColor} ${pattern.dotSize}px, transparent ${pattern.dotSize}px)`,
              backgroundSize: `${pattern.spacing}px ${pattern.spacing}px`,
            }}
          />
          <div
            aria-hidden="true"
            className="hidden dark:block"
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 20,
              pointerEvents: 'none',
              backgroundImage: `radial-gradient(circle, ${pattern.darkColor} ${pattern.dotSize}px, transparent ${pattern.dotSize}px)`,
              backgroundSize: `${pattern.spacing}px ${pattern.spacing}px`,
            }}
          />
        </>
      )}

      {/* ── Content (children) ── */}
      {children && (
        <div style={{ position: 'relative', zIndex: 30 }}>{children}</div>
      )}
    </div>
  )
}
