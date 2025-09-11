import test from 'tape'
import { pollinations } from '../src/pollinations.js'
import { openrouter } from '../src/openrouter.js'
import { generator } from '../src/generator.js'

const originalEnv = process.env

function createMockResponse(status, data, contentType = 'application/json') {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(typeof data === 'string' ? data : JSON.stringify(data))
  }
}

test('OpenRouter fallback - successful fallback when pollinations fails', async (t) => {
  t.plan(3)

  let pollinationsCalled = false
  let openrouterCalled = false

  const mockFetch = async (url) => {
    if (url.includes('pollinations.ai')) {
      pollinationsCalled = true
      throw new Error('Network error')
    }
    
    if (url.includes('openrouter.ai')) {
      openrouterCalled = true
      return createMockResponse(200, {
        choices: [{ message: { content: 'export function test() { return "openrouter"; }' } }]
      })
    }
    
    throw new Error('Unexpected URL')
  }

  // Set required environment variable
  process.env.OPENROUTER_API_KEY = 'test-key'

  try {
    const result = await generator.generate('test prompt', { fetch: mockFetch })
    
    t.ok(pollinationsCalled, 'pollinations API should be called first')
    t.ok(openrouterCalled, 'openrouter API should be called as fallback')
    t.equal(result.provider, 'openrouter', 'should indicate openrouter as provider')
    
  } catch (error) {
    t.fail(`Should not fail with fallback: ${error.message}`)
  }
  
  // Cleanup
  process.env = { ...originalEnv }
})

test('OpenRouter fallback - both APIs fail', async (t) => {
  t.plan(1)

  const mockFetch = async (url) => {
    if (url.includes('pollinations.ai')) {
      throw new Error('Pollinations network error')
    }
    
    if (url.includes('openrouter.ai')) {
      throw new Error('OpenRouter network error')
    }
    
    throw new Error('Unexpected URL')
  }

  process.env.OPENROUTER_API_KEY = 'test-key'

  try {
    await generator.generate('test prompt', { fetch: mockFetch })
    t.fail('Should have thrown an error when both APIs fail')
    
  } catch (error) {
    t.ok(error.message.includes('All providers failed'), 
         'should indicate all providers failed')
  }
  
  // Cleanup
  process.env = { ...originalEnv }
})

test('OpenRouter direct usage with FORCE_OPENROUTER', async (t) => {
  t.plan(2)

  let pollinationsCalled = false
  let openrouterCalled = false

  const mockFetch = async (url) => {
    if (url.includes('pollinations.ai')) {
      pollinationsCalled = true
      return createMockResponse(200, 'export function test() { return "pollinations"; }')
    }
    
    if (url.includes('openrouter.ai')) {
      openrouterCalled = true
      return createMockResponse(200, {
        choices: [{ message: { content: 'export function test() { return "openrouter"; }' } }]
      })
    }
    
    throw new Error('Unexpected URL')
  }

  // Force OpenRouter usage
  process.env.FORCE_OPENROUTER = 'yes'
  process.env.OPENROUTER_API_KEY = 'test-key'

  try {
    const result = await generator.generate('test prompt', { fetch: mockFetch })
    
    t.notOk(pollinationsCalled, 'pollinations API should not be called when forced')
    t.ok(openrouterCalled, 'openrouter API should be called directly when forced')
    
  } catch (error) {
    t.fail(`Should not fail: ${error.message}`)
  }
  
  // Cleanup
  process.env = { ...originalEnv }
})

test('OpenRouter API response validation', async (t) => {
  t.plan(3)

  process.env.OPENROUTER_API_KEY = 'test-key'

  // Test invalid response format
  const mockFetchInvalid = async (url) => {
    if (url.includes('openrouter.ai')) {
      return createMockResponse(200, { invalid: 'response' })
    }
    throw new Error('Unexpected URL')
  }

  try {
    await openrouter.generate('test prompt', { fetch: mockFetchInvalid })
    t.fail('Should have thrown an error for invalid response')
    
  } catch (error) {
    t.ok(error.message.includes('OpenRouter API failed: Invalid response format'), 'should validate response format')
  }

  // Test missing choices
  const mockFetchEmpty = async (url) => {
    if (url.includes('openrouter.ai')) {
      return createMockResponse(200, { choices: [] })
    }
    throw new Error('Unexpected URL')
  }

  try {
    await openrouter.generate('test prompt', { fetch: mockFetchEmpty })
    t.fail('Should have thrown an error for empty choices')
    
  } catch (error) {
    t.ok(error.message.includes('OpenRouter API failed: Invalid response format'), 'should validate choices array')
  }

  // Test HTTP error status
  const mockFetchError = async (url) => {
    if (url.includes('openrouter.ai')) {
      return createMockResponse(500, 'Internal Server Error')
    }
    throw new Error('Unexpected URL')
  }

  try {
    await openrouter.generate('test prompt', { fetch: mockFetchError })
    t.fail('Should have thrown an error for HTTP 500')
    
  } catch (error) {
    t.ok(error.message.includes('OpenRouter API failed: OpenRouter API error: 500'), 'should handle HTTP errors')
  }
  
  // Cleanup
  process.env = { ...originalEnv }
})

