import { pollinations } from './pollinations.js'
import { createDebugger } from './debug.js'

const debug = createDebugger('generator')

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
    try {
      const fullPrompt = `${SYSTEM_PROMPT}\n\n${prompt}`
      debug('Generating for prompt:', prompt)
      debug('Full prompt length:', fullPrompt.length)
      
      const response = await pollinations.generate(fullPrompt, queryParams)
      debug('Got response from API, length:', response.content.length)
      debug('Provider used:', response.provider)
      
      debug('Module generation successful')
      
      return {
        content: response.content.trim(),
        provider: response.provider
      }
      
    } catch (error) {
      debug('Generator error:', error.message)
      throw error
    }
  }
}

function extractFunctionName(prompt) {
  // Try to extract function name from signature like "functionName(params)"
  const match = prompt.match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/)
  return match ? match[1] : 'generatedFunction'
}

function generateFallback(functionName, originalPrompt) {
  return `// Generated from: ${originalPrompt}
export function ${functionName}(...args) {
  throw new Error('Function ${functionName} is not yet implemented');
}`
}