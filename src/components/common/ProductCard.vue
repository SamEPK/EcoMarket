<template>
  <article
    class="product-card card hover-lift"
    @click="$emit('click', product)"
    :class="{ 'out-of-stock': !product.inStock }"
    tabindex="0"
    @keydown.enter="$emit('click', product)"
    @keydown.space="$emit('click', product)"
    :aria-label="`Produit ${product.name} par ${product.artisan}`"
  >

    <div class="product-image">
      <div v-if="!imageLoaded && !imageError" class="image-loader">
        <div class="spinner-dots">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>

      <img
        :src="optimizedImageUrl"
        :alt="`Image du produit ${product.name}`"
        @load="handleImageLoad"
        @error="handleImageError"
        :class="{ 'image-loaded': imageLoaded, 'image-hidden': !imageLoaded }"
        loading="lazy"
        decoding="async"
      />

      <div class="product-badges">
        <span v-if="product.isNew" class="badge badge-new">Nouveau</span>
        <span v-if="product.isEco" class="badge badge-eco">Bio</span>
        <span v-if="product.discount" class="badge badge-discount">
          -{{ product.discount }}%
        </span>
      </div>

      <div v-if="!product.inStock" class="out-of-stock-overlay">
        <div class="out-of-stock-content">
          <span class="out-of-stock-icon">
            <AlertCircle :size="48" />
          </span>
          <span class="out-of-stock-text">Rupture de stock</span>
        </div>
      </div>

      <div class="rating-badge">
        <span class="rating-stars">
          <span v-for="star in 5" :key="star" class="star" :class="{ filled: star <= Math.floor(product.rating) }">
            <Star :size="14" :fill="star <= Math.floor(product.rating) ? 'currentColor' : 'none'" />
          </span>
        </span>
        <span class="rating-value">{{ product.rating.toFixed(1) }}</span>
      </div>
    </div>

    <div class="product-info">
      <header class="product-header">
        <h3 class="product-name">{{ product.name }}</h3>
        <p class="product-category">{{ product.category }}</p>
      </header>

      <div class="product-details">
        <p class="product-description">{{ truncatedDescription }}</p>
        <div class="product-meta">
          <span class="product-artisan">
            <CheckCircle :size="16" />
            Par {{ product.artisan }}
          </span>
        </div>
      </div>

      <footer class="product-footer">
        <div class="product-pricing">
          <span v-if="product.originalPrice && product.originalPrice > product.price" class="original-price">
            {{ formatPrice(product.originalPrice) }}
          </span>
          <span class="product-price">{{ formatPrice(product.price) }}</span>
        </div>

        <div class="product-actions">
          <button
            class="btn btn-primary add-to-cart-btn"
            @click.stop="handleAddToCart"
            :disabled="!product.inStock"
            :class="{ 'btn-danger': !product.inStock }"
            :aria-label="product.inStock ? 'Ajouter au panier' : 'Produit indisponible'"
          >
            <span class="btn-text">
              {{ product.inStock ? 'Ajouter' : 'Indisponible' }}
            </span>
            <ShoppingCart :size="16" class="btn-icon" />
          </button>
        </div>
      </footer>
    </div>

    <div class="quality-indicator">
      <div class="quality-bar">
        <div
          class="quality-fill"
          :style="{ width: `${(product.quality || 85)}%` }"
        ></div>
      </div>
      <span class="quality-text">Qualité: {{ product.quality || 85 }}%</span>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { CheckCircle, ShoppingCart, AlertCircle, Star } from 'lucide-vue-next'
import { useImage } from '@/composables/useImage'
const props = defineProps({
  product: {
    type: Object,
    required: true,
    validator: (product) => {
      const required = ['id', 'name', 'price', 'image', 'artisan', 'description']
      return required.every(field => product[field] !== undefined)
    }
  },
  maxDescriptionLength: {
    type: Number,
    default: 120
  },
  showQuickActions: {
    type: Boolean,
    default: true
  },
  showQualityIndicator: {
    type: Boolean,
    default: true
  }
})

// Events émis
const emit = defineEmits([
  'click',
  'add-to-cart'
])

// Composable pour la gestion des images
const { imageLoaded, imageError, handleImageLoad, handleImageError, getOptimizedImageUrl } = useImage()
const optimizedImageUrl = computed(() => {
  return getOptimizedImageUrl(props.product.image, 300, 200)
})
const truncatedDescription = computed(() => {
  if (props.product.description.length <= props.maxDescriptionLength) {
    return props.product.description
  }
  return props.product.description.slice(0, props.maxDescriptionLength) + '...'
})
function formatPrice(price) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

function handleAddToCart() {
  if (props.product.inStock) {
    emit('add-to-cart', props.product)
  }
}
</script>

<style scoped>
.product-card {
  height: 100%;
  cursor: pointer;
  transition: all var(--transition-normal);
  border-radius: 12px;
  overflow: hidden;
  background: var(--white);
  position: relative;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.product-card:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(71, 85, 105, 0.3);
}

.product-card.out-of-stock {
  opacity: 0.7;
  filter: grayscale(30%);
}

.product-image {
  position: relative;
  height: 200px;
  overflow: hidden;
  background: #f1f5f9;
  flex-shrink: 0;
}

.image-loader {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all var(--transition-slow);
}

