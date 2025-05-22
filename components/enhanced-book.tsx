"use client"

import { useRef, useState, Suspense } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, Html, useTexture, OrbitControls, PerspectiveCamera, useProgress, Loader } from "@react-three/drei"
import { ChevronLeft, ChevronRight, Home, Menu } from "lucide-react"
import * as THREE from "three"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerClose } from "@/components/ui/drawer"

// Import the ChapterContent component
import { ChapterContent } from "@/components/chapter-content"

const chapters = [
  { number: 1, title: "Arjuna Vishada Yoga", subtitle: "The Yoga of Arjuna's Grief" },
  { number: 2, title: "Sankhya Yoga", subtitle: "The Yoga of Knowledge" },
  { number: 3, title: "Karma Yoga", subtitle: "The Yoga of Action" },
  { number: 4, title: "Jnana Yoga", subtitle: "The Yoga of Knowledge" },
  { number: 5, title: "Karma Sanyasa Yoga", subtitle: "The Yoga of Renunciation" },
  { number: 6, title: "Dhyana Yoga", subtitle: "The Yoga of Meditation" },
  { number: 7, title: "Jnana Vijnana Yoga", subtitle: "The Yoga of Knowledge and Wisdom" },
  { number: 8, title: "Aksara Brahma Yoga", subtitle: "The Yoga of the Imperishable Brahman" },
  { number: 9, title: "Raja Vidya Yoga", subtitle: "The Yoga of Royal Knowledge" },
  { number: 10, title: "Vibhuti Yoga", subtitle: "The Yoga of Divine Manifestations" },
  { number: 11, title: "Vishvarupa Darshana Yoga", subtitle: "The Yoga of the Universal Form" },
  { number: 12, title: "Bhakti Yoga", subtitle: "The Yoga of Devotion" },
  { number: 13, title: "Kshetra Kshetrajna Vibhaga Yoga", subtitle: "The Yoga of the Field and its Knower" },
  { number: 14, title: "Gunatraya Vibhaga Yoga", subtitle: "The Yoga of the Three Gunas" },
  { number: 15, title: "Purushottama Yoga", subtitle: "The Yoga of the Supreme Person" },
  { number: 16, title: "Daivasura Sampad Vibhaga Yoga", subtitle: "The Yoga of Divine and Demonic Qualities" },
  { number: 17, title: "Shraddhatraya Vibhaga Yoga", subtitle: "The Yoga of the Three Types of Faith" },
  { number: 18, title: "Moksha Sanyasa Yoga", subtitle: "The Yoga of Liberation through Renunciation" },
]

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

// First, let's create a separate component for loading textures
// Add this component before the Book component

function TextureLoader({ children }) {
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

  return children({ coverTexture, backTexture })
}

