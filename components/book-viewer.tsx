"use client"

import { useState, useRef } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Environment, Html, useTexture } from "@react-three/drei"
import { ChevronLeft, ChevronRight } from "lucide-react"
import * as THREE from "three"

// Import components
import { ChapterContent } from "@/components/chapter-content"
import { ThemeToggle } from "@/components/theme-toggle"
import { PageTurnEffect } from "@/components/page-turn-effect"

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

function Book({ setCurrentPage, currentPage, totalPages }) {
  const { viewport } = useThree()
  const bookRef = useRef()
  const coverTexture = useTexture(
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/srimad-bhagavad-gita-original-imagb9cycgjpjhyz-wAiFVKqDrLaIeosCbf5SsWh8RDhqbd.webp",
  )
  const backTexture = useTexture(
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/The-Enchanted-Melody-of-Krishnas-Flute-Tanmay-Mandal-XhAickIdtNS1Sdv3A6B2kBAJPP6fOD.png",
  )

  // Create a material for the cover
  const coverMaterial = new THREE.MeshStandardMaterial({
    map: coverTexture,
    roughness: 0.7,
    metalness: 0.1,
  })

  // Create a material for the back cover
  const backMaterial = new THREE.MeshStandardMaterial({
    map: backTexture,
    roughness: 0.7,
    metalness: 0.1,
  })

  // Create materials for the pages
  const pageMaterial = new THREE.MeshStandardMaterial({
    color: "#f5f5dc",
    roughness: 0.9,
    metalness: 0.0,
  })

  // Create material for the spine
  const spineMaterial = new THREE.MeshStandardMaterial({
    color: "#8B4513",
    roughness: 0.8,
    metalness: 0.2,
  })

  // Animation for the book
  useFrame((state) => {
    if (bookRef.current) {
      bookRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1 + Math.PI / 6
      bookRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.4) * 0.05
      bookRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1
    }
  })

  // Calculate the opening angle based on the current page
  const openingAngle = currentPage === 0 ? 0 : Math.min(Math.PI * 0.2, (currentPage / totalPages) * Math.PI * 0.4)

  const handlePageTurn = (direction) => {
    if (direction === "next") {
      setCurrentPage(Math.min(totalPages - 1, currentPage + 1))
    } else {
      setCurrentPage(Math.max(0, currentPage - 1))
    }
  }

  return (
    <group ref={bookRef} position={[0, 0, 0]} rotation={[0, Math.PI / 6, 0]}>
      {/* Book cover */}
      <mesh position={[0, 0, 0.05]} material={coverMaterial} rotation={[0, -openingAngle, 0]}>
        <boxGeometry args={[5, 7, 0.1]} />
      </mesh>

      {/* Book pages */}
      <mesh position={[0, 0, 0]} material={pageMaterial}>
        <boxGeometry args={[4.9, 6.9, 0.8]} />
      </mesh>

      {/* Page turn effect */}
      <PageTurnEffect
        position={[0, 0, 0.1]}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageTurn={handlePageTurn}
      />

      {/* Book back cover */}
      <mesh position={[0, 0, -0.45]} material={backMaterial} rotation={[0, openingAngle, 0]}>
        <boxGeometry args={[5, 7, 0.1]} />
      </mesh>

      {/* Book spine */}
      <mesh position={[-2.55, 0, -0.2]} rotation={[0, Math.PI / 2, 0]} material={spineMaterial}>
        <boxGeometry args={[0.9, 6.9, 0.2]} />
      </mesh>

      {/* Table of Contents */}
      {currentPage === 0 && (
        <Html position={[0, 0, 0.11]} transform rotation={[0, 0, 0]} scale={0.15}>
          <div className="w-[1200px] h-[1600px] bg-amber-50 dark:bg-amber-900 p-12 overflow-y-auto">
            <h1 className="text-4xl font-bold text-center text-amber-800 dark:text-amber-300 mb-8">
              Table of Contents
            </h1>
            <div className="grid grid-cols-1 gap-4">
              {chapters.map((chapter) => (
                <div
                  key={chapter.number}
                  className="border-b border-amber-200 dark:border-amber-700 pb-2 cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-800/50 p-2 rounded-lg transition-colors"
                  onClick={() => setCurrentPage(chapter.number)}
                >
                  <h2 className="text-2xl font-semibold text-amber-700 dark:text-amber-400">
                    Chapter {chapter.number}: {chapter.title}
                  </h2>
                  <p className="text-lg text-amber-600 dark:text-amber-500 italic">{chapter.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        </Html>
      )}

      {/* Chapter pages */}
      {currentPage > 0 && currentPage <= chapters.length && (
        <Html position={[0, 0, 0.11]} transform rotation={[0, 0, 0]} scale={0.15}>
          <div className="w-[1200px] h-[1600px] bg-amber-50 dark:bg-amber-900 p-12 overflow-y-auto">
            <ChapterContent chapterNumber={currentPage} />
          </div>
        </Html>
      )}

      {/* Navigation controls */}
      <Html position={[0, -4, 0.11]} transform rotation={[0, 0, 0]} scale={0.15}>
        <div className="flex justify-center space-x-4 w-[1200px]">
          <button
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            className="bg-amber-600 text-white px-6 py-3 rounded-lg flex items-center"
            disabled={currentPage === 0}
          >
            <ChevronLeft className="mr-2" /> Previous
          </button>
          <span className="bg-amber-100 dark:bg-amber-800 text-amber-900 dark:text-amber-100 px-6 py-3 rounded-lg">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
            className="bg-amber-600 text-white px-6 py-3 rounded-lg flex items-center"
            disabled={currentPage === totalPages - 1}
          >
            Next <ChevronRight className="ml-2" />
          </button>
        </div>
      </Html>
    </group>
  )
}

export function BookViewer({ onClose }) {
  const [currentPage, setCurrentPage] = useState(0)
  const totalPages = chapters.length + 1 // +1 for table of contents

  return (
    <div className="w-full h-[70vh] relative">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      <Canvas camera={{ position: [0, 0, 10], fov: 35 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <Book setCurrentPage={setCurrentPage} currentPage={currentPage} totalPages={totalPages} />
        <Environment preset="sunset" />
      </Canvas>
    </div>
  )
}
