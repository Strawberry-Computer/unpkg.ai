import pg from 'pg'

const { Client } = pg

async function migrate() {
  const client = new Client({
    connectionString: process.env.PG_URL || 'postgresql://localhost:5432/unpkg_cache'
  })

  try {
    await client.connect()
    console.log('Connected to database')

    // Create table
    await client.query(`
      CREATE TABLE IF NOT EXISTS module_cache (
        id SERIAL PRIMARY KEY,
        prompt_hash VARCHAR(64) UNIQUE NOT NULL,
        prompt_text TEXT NOT NULL,
        query_params JSONB,
        module_content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `)

    // Add prompt_text column if it doesn't exist (for existing databases)
    await client.query(`
      ALTER TABLE module_cache 
      ADD COLUMN IF NOT EXISTS prompt_text TEXT;
    `)

    // Add provider column to track which service generated the content
    await client.query(`
      ALTER TABLE module_cache 
      ADD COLUMN IF NOT EXISTS provider VARCHAR(50);
    `)

    // Create index
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_prompt_hash ON module_cache(prompt_hash);
    `)

    console.log('Migration completed successfully')
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  } finally {
    await client.end()
  }
}

migrate()