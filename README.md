# unpkg.ai

AI-powered ESM module generation service that creates JavaScript modules on-demand using Pollinations.ai.

## Zero Friction Promise

🎯 **No signup required**  
🎯 **No API keys needed**  
🎯 **No authentication**  
🎯 **No rate limits for basic usage**  
🎯 **Just import and code**

Perfect for prototyping, learning, and production when you need modules fast.

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
import { calculateTip } from 'https://unpkg.ai/esm/calculateTip(amount:number,percentage:number,people?:number):{tip:number,total:number,perPerson:number}.js';

const result = calculateTip(85.50, 18, 4);
console.log(result); // { tip: 15.39, total: 100.89, perPerson: 25.22 }
```

### Secure Password Generator
**Request:** [https://unpkg.ai/esm/generatePassword(options%3F:{length%3F:number,symbols%3F:boolean,numbers%3F:boolean,uppercase%3F:boolean,lowercase%3F:boolean}):{password:string,strength:number,feedback:string[]}.js](https://unpkg.ai/esm/generatePassword(options%3F:{length%3F:number,symbols%3F:boolean,numbers%3F:boolean,uppercase%3F:boolean,lowercase%3F:boolean}):{password:string,strength:number,feedback:string[]}.js)

```javascript
import { generatePassword } from 'https://unpkg.ai/esm/generatePassword(options?:{length?:number,symbols?:boolean,numbers?:boolean,uppercase?:boolean,lowercase?:boolean}):{password:string,strength:number,feedback:string[]}.js';

const result = generatePassword({ length: 16, symbols: true, numbers: true });
console.log(result); // { password: 'K#9m$L2pQ!7vX8nR', strength: 95, feedback: ['Very strong'] }
```

### Color Palette Generator
**Request:** [https://unpkg.ai/esm/generatePalette(baseColor:string,count%3F:number,type%3F:'complementary'|'analogous'|'triadic'):{colors:{hex:string,rgb:string,hsl:string,name:string}[],scheme:string}.js](https://unpkg.ai/esm/generatePalette(baseColor:string,count%3F:number,type%3F:'complementary'|'analogous'|'triadic'):{colors:{hex:string,rgb:string,hsl:string,name:string}[],scheme:string}.js)

```javascript
import { generatePalette } from 'https://unpkg.ai/esm/generatePalette(baseColor:string,count?:number,type?:'complementary'|'analogous'|'triadic'):{colors:{hex:string,rgb:string,hsl:string,name:string}[],scheme:string}.js';

const palette = generatePalette('#3B82F6', 5, 'complementary');
console.log(palette.colors); // Array of 5 complementary colors with multiple formats
```

### Complete Minesweeper Game
**Request:** [https://unpkg.ai/esm/initMinesweeper(container:string,options%3F:{width%3F:number,height%3F:number,mines%3F:number}):{start:()=>void,reset:()=>void,getStats:()=>{games:number,wins:number,time:number}}.js](https://unpkg.ai/esm/initMinesweeper(container:string,options%3F:{width%3F:number,height%3F:number,mines%3F:number}):{start:()=>void,reset:()=>void,getStats:()=>{games:number,wins:number,time:number}}.js)

```javascript
import { initMinesweeper } from 'https://unpkg.ai/esm/initMinesweeper(container:string,options?:{width?:number,height?:number,mines?:number}):{start:()=>void,reset:()=>void,getStats:()=>{games:number,wins:number,time:number}}.js';

// Create container for the game
const gameContainer = document.createElement('div');
gameContainer.id = 'game-container';
document.body.appendChild(gameContainer);

// Creates a complete playable minesweeper game with UI
const game = initMinesweeper('#game-container', { width: 10, height: 10, mines: 15 });
console.log('Game initialized:', game);
game.start(); // Full game with click handlers, animations, timer, score tracking
```

### Rich Text Editor
**Request:** [https://unpkg.ai/esm/createRichEditor(container:string):{getContent:()=>string,setContent:(content:string)=>void,insertText:(text:string)=>void}|Rich+text+editor+with+bold+italic+lists+links+features.js](https://unpkg.ai/esm/createRichEditor(container:string):{getContent:()=>string,setContent:(content:string)=>void,insertText:(text:string)=>void}|Rich+text+editor+with+bold+italic+lists+links+features.js)

```javascript
import { createRichEditor } from 'https://unpkg.ai/esm/createRichEditor(container:string):{getContent:()=>string,setContent:(content:string)=>void,insertText:(text:string)=>void}|Rich+text+editor+with+bold+italic+lists+links+features.js';

// Create container for the editor
const editorContainer = document.createElement('div');
editorContainer.id = 'editor';
editorContainer.style.cssText = 'border: 1px solid #e5e7eb; border-radius: 8px; min-height: 200px; background: white;';
document.body.appendChild(editorContainer);

const editor = createRichEditor('#editor');
console.log('Editor created:', editor);
editor.setContent('# Welcome\\n\\nStart typing...');
```

### Interactive Data Dashboard
**Request:** [https://unpkg.ai/esm/createDashboard(containerSelector:string):{addChart:(id:string,type:string,data:{x:string,y:number}[])=>void,updateChart:(id:string,data:{x:string,y:number}[])=>void,addFilter:(name:string,callback:(data:{x:string,y:number}[])=>{x:string,y:number}[])=>void}|Interactive+dashboard+with+single+line+chart+and+filtering+that+preserves+data+order.js](https://unpkg.ai/esm/createDashboard(containerSelector:string):{addChart:(id:string,type:string,data:{x:string,y:number}[])=>void,updateChart:(id:string,data:{x:string,y:number}[])=>void,addFilter:(name:string,callback:(data:{x:string,y:number}[])=>{x:string,y:number}[])=>void}|Interactive+dashboard+with+single+line+chart+and+filtering+that+preserves+data+order.js)

```javascript
import { createDashboard } from 'https://unpkg.ai/esm/createDashboard(containerSelector:string):{addChart:(id:string,type:string,data:{x:string,y:number}[])=>void,updateChart:(id:string,data:{x:string,y:number}[])=>void,addFilter:(name:string,callback:(data:{x:string,y:number}[])=>{x:string,y:number}[])=>void}|Interactive+dashboard+with+single+line+chart+and+filtering+that+preserves+data+order.js';

// Create container for the dashboard
const dashboardContainer = document.createElement('div');
dashboardContainer.id = 'dashboard';
dashboardContainer.style.cssText = 'border: 1px solid #e5e7eb; border-radius: 8px; min-height: 300px; background: white; padding: 1rem;';
document.body.appendChild(dashboardContainer);

const dashboard = createDashboard('#dashboard');

// Add interactive sales chart
dashboard.addChart('sales', 'line', [
  { x: 'Jan', y: 1000 }, { x: 'Feb', y: 1200 }, { x: 'Mar', y: 800 }, { x: 'Apr', y: 1500 }
]);
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