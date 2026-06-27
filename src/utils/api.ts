import type { Novel, PaginatedResponse, ApiResponse, ChapterContent, Volume, Category, ReadingProgress } from '@shared/types'

const API_BASE = ''

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  })
  const data = await res.json() as ApiResponse<T>
  if (!data.success) {
    throw new Error(data.error || 'Request failed')
  }
  return data.data as T
}

export const api = {
  getNovels: (page = 1, pageSize = 12, category?: string, status?: string) => {
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
    if (category) params.set('category', category)
    if (status) params.set('status', status)
    return request<PaginatedResponse<Novel>>(`/api/novels?${params}`)
  },

  getFeaturedNovels: () => request<Novel[]>('/api/novels/featured'),

  getLatestNovels: () => request<Novel[]>('/api/novels/latest'),

  getNovel: (id: string) => request<Novel & { readingProgress?: ReadingProgress | null }>(`/api/novels/${id}`),

  getChapters: (id: string) => request<Volume[]>(`/api/novels/${id}/chapters`),

  getChapterContent: (novelId: string, chapterId: string) =>
    request<ChapterContent & { prevChapter: { id: string; title: string } | null; nextChapter: { id: string; title: string } | null; novel: { id: string; title: string; author: string } }>(
      `/api/novels/${novelId}/chapters/${chapterId}`
    ),

  getDownloadUrl: (novelId: string, format: string) => `/api/novels/${novelId}/download/${format}`,

  searchNovels: (q: string) => request<Novel[]>(`/api/search?q=${encodeURIComponent(q)}`),

  getCategories: () => request<Category[]>('/api/categories'),

  getProgress: (novelId: string) => request<ReadingProgress | null>(`/api/progress/${novelId}`),

  saveProgress: (novelId: string, chapterId: string, scrollPosition: number) =>
    request<ReadingProgress>(`/api/progress/${novelId}`, {
      method: 'POST',
      body: JSON.stringify({ chapterId, scrollPosition })
    })
}
