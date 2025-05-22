"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { BookOpen, MessageSquare, Music, ImageIcon, Info, Menu, ShoppingBag } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface NavbarProps {
  activeSection: string
  onNavigate: (section: string) => void
}

export function Navbar({ activeSection, onNavigate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { id: "home", label: "Home", icon: <BookOpen className="h-4 w-4 mr-2" /> },
    { id: "about", label: "About", icon: <Info className="h-4 w-4 mr-2" /> },
    { id: "chapters", label: "Chapters", icon: <BookOpen className="h-4 w-4 mr-2" /> },
    { id: "daily-wisdom", label: "Daily Wisdom", icon: <ImageIcon className="h-4 w-4 mr-2" /> },
    { id: "chatbot", label: "Chatbot", icon: <MessageSquare className="h-4 w-4 mr-2" /> },
    { id: "audio", label: "Audio", icon: <Music className="h-4 w-4 mr-2" /> },
    { id: "shop", label: "Shop", icon: <ShoppingBag className="h-4 w-4 mr-2" /> },
  ]

  const handleNavigation = (sectionId: string) => {
    onNavigate(sectionId)
    setIsOpen(false)
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-amber-950/90 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl md:text-2xl font-bold text-amber-300">Shrimad</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className={`text-amber-300 hover:bg-amber-900/50 hover:text-amber-200 ${
                  activeSection === item.id ? "bg-amber-900/50 text-amber-200" : ""
                }`}
                onClick={() => onNavigate(item.id)}
              >
                {item.icon}
                {item.label}
              </Button>
            ))}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-amber-300 hover:bg-amber-900/50 hover:text-amber-200 p-2"
                  onClick={() => setIsOpen(true)}
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-amber-950 border-amber-800 w-[80%] sm:w-[350px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <Button
                      key={item.id}
                      variant="ghost"
                      className={`text-amber-300 hover:bg-amber-900/50 hover:text-amber-200 justify-start ${
                        activeSection === item.id ? "bg-amber-900/50 text-amber-200" : ""
                      }`}
                      onClick={() => handleNavigation(item.id)}
                    >
                      {item.icon}
                      {item.label}
                    </Button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
