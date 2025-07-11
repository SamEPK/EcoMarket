<template>
  <div class="order-success-page">
    <div class="container">
      <div class="success-content">
        <div class="success-icon">
          <Check :size="64" />
        </div>
        
        <h1>Commande confirmée !</h1>
        <p class="success-message">
          Votre commande a été enregistrée avec succès. Vous recevrez bientôt un email de confirmation avec les détails de votre commande.
        </p>
        
        <div class="order-info">
          <h2>Que se passe-t-il maintenant ?</h2>
          <div class="steps">
            <div class="step">
              <div class="step-number">1</div>
              <div class="step-content">
                <h3>Préparation</h3>
                <p>Nous préparons votre commande avec soin</p>
              </div>
            </div>
            
            <div class="step">
              <div class="step-number">2</div>
              <div class="step-content">
                <h3>Expédition</h3>
                <p>Votre commande sera expédiée dans les plus brefs délais</p>
              </div>
            </div>
            
            <div class="step">
              <div class="step-number">3</div>
              <div class="step-content">
                <h3>Livraison</h3>
                <p>Vous recevrez votre commande à l'adresse indiquée</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="actions">
          <RouterLink to="/orders" class="view-orders-btn">
            Voir mes commandes
          </RouterLink>
          <RouterLink to="/products" class="continue-shopping-btn">
            Continuer mes achats
          </RouterLink>
          <RouterLink to="/" class="home-btn">
            Retour à l'accueil
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Check } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.order-success-page {
  min-height: 100vh;
  background: var(--background-light);
  padding: 2rem 0;
  display: flex;
  align-items: center;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

.success-content {
  background: var(--white);
  border-radius: 12px;
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.success-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  background: var(--primary-color);
  color: var(--white);
  border-radius: 50%;
  margin-bottom: 2rem;
}

.success-content h1 {
  color: var(--text-dark);
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: bold;
}

.success-message {
  color: var(--text-light);
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.order-info {
  margin-bottom: 3rem;
}

.order-info h2 {
  color: var(--text-dark);
  font-size: 1.5rem;
  margin-bottom: 2rem;
}

.steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  text-align: left;
  max-width: 600px;
  margin: 0 auto;
}

.step {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
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
  flex-shrink: 0;
}

.step-content h3 {
  color: var(--text-dark);
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.step-content p {
  color: var(--text-light);
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 0;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.continue-shopping-btn,
.home-btn,
.view-orders-btn {
  display: inline-block;
  padding: 1rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.view-orders-btn {
  background: #17a2b8;
  color: var(--white);
}

.view-orders-btn:hover {
  background: #138496;
  transform: translateY(-2px);
}

.continue-shopping-btn {
  background: var(--primary-color);
  color: var(--white);
}

.continue-shopping-btn:hover {
  background: #45a049;
  transform: translateY(-2px);
}

.home-btn {
  background: var(--white);
  color: var(--text-dark);
  border: 1px solid var(--border-color);
}

.home-btn:hover {
  background: var(--background-light);
}

@media (max-width: 768px) {
  .success-content {
    padding: 2rem 1rem;
  }
  
  .success-content h1 {
    font-size: 2rem;
  }
  
  .steps {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .step {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .actions {
    flex-direction: column;
    align-items: center;
  }
}
</style>
