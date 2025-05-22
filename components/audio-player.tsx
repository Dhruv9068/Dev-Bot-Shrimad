"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Volume2, VolumeX, SkipForward, SkipBack, Music } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Audio tracks with actual URLs
const audioTracks = [
  {
    title: "Om Shanti",
    description: "Sacred peace mantra",
    duration: 180, // Will be updated when audio loads
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/OmShanti%20song-3BYWzTRHd9DtcBEYxuw3eNRMjA3jAt.mp3",
  },
  {
    title: "Hare Krishna Theme",
    description: "Divine melody celebrating Lord Krishna",
    duration: 240,
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Hare%20krishna%20theme-sJxpZCaLYODmk0s6SBmzUEV8QRpIWR.mp3",
  },
  {
    title: "Ohm Shanti Music",
    description: "Peaceful meditation chant",
    duration: 240,
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ohm%20shanti%20music-tKnBtp37u7TECrDW3shYEt3XaX7qFx.mp3",
  },
  {
    title: "Geeta Saar",
    description: "Essence of Bhagavad Gita teachings",
    duration: 300,
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/geeta%20saar-dYC3kifLNdXZWC81qAaesOycPYRGHR.mp3",
  },
]

export function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [visualizer, setVisualizer] = useState<number[]>(Array(20).fill(0))

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const animationRef = useRef<number | null>(null)

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio()
    audioRef.current.volume = volume

    const audio = audioRef.current

    // Set up event listeners
    const updateTime = () => {
      if (audio) {
        setCurrentTime(audio.currentTime)
      }
    }

    const handleEnded = () => {
      // Play next track
      setCurrentTrack((prev) => (prev + 1) % audioTracks.length)
    }

    const handleLoadedMetadata = () => {
      if (audio) {
        setDuration(audio.duration)
        setIsLoading(false)
      }
    }

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("loadedmetadata", handleLoadedMetadata)

    // Load the first track
    loadTrack(currentTrack)

    // Cleanup
    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.pause()
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  // Load track when currentTrack changes
  useEffect(() => {
    loadTrack(currentTrack)
  }, [currentTrack])

  // Update audio visualizer
  useEffect(() => {
    if (isPlaying) {
      const updateVisualizer = () => {
        // Create a simple visualizer effect
        const newVisualizer = visualizer.map(() =>
          Math.min(1, Math.max(0.1, Math.random() * (isPlaying ? 0.8 : 0.1) + 0.2)),
        )
        setVisualizer(newVisualizer)
        animationRef.current = requestAnimationFrame(updateVisualizer)
      }

      animationRef.current = requestAnimationFrame(updateVisualizer)
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }
    }
  }, [isPlaying])

  const loadTrack = (index: number) => {
    if (audioRef.current) {
      setIsLoading(true)
      const track = audioTracks[index]
      audioRef.current.src = track.url
      audioRef.current.load()

      if (isPlaying) {
        audioRef.current
          .play()
          .then(() => setIsLoading(false))
          .catch((e) => {
            console.log("Audio play error:", e)
            setIsLoading(false)
          })
      } else {
        setIsLoading(false)
      }
    }
  }

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch((e) => console.log("Audio play error:", e))
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleVolumeChange = (newVolume: number[]) => {
    const vol = newVolume[0]
    setVolume(vol)
    if (audioRef.current) {
      audioRef.current.volume = vol
    }
    if (vol === 0) {
      setIsMuted(true)
    } else {
      setIsMuted(false)
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume
      } else {
        audioRef.current.volume = 0
      }
      setIsMuted(!isMuted)
    }
  }

  const changeTrack = (direction: "next" | "prev") => {
    if (direction === "next") {
      setCurrentTrack((prev) => (prev + 1) % audioTracks.length)
    } else {
      setCurrentTrack((prev) => (prev === 0 ? audioTracks.length - 1 : prev - 1))
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const track = audioTracks[currentTrack]

  return (
    <Card className="w-full bg-gradient-to-br from-amber-900/40 to-amber-950/60 border-amber-700/50 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-amber-300">
          <Music className="h-5 w-5" /> Sacred Audio
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 sm:space-y-4 p-2 sm:p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-amber-300 text-base sm:text-lg">{track.title}</h3>
            <p className="text-xs sm:text-sm text-amber-400/80">{track.description}</p>
          </div>
          {isLoading && (
            <div className="h-6 w-6 rounded-full border-2 border-amber-500 border-t-transparent animate-spin"></div>
          )}
        </div>

        {/* Audio visualizer */}
        <div className="flex items-end justify-between h-8 sm:h-12 gap-0.5 my-1 sm:my-2">
          {visualizer.map((height, i) => (
            <div
              key={i}
              className="w-full bg-gradient-to-t from-amber-500 to-amber-300 rounded-sm transition-all duration-100"
              style={{
                height: `${height * 100}%`,
                opacity: isPlaying ? 0.8 : 0.3,
              }}
            ></div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-1 text-amber-400 text-[10px] sm:text-xs">
          <span className="text-xs">{formatTime(currentTime)}</span>
          <span className="text-xs">{formatTime(duration || track.duration)}</span>
        </div>

        <Slider
          value={[currentTime]}
          max={duration || track.duration}
          step={1}
          className="mb-4"
          onValueChange={(value) => {
            if (audioRef.current) {
              audioRef.current.currentTime = value[0]
              setCurrentTime(value[0])
            }
          }}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-6 w-6 sm:h-auto sm:w-auto bg-amber-800/30 border-amber-700/50 hover:bg-amber-700/50"
              onClick={() => changeTrack("prev")}
            >
              <SkipBack className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-8 h-8 sm:w-12 sm:h-12 bg-amber-600 border-amber-500 hover:bg-amber-500 text-white"
              onClick={togglePlay}
              disabled={isLoading}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 sm:h-6 sm:w-6" />
              ) : (
                <Play className="h-4 w-4 sm:h-6 sm:w-6 ml-0.5" />
              )}
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-amber-800/30 border-amber-700/50 hover:bg-amber-700/50"
              onClick={() => changeTrack("next")}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-amber-400 hover:text-amber-300 hover:bg-transparent"
              onClick={toggleMute}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>

            <Slider
              value={[isMuted ? 0 : volume]}
              max={1}
              step={0.01}
              className="w-16 sm:w-24"
              onValueChange={handleVolumeChange}
            />
          </div>
        </div>

        {/* Track selection */}
        <div className="mt-2 sm:mt-4 pt-2 border-t border-amber-800/30">
          <p className="text-[10px] sm:text-xs text-amber-400/70 mb-1 sm:mb-2">Other Tracks:</p>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {audioTracks.map((t, i) => (
              <Button
                key={i}
                variant="ghost"
                size="sm"
                className={`text-[10px] sm:text-xs rounded-full px-2 sm:px-3 py-0.5 sm:py-1 h-auto ${
                  i === currentTrack
                    ? "bg-amber-600/30 text-amber-300 hover:bg-amber-600/40"
                    : "bg-transparent text-amber-400/70 hover:bg-amber-800/30"
                }`}
                onClick={() => setCurrentTrack(i)}
              >
                {t.title}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
