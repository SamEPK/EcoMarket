import { ref, type Ref } from 'vue'

interface ErrorHandler {
  show: Ref<boolean>
  message: Ref<string>
  details: Ref<any>
  showError: (message: string, details?: any) => void
  clearError: () => void
  handleApiError: (error: any) => void
  handleValidationError: (errors: Record<string, string>) => void
}

export function useErrorHandler(): ErrorHandler {
  const show = ref(false)
  const message = ref('')
  const details = ref(null)

  const showError = (errorMessage: string, errorDetails?: any) => {
    message.value = errorMessage
    details.value = errorDetails
    show.value = true

    // Afficher un toast d'erreur
    if (typeof window !== 'undefined' && window.showToast) {
      window.showToast({
        type: 'error',
        title: 'Erreur',
        message: errorMessage,
        duration: 5000,
        actions: errorDetails && errorDetails.retry ? [
          {
            label: 'Réessayer',
            action: errorDetails.retry
          }
        ] : undefined
      })
    }
  }

  const clearError = () => {
    show.value = false
    message.value = ''
    details.value = null
  }

  const handleApiError = (error: any) => {
    let errorMessage = 'Une erreur inattendue s\'est produite'
    let errorDetails = null

    if (error.response) {
      // Erreur de réponse HTTP
      const status = error.response.status
      
      switch (status) {
        case 400:
          errorMessage = 'Données invalides envoyées au serveur'
          break
        case 401:
          errorMessage = 'Authentification requise'
          break
        case 403:
          errorMessage = 'Accès refusé'
          break
        case 404:
          errorMessage = 'Ressource non trouvée'
          break
        case 408:
          errorMessage = 'Délai de connexion expiré'
          break
        case 429:
          errorMessage = 'Trop de requêtes. Veuillez patienter.'
          break
        case 500:
          errorMessage = 'Erreur interne du serveur'
          break
        case 502:
          errorMessage = 'Serveur temporairement indisponible'
          break
        case 503:
          errorMessage = 'Service temporairement indisponible'
          break
        default:
          errorMessage = `Erreur HTTP ${status}`
      }

      errorDetails = {
        status,
        statusText: error.response.statusText,
        data: error.response.data
      }
    } else if (error.request) {
      // Erreur de réseau
      errorMessage = 'Impossible de contacter le serveur. Vérifiez votre connexion internet.'
      errorDetails = {
        type: 'network',
        message: error.message
      }
    } else {
      // Autre erreur
      errorMessage = error.message || 'Une erreur inattendue s\'est produite'
      errorDetails = {
        type: 'generic',
        error: error
      }
    }

    showError(errorMessage, errorDetails)
  }

  const handleValidationError = (errors: Record<string, string>) => {
    const errorCount = Object.keys(errors).length
    const firstError = Object.values(errors)[0]
    
    const errorMessage = errorCount === 1 
      ? firstError 
      : `${errorCount} erreurs de validation détectées`

    showError(errorMessage, {
      type: 'validation',
      errors
    })
  }

  return {
    show,
    message,
    details,
    showError,
    clearError,
    handleApiError,
    handleValidationError
  }
}

// Composable pour les notifications de succès
export function useSuccessNotification() {
  const showSuccess = (title: string, message: string, duration: number = 3000) => {
    if (typeof window !== 'undefined' && window.showToast) {
      window.showToast({
        type: 'success',
        title,
        message,
        duration
      })
    }
  }

  return {
    showSuccess
  }
}

// Composable pour les notifications d'information
export function useInfoNotification() {
  const showInfo = (title: string, message: string, duration: number = 3000) => {
    if (typeof window !== 'undefined' && window.showToast) {
      window.showToast({
        type: 'info',
        title,
        message,
        duration
      })
    }
  }

  return {
    showInfo
  }
}

// Composable pour les notifications d'avertissement
export function useWarningNotification() {
  const showWarning = (title: string, message: string, duration: number = 4000) => {
    if (typeof window !== 'undefined' && window.showToast) {
      window.showToast({
        type: 'warning',
        title,
        message,
        duration
      })
    }
  }

  return {
    showWarning
  }
}

// Composable pour la gestion des modales de confirmation
export function useConfirmDialog() {
  const showConfirm = (
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
    confirmLabel: string = 'Confirmer',
    cancelLabel: string = 'Annuler'
  ) => {
    if (typeof window !== 'undefined' && window.showModal) {
      window.showModal({
        title,
        component: 'div',
        props: {
          innerHTML: `
            <div style="text-align: center; padding: 1rem;">
              <p>${message}</p>
            </div>
          `
        },
        actions: [
          {
            label: cancelLabel,
            action: () => {
              if (onCancel) onCancel()
              window.closeModal()
            },
            variant: 'secondary'
          },
          {
            label: confirmLabel,
            action: () => {
              onConfirm()
              window.closeModal()
            },
            variant: 'primary'
          }
        ]
      })
    } else {
      // Fallback pour les navigateurs sans support modal
      if (confirm(`${title}\n\n${message}`)) {
        onConfirm()
      } else if (onCancel) {
        onCancel()
      }
    }
  }

  return {
    showConfirm
  }
}

// Composable pour la gestion des états de chargement avec feedback
export function useLoadingState() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const withLoading = async <T>(
    operation: () => Promise<T>,
    loadingMessage?: string
  ): Promise<T | null> => {
    loading.value = true
    error.value = null

    // Afficher un toast de chargement si message fourni
    if (loadingMessage && typeof window !== 'undefined' && window.showToast) {
      window.showToast({
        type: 'info',
        title: 'Chargement...',
        message: loadingMessage,
        duration: 2000
      })
    }

    try {
      const result = await operation()
      loading.value = false
      return result
    } catch (err: any) {
      loading.value = false
      error.value = err.message || 'Une erreur s\'est produite'
      
      // Afficher un toast d'erreur
      if (typeof window !== 'undefined' && window.showToast) {
        window.showToast({
          type: 'error',
          title: 'Erreur',
          message: error.value || 'Une erreur s\'est produite',
          duration: 5000
        })
      }
      
      return null
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    loading,
    error,
    withLoading,
    clearError
  }
}
