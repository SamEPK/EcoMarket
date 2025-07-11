<template>
  <div class="product-detail">

    <div class="container">
      <nav class="breadcrumb">
        <RouterLink to="/" class="breadcrumb-link">Accueil</RouterLink>
        <span class="breadcrumb-separator">›</span>
        <RouterLink to="/products" class="breadcrumb-link">Produits</RouterLink>
        <span class="breadcrumb-separator">›</span>
        <span class="breadcrumb-current">{{ product?.name || 'Chargement...' }}</span>
      </nav>
    </div>

    <div class="container" v-if="product">
      <div class="product-content">

        <div class="product-image-section">
          <div class="main-image">
            <img
              :src="product.image"
              :alt="product.name"
              class="product-image"
              @error="handleImageError"
            />
            <div v-if="!product.inStock" class="stock-overlay">
              Rupture de stock
            </div>
          </div>
        </div>

        <div class="product-info-section">
          <div class="product-header">
            <h1 class="product-title">{{ product.name }}</h1>
            <div class="product-rating">
              <span class="stars">★★★★★</span>
              <span class="rating-value">({{ product.rating }})</span>
            </div>
            <p class="product-artisan">
              <strong>Artisan :</strong> {{ product.artisan }}
            </p>
          </div>

          <div class="product-description">
            <h3>Description</h3>
            <p>{{ product.description }}</p>
          </div>

          <div class="product-details">
            <div class="detail-item">
              <strong>Catégorie :</strong> {{ product.category }}
            </div>
            <div class="detail-item">
              <strong>État :</strong>
              <span :class="stockClass">{{ stockText }}</span>
            </div>
          </div>

          <div class="purchase-section">
            <div class="price-section">
              <span class="current-price">{{ formatPrice(product.price) }}</span>
            </div>

            <div class="quantity-section">
              <label for="quantity">Quantité :</label>
              <div class="quantity-input">
                <button
                  @click="decreaseQuantity"
                  :disabled="quantity <= 1"
                  class="quantity-btn"
                >
                  -
                </button>
                <input
                  id="quantity"
                  v-model.number="quantity"
                  type="number"
                  min="1"
                  max="10"
                  class="quantity-field"
                />
                <button
                  @click="increaseQuantity"
                  :disabled="quantity >= 10"
                  class="quantity-btn"
                >
                  +
                </button>
              </div>
            </div>

            <div class="action-buttons">
              <button
                @click="addToCart"
                :disabled="!product.inStock"
                class="add-to-cart-btn"
                :class="{ disabled: !product.inStock }"
              >
                {{ product.inStock ? 'Ajouter au panier' : 'Indisponible' }}
              </button>
              <button @click="goToCart" class="view-cart-btn">
                Voir le panier ({{ cartItemCount }})
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="artisan-section">
        <h2>À propos de l'artisan</h2>
        <div class="artisan-info">
          <div class="artisan-details">
            <h3>{{ product.artisan }}</h3>
            <p>
              Artisan passionné créant des produits {{ product.category.toLowerCase() }}
              de qualité exceptionnelle avec des matériaux respectueux de l'environnement.
              Chaque création est unique et fabriquée avec soin selon des méthodes traditionnelles.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="loading" class="loading-state">
      <div class="container">
        <div class="loading-spinner"></div>
        <p>Chargement du produit...</p>
      </div>
    </div>

    <div v-else class="not-found">
      <div class="container">
        <div class="not-found-content">
          <h2>Produit non trouvé</h2>
          <p>Le produit que vous recherchez n'existe pas ou n'est plus disponible.</p>
          <RouterLink to="/products" class="back-to-products">
            Retour aux produits
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useProductsStore } from '@/stores/productsStore'
import { useCartStore } from '@/stores/cartStore'

const route = useRoute()
const router = useRouter()
const productsStore = useProductsStore()
const cartStore = useCartStore()
const productId = computed(() => route.params.id)
const quantity = ref(1)
const loading = ref(false)
const product = computed(() =>
  productsStore.getProductById(productId.value)
)

const cartItemCount = computed(() => cartStore.itemCount)

const stockClass = computed(() =>
  product.value?.inStock ? 'in-stock' : 'out-of-stock'
)

const stockText = computed(() =>
  product.value?.inStock ? 'En stock' : 'Rupture de stock'
)
function formatPrice(price) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

function handleImageError(event) {
  event.target.src = 'https://via.placeholder.com/600x400?text=Image+non+disponible'
}

function increaseQuantity() {
  if (quantity.value < 10) {
    quantity.value++
  }
}

function decreaseQuantity() {
  if (quantity.value > 1) {
    quantity.value--
  }
}

function addToCart() {
  if (product.value && product.value.inStock) {
    cartStore.addItem(product.value, quantity.value)
    console.log(`${quantity.value} x ${product.value.name} ajouté au panier`)
    quantity.value = 1
  }
}

