import { pollinations } from './pollinations.js'
import { openrouter } from './openrouter.js'
import { createDebugger } from './debug.js'

const debug = createDebugger('generator')

// Model whitelist - centralized model validation
const ALLOWED_MODELS = new Set([
  'openai'
])

// Provider chain - try in order until success
function getProviderChain() {
  if (process.env.FORCE_OPENROUTER === 'yes') {
    return [openrouter]
  }
  return [pollinations, openrouter]
}

const SYSTEM_PROMPT = `<instructions>
You are a JavaScript module generator. Given a function signature or description, generate a complete ES module.

<requirements>
1. Export the requested function(s) using ES module syntax
2. The code must be functional and executable
3. Include realistic implementations, not just stubs
4. Handle edge cases appropriately
5. Use modern JavaScript features
6. Return ONLY the JavaScript code, no explanations or markdown
</requirements>

<examples>
<example>
<input>formatCurrency(amount:number,currency?:string):string</input>
<output>
export function formatCurrency(amount, currency = 'USD') {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  });
  return formatter.format(amount);
}
</output>
</example>

<example>
<input>chunk<T>(array:T[],size:number):T[][]</input>
<output>
export function chunk(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}
</output>
</example>
</examples>
</instructions>

Generate a complete ES module for the following request:`

export const generator = {
  async generate(prompt, queryParams = {}) {
    const { model = 'openai' } = queryParams
    
    // Validate model against whitelist
    if (!ALLOWED_MODELS.has(model)) {
      throw new Error(`Model '${model}' is not whitelisted. Allowed models: ${Array.from(ALLOWED_MODELS).join(', ')}`)
    }
    
    const fullPrompt = `${SYSTEM_PROMPT}\n\n${prompt}`
    debug('Generating for prompt:', prompt)
    debug('Model:', model, '(validated)')
    debug('Full prompt length:', fullPrompt.length)
    
    // Try each provider in chain until success
    const providers = getProviderChain()
    const errors = []
    
    debug(`Provider chain: ${providers.length === 1 ? 'OpenRouter only' : 'Pollinations -> OpenRouter'}`)
    
    for (const provider of providers) {
      try {
        debug(`Trying provider: ${provider.constructor?.name || 'unknown'}`)
        const response = await provider.generate(fullPrompt, queryParams)
        debug('Got response from provider, length:', response.content.length)
        debug('Provider used:', response.provider)
        
        debug('Module generation successful')
        
        return {
          content: response.content.trim(),
          provider: response.provider
        }
        
      } catch (error) {
        debug(`Provider failed: ${error.message}`)
        errors.push(`${provider.generate.name || 'unknown'}: ${error.message}`)
      }
    }
    
    // All providers failed
    throw new Error(`All providers failed: ${errors.join(', ')}`)
  }
}

