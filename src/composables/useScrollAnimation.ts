import { ref, onMounted, onUnmounted } from 'vue'

export function useScrollAnimation() {
  const observer = ref<IntersectionObserver | null>(null)
  const elements = ref<Set<Element>>(new Set())

  const initObserver = () => {
    if (typeof window === 'undefined') return

    observer.value = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            // Optionnel : arrêter d'observer l'élément une fois visible
            observer.value?.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '50px 0px -50px 0px'
      }
    )
  }

  const observeElement = (element: Element) => {
    if (observer.value && element) {
      observer.value.observe(element)
      elements.value.add(element)
    }
  }

  const unobserveElement = (element: Element) => {
    if (observer.value && element) {
      observer.value.unobserve(element)
      elements.value.delete(element)
    }
  }

  const cleanup = () => {
    if (observer.value) {
      elements.value.forEach((element) => {
        observer.value?.unobserve(element)
      })
      observer.value.disconnect()
      elements.value.clear()
    }
  }

  onMounted(() => {
    initObserver()
  })

  onUnmounted(() => {
    cleanup()
  })

  return {
    observeElement,
    unobserveElement,
    cleanup
  }
}

// Composable pour les animations au scroll
export function useScrollToTop() {
  const isVisible = ref(false)
  const scrollThreshold = 300

  const checkScroll = () => {
    isVisible.value = window.scrollY > scrollThreshold
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  onMounted(() => {
    window.addEventListener('scroll', checkScroll)
    checkScroll()
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', checkScroll)
  })

  return {
    isVisible,
    scrollToTop
  }
}

// Composable pour les notifications toast
export function useToast() {
  const toasts = ref<Array<{
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message: string
    duration?: number
  }>>([])

  const showToast = (
    type: 'success' | 'error' | 'warning' | 'info',
    title: string,
    message: string,
    duration = 5000
  ) => {
    const id = Date.now().toString()
    const toast = { id, type, title, message, duration }
    
    toasts.value.push(toast)

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const success = (title: string, message: string, duration?: number) => {
    return showToast('success', title, message, duration)
  }

  const error = (title: string, message: string, duration?: number) => {
    return showToast('error', title, message, duration)
  }

  const warning = (title: string, message: string, duration?: number) => {
    return showToast('warning', title, message, duration)
  }

  const info = (title: string, message: string, duration?: number) => {
    return showToast('info', title, message, duration)
  }

  return {
    toasts,
    showToast,
    removeToast,
    success,
    error,
    warning,
    info
  }
}

// Composable pour gérer les modales
export function useModal() {
  const isOpen = ref(false)
  const modalContent = ref<any>(null)

  const openModal = (content?: any) => {
    modalContent.value = content
    isOpen.value = true
    document.body.style.overflow = 'hidden'
  }

  const closeModal = () => {
    isOpen.value = false
    modalContent.value = null
    document.body.style.overflow = ''
  }

  const toggleModal = (content?: any) => {
    if (isOpen.value) {
      closeModal()
    } else {
      openModal(content)
    }
  }

  // Fermer avec Escape
  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && isOpen.value) {
      closeModal()
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleEscape)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
    // Nettoyage au cas où le composant est détruit avec une modale ouverte
    if (isOpen.value) {
      document.body.style.overflow = ''
    }
  })

  return {
    isOpen,
    modalContent,
    openModal,
    closeModal,
    toggleModal
  }
}

// Composable pour les transitions de page
export function usePageTransition() {
  const isTransitioning = ref(false)

  const startTransition = () => {
    isTransitioning.value = true
  }

  const endTransition = () => {
    isTransitioning.value = false
  }

  return {
    isTransitioning,
    startTransition,
    endTransition
  }
}

// Composable pour les animations de chargement
export function useLoadingStates() {
  const loadingStates = ref<Record<string, boolean>>({})

  const setLoading = (key: string, loading: boolean) => {
    loadingStates.value[key] = loading
  }

  const isLoading = (key: string) => {
    return loadingStates.value[key] || false
  }

  const withLoading = async <T>(key: string, asyncFn: () => Promise<T>): Promise<T> => {
    try {
      setLoading(key, true)
      const result = await asyncFn()
      return result
    } finally {
      setLoading(key, false)
    }
  }

  return {
    loadingStates,
    setLoading,
    isLoading,
    withLoading
  }
}

// Composable pour les favoris
export function useFavorites() {
  const favorites = ref<Set<string>>(new Set())

  const toggleFavorite = (id: string) => {
    if (favorites.value.has(id)) {
      favorites.value.delete(id)
    } else {
      favorites.value.add(id)
    }
    
    // Sauvegarder dans localStorage
    localStorage.setItem('favorites', JSON.stringify(Array.from(favorites.value)))
  }

  const isFavorite = (id: string) => {
    return favorites.value.has(id)
  }

  const loadFavorites = () => {
    try {
      const saved = localStorage.getItem('favorites')
      if (saved) {
        const favoriteIds = JSON.parse(saved)
        favorites.value = new Set(favoriteIds)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des favoris:', error)
    }
  }

  onMounted(() => {
    loadFavorites()
  })

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    loadFavorites
  }
}

// Composable pour la recherche avec debounce
export function useSearch() {
  const searchQuery = ref('')
  const debouncedQuery = ref('')
  const isSearching = ref(false)
  
  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  const setSearchQuery = (query: string) => {
    searchQuery.value = query
    isSearching.value = true

    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    debounceTimer = setTimeout(() => {
      debouncedQuery.value = query
      isSearching.value = false
    }, 300)
  }

  const clearSearch = () => {
    searchQuery.value = ''
    debouncedQuery.value = ''
    isSearching.value = false
    
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
  }

  onUnmounted(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
  })

  return {
    searchQuery,
    debouncedQuery,
    isSearching,
    setSearchQuery,
    clearSearch
  }
}
