<template>
  <div class="products-page">
    <div class="container">
      <!-- En-tête de la page -->
      <div class="page-header">
        <h1>Nos Produits</h1>
        <p>Découvrez notre sélection de produits artisanaux et écologiques</p>
      </div>

      <!-- Filtres de recherche -->
      <SearchFilters
        v-model="filters"
        :categories="categories"
        :result-count="filteredProducts.length"
        @reset="handleResetFilters"
      />

      <!-- État de chargement -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Chargement des produits...</p>
      </div>

      <!-- Message d'erreur -->
      <div v-else-if="error" class="error-state">
        <p>❌ {{ error }}</p>
        <button @click="retryLoading" class="retry-btn">
          Réessayer
        </button>
      </div>

      <!-- Liste des produits -->
      <div v-else-if="filteredProducts.length > 0" class="products-section">
        <div class="products-grid">
          <ProductCard
            v-for="product in filteredProducts"
            :key="product.id"
            :product="product"
            @click="goToProductDetail"
            @add-to-cart="addToCart"
          />
        </div>
      </div>

      <!-- Aucun produit trouvé -->
      <div v-else class="no-products">
        <div class="no-products-content">
          <span class="no-products-icon">🔍</span>
          <h3>Aucun produit trouvé</h3>
          <p>Essayez de modifier vos critères de recherche</p>
          <button @click="handleResetFilters" class="reset-filters-btn">
            Réinitialiser les filtres
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/productsStore'
import { useCartStore } from '@/stores/cartStore'
import ProductCard from '@/components/common/ProductCard.vue'
import SearchFilters from '@/components/common/SearchFilters.vue'

const router = useRouter()
const productsStore = useProductsStore()
const cartStore = useCartStore()

// État local pour les filtres (avec v-model)
const filters = ref({
  searchTerm: '',
  category: '',
  minPrice: 0,
  maxPrice: 1000
})

// Computed properties
const loading = computed(() => productsStore.loading)
const error = computed(() => productsStore.error)
const filteredProducts = computed(() => productsStore.filteredProducts)
const categories = computed(() => productsStore.categories)

// Méthodes
function goToProductDetail(product) {
  router.push(`/product/${product.id}`)
}

function addToCart(product) {
  cartStore.addItem(product)
  
  // Feedback visuel (toast notification pourrait être ajoutée)
  console.log(`${product.name} ajouté au panier`)
}

function handleResetFilters() {
  filters.value = {
    searchTerm: '',
    category: '',
    minPrice: 0,
    maxPrice: 1000
  }
}

function retryLoading() {
  productsStore.fetchProducts()
}

// Watchers
// Synchronise les filtres locaux avec le store
watch(filters, (newFilters) => {
  productsStore.updateFilters(newFilters)
}, { deep: true })

// Lifecycle
onMounted(async () => {
  // Charge les produits si pas encore fait
  if (productsStore.products.length === 0) {
    await productsStore.fetchProducts()
  }
  
  // Synchronise les filtres du store avec l'état local
  filters.value = { ...productsStore.filters }
})
</script>

<style scoped>
.products-page {
  min-height: 100vh;
  background: var(--background-light);
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* En-tête de la page */
.page-header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem 0;
}

.page-header h1 {
  font-size: 3rem;
  color: var(--text-dark);
  margin-bottom: 1rem;
  font-weight: bold;
}

.page-header p {
  font-size: 1.2rem;
  color: var(--text-light);
  max-width: 600px;
  margin: 0 auto;
}

/* États de chargement et d'erreur */
.loading-state,
.error-state {
  text-align: center;
  padding: 4rem 2rem;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid var(--border-color);
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p,
.error-state p {
  font-size: 1.1rem;
  color: var(--text-light);
  margin-bottom: 1rem;
}

.retry-btn {
  background: var(--primary-color);
  color: var(--white);
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  background: #45a049;
  transform: translateY(-1px);
}

/* Grille des produits */
.products-section {
  margin-bottom: 3rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

/* État "aucun produit" */
.no-products {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  padding: 2rem;
}

.no-products-content {
  text-align: center;
  max-width: 400px;
}

.no-products-icon {
  font-size: 4rem;
  display: block;
  margin-bottom: 1rem;
}

.no-products-content h3 {
  font-size: 1.5rem;
  color: var(--text-dark);
  margin-bottom: 1rem;
}

.no-products-content p {
  color: var(--text-light);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.reset-filters-btn {
  background: var(--secondary-color);
  color: var(--white);
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-filters-btn:hover {
  background: var(--primary-color);
  transform: scale(1.05);
}

/* Responsive */
@media (max-width: 768px) {
  .products-page {
    padding: 1rem 0;
  }
  
  .page-header {
    margin-bottom: 2rem;
    padding: 1rem 0;
  }
  
  .page-header h1 {
    font-size: 2.5rem;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }
  
  .no-products {
    min-height: 300px;
  }
}

@media (max-width: 480px) {
  .page-header h1 {
    font-size: 2rem;
  }
  
  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>
