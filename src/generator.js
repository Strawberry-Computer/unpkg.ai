import { pollinations } from './pollinations.js'

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
      
      const response = await pollinations.generate(fullPrompt, queryParams)
      
      // Basic validation - ensure it starts with export
      if (!response.trim().startsWith('export')) {
        throw new Error('Generated module does not start with export')
      }
      
      return response.trim()
      
    } catch (error) {
      console.error('Generator error:', error)
      
      // Fallback - generate a basic stub
      const functionName = extractFunctionName(prompt)
      return generateFallback(functionName, prompt)
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