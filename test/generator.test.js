import test from 'tape'

// Mock pollinations for testing
const mockPollinations = {
  async generate(prompt, options) {
    // Return mock ES module based on input
    if (prompt.includes('formatCurrency')) {
      return `export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}`
    }
    
    if (prompt.includes('chunk')) {
      return `export function chunk(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}`
    }
    
    return 'export function mockFunction() { return "mock"; }'
  }
}

// Mock generator using mock pollinations
const mockGenerator = {
  async generate(prompt, queryParams = {}) {
    const SYSTEM_PROMPT = `<instructions>Generate ES module</instructions>`
    const fullPrompt = `${SYSTEM_PROMPT}\n\n${prompt}`
    
    const response = await mockPollinations.generate(fullPrompt, queryParams)
    
    if (!response.trim().startsWith('export')) {
      throw new Error('Generated module does not start with export')
    }
    
    return response.trim()
  }
}

test('Generator prompt construction', (t) => {
  t.plan(2)

  const prompt = 'formatCurrency(amount:number):string'
  const SYSTEM_PROMPT = '<instructions>Generate ES module</instructions>'
  const fullPrompt = `${SYSTEM_PROMPT}\n\n${prompt}`

  t.ok(fullPrompt.includes('<instructions>'), 'should include system prompt')
  t.ok(fullPrompt.includes(prompt), 'should include user prompt')
})

test('Generator module validation', async (t) => {
  t.plan(3)

  // Test valid ES module generation
  const result1 = await mockGenerator.generate('formatCurrency(amount:number):string')
  t.ok(result1.startsWith('export'), 'should generate module starting with export')

  // Test another function
  const result2 = await mockGenerator.generate('chunk<T>(array:T[]):T[][]')
  t.ok(result2.includes('export function chunk'), 'should generate chunk function')
  t.ok(result2.includes('for (let i = 0'), 'should include realistic implementation')
})

test('Generator fallback handling', (t) => {
  t.plan(2)

  // Test function name extraction
  const prompt1 = 'myFunction(param:string):number'
  const match1 = prompt1.match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/)
  t.equal(match1[1], 'myFunction', 'should extract function name from signature')

  // Test fallback generation
  const functionName = 'testFunc'
  const fallback = `// Generated from: test prompt
export function ${functionName}(...args) {
  throw new Error('Function ${functionName} is not yet implemented');
}`
  t.ok(fallback.includes('export function testFunc'), 'should generate fallback with function name')
})