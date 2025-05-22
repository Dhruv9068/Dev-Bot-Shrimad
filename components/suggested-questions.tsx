"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HelpCircle } from "lucide-react"

interface SuggestedQuestionsProps {
  onSelectQuestion: (question: string) => void
}

export function SuggestedQuestions({ onSelectQuestion }: SuggestedQuestionsProps) {
  const [language, setLanguage] = useState("english")

  // Load saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem("preferredLanguage")
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Questions in different languages
  const questions = {
    english: [
      "What is the main message of the Bhagavad Gita?",
      "Explain the concept of karma yoga",
      "How can I apply Gita's teachings in daily life?",
      "What does Krishna say about meditation?",
      "Tell me about the three gunas",
      "What is the significance of Chapter 11?",
    ],
    hindi: [
      "भगवद्गीता का मुख्य संदेश क्या है?",
      "कर्म योग की अवधारणा समझाएं",
      "मैं दैनिक जीवन में गीता की शिक्षाओं को कैसे लागू कर सकता हूं?",
      "कृष्ण ध्यान के बारे में क्या कहते हैं?",
      "तीन गुणों के बारे में बताएं",
      "अध्याय 11 का महत्व क्या है?",
    ],
    sanskrit: [
      "भगवद्गीतायाः मुख्यः सन्देशः कः?",
      "कर्मयोगस्य अवधारणां व्याख्यातु",
      "अहं दैनिके जीवने गीतायाः शिक्षाः कथं प्रयोक्तुं शक्नोमि?",
      "कृष्णः ध्यानस्य विषये किं वदति?",
      "त्रिगुणानां विषये कथयतु",
      "एकादशाध्यायस्य महत्त्वं किम्?",
    ],
    spanish: [
      "¿Cuál es el mensaje principal del Bhagavad Gita?",
      "Explica el concepto de karma yoga",
      "¿Cómo puedo aplicar las enseñanzas del Gita en la vida diaria?",
      "¿Qué dice Krishna sobre la meditación?",
      "Háblame de las tres gunas",
      "¿Cuál es la importancia del Capítulo 11?",
    ],
    french: [
      "Quel est le message principal de la Bhagavad Gita ?",
      "Expliquez le concept du karma yoga",
      "Comment puis-je appliquer les enseignements de la Gita dans la vie quotidienne ?",
      "Que dit Krishna à propos de la méditation ?",
      "Parlez-moi des trois gunas",
      "Quelle est l'importance du Chapitre 11 ?",
    ],
    german: [
      "Was ist die Hauptbotschaft der Bhagavad Gita?",
      "Erklären Sie das Konzept des Karma Yoga",
      "Wie kann ich die Lehren der Gita im Alltag anwenden?",
      "Was sagt Krishna über Meditation?",
      "Erzählen Sie mir von den drei Gunas",
      "Was ist die Bedeutung von Kapitel 11?",
    ],
  }

  // Get questions for the current language or fall back to English
  const currentQuestions = questions[language as keyof typeof questions] || questions.english

  return (
    <Card className="bg-gradient-to-br from-amber-950 to-amber-900/80 border-amber-800/50 shadow-lg">
      <CardHeader className="pb-2 bg-gradient-to-r from-amber-900 to-amber-800 rounded-t-lg border-b border-amber-700/50">
        <CardTitle className="text-amber-300 flex items-center gap-2">
          <HelpCircle className="h-5 w-5" />
          {language === "hindi"
            ? "सुझाए गए प्रश्न"
            : language === "sanskrit"
              ? "सूचितप्रश्नाः"
              : language === "spanish"
                ? "Preguntas Sugeridas"
                : language === "french"
                  ? "Questions Suggérées"
                  : language === "german"
                    ? "Vorgeschlagene Fragen"
                    : language === "chinese"
                      ? "建议的问题"
                      : language === "japanese"
                        ? "おすすめの質問"
                        : language === "russian"
                          ? "Предлагаемые Вопросы"
                          : language === "arabic"
                            ? "أسئلة مقترحة"
                            : language === "portuguese"
                              ? "Perguntas Sugeridas"
                              : "Suggested Questions"}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 gap-2">
          {currentQuestions.map((question, index) => (
            <Button
              key={index}
              variant="outline"
              className="justify-start text-left text-amber-200 border-amber-700/50 hover:bg-amber-800/50 hover:text-amber-100"
              onClick={() => onSelectQuestion(question)}
            >
              {question}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
