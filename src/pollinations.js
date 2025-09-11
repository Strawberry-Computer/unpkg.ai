import { createDebugger } from './debug.js'

const debug = createDebugger('pollinations')

export const pollinations = {
  async generate(prompt, options = {}) {
    const { model = 'openai', seed = null, fetch: fetchFn = fetch } = options
    
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
      throw error
    }
  }
}