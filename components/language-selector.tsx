"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, Globe } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// List of languages with their codes
export const languages = [
  { value: "english", label: "English" },
  { value: "hindi", label: "Hindi" },
  { value: "spanish", label: "Spanish" },
  { value: "french", label: "French" },
  { value: "german", label: "German" },
  { value: "chinese", label: "Chinese" },
  { value: "japanese", label: "Japanese" },
  { value: "russian", label: "Russian" },
  { value: "arabic", label: "Arabic" },
  { value: "portuguese", label: "Portuguese" },
  { value: "bengali", label: "Bengali" },
  { value: "urdu", label: "Urdu" },
  { value: "italian", label: "Italian" },
  { value: "dutch", label: "Dutch" },
  { value: "turkish", label: "Turkish" },
  { value: "korean", label: "Korean" },
  { value: "vietnamese", label: "Vietnamese" },
  { value: "tamil", label: "Tamil" },
  { value: "punjabi", label: "Punjabi" },
  { value: "sanskrit", label: "Sanskrit" },
  { value: "telugu", label: "Telugu" },
  { value: "marathi", label: "Marathi" },
  { value: "gujarati", label: "Gujarati" },
  { value: "kannada", label: "Kannada" },
  { value: "malayalam", label: "Malayalam" },
  { value: "thai", label: "Thai" },
  { value: "swahili", label: "Swahili" },
  { value: "greek", label: "Greek" },
  { value: "hebrew", label: "Hebrew" },
  { value: "polish", label: "Polish" },
]

interface LanguageSelectorProps {
  onSelectLanguage: (language: string) => void
}

export function LanguageSelector({ onSelectLanguage }: LanguageSelectorProps) {
  const [open, setOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0])

  // Load saved language preference from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem("preferredLanguage")
    if (savedLanguage) {
      const language = languages.find((lang) => lang.value === savedLanguage)
      if (language) {
        setSelectedLanguage(language)
      }
    }
  }, [])

  const handleSelectLanguage = (language: (typeof languages)[0]) => {
    setSelectedLanguage(language)
    setOpen(false)
    localStorage.setItem("preferredLanguage", language.value)
    onSelectLanguage(language.value)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-amber-900/20 border-amber-700/50 hover:bg-amber-800/30 hover:text-amber-200 text-amber-300"
        >
          <div className="flex items-center">
            <Globe className="mr-2 h-4 w-4" />
            {selectedLanguage.label}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 bg-amber-950 border-amber-800">
        <Command className="bg-transparent">
          <CommandInput placeholder="Search language..." className="text-amber-200" />
          <CommandList>
            <CommandEmpty className="text-amber-400">No language found.</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-y-auto">
              {languages.map((language) => (
                <CommandItem
                  key={language.value}
                  value={language.value}
                  onSelect={() => handleSelectLanguage(language)}
                  className={cn(
                    "text-amber-200 hover:bg-amber-800 hover:text-amber-100",
                    selectedLanguage.value === language.value && "bg-amber-800/50",
                  )}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedLanguage.value === language.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {language.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
