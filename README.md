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
**Request:** [https://unpkg.ai/esm/formatCurrency(amount:number,currency%3F:string):string.js](https://unpkg.ai/esm/formatCurrency(amount:number,currency%3F:string):string.js)

```javascript
import { formatCurrency } from 'https://unpkg.ai/esm/formatCurrency(amount:number,currency%3F:string):string.js';

console.log(formatCurrency(1234.56, 'EUR')); // "€1,234.56"
```

### User fetcher with complex types
**Request:** [https://unpkg.ai/esm/fetchUser(userId:number,options%3F:{includeProfile%3F:boolean,timeout%3F:number}):Promise<{id:number,name:string,email:string,createdAt:Date}>.js](https://unpkg.ai/esm/fetchUser(userId:number,options%3F:{includeProfile%3F:boolean,timeout%3F:number}):Promise<{id:number,name:string,email:string,createdAt:Date}>.js)

```javascript
import { fetchUser } from 'https://unpkg.ai/esm/fetchUser(userId:number,options%3F:{includeProfile%3F:boolean,timeout%3F:number}):Promise<{id:number,name:string,email:string,createdAt:Date}>.js';

const user = await fetchUser(123, { includeProfile: true, timeout: 5000 });
```

### React component with typed props
**Request:** [https://unpkg.ai/esm/LoadingSpinner(props:{size:number,color:string,isVisible:boolean}):JSX.Element.js](https://unpkg.ai/esm/LoadingSpinner(props:{size:number,color:string,isVisible:boolean}):JSX.Element.js)

```javascript
import { LoadingSpinner } from 'https://unpkg.ai/esm/LoadingSpinner(props:{size:number,color:string,isVisible:boolean}):JSX.Element.js';

return <LoadingSpinner size={24} color="blue" isVisible={loading} />;
```

### Array utilities
**Request:** [https://unpkg.ai/esm/chunk(array,size):array.js](https://unpkg.ai/esm/chunk(array,size):array.js)

```javascript
import { chunk } from 'https://unpkg.ai/esm/chunk(array,size):array.js';

const numbers = [1, 2, 3, 4, 5, 6];
const chunked = chunk(numbers, 2); // [[1, 2], [3, 4], [5, 6]]
```

### API client
**Request:** [https://unpkg.ai/esm/createApiClient(config):object.js](https://unpkg.ai/esm/createApiClient(config):object.js)

```javascript
import { createApiClient } from 'https://unpkg.ai/esm/createApiClient(config):object.js';

const api = createApiClient({ 
  baseUrl: 'https://api.example.com', 
  apiKey: 'key123' 
});
```

## Complex Frontend Examples with Documentation

### Advanced form validator with real-time feedback
**Request:** [https://unpkg.ai/esm/createFormValidator(config:{fields:{[key:string]:{required?:boolean,minLength?:number,pattern?:RegExp,validator?:(value:string)=>Promise<boolean>}},realTime?:boolean}):Promise<{validate:(formData:FormData)=>Promise<{isValid:boolean,errors:{[field:string]:string[]}}>,attachToForm:(form:HTMLFormElement)=>void,onFieldChange:(callback:(field:string,isValid:boolean,errors:string[])=>void)=>void}>|Creates+a+comprehensive+form+validation+system+with+real-time+validation,+custom+async+validators,+and+DOM+integration.+Automatically+highlights+invalid+fields,+shows+error+messages,+and+prevents+form+submission+until+all+fields+are+valid.js](https://unpkg.ai/esm/createFormValidator(config:{fields:{[key:string]:{required?:boolean,minLength?:number,pattern?:RegExp,validator?:(value:string)=>Promise<boolean>}},realTime?:boolean}):Promise<{validate:(formData:FormData)=>Promise<{isValid:boolean,errors:{[field:string]:string[]}}>,attachToForm:(form:HTMLFormElement)=>void,onFieldChange:(callback:(field:string,isValid:boolean,errors:string[])=>void)=>void}>|Creates+a+comprehensive+form+validation+system+with+real-time+validation,+custom+async+validators,+and+DOM+integration.+Automatically+highlights+invalid+fields,+shows+error+messages,+and+prevents+form+submission+until+all+fields+are+valid.js)

```javascript
import { createFormValidator } from 'https://unpkg.ai/esm/createFormValidator(config:{fields:{[key:string]:{required?:boolean,minLength?:number,pattern?:RegExp,validator?:(value:string)=>Promise<boolean>}},realTime?:boolean}):Promise<{validate:(formData:FormData)=>Promise<{isValid:boolean,errors:{[field:string]:string[]}}>,attachToForm:(form:HTMLFormElement)=>void,onFieldChange:(callback:(field:string,isValid:boolean,errors:string[])=>void)=>void}>|Creates+a+comprehensive+form+validation+system+with+real-time+validation,+custom+async+validators,+and+DOM+integration.+Automatically+highlights+invalid+fields,+shows+error+messages,+and+prevents+form+submission+until+all+fields+are+valid.js';

const validator = await createFormValidator({
  fields: {
    email: { required: true, pattern: /^[^@]+@[^@]+\.[^@]+$/ },
    username: { required: true, minLength: 3, validator: async (val) => {
      const response = await fetch(`/api/check-username/${val}`);
      return response.ok;
    }},
    password: { required: true, minLength: 8 }
  },
  realTime: true
});

const form = document.getElementById('signupForm');
validator.attachToForm(form);
```

### Drag and drop file uploader with progress tracking
**Request:** [https://unpkg.ai/esm/createFileUploader(config:{endpoint:string,maxFileSize?:number,allowedTypes?:string[],multiple?:boolean,chunkSize?:number}):Promise<{attachTo:(element:HTMLElement)=>void,upload:(files:FileList)=>Promise<{success:boolean,results:{file:string,url?:string,error?:string}[]}>,onProgress:(callback:(file:string,percent:number)=>void)=>void}>|Creates+a+modern+drag-and-drop+file+uploader+with+chunked+uploads,+progress+tracking,+and+file+type+validation.+Features+visual+drag+feedback,+upload+previews,+retry+functionality,+and+automatic+error+handling.js](https://unpkg.ai/esm/createFileUploader(config:{endpoint:string,maxFileSize?:number,allowedTypes?:string[],multiple?:boolean,chunkSize?:number}):Promise<{attachTo:(element:HTMLElement)=>void,upload:(files:FileList)=>Promise<{success:boolean,results:{file:string,url?:string,error?:string}[]}>,onProgress:(callback:(file:string,percent:number)=>void)=>void}>|Creates+a+modern+drag-and-drop+file+uploader+with+chunked+uploads,+progress+tracking,+and+file+type+validation.+Features+visual+drag+feedback,+upload+previews,+retry+functionality,+and+automatic+error+handling.js)

```javascript
import { createFileUploader } from 'https://unpkg.ai/esm/createFileUploader(config:{endpoint:string,maxFileSize?:number,allowedTypes?:string[],multiple?:boolean,chunkSize?:number}):Promise<{attachTo:(element:HTMLElement)=>void,upload:(files:FileList)=>Promise<{success:boolean,results:{file:string,url?:string,error?:string}[]}>,onProgress:(callback:(file:string,percent:number)=>void)=>void}>|Creates+a+modern+drag-and-drop+file+uploader+with+chunked+uploads,+progress+tracking,+and+file+type+validation.+Features+visual+drag+feedback,+upload+previews,+retry+functionality,+and+automatic+error+handling.js';

const uploader = await createFileUploader({
  endpoint: '/api/upload',
  maxFileSize: 50 * 1024 * 1024, // 50MB
  allowedTypes: ['image/*', 'video/*', '.pdf'],
  multiple: true,
  chunkSize: 1024 * 1024 // 1MB chunks
});

const dropZone = document.getElementById('dropZone');
uploader.attachTo(dropZone);

uploader.onProgress((filename, percent) => {
  document.getElementById(`progress-${filename}`).value = percent;
});
```

### Rich text editor with markdown support
**Request:** [https://unpkg.ai/esm/createRichEditor(config:{container:string,features?:string[],theme?:string,plugins?:string[],autoSave?:boolean}):Promise<{getContent:()=>string,setContent:(content:string)=>void,insertText:(text:string)=>void,onContentChange:(callback:(content:string,wordCount:number)=>void)=>void,exportAs:(format:'html'|'markdown'|'pdf')=>Promise<string|Blob>}>|Creates+a+feature-rich+WYSIWYG+editor+with+markdown+shortcuts,+syntax+highlighting,+and+plugin+system.+Supports+tables,+images,+code+blocks,+and+real-time+collaboration.+Includes+auto-save,+version+history,+and+export+capabilities.js](https://unpkg.ai/esm/createRichEditor(config:{container:string,features?:string[],theme?:string,plugins?:string[],autoSave?:boolean}):Promise<{getContent:()=>string,setContent:(content:string)=>void,insertText:(text:string)=>void,onContentChange:(callback:(content:string,wordCount:number)=>void)=>void,exportAs:(format:'html'|'markdown'|'pdf')=>Promise<string|Blob>}>|Creates+a+feature-rich+WYSIWYG+editor+with+markdown+shortcuts,+syntax+highlighting,+and+plugin+system.+Supports+tables,+images,+code+blocks,+and+real-time+collaboration.+Includes+auto-save,+version+history,+and+export+capabilities.js)

```javascript
import { createRichEditor } from 'https://unpkg.ai/esm/createRichEditor(config:{container:string,features?:string[],theme?:string,plugins?:string[],autoSave?:boolean}):Promise<{getContent:()=>string,setContent:(content:string)=>void,insertText:(text:string)=>void,onContentChange:(callback:(content:string,wordCount:number)=>void)=>void,exportAs:(format:'html'|'markdown'|'pdf')=>Promise<string|Blob>}>|Creates+a+feature-rich+WYSIWYG+editor+with+markdown+shortcuts,+syntax+highlighting,+and+plugin+system.+Supports+tables,+images,+code+blocks,+and+real-time+collaboration.+Includes+auto-save,+version+history,+and+export+capabilities.js';

const editor = await createRichEditor({
  container: '#editor',
  features: ['bold', 'italic', 'lists', 'links', 'images', 'tables', 'code'],
  theme: 'modern',
  plugins: ['markdown', 'syntax-highlight'],
  autoSave: true
});

editor.onContentChange((content, wordCount) => {
  document.getElementById('wordCount').textContent = `${wordCount} words`;
});

editor.setContent('# Welcome\n\nStart typing...');
```

### Interactive data visualization dashboard
**Request:** [https://unpkg.ai/esm/createDashboard(config:{container:string,layout?:string,responsive?:boolean}):Promise<{addChart:(id:string,type:string,data:any[],options?:any)=>void,updateChart:(id:string,data:any[])=>void,addFilter:(name:string,type:string,values:any[])=>void,onFilterChange:(callback:(filters:any)=>void)=>void,exportDashboard:(format:'png'|'pdf')=>Promise<Blob>}>|Creates+an+interactive+dashboard+with+multiple+chart+types,+real-time+data+updates,+filtering,+and+responsive+layout.+Supports+line+charts,+bar+charts,+pie+charts,+and+heatmaps.+Features+drag-and-drop+layout+editing+and+theme+switching.js](https://unpkg.ai/esm/createDashboard(config:{container:string,layout?:string,responsive?:boolean}):Promise<{addChart:(id:string,type:string,data:any[],options?:any)=>void,updateChart:(id:string,data:any[])=>void,addFilter:(name:string,type:string,values:any[])=>void,onFilterChange:(callback:(filters:any)=>void)=>void,exportDashboard:(format:'png'|'pdf')=>Promise<Blob>}>|Creates+an+interactive+dashboard+with+multiple+chart+types,+real-time+data+updates,+filtering,+and+responsive+layout.+Supports+line+charts,+bar+charts,+pie+charts,+and+heatmaps.+Features+drag-and-drop+layout+editing+and+theme+switching.js)

```javascript
import { createDashboard } from 'https://unpkg.ai/esm/createDashboard(config:{container:string,layout?:string,responsive?:boolean}):Promise<{addChart:(id:string,type:string,data:any[],options?:any)=>void,updateChart:(id:string,data:any[])=>void,addFilter:(name:string,type:string,values:any[])=>void,onFilterChange:(callback:(filters:any)=>void)=>void,exportDashboard:(format:'png'|'pdf')=>Promise<Blob>}>|Creates+an+interactive+dashboard+with+multiple+chart+types,+real-time+data+updates,+filtering,+and+responsive+layout.+Supports+line+charts,+bar+charts,+pie+charts,+and+heatmaps.+Features+drag-and-drop+layout+editing+and+theme+switching.js';

const dashboard = await createDashboard({
  container: '#dashboard',
  layout: 'grid',
  responsive: true
});

dashboard.addChart('sales', 'line', [
  { x: 'Jan', y: 1000 },
  { x: 'Feb', y: 1200 },
  { x: 'Mar', y: 1100 }
], { title: 'Monthly Sales' });

dashboard.addFilter('dateRange', 'date', ['2024-01-01', '2024-12-31']);
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