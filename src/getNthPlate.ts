/**
 * Generates the nth license plate number in the DMV sequence.
 *
 * The sequence follows a specific pattern where numbers always come before letters:
 * 000000 → 999999 → 00000A → 99999Z → 0000AA → ... → ZZZZZZ
 *
 * @param n - A non-negative integer representing the position in the sequence (0 to 501,363,135)
 * @returns A 6-character license plate string
 * @throws Error if n is invalid or out of range
 */
export function getNthPlate(n: number): string {
  if (!Number.isInteger(n) || n < 0) {
    throw new Error('"n" must be a non-negative integer')
  }

  const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

  // calculate block sizes for each digit/letter combination
  const blockSizes: number[] = []
  for (let digits = 6; digits >= 0; digits--) {
    const letters = 6 - digits
    blockSizes.push(Math.pow(10, digits) * Math.pow(26, letters))
  }

  const total = blockSizes.reduce((s, v) => s + v, 0)
  if (n >= total) {
    throw new Error(`"n" is out of range (0 to ${total.toLocaleString()})`)
  }

  // find which block (digit/letter combination) this n falls into
  let blockIndex = 0
  while (n >= blockSizes[blockIndex]) {
    n -= blockSizes[blockIndex]
    blockIndex++
  }

  const numOfDigits = 6 - blockIndex
  const numOfLetters = blockIndex

  // split n into digit and letter components
  const letterSpace = Math.pow(26, numOfLetters)
  const digitIndex = Math.floor(n / letterSpace)
  const letterIndex = n % letterSpace

  // generate digit string with leading zeros
  const digitStr =
    numOfDigits > 0 ? digitIndex.toString().padStart(numOfDigits, '0') : ''

  // convert letter index to letter string
  let l = letterIndex
  let letterStr = ''
  for (let i = 0; i < numOfLetters; i++) {
    const charIndex = l % 26
    letterStr = LETTERS[charIndex] + letterStr
    l = Math.floor(l / 26)
  }

  return digitStr + letterStr
}
