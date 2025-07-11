<template>
  <div class="checkout-page">
    <div class="container">
      <!-- En-tête -->
      <div class="page-header">
        <h1>Finaliser ma commande</h1>
        <div class="checkout-steps">
          <div class="step" :class="{ active: currentStep === 1, completed: currentStep > 1 }">
            <span class="step-number">
              <Check v-if="currentStep > 1" :size="18" />
              <span v-else>1</span>
            </span>
            <span class="step-text">Informations</span>
          </div>
          <div class="step" :class="{ active: currentStep === 2, completed: currentStep > 2 }">
            <span class="step-number">
              <Check v-if="currentStep > 2" :size="18" />
              <span v-else>2</span>
            </span>
            <span class="step-text">Paiement</span>
          </div>
          <div class="step" :class="{ active: currentStep === 3 }">
            <span class="step-number">
              <Check v-if="currentStep > 3" :size="18" />
              <span v-else>3</span>
            </span>
            <span class="step-text">Confirmation</span>
          </div>
        </div>
      </div>

      <!-- Redirection si panier vide -->
      <div v-if="cartEmpty" class="empty-cart-message">
        <h2>Votre panier est vide</h2>
        <p>Ajoutez des produits à votre panier avant de procéder au paiement.</p>
        <RouterLink to="/products" class="go-shopping-btn">
          Découvrir nos produits
        </RouterLink>
      </div>

      <!-- Contenu du checkout -->
      <div v-else class="checkout-content">
        <!-- Étape 1: Informations -->
        <div v-show="currentStep === 1" class="step-content">
          <div class="checkout-form">
            <h2>Informations de livraison</h2>
            
            <form @submit.prevent="goToPayment">
              <div class="form-group">
                <label for="firstName">Prénom *</label>
                <input
                  id="firstName"
                  v-model="customerInfo.firstName"
                  type="text"
                  class="form-input"
                  placeholder="Votre prénom"
                  required
                />
              </div>

              <div class="form-group">
                <label for="lastName">Nom *</label>
                <input
                  id="lastName"
                  v-model="customerInfo.lastName"
                  type="text"
                  class="form-input"
                  placeholder="Votre nom"
                  required
                />
              </div>

              <div class="form-group">
                <label for="email">Email *</label>
                <input
                  id="email"
                  v-model="customerInfo.email"
                  type="email"
                  class="form-input"
                  placeholder="votre@email.com"
                  required
                />
              </div>

              <div class="form-group">
                <label for="address">Adresse *</label>
                <input
                  id="address"
                  v-model="customerInfo.address"
                  type="text"
                  class="form-input"
                  placeholder="123 rue de la Paix"
                  required
                />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="postalCode">Code postal *</label>
                  <input
                    id="postalCode"
                    v-model="customerInfo.postalCode"
                    type="text"
                    class="form-input"
                    placeholder="75001"
                    required
                  />
                </div>
                
                <div class="form-group">
                  <label for="city">Ville *</label>
                  <input
                    id="city"
                    v-model="customerInfo.city"
                    type="text"
                    class="form-input"
                    placeholder="Paris"
                    required
                  />
                </div>
              </div>

              <!-- Options de livraison -->
              <div class="form-section">
                <h3>Options de livraison</h3>
                <div class="delivery-options">
                  <label class="delivery-option">
                    <input
                      v-model="customerInfo.deliveryMethod"
                      type="radio"
                      value="standard"
                      class="delivery-radio"
                    />
                    <div class="delivery-details">
                      <strong>Livraison standard (Gratuite)</strong>
                      <p>3-5 jours ouvrés</p>
                    </div>
                  </label>
                  
                  <label class="delivery-option">
                    <input
                      v-model="customerInfo.deliveryMethod"
                      type="radio"
                      value="express"
                      class="delivery-radio"
                    />
                    <div class="delivery-details">
                      <strong>Livraison express (+5€)</strong>
                      <p>24-48h</p>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Actions -->
              <div class="form-actions">
                <button
                  type="submit"
                  class="submit-btn"
                >
                  Passer au paiement
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Étape 2: Paiement -->
        <div v-show="currentStep === 2" class="step-content">
          <div class="checkout-form">
            <h2>Informations de paiement</h2>
            
            <form @submit.prevent="goToConfirmation">
              <div class="form-group">
                <label for="cardNumber">Numéro de carte *</label>
                <input
                  id="cardNumber"
                  v-model="paymentInfo.cardNumber"
                  type="text"
                  class="form-input"
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>

              <div class="form-group">
                <label for="cardName">Nom sur la carte *</label>
                <input
                  id="cardName"
                  v-model="paymentInfo.cardName"
                  type="text"
                  class="form-input"
                  placeholder="Nom complet"
                  required
                />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="expiryDate">Date d'expiration *</label>
                  <input
                    id="expiryDate"
                    v-model="paymentInfo.expiryDate"
                    type="text"
                    class="form-input"
                    placeholder="MM/AA"
                    required
                  />
                </div>
                
                <div class="form-group">
                  <label for="cvv">CVV *</label>
                  <input
                    id="cvv"
                    v-model="paymentInfo.cvv"
                    type="text"
                    class="form-input"
                    placeholder="123"
                    required
                  />
                </div>
              </div>

              <!-- Actions -->
              <div class="form-actions">
                <button
                  type="button"
                  @click="goBackToInfo"
                  class="back-btn"
                >
                  Retour aux informations
                </button>
                <button
                  type="submit"
                  class="submit-btn"
                >
                  Continuer vers confirmation
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Étape 3: Confirmation -->
        <div v-show="currentStep === 3" class="step-content">
          <div class="checkout-form">
            <h2>Confirmation de commande</h2>
            
            <div class="confirmation-section">
              <h3>Informations de livraison</h3>
              <div class="info-display">
                <p><strong>{{ customerInfo.firstName }} {{ customerInfo.lastName }}</strong></p>
                <p>{{ customerInfo.email }}</p>
                <p>{{ customerInfo.address }}</p>
                <p>{{ customerInfo.postalCode }} {{ customerInfo.city }}</p>
                <p><strong>Livraison:</strong> {{ customerInfo.deliveryMethod === 'express' ? 'Express' : 'Standard' }}</p>
              </div>
            </div>

            <div class="confirmation-section">
              <h3>Paiement</h3>
              <div class="info-display">
                <p><strong>Carte:</strong> **** **** **** {{ paymentInfo.cardNumber.slice(-4) || '****' }}</p>
                <p><strong>Porteur:</strong> {{ paymentInfo.cardName }}</p>
              </div>
            </div>

            <!-- Actions -->
            <div class="form-actions">
              <button
                type="button"
                @click="goBackToPayment"
                class="back-btn"
              >
                Retour au paiement
              </button>
              <button
                @click="confirmOrder"
                :disabled="isSubmitting"
                class="submit-btn confirm-btn"
              >
                {{ isSubmitting ? 'Traitement...' : 'Confirmer la commande' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Résumé de commande -->
        <div class="order-summary">
          <div class="summary-card">
            <h3>Résumé de votre commande</h3>
            
            <div class="summary-items">
              <div 
                v-for="item in cartItems" 
                :key="item.id"
                class="summary-item"
              >
                <span class="item-name">{{ item.name }} × {{ item.quantity }}</span>
                <span class="item-price">{{ formatPrice(item.price * item.quantity) }}</span>
              </div>
            </div>

            <div class="summary-totals">
              <div class="summary-line">
                <span>Sous-total</span>
                <span>{{ formatPrice(cartTotal) }}</span>
              </div>
              <div class="summary-line">
                <span>Livraison</span>
                <span>{{ deliveryCost }}</span>
              </div>
              <div class="summary-line total">
                <span>Total</span>
                <span>{{ formatPrice(grandTotal) }}</span>
              </div>
            </div>

            <!-- Debug Info -->
            <div class="debug-section" style="margin-top: 2rem; padding: 1rem; background: #f8f9fa; border-radius: 8px; font-size: 0.9rem;">
              <p><strong>Étape actuelle:</strong> {{ currentStep }}</p>
              <p><strong>Info valides:</strong> {{ isCustomerInfoValid }}</p>
              <p><strong>Paiement valide:</strong> {{ isPaymentInfoValid }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, reactive, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { Check } from 'lucide-vue-next'
import { useCartStore } from '@/stores/cartStore'
import { useNotifications } from '@/composables/useNotifications'

const router = useRouter()
const cartStore = useCartStore()
const { showNotification } = useNotifications()

// État principal
const currentStep = ref(1)
const isSubmitting = ref(false)

// Données du client
const customerInfo = reactive({
  firstName: '',
  lastName: '',
  email: '',
  address: '',
  postalCode: '',
  city: '',
  deliveryMethod: 'standard'
})

// Données de paiement
const paymentInfo = reactive({
  cardNumber: '',
  cardName: '',
  expiryDate: '',
  cvv: ''
})

// Computed properties
const cartEmpty = computed(() => cartStore.isEmpty)
const cartItems = computed(() => cartStore.items)
const cartTotal = computed(() => cartStore.totalPrice)

const deliveryCost = computed(() => {
  return customerInfo.deliveryMethod === 'express' ? '5,00 €' : 'Gratuite'
})

const grandTotal = computed(() => {
  let total = cartTotal.value
  if (customerInfo.deliveryMethod === 'express') {
    total += 5
  }
  return total
})

const isCustomerInfoValid = computed(() => {
  return customerInfo.firstName.trim() !== '' &&
         customerInfo.lastName.trim() !== '' &&
         customerInfo.email.trim() !== '' &&
         customerInfo.address.trim() !== '' &&
         customerInfo.postalCode.trim() !== '' &&
         customerInfo.city.trim() !== ''
})

const isPaymentInfoValid = computed(() => {
  return paymentInfo.cardNumber.trim() !== '' &&
         paymentInfo.cardName.trim() !== '' &&
         paymentInfo.expiryDate.trim() !== '' &&
         paymentInfo.cvv.trim() !== ''
})

// Méthodes de navigation
function goToPayment() {
  console.log('Tentative de passage au paiement...')
  console.log('Informations valides:', isCustomerInfoValid.value)
  
  if (isCustomerInfoValid.value) {
    currentStep.value = 2
    console.log('Navigation vers étape 2 réussie!')
    showNotification('Informations sauvegardées', 'success')
  } else {
    console.log('Validation échouée')
    showNotification('Veuillez remplir tous les champs obligatoires', 'error')
  }
}

function goBackToInfo() {
  console.log('Retour aux informations')
  currentStep.value = 1
}

function goToConfirmation() {
  console.log('Tentative de passage à la confirmation...')
  console.log('Paiement valide:', isPaymentInfoValid.value)
  
  if (isPaymentInfoValid.value) {
    currentStep.value = 3
    console.log('Navigation vers étape 3 réussie!')
    showNotification('Informations de paiement sauvegardées', 'success')
  } else {
    console.log('Validation paiement échouée')
    showNotification('Veuillez remplir toutes les informations de paiement', 'error')
  }
}

function goBackToPayment() {
  console.log('Retour au paiement')
  currentStep.value = 2
}

async function confirmOrder() {
  console.log('Confirmation de la commande...')
  
  try {
    isSubmitting.value = true
    
    // Simulation d'envoi de commande
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Vider le panier
    cartStore.clearCart()
    
    // Redirection vers page de succès
    showNotification('Commande confirmée avec succès!', 'success')
    router.push('/order-success')
    
  } catch (error) {
    console.error('Erreur lors de la confirmation:', error)
    showNotification('Erreur lors de la confirmation de la commande', 'error')
  } finally {
    isSubmitting.value = false
  }
}

// Méthodes utilitaires
function formatPrice(price) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

// Rediriger si panier vide
onMounted(() => {
  if (cartEmpty.value) {
    router.push('/products')
  }
})
</script>

<style scoped>
.checkout-page {
  min-height: 100vh;
  background: var(--background-light);
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* En-tête */
.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-header h1 {
  font-size: 2.5rem;
  color: var(--text-dark);
  margin-bottom: 2rem;
  font-weight: bold;
}

.checkout-steps {
  display: flex;
  justify-content: center;
  gap: 2rem;
  position: relative;
}

.checkout-steps::before {
  content: '';
  position: absolute;
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 2px;
  background: var(--border-color);
  z-index: 0;
}

.step {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  opacity: 0.5;
  position: relative;
  z-index: 1;
}

.step.active,
.step.completed {
  opacity: 1;
}

.step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background: var(--white);
  border: 2px solid var(--text-light);
  color: var(--text-light);
  border-radius: 50%;
  font-weight: bold;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.step.active .step-number,
.step.completed .step-number {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: var(--white);
}

.step-text {
  font-weight: 500;
}

/* Message panier vide */
.empty-cart-message {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-cart-message h2 {
  color: var(--text-dark);
  margin-bottom: 1rem;
}

.empty-cart-message p {
  color: var(--text-light);
  margin-bottom: 2rem;
}

.go-shopping-btn {
  display: inline-block;
  background: var(--primary-color);
  color: var(--white);
  padding: 1rem 2rem;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.go-shopping-btn:hover {
  background: #45a049;
  transform: translateY(-2px);
}

/* Contenu checkout */
.checkout-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
  align-items: start;
}

.step-content {
  grid-column: 1;
}

/* Formulaire */
.checkout-form {
  background: var(--white);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.checkout-form h2 {
  color: var(--text-dark);
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.form-section {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
}

.form-section h3 {
  color: var(--text-dark);
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-dark);
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

/* Options de livraison */
.delivery-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.delivery-option {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.delivery-option:hover {
  border-color: var(--primary-color);
  background: rgba(76, 175, 80, 0.05);
}

.delivery-radio {
  margin-top: 0.25rem;
}

.delivery-details strong {
  color: var(--text-dark);
  display: block;
  margin-bottom: 0.25rem;
}

.delivery-details p {
  color: var(--text-light);
  margin: 0;
  font-size: 0.9rem;
}

/* Confirmation */
.confirmation-section {
  margin-bottom: 2rem;
}

.confirmation-section h3 {
  color: var(--text-dark);
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.info-display {
  background: var(--background-light);
  padding: 1.5rem;
  border-radius: 8px;
}

.info-display p {
  margin: 0 0 0.5rem 0;
  color: var(--text-dark);
  line-height: 1.5;
}

.info-display p:last-child {
  margin-bottom: 0;
}

/* Actions du formulaire */
.form-actions {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.submit-btn {
  background: var(--primary-color);
  color: var(--white);
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
}

.submit-btn:hover:not(:disabled) {
  background: #45a049;
  transform: translateY(-1px);
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.submit-btn.confirm-btn {
  background: #28a745;
}

.submit-btn.confirm-btn:hover:not(:disabled) {
  background: #218838;
}

.back-btn {
  background: var(--white);
  color: var(--text-dark);
  border: 1px solid var(--border-color);
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: var(--background-light);
}

/* Résumé de commande */
.order-summary {
  position: sticky;
  top: 2rem;
  grid-column: 2;
}

.summary-card {
  background: var(--white);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.summary-card h3 {
  color: var(--text-dark);
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
}

.summary-items {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
}

.item-name {
  color: var(--text-dark);
  flex: 1;
  margin-right: 1rem;
}

.item-price {
  color: var(--text-dark);
  font-weight: 600;
}

.summary-totals {
  margin-bottom: 1.5rem;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.summary-line.total {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--text-dark);
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
  margin-top: 1rem;
}

/* Debug section */
.debug-section p {
  margin: 0.25rem 0;
  color: #666;
}

/* Responsive */
@media (max-width: 968px) {
  .checkout-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .step-content {
    grid-column: 1;
  }
  
  .order-summary {
    position: static;
    grid-column: 1;
    order: -1;
  }
}

@media (max-width: 768px) {
  .checkout-page {
    padding: 1rem 0;
  }
  
  .page-header h1 {
    font-size: 2rem;
  }
  
  .checkout-steps {
    gap: 1rem;
  }
  
  .checkout-steps::before {
    width: 150px;
  }
  
  .step-text {
    display: none;
  }
  
  .checkout-form,
  .summary-card {
    padding: 1.5rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>
