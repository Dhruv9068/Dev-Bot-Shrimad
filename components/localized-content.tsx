"use client"

import type React from "react"

import { useEffect, useState } from "react"

interface LocalizedContentProps {
  english: React.ReactNode
  hindi?: React.ReactNode
  sanskrit?: React.ReactNode
  spanish?: React.ReactNode
  french?: React.ReactNode
  german?: React.ReactNode
  chinese?: React.ReactNode
  japanese?: React.ReactNode
  russian?: React.ReactNode
  arabic?: React.ReactNode
  portuguese?: React.ReactNode
  [key: string]: React.ReactNode
}

export function LocalizedContent({ english, ...translations }: LocalizedContentProps) {
  const [language, setLanguage] = useState("english")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("preferredLanguage")
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage)
    }
  }, [])

  return <>{translations[language] || english}</>
}
