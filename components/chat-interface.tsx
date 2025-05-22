"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, BookOpen, Info, Sparkles, User, AlertTriangle, Globe, Check, Volume2, Mic, MicOff } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { generateChatResponse, type Message } from "@/app/actions/chat-actions"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { languages } from "@/components/language-selector"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis"
import { useSpeechRecognition } from "@/hooks/use-speech-recognition"

// Language-specific prompts
const languagePrompts: Record<string, string> = {
  english: "Kindly give next all responses in English language.",
  spanish: "Por favor, proporciona todas las respuestas siguientes en español.",
  french: "Veuillez donner toutes les prochaines réponses en français.",
  german: "Bitte gib alle nächsten Antworten auf Deutsch.",
  hindi: "कृपया अगली सभी प्रतिक्रियाएँ हिंदी में दें।",
  arabic: "يرجى إعطاء جميع الردود التالية باللغة العربية.",
  chinese: "请用中文（普通话）回答接下来的所有问题。",
  russian: "Пожалуйста, дайте все следующие ответы на русском языке.",
  portuguese: "Por favor, forneça todas las próximas respuestas en portugués.",
  japanese: "次のすべての応答を日本語でお願いします。",
  korean: "다음 모든 응답을 한국어로 제공해 주세요.",
  italian: "Per favore, fornisci tutte le prossime risposte in italiano.",
  bengali: "অনুগ্রহ করে পরবর্তী সমস্ত উত্তর বাংলায় দিন।",
  turkish: "Lütfen sonraki tüm yanıtları Türkçe verin.",
  dutch: "Geef alle volgende antwoorden alstublieft in het Nederlands.",
  persian: "لطفاً تمام پاسخ‌های بعدی را به زبان فارسی ارائه دهید.",
  urdu: "براہ کرم اگلے تمام جوابات اردو میں دیں۔",
  vietnamese: "Vui lòng trả lời tất cả các câu tiếp theo bằng tiếng Việt.",
  thai: "กรุณาตอบคำถามทั้งหมดต่อไปเป็นภาษาไทย",
  tamil: "தயவுசெய்து அனைத்து எதிர்வினைகளையும் தமிழில் வழங்கவும்.",
  // Add more languages as needed
  sanskrit: "कृपया सर्वाणि उत्तराणि संस्कृतभाषायां प्रयच्छन्तु।",
  telugu: "దయచేసి తదుపరి ప్రతిస్పందనలన్నింటినీ తెలుగులో ఇవ్వండి.",
  marathi: "कृपया पुढील सर्व प्रतिसाद मराठीत द्या.",
  gujarati: "કૃપા કરીને બધા જવાબો ગુજરાતીમાં આપો.",
  kannada: "ದಯವಿಟ್ಟು ಮುಂದಿನ ಎಲ್ಲಾ ಪ್ರತಿಕ್ರಿಯೆಗಳನ್ನು ಕನ್ನಡದಲ್ಲಿ ನೀಡಿ.",
  malayalam: "ദയവായി അടുത്ത എല്ലാ പ്രതികരണങ്ങളും മലയാളത്തിൽ നൽകുക.",
  punjabi: "ਕਿਰਪਾ ਕਰਕੇ ਅਗਲੇ ਸਾਰੇ ਜਵਾਬ ਪੰਜਾਬੀ ਵਿੱਚ ਦਿਓ।",
  polish: "Proszę udzielić wszystkich następnych odpowiedzi w języku polskim.",
  greek: "Παρακαλώ δώστε όλες τις επόμενες απαντήσεις στα ελληνικά.",
  hebrew: "אנא תן את כל התשובות הבאות בעברית.",
}

// Fallback greeting responses
const greetings = [
  "Namaste! Welcome to the Bhagavad Gita chatbot. How may I assist you on your spiritual journey today?",
  "Om Namah Bhagavate Vasudevaya! I'm here to help you explore the divine wisdom of the Bhagavad Gita.",
  "Jai Shri Krishna! How can I help you understand the teachings of the Bhagavad Gita today?",
]