.image-hidden {
  opacity: 0;
}

.image-loaded {
  opacity: 1;
}

.product-card:hover .product-image img {
  transform: scale(1.08);
}

/* Badges et overlays */
.product-badges {
  position: absolute;
  top: var(--spacing-md);
  left: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  z-index: 2;
}

.badge {
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.badge-new {
  background: var(--primary-color);
  color: var(--white);
}

.badge-eco {
  background: var(--secondary-color);
  color: var(--white);
}

.badge-discount {
  background: var(--accent-color);
  color: var(--white);
}

.out-of-stock-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
}

.out-of-stock-content {
  text-align: center;
  color: var(--background-primary);
}

.out-of-stock-icon {
  color: #ffffff;
  display: block;
  margin-bottom: var(--spacing-sm);
}

.out-of-stock-text {
  font-size: 1.125rem;
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.rating-badge {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  z-index: 2;
}

.rating-stars {
  display: flex;
  gap: 1px;
}

.star {
  color: #cbd5e1;
  transition: color var(--transition-fast);
}

.star.filled {
  color: #f59e0b;
}

.rating-value {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-dark);
}

/* Informations du produit */
.product-info {
  padding: var(--spacing-xl);
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0; /* Permet la compression */
}

.product-header {
  border-bottom: 1px solid var(--border-color);
  padding-bottom: var(--spacing-md);
  flex-shrink: 0;
}

.product-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 0;
}

.product-description {
  color: var(--text-muted);
  line-height: 1.5;
  margin-bottom: var(--spacing-md);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 4.5em; /* 3 lignes approximatives */
  max-height: 4.5em;
}

.product-footer {
  flex-shrink: 0;
  margin-top: auto;
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--border-light);
}

.product-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: var(--spacing-sm);
  line-height: 1.3;
}

.product-category {
  font-size: 0.875rem;
  color: var(--text-light);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 500;
  margin: 0;
}

.product-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.product-description {
  color: var(--text-light);
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0;
}

.product-meta {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.product-artisan,
.product-location {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: 0.875rem;
  color: var(--text-light);
}

.product-artisan {
  color: var(--primary-color);
  font-weight: 500;
}

.artisan-icon,
.location-icon {
  font-size: 1rem;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--border-color);
}

.product-pricing {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.original-price {
  font-size: 0.875rem;
  color: var(--text-light);
  text-decoration: line-through;
}

.product-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
}

.product-actions {
  display: flex;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
}

.add-to-cart-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  font-size: 0.875rem;
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: 8px;
  font-weight: 600;
  transition: all var(--transition-fast);
  width: 100%;
  min-height: 44px;
  border: 2px solid var(--primary-color);
  background: var(--primary-color);
  color: var(--white);
}

.add-to-cart-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  background: var(--accent-color);
  border-color: var(--accent-color);
}

.add-to-cart-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-icon {
  font-size: 1rem;
}

.btn-text {
  font-size: 0.875rem;
}

/* Indicateur de qualité */
.quality-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  padding: var(--spacing-sm) var(--spacing-md);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  border-top: 1px solid var(--border-light);
  z-index: 2;
}

.quality-bar {
  flex: 1;
  height: 4px;
  background: var(--border-color);
  border-radius: 2px;
  overflow: hidden;
}

.quality-fill {
  height: 100%;
  background: var(--primary-color);
  transition: width var(--transition-slow);
}

.quality-text {
  font-size: 0.75rem;
  color: var(--text-light);
  font-weight: 500;
  white-space: nowrap;
}
@media (max-width: 768px) {
  .product-image {
    height: 180px;
  }

  .product-info {
    padding: var(--spacing-lg);
  }

  .product-name {
    font-size: 1.125rem;
  }

  .product-price {
    font-size: 1.25rem;
  }

  .product-footer {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-md);
  }

  .add-to-cart-btn {
    width: 100%;
    justify-content: center;
    padding: var(--spacing-lg);
  }

  .quality-indicator {
    position: static;
    margin-top: var(--spacing-md);
  }
}

@media (max-width: 480px) {
  .product-image {
    height: 160px;
  }

  .product-info {
    padding: var(--spacing-md);
  }

  .product-name {
    font-size: 1rem;
  }

  .product-price {
    font-size: 1.125rem;
  }

  .product-badges {
    top: var(--spacing-sm);
    left: var(--spacing-sm);
  }

  .rating-badge {
    top: var(--spacing-sm);
    right: var(--spacing-sm);
  }

  .badge {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: 0.7rem;
  }
}

/* Animations d'entrée */
@keyframes cardSlideIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.product-card {
  animation: cardSlideIn 0.5s ease-out;
}

/* Support pour les préférences d'accessibilité */
@media (prefers-reduced-motion: reduce) {
  .product-card,
  .product-image img,
  .quality-fill {
    transition: none !important;
    animation: none !important;
  }

  .product-card:hover {
    transform: none !important;
  }

  .product-card:hover .product-image img {
    transform: none !important;
  }
}

/* Mode sombre */
@media (prefers-color-scheme: dark) {
  .rating-badge,
  .quality-indicator {
    background: rgba(15, 23, 42, 0.95);
  }

  .product-card.out-of-stock {
    filter: grayscale(50%);
  }
}
</style>