function goToCart() {
  router.push('/cart')
}
onMounted(async () => {
  if (productsStore.products.length === 0) {
    loading.value = true
    await productsStore.fetchProducts()
    loading.value = false
  }
})

// Recharge si l'ID change
watch(productId, async (newId) => {
  if (newId && productsStore.products.length === 0) {
    loading.value = true
    await productsStore.fetchProducts()
    loading.value = false
  }
}, { immediate: true })
</script>

<style scoped>
.product-detail {
  min-height: 100vh;
  background: var(--background-light);
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  font-size: 0.9rem;
}

.breadcrumb-link {
  color: var(--primary-color);
  text-decoration: none;
  transition: color 0.3s ease;
}

.breadcrumb-link:hover {
  color: var(--text-dark);
}

.breadcrumb-separator {
  margin: 0 0.5rem;
  color: var(--text-light);
}

.breadcrumb-current {
  color: var(--text-light);
}
.product-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
}

/* Section image */
.product-image-section {
  position: relative;
}

.main-image {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 100%;
  height: 500px;
  object-fit: cover;
}

.stock-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
}

/* Section informations */
.product-info-section {
  background: var(--white);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  height: fit-content;
}

.product-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.product-title {
  font-size: 2rem;
  color: var(--text-dark);
  margin-bottom: 1rem;
  font-weight: bold;
  line-height: 1.2;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.stars {
  color: #ffc107;
  font-size: 1.2rem;
}

.rating-value {
  color: var(--text-light);
  font-weight: 500;
}

.product-artisan {
  color: var(--primary-color);
  font-size: 1.1rem;
}

.product-description {
  margin-bottom: 2rem;
}

.product-description h3 {
  color: var(--text-dark);
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.product-description p {
  color: var(--text-light);
  line-height: 1.6;
}

.product-details {
  margin-bottom: 2rem;
  padding: 1rem;
  background: var(--background-light);
  border-radius: 8px;
}

.detail-item {
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.in-stock {
  color: var(--success-color);
  font-weight: 500;
}

.out-of-stock {
  color: var(--error-color);
  font-weight: 500;
}

/* Section achat */
.purchase-section {
  border-top: 1px solid var(--border-color);
  padding-top: 2rem;
}

.price-section {
  margin-bottom: 2rem;
}

.current-price {
  font-size: 2rem;
  font-weight: bold;
  color: var(--primary-color);
}

.quantity-section {
  margin-bottom: 2rem;
}

.quantity-section label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.quantity-input {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: fit-content;
}

.quantity-btn {
  width: 40px;
  height: 40px;
  border: 1px solid var(--border-color);
  background: var(--white);
  cursor: pointer;
  border-radius: 6px;
  font-size: 1.2rem;
  font-weight: bold;
  transition: all 0.3s ease;
}

.quantity-btn:hover:not(:disabled) {
  background: var(--primary-color);
  color: var(--white);
  border-color: var(--primary-color);
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-field {
  width: 80px;
  height: 40px;
  text-align: center;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 1rem;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.add-to-cart-btn {
  background: var(--primary-color);
  color: var(--white);
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-to-cart-btn:hover:not(.disabled) {
  background: #45a049;
  transform: translateY(-2px);
}

.add-to-cart-btn.disabled {
  background: #ccc;
  cursor: not-allowed;
}

.view-cart-btn {
  background: var(--secondary-color);
  color: var(--white);
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-cart-btn:hover {
  background: var(--primary-color);
}

/* Section artisan */
.artisan-section {
  background: var(--white);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.artisan-section h2 {
  color: var(--text-dark);
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.artisan-details h3 {
  color: var(--primary-color);
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.artisan-details p {
  color: var(--text-light);
  line-height: 1.6;
}

/* États de chargement et d'erreur */
.loading-state,
.not-found {
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

.not-found-content h2 {
  color: var(--text-dark);
  margin-bottom: 1rem;
}

.not-found-content p {
  color: var(--text-light);
  margin-bottom: 2rem;
}

.back-to-products {
  display: inline-block;
  background: var(--primary-color);
  color: var(--white);
  padding: 0.75rem 1.5rem;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.back-to-products:hover {
  background: #45a049;
  transform: translateY(-1px);
}
@media (max-width: 968px) {
  .product-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .product-image {
    height: 400px;
  }
}

@media (max-width: 768px) {
  .product-detail {
    padding: 1rem 0;
  }

  .product-title {
    font-size: 1.5rem;
  }

  .current-price {
    font-size: 1.5rem;
  }

  .product-info-section {
    padding: 1.5rem;
  }

  .artisan-section {
    padding: 1.5rem;
  }
}
</style>
