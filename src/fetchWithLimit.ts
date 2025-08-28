export async function fetchWithConcurrency(
  urls: string[],
  maxConcurrency: number
): Promise<(unknown | Error)[]> {
  const results = new Array(urls.length).fill(null)
  if (urls.length === 0) {
    return results
  }

  const urlIndices = Array.from({ length: urls.length }, (_, i) => i)

  // Fetch the next URL in the array until the array is empty
  async function fetchNextUrl() {
    while (urlIndices.length > 0) {
      const index = urlIndices.shift()!

      try {
        const response = await fetch(urls[index])
        results[index] = await response.json()
      } catch (error) {
        results[index] = error as Error
      }
    }
  }

  // Create an array of promises to fetch the URLs in parallel
  const tasks = Array.from(
    { length: Math.min(maxConcurrency, urls.length) },
    () => fetchNextUrl()
  )

  await Promise.all(tasks)
  return results
}
