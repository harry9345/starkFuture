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
    vi.stubGlobal('fetch', vi.fn())
    vi.mocked(fetch).mockReset()
  })

  it('should start fetching ASAP', async () => {
    const startTimes: number[] = []
    const completionOrder: number[] = []
    vi.mocked(fetch).mockImplementation(async (url: RequestInfo | URL) => {
      const index = urls.indexOf(String(url))
      startTimes[index] = Date.now()
      await new Promise(resolve => setTimeout(resolve, 100))

      completionOrder.push(index)
      return {
        ok: true,
        json: () => Promise.resolve({ url: String(url) }),
      } as Response
    })

    await fetchWithConcurrency(urls, MAX_CONCURRENCY)

    // verify first two requests start nearly simultaneously
    const timeDiffFirstTwo = Math.abs(startTimes[1] - startTimes[0])
    expect(timeDiffFirstTwo).toBeLessThan(10)

    // verify third request starts after at least one of the first two completes
    const timeToThird = startTimes[2] - startTimes[0]
    expect(timeToThird).toBeGreaterThanOrEqual(90)
    expect(timeToThird).toBeLessThan(120)
  })

  it('fetches all URLs with concurrency limit', async () => {
    vi.mocked(fetch).mockImplementation((url: RequestInfo | URL) =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: `response for ${url}` }),
      } as Response)
    )

    const result = await fetchWithConcurrency(urls, MAX_CONCURRENCY)

    expect(fetch).toHaveBeenCalledTimes(urls.length)
    urls.forEach((url, index) => {
      expect(fetch).toHaveBeenNthCalledWith(index + 1, url)
    })

    expect(result).toEqual(urls.map(url => ({ data: `response for ${url}` })))
  })

  it('should process empty URLs array', async () => {
    const result = await fetchWithConcurrency([], MAX_CONCURRENCY)
    expect(result).toEqual([])
    expect(fetch).not.toHaveBeenCalled()
  })

  it('should handle network errors', async () => {
    vi.mocked(fetch)
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      } as Response)

    const testUrls = ['url1', 'url2']
    const result = await fetchWithConcurrency(testUrls, MAX_CONCURRENCY)

    expect(result[0]).toBeInstanceOf(Error)
    expect((result[0] as Error).message).toBe('Network error')
    expect(result[1]).toEqual({ success: true })
    expect(fetch).toHaveBeenCalledTimes(2)
  })

  it('should handle HTTP errors', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({}),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      } as Response)

    const testUrls = ['url1', 'url2']
    const result = await fetchWithConcurrency(testUrls, MAX_CONCURRENCY)

    expect(result[0]).toBeInstanceOf(Error)
    expect((result[0] as Error).message).toMatch(/HTTP error 404/)
    expect(result[1]).toEqual({ success: true })
    expect(fetch).toHaveBeenCalledTimes(2)
  })

  it('should store responses at correct array positions', async () => {
    const testUrls = ['url3', 'url1', 'url2']
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve('response3'),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve('response1'),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve('response2'),
      } as Response)

    const result = await fetchWithConcurrency(testUrls, MAX_CONCURRENCY)

    expect(result).toEqual(['response3', 'response1', 'response2'])
    expect(fetch).toHaveBeenCalledTimes(3)
  })

  it('should respect concurrency limit', async () => {
    let activeFetches = 0
    let maxActiveFetches = 0

    vi.mocked(fetch).mockImplementation(async () => {
      activeFetches++
      maxActiveFetches = Math.max(maxActiveFetches, activeFetches)
      await new Promise(resolve => setTimeout(resolve, 10))
      activeFetches--
      return {
        ok: true,
        json: () => Promise.resolve({ data: 'response' }),
      } as Response
    })

    await fetchWithConcurrency(urls, MAX_CONCURRENCY)
    expect(maxActiveFetches).toBeLessThanOrEqual(MAX_CONCURRENCY)
    expect(fetch).toHaveBeenCalledTimes(urls.length)
  })

  it('should throw for invalid maxConcurrency', async () => {
    await expect(fetchWithConcurrency(urls, 0)).rejects.toThrow(
      'maxConcurrency must be a positive integer'
    )
    await expect(fetchWithConcurrency(urls, -1)).rejects.toThrow(
      'maxConcurrency must be a positive integer'
    )
  })

  it('should throw for non-array urls', async () => {
    await expect(
      fetchWithConcurrency('not-an-array' as any, MAX_CONCURRENCY)
    ).rejects.toThrow('urls must be an array')
  })

  it('should handle maxConcurrency greater than URLs length', async () => {
    vi.mocked(fetch).mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: 'response' }),
      } as Response)
    )

    const testUrls = ['url1', 'url2']
    const result = await fetchWithConcurrency(testUrls, 5)
    expect(result).toEqual([{ data: 'response' }, { data: 'response' }])
    expect(fetch).toHaveBeenCalledTimes(2)
  })
})
