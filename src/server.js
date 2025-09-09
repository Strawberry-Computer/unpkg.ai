import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { generator } from './generator.js'
import { cache } from './cache.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = new Hono()

// Root endpoint with HTML usage instructions
app.get('/', (c) => {
  const htmlContent = readFileSync(join(__dirname, 'templates', 'index.html'), 'utf-8')
  return c.html(htmlContent)
})

// LLMs.txt endpoint
app.get('/llms.txt', (c) => {
  const txtContent = readFileSync(join(__dirname, 'templates', 'llms.txt'), 'utf-8')
  return c.text(txtContent, 200, {
    'Content-Type': 'text/plain; charset=utf-8'
  })
})

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