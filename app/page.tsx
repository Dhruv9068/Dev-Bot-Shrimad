"use client"

import { useState, useEffect, useRef } from "react"
import { SimplifiedBookViewer } from "@/components/simplified-book"
import { BookViewer2D } from "@/components/book-viewer-2d"
import { ChatInterface } from "@/components/chat-interface"
import { Button } from "@/components/ui/button"
import { SuggestedQuestions } from "@/components/suggested-questions"
import { WelcomeModal } from "@/components/welcome-modal"
import { AudioPlayer } from "@/components/audio-player"
import { Navbar } from "@/components/navbar"
import { GitaShop } from "@/components/gita-shop"
import { MovingShlokas } from "@/components/moving-shlokas"
import { BookOpen, MessageSquare, ArrowDown, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"
import { DailyWisdom } from "@/components/daily-wisdom"

export default function Home() {
  const [view, setView] = useState<"landing" | "2d-book" | "chat">("landing")
  const [loading, setLoading] = useState(true)
  const [showWelcome, setShowWelcome] = useState(true)
  const [activeSection, setActiveSection] = useState("home")
  const chatInputRef = useRef<HTMLInputElement>(null)
  const sendMessageRef = useRef<(message: string) => void>(null)
  const [verseQuestion, setVerseQuestion] = useState<string | null>(null)

  // Refs for each section
  const homeRef = useRef<HTMLDivElement>(null)
  const aboutRef = useRef<HTMLDivElement>(null)
  const chaptersRef = useRef<HTMLDivElement>(null)
  const dailyWisdomRef = useRef<HTMLDivElement>(null)
  const chatbotRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLDivElement>(null)
  const shopRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Simulate loading assets
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    // Check if user has visited before
    const hasVisited = localStorage.getItem("hasVisitedGitaApp")
    if (hasVisited) {
      setShowWelcome(false)
    } else {
      localStorage.setItem("hasVisitedGitaApp", "true")
    }

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100 // Offset to trigger slightly before reaching the section

      // Check which section is currently in view
      const sections = [
        { id: "home", ref: homeRef },
        { id: "about", ref: aboutRef },
        { id: "chapters", ref: chaptersRef },
        { id: "daily-wisdom", ref: dailyWisdomRef },
        { id: "chatbot", ref: chatbotRef },
        { id: "audio", ref: audioRef },
        { id: "shop", ref: shopRef },
      ]

      for (const section of sections.reverse()) {
        // Reverse to check from bottom to top
        if (section.ref.current && section.ref.current.offsetTop <= scrollPosition) {
          setActiveSection(section.id)
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSelectQuestion = (question: string) => {
    if (chatInputRef.current) {
      chatInputRef.current.value = question
      chatInputRef.current.focus()
    }
  }

  const handleSendMessage = (sendFn: (message: string) => void) => {
    sendMessageRef.current = sendFn
  }

  const sendMessage = (message: string) => {
    if (sendMessageRef.current) {
      sendMessageRef.current(message)
    }
  }

  const handleAskAboutVerse = (verseNumber: string, verseText: string) => {
    const question = `Please explain verse ${verseNumber} which says: "${verseText}"`
    setVerseQuestion(question)
    setView("chat")

    setTimeout(() => {
      if (sendMessageRef.current) {
        sendMessageRef.current(question)
      }
    }, 100)
  }

  const scrollToSection = (sectionId: string) => {
    const sectionRefs = {
      home: homeRef,
      about: aboutRef,
      chapters: chaptersRef,
      "daily-wisdom": dailyWisdomRef,
      chatbot: chatbotRef,
      audio: audioRef,
      shop: shopRef,
    }

    const ref = sectionRefs[sectionId as keyof typeof sectionRefs]
    if (ref && ref.current) {
      window.scrollTo({
        top: ref.current.offsetTop - 80, // Offset for navbar
        behavior: "smooth",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-amber-950 to-slate-900">
        <h1 className="text-4xl font-bold text-center text-amber-300 mb-8">Shrimad Bhagwat Gita</h1>
        <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-amber-400">Loading divine wisdom...</p>
      </div>
    )
  }

  if (view === "2d-book") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-950 to-slate-900 p-4 md:p-8">
        <div className="container mx-auto">
          <div className="h-[90vh] bg-amber-950/30 rounded-lg shadow-xl border border-amber-800/30 overflow-hidden">
            <BookViewer2D
              onClose={() => setView("landing")}
              onOpenChatbot={() => setView("chat")}
              onAskAboutVerse={handleAskAboutVerse}
            />
          </div>
        </div>
      </div>
    )
  }

  if (view === "chat") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-950 to-slate-900 p-4 md:p-8">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-2/3">
              <ChatInterface inputRef={chatInputRef} onSendMessage={handleSendMessage} />
              <SuggestedQuestions onSelectQuestion={handleSelectQuestion} sendMessage={sendMessage} />
              <div className="mt-4 flex justify-center">
                <Button onClick={() => setView("landing")} className="bg-amber-600 hover:bg-amber-500 text-white">
                  <BookOpen className="mr-2 h-4 w-4" /> Return to Home
                </Button>
              </div>
            </div>

            <div className="w-full lg:w-1/3 mt-6 lg:mt-0">
              <AudioPlayer />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-950 to-slate-900">
      {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} />}

      <Navbar activeSection={activeSection} onNavigate={scrollToSection} />

      {/* Hero Section with Moving Shlokas */}
      <section ref={homeRef} id="home" className="min-h-screen pt-24 relative overflow-hidden">
        {/* Animated background effect instead of image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-radial from-amber-900/30 via-amber-950/50 to-slate-900/90 z-10"></div>
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-amber-600/20"
                style={{
                  width: `${Math.random() * 20 + 5}px`,
                  height: `${Math.random() * 20 + 5}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                  animationDelay: `${Math.random() * 10}s`,
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Moving Shlokas */}
        <MovingShlokas />

        <div className="container mx-auto px-4 relative z-20 h-full flex flex-col">
          <div className="flex flex-col lg:flex-row items-center justify-between h-full py-12">
            <div className="w-full lg:w-1/2 text-center lg:text-left mb-8 lg:mb-0">
              <motion.h1
                className="text-5xl md:text-6xl lg:text-7xl font-bold text-amber-300 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                Shrimad Bhagwat Gita
              </motion.h1>
              <motion.p
                className="text-xl md:text-2xl text-amber-100 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                The divine song of spiritual wisdom and ultimate reality
              </motion.p>
              <motion.div
                className="flex flex-wrap justify-center lg:justify-start gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Button
                  onClick={() => setView("2d-book")}
                  className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-6 text-lg"
                  size="lg"
                >
                  <BookOpen className="mr-2 h-5 w-5" /> Read the Gita
                </Button>
                <Button
                  onClick={() => setView("chat")}
                  className="bg-amber-700 hover:bg-amber-600 text-white px-6 py-6 text-lg"
                  size="lg"
                >
                  <MessageSquare className="mr-2 h-5 w-5" /> Ask Shrimad
                </Button>
              </motion.div>
            </div>

            <div className="w-full lg:w-1/2 flex justify-center items-center">
              <div className="w-full max-w-md mx-auto">
                <SimplifiedBookViewer onOpenBook={() => setView("2d-book")} />
              </div>
            </div>
          </div>

          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <Button
              variant="ghost"
              className="text-amber-300 hover:text-amber-200 animate-bounce"
              onClick={() => scrollToSection("about")}
            >
              <ArrowDown className="h-8 w-8" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} id="about" className="py-20 bg-gradient-to-b from-amber-950/30 to-slate-900/30 relative">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-4xl font-bold text-center text-amber-300 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            About the Bhagavad Gita
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              className="bg-amber-950/50 p-6 rounded-lg shadow-lg border border-amber-800/30"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <h3 className="text-2xl font-semibold text-amber-300 mb-4">Divine Dialogue</h3>
              <p className="text-amber-100">
                The Bhagavad Gita, often referred to as the Gita, is a 700-verse Hindu scripture that is part of the
                Indian epic Mahabharata. It is a dialogue between Prince Arjuna and Lord Krishna, who serves as his
                charioteer and guide.
              </p>
            </motion.div>

            <motion.div
              className="bg-amber-950/50 p-6 rounded-lg shadow-lg border border-amber-800/30"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h3 className="text-2xl font-semibold text-amber-300 mb-4">Timeless Wisdom</h3>
              <p className="text-amber-100">
                Composed between the 5th and 2nd century BCE, the Gita synthesizes various Yogic and Vedantic
                philosophies. It presents a comprehensive worldview and path to spiritual liberation through various
                forms of Yoga, including Karma Yoga, Bhakti Yoga, and Jnana Yoga.
              </p>
            </motion.div>

            <motion.div
              className="bg-amber-950/50 p-6 rounded-lg shadow-lg border border-amber-800/30"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h3 className="text-2xl font-semibold text-amber-300 mb-4">Universal Message</h3>
              <p className="text-amber-100">
                The Gita's teachings transcend religious boundaries, offering insights on duty, righteousness, devotion,
                and self-realization. It has influenced countless thinkers, leaders, and spiritual seekers worldwide,
                including Mahatma Gandhi, who referred to it as his "spiritual dictionary."
              </p>
            </motion.div>
          </div>

          <div className="mt-12 text-center">
            <motion.p
              className="text-xl text-amber-200 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              "Whenever dharma declines and adharma prevails, I manifest myself. For the protection of the good, for the
              destruction of evil, and for the establishment of dharma, I am born in every age."
              <span className="block mt-2 text-amber-300 font-semibold">— Lord Krishna, Bhagavad Gita 4.7-8</span>
            </motion.p>
          </div>
        </div>
      </section>

      {/* Chapters Overview Section */}
      <section
        ref={chaptersRef}
        id="chapters"
        className="py-20 bg-gradient-to-b from-slate-900/30 to-amber-950/30 relative"
      >
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-4xl font-bold text-center text-amber-300 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            The 18 Chapters of Wisdom
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 18 }, (_, i) => i + 1).map((chapter) => (
              <motion.div
                key={chapter}
                className="bg-amber-950/50 p-6 rounded-lg shadow-lg border border-amber-800/30 hover:bg-amber-900/50 transition-colors cursor-pointer"
                onClick={() => {
                  setView("2d-book")
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.05 * chapter }}
              >
                <h3 className="text-xl font-semibold text-amber-300 mb-2">Chapter {chapter}</h3>
                <p className="text-amber-100 text-sm mb-2">
                  {chapter === 1 && "Arjuna Vishada Yoga (The Yoga of Arjuna's Grief)"}
                  {chapter === 2 && "Sankhya Yoga (The Yoga of Knowledge)"}
                  {chapter === 3 && "Karma Yoga (The Yoga of Action)"}
                  {chapter === 4 && "Jnana Yoga (The Yoga of Knowledge)"}
                  {chapter === 5 && "Karma Sanyasa Yoga (The Yoga of Renunciation)"}
                  {chapter === 6 && "Dhyana Yoga (The Yoga of Meditation)"}
                  {chapter === 7 && "Jnana Vijnana Yoga (The Yoga of Knowledge and Wisdom)"}
                  {chapter === 8 && "Aksara Brahma Yoga (The Yoga of the Imperishable Brahman)"}
                  {chapter === 9 && "Raja Vidya Yoga (The Yoga of Royal Knowledge)"}
                  {chapter === 10 && "Vibhuti Yoga (The Yoga of Divine Manifestations)"}
                  {chapter === 11 && "Vishvarupa Darshana Yoga (The Yoga of the Universal Form)"}
                  {chapter === 12 && "Bhakti Yoga (The Yoga of Devotion)"}
                  {chapter === 13 && "Kshetra Kshetrajna Vibhaga Yoga (The Yoga of the Field and its Knower)"}
                  {chapter === 14 && "Gunatraya Vibhaga Yoga (The Yoga of the Three Gunas)"}
                  {chapter === 15 && "Purushottama Yoga (The Yoga of the Supreme Person)"}
                  {chapter === 16 && "Daivasura Sampad Vibhaga Yoga (The Yoga of Divine and Demonic Qualities)"}
                  {chapter === 17 && "Shraddhatraya Vibhaga Yoga (The Yoga of the Three Types of Faith)"}
                  {chapter === 18 && "Moksha Sanyasa Yoga (The Yoga of Liberation through Renunciation)"}
                </p>
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-amber-400 hover:text-amber-300 p-0 h-auto"
                    onClick={(e) => {
                      e.stopPropagation()
                      setView("2d-book")
                    }}
                  >
                    Read Chapter <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Daily Wisdom Section */}
      <section
        ref={dailyWisdomRef}
        id="daily-wisdom"
        className="py-20 bg-gradient-to-b from-amber-950/30 to-slate-900/30 relative"
      >
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-4xl font-bold text-center text-amber-300 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Daily Wisdom from the Gita
          </motion.h2>

          <div className="max-w-3xl mx-auto">
            <DailyWisdom />
          </div>
        </div>
      </section>

      {/* Chatbot Section */}
      <section
        ref={chatbotRef}
        id="chatbot"
        className="py-20 bg-gradient-to-b from-slate-900/30 to-amber-950/30 relative"
      >
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-4xl font-bold text-center text-amber-300 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Ask Shrimad: Divine Guidance
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              className="order-2 lg:order-1"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-2xl font-semibold text-amber-300 mb-4">Divine Conversation</h3>
              <p className="text-amber-100 mb-6">
                Engage in a spiritual dialogue with our AI-powered Shrimad chatbot. Ask questions about the Bhagavad
                Gita's teachings, seek clarification on verses, or explore the profound wisdom of this sacred text.
              </p>
              <p className="text-amber-100 mb-6">
                Whether you're a scholar, a spiritual seeker, or simply curious about Hindu philosophy, our chatbot
                provides insightful responses based on the authentic teachings of the Gita.
              </p>
              <Button onClick={() => setView("chat")} className="bg-amber-600 hover:bg-amber-500 text-white" size="lg">
                <MessageSquare className="mr-2 h-5 w-5" /> Start Conversation
              </Button>
            </motion.div>

            <motion.div
              className="order-1 lg:order-2 bg-amber-950/50 p-6 rounded-lg shadow-lg border border-amber-800/30"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex flex-col space-y-4">
                <div className="bg-amber-900/50 p-4 rounded-lg self-start max-w-[80%]">
                  <p className="text-amber-100">What is the purpose of life according to the Bhagavad Gita?</p>
                </div>
                <div className="bg-amber-800/50 p-4 rounded-lg self-end max-w-[80%]">
                  <p className="text-amber-100">
                    According to the Bhagavad Gita, the purpose of life is to realize one's true self (Atman) and its
                    connection with the supreme consciousness (Brahman). This is achieved through selfless action (Karma
                    Yoga), devotion (Bhakti Yoga), and knowledge (Jnana Yoga).
                  </p>
                </div>
                <div className="bg-amber-900/50 p-4 rounded-lg self-start max-w-[80%]">
                  <p className="text-amber-100">How can I overcome fear and anxiety?</p>
                </div>
                <div className="bg-amber-800/50 p-4 rounded-lg self-end max-w-[80%]">
                  <p className="text-amber-100">
                    Lord Krishna teaches that fear and anxiety arise from attachment and the false identification with
                    the body. By understanding your eternal nature as soul, practicing meditation, and surrendering to
                    the divine will, you can transcend these emotions and find peace.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Audio Section */}
      <section ref={audioRef} id="audio" className="py-20 bg-gradient-to-b from-amber-950/30 to-slate-900/30 relative">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-4xl font-bold text-center text-amber-300 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Sacred Sounds & Mantras
          </motion.h2>

          <div className="w-full sm:w-[90%] md:w-[80%] lg:w-[70%] mx-auto px-2 sm:px-0">
            <motion.div
              className="bg-amber-950/50 p-3 sm:p-4 md:p-6 rounded-lg shadow-lg border border-amber-800/30"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-amber-100 mb-3 sm:mb-6 text-center text-sm sm:text-base">
                Immerse yourself in the divine vibrations of sacred mantras and chants from the Vedic tradition.
                Experience the transformative power of sound as you listen to these ancient recitations.
              </p>
              <div className="w-full sm:w-[80%] md:w-[70%] lg:w-[50%] mx-auto">
                <AudioPlayer />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Shop Section */}
      <section ref={shopRef} id="shop" className="py-20 bg-gradient-to-b from-slate-900/30 to-amber-950/30 relative">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-4xl font-bold text-center text-amber-300 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Sacred Texts: Purchase Your Copy
          </motion.h2>

          <GitaShop />
        </div>
      </section>

      {/* Footer Section */}
      <footer className="py-12 bg-amber-950 text-amber-300">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Shrimad Bhagwat Gita</h3>
              <p className="text-amber-200">
                Explore the timeless wisdom of the Bhagavad Gita through our interactive platform.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Button
                    variant="link"
                    className="text-amber-200 hover:text-amber-100 p-0 h-auto"
                    onClick={() => scrollToSection("home")}
                  >
                    Home
                  </Button>
                </li>
                <li>
                  <Button
                    variant="link"
                    className="text-amber-200 hover:text-amber-100 p-0 h-auto"
                    onClick={() => setView("2d-book")}
                  >
                    Read the Gita
                  </Button>
                </li>
                <li>
                  <Button
                    variant="link"
                    className="text-amber-200 hover:text-amber-100 p-0 h-auto"
                    onClick={() => setView("chat")}
                  >
                    Ask Shrimad
                  </Button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">About</h3>
              <p className="text-amber-200">
                This interactive Bhagavad Gita experience is designed to make the sacred text accessible to everyone,
                combining modern technology with ancient wisdom.
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-amber-800 text-center">
            <p className="text-amber-200">© {new Date().getFullYear()} Shrimad. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
