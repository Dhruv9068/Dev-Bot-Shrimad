"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface SpeechRecognitionOptions {
  language?: string
  continuous?: boolean
  interimResults?: boolean
  onResult?: (transcript: string) => void
  onEnd?: () => void
}

interface UseSpeechRecognitionReturn {
  isListening: boolean
  transcript: string
  startListening: () => void
  stopListening: () => void
  resetTranscript: () => void
  isSupported: boolean
}

// Language code mapping for speech recognition
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

// Create a hook for speech recognition
export function useSpeechRecognition({
  language = "english",
  continuous = false,
  interimResults = true,
  onResult,
  onEnd,
}: SpeechRecognitionOptions = {}): UseSpeechRecognitionReturn {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const recognitionRef = useRef<any>(null)
  const [isSupported, setIsSupported] = useState(false)
  const langCodeRef = useRef(languageToSpeechCode[language] || "en-US")

  // Check if speech recognition is supported
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition

    if (SpeechRecognition) {
      setIsSupported(true)
    } else {
      console.warn("Speech recognition is not supported in this browser.")
      setIsSupported(false)
    }
  }, [])

  // Update language code when language changes
  useEffect(() => {
    langCodeRef.current = languageToSpeechCode[language] || "en-US"
  }, [language])

  // Initialize speech recognition
  const initializeRecognition = useCallback(() => {
    if (!isSupported) return null

    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition

    const recognition = new SpeechRecognition()
    recognition.lang = langCodeRef.current
    recognition.continuous = continuous
    recognition.interimResults = interimResults

    recognition.onresult = (event: any) => {
      let currentTranscript = ""
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript
      }

      setTranscript(currentTranscript)
      if (onResult) onResult(currentTranscript)
    }

    recognition.onend = () => {
      if (continuous && isListening) {
        recognition.start()
      } else {
        setIsListening(false)
        if (onEnd) onEnd()
      }
    }

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error)
      setIsListening(false)
    }

    return recognition
  }, [continuous, interimResults, isListening, isSupported, onEnd, onResult])

  // Start listening
  const startListening = useCallback(() => {
    if (!isSupported) return

    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }

    recognitionRef.current = initializeRecognition()
    if (recognitionRef.current) {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }, [initializeRecognition, isSupported])

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }, [])

  // Reset transcript
  const resetTranscript = useCallback(() => {
    setTranscript("")
  }, [])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported,
  }
}
