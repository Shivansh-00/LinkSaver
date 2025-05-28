export interface Bookmark {
  id: number
  url: string
  title: string
  summary: string
  createdAt: string
}

export interface NewBookmark {
  url: string
  title?: string
  summary?: string
}
