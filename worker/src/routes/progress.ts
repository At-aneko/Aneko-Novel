import { Hono } from 'hono'
import type { Env, ReadingProgress } from '../../../shared/types'
import { getDeviceId } from '../utils/device'

const progress = new Hono<{ Bindings: Env }>()

progress.get('/:novelId', async (c) => {
  const novelId = c.req.param('novelId')
  const deviceId = getDeviceId(c.req.raw)
  const key = `progress:${deviceId}:${novelId}`

  const progressStr = await c.env.READING_PROGRESS.get(key)
  if (!progressStr) {
    return c.json({ success: true, data: null })
  }

  return c.json({
    success: true,
    data: JSON.parse(progressStr)
  })
})

progress.post('/:novelId', async (c) => {
  const novelId = c.req.param('novelId')
  const deviceId = getDeviceId(c.req.raw)
  const key = `progress:${deviceId}:${novelId}`

  const body = await c.req.json<{ chapterId: string; scrollPosition: number }>()
  const progress: ReadingProgress = {
    novelId,
    chapterId: body.chapterId,
    scrollPosition: body.scrollPosition || 0,
    lastReadAt: new Date().toISOString()
  }

  await c.env.READING_PROGRESS.put(key, JSON.stringify(progress))

  return c.json({ success: true, data: progress })
})

export { progress as progressRoutes }
