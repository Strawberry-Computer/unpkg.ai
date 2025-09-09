import pg from 'pg'
import crypto from 'crypto'

const { Pool } = pg

let pool = null

function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.PG_URL || 'postgresql://localhost:5432/unpkg_cache'
    })
  }
  return pool
}

function hashPrompt(prompt, queryParams) {
  const content = prompt + JSON.stringify(queryParams)
  return crypto.createHash('sha256').update(content).digest('hex')
}

export const cache = {
  async get(prompt, queryParams) {
    try {
      const hash = hashPrompt(prompt, queryParams)
      const pool = getPool()
      
      const result = await pool.query(
        'SELECT module_content FROM module_cache WHERE prompt_hash = $1',
        [hash]
      )
      
      return result.rows.length > 0 ? result.rows[0].module_content : null
    } catch (error) {
      console.error('Cache get error:', error)
      return null
    }
  },

  async set(prompt, queryParams, moduleContent) {
    try {
      const hash = hashPrompt(prompt, queryParams)
      const pool = getPool()
      
      await pool.query(
        `INSERT INTO module_cache (prompt_hash, query_params, module_content, created_at) 
         VALUES ($1, $2, $3, NOW()) 
         ON CONFLICT (prompt_hash) DO UPDATE SET 
         module_content = EXCLUDED.module_content,
         query_params = EXCLUDED.query_params`,
        [hash, JSON.stringify(queryParams), moduleContent]
      )
      
      return true
    } catch (error) {
      console.error('Cache set error:', error)
      return false
    }
  }
}