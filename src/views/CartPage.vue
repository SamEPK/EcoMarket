<template>
  <div class="cart-page">
    <div class="container">

      <div class="page-header">
        <h1>Mon Panier</h1>
        <p v-if="!isEmpty">{{ itemCount }} article{{ itemCount > 1 ? 's' : '' }} dans votre panier</p>
      </div>

      <div v-if="isEmpty" class="empty-cart">
        <div class="empty-cart-content">
          <h2>Votre panier est vide</h2>
          <p>Découvrez nos produits artisanaux et écologiques</p>
          <RouterLink to="/products" class="continue-shopping-btn">
            Continuer mes achats
          </RouterLink>
        </div>
      </div>

      <div v-else class="cart-content">
        <div class="cart-items">

          <div class="items-list">
            <CartItem
              v-for="item in items"
              :key="item.id"
              :item="item"
              @update-quantity="updateQuantity"
              @remove-item="removeItem"
            />
          </div>

          <div class="cart-actions">
            <button @click="clearCart" class="clear-cart-btn">
              <Trash2 :size="16" />
              Vider le panier
            </button>
            <RouterLink to="/products" class="continue-shopping">
              <ArrowLeft :size="16" />
              Continuer mes achats
            </RouterLink>
          </div>
        </div>

        <div class="order-summary">
          <div class="summary-card">
            <h3>Résumé de la commande</h3>

            <div class="summary-line">
              <span>Sous-total ({{ itemCount }} articles)</span>
              <span>{{ formatPrice(totalPrice) }}</span>
            </div>

            <div class="summary-line">
              <span>Livraison</span>
              <span class="free-shipping">Gratuite</span>
            </div>

            <div class="summary-line total">
              <span>Total</span>
              <span>{{ formatPrice(totalPrice) }}</span>
            </div>

            <div class="eco-message">
              <span class="eco-icon">
                <Leaf :size="20" />
              </span>
              <p>Livraison éco-responsable incluse</p>
            </div>

            <RouterLink to="/checkout" class="checkout-btn">
              Procéder au paiement
            </RouterLink>

            <div class="secure-payment">
              <span class="secure-icon">
                <Shield :size="16" />
              </span>
              <span>Paiement 100% sécurisé</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { Trash2, ArrowLeft, Leaf, Shield } from 'lucide-vue-next'
import { useCartStore } from '@/stores/cartStore'
import CartItem from '@/components/cart/CartItem.vue'

const cartStore = useCartStore()
const items = computed(() => cartStore.items)
const itemCount = computed(() => cartStore.itemCount)
const totalPrice = computed(() => cartStore.totalPrice)
const isEmpty = computed(() => cartStore.isEmpty)
function formatPrice(price) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

function updateQuantity(productId, quantity) {
  cartStore.updateQuantity(productId, quantity)
}

function removeItem(productId) {
  cartStore.removeItem(productId)
}

function clearCart() {
  if (confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
    cartStore.clearCart()
  }
}
</script>

<style scoped>
.cart-page {
  min-height: 100vh;
  background: var(--background-light);
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}
.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-header h1 {
  font-size: 2.5rem;
  color: var(--text-dark);
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.page-header p {
  color: var(--text-light);
  font-size: 1.1rem;
}

/* Panier vide */
.empty-cart {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.empty-cart-content {
  text-align: center;
  max-width: 400px;
}

.empty-cart-icon {
  font-size: 4rem;
  display: block;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-cart-content h2 {
  font-size: 1.8rem;
  color: var(--text-dark);
  margin-bottom: 1rem;
}

.empty-cart-content p {
  color: var(--text-light);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.continue-shopping-btn {
  display: inline-block;
  background: var(--primary-color);
  color: var(--white);
  padding: 1rem 2rem;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.continue-shopping-btn:hover {
  background: #45a049;
  transform: translateY(-2px);
}
.cart-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
  align-items: start;
}

/* Section articles */
.cart-items {
  background: var(--white);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.items-list {
  margin-bottom: 2rem;
}

.cart-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.clear-cart-btn {
  background: var(--error-color);
  color: var(--white);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.clear-cart-btn:hover {
  background: #d32f2f;
  transform: scale(1.05);
}

.continue-shopping {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.continue-shopping:hover {
  color: var(--text-dark);
}
.order-summary {
  position: sticky;
  top: 2rem;
}

.summary-card {
  background: var(--white);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.summary-card h3 {
  font-size: 1.3rem;
  color: var(--text-dark);
  margin-bottom: 1.5rem;
  font-weight: bold;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.summary-line.total {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--text-dark);
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
  margin-top: 1rem;
}

.free-shipping {
  color: var(--success-color);
  font-weight: 500;
}

.eco-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--background-light);
  padding: 1rem;
  border-radius: 8px;
  margin: 1.5rem 0;
}

.eco-icon {
  color: var(--primary-color);
}

.eco-message p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-light);
}

.checkout-btn {
  display: block;
  width: 100%;
  background: var(--primary-color);
  color: var(--white);
  text-align: center;
  padding: 1rem;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.checkout-btn:hover {
  background: #45a049;
  transform: translateY(-1px);
}

.secure-payment {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: var(--text-light);
  font-size: 0.9rem;
}

.secure-icon {
  color: var(--success-color);
}
@media (max-width: 968px) {
  .cart-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .order-summary {
    position: static;
  }
}

@media (max-width: 768px) {
  .cart-page {
    padding: 1rem 0;
  }

  .page-header h1 {
    font-size: 2rem;
  }

  .cart-items,
  .summary-card {
    padding: 1rem;
  }

  .cart-actions {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .continue-shopping {
    text-align: center;
  }
}
</style>
