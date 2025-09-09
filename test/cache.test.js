import test from 'tape'
import crypto from 'crypto'

// Mock cache implementation for testing
const mockCache = {
  store: new Map(),
  
  async get(prompt, queryParams) {
    const hash = crypto.createHash('sha256')
      .update(prompt + JSON.stringify(queryParams))
      .digest('hex')
    return this.store.get(hash) || null
  },
  
  async set(prompt, queryParams, content) {
    const hash = crypto.createHash('sha256')
      .update(prompt + JSON.stringify(queryParams))
      .digest('hex')
    this.store.set(hash, content)
    return true
  }
}

test('Cache hashing', (t) => {
  t.plan(3)

  const prompt1 = 'formatCurrency(amount:number):string'
  const params1 = { model: 'gpt-4', seed: null }
  
  const hash1 = crypto.createHash('sha256')
    .update(prompt1 + JSON.stringify(params1))
    .digest('hex')

  const hash2 = crypto.createHash('sha256')
    .update(prompt1 + JSON.stringify(params1))
    .digest('hex')

  const hash3 = crypto.createHash('sha256')
    .update(prompt1 + JSON.stringify({ model: 'claude-3', seed: null }))
    .digest('hex')

  t.equal(hash1, hash2, 'same prompt + params should generate same hash')
  t.notEqual(hash1, hash3, 'different params should generate different hash')
  t.equal(hash1.length, 64, 'SHA-256 hash should be 64 characters')
})

test('Cache operations', async (t) => {
  t.plan(3)

  const prompt = 'test(x:number):number'
  const params = { model: 'gpt-4', seed: '123' }
  const content = 'export function test(x) { return x * 2; }'

  // Test cache miss
  const result1 = await mockCache.get(prompt, params)
  t.equal(result1, null, 'should return null for cache miss')

  // Test cache set
  await mockCache.set(prompt, params, content)
  
  // Test cache hit
  const result2 = await mockCache.get(prompt, params)
  t.equal(result2, content, 'should return cached content on hit')

  // Test different params
  const result3 = await mockCache.get(prompt, { model: 'claude-3', seed: '123' })
  t.equal(result3, null, 'should miss cache with different params')
})