import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { Footer } from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Dev bot Shrimad",
  description: "Explore the sacred teachings of the Bhagavad Gita through an interactive 3D book and spiritual chatbot",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} overflow-x-hidden`}>
        <div className="overflow-x-hidden w-full flex flex-col min-h-screen">
          <div className="flex-grow">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  )
}
