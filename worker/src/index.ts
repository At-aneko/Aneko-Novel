import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'
import type { Env } from '../../shared/types'
import { novelRoutes } from './routes/novels'
import { progressRoutes } from './routes/progress'
import { searchRoutes } from './routes/search'
import { categoryRoutes } from './routes/categories'
import { initSeedData } from './utils/seed'

const app = new Hono<{ Bindings: Env }>()

app.use('*', logger())
app.use('*', prettyJSON())
app.use('/api/*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type']
}))

app.get('/api/health', (c) => {
  return c.json({ success: true, data: { status: 'ok', timestamp: Date.now() } })
})

app.route('/api/novels', novelRoutes)
app.route('/api/progress', progressRoutes)
app.route('/api', searchRoutes)
app.route('/api/categories', categoryRoutes)

app.get('/api/init', async (c) => {
  await initSeedData(c.env)
  return c.json({ success: true, message: 'Seed data initialized' })
})

app.get('/files/*', async (c) => {
  const key = c.req.path.replace('/files/', '')
  const object = await c.env.NOVEL_BUCKET.get(key)

  if (!object) {
    return c.json({ success: false, error: 'File not found' }, 404)
  }

  const headers = new Headers()
  object.writeHttpMetadata(headers)
  headers.set('etag', object.httpEtag)
  headers.set('Cache-Control', 'public, max-age=31536000')

  return new Response(object.body, { headers })
})

app.use('*', async (c) => {
  const path = c.req.path
  if (path.startsWith('/api/') || path.startsWith('/files/')) {
    return c.json({ success: false, error: 'Not found' }, 404)
  }

  const asset = await c.env.ASSETS.fetch(c.req.raw)
  if (asset.status === 404) {
    const url = new URL(c.req.url)
    url.pathname = '/index.html'
    const indexAsset = await c.env.ASSETS.fetch(new Request(url.toString(), c.req.raw))
    return indexAsset
  }
  return asset
})

export default app
