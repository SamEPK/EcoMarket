import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useApi } from '../useApi'
import axios from 'axios'

// Mock axios
vi.mock('axios')
const mockedAxios = axios as any

describe('useApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with correct default values', () => {
    const { loading, error } = useApi()

    expect(loading.value).toBe(false)
    expect(error.value).toBe(null)
  })

  it('should handle successful API call', async () => {
    const mockData = { id: 1, name: 'Test Product' }
    mockedAxios.mockResolvedValue({ data: mockData })

    const { loading, error, fetchData } = useApi()

    const result = await fetchData('/api/products')

    expect(loading.value).toBe(false)
    expect(error.value).toBe(null)
    expect(result).toEqual(mockData)
    expect(mockedAxios).toHaveBeenCalledWith('/api/products', {
      timeout: 10000
    })
  })

  it('should handle API error', async () => {
    const mockError = new Error('Network Error')
    mockedAxios.mockRejectedValue(mockError)

    const { loading, error, fetchData } = useApi()

    await expect(fetchData('/api/products')).rejects.toThrow('Network Error')

    expect(loading.value).toBe(false)
    expect(error.value).toBe('Network Error')
  })

  it('should handle mockApiCall with delay', async () => {
    const mockData = { test: 'data' }
    const { loading, mockApiCall } = useApi()

    const startTime = Date.now()
    const result = await mockApiCall(mockData, 100)
    const endTime = Date.now()

    expect(result).toEqual(mockData)
    expect(loading.value).toBe(false)
    expect(endTime - startTime).toBeGreaterThanOrEqual(100)
  })
})
