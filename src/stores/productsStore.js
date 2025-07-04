import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useApi } from '@/composables/useApi'

export const useProductsStore = defineStore('products', () => {
  const products = ref([])
  const loading = ref(false)
  const error = ref(null)
  const filters = ref({
    category: '',
    minPrice: 0,
    maxPrice: 1000,
    searchTerm: ''
  })
  
  const { fetchData } = useApi()
  const filteredProducts = computed(() => {
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
  
  const categories = computed(() => {
    const cats = [...new Set(products.value.map(p => p.category))]
    return cats.sort()
  })
  
  async function fetchProducts() {
    loading.value = true
    error.value = null
    
    try {
      let apiProducts = []
      
      try {
        const apiResponse = await fetchData('https://fakestoreapi.com/products')
        
        apiProducts = apiResponse.map(product => ({
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
      
      const ecoProducts = [
        {
          id: 101,
          name: "Savon artisanal à l'huile d'olive",
          description: "Savon naturel fabriqué à la main avec de l'huile d'olive bio. Hydratant et nourrissant pour tous types de peau.",
          price: 8.50,
          image: "https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=400",
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
          image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
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
          image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400",
          category: "Alimentation",
          inStock: true,
          rating: 4.9,
          artisan: "Rucher des Collines"
        },
        {
          id: 104,
          name: "Bougie en cire d'abeille",
          description: "Bougie naturelle parfumée aux huiles essentielles, longue durée de combustion.",
          price: 18.50,
          image: "https://images.unsplash.com/photo-1602874801007-83f6e90a3a36?w=400",
          category: "Décoration",
          inStock: true,
          rating: 4.7,
          artisan: "Luminances Naturelles"
        },
        {
          id: 105,
          name: "Thé vert bio des montagnes",
          description: "Thé vert cultivé en agriculture biologique en haute altitude, riche en antioxydants.",
          price: 22.90,
          image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400",
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
          image: "https://images.unsplash.com/photo-1570213489059-0aac6626cade?w=400",
          category: "Accessoires",
          inStock: false,
          rating: 4.8,
          artisan: "Tricots Montagnards"
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
  
  function updateFilters(newFilters) {
    filters.value = { ...filters.value, ...newFilters }
  }
  
  function resetFilters() {
    filters.value = {
      category: '',
      minPrice: 0,
      maxPrice: 1000,
      searchTerm: ''
    }
  }
  
  function getProductById(id) {
    return products.value.find(product => product.id === parseInt(id))
  }
  
  function transformCategory(apiCategory) {
    const categoryMap = {
      "men's clothing": "Vêtements",
      "women's clothing": "Vêtements", 
      "jewelery": "Bijoux",
      "electronics": "Électronique"
    }
    return categoryMap[apiCategory] || "Divers"
  }
  
  function generateArtisanName(category) {
    const artisanNames = {
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
