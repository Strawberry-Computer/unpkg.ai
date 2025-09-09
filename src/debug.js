const debugEnv = process.env.DEBUG || ''
const enabledPatterns = debugEnv.split(',').map(p => p.trim()).filter(Boolean)

function globToRegex(pattern) {
  return new RegExp(
    '^' + pattern
      .replace(/\./g, '\\.')
      .replace(/\*/g, '.*')
      .replace(/\?/g, '.')
    + '$'
  )
}

function isEnabled(namespace) {
  if (!enabledPatterns.length) return false
  
  return enabledPatterns.some(pattern => {
    if (pattern === '*') return true
    return globToRegex(pattern).test(namespace)
  })
}

export function createDebugger(namespace) {
  const enabled = isEnabled(namespace)
  
  return function debug(message, ...args) {
    if (!enabled) return
    
    const timestamp = new Date().toISOString()
    const prefix = `[${timestamp}] ${namespace}`
    
    if (typeof message === 'object') {
      console.log(prefix, JSON.stringify(message, null, 2), ...args)
    } else {
      console.log(prefix, message, ...args)
    }
  }
}