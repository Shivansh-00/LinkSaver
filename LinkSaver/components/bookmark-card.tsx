"use client"

import { useState } from "react"
import type { Bookmark } from "@/lib/types"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, ExternalLink, Copy, Check, ChevronDown, ChevronUp, Share2 } from "lucide-react"
import { deleteBookmark } from "@/lib/bookmarks"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface BookmarkCardProps {
  bookmark: Bookmark
  onDelete: () => void
  isExpanded: boolean
  onToggleExpand: () => void
}

export default function BookmarkCard({ bookmark, onDelete, isExpanded, onToggleExpand }: BookmarkCardProps) {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = () => {
    setIsDeleting(true)

    // Add a small delay to show the deletion animation
    setTimeout(() => {
      deleteBookmark(bookmark.id)
      onDelete()

      toast({
        title: "Bookmark deleted",
        description: "Your bookmark has been removed.",
      })
    }, 300)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(bookmark.url)
    setCopied(true)

    toast({
      title: "URL copied!",
      description: "The link has been copied to your clipboard.",
    })

    setTimeout(() => setCopied(false), 2000)
  }

  const shareBookmark = () => {
    if (navigator.share) {
      navigator.share({
        title: bookmark.title,
        text: bookmark.summary,
        url: bookmark.url,
      })
    } else {
      copyToClipboard()
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Extract domain for favicon
  const getDomain = (url: string) => {
    try {
      const { hostname } = new URL(url)
      return hostname
    } catch (e) {
      return ""
    }
  }

  const domain = getDomain(bookmark.url)
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`

  return (
    <motion.div
      animate={isDeleting ? { opacity: 0, y: 20, scale: 0.9 } : { opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full overflow-hidden border-slate-200 transition-all hover:shadow-md dark:border-slate-700">
        <CardHeader className="p-4 pb-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded bg-slate-100 dark:bg-slate-800">
                <img
                  src={faviconUrl || "/placeholder.svg"}
                  alt={domain}
                  className="h-4 w-4"
                  onError={(e) => {
                    // If favicon fails to load, show the first letter of the domain
                    const target = e.target as HTMLImageElement
                    target.style.display = "none"
                    target.parentElement!.textContent = domain.charAt(0).toUpperCase()
                  }}
                />
              </div>
              <div className="flex-1 truncate">
                <h3 className="font-medium text-slate-900 line-clamp-1 dark:text-white">{bookmark.title}</h3>
                <p className="text-xs text-slate-500 truncate dark:text-slate-400">{domain}</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Share2 className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={copyToClipboard}>
                  {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                  Copy URL
                </DropdownMenuItem>
                <DropdownMenuItem onClick={shareBookmark}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-red-500 focus:text-red-500">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="mb-2 text-sm text-slate-700 dark:text-slate-300">
            <div className={isExpanded ? "" : "line-clamp-3"}>{bookmark.summary}</div>
          </div>
          {bookmark.summary.length > 150 && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-1 h-auto p-0 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              onClick={onToggleExpand}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="mr-1 h-3 w-3" /> Show less
                </>
              ) : (
                <>
                  <ChevronDown className="mr-1 h-3 w-3" /> Read more
                </>
              )}
            </Button>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t p-4 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs font-normal">
              {formatDate(bookmark.createdAt)}
            </Badge>
          </div>
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Visit
            <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