// Get suggestions based on input
const getSuggestions = (input: string): string[] => {
  if (!input || input.length < 3) return []

  const lowerInput = input.toLowerCase()
  const suggestions = []

  // Common concepts for suggestions
  const concepts = [
    "What is the main message of the Bhagavad Gita?",
    "Tell me about Lord Krishna",
    "What is Karma Yoga?",
    "Explain the concept of dharma",
    "What does the Gita say about meditation?",
    "What are the three gunas?",
    "How can I apply Gita's teachings in daily life?",
    "What is the Universal Form (Vishwaroop)?",
    "What is the significance of Chapter 11?",
    "How does one attain moksha according to the Gita?",
    "What does Krishna say about reincarnation?",
    "Explain the concept of Atman",
    "What is the meaning of Om?",
    "How should one deal with anger according to the Gita?",
  ]

  for (const concept of concepts) {
    if (concept.toLowerCase().includes(lowerInput) && !suggestions.includes(concept)) {
      suggestions.push(concept)
      if (suggestions.length >= 3) break
    }
  }

  return suggestions
}

// Add this function after the getSuggestions function
const formatMessage = (content: string): React.ReactNode => {
  // Split content by paragraphs
  const paragraphs = content.split("\n\n")

  if (paragraphs.length <= 1) {
    return content
  }

  return (
    <>
      {paragraphs.map((paragraph, idx) => {
        // Check if paragraph contains Sanskrit verse (typically in quotes or italics)
        const isSanskritVerse =
          (paragraph.startsWith('"') && paragraph.endsWith('"')) || paragraph.includes("॥") || paragraph.includes("।")

        // Check if paragraph is a list item
        const isListItem = paragraph.trim().startsWith("- ") || paragraph.trim().startsWith("* ")

        if (isSanskritVerse) {
          return (
            <div key={idx} className="my-2 px-3 py-2 bg-amber-800/30 border-l-2 border-amber-500 italic">
              {paragraph}
            </div>
          )
        } else if (isListItem) {
          return (
            <div key={idx} className="my-1">
              {paragraph}
            </div>
          )
        } else {
          return (
            <p key={idx} className="my-2">
              {paragraph}
            </p>
          )
        }
      })}
    </>
  )
}

interface ChatInterfaceProps {
  inputRef?: React.RefObject<HTMLInputElement>
  onSendMessage?: (sendFn: (message: string) => void) => void
}

