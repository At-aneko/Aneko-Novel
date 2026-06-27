import { Hono } from 'hono'
import type { Env, Novel, ChapterContent, PaginatedResponse, ApiResponse, DownloadFormat } from '../../../shared/types'
import { getDeviceId } from '../utils/device'

const novels = new Hono<{ Bindings: Env }>()

novels.get('/', async (c) => {
  const page = parseInt(c.req.query('page') || '1')
  const pageSize = parseInt(c.req.query('pageSize') || '12')
  const category = c.req.query('category')
  const status = c.req.query('status')

  const listStr = await c.env.NOVEL_META.get('novel:list')
  const novelIds: string[] = listStr ? JSON.parse(listStr) : []

  let novelList: Novel[] = []
  for (const id of novelIds) {
    const novelStr = await c.env.NOVEL_META.get(`novel:${id}`)
    if (novelStr) {
      const novel = JSON.parse(novelStr) as Novel
      if (category && category !== 'all' && novel.category !== category) continue
      if (status && novel.status !== status) continue
      novelList.push(novel)
    }
  }

  novelList.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

  const total = novelList.length
  const start = (page - 1) * pageSize
  const items = novelList.slice(start, start + pageSize)

  return c.json<ApiResponse<PaginatedResponse<Novel>>>({
    success: true,
    data: {
      items,
      total,
      page,
      pageSize,
      hasMore: start + pageSize < total
    }
  })
})

novels.get('/featured', async (c) => {
  const listStr = await c.env.NOVEL_META.get('novel:list')
  const novelIds: string[] = listStr ? JSON.parse(listStr) : []

  const novelList: Novel[] = []
  for (const id of novelIds.slice(0, 6)) {
    const novelStr = await c.env.NOVEL_META.get(`novel:${id}`)
    if (novelStr) {
      novelList.push(JSON.parse(novelStr))
    }
  }

  return c.json<ApiResponse<Novel[]>>({
    success: true,
    data: novelList
  })
})

novels.get('/latest', async (c) => {
  const listStr = await c.env.NOVEL_META.get('novel:list')
  const novelIds: string[] = listStr ? JSON.parse(listStr) : []

  const novelList: Novel[] = []
  for (const id of novelIds) {
    const novelStr = await c.env.NOVEL_META.get(`novel:${id}`)
    if (novelStr) {
      novelList.push(JSON.parse(novelStr))
    }
  }

  novelList.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  const latest = novelList.slice(0, 8)

  return c.json<ApiResponse<Novel[]>>({
    success: true,
    data: latest
  })
})

novels.get('/:id/download/:format', async (c) => {
  const id = c.req.param('id')
  const format = c.req.param('format') as DownloadFormat

  if (!['txt', 'epub', 'pdf'].includes(format)) {
    return c.json({ success: false, error: 'Unsupported format' }, 400)
  }

  const novelStr = await c.env.NOVEL_META.get(`novel:${id}`)
  if (!novelStr) {
    return c.json({ success: false, error: 'Novel not found' }, 404)
  }

  const novel = JSON.parse(novelStr) as Novel
  const key = `novels/${id}/source.${format}`
  const object = await c.env.NOVEL_BUCKET.get(key)

  if (!object) {
    if (format === 'txt') {
      const content = await generateTxtContent(c.env, id, novel)
      if (content) {
        const filename = encodeURIComponent(`${novel.title}.txt`)
        return new Response(content, {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Content-Disposition': `attachment; filename*=UTF-8''${filename}`,
            'Cache-Control': 'public, max-age=31536000'
          }
        })
      }
    }
    return c.json({ success: false, error: 'File not available' }, 404)
  }

  const contentTypeMap: Record<string, string> = {
    txt: 'text/plain; charset=utf-8',
    epub: 'application/epub+zip',
    pdf: 'application/pdf'
  }

  const filename = encodeURIComponent(`${novel.title}.${format}`)
  const headers = new Headers()
  object.writeHttpMetadata(headers)
  headers.set('Content-Type', contentTypeMap[format])
  headers.set('Content-Disposition', `attachment; filename*=UTF-8''${filename}`)
  headers.set('Cache-Control', 'public, max-age=31536000')

  return new Response(object.body, { headers })
})

