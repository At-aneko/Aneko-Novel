import { Hono } from 'hono'
import type { Env, Category, Novel } from '../../../shared/types'

const categories = new Hono<{ Bindings: Env }>()

categories.get('/', async (c) => {
  const listStr = await c.env.NOVEL_META.get('novel:list')
  const novelIds: string[] = listStr ? JSON.parse(listStr) : []

  const categoryCount: Record<string, number> = {}
  for (const id of novelIds) {
    const novelStr = await c.env.NOVEL_META.get(`novel:${id}`)
    if (novelStr) {
      const novel = JSON.parse(novelStr)
      categoryCount[novel.category] = (categoryCount[novel.category] || 0) + 1
    }
  }

  const defaultCategories: Category[] = [
    { id: 'all', name: '全部', icon: '✨', count: novelIds.length },
    { id: 'fantasy', name: '奇幻', icon: '🔮', count: categoryCount['fantasy'] || 0 },
    { id: 'romance', name: '恋爱', icon: '💕', count: categoryCount['romance'] || 0 },
    { id: 'campus', name: '校园', icon: '🎒', count: categoryCount['campus'] || 0 },
    { id: 'scifi', name: '科幻', icon: '🚀', count: categoryCount['scifi'] || 0 },
    { id: 'mystery', name: '悬疑', icon: '🔍', count: categoryCount['mystery'] || 0 },
    { id: 'adventure', name: '冒险', icon: '⚔️', count: categoryCount['adventure'] || 0 },
    { id: 'daily', name: '日常', icon: '🌸', count: categoryCount['daily'] || 0 }
  ]

  return c.json({
    success: true,
    data: defaultCategories
  })
})

categories.get('/:category/novels', async (c) => {
  const category = c.req.param('category')
  const page = parseInt(c.req.query('page') || '1')
  const pageSize = parseInt(c.req.query('pageSize') || '12')

  const listStr = await c.env.NOVEL_META.get('novel:list')
  const novelIds: string[] = listStr ? JSON.parse(listStr) : []

  let novelList: Novel[] = []
  for (const id of novelIds) {
    const novelStr = await c.env.NOVEL_META.get(`novel:${id}`)
    if (novelStr) {
      const novel = JSON.parse(novelStr) as Novel
      if (category === 'all' || novel.category === category) {
        novelList.push(novel)
      }
    }
  }

  novelList.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

  const total = novelList.length
  const start = (page - 1) * pageSize
  const items = novelList.slice(start, start + pageSize)

  return c.json({
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

export { categories as categoryRoutes }
