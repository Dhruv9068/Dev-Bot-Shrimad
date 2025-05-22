"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface SpeechSynthesisOptions {
  language?: string
  rate?: number
  pitch?: number
  volume?: number
  onStart?: () => void
  onEnd?: () => void
  onError?: (error: any) => void
}

// Language code mapping for speech synthesis
const languageToSpeechCode: Record<string, string> = {
  english: "en-US",
  spanish: "es-ES",
  french: "fr-FR",
  german: "de-DE",
  hindi: "hi-IN",
  arabic: "ar-SA",
  chinese: "zh-CN",
  russian: "ru-RU",
  portuguese: "pt-BR",
  japanese: "ja-JP",
  korean: "ko-KR",
  italian: "it-IT",
  bengali: "bn-IN",
  turkish: "tr-TR",
  dutch: "nl-NL",
  persian: "fa-IR",
  urdu: "ur-PK",
  vietnamese: "vi-VN",
  thai: "th-TH",
  tamil: "ta-IN",
  sanskrit: "sa-IN",
  telugu: "te-IN",
  marathi: "mr-IN",
  gujarati: "gu-IN",
  kannada: "kn-IN",
  malayalam: "ml-IN",
  punjabi: "pa-IN",
  polish: "pl-PL",
  greek: "el-GR",
  hebrew: "he-IL",
}

export function useSpeechSynthesis({
  language = "english",
  rate = 1,
  pitch = 1,
  volume = 1,
  onStart,
  onEnd,
  onError,
}: SpeechSynthesisOptions = {}) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const currentVoiceRef = useRef<SpeechSynthesisVoice | null>(null)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Check if speech synthesis is supported
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      setIsSupported(true)
    } else {
      console.warn("Speech synthesis is not supported in this browser.")
      setIsSupported(false)
    }
  }, [])

  // Get available voices
  useEffect(() => {
    if (!isSupported) return

    const getVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices()
      setVoices(availableVoices)
    }

    // Chrome loads voices asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = getVoices
    }

    getVoices()

    return () => {
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = null
      }
    }
  }, [isSupported])

  // Update current voice when language changes
  useEffect(() => {
    if (!isSupported || voices.length === 0) return

    // Get language code for the current language
    const langCode = languageToSpeechCode[language] || "en-US"

    // Try to find a voice for the selected language
    let matchingVoice = voices.find((voice) => voice.lang === langCode)

    // If no exact match, try to find a voice that starts with the language code
    if (!matchingVoice) {
      const langPrefix = langCode.split("-")[0]
      matchingVoice = voices.find((voice) => voice.lang.startsWith(langPrefix))
    }

    // If still no match, use the default voice
    if (!matchingVoice && voices.length > 0) {
      matchingVoice = voices[0]
    }

    currentVoiceRef.current = matchingVoice || null
  }, [isSupported, language, voices])

  // Speak text
  const speak = useCallback(
    (text: string) => {
      if (!isSupported) return

      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      // Create a new utterance
      const utterance = new SpeechSynthesisUtterance(text)

      // Set properties
      utterance.rate = rate
      utterance.pitch = pitch
      utterance.volume = volume

      // Get language code for the current language
      const langCode = languageToSpeechCode[language] || "en-US"
      utterance.lang = langCode

      // Set voice if available
      if (currentVoiceRef.current) {
        utterance.voice = currentVoiceRef.current
      }

      // Set event handlers
      utterance.onstart = () => {
        setIsSpeaking(true)
        setIsPaused(false)
        if (onStart) onStart()
      }

      utterance.onend = () => {
        setIsSpeaking(false)
        setIsPaused(false)
        if (onEnd) onEnd()
      }

      utterance.onerror = (event) => {
        console.error("Speech synthesis error", event)
        setIsSpeaking(false)
        setIsPaused(false)
        if (onError) onError(event)
      }

      // Store the utterance in ref for pause/resume
      utteranceRef.current = utterance

      // Start speaking
      window.speechSynthesis.speak(utterance)
    },
    [isSupported, language, onEnd, onError, onStart, pitch, rate, volume],
  )

  // Cancel speech
  const cancel = useCallback(() => {
    if (!isSupported) return

    window.speechSynthesis.cancel()
    setIsSpeaking(false)
    setIsPaused(false)
  }, [isSupported])

  // Pause speech
  const pause = useCallback(() => {
    if (!isSupported || !isSpeaking) return

    window.speechSynthesis.pause()
    setIsPaused(true)
  }, [isSupported, isSpeaking])

  // Resume speech
  const resume = useCallback(() => {
    if (!isSupported || !isPaused) return

    window.speechSynthesis.resume()
    setIsPaused(false)
  }, [isSupported, isPaused])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (isSupported) {
        window.speechSynthesis.cancel()
      }
    }
  }, [isSupported])

  return {
    speak,
    cancel,
    pause,
    resume,
    isSpeaking,
    isPaused,
    isSupported,
    voices,
  }
}
