"use client"

import { useRef, useState, Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { Environment, Html, useTexture, OrbitControls, PerspectiveCamera, useProgress } from "@react-three/drei"
import * as THREE from "three"
import { Button } from "@/components/ui/button"

// Loading component
function LoadingScreen() {
  const { progress } = useProgress()

  return (
    <Html center>
      <div className="flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-amber-300 text-lg font-medium">Loading sacred text... {progress.toFixed(0)}%</p>
      </div>
    </Html>
  )
}

// Book component with improved design
function Book({ onOpenBook }) {
  const bookRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [lastClickTime, setLastClickTime] = useState(0)
  const [buttonClicked, setButtonClicked] = useState(false)

  // Load textures with error handling
  const coverTexture = useTexture(
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/srimad-bhagavad-gita-original-imagb9cycgjpjhyz-wAiFVKqDrLaIeosCbf5SsWh8RDhqbd.webp",
    (texture) => {
      texture.minFilter = THREE.LinearFilter
      texture.magFilter = THREE.LinearFilter
    },
  )

  const backTexture = useTexture(
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/The-Enchanted-Melody-of-Krishnas-Flute-Tanmay-Mandal-XhAickIdtNS1Sdv3A6B2kBAJPP6fOD.png",
    (texture) => {
      texture.minFilter = THREE.LinearFilter
      texture.magFilter = THREE.LinearFilter
    },
  )

  // Create materials with better quality settings
  const coverMaterial = new THREE.MeshStandardMaterial({
    map: coverTexture,
    roughness: 0.7,
    metalness: 0.2,
    bumpScale: 0.002,
  })

  const backMaterial = new THREE.MeshStandardMaterial({
    map: backTexture,
    roughness: 0.7,
    metalness: 0.2,
    bumpScale: 0.002,
  })

  const pageMaterial = new THREE.MeshStandardMaterial({
    color: "#f5f5dc",
    roughness: 0.9,
    metalness: 0.0,
  })

  const spineMaterial = new THREE.MeshStandardMaterial({
    color: "#8B4513",
    roughness: 0.8,
    metalness: 0.3,
  })

  const goldMaterial = new THREE.MeshStandardMaterial({
    color: "#D4AF37",
    roughness: 0.3,
    metalness: 0.8,
  })

  // Handle book click - now requires double click
  const handleBookClick = () => {
    const now = Date.now()
    if (now - lastClickTime < 300) {
      // Double click detected
      onOpenBook()
    }
    setLastClickTime(now)
  }

  // Handle button click
  const handleButtonClick = (e) => {
    e.stopPropagation()
    setButtonClicked(true)
    onOpenBook()
  }

  // Scale down the book size by 20%
  const bookScale = 0.8

  return (
    <group
      ref={bookRef}
      position={[0, 0, 0]}
      rotation={[0, Math.PI * 0.1, 0]}
      onClick={handleBookClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={[bookScale, bookScale, bookScale]} // Scale down the entire book
    >
      {/* Front cover with embossed details */}
      <mesh position={[0, 0, 0.5]} material={coverMaterial}>
        <boxGeometry args={[5, 7, 0.2]} />
      </mesh>

      {/* Pages with slight variation for realism */}
      <mesh position={[0, 0, 0]} material={pageMaterial}>
        <boxGeometry args={[4.9, 6.9, 0.8]} />
      </mesh>

      {/* Back cover */}
      <mesh position={[0, 0, -0.5]} material={backMaterial}>
        <boxGeometry args={[5, 7, 0.2]} />
      </mesh>

      {/* Spine with decorative elements */}
      <mesh position={[-2.55, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={spineMaterial}>
        <boxGeometry args={[1, 6.9, 0.2]} />
      </mesh>

      {/* Decorative gold bands on spine */}
      <mesh position={[-2.55, 2, 0]} rotation={[0, Math.PI / 2, 0]} material={goldMaterial}>
        <boxGeometry args={[1, 0.1, 0.21]} />
      </mesh>

      <mesh position={[-2.55, -2, 0]} rotation={[0, Math.PI / 2, 0]} material={goldMaterial}>
        <boxGeometry args={[1, 0.1, 0.21]} />
      </mesh>
    </group>
  )
}

// Scene setup with improved lighting and environment
function BookScene({ onOpenBook }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={35} />

      <ambientLight intensity={0.7} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} castShadow />
      <spotLight position={[-10, 5, 10]} angle={0.2} penumbra={1} intensity={0.8} color="#ffd700" castShadow />
      <pointLight position={[0, -10, -10]} intensity={0.5} color="#ff9900" />

      <Book onOpenBook={onOpenBook} />

      <Environment preset="sunset" />
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={8}
        maxDistance={15}
        enableDamping
        dampingFactor={0.05}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  )
}

export function SimplifiedBookViewer({ onOpenBook }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="w-full h-[65vh] md:h-[70vh] lg:h-[75vh] max-w-sm mx-auto">
        <Canvas shadows className="w-full h-full rounded-xl overflow-hidden" camera={{ position: [0, 0, 12], fov: 35 }}>
          <Suspense fallback={<LoadingScreen />}>
            <BookScene onOpenBook={onOpenBook} />
          </Suspense>
        </Canvas>

        {/* Separate button outside the Canvas for better visibility and interaction */}
        <div className="absolute bottom-10 left-0 right-0 z-10 flex justify-center">
          <Button
            onClick={onOpenBook}
            className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-3 text-base rounded-lg shadow-lg border-2 border-amber-400 animate-pulse"
            size="default"
          >
            Open Sacred Book
          </Button>
        </div>
      </div>
    </div>
  )
}
