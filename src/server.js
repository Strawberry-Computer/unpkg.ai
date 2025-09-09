import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { generator } from './generator.js'
import { cache } from './cache.js'

const app = new Hono()

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ESM module generation
app.get('/esm/:prompt', async (c) => {
  try {
    const encodedPrompt = c.req.param('prompt')
    
    // Remove .js extension if present
    const cleanPrompt = encodedPrompt.replace(/\.js$/, '')
    
    // URL decode the prompt
    const prompt = decodeURIComponent(cleanPrompt)
    
    // Extract query parameters
    const model = c.req.query('model') || 'gpt-4'
    const seed = c.req.query('seed') || null
    
    const queryParams = { model, seed }
    
    // Check cache first
    const cached = await cache.get(prompt, queryParams)
    if (cached) {
      return c.text(cached, 200, {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'public, max-age=31536000'
      })
    }
    
    // Generate new module
    const moduleContent = await generator.generate(prompt, queryParams)
    
    // Cache the result
    await cache.set(prompt, queryParams, moduleContent)
    
    return c.text(moduleContent, 200, {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'public, max-age=31536000'
    })
    
  } catch (error) {
    console.error('Error generating module:', error)
    return c.json({ error: 'Failed to generate module' }, 500)
  }
})

const port = process.env.PORT || 3000

console.log(`Starting server on port ${port}`)
serve({
  fetch: app.fetch,
  port: parseInt(port)
})