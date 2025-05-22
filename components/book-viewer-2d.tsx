"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Home, Menu, ArrowLeft, Volume2, VolumeX } from "lucide-react"
import { ChapterContent } from "@/components/chapter-content"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useSpeechRecognition } from "@/hooks/use-speech-recognition"

type ChapterMetadata = {
  number: number
  title: string
  subtitle: string
}

// Update the BookViewer2D props interface to include a callback for asking about verses
interface BookViewer2DProps {
  onClose: () => void
  onOpenChatbot: () => void
  onAskAboutVerse?: (verseNumber: string, verseText: string) => void
  initialPage?: number
}

// Update the function signature to include the new prop
export function BookViewer2D({ onClose, onOpenChatbot, onAskAboutVerse, initialPage = 0 }: BookViewer2DProps) {
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [showTwoPages, setShowTwoPages] = useState(false)
  const [chapters, setChapters] = useState<ChapterMetadata[]>([])
  const [loading, setLoading] = useState(true)
  const [voiceCommandsEnabled, setVoiceCommandsEnabled] = useState(false)
  const totalPages = chapters.length + 1 // +1 for table of contents

  // Initialize speech recognition for navigation commands
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    isSupported: isSpeechRecognitionSupported,
  } = useSpeechRecognition({
    language: "en-US",
    continuous: true,
    onResult: (result) => {
      // Process voice commands
      const lowerResult = result.toLowerCase()

      if (lowerResult.includes("next page") || lowerResult.includes("go next")) {
        goToPage(currentPage + 1)
      } else if (lowerResult.includes("previous page") || lowerResult.includes("go back")) {
        goToPage(currentPage - 1)
      } else if (lowerResult.includes("go to contents") || lowerResult.includes("table of contents")) {
        goToPage(0)
      } else if (lowerResult.includes("go to chapter")) {
        // Extract chapter number
        const match = lowerResult.match(/chapter\s+(\d+)/i)
        if (match && match[1]) {
          const chapterNum = Number.parseInt(match[1], 10)
          if (chapterNum > 0 && chapterNum <= chapters.length) {
            goToPage(chapterNum)
          }
        }
      } else if (lowerResult.includes("open chatbot") || lowerResult.includes("ask question")) {
        onOpenChatbot()
      } else if (lowerResult.includes("close book") || lowerResult.includes("go back to 3d")) {
        onClose()
      }
    },
  })

  // Toggle voice commands
  const toggleVoiceCommands = () => {
    if (isListening) {
      stopListening()
      setVoiceCommandsEnabled(false)
    } else {
      startListening()
      setVoiceCommandsEnabled(true)
    }
  }

  // Fetch chapter metadata
  useEffect(() => {
    async function fetchChaptersMetadata() {
      try {
        const response = await fetch("/data/chapters/chapter-metadata.json")
        if (!response.ok) {
          throw new Error("Failed to load chapters metadata")
        }
        const data = await response.json()
        setChapters(data)
      } catch (err) {
        console.error("Error loading chapters metadata:", err)
        // Fallback to empty array if metadata can't be loaded
        setChapters([])
      } finally {
        setLoading(false)
      }
    }

    fetchChaptersMetadata()
  }, [])

  // Check screen width to determine if we should show two pages
  useEffect(() => {
    const checkWidth = () => {
      setShowTwoPages(window.innerWidth >= 1024)
    }

    checkWidth()
    window.addEventListener("resize", checkWidth)
    return () => window.removeEventListener("resize", checkWidth)
  }, [])

  // Get the next page for two-page view
  const getNextPage = () => {
    if (currentPage === 0) return null // Table of contents is always single page
    const nextPageNum = currentPage + 1
    return nextPageNum <= chapters.length ? nextPageNum : null
  }

  // Handle page navigation
  const goToPage = (pageNum: number) => {
    if (pageNum >= 0 && pageNum <= totalPages - 1) {
      setCurrentPage(pageNum)
    }
  }

  // Get chapter title for the current page
  const getPageTitle = (pageNum: number) => {
    if (pageNum === 0) return "Table of Contents"
    const chapter = chapters.find((c) => c.number === pageNum)
    return chapter ? `Chapter ${pageNum}: ${chapter.title}` : `Chapter ${pageNum}`
  }

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="bg-gradient-to-r from-amber-900 to-amber-800 p-3 rounded-t-lg flex items-center justify-between">
          <Skeleton className="h-10 w-40 bg-amber-800/50" />
          <Skeleton className="h-10 w-40 bg-amber-800/50" />
        </div>
        <div className="flex-grow bg-amber-950/30 p-6">
          <div className="grid grid-cols-1 gap-4">
            <Skeleton className="h-12 w-full bg-amber-800/30" />
            <Skeleton className="h-12 w-full bg-amber-800/30" />
            <Skeleton className="h-12 w-full bg-amber-800/30" />
            <Skeleton className="h-12 w-full bg-amber-800/30" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header with navigation */}
      <div className="bg-gradient-to-r from-amber-900 to-amber-800 p-3 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="text-amber-300 hover:text-amber-200 hover:bg-amber-800/50 border-amber-700"
            onClick={onClose}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to 3D View
          </Button>

          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-amber-800/50 border-amber-700 text-amber-300"
              onClick={() => goToPage(0)}
            >
              <Home className="mr-2 h-4 w-4" /> Contents
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="bg-amber-800/50 border-amber-700 text-amber-300"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="mr-1 h-4 w-4" /> Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="bg-amber-800/50 border-amber-700 text-amber-300"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
            >
              Next <ChevronRight className="ml-1 h-4 w-4" />
            </Button>

            {/* Voice command button */}
            {isSpeechRecognitionSupported && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`bg-amber-800/50 border-amber-700 ${
                        voiceCommandsEnabled ? "text-amber-100" : "text-amber-300"
                      } ${isListening ? "animate-pulse" : ""}`}
                      onClick={toggleVoiceCommands}
                    >
                      {voiceCommandsEnabled ? (
                        <>
                          <VolumeX className="mr-1 h-4 w-4" /> Voice Off
                        </>
                      ) : (
                        <>
                          <Volume2 className="mr-1 h-4 w-4" /> Voice On
                        </>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-amber-950 text-amber-300 border-amber-700">
                    {voiceCommandsEnabled
                      ? "Disable voice commands"
                      : 'Enable voice commands (try "next page", "go to chapter 3", etc.)'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            className="bg-amber-600 hover:bg-amber-500 text-white"
            onClick={onOpenChatbot}
          >
            Open Chatbot
          </Button>

          {/* Mobile chapter menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="bg-amber-800/50 border-amber-700">
                  <Menu className="h-4 w-4 text-amber-300" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-amber-950 border-amber-800 text-amber-100">
                <SheetHeader>
                  <SheetTitle className="text-amber-300">Chapters</SheetTitle>
                </SheetHeader>
                <div className="mt-4 space-y-1 overflow-y-auto max-h-[80vh]">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-amber-300 hover:bg-amber-900 hover:text-amber-200"
                    onClick={() => goToPage(0)}
                  >
                    Table of Contents
                  </Button>
                  {chapters.map((chapter) => (
                    <Button
                      key={chapter.number}
                      variant="ghost"
                      className="w-full justify-start text-amber-300 hover:bg-amber-900 hover:text-amber-200"
                      onClick={() => goToPage(chapter.number)}
                    >
                      {chapter.number}. {chapter.title}
                    </Button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Book content */}
      <div className="flex-grow overflow-hidden bg-amber-950/30 rounded-b-lg">
        <div className="h-full flex flex-col md:flex-row">
          {/* Current page */}
          <div className={`h-full ${showTwoPages ? "w-1/2 border-r border-amber-800/50" : "w-full"}`}>
            <div className="h-full flex flex-col">
              <div className="bg-amber-900/50 p-2 text-center border-b border-amber-800/50">
                <h2 className="text-amber-300 font-semibold">{getPageTitle(currentPage)}</h2>
              </div>
              <div className="flex-grow overflow-y-auto p-4 bg-amber-50 dark:bg-amber-900/80 text-amber-950 dark:text-amber-100">
                {currentPage === 0 ? (
                  <div className="space-y-4">
                    <h1 className="text-3xl font-bold text-center text-amber-800 dark:text-amber-300 mb-6">
                      Table of Contents
                    </h1>
                    <div className="grid grid-cols-1 gap-3">
                      {chapters.map((chapter) => (
                        <Card
                          key={chapter.number}
                          className="border-amber-200 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-800/50 transition-colors cursor-pointer p-3"
                          onClick={() => goToPage(chapter.number)}
                        >
                          <h3 className="text-xl font-semibold text-amber-800 dark:text-amber-300">
                            Chapter {chapter.number}: {chapter.title}
                          </h3>
                          <p className="text-amber-700 dark:text-amber-400 italic">{chapter.subtitle}</p>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  <ChapterContent chapterNumber={currentPage} onAskAboutVerse={onAskAboutVerse} />
                )}
              </div>
            </div>
          </div>

          {/* Second page (for larger screens) */}
          {showTwoPages && getNextPage() && (
            <div className="w-1/2 h-full">
              <div className="h-full flex flex-col">
                <div className="bg-amber-900/50 p-2 text-center border-b border-amber-800/50">
                  <h2 className="text-amber-300 font-semibold">{getPageTitle(getNextPage()!)}</h2>
                </div>
                <div className="flex-grow overflow-y-auto p-4 bg-amber-50 dark:bg-amber-900/80 text-amber-950 dark:text-amber-100">
                  <ChapterContent chapterNumber={getNextPage()!} onAskAboutVerse={onAskAboutVerse} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="md:hidden fixed bottom-4 left-0 right-0 flex justify-center">
        <div className="bg-amber-900/90 backdrop-blur-sm rounded-full shadow-lg p-1 flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-amber-300 hover:bg-amber-800/70"
            onClick={() => goToPage(0)}
          >
            <Home className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-amber-300 hover:bg-amber-800/70"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="px-2 text-sm text-amber-300">
            {currentPage + 1}/{totalPages}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-amber-300 hover:bg-amber-800/70"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Mobile voice command button */}
          {isSpeechRecognitionSupported && (
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full ${voiceCommandsEnabled ? "text-amber-100" : "text-amber-300"} hover:bg-amber-800/70 ${isListening ? "animate-pulse" : ""}`}
              onClick={toggleVoiceCommands}
            >
              {voiceCommandsEnabled ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
