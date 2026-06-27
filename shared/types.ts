export interface Novel {
  id: string
  title: string
  author: string
  cover: string
  description: string
  category: string
  tags: string[]
  wordCount: number
  status: 'ongoing' | 'completed'
  createdAt: string
  updatedAt: string
  chapterCount: number
  volumes: Volume[]
}

export interface Volume {
  id: string
  title: string
  chapters: Chapter[]
}

export interface Chapter {
  id: string
  title: string
  wordCount: number
  updatedAt: string
}

export interface ChapterContent extends Chapter {
  content: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

export interface ReadingProgress {
  novelId: string
  chapterId: string
  scrollPosition: number
  lastReadAt: string
}

export interface Category {
  id: string
  name: string
  icon: string
  count: number
}

export type DownloadFormat = 'txt' | 'epub' | 'pdf'

export interface Env {
  NOVEL_BUCKET: R2Bucket
  NOVEL_META: KVNamespace
  READING_PROGRESS: KVNamespace
  ASSETS: Fetcher
  ENVIRONMENT: string
}
