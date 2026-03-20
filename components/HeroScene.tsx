'use client'

import { useRef, useMemo, useCallback, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'

// ─── Register GSAP plugins ────────────────────────────────────────────────────
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// ─── Constants ────────────────────────────────────────────────────────────────
const PARTICLE_COUNT  = 2000
const FIELD_SIZE      = 28      // spread of the point cloud
const FIELD_DEPTH     = 14      // z-depth
const CONNECTION_DIST = 2.8     // max distance for line connections
const MAX_CONNECTIONS = 800     // cap line segments for performance
const DRIFT_SPEED     = 0.00018 // how fast particles drift

// Palette — obsidian bg, cyan accent, crimson accent, dim brass
const COLORS = {
  cyan:    new THREE.Color('#00e5ff'),
  crimson: new THREE.Color('#8b1a1a'),
  brass:   new THREE.Color('#b8960c'),
  dim:     new THREE.Color('#3a3b4a'),
}

// ─── Particle geometry hook ───────────────────────────────────────────────────
function useParticleGeometry() {
  return useMemo(() => {
    const positions  = new Float32Array(PARTICLE_COUNT * 3)
    const colors     = new Float32Array(PARTICLE_COUNT * 3)
    const velocities = new Float32Array(PARTICLE_COUNT * 3)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3

      // Spread particles across the field with slight z-depth variance
      positions[i3]     = (Math.random() - 0.5) * FIELD_SIZE
      positions[i3 + 1] = (Math.random() - 0.5) * FIELD_SIZE * 0.6
      positions[i3 + 2] = (Math.random() - 0.5) * FIELD_DEPTH

      // Slow, unique drift velocity per particle
      velocities[i3]     = (Math.random() - 0.5) * DRIFT_SPEED
      velocities[i3 + 1] = (Math.random() - 0.5) * DRIFT_SPEED * 0.6
      velocities[i3 + 2] = (Math.random() - 0.5) * DRIFT_SPEED * 0.4

      // Color distribution: mostly dim, some cyan, rare crimson/brass
      const r = Math.random()
      let col: THREE.Color
      if      (r < 0.55) col = COLORS.dim
      else if (r < 0.80) col = COLORS.cyan
      else if (r < 0.95) col = COLORS.crimson
      else               col = COLORS.brass

      colors[i3]     = col.r
      colors[i3 + 1] = col.g
      colors[i3 + 2] = col.b


    }

    return { positions, colors, velocities }
  }, [])
}

// ─── No custom shader ────────────────────────────────────────────────────────
// Using Three.js PointsMaterial with vertexColors.
// Custom shaderMaterial caused INVALID_OPERATION errors because manually
// declaring 'attribute vec3 color' conflicts with Three.js's built-in
// color attribute injection when vertexColors is enabled.

// ─── Connection line geometry ─────────────────────────────────────────────────
function useConnectionGeometry(positions: Float32Array) {
  return useMemo(() => {
    const linePositions: number[] = []
    const lineColors:    number[] = []
    let   connectionCount = 0

    for (let i = 0; i < PARTICLE_COUNT && connectionCount < MAX_CONNECTIONS; i++) {
      const ix = positions[i * 3], iy = positions[i * 3 + 1], iz = positions[i * 3 + 2]

      for (let j = i + 1; j < PARTICLE_COUNT && connectionCount < MAX_CONNECTIONS; j++) {
        const jx = positions[j * 3], jy = positions[j * 3 + 1], jz = positions[j * 3 + 2]
        const dx = ix - jx, dy = iy - jy, dz = iz - jz
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz)

        if (dist < CONNECTION_DIST) {
          // Opacity falls off with distance — thin at full range
          const alpha = (1 - dist / CONNECTION_DIST) * 0.18

          linePositions.push(ix, iy, iz, jx, jy, jz)
          // Slightly cyan-tinted lines
          lineColors.push(
            0.05 * alpha, 0.65 * alpha, 0.85 * alpha,
            0.05 * alpha, 0.65 * alpha, 0.85 * alpha,
          )
          connectionCount++
        }
      }
    }

    return {
      positions: new Float32Array(linePositions),
      colors:    new Float32Array(lineColors),
    }
  }, [positions])
}

