"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { useSpring, animated } from "@react-spring/three"
import type * as THREE from "three"

interface PageTurnEffectProps {
  position: [number, number, number]
  rotation?: [number, number, number]
  width?: number
  height?: number
  depth?: number
  color?: string
  pageCount?: number
  currentPage: number
  totalPages: number
  onPageTurn?: (direction: "next" | "prev") => void
}

export function PageTurnEffect({
  position,
  rotation = [0, 0, 0],
  width = 4.8,
  height = 6.8,
  depth = 0.05,
  color = "#f5f5dc",
  pageCount = 10,
  currentPage,
  totalPages,
  onPageTurn,
}: PageTurnEffectProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [hoverPage, setHoverPage] = useState<number | null>(null)

  // Calculate how many pages to show based on current page
  const visiblePages = Math.min(pageCount, totalPages - currentPage)

  // Create springs for page animations
  const [springs, api] = useSpring(() => ({
    rotation: 0,
    config: { mass: 1, tension: 180, friction: 20 },
  }))

  // Handle page turning animation
  const turnPage = (direction: "next" | "prev") => {
    if (isAnimating) return

    if (direction === "next" && currentPage < totalPages - 1) {
      setIsAnimating(true)
      api.start({
        from: { rotation: 0 },
        to: { rotation: -Math.PI },
        onRest: () => {
          setIsAnimating(false)
          if (onPageTurn) onPageTurn("next")
        },
      })
    } else if (direction === "prev" && currentPage > 0) {
      setIsAnimating(true)
      api.start({
        from: { rotation: -Math.PI },
        to: { rotation: 0 },
        onRest: () => {
          setIsAnimating(false)
          if (onPageTurn) onPageTurn("prev")
        },
      })
    }
  }

  // Subtle animation for pages
  useFrame((state) => {
    if (groupRef.current && !isAnimating) {
      groupRef.current.children.forEach((child, i) => {
        // Add subtle floating animation to pages
        const offset = Math.sin(state.clock.getElapsedTime() * 0.5 + i * 0.1) * 0.002
        child.position.y = offset

        // Add subtle rotation to pages
        if (i === hoverPage) {
          child.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.05 - 0.1
        }
      })
    }
  })

  return (
    <group position={position} rotation={rotation as any} ref={groupRef}>
      {/* Static pages (bottom of stack) */}
      {Array.from({ length: Math.min(3, currentPage) }).map((_, i) => (
        <mesh key={`static-${i}`} position={[0, 0, depth * (i - 3)]} rotation={[0, 0, 0]}>
          <boxGeometry args={[width, height, depth]} />
          <meshStandardMaterial color={color} roughness={0.9} />
        </mesh>
      ))}

      {/* Current page (animated) */}
      <animated.mesh position={[width / 2, 0, 0]} rotation-y={springs.rotation}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </animated.mesh>

      {/* Upcoming pages */}
      {Array.from({ length: visiblePages }).map((_, i) => (
        <mesh
          key={`upcoming-${i}`}
          position={[0, 0, depth * (i + 1)]}
          rotation={[0, 0, 0]}
          onPointerOver={() => setHoverPage(i)}
          onPointerOut={() => setHoverPage(null)}
          onClick={() => turnPage("next")}
        >
          <boxGeometry args={[width, height, depth]} />
          <meshStandardMaterial color={color} roughness={0.9} transparent={true} opacity={1 - i * 0.1} />
        </mesh>
      ))}

      {/* Invisible click areas for page turning */}
      <mesh position={[width / 2 + 0.5, 0, 0]} visible={false} onClick={() => turnPage("next")}>
        <boxGeometry args={[1, height, depth * pageCount]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      <mesh position={[-width / 2 - 0.5, 0, 0]} visible={false} onClick={() => turnPage("prev")}>
        <boxGeometry args={[1, height, depth * pageCount]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  )
}
