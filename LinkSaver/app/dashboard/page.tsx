"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated, logout } from "@/lib/auth"
import UrlForm from "@/components/url-form"
import BookmarkList from "@/components/bookmark-list"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MoonIcon, SunIcon, LogOut, Search, X } from "lucide-react"
import type { Bookmark } from "@/lib/types"
import { getBookmarks } from "@/lib/bookmarks"
import { useTheme } from "next-themes"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"

export default function Dashboard() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [filteredBookmarks, setFilteredBookmarks] = useState<Bookmark[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState("all")

  useEffect(() => {
    // Check if user is authenticated
    if (typeof window !== "undefined" && !isAuthenticated()) {
      router.push("/")
      return
    }

    // Load bookmarks from localStorage
    const loadedBookmarks = getBookmarks()
    setBookmarks(loadedBookmarks)
    setFilteredBookmarks(loadedBookmarks)
    setIsLoading(false)
  }, [router])

  useEffect(() => {
    // Filter bookmarks based on search query
    if (searchQuery.trim() === "") {
      setFilteredBookmarks(bookmarks)
    } else {
      const filtered = bookmarks.filter(
        (bookmark) =>
          bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          bookmark.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
          bookmark.summary.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredBookmarks(filtered)
    }
  }, [searchQuery, bookmarks])

  const handleLogout = () => {
    logout()
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    })
    router.push("/")
  }

  const handleBookmarksChange = () => {
    const updatedBookmarks = getBookmarks()
    setBookmarks(updatedBookmarks)
    setFilteredBookmarks(updatedBookmarks)
  }

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter)

    // Apply filtering logic based on the selected filter
    if (filter === "all") {
      setFilteredBookmarks(bookmarks)
    } else if (filter === "recent") {
      const sorted = [...bookmarks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      setFilteredBookmarks(sorted)
    } else if (filter === "alphabetical") {
      const sorted = [...bookmarks].sort((a, b) => a.title.localeCompare(b.title))
      setFilteredBookmarks(sorted)
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-md dark:bg-slate-900/80 dark:border-slate-700">
        <div className="container mx-auto flex items-center justify-between p-4">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            <span className="text-blue-600 dark:text-blue-400">Link</span>Saver
          </h1>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 py-8">
        <div className="mb-8 rounded-xl bg-white p-6 shadow-sm dark:bg-slate-800 dark:shadow-slate-700/10">
          <UrlForm onBookmarkAdded={handleBookmarksChange} />
        </div>

        <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Your Saved Links</h2>

          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="Search bookmarks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <Tabs
              defaultValue="all"
              value={activeFilter}
              onValueChange={handleFilterChange}
              className="w-full sm:w-auto"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="alphabetical">A-Z</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <BookmarkList
          bookmarks={filteredBookmarks}
          onBookmarksChange={handleBookmarksChange}
          isLoading={isLoading}
          searchQuery={searchQuery}
        />
      </main>
      <Toaster />
    </div>
  )
}
