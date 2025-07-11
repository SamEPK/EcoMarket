import { ref, type Ref } from 'vue'

interface UseImageReturn {
  imageLoaded: Ref<boolean>
  imageError: Ref<boolean>
  handleImageLoad: () => void
  handleImageError: (event: Event) => void
  getOptimizedImageUrl: (url: string, width?: number, height?: number) => string
}

export function useImage(): UseImageReturn {
  const imageLoaded = ref<boolean>(false)
  const imageError = ref<boolean>(false)

  function handleImageLoad(): void {
    imageLoaded.value = true
    imageError.value = false
  }

  function handleImageError(event: Event): void {
    imageError.value = true
    imageLoaded.value = false

    const target = event.target as HTMLImageElement
    if (target) {
      // URLs de fallback de qualité avec nouveau thème
      const fallbackImages = [
        'https://via.placeholder.com/400x300/64748b/white?text=EcoMarket',
        'https://via.placeholder.com/400x300/94a3b8/white?text=Produit+Eco',
        'https://via.placeholder.com/400x300/cbd5e1/334155?text=Artisanal'
      ]

      // Choisir une image de fallback aléatoire pour plus de variété
      const randomIndex = Math.floor(Math.random() * fallbackImages.length)
      target.src = fallbackImages[randomIndex]
    }
  }

  function getOptimizedImageUrl(url: string, width: number = 300, height: number = 200): string {
    // Si c'est une URL Unsplash, on peut l'optimiser
    if (url.includes('unsplash.com')) {
      // Enlever les paramètres existants et ajouter les nouveaux
      const baseUrl = url.split('?')[0]
      return `${baseUrl}?w=${width}&h=${height}&fit=crop&crop=center&auto=format&q=80`
    }

    // Si c'est une URL de l'API externe, garder telle quelle
    if (url.includes('fakestoreapi.com')) {
      return url
    }

    // Pour les autres URLs, retourner telle quelle
    return url
  }

  return {
    imageLoaded,
    imageError,
    handleImageLoad,
    handleImageError,
    getOptimizedImageUrl
  }
}

// Fonction utilitaire pour précharger une image
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`))
    img.src = src
  })
}

// Liste d'images de haute qualité pour les produits
export const highQualityProductImages = {
  cosmétiques: [
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=300&h=200&fit=crop'
  ],
  accessoires: [
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1570213489059-0aac6626cade?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=300&h=200&fit=crop'
  ],
  alimentation: [
    'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1506368083636-6defb67639a7?w=300&h=200&fit=crop'
  ],
  décoration: [
    'https://images.unsplash.com/photo-1602874801007-83f6e90a3a36?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1586263352805-b5b1b8084d9c?w=300&h=200&fit=crop'
  ]
}
