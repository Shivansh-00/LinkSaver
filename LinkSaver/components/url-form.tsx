"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { addBookmark } from "@/lib/bookmarks"
import { Loader2, LinkIcon, AlertCircle, CheckCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"

interface UrlFormProps {
  onBookmarkAdded: () => void
}

export default function UrlForm({ onBookmarkAdded }: UrlFormProps) {
  const { toast } = useToast()
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Focus the input field on component mount
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  useEffect(() => {
    // Validate URL as user types
    if (!url) {
      setIsValid(null)
      return
    }

    const isValidUrl = (string: string) => {
      try {
        new URL(string)
        return true
      } catch (_) {
        return false
      }
    }

    const timer = setTimeout(() => {
      setIsValid(isValidUrl(url))
    }, 500)

    return () => clearTimeout(timer)
  }, [url])

  const getSummary = async (url: string): Promise<string> => {
    try {
      const response = await fetch("https://r.jina.ai/" + encodeURIComponent(url))
      if (!response.ok) {
        throw new Error(`Failed to get summary: ${response.status}`)
      }
      const summary = await response.text()
      return summary || "No summary available."
    } catch (error) {
      console.error("Error getting summary:", error)
      return "Summary temporarily unavailable."
    }
  }

  const extractTitle = (url: string): string => {
    try {
      const { hostname, pathname } = new URL(url)

      // Try to extract a meaningful title from the pathname
      if (pathname && pathname !== "/") {
        const segments = pathname.split("/").filter(Boolean)
        if (segments.length > 0) {
          const lastSegment = segments[segments.length - 1]
          // Replace hyphens and underscores with spaces and capitalize
          return lastSegment
            .replace(/[-_]/g, " ")
            .replace(/\.[^/.]+$/, "") // Remove file extension
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
        }
      }

      // Fallback to hostname
      return hostname
    } catch (e) {
      return url
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate URL
    if (!url) {
      setError("Please enter a URL")
      return
    }

    const isValidUrl = (string: string) => {
      try {
        new URL(string)
        return true
      } catch (_) {
        return false
      }
    }

    if (!isValidUrl(url)) {
      setError("Please enter a valid URL")
      return
    }

    setIsLoading(true)

    try {
      // Get summary from Jina AI
      const summary = await getSummary(url)

      // Extract title from URL
      const title = extractTitle(url)

      // Add bookmark
      addBookmark({
        url,
        title,
        summary,
      })

      // Reset form and notify parent
      setUrl("")
      setIsValid(null)
      onBookmarkAdded()

      // Show success toast
      toast({
        title: "Bookmark added!",
        description: "Your link has been saved and summarized.",
      })
    } catch (error) {
      console.error("Error adding bookmark:", error)
      setError("Failed to add bookmark. Please try again.")

      toast({
        title: "Error adding bookmark",
        description: "There was a problem saving your link. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="flex items-center text-xl text-slate-900 dark:text-white">
          <LinkIcon className="mr-2 h-5 w-5 text-blue-500" />
          Add New Link
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <div className="relative flex-grow">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Paste URL here (e.g., https://example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isLoading}
              className={`pr-10 transition-all ${
                isValid === true
                  ? "border-green-500 focus-visible:ring-green-500"
                  : isValid === false
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
              }`}
            />
            <AnimatePresence>
              {url && isValid !== null && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {isValid ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <Button type="submit" disabled={isLoading || isValid === false} className="transition-all">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Save & Summarize"
            )}
          </Button>
        </form>
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 overflow-hidden rounded-md bg-red-50 p-3 text-sm text-red-500 dark:bg-red-900/20 dark:text-red-300"
            >
              <div className="flex items-center">
                <AlertCircle className="mr-2 h-4 w-4" />
                {error}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
