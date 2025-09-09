import test from 'tape'

// Mock HTTP response for testing server logic
function mockResponse() {
  const headers = {}
  let statusCode = 200
  let body = ''

  return {
    json: (data) => {
      headers['Content-Type'] = 'application/json'
      body = JSON.stringify(data)
      return { headers, status: statusCode, body }
    },
    text: (data, status = 200, customHeaders = {}) => {
      statusCode = status
      Object.assign(headers, customHeaders)
      body = data
      return { headers, status: statusCode, body }
    }
  }
}

test('Health endpoint response', (t) => {
  t.plan(2)

  const mockC = {
    json: (data) => ({ status: 'ok', data })
  }

  const response = mockC.json({ status: 'ok', timestamp: new Date().toISOString() })
  t.equal(response.status, 'ok', 'should return ok status')
  t.ok(response.data.timestamp, 'should include timestamp')
})

test('ESM endpoint URL parsing', (t) => {
  t.plan(4)

  // Mock Hono context
  const mockContext = {
    req: {
      param: (key) => {
        const params = { 'prompt': 'formatCurrency(amount:number):string.js' }
        return params[key]
      },
      query: (key) => {
        const query = { 'model': 'gpt-4', 'seed': '12345' }
        return query[key]
      }
    }
  }

  const encodedPrompt = mockContext.req.param('prompt')
  const cleanPrompt = encodedPrompt.replace(/\.js$/, '')
  const prompt = decodeURIComponent(cleanPrompt)
  const model = mockContext.req.query('model') || 'gpt-4'
  const seed = mockContext.req.query('seed') || null

  t.equal(cleanPrompt, 'formatCurrency(amount:number):string', 'should remove .js extension')
  t.equal(prompt, 'formatCurrency(amount:number):string', 'should decode URL')
  t.equal(model, 'gpt-4', 'should extract model parameter')
  t.equal(seed, '12345', 'should extract seed parameter')
})

test('Response headers for ES modules', (t) => {
  t.plan(2)

  const response = mockResponse()
  const result = response.text('export function test() {}', 200, {
    'Content-Type': 'application/javascript',
    'Cache-Control': 'public, max-age=31536000'
  })

  t.equal(result.headers['Content-Type'], 'application/javascript', 'should set JS content type')
  t.equal(result.headers['Cache-Control'], 'public, max-age=31536000', 'should set long cache control')
})

test('Error handling', (t) => {
  t.plan(2)

  const response = mockResponse()
  const errorResult = response.json({ error: 'Failed to generate module' })
  
  t.equal(errorResult.headers['Content-Type'], 'application/json', 'should set JSON content type for errors')
  t.ok(JSON.parse(errorResult.body).error, 'should include error message')
})