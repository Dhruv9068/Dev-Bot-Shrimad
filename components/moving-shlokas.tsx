"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

// Expanded collection of Sanskrit mantras, greetings, and phrases
const sanskritPhrases = [
  // Greetings
  "हरे कृष्ण", // Hare Krishna
  "नमस्ते", // Namaste
  "ॐ नमः शिवाय", // Om Namah Shivaya
  "राधे राधे", // Radhe Radhe
  "जय श्री कृष्ण", // Jai Shri Krishna
  "जय श्री राम", // Jai Shri Ram

  // Common Mantras
  "ॐ शांति शांति शांति", // Om Shanti Shanti Shanti
  "सर्वे भवन्तु सुखिनः", // Sarve Bhavantu Sukhinah
  "लोका समस्ता सुखिनो भवन्तु", // Loka Samasta Sukhino Bhavantu
  "वसुधैव कुटुम्बकम्", // Vasudhaiva Kutumbakam
  "सत्यम् शिवम् सुन्दरम्", // Satyam Shivam Sundaram

  // Bhagavad Gita Verses
  "कर्मण्येवाधिकारस्ते", // Karmanye Vadhikaraste
  "यदा यदा हि धर्मस्य", // Yada Yada Hi Dharmasya
  "अहिंसा परमो धर्मः", // Ahimsa Paramo Dharmah
  "योगस्थः कुरु कर्माणि", // Yogasthah Kuru Karmani

  // Other Spiritual Phrases
  "तत् त्वम् असि", // Tat Tvam Asi
  "अयं आत्मा ब्रह्म", // Ayam Atma Brahma
  "प्रज्ञानं ब्रह्म", // Prajnanam Brahma
  "अहं ब्रह्मास्मि", // Aham Brahmasmi

  // More Mantras
  "गायत्री मंत्र", // Gayatri Mantra
  "महामृत्युंजय मंत्र", // Mahamrityunjaya Mantra
  "ॐ भूर्भुवः स्वः", // Om Bhur Bhuvah Swah
  "ॐ पूर्णमदः पूर्णमिदम्", // Om Purnamadah Purnamidam

  // Bhakti Phrases
  "गोविन्द जय जय", // Govinda Jaya Jaya
  "कृष्ण कृष्ण हरे हरे", // Krishna Krishna Hare Hare
  "राम राम हरे हरे", // Rama Rama Hare Hare
  "श्री राम जय राम", // Shri Ram Jai Ram

  // Wisdom Phrases
  "सत्यमेव जयते", // Satyameva Jayate
  "धर्मो रक्षति रक्षितः", // Dharmo Rakshati Rakshitah
  "अहिंसा परमो धर्मः", // Ahimsa Paramo Dharmah
  "विद्या ददाति विनयम्", // Vidya Dadati Vinayam

  // More Greetings
  "शुभ प्रभात", // Shubh Prabhat (Good Morning)
  "शुभ रात्रि", // Shubh Ratri (Good Night)
  "शुभ दिन", // Shubh Din (Good Day)
  "धन्यवाद", // Dhanyavaad (Thank you)

  // Spiritual Concepts
  "आत्मा", // Atma (Soul)
  "कर्म", // Karma
  "धर्म", // Dharma
  "मोक्ष", // Moksha
  "भक्ति", // Bhakti
]

export function MovingShlokas() {
  const [visiblePhrases, setVisiblePhrases] = useState<
    Array<{ text: string; position: { x: number; y: number }; speed: number; size: number }>
  >([])

  useEffect(() => {
    // Create 30-40 phrases with random positions
    const phraseCount = Math.floor(Math.random() * 11) + 30 // 30-40 phrases
    const initialPhrases = Array.from({ length: phraseCount }, () => {
      return {
        text: sanskritPhrases[Math.floor(Math.random() * sanskritPhrases.length)],
        position: {
          x: Math.random() * 100, // Random x position (0-100%)
          y: Math.random() * 100, // Random y position (0-100%)
        },
        speed: Math.random() * 15 + 5, // Random speed (5-20)
        size: Math.random() * 1.5 + 0.8, // Random size multiplier (0.8-2.3)
      }
    })

    setVisiblePhrases(initialPhrases)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden z-10 pointer-events-none">
      {visiblePhrases.map((phrase, index) => (
        <motion.div
          key={`${phrase.text}-${index}`}
          className="absolute text-center whitespace-nowrap"
          initial={{
            x: `${phrase.position.x}vw`,
            y: `${phrase.position.y}vh`,
            opacity: 0,
          }}
          animate={{
            x: [
              `${phrase.position.x}vw`,
              `${(phrase.position.x + 30) % 100}vw`,
              `${(phrase.position.x + 60) % 100}vw`,
              `${(phrase.position.x + 90) % 100}vw`,
              `${phrase.position.x}vw`,
            ],
            y: [
              `${phrase.position.y}vh`,
              `${(phrase.position.y + 25) % 100}vh`,
              `${(phrase.position.y + 50) % 100}vh`,
              `${(phrase.position.y + 75) % 100}vh`,
              `${phrase.position.y}vh`,
            ],
            opacity: [0, 0.7, 0.7, 0.7, 0],
            scale: [1, 1.1, 1, 0.9, 1],
          }}
          transition={{
            duration: phrase.speed,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            ease: "linear",
            delay: (index * 0.2) % 5,
          }}
          style={{
            fontSize: `${phrase.size}rem`,
          }}
        >
          <p className="text-amber-300/30 font-sanskrit">{phrase.text}</p>
        </motion.div>
      ))}
    </div>
  )
}
