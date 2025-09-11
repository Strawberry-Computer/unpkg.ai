import { createDebugger } from './debug.js'

const debug = createDebugger('openrouter')

const MODEL_MAPPING = {
  'openai': 'openai/gpt-5-nano'
}

export const openrouter = {
  async generate(prompt, options = {}) {
    const { model = 'openai', seed = null, fetch: fetchFn = fetch } = options
    
    if (!MODEL_MAPPING[model]) {
      throw new Error(`Model '${model}' is not whitelisted for OpenRouter`)
    }
    
    const mappedModel = MODEL_MAPPING[model]
    
    debug('API request with model:', model, '-> mapped to:', mappedModel, 'seed:', seed)
    
    try {
      const requestBody = {
        model: mappedModel,
        messages: [{ role: 'user', content: prompt }]
      }
      
      if (seed) {
        requestBody.seed = seed
      }
      
      const response = await fetchFn('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'User-Agent': 'unpkg.ai/1.0'
        },
        body: JSON.stringify(requestBody)
      })
      
      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`)
      }
      
      const result = await response.json()
      
      debug('Raw API response:', result)
      
      if (!result.choices || !result.choices[0] || !result.choices[0].message) {
        throw new Error('Invalid response format from OpenRouter API')
      }
      
      const content = result.choices[0].message.content
      debug('Extracted content length:', content.length)
      
      return {
        content,
        provider: 'openrouter'
      }
      
    } catch (error) {
      console.error('OpenRouter API error:', error)
      throw new Error(`OpenRouter API failed: ${error.message}`)
    }
  }
}