# unpkg.ai - AI-powered ESM module generation service

## Zero Friction Promise
No signup required. No API keys needed. No authentication. Just import and code.

## Overview
unpkg.ai generates and serves ES modules dynamically based on URL-encoded prompts. Include full TypeScript-style type definitions in your prompts to get modules with precise JSDoc annotations.

## API Endpoints

### Generate ES Module
GET /esm/{url-encoded-prompt}.js

Parameters:
- model: AI model to use (optional, default: gpt-4)
- seed: Random seed for deterministic output (optional)

### Health Check
GET /health

### LLM Documentation
GET /llms.txt

## Prompt Syntax

### Function Signatures
functionName(param1:type1,param2%3F:type2):ReturnType

### Object Types
{property1:type1,property2%3F:type2}

### Union Types
(param:string|number):boolean

### Array Types
param:array
param:{foo:string,bar:number}[]

### Documentation with Types
For complex modules that need detailed documentation, append documentation after the type signature using |:
functionName(param:type):ReturnType|Your documentation here describing the module behavior

### Special Characters
- Use %3F for optional parameters (?)
- Use + for spaces in multi-word names
- Use standard URL encoding for special characters

## Examples

### Currency formatter with full typedef
https://unpkg.ai/esm/formatCurrency(amount:number,currency%3F:string):string.js

### User fetcher with complex types
https://unpkg.ai/esm/fetchUser(userId:number,options%3F:{includeProfile%3F:boolean,timeout%3F:number}):Promise<{id:number,name:string,email:string,createdAt:Date}>.js

### React component with typed props
https://unpkg.ai/esm/LoadingSpinner(props:{size:number,color:string,isVisible:boolean}):JSX.Element.js

### Array utilities
https://unpkg.ai/esm/chunk(array,size):array.js

### API client
https://unpkg.ai/esm/createApiClient(config):object.js

## Complex Frontend Examples

### Complete minesweeper game with UI
https://unpkg.ai/esm/initMinesweeper(container:string,options%3F:{width%3F:number,height%3F:number,mines%3F:number}):{start:()=>void,reset:()=>void,getStats:()=>{games:number,wins:number,time:number}}.js

### Rich text editor with markdown support
https://unpkg.ai/esm/createRichEditor(container:string):{getContent:()=>string,setContent:(content:string)=>void,insertText:(text:string)=>void}|Rich+text+editor+with+bold+italic+lists+links+features.js

### Interactive data visualization dashboard
https://unpkg.ai/esm/createDashboard(containerSelector:string):{addChart:(id:string,type:string,data:{x:string,y:number}[])=>void,updateChart:(id:string,data:{x:string,y:number}[])=>void,addFilter:(name:string,callback:(data:{x:string,y:number}[])=>{x:string,y:number}[])=>void}|Interactive+dashboard+with+single+line+chart+and+filtering+that+preserves+data+order.js

## Usage in Code

```javascript
import { formatCurrency } from 'https://unpkg.ai/esm/formatCurrency(amount:number,currency%3F:string):string.js';
console.log(formatCurrency(1234.56, 'EUR')); // "€1,234.56"
```

```javascript
import { fetchUser } from 'https://unpkg.ai/esm/fetchUser(userId:number,options%3F:{includeProfile%3F:boolean,timeout%3F:number}):Promise<{id:number,name:string,email:string,createdAt:Date}>.js';
const user = await fetchUser(123, { includeProfile: true, timeout: 5000 });
```

```javascript
import { LoadingSpinner } from 'https://unpkg.ai/esm/LoadingSpinner(props:{size:number,color:string,isVisible:boolean}):JSX.Element.js';
return <LoadingSpinner size={24} color="blue" isVisible={loading} />;
```

```javascript
import { chunk } from 'https://unpkg.ai/esm/chunk(array,size):array.js';
const numbers = [1, 2, 3, 4, 5, 6];
const chunked = chunk(numbers, 2); // [[1, 2], [3, 4], [5, 6]]
```

```javascript
import { createApiClient } from 'https://unpkg.ai/esm/createApiClient(config):object.js';
const api = createApiClient({ 
  baseUrl: 'https://api.example.com', 
  apiKey: 'key123' 
});
```

```javascript
import { initMinesweeper } from 'https://unpkg.ai/esm/initMinesweeper(container:string,options%3F:{width%3F:number,height%3F:number,mines%3F:number}):{start:()=>void,reset:()=>void,getStats:()=>{games:number,wins:number,time:number}}.js';
const gameContainer = document.createElement('div');
gameContainer.id = 'game-container';
document.body.appendChild(gameContainer);
const game = initMinesweeper('#game-container', { width: 10, height: 10, mines: 15 });
game.start(); // Full game with click handlers, animations, timer, score tracking
```

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

## Features
- Zero friction - No signup, no API keys, no authentication required
- Permanent caching - Generated modules cached indefinitely
- TypeScript integration via JSDoc annotations
- CDN-ready with long cache headers
- Support for complex type signatures
- Deterministic output with seed parameter

## Response Format
Generated modules include precise JSDoc type annotations based on the TypeScript-style signatures in the prompt.

## Architecture
- Express/Hono server with /esm/* routing
- Module generation with TypeScript signature parsing
- Pollinations.ai API integration
- PostgreSQL caching layer