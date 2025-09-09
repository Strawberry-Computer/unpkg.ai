# unpkg.ai

AI-powered ESM module generation service that creates JavaScript modules on-demand using Pollinations.ai.

## Overview

unpkg.ai generates and serves ES modules dynamically based on URL-encoded prompts. Include full TypeScript-style type definitions in your prompts to get modules with precise JSDoc annotations.

## Usage

### Basic Request
```
GET /esm/{url-encoded-prompt}.js
```

### With Parameters
```
GET /esm/{url-encoded-prompt}.js?model={model}&seed={seed}
```

## Query Parameters

| Parameter | Description | Example | Required |
|-----------|-------------|---------|----------|
| `model` | AI model to use for generation | `gpt-4`, `claude-3`, `mistral` | No |
| `seed` | Random seed for deterministic output | `12345` | No |

## Examples

### Currency formatter with full typedef
```javascript
// Request: https://unpkg.ai/esm/formatCurrency(amount:number,currency%3F:string):string.js
import { formatCurrency } from 'https://unpkg.ai/esm/formatCurrency(amount:number,currency%3F:string):string.js';

console.log(formatCurrency(1234.56, 'EUR')); // "€1,234.56"
```

### User fetcher with complex types
```javascript
// Request: https://unpkg.ai/esm/fetchUser(userId:number,options%3F:{includeProfile%3F:boolean,timeout%3F:number}):Promise<{id:number,name:string,email:string,createdAt:Date}>.js
import { fetchUser } from 'https://unpkg.ai/esm/fetchUser(userId:number,options%3F:{includeProfile%3F:boolean,timeout%3F:number}):Promise<{id:number,name:string,email:string,createdAt:Date}>.js';

const user = await fetchUser(123, { includeProfile: true, timeout: 5000 });
```

### React component with typed props
```javascript
// Request: https://unpkg.ai/esm/LoadingSpinner(props:{size:number,color:string,isVisible:boolean}):JSX.Element.js
import { LoadingSpinner } from 'https://unpkg.ai/esm/LoadingSpinner(props:{size:number,color:string,isVisible:boolean}):JSX.Element.js';

return <LoadingSpinner size={24} color="blue" isVisible={loading} />;
```

### Generic array utilities
```javascript
// Request: https://unpkg.ai/esm/chunk<T>(array:T[],size:number):T[][].js
import { chunk } from 'https://unpkg.ai/esm/chunk<T>(array:T[],size:number):T[][].js';

const numbers = [1, 2, 3, 4, 5, 6];
const chunked = chunk(numbers, 2); // [[1, 2], [3, 4], [5, 6]]
```

### API client with interface
```javascript
// Request: https://unpkg.ai/esm/createApiClient(config:{baseUrl:string,apiKey:string,timeout%3F:number}):{get<T>(path:string):Promise<T>,post<T>(path:string,data:any):Promise<T>}.js
import { createApiClient } from 'https://unpkg.ai/esm/createApiClient(config:{baseUrl:string,apiKey:string,timeout%3F:number}):{get<T>(path:string):Promise<T>,post<T>(path:string,data:any):Promise<T>}.js';

const api = createApiClient({ 
  baseUrl: 'https://api.example.com', 
  apiKey: 'key123' 
});
```

### With descriptive names requiring spaces
```javascript
// Request: https://unpkg.ai/esm/validate+email+address(email:string):boolean.js
import { validateEmailAddress } from 'https://unpkg.ai/esm/validate+email+address(email:string):boolean.js';

console.log(validateEmailAddress('test@example.com')); // true
```

### Event emitter with typed events
```javascript
// Request: https://unpkg.ai/esm/createEventEmitter<T+extends+Record<string,any>>():{on<K+extends+keyof+T>(event:K,handler:(data:T[K])=>void):void,emit<K+extends+keyof+T>(event:K,data:T[K]):void}.js
import { createEventEmitter } from 'https://unpkg.ai/esm/createEventEmitter<T+extends+Record<string,any>>():{on<K+extends+keyof+T>(event:K,handler:(data:T[K])=>void):void,emit<K+extends+keyof+T>(event:K,data:T[K]):void}.js';

const emitter = createEventEmitter();
```

## API Response Format

When you include TypeScript-style signatures, you get precise JSDoc annotations:

```javascript
/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} name
 * @property {string} email
 * @property {Date} createdAt
 */

/**
 * @typedef {Object} FetchUserOptions
 * @property {boolean} [includeProfile]
 * @property {number} [timeout]
 */

/**
 * @param {number} userId
 * @param {FetchUserOptions} [options]
 * @returns {Promise<User>}
 */
export async function fetchUser(userId, options = {}) {
  const { includeProfile = false, timeout = 5000 } = options;
  // Implementation matching the exact signature
}
```

## Prompt Syntax

### Function Signatures
```
functionName(param1:type1,param2%3F:type2):ReturnType
```

### Object Types
```
{property1:type1,property2%3F:type2}
```

### Generic Types
```
functionName<T>(param:T[]):T[]
functionName<T+extends+SomeType>(param:T):T
```

### Union Types
```
(param:string|number):boolean
```

### Array Types
```
param:string[]
param:Array<{id:number,name:string}>
```

### When to use `+` for spaces
- Multi-word function names: `validate+email+address`
- Generic constraints: `T+extends+Record`
- Complex type descriptions: `user+data+fetcher`

## API Endpoints

- `GET /esm/{url-encoded-prompt}.js` - Generate and serve ES module
- `GET /health` - Service health check

## Architecture

```
src/
├── server.js           # Express server with /esm/* routing
├── generator.js        # Module generation with TypeScript signature parsing
├── pollinations.js     # Pollinations.ai API integration
└── cache.js           # PostgreSQL caching layer
```

## Environment Variables

```bash
POLLINATIONS_API_KEY=your_api_key_here
PORT=3000
PG_URL=postgresql://user:pass@localhost:5432/unpkg_cache
CACHE_TTL=3600
NODE_ENV=production
```

## Database Schema

```sql
CREATE TABLE module_cache (
  id SERIAL PRIMARY KEY,
  prompt_hash VARCHAR(64) UNIQUE NOT NULL,
  query_params JSONB,
  module_content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_prompt_hash ON module_cache(prompt_hash);
```

## Installation & Development

```bash
npm install
createdb unpkg_cache
npm run migrate
npm run dev      # Development
npm start        # Production
```


## Caching Strategy

- PostgreSQL-based permanent caching
- Cache keys based on prompt hash and query parameters
- No expiration - modules cached indefinitely

## License

MIT License