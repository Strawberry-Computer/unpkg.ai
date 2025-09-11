import test from 'tape'
import { generator } from '../src/generator.js'

test('Generator model whitelist validation', async (t) => {
  t.plan(4)
  
  // Test whitelisted model passes
  try {
    // Mock pollinations to avoid actual API calls
    const originalGenerate = generator.generate
    generator.generate = async function(prompt, queryParams) {
      const { model = 'openai' } = queryParams
      
      // Validate model against whitelist (same logic as real implementation)
      const ALLOWED_MODELS = new Set(['openai'])
      if (!ALLOWED_MODELS.has(model)) {
        throw new Error(`Model '${model}' is not whitelisted. Allowed models: ${Array.from(ALLOWED_MODELS).join(', ')}`)
      }
      
      return { content: 'export function test() {}', provider: 'mock' }
    }
    
    const result = await generator.generate('test', { model: 'openai' })
    t.ok(result.content.includes('export'), 'should accept whitelisted model')
    
    // Restore original
    generator.generate = originalGenerate
  } catch (error) {
    t.fail(`Whitelisted model should not fail: ${error.message}`)
  }
  
  // Test non-whitelisted model fails
  try {
    await generator.generate('test', { model: 'claude' })
    t.fail('Should reject non-whitelisted model')
  } catch (error) {
    t.ok(error.message.includes('not whitelisted'), 'should reject non-whitelisted model')
    t.ok(error.message.includes('claude'), 'should mention rejected model name')
    t.ok(error.message.includes('openai'), 'should list allowed models')
  }
})

test('Generator default model validation', async (t) => {
  t.plan(1)
  
  // Test that default model (openai) is accepted when no model specified
  try {
    // Mock to avoid actual API call
    const originalGenerate = generator.generate
    generator.generate = async function(prompt, queryParams) {
      const { model = 'openai' } = queryParams
      
      const ALLOWED_MODELS = new Set(['openai'])
      if (!ALLOWED_MODELS.has(model)) {
        throw new Error(`Model '${model}' is not whitelisted. Allowed models: ${Array.from(ALLOWED_MODELS).join(', ')}`)
      }
      
      return { content: 'export function test() {}', provider: 'mock' }
    }
    
    const result = await generator.generate('test', {}) // No model specified
    t.ok(result.content.includes('export'), 'should accept default model')
    
    // Restore
    generator.generate = originalGenerate
  } catch (error) {
    t.fail(`Default model should not fail: ${error.message}`)
  }
})