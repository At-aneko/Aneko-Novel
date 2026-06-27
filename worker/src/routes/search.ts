import { Hono } from 'hono'
import type { Env, Novel } from '../../../shared/types'

const search = new Hono<{ Bindings: Env }>()

search.get('/search', async (c) => {
  const q = c.req.query('q')?.toLowerCase().trim()

  if (!q || q.length < 1) {
    return c.json({ success: true, data: [] })
  }

  const listStr = await c.env.NOVEL_META.get('novel:list')
  const novelIds: string[] = listStr ? JSON.parse(listStr) : []

  const results: Novel[] = []
  for (const id of novelIds) {
    const novelStr = await c.env.NOVEL_META.get(`novel:${id}`)
    if (novelStr) {
      const novel = JSON.parse(novelStr) as Novel
      const titleMatch = novel.title.toLowerCase().includes(q)
      const authorMatch = novel.author.toLowerCase().includes(q)
      const descMatch = novel.description.toLowerCase().includes(q)
      const tagMatch = novel.tags.some(t => t.toLowerCase().includes(q))

      if (titleMatch || authorMatch || descMatch || tagMatch) {
        results.push(novel)
      }
    }
  }

  return c.json({
    success: true,
    data: results
  })
})

export { search as searchRoutes }
