import type { Bookmark, NewBookmark } from "@/lib/types"

const BOOKMARKS_KEY = "bookmarks"

// Get all bookmarks from localStorage
export const getBookmarks = (): Bookmark[] => {
  if (typeof window === "undefined") return []

  const bookmarksJson = localStorage.getItem(BOOKMARKS_KEY)
  if (!bookmarksJson) return []

  try {
    return JSON.parse(bookmarksJson)
  } catch (error) {
    console.error("Error parsing bookmarks:", error)
    return []
  }
}

// Add a new bookmark
export const addBookmark = (newBookmark: NewBookmark): void => {
  if (typeof window === "undefined") return

  const bookmarks = getBookmarks()

  const bookmark: Bookmark = {
    id: Date.now(),
    url: newBookmark.url,
    title: newBookmark.title || newBookmark.url,
    summary: newBookmark.summary || "No summary available.",
    createdAt: new Date().toISOString(),
  }

  const updatedBookmarks = [bookmark, ...bookmarks]
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updatedBookmarks))
}

// Delete a bookmark by ID
export const deleteBookmark = (id: number): void => {
  if (typeof window === "undefined") return

  const bookmarks = getBookmarks()
  const updatedBookmarks = bookmarks.filter((bookmark) => bookmark.id !== id)

  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updatedBookmarks))
}
