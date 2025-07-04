<template>
  <div class="order-success-page">
    <div class="container">
      <!-- Animation de succès -->
      <div class="success-animation">
        <div class="success-checkmark">
          <div class="check-icon">
            <span class="icon-line line-tip"></span>
            <span class="icon-line line-long"></span>
            <div class="icon-circle"></div>
            <div class="icon-fix"></div>
          </div>
        </div>
      </div>

      <!-- Contenu principal -->
      <div class="success-content">
        <h1 class="success-title">Commande confirmée !</h1>
        <p class="success-message">
          Merci pour votre achat ! Votre commande a été traitée avec succès.
        </p>
        
        <!-- Détails de la commande -->
        <div class="order-details">
          <h2>Détails de votre commande</h2>
          <div class="order-info">
            <div class="info-item">
              <span class="info-label">Numéro de commande :</span>
              <span class="info-value">#{{ orderNumber }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Date de commande :</span>
              <span class="info-value">{{ formatDate(orderDate) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Email de confirmation :</span>
              <span class="info-value">{{ customerEmail }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Livraison estimée :</span>
              <span class="info-value">{{ formatDate(estimatedDelivery) }}</span>
            </div>
          </div>
        </div>

        <!-- Prochaines étapes -->
        <div class="next-steps">
          <h3>Prochaines étapes</h3>
          <div class="steps-list">
            <div class="step-item">
              <div class="step-icon">📧</div>
              <div class="step-content">
                <h4>Confirmation par email</h4>
                <p>Vous recevrez un email de confirmation avec tous les détails de votre commande.</p>
              </div>
            </div>
            <div class="step-item">
              <div class="step-icon">📦</div>
              <div class="step-content">
                <h4>Préparation de la commande</h4>
                <p>Nos artisans préparent soigneusement votre commande avec amour.</p>
              </div>
            </div>
            <div class="step-item">
              <div class="step-icon">🚚</div>
              <div class="step-content">
                <h4>Livraison éco-responsable</h4>
                <p>Votre commande sera livrée dans un emballage 100% recyclable.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="success-actions">
          <RouterLink to="/products" class="btn btn-primary">
            Continuer mes achats
          </RouterLink>
          <button @click="shareOrder" class="btn btn-secondary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
              <polyline points="16,6 12,2 8,6"/>
              <line x1="12" y1="2" x2="12" y2="15"/>
            </svg>
            Partager ma commande
          </button>
        </div>

        <!-- Support -->
        <div class="support-section">
          <h3>Besoin d'aide ?</h3>
          <p>Notre équipe est là pour vous accompagner</p>
          <div class="support-contacts">
            <a href="mailto:support@ecomarket.com" class="support-item">
              <span class="support-icon">📧</span>
              <span>support@ecomarket.com</span>
            </a>
            <a href="tel:+33123456789" class="support-item">
              <span class="support-icon">📞</span>
              <span>01 23 45 67 89</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'

// Données de commande simulées
const orderNumber = ref('')
const orderDate = ref(new Date())
const customerEmail = ref('client@example.com')
const estimatedDelivery = ref(new Date())

// Génération du numéro de commande
const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substr(2, 5).toUpperCase()
  return `ECO${timestamp}${random}`
}

// Formatage des dates
const formatDate = (date) => {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

// Partage de la commande
const shareOrder = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Ma commande EcoMarket',
        text: `J'ai commandé des produits éco-responsables ! Commande #${orderNumber.value}`,
        url: window.location.href
      })
    } catch (error) {
      console.log('Partage annulé')
    }
  } else {
    // Fallback pour les navigateurs sans support de l'API Web Share
    if (typeof window !== 'undefined' && window.showToast) {
      window.showToast({
        type: 'info',
        title: 'Lien copié',
        message: 'Le lien de votre commande a été copié dans le presse-papiers',
        duration: 3000
      })
    }
    
    // Copier l'URL dans le presse-papiers
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
    }
  }
}

// Lifecycle
onMounted(() => {
  // Génération des données de commande
  orderNumber.value = generateOrderNumber()
  
  // Estimation de livraison (3-5 jours ouvrés)
  const deliveryDate = new Date()
  deliveryDate.setDate(deliveryDate.getDate() + Math.floor(Math.random() * 3) + 3)
  estimatedDelivery.value = deliveryDate
  
  // Récupération de l'email du formulaire si disponible
  const savedEmail = localStorage.getItem('checkout-email')
  if (savedEmail) {
    customerEmail.value = savedEmail
    localStorage.removeItem('checkout-email') // Nettoyage
  }
  
  // Notification de bienvenue
  setTimeout(() => {
    if (typeof window !== 'undefined' && window.showToast) {
      window.showToast({
        type: 'success',
        title: 'Bienvenue dans la famille EcoMarket !',
        message: 'Vous contribuez à un monde plus durable 🌱',
        duration: 4000
      })
    }
  }, 2000)
})
</script>

