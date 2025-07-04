<template>
  <div class="product-card" @click="$emit('click', product)">
    <!-- Image du produit -->
    <div class="product-image">
      <img 
        :src="product.image" 
        :alt="product.name"
        @error="handleImageError"
      />
      <div v-if="!product.inStock" class="out-of-stock-overlay">
        Rupture de stock
      </div>
      <div class="rating">
        ⭐ {{ product.rating }}
      </div>
    </div>
    
    <!-- Informations du produit -->
    <div class="product-info">
      <h3 class="product-name">{{ product.name }}</h3>
      <p class="product-description">{{ truncatedDescription }}</p>
      <p class="product-artisan">Par {{ product.artisan }}</p>
      
      <div class="product-footer">
        <span class="product-price">{{ formatPrice(product.price) }}</span>
        <button 
          class="add-to-cart-btn"
          @click.stop="handleAddToCart"
          :disabled="!product.inStock"
          :class="{ disabled: !product.inStock }"
        >
          {{ product.inStock ? 'Ajouter' : 'Indisponible' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Props avec validation
const props = defineProps({
  product: {
    type: Object,
    required: true,
    validator: (product) => {
      return product && 
             typeof product.id !== 'undefined' &&
             typeof product.name === 'string' &&
             typeof product.price === 'number'
    }
  },
  maxDescriptionLength: {
    type: Number,
    default: 80
  }
})

// Events émis
const emit = defineEmits(['click', 'add-to-cart'])

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

function handleImageError(event) {
  // Image de fallback en cas d'erreur
  event.target.src = 'https://via.placeholder.com/400x300?text=Image+non+disponible'
}

function handleAddToCart() {
  if (props.product.inStock) {
    emit('add-to-cart', props.product)
  }
}
</script>

<style scoped>
.product-card {
  background: var(--white);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.product-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.out-of-stock-overlay {
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
  font-weight: bold;
  font-size: 1.1rem;
}

.rating {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.9);
  padding: 0.25rem 0.5rem;
  border-radius: 15px;
  font-size: 0.9rem;
  font-weight: bold;
}

.product-info {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-name {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--text-dark);
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.product-description {
  color: var(--text-light);
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 0.5rem;
  flex: 1;
}

.product-artisan {
  color: var(--primary-color);
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 1rem;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.product-price {
  font-size: 1.3rem;
  font-weight: bold;
  color: var(--primary-color);
}

.add-to-cart-btn {
  background: var(--secondary-color);
  color: var(--white);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.add-to-cart-btn:hover:not(.disabled) {
  background: var(--primary-color);
  transform: scale(1.05);
}

.add-to-cart-btn.disabled {
  background: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
}

/* Responsive */
@media (max-width: 480px) {
  .product-info {
    padding: 1rem;
  }
  
  .product-name {
    font-size: 1.1rem;
  }
  
  .product-footer {
    flex-direction: column;
    gap: 0.5rem;
    align-items: stretch;
  }
  
  .add-to-cart-btn {
    width: 100%;
    padding: 0.75rem;
  }
}
</style>
