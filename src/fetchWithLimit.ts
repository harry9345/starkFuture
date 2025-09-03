export async function fetchWithConcurrency<T = unknown>(
  urls: string[],
  maxConcurrency: number
): Promise<(T | Error)[]> {
  if (!Array.isArray(urls)) {
    throw new TypeError('urls must be an array')
  }
  if (!Number.isInteger(maxConcurrency) || maxConcurrency < 1) {
    throw new RangeError('maxConcurrency must be a positive integer')
  }

  const results: (T | Error)[] = new Array(urls.length).fill(undefined)
  if (urls.length === 0) {
    return results
  }

  const urlIndices = Array.from({ length: urls.length }, (_, i) => i)

  // fetch the next URL in the array until the array is empty
  async function fetchNextUrl(): Promise<void> {
    while (urlIndices.length > 0) {
      const index = urlIndices.shift()!
      try {
        const response = await fetch(urls[index])
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status} for ${urls[index]}`)
        }
        results[index] = await response.json()
      } catch (error) {
        results[index] =
          error instanceof Error ? error : new Error(String(error))
      }
    }
  }

  // create an array of promises to fetch the URLs in parallel
  const tasks = Array.from(
    { length: Math.min(maxConcurrency, urls.length) },
    () => fetchNextUrl()
  )

  await Promise.all(tasks)
  return results
}