export function ChatInterface({ inputRef, onSendMessage }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: greetings[Math.floor(Math.random() * greetings.length)] },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [usingFallback, setUsingFallback] = useState(false)
  const [showFallbackAlert, setShowFallbackAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("Using simplified knowledge base. Responses may be limited.")
  const [language, setLanguage] = useState("english")
  const [languageChanged, setLanguageChanged] = useState(false)
  const [showLanguageDialog, setShowLanguageDialog] = useState(false)
  const [pendingLanguage, setPendingLanguage] = useState<string | null>(null)
  const [showLanguageNotification, setShowLanguageNotification] = useState(false)
  const [recentLanguages, setRecentLanguages] = useState<string[]>([])
  const [autoSpeak, setAutoSpeak] = useState(false)
  const messagesEndRef = useRef(null)
  const localInputRef = useRef<HTMLInputElement>(null)
  const actualInputRef = inputRef || localInputRef
  const lastResponseRef = useRef<string>("")
  const transcriptRef = useRef<string>("")

  // Initialize speech synthesis with the current language
  const {
    speak,
    cancel,
    isSpeaking,
    isSupported: isSpeechSynthesisSupported,
  } = useSpeechSynthesis({
    language: language,
    rate: 1,
    pitch: 1,
  })

  // Initialize speech recognition with the current language
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported: isSpeechRecognitionSupported,
  } = useSpeechRecognition({
    language: language,
    onResult: (result) => {
      transcriptRef.current = result
      setInput(result)
    },
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Load saved language preference and recent languages from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem("preferredLanguage")
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }

    const savedRecentLanguages = localStorage.getItem("recentLanguages")
    if (savedRecentLanguages) {
      try {
        const parsedRecentLanguages = JSON.parse(savedRecentLanguages)
        if (Array.isArray(parsedRecentLanguages)) {
          setRecentLanguages(parsedRecentLanguages)
        }
      } catch (error) {
        console.error("Error parsing recent languages:", error)
      }
    }

    // Load auto-speak preference
    const savedAutoSpeak = localStorage.getItem("autoSpeak")
    if (savedAutoSpeak) {
      setAutoSpeak(savedAutoSpeak === "true")
    }
  }, [])

  // Update suggestions when input changes
  useEffect(() => {
    if (input.length >= 3) {
      const newSuggestions = getSuggestions(input)
      setSuggestions(newSuggestions)
      setShowSuggestions(newSuggestions.length > 0)
    } else {
      setShowSuggestions(false)
    }
  }, [input])

  // Expose sendMessage function to parent component
  useEffect(() => {
    if (onSendMessage) {
      onSendMessage(sendMessage)
    }
  }, [onSendMessage])

  // Hide fallback alert after 10 seconds
  useEffect(() => {
    if (showFallbackAlert) {
      const timer = setTimeout(() => {
        setShowFallbackAlert(false)
      }, 10000)
      return () => clearTimeout(timer)
    }
  }, [showFallbackAlert])

  // Handle language change
  useEffect(() => {
    if (languageChanged) {
      // Use the language-specific prompt if available, otherwise use a generic one
      const prompt =
        languagePrompts[language] || `Please continue our conversation in ${language} language from now on.`
      sendMessage(prompt)
      setLanguageChanged(false)

      // Show language notification
      setShowLanguageNotification(true)
      setTimeout(() => {
        setShowLanguageNotification(false)
      }, 3000)
    }
  }, [languageChanged])

  // Auto-detect browser language on first load
  useEffect(() => {
    // Only run this if no language is set yet
    if (!localStorage.getItem("preferredLanguage") && navigator.language) {
      const browserLang = navigator.language.split("-")[0].toLowerCase()

      // Map browser language codes to our language values
      const langMap: Record<string, string> = {
        en: "english",
        es: "spanish",
        fr: "french",
        de: "german",
        hi: "hindi",
        ar: "arabic",
        zh: "chinese",
        ru: "russian",
        pt: "portuguese",
        ja: "japanese",
        ko: "korean",
        it: "italian",
        bn: "bengali",
        tr: "turkish",
        nl: "dutch",
        fa: "persian",
        ur: "urdu",
        vi: "vietnamese",
        th: "thai",
        ta: "tamil",
        // Add more mappings as needed
      }

      if (langMap[browserLang] && langMap[browserLang] !== language) {
        setLanguage(langMap[browserLang])
        localStorage.setItem("preferredLanguage", langMap[browserLang])
      }
    }
  }, [])

  // Auto-speak new assistant messages if enabled
  useEffect(() => {
    const lastMessage = messages[messages.length - 1]

    if (
      autoSpeak &&
      lastMessage &&
      lastMessage.role === "assistant" &&
      lastMessage.content !== lastResponseRef.current
    ) {
      lastResponseRef.current = lastMessage.content
      speak(lastMessage.content)
    }
  }, [messages, autoSpeak, speak])

  const handleSend = async () => {
    if (!input.trim() || isTyping) return

    const userMessage = input.trim()

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])

    // Clear input and show typing indicator
    setInput("")
    setIsTyping(true)
    setShowSuggestions(false)

    try {
      // Create a copy of messages with the new user message for the API call
      const updatedMessages = [...messages, { role: "user", content: userMessage }]

      // Call the API through our server action
      const { content, isApiResponse } = await generateChatResponse(updatedMessages, language)

      // Add the response to the messages
      setMessages((prev) => [...prev, { role: "assistant", content }])

      // Update fallback status
      if (!isApiResponse && !usingFallback) {
        setUsingFallback(true)
        setShowFallbackAlert(true)
        setAlertMessage("Using simplified knowledge base. Responses may be limited.")
      }
    } catch (error) {
      console.error("Error getting response:", error)
      setUsingFallback(true)
      setShowFallbackAlert(true)

      // Check if it's a data policy error
      if (error.toString().includes("data policy")) {
        setAlertMessage("API data policy issue. Using simplified responses.")
      } else {
        setAlertMessage("Using simplified knowledge base. Responses may be limited.")
      }

      // Use a generic fallback response if everything fails
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I apologize, but I'm having trouble connecting to my knowledge base. Please try again in a moment.",
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  // Function to send a message programmatically
  const sendMessage = useCallback(
    (message: string) => {
      if (isTyping) return

      setInput(message)
      // Use setTimeout to ensure the input is set before sending
      setTimeout(() => {
        // Add user message
        setMessages((prev) => [...prev, { role: "user", content: message }])

        // Clear input and show typing indicator
        setInput("")
        setIsTyping(true)
        setShowSuggestions(false)

        // Call the API
        const updatedMessages = [...messages, { role: "user", content: message }]

        generateChatResponse(updatedMessages, language)
          .then(({ content, isApiResponse }) => {
            setMessages((prev) => [...prev, { role: "assistant", content }])

            // Update fallback status
            if (!isApiResponse && !usingFallback) {
              setUsingFallback(true)
              setShowFallbackAlert(true)
              setAlertMessage("Using simplified knowledge base. Responses may be limited.")
            }
          })
          .catch((error) => {
            console.error("Error getting response:", error)
            setUsingFallback(true)
            setShowFallbackAlert(true)

            // Check if it's a data policy error
            if (error.toString().includes("data policy")) {
              setAlertMessage("API data policy issue. Using simplified responses.")
            } else {
              setAlertMessage("Using simplified knowledge base. Responses may be limited.")
            }

            // Use a generic fallback response if everything fails
            setMessages((prev) => [
              ...prev,
              {
                role: "assistant",
                content:
                  "I apologize, but I'm having trouble connecting to my knowledge base. Please try again in a moment.",
              },
            ])
          })
          .finally(() => {
            setIsTyping(false)
          })
      }, 10)
    },
    [isTyping, language, messages, usingFallback],
  )

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
    setShowSuggestions(false)
    actualInputRef.current?.focus()
  }

  const confirmLanguageChange = useCallback(() => {
    if (pendingLanguage) {
      // Update language
      setLanguage(pendingLanguage)
      localStorage.setItem("preferredLanguage", pendingLanguage)
      setLanguageChanged(true)

      // Update recent languages
      const updatedRecentLanguages = [
        pendingLanguage,
        ...recentLanguages.filter((lang) => lang !== pendingLanguage).slice(0, 4),
      ]
      setRecentLanguages(updatedRecentLanguages)
      localStorage.setItem("recentLanguages", JSON.stringify(updatedRecentLanguages))

      setPendingLanguage(null)
    }
    setShowLanguageDialog(false)
  }, [pendingLanguage, recentLanguages])

  const cancelLanguageChange = () => {
    setPendingLanguage(null)
    setShowLanguageDialog(false)
  }

  // Get the current language label
  const getCurrentLanguageLabel = () => {
    const currentLang = languages.find((lang) => lang.value === language)
    return currentLang ? currentLang.label : "English"
  }

  // Get the pending language label
  const getPendingLanguageLabel = () => {
    if (!pendingLanguage) return "English"
    const pendingLang = languages.find((lang) => lang.value === pendingLanguage)
    return pendingLang ? pendingLang.label : "English"
  }

  // Toggle auto-speak
  const toggleAutoSpeak = useCallback(() => {
    const newValue = !autoSpeak
    setAutoSpeak(newValue)
    localStorage.setItem("autoSpeak", newValue.toString())

    // If turning off, cancel any ongoing speech
    if (!newValue && isSpeaking) {
      cancel()
    }
  }, [autoSpeak, cancel, isSpeaking])

  // Handle speech for a specific message
  const handleSpeakMessage = useCallback(
    (content: string) => {
      if (isSpeaking) {
        cancel()
      } else {
        speak(content)
      }
    },
    [cancel, isSpeaking, speak],
  )

  // Handle speech recognition
  const handleSpeechRecognition = useCallback(() => {
    if (isListening) {
      stopListening()
    } else {
      resetTranscript()
      startListening()
    }
  }, [isListening, resetTranscript, startListening, stopListening])

  return (
    <>
      <Card className="w-full max-w-3xl mx-auto bg-gradient-to-br from-amber-950 to-amber-900/80 border-amber-800/50 shadow-xl rounded-xl overflow-hidden">
        <CardHeader className="flex flex-col space-y-2 bg-gradient-to-r from-amber-900 to-amber-800 rounded-t-lg border-b border-amber-700/50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-center text-amber-300 flex items-center gap-2">
              <BookOpen className="h-5 w-5" /> Bhagavad Gita Wisdom
            </CardTitle>
            <div className="flex items-center gap-2">
              {/* Using Select component for language selection */}
              <Select
                value={language}
                onValueChange={(value) => {
                  if (value !== language) {
                    setPendingLanguage(value)
                    setShowLanguageDialog(true)
                  }
                }}
              >
                <SelectTrigger className="w-[180px] bg-amber-800/50 border-amber-700/50 hover:bg-amber-700 text-amber-300">
                  <div className="flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    <SelectValue placeholder="Select language" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-amber-950 border-amber-800 max-h-[300px] overflow-y-auto z-50">
                  {/* Recent languages section */}
                  {recentLanguages.length > 0 && (
                    <SelectGroup>
                      <SelectLabel className="text-amber-500">Recent</SelectLabel>
                      {recentLanguages.map((langValue) => {
                        const lang = languages.find((l) => l.value === langValue)
                        if (!lang) return null
                        return (
                          <SelectItem
                            key={`recent-${lang.value}`}
                            value={lang.value}
                            className="text-amber-200 hover:bg-amber-800 hover:text-amber-100 cursor-pointer flex items-center"
                          >
                            {lang.value === language && <Check className="h-4 w-4 mr-2 text-amber-400" />}
                            {lang.label}
                          </SelectItem>
                        )
                      })}
                    </SelectGroup>
                  )}

                  {/* All languages */}
                  <SelectGroup>
                    <SelectLabel className="text-amber-500">All Languages</SelectLabel>
                    {languages.map((lang) => (
                      <SelectItem
                        key={lang.value}
                        value={lang.value}
                        className="text-amber-200 hover:bg-amber-800 hover:text-amber-100 cursor-pointer flex items-center"
                      >
                        {lang.value === language && <Check className="h-4 w-4 mr-2 text-amber-400" />}
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              {/* Auto-speak toggle */}
              {isSpeechSynthesisSupported && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className={`rounded-full border-amber-700 ${
                          autoSpeak ? "bg-amber-600 text-white" : "bg-amber-800/50 text-amber-300"
                        }`}
                        onClick={toggleAutoSpeak}
                      >
                        <Volume2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-amber-950 text-amber-300 border-amber-700">
                      {autoSpeak ? "Disable auto-speak" : "Enable auto-speak"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full border-amber-700 bg-amber-800/50 hover:bg-amber-700/70"
                    >
                      <Info className="h-4 w-4 text-amber-300" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-amber-950 text-amber-300 border-amber-700">
                    Ask questions about the Bhagavad Gita's teachings
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Language notification */}
          {showLanguageNotification && (
            <Alert className="bg-amber-700/40 border-amber-600/50 py-2 animate-fadeIn">
              <Check className="h-4 w-4 text-amber-300" />
              <AlertDescription className="text-xs text-amber-200">
                Language changed to {getCurrentLanguageLabel()}
              </AlertDescription>
            </Alert>
          )}

          {/* Fallback Alert */}
          {showFallbackAlert && (
            <Alert className="bg-amber-800/30 border-amber-700/50 py-2">
              <AlertTriangle className="h-4 w-4 text-amber-300" />
              <AlertDescription className="text-xs text-amber-300">{alertMessage}</AlertDescription>
            </Alert>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[55vh] px-4 py-2">
            {messages.map((message, index) => (
              <div key={index} className={`flex mb-6 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                {message.role === "assistant" && (
                  <div className="flex-shrink-0 mr-3">
                    <Avatar className="h-9 w-9 bg-gradient-to-br from-amber-600 to-amber-700 border-2 border-amber-500/30">
                      <Sparkles className="h-4 w-4 text-amber-200" />
                    </Avatar>
                  </div>
                )}
                <div
                  className={`px-5 py-3 rounded-lg max-w-[85%] ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-tr-none shadow-md"
                      : "bg-gradient-to-r from-amber-800/70 to-amber-900/70 text-amber-100 rounded-tl-none shadow-md border border-amber-700/30"
                  }`}
                >
                  {formatMessage(message.content)}

                  {/* Add speech button for assistant messages */}
                  {message.role === "assistant" && isSpeechSynthesisSupported && (
                    <div className="mt-2 flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        className={`rounded-full ${
                          isSpeaking && lastResponseRef.current === message.content
                            ? "bg-amber-600 text-white border-amber-500"
                            : "bg-amber-800/30 text-amber-300 border-amber-700/50"
                        } hover:bg-amber-700 hover:text-amber-100 opacity-70 hover:opacity-100`}
                        onClick={() => handleSpeakMessage(message.content)}
                      >
                        <Volume2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
                {message.role === "user" && (
                  <div className="flex-shrink-0 ml-3">
                    <Avatar className="h-9 w-9 bg-gradient-to-br from-amber-500 to-amber-600 border-2 border-amber-400/30">
                      <User className="h-4 w-4 text-white" />
                    </Avatar>
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex mb-4 justify-start">
                <div className="flex-shrink-0 mr-2">
                  <Avatar className="h-8 w-8 bg-gradient-to-br from-amber-600 to-amber-700 border-2 border-amber-500/30">
                    <Sparkles className="h-4 w-4 text-amber-200" />
                  </Avatar>
                </div>
                <div className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-800/70 to-amber-900/70 text-amber-100 rounded-tl-none shadow-md border border-amber-700/30">
                  <span className="inline-block w-2 h-2 bg-amber-400 rounded-full animate-pulse mr-1"></span>
                  <span
                    className="inline-block w-2 h-2 bg-amber-400 rounded-full animate-pulse mr-1"
                    style={{ animationDelay: "0.2s" }}
                  ></span>
                  <span
                    className="inline-block w-2 h-2 bg-amber-400 rounded-full animate-pulse"
                    style={{ animationDelay: "0.4s" }}
                  ></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex flex-col p-4 border-t border-amber-800/30 bg-gradient-to-b from-amber-900/50 to-amber-950/80">
          {/* Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="w-full mb-2 flex flex-wrap gap-1">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs bg-amber-800/30 text-amber-300 border-amber-700/50 hover:bg-amber-700/50"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          )}

          <div className="flex w-full space-x-2 relative">
            <Input
              ref={actualInputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? "Listening..." : "Ask about the Bhagavad Gita..."}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              className={`bg-amber-900/20 border-amber-700/50 focus:border-amber-600 focus:ring-amber-500/30 text-amber-100 placeholder:text-amber-400/70 ${
                isListening ? "border-amber-500 ring-2 ring-amber-500/30" : ""
              }`}
              disabled={isTyping}
            />

            {/* Speech-to-text button */}
            {isSpeechRecognitionSupported && (
              <Button
                type="button"
                variant={isListening ? "default" : "outline"}
                className={`rounded-full ${
                  isListening
                    ? "bg-amber-600 hover:bg-amber-700 text-white animate-pulse"
                    : "bg-amber-800/30 border-amber-700/50 hover:bg-amber-700/50 text-amber-300"
                }`}
                onClick={handleSpeechRecognition}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            )}

            <Button
              onClick={handleSend}
              className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white"
              disabled={isTyping || !input.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Language Change Confirmation Dialog */}
      <Dialog open={showLanguageDialog} onOpenChange={setShowLanguageDialog}>
        <DialogContent className="bg-amber-950 border-amber-800 text-amber-100">
          <DialogHeader>
            <DialogTitle className="text-amber-300">Change Language</DialogTitle>
            <DialogDescription className="text-amber-200">
              Would you like to change the conversation language to {getPendingLanguageLabel()}?
            </DialogDescription>
          </DialogHeader>
          <div className="bg-amber-900/30 p-3 rounded-md border border-amber-800/50 my-2">
            <p className="text-amber-200 text-sm italic">{pendingLanguage && languagePrompts[pendingLanguage]}</p>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={cancelLanguageChange}
              className="border-amber-700 text-amber-300 hover:bg-amber-800 hover:text-amber-200"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmLanguageChange}
              className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white"
            >
              Change to {getPendingLanguageLabel()}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