// ─── Animated particles mesh ──────────────────────────────────────────────────
function ParticleField() {
  const meshRef    = useRef<THREE.Points>(null)
  const linesRef   = useRef<THREE.LineSegments>(null)
  const { positions, colors, velocities } = useParticleGeometry()
  const { positions: linePos, colors: lineColors } = useConnectionGeometry(positions)

  // basePos accumulates only linear drift. writePos is the final output
  // sent to the GPU each frame = basePos + sinusoidal offset.
  // Keeping them separate means the sine oscillation is always computed
  // from a stable base — never accumulated — so it can't compound into jitter.
  const basePos  = useRef(positions.slice())
  const writePos = useRef(new Float32Array(PARTICLE_COUNT * 3))

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t    = clock.getElapsedTime()
    const base = basePos.current
    const out  = writePos.current
    const geo  = meshRef.current.geometry

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3

      // Step 1: advance linear drift on the stable base
      base[i3]     += velocities[i3]
      base[i3 + 1] += velocities[i3 + 1]
      base[i3 + 2] += velocities[i3 + 2]

      // Step 2: wrap base at field boundaries
      if (base[i3]     >  FIELD_SIZE / 2)   base[i3]     = -FIELD_SIZE / 2
      if (base[i3]     < -FIELD_SIZE / 2)   base[i3]     =  FIELD_SIZE / 2
      if (base[i3 + 1] >  FIELD_SIZE * 0.3) base[i3 + 1] = -FIELD_SIZE * 0.3
      if (base[i3 + 1] < -FIELD_SIZE * 0.3) base[i3 + 1] =  FIELD_SIZE * 0.3
      if (base[i3 + 2] >  FIELD_DEPTH / 2)  base[i3 + 2] = -FIELD_DEPTH / 2
      if (base[i3 + 2] < -FIELD_DEPTH / 2)  base[i3 + 2] =  FIELD_DEPTH / 2

      // Step 3: final position = base + fresh sinusoidal offset.
      // Evaluated from clock time, never accumulated — smooth at any framerate.
      out[i3]     = base[i3]     + Math.sin(t * 0.28 + i * 0.017) * 0.12
      out[i3 + 1] = base[i3 + 1] + Math.cos(t * 0.21 + i * 0.023) * 0.08
      out[i3 + 2] = base[i3 + 2]
    }

    const posAttr = geo.attributes.position as THREE.BufferAttribute
    posAttr.set(out)
    posAttr.needsUpdate = true
  })

  return (
    <>
      {/* Particle points — PointsMaterial with vertexColors.
          size is the average particle size; sizeAttenuation makes
          distant particles appear smaller for natural depth. */}
      <points ref={meshRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          sizeAttenuation
          vertexColors
          transparent
          opacity={0.75}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Connection lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePos, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[lineColors, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </>
  )
}

// ─── Camera controller with GSAP scroll trigger ───────────────────────────────
function CameraRig() {
  const { camera } = useThree()
  const targetRef  = useRef({ x: 0, y: 0, tilt: 0 })

  // Subtle mouse parallax
  const onMouseMove = useCallback((e: MouseEvent) => {
    const nx = (e.clientX / window.innerWidth  - 0.5) * 2
    const ny = (e.clientY / window.innerHeight - 0.5) * 2
    gsap.to(targetRef.current, {
      x:        nx * 0.8,
      y:       -ny * 0.4,
      duration: 2.5,
      ease:     'power2.out',
    })
  }, [])

  useEffect(() => {
    // Camera initial position
    camera.position.set(0, 0, 10)
    camera.lookAt(0, 0, 0)

    // Use gsap.context for proper cleanup of all tweens and triggers
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: 'body',
        start:   'top top',
        end:     '30% top',
        onUpdate: (self) => {
          const p = self.progress
          gsap.to(camera.position, {
            z:        10 + p * 2.5,
            y:        -p * 1.2,
            duration: 0.6,
            ease:     'power2.out',
            overwrite: 'auto',
          })
        },
      })
    })

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      ctx.revert()
    }
  }, [camera, onMouseMove])

  // Apply mouse parallax every frame
  useFrame(() => {
    camera.position.x += (targetRef.current.x - camera.position.x) * 0.04
    camera.position.y += (targetRef.current.y - camera.position.y) * 0.04
    camera.lookAt(0, 0, 0)
  })

  return null
}

// ─── Inner canvas scene ───────────────────────────────────────────────────────
function Scene() {
  return (
    <>
      <CameraRig />
      <ParticleField />
    </>
  )
}

// ─── Exported component ───────────────────────────────────────────────────────
// Positioned fixed behind all page content.
// aria-hidden — the canvas is purely decorative, no accessible content.
export default function HeroScene() {
  return (
    <div
      aria-hidden="true"
      style={{
        position:       'fixed',
        inset:          0,
        zIndex:         0,
        pointerEvents:  'none',
      }}
    >
      <Canvas
        gl={{
          antialias:       true,
          alpha:           true,         // transparent background — obsidian bg comes from CSS
          powerPreference: 'high-performance',
          stencil:         false,
          depth:           false,        // no depth buffer needed for 2D-feeling overlay
        }}
        camera={{ fov: 60, near: 0.1, far: 100, position: [0, 0, 10] }}
        dpr={[1, 1.5]}                   // cap pixel ratio — avoid overdraw on retina
        style={{ background: 'transparent' }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0)  // fully transparent clear
        }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}