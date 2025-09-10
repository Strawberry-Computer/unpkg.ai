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

## Interactive Examples

### Tip Calculator with Bill Splitting
**Request:** [https://unpkg.ai/esm/calculateTip(amount:number,percentage:number,people%3F:number):{tip:number,total:number,perPerson:number}.js](https://unpkg.ai/esm/calculateTip(amount:number,percentage:number,people%3F:number):{tip:number,total:number,perPerson:number}.js)

```javascript
import { calculateTip } from 'https://unpkg.ai/esm/calculateTip(amount:number,percentage:number,people%3F:number):{tip:number,total:number,perPerson:number}.js';

const result = calculateTip(85.50, 18, 4);
console.log(result); // { tip: 15.39, total: 100.89, perPerson: 25.22 }
```

### Secure Password Generator
**Request:** [https://unpkg.ai/esm/generatePassword(options%3F:{length%3F:number,symbols%3F:boolean,numbers%3F:boolean,uppercase%3F:boolean,lowercase%3F:boolean}):{password:string,strength:number,feedback:string[]}.js](https://unpkg.ai/esm/generatePassword(options%3F:{length%3F:number,symbols%3F:boolean,numbers%3F:boolean,uppercase%3F:boolean,lowercase%3F:boolean}):{password:string,strength:number,feedback:string[]}.js)

```javascript
import { generatePassword } from 'https://unpkg.ai/esm/generatePassword(options%3F:{length%3F:number,symbols%3F:boolean,numbers%3F:boolean,uppercase%3F:boolean,lowercase%3F:boolean}):{password:string,strength:number,feedback:string[]}.js';

const result = generatePassword({ length: 16, symbols: true, numbers: true });
console.log(result); // { password: 'K#9m$L2pQ!7vX8nR', strength: 95, feedback: ['Very strong'] }
```

### Color Palette Generator
**Request:** [https://unpkg.ai/esm/generatePalette(baseColor:string,count%3F:number,type%3F:'complementary'|'analogous'|'triadic'):{colors:{hex:string,rgb:string,hsl:string,name:string}[],scheme:string}.js](https://unpkg.ai/esm/generatePalette(baseColor:string,count%3F:number,type%3F:'complementary'|'analogous'|'triadic'):{colors:{hex:string,rgb:string,hsl:string,name:string}[],scheme:string}.js)

```javascript
import { generatePalette } from 'https://unpkg.ai/esm/generatePalette(baseColor:string,count%3F:number,type%3F:'complementary'|'analogous'|'triadic'):{colors:{hex:string,rgb:string,hsl:string,name:string}[],scheme:string}.js';

const palette = generatePalette('#3B82F6', 5, 'complementary');
console.log(palette.colors); // Array of 5 complementary colors with multiple formats
```

### Complete Minesweeper Game
**Request:** [https://unpkg.ai/esm/initMinesweeper(container:string,options%3F:{width%3F:number,height%3F:number,mines%3F:number}):{start:()=>void,reset:()=>void,getStats:()=>{games:number,wins:number,time:number}}.js](https://unpkg.ai/esm/initMinesweeper(container:string,options%3F:{width%3F:number,height%3F:number,mines%3F:number}):{start:()=>void,reset:()=>void,getStats:()=>{games:number,wins:number,time:number}}.js)

```javascript
import { initMinesweeper } from 'https://unpkg.ai/esm/initMinesweeper(container:string,options%3F:{width%3F:number,height%3F:number,mines%3F:number}):{start:()=>void,reset:()=>void,getStats:()=>{games:number,wins:number,time:number}}.js';

// Create container for the game
const gameContainer = document.createElement('div');
gameContainer.id = 'game-container';
document.body.appendChild(gameContainer);

// Creates a complete playable minesweeper game with UI
const game = initMinesweeper('#game-container', { width: 10, height: 10, mines: 15 });
game.start(); // Full game with click handlers, animations, timer, score tracking
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
functionName(param1:type1,param2?:type2):ReturnType
```

### Object Types
```
{property1:type1,property2?:type2}
```

### Union Types
```
(param:string|number):boolean
```

### Array Types
```
param:array
param:{foo:string,bar:number}[]
```

### Documentation with Types
For complex modules that need detailed documentation, append documentation after the type signature using `|`:
```
functionName(param:type):ReturnType|Your documentation here describing the module behavior
```


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