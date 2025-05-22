"use client"

import { useState, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis"
import { SpeechButton } from "@/components/speech-button"

// Define the chapter content structure
type Verse = {
  number: string
  sanskrit: string
  transliteration: string
  translation: string
  explanation: string
}

type ChapterData = {
  number: number
  title: string
  subtitle: string
  verses: Verse[]
  summary: string
}

// Update the ChapterContent props interface to include a callback for opening the chatbot with a specific verse
interface ChapterContentProps {
  chapterNumber: number
  onAskAboutVerse?: (verseNumber: string, verseText: string) => void
}

// Update the function signature to include the new prop
export function ChapterContent({ chapterNumber, onAskAboutVerse }: ChapterContentProps) {
  const [chapter, setChapter] = useState<ChapterData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [speakingVerseId, setSpeakingVerseId] = useState<string | null>(null)
  const [speakingPart, setSpeakingPart] = useState<"translation" | "explanation" | null>(null)

  // Initialize speech synthesis
  const {
    speak,
    cancel,
    isSpeaking,
    isSupported: isSpeechSynthesisSupported,
  } = useSpeechSynthesis({
    rate: 0.9,
    pitch: 1,
    onEnd: () => {
      setSpeakingVerseId(null)
      setSpeakingPart(null)
    },
  })

  useEffect(() => {
    async function fetchChapterData() {
      try {
        setLoading(true)
        setError(null)

        // Fetch the chapter data from the JSON file
        const response = await fetch(`/data/chapters/chapter-${chapterNumber}.json`)

        if (!response.ok) {
          // If the specific chapter file doesn't exist, create a placeholder
          const metadataResponse = await fetch("/data/chapters/chapter-metadata.json")

          if (!metadataResponse.ok) {
            throw new Error("Failed to load chapter metadata")
          }

          const chaptersMetadata = await metadataResponse.json()
          const chapterMeta = chaptersMetadata.find((c) => c.number === chapterNumber)

          if (!chapterMeta) {
            throw new Error(`Chapter ${chapterNumber} not found`)
          }

          // Create a placeholder chapter with metadata but no verses
          const placeholderChapter: ChapterData = {
            number: chapterNumber,
            title: chapterMeta.title,
            subtitle: chapterMeta.subtitle,
            summary: `Chapter ${chapterNumber} explores the philosophical and spiritual teachings related to ${chapterMeta.subtitle.toLowerCase()}. Lord Krishna continues to guide Arjuna through the complexities of spiritual wisdom and practical action.`,
            verses: [
              {
                number: `${chapterNumber}.1`,
                sanskrit: "॥ श्रीमद्भगवद्गीता ॥",
                transliteration: "|| śrīmadbhagavadgītā ||",
                translation: `This is a key verse from Chapter ${chapterNumber} of the Bhagavad Gita.`,
                explanation: `In this verse, Lord Krishna explains an important aspect of ${chapterMeta.subtitle.toLowerCase()} to Arjuna, helping him understand the deeper spiritual truths.`,
              },
            ],
          }

          setChapter(placeholderChapter)
        } else {
          // If the chapter file exists, use its data
          const data = await response.json()
          setChapter(data)
        }
      } catch (err) {
        console.error("Error loading chapter data:", err)
        setError("Failed to load chapter content. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchChapterData()
  }, [chapterNumber])

  // Handle speaking verse parts (only for translation and explanation)
  const handleSpeak = (verseId: string, part: "translation" | "explanation", text: string) => {
    // If already speaking this verse part, stop it
    if (isSpeaking && speakingVerseId === verseId && speakingPart === part) {
      cancel()
      setSpeakingVerseId(null)
      setSpeakingPart(null)
      return
    }

    // If speaking something else, cancel it first
    if (isSpeaking) {
      cancel()
    }

    // Start speaking the selected part
    setSpeakingVerseId(verseId)
    setSpeakingPart(part)
    speak(text)
  }

  if (loading) {
    return <ChapterSkeleton />
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!chapter) {
    return (
      <div className="p-6 text-center">
        <p>Chapter content is being prepared. Please check back later.</p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-full w-full">
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-amber-300">
            Chapter {chapter.number}: {chapter.title}
          </h1>
          <h2 className="text-xl italic text-amber-400">{chapter.subtitle}</h2>
        </div>

        <div className="bg-amber-900/30 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-amber-300">Summary</h3>
            {isSpeechSynthesisSupported && (
              <SpeechButton
                isSpeaking={isSpeaking && speakingVerseId === "summary"}
                onSpeakToggle={() => handleSpeak("summary", "translation", chapter.summary)}
                size="sm"
              />
            )}
          </div>
          <p className="text-amber-100">{chapter.summary}</p>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-amber-300">Key Verses</h3>

          {chapter.verses.map((verse) => (
            <div key={verse.number} className="border border-amber-800 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-amber-300">Verse {verse.number}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-amber-800/50 text-amber-200 px-2 py-1 rounded-full">Shloka</span>
                  {onAskAboutVerse && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs bg-amber-700 hover:bg-amber-600 text-white border-amber-600"
                      onClick={() => onAskAboutVerse(verse.number, verse.translation)}
                    >
                      Ask Chatbot
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                {/* Sanskrit shloka - NO speech button */}
                <div>
                  <p className="text-amber-100 font-medium">{verse.sanskrit}</p>
                </div>
                <p className="text-amber-400 italic text-sm">{verse.transliteration}</p>

                {/* Translation - WITH speech button */}
                <div className="pt-2 border-t border-amber-100 border-amber-800">
                  <div className="flex justify-between items-start">
                    <p className="text-amber-100">{verse.translation}</p>
                    {isSpeechSynthesisSupported && (
                      <SpeechButton
                        isSpeaking={isSpeaking && speakingVerseId === verse.number && speakingPart === "translation"}
                        onSpeakToggle={() => handleSpeak(verse.number, "translation", verse.translation)}
                        size="sm"
                        className="ml-2 mt-1 flex-shrink-0"
                      />
                    )}
                  </div>
                </div>

                {/* Explanation - WITH speech button */}
                <div className="pt-2 border-t border-amber-100 border-amber-800">
                  <div className="flex justify-between items-start">
                    <p className="text-sm text-amber-400">{verse.explanation}</p>
                    {isSpeechSynthesisSupported && (
                      <SpeechButton
                        isSpeaking={isSpeaking && speakingVerseId === verse.number && speakingPart === "explanation"}
                        onSpeakToggle={() => handleSpeak(verse.number, "explanation", verse.explanation)}
                        size="sm"
                        className="ml-2 mt-1 flex-shrink-0"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  )
}

// Loading skeleton for the chapter content
function ChapterSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-10 w-3/4 bg-amber-800/30" />
        <Skeleton className="h-6 w-1/2 bg-amber-800/30" />
      </div>

      <Skeleton className="h-32 w-full bg-amber-800/30 rounded-lg" />

      <div className="space-y-6">
        <Skeleton className="h-8 w-40 bg-amber-800/30" />

        {[1, 2, 3].map((i) => (
          <div key={i} className="border border-amber-800/30 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-32 bg-amber-800/30" />
              <Skeleton className="h-6 w-16 bg-amber-800/30 rounded-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-full bg-amber-800/30" />
              <Skeleton className="h-4 w-full bg-amber-800/30" />
              <Skeleton className="h-4 w-3/4 bg-amber-800/30" />

              <div className="pt-2 border-t border-amber-800/30">
                <Skeleton className="h-4 w-full bg-amber-800/30" />
                <Skeleton className="h-4 w-full bg-amber-800/30" />
                <Skeleton className="h-4 w-1/2 bg-amber-800/30" />
              </div>

              <div className="pt-2 border-t border-amber-800/30">
                <Skeleton className="h-4 w-full bg-amber-800/30" />
                <Skeleton className="h-4 w-full bg-amber-800/30" />
                <Skeleton className="h-4 w-full bg-amber-800/30" />
                <Skeleton className="h-4 w-3/4 bg-amber-800/30" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
