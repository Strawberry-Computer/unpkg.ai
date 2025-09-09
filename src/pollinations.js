export const pollinations = {
  async generate(prompt, options = {}) {
    const { model = 'openai', seed = null } = options
    
    try {
      // Build URL with prompt and optional query parameters
      let apiUrl = `https://text.pollinations.ai/${encodeURIComponent(prompt)}`
      
      const params = new URLSearchParams()
      if (model) params.append('model', model)
      if (seed) params.append('seed', seed)
      
      if (params.toString()) {
        apiUrl += `?${params.toString()}`
      }
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'unpkg.ai/1.0'
        }
      })
      
      if (!response.ok) {
        throw new Error(`Pollinations API error: ${response.status}`)
      }
      
      const result = await response.text()
      return result
      
    } catch (error) {
      console.error('Pollinations API error:', error)
      throw new Error('Failed to generate content from Pollinations API')
    }
  }
}