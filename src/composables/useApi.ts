import { ref, type Ref } from 'vue'
import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios'

interface ApiError {
  message: string
}

interface UseApiReturn {
  loading: Ref<boolean>
  error: Ref<string | null>
  fetchData: <T = any>(url: string, options?: AxiosRequestConfig) => Promise<T>
  mockApiCall: <T = any>(data: T, delay?: number) => Promise<T>
}

export function useApi(): UseApiReturn {
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  
  /**
   * Fonction générique pour faire des appels API
   * @param url - URL de l'API
   * @param options - Options pour la requête
   */
  async function fetchData<T = any>(url: string, options: AxiosRequestConfig = {}): Promise<T> {
    loading.value = true
    error.value = null
    
    try {
      const response: AxiosResponse<T> = await axios(url, {
        timeout: 10000,
        ...options
      })
      
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Une erreur est survenue'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Fonction pour simuler des appels API avec des données mockées
   * @param data - Données à retourner
   * @param delay - Délai en ms
   */
  async function mockApiCall<T = any>(data: T, delay: number = 500): Promise<T> {
    loading.value = true
    error.value = null
    
    try {
      await new Promise(resolve => setTimeout(resolve, delay))
      return data
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  return {
    loading,
    error,
    fetchData,
    mockApiCall
  }
}