<style scoped>
.order-success-page {
  min-height: 100vh;
  background: var(--primary-color);
  padding: 2rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Animation de succès */
.success-animation {
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
}

.success-checkmark {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: block;
  stroke-width: 3;
  stroke: #4CAF50;
  stroke-miterlimit: 10;
  box-shadow: inset 0px 0px 0px #4CAF50;
  animation: fill 0.4s ease-in-out 0.4s forwards, scale 0.3s ease-in-out 0.9s both;
  position: relative;
}

.success-checkmark .check-icon {
  width: 120px;
  height: 120px;
  position: relative;
  border-radius: 50%;
  box-sizing: border-box;
  background: white;
  border: 3px solid #4CAF50;
}

.success-checkmark .icon-line {
  height: 3px;
  background-color: #4CAF50;
  display: block;
  border-radius: 2px;
  position: absolute;
  z-index: 10;
}

.success-checkmark .icon-line.line-tip {
  top: 50px;
  left: 20px;
  width: 25px;
  transform: rotate(45deg);
  animation: icon-line-tip 0.75s;
}

.success-checkmark .icon-line.line-long {
  top: 55px;
  left: 35px;
  width: 50px;
  transform: rotate(-45deg);
  animation: icon-line-long 0.75s;
}

.success-checkmark .icon-circle {
  top: -3px;
  left: -3px;
  z-index: 10;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  position: absolute;
  box-sizing: border-box;
  border: 3px solid #4CAF50;
}

.success-checkmark .icon-fix {
  top: 10px;
  width: 5px;
  left: 30px;
  z-index: 1;
  height: 90px;
  position: absolute;
  background-color: white;
  transform: rotate(-45deg);
}

/* Contenu principal */
.success-content {
  background: white;
  border-radius: var(--border-radius-xl);
  padding: 3rem;
  box-shadow: var(--shadow-2xl);
  text-align: center;
  animation: slideInUp 0.6s ease-out;
}

.success-title {
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
  font-weight: var(--font-weight-bold);
}

.success-message {
  font-size: 1.2rem;
  color: var(--text-muted);
  margin-bottom: 3rem;
  line-height: 1.6;
}

/* Détails de la commande */
.order-details {
  background: var(--background-light);
  border-radius: var(--border-radius-lg);
  padding: 2rem;
  margin-bottom: 3rem;
  text-align: left;
}

.order-details h2 {
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.order-info {
  display: grid;
  gap: 1rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border-color);
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  color: var(--text-muted);
  font-weight: var(--font-weight-medium);
}

.info-value {
  color: var(--text-primary);
  font-weight: var(--font-weight-semibold);
}

/* Prochaines étapes */
.next-steps {
  margin-bottom: 3rem;
  text-align: left;
}

.next-steps h3 {
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
  text-align: center;
}

.steps-list {
  display: grid;
  gap: 1.5rem;
}

.step-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--background-light);
  border-radius: var(--border-radius-lg);
  transition: all var(--transition-normal);
}

.step-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.step-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-color);
  border-radius: 50%;
  flex-shrink: 0;
}

.step-content h4 {
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.step-content p {
  color: var(--text-muted);
  line-height: 1.5;
  margin: 0;
}

/* Actions */
.success-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border-radius: var(--border-radius-lg);
  text-decoration: none;
  font-weight: var(--font-weight-semibold);
  transition: all var(--transition-normal);
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn-secondary {
  background: var(--background-light);
  color: var(--text-primary);
  border: 2px solid var(--border-color);
}

.btn-secondary:hover {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

/* Support */
.support-section {
  border-top: 1px solid var(--border-color);
  padding-top: 2rem;
}

.support-section h3 {
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.support-section p {
  color: var(--text-muted);
  margin-bottom: 1.5rem;
}

.support-contacts {
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
}

.support-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--background-light);
  border-radius: var(--border-radius-lg);
  text-decoration: none;
  color: var(--text-primary);
  transition: all var(--transition-normal);
}

.support-item:hover {
  background: var(--primary-color);
  color: white;
  transform: translateY(-2px);
}

.support-icon {
  font-size: 1.2rem;
}

/* Animations */
@keyframes fill {
  100% {
    box-shadow: inset 0px 0px 0px 120px #4CAF50;
  }
}

@keyframes scale {
  0%, 100% {
    transform: none;
  }
  50% {
    transform: scale3d(1.1, 1.1, 1);
  }
}

@keyframes icon-line-tip {
  0% {
    width: 0;
    left: 20px;
    top: 55px;
  }
  54% {
    width: 0;
    left: 20px;
    top: 55px;
  }
  70% {
    width: 25px;
    left: 20px;
    top: 55px;
  }
  84% {
    width: 17px;
    left: 28px;
    top: 50px;
  }
  100% {
    width: 25px;
    left: 20px;
    top: 50px;
  }
}

@keyframes icon-line-long {
  0% {
    width: 0;
    right: 35px;
    top: 60px;
  }
  65% {
    width: 0;
    right: 35px;
    top: 60px;
  }
  84% {
    width: 50px;
    right: 35px;
    top: 60px;
  }
  100% {
    width: 50px;
    right: 35px;
    top: 55px;
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .success-content {
    padding: 2rem 1.5rem;
  }
  
  .success-title {
    font-size: 2rem;
  }
  
  .success-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .support-contacts {
    flex-direction: column;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
