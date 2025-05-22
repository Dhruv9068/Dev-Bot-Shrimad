"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { LocalizedContent } from "./localized-content"

export function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Check if the user has seen the welcome modal before
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome")
    if (!hasSeenWelcome) {
      setIsOpen(true)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    localStorage.setItem("hasSeenWelcome", "true")
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-gradient-to-br from-amber-950 to-amber-900 border-amber-800 text-amber-100 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl text-amber-300 text-center">
            <LocalizedContent
              english="Welcome to the Bhagavad Gita Explorer"
              hindi="भगवद्गीता एक्सप्लोरर में आपका स्वागत है"
              sanskrit="भगवद्गीता अन्वेषके स्वागतम्"
              spanish="Bienvenido al Explorador de Bhagavad Gita"
              french="Bienvenue dans l'Explorateur de la Bhagavad Gita"
              german="Willkommen beim Bhagavad Gita Explorer"
            />
          </DialogTitle>
          <DialogDescription className="text-amber-200 text-center">
            <LocalizedContent
              english="Discover the timeless wisdom of the Bhagavad Gita"
              hindi="भगवद्गीता के शाश्वत ज्ञान की खोज करें"
              sanskrit="भगवद्गीतायाः शाश्वतं ज्ञानं अन्वेषयतु"
              spanish="Descubre la sabiduría atemporal de la Bhagavad Gita"
              french="Découvrez la sagesse intemporelle de la Bhagavad Gita"
              german="Entdecken Sie die zeitlose Weisheit der Bhagavad Gita"
            />
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-amber-900/30 p-4 rounded-lg border-l-2 border-amber-600">
            <p className="text-amber-100 italic">
              <LocalizedContent
                english="The Bhagavad Gita, often referred to as the Gita, is a 700-verse Hindu scripture that is part of the epic Mahabharata. It is a sacred text that contains the direct message of God."
                hindi="भगवद्गीता, जिसे अक्सर गीता के रूप में जाना जाता है, 700 श्लोकों का एक हिंदू ग्रंथ है जो महाभारत महाकाव्य का हिस्सा है। यह एक पवित्र ग्रंथ है जिसमें भगवान का सीधा संदेश है।"
                sanskrit="भगवद्गीता, या गीता इति प्रसिद्धा, सप्तशती श्लोकानां हिन्दू शास्त्रं यत् महाभारतस्य अंशः अस्ति। एतत् पवित्रं ग्रन्थं यत्र भगवतः साक्षात् सन्देशः अस्ति।"
                spanish="La Bhagavad Gita, a menudo referida como la Gita, es una escritura hindú de 700 versos que forma parte de la epopeya Mahabharata. Es un texto sagrado que contiene el mensaje directo de Dios."
                french="La Bhagavad Gita, souvent appelée la Gita, est un texte hindou de 700 versets qui fait partie de l'épopée du Mahabharata. C'est un texte sacré qui contient le message direct de Dieu."
                german="Die Bhagavad Gita, oft als Gita bezeichnet, ist eine 700-Verse hinduistische Schrift, die Teil des Epos Mahabharata ist. Es ist ein heiliger Text, der die direkte Botschaft Gottes enthält."
              />
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-amber-300 font-semibold">
              <LocalizedContent
                english="Features of this application:"
                hindi="इस एप्लिकेशन की विशेषताएं:"
                sanskrit="अस्य अनुप्रयोगस्य विशेषताः:"
                spanish="Características de esta aplicación:"
                french="Fonctionnalités de cette application:"
                german="Funktionen dieser Anwendung:"
              />
            </h3>
            <ul className="list-disc list-inside space-y-1 text-amber-200">
              <li>
                <LocalizedContent
                  english="Interactive 3D book visualization"
                  hindi="इंटरैक्टिव 3D पुस्तक विज़ुअलाइज़ेशन"
                  sanskrit="अन्तःक्रियात्मकं त्रिआयामी पुस्तकदर्शनम्"
                  spanish="Visualización interactiva de libros en 3D"
                  french="Visualisation interactive de livre en 3D"
                  german="Interaktive 3D-Buchvisualisierung"
                />
              </li>
              <li>
                <LocalizedContent
                  english="AI-powered chatbot to answer your questions"
                  hindi="आपके प्रश्नों का उत्तर देने के लिए AI-संचालित चैटबॉट"
                  sanskrit="प्रश्नानां उत्तराय कृत्रिमबुद्धिचालितं संवादयन्त्रम्"
                  spanish="Chatbot con IA para responder a tus preguntas"
                  french="Chatbot alimenté par l'IA pour répondre à vos questions"
                  german="KI-gesteuerter Chatbot zur Beantwortung Ihrer Fragen"
                />
              </li>
              <li>
                <LocalizedContent
                  english="Daily wisdom from the Gita"
                  hindi="गीता से दैनिक ज्ञान"
                  sanskrit="गीतायाः दैनिकं ज्ञानम्"
                  spanish="Sabiduría diaria de la Gita"
                  french="Sagesse quotidienne de la Gita"
                  german="Tägliche Weisheit aus der Gita"
                />
              </li>
              <li>
                <LocalizedContent
                  english="Support for multiple languages"
                  hindi="कई भाषाओं के लिए समर्थन"
                  sanskrit="बहुभाषासमर्थनम्"
                  spanish="Soporte para múltiples idiomas"
                  french="Support pour plusieurs langues"
                  german="Unterstützung für mehrere Sprachen"
                />
              </li>
            </ul>
          </div>
        </div>

        <div className="flex justify-center mt-4">
          <Button
            onClick={handleClose}
            className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white"
          >
            <LocalizedContent
              english="Begin Exploration"
              hindi="खोज शुरू करें"
              sanskrit="अन्वेषणं प्रारभताम्"
              spanish="Comenzar Exploración"
              french="Commencer l'Exploration"
              german="Erkundung beginnen"
            />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
