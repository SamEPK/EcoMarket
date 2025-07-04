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
    <!-- Image du produit -->
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
      
      <!-- Badges et overlays -->
      <div class="product-badges">
        <span v-if="product.isNew" class="badge badge-new">Nouveau</span>
        <span v-if="product.isEco" class="badge badge-eco">🌿 Bio</span>
        <span v-if="product.discount" class="badge badge-discount">
          -{{ product.discount }}%
        </span>
      </div>
      
      <div v-if="!product.inStock" class="out-of-stock-overlay">
        <div class="out-of-stock-content">
          <span class="out-of-stock-icon">⚠️</span>
          <span class="out-of-stock-text">Rupture de stock</span>
        </div>
      </div>
      
      <div class="rating-badge">
        <span class="rating-stars">
          <span v-for="star in 5" :key="star" class="star" :class="{ filled: star <= Math.floor(product.rating) }">
            ⭐
          </span>
        </span>
        <span class="rating-value">{{ product.rating.toFixed(1) }}</span>
      </div>
      
      <!-- Actions rapides -->
      <div class="quick-actions">
        <button 
          class="btn btn-sm btn-ghost quick-action-btn"
          @click.stop="$emit('toggle-favorite', product)"
          :aria-label="product.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'"
        >
          <span :class="{ 'text-error': product.isFavorite }">
            {{ product.isFavorite ? '❤️' : '🤍' }}
          </span>
        </button>
        
        <button 
          class="btn btn-sm btn-ghost quick-action-btn"
          @click.stop="$emit('quick-view', product)"
          aria-label="Aperçu rapide du produit"
        >
          👁️
        </button>
      </div>
    </div>
    
    <!-- Informations du produit -->
    <div class="product-info">
      <header class="product-header">
        <h3 class="product-name">{{ product.name }}</h3>
        <p class="product-category">{{ product.category }}</p>
      </header>
      
      <div class="product-details">
        <p class="product-description">{{ truncatedDescription }}</p>
        <div class="product-meta">
          <span class="product-artisan">
            <span class="artisan-icon">👨‍🎨</span>
            Par {{ product.artisan }}
          </span>
          <span v-if="product.location" class="product-location">
            <span class="location-icon">📍</span>
            {{ product.location }}
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
            <span class="btn-icon">{{ product.inStock ? '🛒' : '❌' }}</span>
            <span class="btn-text">
              {{ product.inStock ? 'Ajouter' : 'Indisponible' }}
            </span>
          </button>
        </div>
      </footer>
    </div>
    
    <!-- Indicator de qualité -->
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
import { useImage } from '@/composables/useImage'

// Props avec validation étendue
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
  'add-to-cart', 
  'toggle-favorite', 
  'quick-view'
])

// Composable pour la gestion des images
const { imageLoaded, imageError, handleImageLoad, handleImageError, getOptimizedImageUrl } = useImage()

// Computed pour l'URL optimisée de l'image
const optimizedImageUrl = computed(() => {
  return getOptimizedImageUrl(props.product.image, 450, 320)
})

// Computed pour tronquer la description
const truncatedDescription = computed(() => {
  if (props.product.description.length <= props.maxDescriptionLength) {
    return props.product.description
  }
  return props.product.description.slice(0, props.maxDescriptionLength) + '...'
})

// Méthodes
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
  border-radius: var(--border-radius-xl);
  overflow: hidden;
  background: var(--background-primary);
  position: relative;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: var(--shadow-2xl);
}

.product-card:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(45, 90, 61, 0.3);
}

.product-card.out-of-stock {
  opacity: 0.7;
  filter: grayscale(30%);
}

.product-image {
  position: relative;
  height: 280px;
  overflow: hidden;
  background: var(--background-secondary);
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
  background: var(--background-secondary);
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
  border-radius: var(--border-radius-xl);
  font-size: 0.75rem;
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  backdrop-filter: blur(8px);
  box-shadow: var(--shadow-sm);
}

.badge-new {
  background: var(--info-color);
  color: var(--background-primary);
}

.badge-eco {
  background: var(--success-color);
  color: var(--background-primary);
}

.badge-discount {
  background: var(--accent-color);
  color: var(--background-primary);
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
  font-size: 3rem;
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
  font-size: 0.875rem;
  filter: grayscale(100%);
  transition: filter var(--transition-fast);
}

.star.filled {
  filter: grayscale(0%);
}

.rating-value {
  font-size: 0.875rem;
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
}

.quick-actions {
  position: absolute;
  bottom: var(--spacing-md);
  right: var(--spacing-md);
  display: flex;
  gap: var(--spacing-sm);
  opacity: 0;
  transform: translateY(20px);
  transition: all var(--transition-normal);
  z-index: 2;
}

.product-card:hover .quick-actions {
  opacity: 1;
  transform: translateY(0);
}

.quick-action-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
}

.quick-action-btn:hover {
  transform: scale(1.1);
  box-shadow: var(--shadow-md);
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
  border-bottom: 1px solid var(--border-light);
  padding-bottom: var(--spacing-md);
  flex-shrink: 0;
}

.product-name {
  font-size: 1.25rem;
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
  line-height: 1.3;
  font-family: var(--font-family-serif);
}

.product-category {
  font-size: 0.875rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: var(--font-weight-medium);
  margin: 0;
}

.product-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin: var(--spacing-md) 0;
}

.product-description {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 4.5em; /* 3 lignes approximatives */
  max-height: 4.5em;
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
  color: var(--text-muted);
}

.product-artisan {
  color: var(--primary-color);
  font-weight: var(--font-weight-medium);
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
  border-top: 1px solid var(--border-light);
  margin-top: auto;
  flex-shrink: 0;
}

.product-pricing {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  min-width: 0;
  flex-shrink: 0;
}

.original-price {
  font-size: 0.875rem;
  color: var(--text-muted);
  text-decoration: line-through;
}

.product-price {
  font-size: 1.5rem;
  font-weight: var(--font-weight-bold);
  color: var(--primary-color);
  font-family: var(--font-family-serif);
  white-space: nowrap;
}

.product-actions {
  display: flex;
  gap: var(--spacing-sm);
  flex-shrink: 0;
}

.add-to-cart-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  font-size: 0.875rem;
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--border-radius-lg);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-fast);
  width: 100%;
  min-height: 44px; /* Assurer une hauteur minimale pour l'accessibilité */
}

.add-to-cart-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
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
  background: var(--success-color);
  transition: width var(--transition-slow);
}

.quality-text {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: var(--font-weight-medium);
  white-space: nowrap;
}

/* Responsive */
@media (max-width: 768px) {
  .product-image {
    height: 240px;
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
  
  .product-pricing {
    align-self: flex-start;
    margin-bottom: var(--spacing-sm);
  }
  
  .add-to-cart-btn {
    width: 100%;
    justify-content: center;
    padding: var(--spacing-lg);
  }
  
  .quick-actions {
    position: static;
    opacity: 1;
    transform: none;
    justify-content: center;
    margin-top: var(--spacing-md);
  }
  
  .quality-indicator {
    position: static;
    margin-top: var(--spacing-md);
  }
}

@media (max-width: 480px) {
  .product-image {
    height: 200px;
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
  .quick-actions,
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
  
  .quick-action-btn {
    background: rgba(15, 23, 42, 0.95);
  }
  
  .product-card.out-of-stock {
    filter: grayscale(50%);
  }
}
</style>


