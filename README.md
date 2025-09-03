# Coding Exercises

This repository contains two TypeScript coding exercises with their implementations and tests.

## Exercise 1: Fetch With Concurrency

A TypeScript utility that fetches multiple URLs with configurable concurrency limits while preserving response order.

### Features

- 🚀 Concurrency control with worker-based processing
- 📍 Response order preservation
- 🛡️ Graceful error handling
- 🧪 Full test coverage

### Usage

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

## Exercise 2: License Plate Generator

A TypeScript utility that generates the nth license plate number in a specific DMV sequence.

### Problem Description

The DMV generates license plates in a specific sequential pattern:

- Each plate has 6 alphanumeric characters
- Numbers always come before letters
- Sequence: 000000 → 999999 → 00000A → 99999Z → 0000AA → ... → ZZZZZZ

### Algorithm Details

The solution uses a block-based approach to efficiently calculate the nth plate:

#### Block Structure

The sequence is divided into 7 blocks based on digit/letter combinations:

| Block | Pattern              | Size                   | Range (n)                 |
| ----- | -------------------- | ---------------------- | ------------------------- |
| 0     | 6 digits             | 10⁶ = 1,000,000        | 0 - 999,999               |
| 1     | 5 digits + 1 letter  | 10⁵ × 26 = 2,600,000   | 1,000,000 - 3,599,999     |
| 2     | 4 digits + 2 letters | 10⁴ × 26² = 6,760,000  | 3,600,000 - 10,359,999    |
| 3     | 3 digits + 3 letters | 10³ × 26³ = 17,576,000 | 10,360,000 - 27,935,999   |
| 4     | 2 digits + 4 letters | 10² × 26⁴ = 45,697,600 | 27,936,000 - 73,633,599   |
| 5     | 1 digit + 5 letters  | 10 × 26⁵ = 118,813,760 | 73,633,600 - 192,447,359  |
| 6     | 0 digits + 6 letters | 26⁶ = 308,915,776      | 192,447,360 - 501,363,135 |

**Total possible plates: 501,363,136**

#### Algorithm Steps

1. **Block Detection**: Determine which block the input `n` falls into by subtracting block sizes sequentially
2. **Position Calculation**: Calculate the relative position within the block
3. **Component Separation**: Split the position into digit and letter components
4. **String Generation**:
   - Convert digit component to string with leading zeros
   - Convert letter component using base-26 encoding (0→A, 1→B, ..., 25→Z)

#### Example Walkthrough

For `n = 1,500,000`:

- Falls in block 1 (5 digits + 1 letter)
- Relative position: 1,500,000 - 1,000,000 = 500,000
- Letter space: 26¹ = 26
- Digit index: 500,000 ÷ 26 = 19,230
- Letter index: 500,000 % 26 = 8
- Result: "19230" + "I" = "19230I"

### Features

- 🎯 Efficient algorithm using block-based calculation
- 📊 Handles all 501,363,136 possible plates (000000 to ZZZZZZ)
- 🛡️ Input validation and error handling
- 🧪 Comprehensive test coverage

### Usage

```typescript
import { getNthPlate } from './src/getNthPlate'

const plate1 = getNthPlate(0) // Returns: "000000"
const plate2 = getNthPlate(1000000) // Returns: "00000A"
const plate3 = getNthPlate(3600000) // Returns: "0000AA"
```

`getNthPlate(n: number): string`

- **n**: A non-negative integer representing the position in the sequence
- **Returns**: A 6-character license plate string
- **Throws**: Error if n is invalid or out of range

## Testing

```bash
npm test
```

## Project Structure

```
├── exercise.ts                           # Exercise 1 problem definition
├── LicensePlatesProblemDefinition.ts     # Exercise 2 problem definition
├── src/
│   ├── fetchWithLimit.ts                 # Exercise 1 implementation
│   └── getNthPlate.ts                    # Exercise 2 implementation
└── tests/
    ├── fetchWithLimit.test.ts            # Exercise 1 tests
    └── getNthPlate.test.ts               # Exercise 2 tests
```

## License

MIT