novels.get('/:id/chapters', async (c) => {
  const id = c.req.param('id')
  const novelStr = await c.env.NOVEL_META.get(`novel:${id}`)

  if (!novelStr) {
    return c.json<ApiResponse>({ success: false, error: 'Novel not found' }, 404)
  }

  const novel = JSON.parse(novelStr) as Novel
  return c.json<ApiResponse>({
    success: true,
    data: novel.volumes
  })
})

novels.get('/:id/chapters/:chapterId', async (c) => {
  const id = c.req.param('id')
  const chapterId = c.req.param('chapterId')

  const contentStr = await c.env.NOVEL_META.get(`chapter:${id}:${chapterId}`)
  if (!contentStr) {
    return c.json<ApiResponse>({ success: false, error: 'Chapter not found' }, 404)
  }

  const novelStr = await c.env.NOVEL_META.get(`novel:${id}`)
  if (!novelStr) {
    return c.json<ApiResponse>({ success: false, error: 'Novel not found' }, 404)
  }

  const novel = JSON.parse(novelStr) as Novel
  let chapterInfo = null
  for (const volume of novel.volumes) {
    const ch = volume.chapters.find(c => c.id === chapterId)
    if (ch) {
      chapterInfo = ch
      break
    }
  }

  if (!chapterInfo) {
    return c.json<ApiResponse>({ success: false, error: 'Chapter not found' }, 404)
  }

  const chapterContent: ChapterContent = {
    ...chapterInfo,
    content: contentStr
  }

  let prevChapter = null
  let nextChapter = null
  const allChapters: { id: string; title: string }[] = []
  for (const volume of novel.volumes) {
    for (const ch of volume.chapters) {
      allChapters.push({ id: ch.id, title: ch.title })
    }
  }

  const currentIndex = allChapters.findIndex(c => c.id === chapterId)
  if (currentIndex > 0) prevChapter = allChapters[currentIndex - 1]
  if (currentIndex < allChapters.length - 1) nextChapter = allChapters[currentIndex + 1]

  return c.json<ApiResponse>({
    success: true,
    data: {
      ...chapterContent,
      prevChapter,
      nextChapter,
      novel: { id: novel.id, title: novel.title, author: novel.author }
    }
  })
})

novels.get('/:id', async (c) => {
  const id = c.req.param('id')
  const novelStr = await c.env.NOVEL_META.get(`novel:${id}`)

  if (!novelStr) {
    return c.json<ApiResponse>({ success: false, error: 'Novel not found' }, 404)
  }

  const novel = JSON.parse(novelStr) as Novel

  const deviceId = getDeviceId(c.req.raw)
  const progressStr = await c.env.READING_PROGRESS.get(`progress:${deviceId}:${id}`)
  const progress = progressStr ? JSON.parse(progressStr) : null

  return c.json<ApiResponse>({
    success: true,
    data: { ...novel, readingProgress: progress }
  })
})

async function generateTxtContent(env: Env, novelId: string, novel: Novel): Promise<string | null> {
  try {
    let content = `${novel.title}\n作者：${novel.author}\n\n${'='.repeat(50)}\n\n`

    for (const volume of novel.volumes) {
      content += `\n【${volume.title}】\n\n`
      for (const chapter of volume.chapters) {
        const chapterContent = await env.NOVEL_META.get(`chapter:${novelId}:${chapter.id}`)
        if (chapterContent) {
          content += `\n\n${chapter.title}\n\n${chapterContent}\n\n${'-'.repeat(30)}\n`
        }
      }
    }

    return content
  } catch {
    return null
  }
}

export { novels as novelRoutes }
