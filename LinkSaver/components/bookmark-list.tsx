"use client"

import { useState } from "react"
import type { Bookmark } from "@/lib/types"
import BookmarkCard from "@/components/bookmark-card"
import { motion, AnimatePresence } from "framer-motion"
import BookmarkSkeleton from "@/components/bookmark-skeleton"
import { FolderX } from "lucide-react"

interface BookmarkListProps {
  bookmarks: Bookmark[]
  onBookmarksChange: () => void
  isLoading: boolean
  searchQuery: string
}

export default function BookmarkList({ bookmarks, onBookmarksChange, isLoading, searchQuery }: BookmarkListProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id)
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <BookmarkSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (bookmarks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-800"
      >
        <FolderX className="mb-4 h-12 w-12 text-slate-400" />
        <h3 className="mb-2 text-lg font-medium text-slate-900 dark:text-white">No bookmarks saved yet</h3>
        <p className="text-slate-500 dark:text-slate-400">Add your first link using the form above to get started!</p>
      </motion.div>
    )
  }

  if (searchQuery && bookmarks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-800"
      >
        <FolderX className="mb-4 h-12 w-12 text-slate-400" />
        <h3 className="mb-2 text-lg font-medium text-slate-900 dark:text-white">No results found</h3>
        <p className="text-slate-500 dark:text-slate-400">
          No bookmarks match your search query. Try a different search term.
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
    >
      <AnimatePresence>
        {bookmarks.map((bookmark) => (
          <motion.div
            key={bookmark.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <BookmarkCard
              bookmark={bookmark}
              onDelete={onBookmarksChange}
              isExpanded={expandedId === bookmark.id}
              onToggleExpand={() => toggleExpand(bookmark.id)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}
