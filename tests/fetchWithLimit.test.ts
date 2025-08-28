import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchWithConcurrency } from '../src/fetchWithLimit'

const urls = [
  'https://jsonplaceholder.typicode.com/posts/1',
  'https://jsonplaceholder.typicode.com/posts/2',
  'https://jsonplaceholder.typicode.com/posts/3',
  'https://jsonplaceholder.typicode.com/posts/4',
  'https://jsonplaceholder.typicode.com/posts/5',
]
const MAX_CONCURRENCY = 2

describe('fetchWithConcurrency', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn((input: RequestInfo | URL) => {
        const url = String(input)
        const i = urls.indexOf(url)
        if (i === -1) throw new Error('Invalid URL')

        return new Promise(resolve =>
          setTimeout(() =>
            resolve({
              json: () => Promise.resolve(`response for ${url}`),
            })
          )
        )
      })
    )
  })

  it('should start fetching ASAP', async () => {
    const startTimes: number[] = []
    const mockFetch = vi.mocked(fetch)
    mockFetch.mockImplementation(async (url: RequestInfo | URL) => {
      const index = urls.indexOf(String(url))
      startTimes[index] = Date.now()

      await new Promise(resolve => setTimeout(resolve, 100 + index * 50))

      return {
        json: () => Promise.resolve({ url: String(url) }),
      } as Response
    })

    await fetchWithConcurrency(urls, MAX_CONCURRENCY)
    const timeDiff = Math.abs(startTimes[1] - startTimes[0])
    // should be start within 50ms of each other
    expect(timeDiff).toBeLessThan(50)

    // third url diff
    const timeToThird = Math.abs(startTimes[2] - startTimes[0])
    expect(timeToThird).toBeGreaterThan(100) //after first req completed
    expect(timeToThird).toBeLessThan(200) // but not much latter
  })

  it('fetches all URLs with concurrency limit', async () => {
    const res = await fetchWithConcurrency(urls, MAX_CONCURRENCY)

    expect(fetch).toHaveBeenCalledTimes(urls.length)

    // Verify that fetch was called with the correct URLs
    urls.forEach((url, index) => {
      expect(fetch).toHaveBeenNthCalledWith(index + 1, url)
    })

    expect(res).toEqual([
      'response for https://jsonplaceholder.typicode.com/posts/1',
      'response for https://jsonplaceholder.typicode.com/posts/2',
      'response for https://jsonplaceholder.typicode.com/posts/3',
      'response for https://jsonplaceholder.typicode.com/posts/4',
      'response for https://jsonplaceholder.typicode.com/posts/5',
    ])
  })

  it('should process empty URLs array', async () => {
    const result = await fetchWithConcurrency([], MAX_CONCURRENCY)
    expect(result).toEqual([])
    expect(fetch).not.toHaveBeenCalled()
  })

  it('should handle errors gracefully', async () => {
    const mockFetch = vi.mocked(fetch)
    mockFetch.mockRejectedValueOnce(new Error('Network error'))
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true }),
    } as any)

    const result = await fetchWithConcurrency(['url1', 'url2'], 2)
    expect(result[0]).toBeInstanceOf(Error)
    expect(result[1]).toEqual({ success: true })
  })

  it('should store responses at correct array positions', async () => {
    const testUrls = ['url3', 'url1', 'url2']

    const mockFetch = vi.mocked(fetch)
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve('response3'),
    } as any)
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve('response1'),
    } as any)
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve('response2'),
    } as any)

    const result = await fetchWithConcurrency(testUrls, MAX_CONCURRENCY)

    expect(result[0]).toBe('response3')
    expect(result[1]).toBe('response1')
    expect(result[2]).toBe('response2')
    expect(result).toHaveLength(3)
  })

  it('should respect concurrency limit', async () => {
    let activeFetches = 0
    let maxActiveFetches = 0

    const mockFetch = vi.mocked(fetch)
    mockFetch.mockImplementation(async (url: RequestInfo | URL) => {
      activeFetches++
      maxActiveFetches = Math.max(maxActiveFetches, activeFetches)

      await new Promise(resolve => setTimeout(resolve, 10))

      activeFetches--

      return {
        json: () => Promise.resolve({ url: String(url) }),
      } as Response
    })

    await fetchWithConcurrency(urls, MAX_CONCURRENCY)

    expect(maxActiveFetches).toBeLessThanOrEqual(MAX_CONCURRENCY)
    expect(fetch).toHaveBeenCalledTimes(urls.length)
  })
})
