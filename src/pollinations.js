import { createDebugger } from './debug.js'
import { openrouter } from './openrouter.js'

const debug = createDebugger('pollinations')

export const pollinations = {
  async generate(prompt, options = {}) {
    const { model = 'openai', seed = null, fetch: fetchFn = fetch } = options
    
    // Check if we should force OpenRouter usage
    if (process.env.FORCE_OPENROUTER === 'yes') {
      debug('FORCE_OPENROUTER=yes, using OpenRouter directly')
      return await openrouter.generate(prompt, { ...options, fetch: fetchFn })
    }
    
    debug('API request with model:', model, 'seed:', seed)
    
    try {
      // Build URL with prompt and optional query parameters
      let apiUrl = `https://text.pollinations.ai/${encodeURIComponent(prompt)}`
      
      const params = new URLSearchParams()
      if (model) params.append('model', model)
      if (seed) params.append('seed', seed)
      
      if (params.toString()) {
        apiUrl += `?${params.toString()}`
      }
      
      const response = await fetchFn(apiUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'unpkg.ai/1.0'
        }
      })
      
      if (!response.ok) {
        throw new Error(`Pollinations API error: ${response.status}`)
      }
      
      const result = await response.text()
      
      debug('Raw API response length:', result.length)
      debug('Response starts with export?', result.trim().startsWith('export'))
      debug('Raw API response:', result)
      
      return {
        content: result,
        provider: 'pollinations'
      }
      
    } catch (error) {
      console.error('Pollinations API error:', error)
      debug('Falling back to OpenRouter due to error:', error.message)
      
      try {
        return await openrouter.generate(prompt, { ...options, fetch: fetchFn })
      } catch (fallbackError) {
        console.error('OpenRouter fallback also failed:', fallbackError)
        throw new Error(`Both APIs failed - Pollinations: ${error.message}, OpenRouter: ${fallbackError.message}`)
      }
    }
  }
}