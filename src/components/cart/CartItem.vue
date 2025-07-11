<template>
  <div class="cart-item">

    <div class="item-image">
      <img
        :src="item.image"
        :alt="item.name"
        @error="handleImageError"
      />
    </div>

    <div class="item-info">
      <h3 class="item-name">{{ item.name }}</h3>
      <p class="item-price">{{ formatPrice(item.price) }} / unité</p>
    </div>

    <div class="item-quantity">
      <label class="quantity-label">Quantité :</label>
      <div class="quantity-controls">
        <button
          @click="decreaseQuantity"
          :disabled="item.quantity <= 1"
          class="quantity-btn"
        >
          -
        </button>
        <input
          :value="item.quantity"
          @input="updateQuantity"
          type="number"
          min="1"
          max="10"
          class="quantity-input"
        />
        <button
          @click="increaseQuantity"
          :disabled="item.quantity >= 10"
          class="quantity-btn"
        >
          +
        </button>
      </div>
    </div>

    <div class="item-total">
      <span class="total-label">Total :</span>
      <span class="total-price">{{ formatPrice(itemTotal) }}</span>
    </div>

    <div class="item-actions">
      <button
        @click="confirmRemove"
        class="remove-btn"
        title="Supprimer cet article"
      >
        <Trash2 :size="16" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Trash2 } from 'lucide-vue-next'
const props = defineProps({
  item: {
    type: Object,
    required: true,
    validator: (item) => {
      return item &&
             typeof item.id !== 'undefined' &&
             typeof item.name === 'string' &&
             typeof item.price === 'number' &&
             typeof item.quantity === 'number'
    }
  }
})

// Émissions d'événements
const emit = defineEmits(['update-quantity', 'remove-item'])
const itemTotal = computed(() => props.item.price * props.item.quantity)
function formatPrice(price) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

function handleImageError(event) {
  event.target.src = 'https://via.placeholder.com/80x80?text=Image+non+disponible'
}

function updateQuantity(event) {
  const newQuantity = parseInt(event.target.value) || 1
  if (newQuantity >= 1 && newQuantity <= 10) {
    emit('update-quantity', props.item.id, newQuantity)
  }
}

function increaseQuantity() {
  if (props.item.quantity < 10) {
    emit('update-quantity', props.item.id, props.item.quantity + 1)
  }
}

function decreaseQuantity() {
  if (props.item.quantity > 1) {
    emit('update-quantity', props.item.id, props.item.quantity - 1)
  }
}

function confirmRemove() {
  if (confirm(`Supprimer "${props.item.name}" du panier ?`)) {
    emit('remove-item', props.item.id)
  }
}
</script>

<style scoped>
.cart-item {
  display: grid;
  grid-template-columns: 80px 1fr auto auto auto;
  gap: 1rem;
  align-items: center;
  padding: 1.5rem 0;
  border-bottom: 1px solid var(--border-color);
}

.cart-item:last-child {
  border-bottom: none;
}

/* Image */
.item-image img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Informations */
.item-info {
  min-width: 0; /* Pour permettre le text-overflow */
}

.item-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 0.25rem;
  line-height: 1.3;

  /* Gestion du débordement de texte */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-price {
  color: var(--text-light);
  font-size: 0.9rem;
  margin: 0;
}

/* Contrôles de quantité */
.item-quantity {
  text-align: center;
  min-width: 120px;
}

.quantity-label {
  display: block;
  font-size: 0.85rem;
  color: var(--text-light);
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  justify-content: center;
}

.quantity-btn {
  width: 30px;
  height: 30px;
  border: 1px solid var(--border-color);
  background: var(--white);
  cursor: pointer;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quantity-btn:hover:not(:disabled) {
  background: var(--primary-color);
  color: var(--white);
  border-color: var(--primary-color);
}

.quantity-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.quantity-input {
  width: 50px;
  height: 30px;
  text-align: center;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 0.9rem;
  background: var(--white);
}

.quantity-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

/* Prix total */
.item-total {
  text-align: right;
  min-width: 80px;
}

.total-label {
  display: block;
  font-size: 0.85rem;
  color: var(--text-light);
  margin-bottom: 0.25rem;
}

.total-price {
  font-size: 1.1rem;
  font-weight: bold;
  color: var(--primary-color);
}
.item-actions {
  text-align: center;
}

.remove-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  color: var(--text-light);
}

.remove-btn:hover {
  background: var(--error-color);
  color: var(--white);
  transform: scale(1.1);
}
@media (max-width: 768px) {
  .cart-item {
    grid-template-columns: 60px 1fr;
    grid-template-rows: auto auto auto;
    grid-template-areas:
      "image info"
      "quantity total"
      "actions actions";
    gap: 0.75rem;
    padding: 1rem 0;
  }

  .item-image {
    grid-area: image;
  }

  .item-info {
    grid-area: info;
  }

  .item-quantity {
    grid-area: quantity;
    text-align: left;
    min-width: auto;
  }

  .item-total {
    grid-area: total;
    text-align: right;
    min-width: auto;
  }

  .item-actions {
    grid-area: actions;
    text-align: center;
    padding-top: 0.5rem;
    border-top: 1px solid var(--border-color);
  }

  .item-image img {
    width: 60px;
    height: 60px;
  }

  .item-name {
    font-size: 1rem;
  }

  .quantity-controls {
    justify-content: flex-start;
  }
}

@media (max-width: 480px) {
  .item-name {
    white-space: normal;
    overflow: visible;
    text-overflow: initial;
    line-height: 1.4;
  }

  .quantity-label,
  .total-label {
    font-size: 0.8rem;
  }
}
</style>
