import { defineStore } from 'pinia'
import { ref, computed, type Ref, type ComputedRef } from 'vue'
import { useApi } from '@/composables/useApi'
import type { Product, ProductFilters } from '@/types'

export const useProductsStore = defineStore('products', () => {
  const products: Ref<Product[]> = ref([])
  const loading: Ref<boolean> = ref(false)
  const error: Ref<string | null> = ref(null)
  const filters: Ref<ProductFilters> = ref({
    category: '',
    minPrice: 0,
    maxPrice: 1000,
    searchTerm: ''
  })
  
  const { fetchData } = useApi()
  const filteredProducts: ComputedRef<Product[]> = computed(() => {
    let filtered = products.value
    
    if (filters.value.category) {
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === filters.value.category.toLowerCase()
      )
    }
    
    filtered = filtered.filter(product => 
      product.price >= filters.value.minPrice && 
      product.price <= filters.value.maxPrice
    )
    
    if (filters.value.searchTerm) {
      const term = filters.value.searchTerm.toLowerCase()
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term)
      )
    }
    
    return filtered
  })
  
  const categories: ComputedRef<string[]> = computed(() => {
    const cats = [...new Set(products.value.map(p => p.category))]
    return cats.sort()
  })
  
  async function fetchProducts(): Promise<void> {
    loading.value = true
    error.value = null
    
    try {
      let apiProducts = []
      
      try {
        const apiResponse = await fetchData('https://fakestoreapi.com/products')
        
        apiProducts = apiResponse.map((product: any) => ({
          id: product.id,
          name: product.title,
          description: product.description,
          price: product.price,
          image: product.image,
          category: transformCategory(product.category),
          inStock: Math.random() > 0.1,
          rating: product.rating?.rate || 4.0,
          artisan: generateArtisanName(product.category)
        }))
      } catch (apiError) {
        console.warn('API externe non disponible, utilisation des données locales:', apiError)
      }
      
      const ecoProducts: Product[] = [
        {
          id: 101,
          name: "Savon artisanal à l'huile d'olive",
          description: "Savon naturel fabriqué à la main avec de l'huile d'olive bio. Hydratant et nourrissant pour tous types de peau.",
          price: 8.50,
          image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop&crop=center&auto=format&q=80",
          category: "Cosmétiques",
          inStock: true,
          rating: 4.8,
          artisan: "Savonnerie du Sud"
        },
        {
          id: 102,
          name: "Sac en toile de jute",
          description: "Sac réutilisable en fibres naturelles, parfait pour les courses écologiques et durables.",
          price: 15.90,
          image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop&crop=center&auto=format&q=80",
          category: "Accessoires",
          inStock: true,
          rating: 4.6,
          artisan: "Atelier Textile Vert"
        },
        {
          id: 103,
          name: "Miel de lavande bio",
          description: "Miel de lavande produit localement sans pesticides, récolté dans le respect des abeilles.",
          price: 12.00,
          image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=300&fit=crop&crop=center&auto=format&q=80",
          category: "Alimentation",
          inStock: true,
          rating: 4.9,
          artisan: "Rucher des Collines"
        },
        {
          id: 105,
          name: "Thé vert bio des montagnes",
          description: "Thé vert cultivé en agriculture biologique en haute altitude, riche en antioxydants.",
          price: 22.90,
          image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop&crop=center&auto=format&q=80",
          category: "Alimentation",
          inStock: true,
          rating: 4.5,
          artisan: "Jardins de Thé Bio"
        },
        {
          id: 106,
          name: "Écharpe en laine mérinos",
          description: "Écharpe tricotée main en laine mérinos éthique, douce et chaude.",
          price: 45.00,
          image: "https://images.unsplash.com/photo-1570213489059-0aac6626cade?w=400&h=300&fit=crop&crop=center&auto=format&q=80",
          category: "Accessoires",
          inStock: false,
          rating: 4.8,
          artisan: "Tricots Montagnards"
        },
        {
          id: 107,
          name: "Ceramique artisanale",
          description: "Bol en céramique fait main, parfait pour le petit-déjeuner éco-responsable.",
          price: 28.00,
          image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center&auto=format&q=80",
          category: "Décoration",
          inStock: true,
          rating: 4.6,
          artisan: "Atelier Terre et Feu"
        },
        {
          id: 108,
          name: "Huile d'olive bio",
          description: "Huile d'olive extra vierge issue d'oliviers centenaires, première pression à froid.",
          price: 16.50,
          image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop&crop=center&auto=format&q=80",
          category: "Alimentation",
          inStock: true,
          rating: 4.9,
          artisan: "Domaine des Oliviers"
        }
      ]
      
      products.value = [...ecoProducts, ...apiProducts]
    } catch (err) {
      error.value = 'Erreur lors du chargement des produits'
      console.error('Erreur API:', err)
    } finally {
      loading.value = false
    }
  }
    function updateFilters(newFilters: Partial<ProductFilters>): void {
    filters.value = { ...filters.value, ...newFilters }
  }

  function resetFilters(): void {
    filters.value = {
      category: '',
      minPrice: 0,
      maxPrice: 1000,
      searchTerm: ''
    }
  }

  function getProductById(id: string | number): Product | undefined {
    return products.value.find(product => product.id === parseInt(id.toString()))
  }

  function transformCategory(apiCategory: string): string {
    const categoryMap: Record<string, string> = {
      "men's clothing": "Vêtements",
      "women's clothing": "Vêtements", 
      "jewelery": "Bijoux",
      "electronics": "Électronique"
    }
    return categoryMap[apiCategory] || "Divers"
  }

  function generateArtisanName(category: string): string {
    const artisanNames: Record<string, string[]> = {
      "Vêtements": ["Atelier Couture Bio", "Mode Éthique", "Textile Vert"],
      "Bijoux": ["Créations Artisanales", "Bijoux Naturels", "Orfèvre Éco"],
      "Électronique": ["Tech Responsable", "Éco-Innovation", "Green Tech"],
      "Divers": ["Artisan Local", "Créateur Responsable", "Éco-Artisan"]
    }
    
    const names = artisanNames[category] || artisanNames["Divers"]
    return names[Math.floor(Math.random() * names.length)]
  }

  return {
    products,
    loading,
    error,
    filters,
    filteredProducts,
    categories,
    fetchProducts,
    updateFilters,
    resetFilters,
    getProductById
  }
})
