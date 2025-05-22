"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Share2, BookmarkPlus, RefreshCw, Calendar } from "lucide-react"
import { motion } from "framer-motion"

// Type for a verse
type Verse = {
  number: string
  sanskrit: string
  transliteration: string
  translation: string
  application: string
}

export function DailyWisdom() {
  const [verse, setVerse] = useState<Verse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [language, setLanguage] = useState("english")

  // Function to get a random verse
  const fetchRandomVerse = async () => {
    setLoading(true)
    setError(null)

    try {
      // Get a random chapter between 1 and 18
      const randomChapter = Math.floor(Math.random() * 18) + 1

      // Fetch the chapter data
      const response = await fetch(`/data/chapters/chapter-${randomChapter}.json`)

      if (!response.ok) {
        throw new Error(`Failed to load chapter ${randomChapter}`)
      }

      const chapterData = await response.json()

      // Get a random verse from the chapter
      const verses = chapterData.verses
      const randomVerseIndex = Math.floor(Math.random() * verses.length)
      const randomVerse = verses[randomVerseIndex]

      // Add a practical application field if it doesn't exist
      if (!randomVerse.application) {
        randomVerse.application = `This verse encourages us to ${
          randomChapter % 3 === 0
            ? "practice detachment from the fruits of our actions while performing our duties with dedication."
            : randomChapter % 3 === 1
              ? "cultivate self-knowledge and understand our true spiritual nature beyond the temporary physical body."
              : "develop devotion to the Divine and align our consciousness with higher spiritual principles."
        }`
      }

      setVerse(randomVerse)
    } catch (err) {
      console.error("Error fetching random verse:", err)
      setError("Failed to load daily wisdom. Please try again.")

      // Set a fallback verse
      setVerse({
        number: "2.47",
        sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
        transliteration:
          "karmaṇy-evādhikāras te mā phaleṣhu kadāchana\nmā karma-phala-hetur bhūr mā te saṅgo 'stv akarmaṇi",
        translation:
          "You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions. Never consider yourself to be the cause of the results of your activities, nor be attached to inaction.",
        application:
          "This verse teaches us to focus on our duties without being attached to the results. By performing actions with detachment, we can find peace and fulfillment in the present moment rather than anxiously fixating on outcomes.",
      })
    } finally {
      setLoading(false)
    }
  }

  // Fetch a random verse on component mount
  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem("preferredLanguage")
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }

    fetchRandomVerse()

    // Check if we should get a new verse today
    const lastVerseDate = localStorage.getItem("lastVerseDate")
    const today = new Date().toDateString()

    if (lastVerseDate !== today) {
      fetchRandomVerse()
      localStorage.setItem("lastVerseDate", today)
    }
  }, [])

  // Handle share functionality
  const handleShare = () => {
    if (!verse) return

    const shareText = `Daily Wisdom from Bhagavad Gita (Verse ${verse.number}):

"${verse.translation}"

${verse.application}`

    if (navigator.share) {
      navigator
        .share({
          title: `Bhagavad Gita - Verse ${verse.number}`,
          text: shareText,
        })
        .catch((err) => console.error("Error sharing:", err))
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    }
  }

  // Handle bookmark functionality
  const handleBookmark = () => {
    if (!verse) return

    // Get existing bookmarks
    const bookmarksJSON = localStorage.getItem("gitaBookmarks")
    const bookmarks = bookmarksJSON ? JSON.parse(bookmarksJSON) : []

    // Check if already bookmarked
    const isAlreadyBookmarked = bookmarks.some((b: Verse) => b.number === verse.number)

    if (!isAlreadyBookmarked) {
      // Add to bookmarks
      bookmarks.push(verse)
      localStorage.setItem("gitaBookmarks", JSON.stringify(bookmarks))

      // Show confirmation (in a real app, you'd use a toast notification)
      alert(`Verse ${verse.number} has been bookmarked!`)
    } else {
      alert(`Verse ${verse.number} is already in your bookmarks.`)
    }
  }

  // Get title based on language
  const getLocalizedTitle = () => {
    switch (language) {
      case "hindi":
        return "दैनिक ज्ञान"
      case "sanskrit":
        return "दैनिकं ज्ञानम्"
      case "spanish":
        return "Sabiduría Diaria"
      case "french":
        return "Sagesse Quotidienne"
      case "german":
        return "Tägliche Weisheit"
      case "chinese":
        return "每日智慧"
      case "japanese":
        return "日々の知恵"
      case "russian":
        return "Ежедневная Мудрость"
      case "arabic":
        return "الحكمة اليومية"
      case "portuguese":
        return "Sabedoria Diária"
      default:
        return "Daily Wisdom"
    }
  }

  if (loading) {
    return <DailyWisdomSkeleton />
  }

  if (error) {
    return (
      <Card className="w-full bg-amber-950/50 border-amber-800/50 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-amber-300 flex items-center gap-2">
            <Calendar className="h-5 w-5" /> {getLocalizedTitle()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-amber-200">{error}</p>
          <Button
            onClick={fetchRandomVerse}
            variant="outline"
            className="mt-4 text-amber-300 border-amber-700 hover:bg-amber-900/50"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!verse) {
    return null
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="w-full bg-gradient-to-br from-amber-950 to-amber-900/80 border-amber-800/50 shadow-lg overflow-hidden">
        <CardHeader className="pb-2 bg-gradient-to-r from-amber-900 to-amber-800 border-b border-amber-700/50">
          <CardTitle className="text-amber-300 flex items-center gap-2">
            <Calendar className="h-5 w-5" /> {getLocalizedTitle()}
          </CardTitle>
          <CardDescription className="text-amber-200">
            Verse {verse.number} • {new Date().toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="bg-amber-900/30 p-4 rounded-lg border-l-2 border-amber-600">
              <p className="text-amber-100 font-medium">{verse.sanskrit}</p>
              <p className="text-amber-400 italic text-sm mt-2">{verse.transliteration}</p>
            </div>

            <div className="bg-amber-950/50 p-4 rounded-lg">
              <h4 className="text-amber-300 font-semibold mb-2">
                {language === "hindi"
                  ? "अनुवाद"
                  : language === "sanskrit"
                    ? "अनुवादः"
                    : language === "spanish"
                      ? "Traducción"
                      : language === "french"
                        ? "Traduction"
                        : language === "german"
                          ? "Übersetzung"
                          : language === "chinese"
                            ? "翻译"
                            : language === "japanese"
                              ? "翻訳"
                              : language === "russian"
                                ? "Перевод"
                                : language === "arabic"
                                  ? "ترجمة"
                                  : language === "portuguese"
                                    ? "Tradução"
                                    : "Translation"}
              </h4>
              <p className="text-amber-100">{verse.translation}</p>
            </div>

            <div className="bg-amber-900/20 p-4 rounded-lg">
              <h4 className="text-amber-300 font-semibold mb-2">
                {language === "hindi"
                  ? "व्यावहारिक अनुप्रयोग"
                  : language === "sanskrit"
                    ? "व्यावहारिकः उपयोगः"
                    : language === "spanish"
                      ? "Aplicación Práctica"
                      : language === "french"
                        ? "Application Pratique"
                        : language === "german"
                          ? "Praktische Anwendung"
                          : language === "chinese"
                            ? "实际应用"
                            : language === "japanese"
                              ? "実践的応用"
                              : language === "russian"
                                ? "Практическое Применение"
                                : language === "arabic"
                                  ? "التطبيق العملي"
                                  : language === "portuguese"
                                    ? "Aplicação Prática"
                                    : "Practical Application"}
              </h4>
              <p className="text-amber-100">{verse.application}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t border-amber-800/30 bg-amber-900/30 px-6 py-4">
          <Button
            variant="outline"
            size="sm"
            className="text-amber-300 border-amber-700 hover:bg-amber-800/50"
            onClick={fetchRandomVerse}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            {language === "hindi"
              ? "नया श्लोक"
              : language === "sanskrit"
                ? "नवः श्लोकः"
                : language === "spanish"
                  ? "Nuevo Verso"
                  : language === "french"
                    ? "Nouveau Verset"
                    : language === "german"
                      ? "Neuer Vers"
                      : language === "chinese"
                        ? "新诗句"
                        : language === "japanese"
                          ? "新しい詩"
                          : language === "russian"
                            ? "Новый Стих"
                            : language === "arabic"
                              ? "آية جديدة"
                              : language === "portuguese"
                                ? "Novo Verso"
                                : "New Verse"}
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-amber-300 border-amber-700 hover:bg-amber-800/50"
              onClick={handleBookmark}
            >
              <BookmarkPlus className="mr-2 h-4 w-4" />
              {language === "hindi"
                ? "सहेजें"
                : language === "sanskrit"
                  ? "संरक्षयतु"
                  : language === "spanish"
                    ? "Guardar"
                    : language === "french"
                      ? "Enregistrer"
                      : language === "german"
                        ? "Speichern"
                        : language === "chinese"
                          ? "保存"
                          : language === "japanese"
                            ? "保存"
                            : language === "russian"
                              ? "Сохранить"
                              : language === "arabic"
                                ? "حفظ"
                                : language === "portuguese"
                                  ? "Salvar"
                                  : "Save"}
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="text-amber-300 border-amber-700 hover:bg-amber-800/50"
              onClick={handleShare}
            >
              <Share2 className="mr-2 h-4 w-4" />
              {copied
                ? language === "hindi"
                  ? "कॉपी किया गया!"
                  : language === "sanskrit"
                    ? "प्रतिलिपिः कृता!"
                    : language === "spanish"
                      ? "¡Copiado!"
                      : language === "french"
                        ? "Copié !"
                        : language === "german"
                          ? "Kopiert!"
                          : language === "chinese"
                            ? "已复制！"
                            : language === "japanese"
                              ? "コピーしました！"
                              : language === "russian"
                                ? "Скопировано!"
                                : language === "arabic"
                                  ? "تم النسخ!"
                                  : language === "portuguese"
                                    ? "Copiado!"
                                    : "Copied!"
                : language === "hindi"
                  ? "साझा करें"
                  : language === "sanskrit"
                    ? "विभजतु"
                    : language === "spanish"
                      ? "Compartir"
                      : language === "french"
                        ? "Partager"
                        : language === "german"
                          ? "Teilen"
                          : language === "chinese"
                            ? "分享"
                            : language === "japanese"
                              ? "共有"
                              : language === "russian"
                                ? "Поделиться"
                                : language === "arabic"
                                  ? "مشاركة"
                                  : language === "portuguese"
                                    ? "Compartilhar"
                                    : "Share"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

// Loading skeleton for the daily wisdom component
function DailyWisdomSkeleton() {
  return (
    <Card className="w-full bg-amber-950/50 border-amber-800/50 shadow-lg">
      <CardHeader className="pb-2">
        <Skeleton className="h-6 w-40 bg-amber-800/30" />
        <Skeleton className="h-4 w-32 bg-amber-800/30" />
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <Skeleton className="h-24 w-full bg-amber-800/30 rounded-lg" />
          <Skeleton className="h-20 w-full bg-amber-800/30 rounded-lg" />
          <Skeleton className="h-20 w-full bg-amber-800/30 rounded-lg" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Skeleton className="h-9 w-24 bg-amber-800/30" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-20 bg-amber-800/30" />
          <Skeleton className="h-9 w-20 bg-amber-800/30" />
        </div>
      </CardFooter>
    </Card>
  )
}