// Now modify the Book component to accept textures as props
function Book({ setCurrentPage, currentPage, totalPages, isOpen, setIsOpen, coverTexture, backTexture }) {
  const bookRef = useRef()
  const [hovered, setHovered] = useState(false)

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

  // Smooth animation for the book
  useFrame((state) => {
    if (bookRef.current) {
      // Gentle floating animation
      bookRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1

      // Subtle rotation - more pronounced when hovered
      const hoverIntensity = hovered ? 0.08 : 0.03
      bookRef.current.rotation.y =
        Math.sin(state.clock.getElapsedTime() * 0.3) * hoverIntensity + (isOpen ? 0 : Math.PI * 0.1)
      bookRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.4) * 0.02
    }
  })

  // Handle book click
  const handleBookClick = () => {
    if (!isOpen) {
      setIsOpen(true)
      setCurrentPage(0) // Open to table of contents
    }
  }

  // Calculate opening angle based on current page
  const openingAngle = isOpen ? Math.PI * 0.1 : 0

  return (
    <group
      ref={bookRef}
      position={[0, 0, 0]}
      rotation={[0, isOpen ? 0 : Math.PI * 0.1, 0]}
      onClick={handleBookClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {!isOpen ? (
        // Closed book
        <>
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

          {/* Instruction text */}
          <Html position={[0, -4, 1]} transform>
            <div className="text-center text-amber-300 bg-amber-950/80 p-3 rounded-lg shadow-lg backdrop-blur-sm">
              <p className="mb-2">Click the book to open it</p>
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsOpen(true)
                  setCurrentPage(0)
                }}
                className="bg-amber-600 hover:bg-amber-500 text-white"
              >
                Open Book
              </Button>
            </div>
          </Html>
        </>
      ) : (
        // Open book
        <>
          {/* Left side (cover) */}
          <mesh position={[-2.5, 0, 0]} rotation={[0, -openingAngle, 0]} material={coverMaterial}>
            <boxGeometry args={[5, 7, 0.2]} />
          </mesh>

          {/* Left pages */}
          <mesh position={[-2.5, 0, 0.1]} rotation={[0, -openingAngle, 0]} material={pageMaterial}>
            <boxGeometry args={[4.9, 6.9, 0.4]} />
          </mesh>

          {/* Center crease */}
          <mesh position={[0, 0, 0.2]} material={spineMaterial}>
            <boxGeometry args={[0.1, 6.9, 0.1]} />
          </mesh>

          {/* Right pages */}
          <mesh position={[2.5, 0, 0.1]} rotation={[0, openingAngle, 0]} material={pageMaterial}>
            <boxGeometry args={[4.9, 6.9, 0.4]} />
          </mesh>

          {/* Right side (cover) */}
          <mesh position={[2.5, 0, 0]} rotation={[0, openingAngle, 0]} material={backMaterial}>
            <boxGeometry args={[5, 7, 0.2]} />
          </mesh>

          {/* Content display */}
          {currentPage === 0 ? (
            <Html position={[0, 0, 0.6]} transform rotation={[0, 0, 0]} scale={0.15}>
              <div className="w-[1200px] h-[1600px] bg-amber-950/90 p-12 overflow-y-auto text-amber-100 rounded-lg shadow-xl border border-amber-800/50">
                <h1 className="text-4xl font-bold text-center text-amber-300 mb-8">Table of Contents</h1>
                <div className="grid grid-cols-1 gap-4">
                  {chapters.map((chapter) => (
                    <div
                      key={chapter.number}
                      className="border-b border-amber-700 pb-2 cursor-pointer hover:bg-amber-800/50 p-2 rounded-lg transition-colors"
                      onClick={() => setCurrentPage(chapter.number)}
                    >
                      <h2 className="text-2xl font-semibold text-amber-300">
                        Chapter {chapter.number}: {chapter.title}
                      </h2>
                      <p className="text-lg text-amber-400 italic">{chapter.subtitle}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Html>
          ) : (
            <Html position={[0, 0, 0.6]} transform rotation={[0, 0, 0]} scale={0.15}>
              <div className="w-[1200px] h-[1600px] bg-amber-950/90 p-12 overflow-y-auto text-amber-100 rounded-lg shadow-xl border border-amber-800/50">
                <ChapterContent chapterNumber={currentPage} />
              </div>
            </Html>
          )}

          {/* Navigation controls */}
          <Html position={[0, -4, 0.6]} transform rotation={[0, 0, 0]} scale={0.15}>
            <div className="flex justify-center space-x-4 w-[1200px]">
              <Button
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                className="bg-amber-600 hover:bg-amber-500 text-white flex items-center"
                disabled={currentPage === 0}
              >
                <ChevronLeft className="mr-2" /> Previous
              </Button>
              <Button
                onClick={() => setCurrentPage(0)}
                className="bg-amber-700 hover:bg-amber-600 text-white flex items-center"
              >
                <Home className="mr-2" /> Contents
              </Button>
              <span className="bg-amber-800/70 text-amber-100 px-6 py-3 rounded-lg">
                {currentPage === 0 ? "Table of Contents" : `Chapter ${currentPage}`}
              </span>
              <Button
                onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                className="bg-amber-600 hover:bg-amber-500 text-white flex items-center"
                disabled={currentPage === totalPages - 1}
              >
                Next <ChevronRight className="ml-2" />
              </Button>
              <Button onClick={() => setIsOpen(false)} className="bg-amber-700 hover:bg-amber-600 text-white">
                Close Book
              </Button>
            </div>
          </Html>
        </>
      )}
    </group>
  )
}

// Now modify the BookScene component to use the TextureLoader
function BookScene({ setCurrentPage, currentPage, totalPages, isOpen, setIsOpen }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={35} />

      <ambientLight intensity={0.7} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} castShadow />
      <spotLight position={[-10, 5, 10]} angle={0.2} penumbra={1} intensity={0.8} color="#ffd700" castShadow />
      <pointLight position={[0, -10, -10]} intensity={0.5} color="#ff9900" />

      <Suspense fallback={<LoadingScreen />}>
        <TextureLoader>
          {({ coverTexture, backTexture }) => (
            <Book
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              totalPages={totalPages}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              coverTexture={coverTexture}
              backTexture={backTexture}
            />
          )}
        </TextureLoader>
      </Suspense>

      <Environment preset="sunset" />
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
        minDistance={8}
        maxDistance={15}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  )
}

// Now update the EnhancedBookViewer component to move the Suspense wrapper outside of the Canvas
export function EnhancedBookViewer({ onClose }) {
  const [currentPage, setCurrentPage] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const totalPages = chapters.length + 1 // +1 for table of contents

  return (
    <div className="w-full h-[80vh] relative rounded-xl overflow-hidden shadow-2xl border border-amber-800/30">
      <Suspense
        fallback={
          <div className="flex h-full w-full items-center justify-center bg-amber-950">
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-amber-300 text-lg font-medium">Loading sacred text...</p>
            </div>
          </div>
        }
      >
        <Canvas shadows>
          <BookScene
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            totalPages={totalPages}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        </Canvas>
      </Suspense>

      {/* Mobile-friendly chapter navigation */}
      <div className="absolute bottom-4 right-4 md:hidden">
        <Drawer>
          <DrawerTrigger asChild>
            <Button className="rounded-full w-12 h-12 bg-amber-600 hover:bg-amber-500 shadow-lg">
              <Menu />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="bg-amber-950 border-amber-800">
            <DrawerHeader>
              <DrawerTitle className="text-amber-300">Chapters</DrawerTitle>
            </DrawerHeader>
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-1 gap-2">
                <DrawerClose asChild>
                  <Button
                    variant="ghost"
                    className="justify-start text-amber-300 hover:bg-amber-900 hover:text-amber-200"
                    onClick={() => {
                      setCurrentPage(0)
                      setIsOpen(true)
                    }}
                  >
                    Table of Contents
                  </Button>
                </DrawerClose>
                {chapters.map((chapter) => (
                  <DrawerClose key={chapter.number} asChild>
                    <Button
                      variant="ghost"
                      className="justify-start text-amber-300 hover:bg-amber-900 hover:text-amber-200"
                      onClick={() => {
                        setCurrentPage(chapter.number)
                        setIsOpen(true)
                      }}
                    >
                      {chapter.number}. {chapter.title}
                    </Button>
                  </DrawerClose>
                ))}
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      <Loader />
    </div>
  )
}
