"use client"

import { Button } from "@/components/ui/button"
import { Mic, MicOff, Volume2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SpeechButtonProps {
  type?: "input" | "output"
  isListening?: boolean
  isSpeaking?: boolean
  onSpeakToggle: () => void
  className?: string
  size?: "default" | "sm" | "lg" | "icon"
  showTooltip?: boolean
}

export function SpeechButton({
  type = "output",
  isListening = false,
  isSpeaking = false,
  onSpeakToggle,
  className,
  size = "default",
  showTooltip = true,
}: SpeechButtonProps) {
  const isActive = type === "input" ? isListening : isSpeaking
  const Icon = type === "input" ? (isListening ? Mic : MicOff) : isSpeaking ? Volume2 : Volume2
  const tooltipText =
    type === "input"
      ? isListening
        ? "Stop listening"
        : "Start voice input"
      : isSpeaking
        ? "Stop speaking"
        : "Listen to this text"

  const buttonContent = (
    <Button
      type="button"
      size={size}
      variant={isActive ? "default" : "outline"}
      className={cn(
        "transition-all duration-200",
        isActive
          ? "bg-amber-600 hover:bg-amber-700 text-white"
          : "bg-amber-900/20 border-amber-700/50 hover:bg-amber-800/30 hover:text-amber-200 text-amber-300",
        className,
      )}
      onClick={onSpeakToggle}
    >
      <Icon className={cn("h-4 w-4", isActive && "animate-pulse")} />
    </Button>
  )

  if (!showTooltip) {
    return buttonContent
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
        <TooltipContent className="bg-amber-950 text-amber-300 border-amber-700">{tooltipText}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
