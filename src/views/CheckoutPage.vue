<template>
  <div class="checkout-page">
    <div class="container">
      <!-- En-tête -->
      <div class="page-header">
        <h1>Finaliser ma commande</h1>
        <div class="checkout-steps">
          <div class="step active">
            <span class="step-number">1</span>
            <span class="step-text">Informations</span>
          </div>
          <div class="step">
            <span class="step-number">2</span>
            <span class="step-text">Paiement</span>
          </div>
          <div class="step">
            <span class="step-number">3</span>
            <span class="step-text">Confirmation</span>
          </div>
        </div>
      </div>

      <!-- Redirection si panier vide -->
      <div v-if="isEmpty" class="empty-cart-message">
        <h2>Votre panier est vide</h2>
        <p>Ajoutez des produits à votre panier avant de procéder au paiement.</p>
        <RouterLink to="/products" class="go-shopping-btn">
          Découvrir nos produits
        </RouterLink>
      </div>

      <!-- Contenu du checkout -->
      <div v-else class="checkout-content">
        <!-- Formulaire -->
        <div class="checkout-form">
          <form @submit.prevent="handleSubmit">
            <!-- Informations personnelles -->
            <div class="form-section">
              <h2>Informations personnelles</h2>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="firstName">Prénom *</label>
                  <input
                    id="firstName"
                    v-model="formData.firstName"
                    @blur="validateField('firstName', formData.firstName)"
                    type="text"
                    class="form-input"
                    :class="{ error: errors.firstName }"
                    placeholder="Votre prénom"
                  />
                  <span v-if="errors.firstName" class="error-message">
                    {{ errors.firstName }}
                  </span>
                </div>
                
                <div class="form-group">
                  <label for="lastName">Nom *</label>
                  <input
                    id="lastName"
                    v-model="formData.lastName"
                    @blur="validateField('lastName', formData.lastName)"
                    type="text"
                    class="form-input"
                    :class="{ error: errors.lastName }"
                    placeholder="Votre nom"
                  />
                  <span v-if="errors.lastName" class="error-message">
                    {{ errors.lastName }}
                  </span>
                </div>
              </div>

              <div class="form-group">
                <label for="email">Email *</label>
                <input
                  id="email"
                  v-model="formData.email"
                  @blur="validateField('email', formData.email)"
                  type="email"
                  class="form-input"
                  :class="{ error: errors.email }"
                  placeholder="votre@email.com"
                />
                <span v-if="errors.email" class="error-message">
                  {{ errors.email }}
                </span>
              </div>

              <div class="form-group">
                <label for="phone">Téléphone</label>
                <input
                  id="phone"
                  v-model="formData.phone"
                  @blur="validateField('phone', formData.phone)"
                  type="tel"
                  class="form-input"
                  :class="{ error: errors.phone }"
                  placeholder="01 23 45 67 89"
                />
                <span v-if="errors.phone" class="error-message">
                  {{ errors.phone }}
                </span>
              </div>
            </div>

            <!-- Adresse de livraison -->
            <div class="form-section">
              <h2>Adresse de livraison</h2>
              
              <div class="form-group">
                <label for="address">Adresse *</label>
                <input
                  id="address"
                  v-model="formData.address"
                  @blur="validateField('address', formData.address)"
                  type="text"
                  class="form-input"
                  :class="{ error: errors.address }"
                  placeholder="123 rue de la Paix"
                />
                <span v-if="errors.address" class="error-message">
                  {{ errors.address }}
                </span>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="postalCode">Code postal *</label>
                  <input
                    id="postalCode"
                    v-model="formData.postalCode"
                    @blur="validateField('postalCode', formData.postalCode)"
                    type="text"
                    class="form-input"
                    :class="{ error: errors.postalCode }"
                    placeholder="75001"
                  />
                  <span v-if="errors.postalCode" class="error-message">
                    {{ errors.postalCode }}
                  </span>
                </div>
                
                <div class="form-group">
                  <label for="city">Ville *</label>
                  <input
                    id="city"
                    v-model="formData.city"
                    @blur="validateField('city', formData.city)"
                    type="text"
                    class="form-input"
                    :class="{ error: errors.city }"
                    placeholder="Paris"
                  />
                  <span v-if="errors.city" class="error-message">
                    {{ errors.city }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Options de livraison -->
            <div class="form-section">
              <h2>Options de livraison</h2>
              
              <div class="delivery-options">
                <label class="delivery-option">
                  <input
                    v-model="formData.deliveryMethod"
                    type="radio"
                    value="standard"
                    class="delivery-radio"
                  />
                  <div class="delivery-details">
                    <strong>Livraison standard (Gratuite)</strong>
                    <p>3-5 jours ouvrés • Éco-responsable</p>
                  </div>
                </label>
                
                <label class="delivery-option">
                  <input
                    v-model="formData.deliveryMethod"
                    type="radio"
                    value="express"
                    class="delivery-radio"
                  />
                  <div class="delivery-details">
                    <strong>Livraison express (+5€)</strong>
                    <p>24-48h • Emballage recyclable</p>
                  </div>
                </label>
              </div>
            </div>

            <!-- Commentaires -->
            <div class="form-section">
              <h2>Commentaires (optionnel)</h2>
              <div class="form-group">
                <label for="comments">Instructions de livraison</label>
                <textarea
                  id="comments"
                  v-model="formData.comments"
                  class="form-textarea"
                  placeholder="Instructions spéciales pour la livraison..."
                  rows="3"
                ></textarea>
              </div>
            </div>

            <!-- Newsletter -->
            <div class="form-section">
              <label class="checkbox-label">
                <input
                  v-model="formData.newsletter"
                  type="checkbox"
                  class="checkbox-input"
                />
                <span class="checkbox-text">
                  Je souhaite recevoir la newsletter avec les nouveautés et offres spéciales
                </span>
              </label>
            </div>

            <!-- Bouton de soumission -->
            <div class="form-actions">
              <button
                type="submit"
                :disabled="isSubmitting || !isValid"
                class="submit-btn"
                :class="{ submitting: isSubmitting }"
              >
                {{ isSubmitting ? 'Traitement...' : 'Confirmer la commande' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Résumé de commande -->
        <div class="order-summary">
          <div class="summary-card">
            <h3>Résumé de votre commande</h3>
            
            <!-- Articles -->
            <div class="summary-items">
              <div 
                v-for="item in items" 
                :key="item.id"
                class="summary-item"
              >
                <span class="item-name">
                  {{ item.name }} × {{ item.quantity }}
                </span>
                <span class="item-price">
                  {{ formatPrice(item.price * item.quantity) }}
                </span>
              </div>
            </div>

            <!-- Total -->
            <div class="summary-totals">
              <div class="summary-line">
                <span>Sous-total</span>
                <span>{{ formatPrice(totalPrice) }}</span>
              </div>
              <div class="summary-line">
                <span>Livraison</span>
                <span>{{ deliveryPrice }}</span>
              </div>
              <div class="summary-line total">
                <span>Total</span>
                <span>{{ formatPrice(finalTotal) }}</span>
              </div>
            </div>

            <div class="eco-badge">
              <span class="eco-icon">🌱</span>
              <div>
                <p><strong>Commande éco-responsable</strong></p>
                <p>Emballage recyclable et livraison neutre en carbone</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import { useForm } from '@/composables/useForm'

const router = useRouter()
const cartStore = useCartStore()

// Form avec le composable useForm
const {
  formData,
  errors,
  isSubmitting,
  isValid,
  setValidationRules,
  validateField,
  submitForm
} = useForm({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  postalCode: '',
  city: '',
  deliveryMethod: 'standard',
  comments: '',
  newsletter: false
})

// Computed properties
const isEmpty = computed(() => cartStore.isEmpty)
const items = computed(() => cartStore.items)
const totalPrice = computed(() => cartStore.totalPrice)

const deliveryPrice = computed(() => {
  if (formData.value.deliveryMethod === 'express') {
    return '5,00 €'
  }
  return 'Gratuite'
})

const finalTotal = computed(() => {
  let total = totalPrice.value
  if (formData.value.deliveryMethod === 'express') {
    total += 5
  }
  return total
})

// Méthodes
function formatPrice(price) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

async function handleSubmit() {
  // Vérifier si le panier n'est pas vide
  if (isEmpty.value) {
    if (typeof window !== 'undefined' && window.showToast) {
      window.showToast({
        type: 'error',
        title: 'Panier vide',
        message: 'Votre panier est vide. Ajoutez des produits avant de commander.',
        duration: 4000
      })
    }
    return
  }

  const success = await submitForm(async (data) => {
    // Afficher un toast de début de traitement
    if (typeof window !== 'undefined' && window.showToast) {
      window.showToast({
        type: 'info',
        title: 'Commande en cours',
        message: 'Traitement de votre commande en cours...',
        duration: 3000
      })
    }

    try {
      // Simulation d'un appel API pour traiter la commande
      console.log('Données de commande:', data)
      
      // Simulation d'un délai de traitement
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulation d'une possible erreur (10% de chance)
      if (Math.random() < 0.1) {
        throw new Error('Erreur de traitement de paiement')
      }
      
      // Succès : vider le panier et afficher une notification
      cartStore.clearCart()
      
      if (typeof window !== 'undefined' && window.showToast) {
        window.showToast({
          type: 'success',
          title: 'Commande confirmée !',
          message: 'Votre commande a été traitée avec succès. Vous allez recevoir un email de confirmation.',
          duration: 5000
        })
      }
      
      // Redirection vers une page de confirmation
      setTimeout(() => {
        router.push('/order-success')
      }, 1500)
      
    } catch (error) {
      // Gestion des erreurs
      console.error('Erreur lors du traitement de la commande:', error)
      
      if (typeof window !== 'undefined' && window.showToast) {
        window.showToast({
          type: 'error',
          title: 'Erreur de commande',
          message: 'Une erreur est survenue lors du traitement de votre commande. Veuillez réessayer.',
          duration: 5000,
          actions: [
            {
              label: 'Réessayer',
              action: () => handleSubmit()
            }
          ]
        })
      }
      
      throw error // Re-throw pour que submitForm puisse gérer l'erreur
    }
  })

  if (!success) {
    console.error('Erreur lors de la soumission du formulaire')
    
    if (typeof window !== 'undefined' && window.showToast) {
      window.showToast({
        type: 'error',
        title: 'Formulaire invalide',
        message: 'Veuillez corriger les erreurs dans le formulaire avant de continuer.',
        duration: 4000
      })
    }
  }
}

// Configuration des règles de validation
onMounted(() => {
  setValidationRules({
    firstName: {
      required: true,
      minLength: 2
    },
    lastName: {
      required: true,
      minLength: 2
    },
    email: {
      required: true,
      email: true
    },
    phone: {
      pattern: /^[0-9\s\-\+\(\)\.]{10,}$/,
      patternMessage: 'Format de téléphone invalide'
    },
    address: {
      required: true,
      minLength: 5
    },
    postalCode: {
      required: true,
      pattern: /^[0-9]{5}$/,
      patternMessage: 'Le code postal doit contenir 5 chiffres'
    },
    city: {
      required: true,
      minLength: 2
    }
  })
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
}

.step {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  opacity: 0.5;
}

.step.active {
  opacity: 1;
}

.step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background: var(--primary-color);
  color: var(--white);
  border-radius: 50%;
  font-weight: bold;
  font-size: 0.9rem;
}

.step:not(.active) .step-number {
  background: var(--text-light);
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

/* Formulaire */
.checkout-form {
  background: var(--white);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.form-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.form-section:last-of-type {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.form-section h2 {
  color: var(--text-dark);
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
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

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

.form-input.error,
.form-textarea.error {
  border-color: var(--error-color);
}

.error-message {
  display: block;
  color: var(--error-color);
  font-size: 0.85rem;
  margin-top: 0.25rem;
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

/* Checkbox */
.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
}

.checkbox-input {
  margin-top: 0.25rem;
}

.checkbox-text {
  color: var(--text-dark);
  line-height: 1.5;
}

/* Actions du formulaire */
.form-actions {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}

.submit-btn {
  width: 100%;
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

.submit-btn:hover:not(:disabled) {
  background: #45a049;
  transform: translateY(-1px);
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.submit-btn.submitting {
  background: var(--secondary-color);
}

/* Résumé de commande */
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
  align-items: flex-start;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
}

.item-name {
  color: var(--text-dark);
  flex: 1;
  margin-right: 1rem;
}

.item-price {
  color: var(--text-light);
  font-weight: 500;
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

.eco-badge {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  background: var(--background-light);
  padding: 1rem;
  border-radius: 8px;
}

.eco-icon {
  font-size: 1.5rem;
  margin-top: 0.25rem;
}

.eco-badge p {
  margin: 0;
  line-height: 1.4;
}

.eco-badge p:first-child {
  color: var(--text-dark);
  margin-bottom: 0.25rem;
}

.eco-badge p:last-child {
  color: var(--text-light);
  font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 968px) {
  .checkout-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .order-summary {
    position: static;
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
  
  .delivery-option {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