test('OpenRouter model mapping', async (t) => {
  t.plan(1)

  let requestBody = null

  const mockFetch = async (url, options) => {
    if (url.includes('openrouter.ai')) {
      requestBody = JSON.parse(options.body)
      return createMockResponse(200, {
        choices: [{ message: { content: 'export function test() { return "test"; }' } }]
      })
    }
    throw new Error('Unexpected URL')
  }

  process.env.OPENROUTER_API_KEY = 'test-key'

  try {
    // Test default model mapping
    await openrouter.generate('test prompt', { model: 'openai', fetch: mockFetch })
    t.equal(requestBody.model, 'openai/gpt-5-nano', 'should map openai to gpt-5-nano')
    
  } catch (error) {
    t.fail(`Should not fail: ${error.message}`)
  }
  
  // Cleanup
  process.env = { ...originalEnv }
})

test('OpenRouter model whitelist validation', async (t) => {
  t.plan(2)

  const mockFetch = async (url, options) => {
    if (url.includes('openrouter.ai')) {
      return createMockResponse(200, {
        choices: [{ message: { content: 'export function test() { return "test"; }' } }]
      })
    }
    throw new Error('Unexpected URL')
  }

  process.env.OPENROUTER_API_KEY = 'test-key'

  try {
    // Test valid model
    const result = await openrouter.generate('test prompt', { model: 'openai', fetch: mockFetch })
    t.ok(result.content, 'should accept whitelisted model')
    
  } catch (error) {
    t.fail(`Should not fail for valid model: ${error.message}`)
  }

  try {
    // Test invalid model
    await openrouter.generate('test prompt', { model: 'unknown-model', fetch: mockFetch })
    t.fail('Should have thrown an error for non-whitelisted model')
    
  } catch (error) {
    t.ok(error.message.includes('not whitelisted'), 'should reject non-whitelisted model')
  }
  
  // Cleanup
  process.env = { ...originalEnv }
})

test('OpenRouter seed parameter handling', async (t) => {
  t.plan(2)

  let requestBody = null

  const mockFetch = async (url, options) => {
    if (url.includes('openrouter.ai')) {
      requestBody = JSON.parse(options.body)
      return createMockResponse(200, {
        choices: [{ message: { content: 'export function test() { return "test"; }' } }]
      })
    }
    throw new Error('Unexpected URL')
  }

  process.env.OPENROUTER_API_KEY = 'test-key'

  try {
    // Test with seed
    await openrouter.generate('test prompt', { seed: 12345, fetch: mockFetch })
    t.equal(requestBody.seed, 12345, 'should include seed in request when provided')
    
    // Test without seed
    await openrouter.generate('test prompt', { fetch: mockFetch })
    t.notOk(requestBody.hasOwnProperty('seed'), 'should not include seed when not provided')
    
  } catch (error) {
    t.fail(`Should not fail: ${error.message}`)
  }
  
  // Cleanup
  process.env = { ...originalEnv }
})

test('Pollinations API error handling', async (t) => {
  t.plan(1)

  const mockFetch = async (url) => {
    if (url.includes('pollinations.ai')) {
      return createMockResponse(404, 'Not Found')
    }
    // Mock OpenRouter to succeed so we only test the Pollinations error
    if (url.includes('openrouter.ai')) {
      return createMockResponse(200, {
        choices: [{ message: { content: 'export function test() { return "openrouter"; }' } }]
      })
    }
    throw new Error('Unexpected URL')
  }

  process.env.OPENROUTER_API_KEY = 'test-key'

  try {
    const result = await generator.generate('test prompt', { fetch: mockFetch })
    
    // Should fallback and not throw
    t.equal(result.provider, 'openrouter', 'should fallback on Pollinations HTTP error')
    
  } catch (error) {
    t.fail(`Should not fail with fallback: ${error.message}`)
  }
  
  // Cleanup
  process.env = { ...originalEnv }
})

test('Pollinations URL parameter encoding', async (t) => {
  t.plan(1)

  let capturedUrl = ''

  const mockFetch = async (url) => {
    capturedUrl = url
    if (url.includes('pollinations.ai')) {
      return createMockResponse(200, 'export function test() { return "test"; }')
    }
    throw new Error('Unexpected URL')
  }

  try {
    const prompt = 'a prompt with special characters like / and ?'
    await pollinations.generate(prompt, { model: 'dall-e-3', seed: 999, fetch: mockFetch })
    
    const expectedUrl = `https://text.pollinations.ai/a%20prompt%20with%20special%20characters%20like%20%2F%20and%20%3F?model=dall-e-3&seed=999`
    t.equal(capturedUrl, expectedUrl, 'should correctly encode prompt and parameters')
    
  } catch (error) {
    t.fail(`Should not fail: ${error.message}`)
  }
  
  // Cleanup
  process.env = { ...originalEnv }
})

test('Pollinations raw text response handling', async (t) => {
  t.plan(1)

  const rawTextResponse = `
    export function generatedCode() {
      console.log("This is some generated code.");
    }
  `

  const mockFetch = async (url) => {
    if (url.includes('pollinations.ai')) {
      return createMockResponse(200, rawTextResponse, 'text/plain')
    }
    throw new Error('Unexpected URL')
  }

  try {
    const result = await pollinations.generate('test prompt', { fetch: mockFetch })
    
    t.equal(result.content, rawTextResponse, 'should handle raw text response correctly')
    
  } catch (error) {
    t.fail(`Should not fail: ${error.message}`)
  }
  
  // Cleanup
  process.env = { ...originalEnv }
})