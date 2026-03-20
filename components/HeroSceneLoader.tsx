'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

// Dynamic import with ssr:false prevents Next.js from attempting to
// render the WebGL canvas during server-side rendering, which would
// throw because `window`, `WebGLRenderingContext`, and the Three.js
// DOM APIs don't exist in the Node runtime.
const HeroScene = dynamic(() => import('./HeroScene'), {
  ssr:     false,
  loading: () => null, // no loading spinner — CSS background shows through
})

export default function HeroSceneLoader() {
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    // 1. Respect prefers-reduced-motion — users who have set this
    //    preference get the CSS glow blob fallback instead.
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return

    // 2. Check WebGL availability — gracefully degrade on devices or
    //    browsers where WebGL isn't supported (old iOS Safari, some
    //    corporate proxies that strip WebGL headers, etc.)
    try {
      const canvas  = document.createElement('canvas')
      const context = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (!context) return
    } catch {
      return
    }

    // 3. Skip on low-memory / slow-CPU devices to avoid janking
    //    the rest of the page. navigator.deviceMemory is non-standard
    //    but supported in Chrome/Edge and is a useful signal.
    const nav = navigator as Navigator & { deviceMemory?: number }
    if (nav.deviceMemory !== undefined && nav.deviceMemory < 2) return

    setShouldRender(true)
  }, [])

  if (!shouldRender) return null

  return <HeroScene />
}