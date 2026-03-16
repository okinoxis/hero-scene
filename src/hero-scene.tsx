'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import { HeroSceneContext, useHeroScene } from './hero-scene-context'
import type {
  BlurProps,
  ContentProps,
  DarkOverlayProps,
  HeroSceneProps,
  ParallaxProps,
  PatternProps,
  VignetteProps,
} from './types'
import { buildBlurMask, buildVignetteGradient } from './utils'
import { useInViewport } from './use-in-viewport'
import { useReducedMotion } from './use-reduced-motion'

// ─── Root Component ──────────────────────────────────────────

function HeroSceneRoot({
  images,
  initialIndex = 0,
  interval = 30_000,
  transitionDuration = 700,
  className,
  onIndexChange,
  children,
}: HeroSceneProps) {
  const [index, setIndex] = useState(initialIndex)
  const rootRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const isInViewport = useInViewport(rootRef)

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
        globalThis.dispatchEvent(
          new CustomEvent('hero-scene-index-change', { detail: next }),
        )
      }, 0)
    }, interval)
    return () => clearInterval(id)
  }, [initialIndex, interval, images.length, onIndexChange])

  const activeColor = images[index]?.color ?? '128, 128, 128'

  return (
    <HeroSceneContext.Provider
      value={{
        images,
        index,
        transitionDuration,
        reducedMotion,
        isInViewport,
        containerRef: rootRef,
      }}
    >
      <div
        ref={rootRef}
        className={className}
        style={{ position: 'relative', overflow: 'hidden' }}
      >
        {/* ── Background images (no parallax — Parallax child wraps these) ── */}
        <div
          data-hero-images=""
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: `rgb(${activeColor})`,
            transition: reducedMotion ? 'none' : 'background-color 1s ease',
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
              className="dark:grayscale"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: i === index ? 1 : 0,
                transition: reducedMotion
                  ? 'none'
                  : `opacity ${transitionDuration}ms ease`,
              }}
            />
          ))}
        </div>

        {children}
      </div>
    </HeroSceneContext.Provider>
  )
}

// ─── Parallax ────────────────────────────────────────────────

function Parallax({
  speed = 0.4,
  mouseShiftX = 25,
  mouseShiftY = 15,
  mouseLerp = 0.04,
}: ParallaxProps) {
  const { reducedMotion, isInViewport, containerRef } = useHeroScene()

  const scrollY = useRef(0)
  const targetMouseX = useRef(0)
  const targetMouseY = useRef(0)
  const currentMouseX = useRef(0)
  const currentMouseY = useRef(0)

  useEffect(() => {
    if (reducedMotion) return

    const root = containerRef.current
    if (!root) return

    const imagesEl = root.querySelector<HTMLDivElement>('[data-hero-images]')
    if (!imagesEl) return

    // Expand the images container to allow parallax overflow
    imagesEl.style.inset = '-15%'
    imagesEl.style.willChange = 'transform'

    return () => {
      imagesEl.style.inset = '0'
      imagesEl.style.willChange = ''
      imagesEl.style.transform = ''
    }
  }, [reducedMotion, containerRef])

  useEffect(() => {
    if (reducedMotion) return

    const root = containerRef.current
    if (!root) return

    const imagesEl = root.querySelector<HTMLDivElement>('[data-hero-images]')
    if (!imagesEl) return

    let rafId: number
    let running = true

    function loop() {
      if (!running) return

      currentMouseX.current +=
        (targetMouseX.current - currentMouseX.current) * mouseLerp
      currentMouseY.current +=
        (targetMouseY.current - currentMouseY.current) * mouseLerp

      const y = scrollY.current * speed
      const mx = currentMouseX.current * mouseShiftX
      const my = currentMouseY.current * mouseShiftY
      imagesEl!.style.transform = `translate3d(${mx}px, ${y + my}px, 0)`

      rafId = requestAnimationFrame(loop)
    }

    function onScroll() {
      if (!isInViewport) return
      scrollY.current = globalThis.scrollY
    }

    function onMouseMove(e: MouseEvent) {
      if (!isInViewport) return
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
  }, [
    reducedMotion,
    isInViewport,
    containerRef,
    speed,
    mouseShiftX,
    mouseShiftY,
    mouseLerp,
  ])

  // Parallax is a behavior-only component — renders nothing
  return null
}

// ─── Vignette ────────────────────────────────────────────────

function Vignette({
  centerX = 50,
  centerY = 100,
  shape = 'circle',
  stops,
  transitionDuration = 1000,
}: VignetteProps) {
  const { images, index, reducedMotion } = useHeroScene()
  const transitionMs = reducedMotion ? '0ms' : `${transitionDuration}ms`

  return (
    <>
      {images.map((img, i) => (
        <div
          key={`vignette-${img.color}`}
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 20,
            pointerEvents: 'none',
            opacity: i === index ? 1 : 0,
            transition: `opacity ${transitionMs} ease`,
            background: buildVignetteGradient(img.color, {
              centerX,
              centerY,
              shape,
              stops,
            }),
          }}
        />
      ))}
    </>
  )
}

// ─── Blur ────────────────────────────────────────────────────

function Blur({
  amount = 24,
  centerX = 50,
  centerY = 65,
  innerRadius = 15,
  outerRadius = 55,
}: BlurProps) {
  useHeroScene() // validate context

  const mask = buildBlurMask({ centerX, centerY, innerRadius, outerRadius })

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 15,
        backdropFilter: `blur(${amount}px)`,
        WebkitBackdropFilter: `blur(${amount}px)`,
        maskImage: mask,
        WebkitMaskImage: mask,
        pointerEvents: 'none',
      }}
    />
  )
}

// ─── Pattern ─────────────────────────────────────────────────

function Pattern({
  dotSize = 1,
  spacing = 20,
  lightColor = 'rgba(0 0 0 / 0.15)',
  darkColor = 'rgba(255 255 255 / 0.1)',
}: PatternProps) {
  useHeroScene() // validate context

  const bgImage = (color: string) =>
    `radial-gradient(circle, ${color} ${dotSize}px, transparent ${dotSize}px)`
  const bgSize = `${spacing}px ${spacing}px`

  return (
    <>
      <div
        aria-hidden="true"
        className="dark:hidden"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 20,
          pointerEvents: 'none',
          backgroundImage: bgImage(lightColor),
          backgroundSize: bgSize,
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
          backgroundImage: bgImage(darkColor),
          backgroundSize: bgSize,
        }}
      />
    </>
  )
}

// ─── DarkOverlay ─────────────────────────────────────────────

function DarkOverlay({ opacity = 0.4 }: DarkOverlayProps) {
  useHeroScene() // validate context

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none hidden dark:block"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 10,
        backgroundColor: `rgba(0 0 0 / ${opacity})`,
      }}
    />
  )
}

// ─── Content ─────────────────────────────────────────────────

function Content({ className, children }: ContentProps) {
  useHeroScene() // validate context

  return (
    <div
      className={className}
      style={{ position: 'relative', zIndex: 30 }}
    >
      {children}
    </div>
  )
}

// ─── Exports ────────────────────────────────────────────────

export {
  HeroSceneRoot as HeroScene,
  Parallax as HeroParallax,
  Vignette as HeroVignette,
  Blur as HeroBlur,
  Pattern as HeroPattern,
  DarkOverlay as HeroDarkOverlay,
  Content as HeroContent,
}
