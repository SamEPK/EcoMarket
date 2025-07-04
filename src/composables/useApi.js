import { ref } from 'vue'
import axios from 'axios'

export function useApi() {
  const loading = ref(false)
  const error = ref(null)
  
  /**
   * Fonction générique pour faire des appels API
   * @param {string} url - URL de l'API
   * @param {object} options - Options pour la requête
   */
  async function fetchData(url, options = {}) {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios(url, {
        timeout: 10000,
        ...options
      })
      
      return response.data
    } catch (err) {
      error.value = err.message || 'Une erreur est survenue'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Fonction pour simuler des appels API avec des données mockées
   * @param {any} data - Données à retourner
   * @param {number} delay - Délai en ms
   */
  async function mockApiCall(data, delay = 500) {
    loading.value = true
    error.value = null
    
    try {
      await new Promise(resolve => setTimeout(resolve, delay))
      return data
    } catch (err) {
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
