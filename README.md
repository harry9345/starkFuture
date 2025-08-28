# Fetch With Concurrency

A TypeScript utility that fetches multiple URLs with configurable concurrency limits while preserving response order.

## Features

- 🚀 Concurrency control with worker-based processing
- 📍 Response order preservation
- 🛡️ Graceful error handling
- 🧪 Full test coverage

## Usage

```typescript
import { fetchWithConcurrency } from './src/fetchWithLimit'

const urls = [
  'https://jsonplaceholder.typicode.com/posts/1',
  'https://jsonplaceholder.typicode.com/posts/2',
]
const results = await fetchWithConcurrency(urls, 2)
// Returns: [data1, data2] - maintains order
```

## API

`fetchWithConcurrency(urls: string[], maxConcurrency: number): Promise<(unknown | Error)[]>`

## Testing

```bash
npm test
```

## License

MIT
