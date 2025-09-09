import test from 'tape'

test('URL decoding functionality', (t) => {
  t.plan(4)

  // Test basic URL decoding
  const encoded1 = 'formatCurrency(amount:number,currency%3F:string):string'
  const decoded1 = decodeURIComponent(encoded1)
  t.equal(decoded1, 'formatCurrency(amount:number,currency?:string):string', 'should decode %3F to ?')

  // Test plus signs to spaces
  const encoded2 = 'validate+email+address(email:string):boolean'
  const decoded2 = decodeURIComponent(encoded2.replace(/\+/g, ' '))
  t.equal(decoded2, 'validate email address(email:string):boolean', 'should convert + to spaces')

  // Test .js extension removal
  const withExtension = 'formatCurrency(amount:number):string.js'
  const withoutExtension = withExtension.replace(/\.js$/, '')
  t.equal(withoutExtension, 'formatCurrency(amount:number):string', 'should remove .js extension')

  // Test complex generics
  const encoded3 = 'chunk%3CT%3E(array:T%5B%5D,size:number):T%5B%5D%5B%5D'
  const decoded3 = decodeURIComponent(encoded3)
  t.equal(decoded3, 'chunk<T>(array:T[],size:number):T[][]', 'should decode complex generic syntax')
})

test('Query parameter parsing', (t) => {
  t.plan(2)

  // Mock URL with query parameters
  const params = new URLSearchParams('model=claude-3&seed=12345')
  
  t.equal(params.get('model'), 'claude-3', 'should extract model parameter')
  t.equal(params.get('seed'), '12345', 'should extract seed parameter')
})