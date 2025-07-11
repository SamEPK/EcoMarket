<template>
  <div class="home-page">

    <section class="hero">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">
            Bienvenue sur <span class="brand-highlight">EcoMarket</span>
          </h1>
          <p class="hero-subtitle">
            Découvrez des produits artisanaux et respectueux de l'environnement,
            créés avec passion par des artisans locaux.
          </p>
          <div class="hero-actions">
            <RouterLink to="/products" class="cta-button primary">
              Explorer nos produits
            </RouterLink>
            <RouterLink to="/about" class="cta-button secondary">
              En savoir plus
            </RouterLink>
          </div>
        </div>
        <div class="hero-image">
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=400&fit=crop&crop=center&auto=format&q=80"
            alt="Produits artisanaux écologiques"
            class="hero-img"
            loading="lazy"
          />
        </div>
      </div>
    </section>

    <section class="values-section">
      <div class="container">
        <h2 class="section-title">Nos valeurs</h2>
        <div class="values-grid">
          <div class="value-card">
            <div class="value-icon">
              <Leaf :size="48" />
            </div>
            <h3>Écologique</h3>
            <p>Produits respectueux de l'environnement et durables</p>
          </div>
          <div class="value-card">
            <div class="value-icon">
              <Palette :size="48" />
            </div>
            <h3>Artisanal</h3>
            <p>Créations uniques faites main par des artisans passionnés</p>
          </div>
          <div class="value-card">
            <div class="value-icon">
              <Home :size="48" />
            </div>
            <h3>Local</h3>
            <p>Soutien à l'économie locale et aux producteurs de notre région</p>
          </div>
          <div class="value-card">
            <div class="value-icon">
              <Heart :size="48" />
            </div>
            <h3>Éthique</h3>
            <p>Commerce équitable et pratiques responsables</p>
          </div>
        </div>
      </div>
    </section>

    <section class="featured-products">
      <div class="container">
        <h2 class="section-title">Produits populaires</h2>
        <div v-if="loading" class="loading">
          <p>Chargement des produits...</p>
        </div>
        <div v-else class="products-grid">
          <ProductCard
            v-for="product in featuredProducts"
            :key="product.id"
            :product="product"
            @click="goToProduct"
            @add-to-cart="addToCart"
          />
        </div>
        <div class="view-all">
          <RouterLink to="/products" class="view-all-btn">
            Voir tous les produits →
          </RouterLink>
        </div>
      </div>
    </section>

    <section class="newsletter-section">
      <div class="container">
        <div class="newsletter-content">
          <h2>Restez informé</h2>
          <p>Inscrivez-vous à notre newsletter pour recevoir nos dernières nouveautés</p>
          <form @submit.prevent="subscribeNewsletter" class="newsletter-form">
            <input
              v-model="emailInput"
              type="email"
              placeholder="Votre adresse email"
              required
              class="newsletter-input"
            />
            <button type="submit" class="newsletter-btn" :disabled="isSubscribing">
              {{ isSubscribing ? 'Inscription...' : "S'inscrire" }}
            </button>
          </form>
          <p v-if="subscriptionMessage" class="subscription-message" :class="messageType">
            {{ subscriptionMessage }}
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { Leaf, Palette, Home, Heart } from 'lucide-vue-next'
import { useProductsStore } from '@/stores/productsStore'
import { useCartStore } from '@/stores/cartStore'
import ProductCard from '@/components/common/ProductCard.vue'

const router = useRouter()
const productsStore = useProductsStore()
const cartStore = useCartStore()
const emailInput = ref('')
const isSubscribing = ref(false)
const subscriptionMessage = ref('')
const messageType = ref('')
const loading = computed(() => productsStore.loading)
const featuredProducts = computed(() =>
  productsStore.products.slice(0, 4) // Affiche les 4 premiers produits
)
function goToProduct(product) {
  router.push(`/product/${product.id}`)
}

function addToCart(product) {
  cartStore.addItem(product)
}

async function subscribeNewsletter() {
  if (!emailInput.value) return

  isSubscribing.value = true
  subscriptionMessage.value = ''

  try {
    await new Promise(resolve => setTimeout(resolve, 1500))

    subscriptionMessage.value = 'Inscription réussie ! Merci de votre confiance.'
    messageType.value = 'success'
    emailInput.value = ''
  } catch (error) {
    subscriptionMessage.value = 'Erreur lors de l\'inscription. Veuillez réessayer.'
    messageType.value = 'error'
  } finally {
    isSubscribing.value = false
    // Efface le message après 5 secondes
    setTimeout(() => {
      subscriptionMessage.value = ''
    }, 5000)
  }
}
onMounted(() => {
  if (productsStore.products.length === 0) {
    productsStore.fetchProducts()
  }
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
}

/* Hero Section */
.hero {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 4rem 1rem;
  min-height: 80vh;
  display: flex;
  align-items: center;
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
}

.hero-title {
  font-size: 3rem;
  font-weight: bold;
  color: #0f172a;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.brand-highlight {
  color: #475569;
}

.hero-subtitle {
  font-size: 1.2rem;
  color: #334155;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.cta-button {
  display: inline-block;
  padding: 1rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.cta-button.primary {
  background: #475569;
  color: #ffffff;
  border: 2px solid #475569;
}

.cta-button.primary:hover {
  background: #334155;
  border-color: #334155;
  transform: translateY(-2px);
}

.cta-button.secondary {
  background: transparent;
  color: #475569;
  border: 2px solid #475569;
}

.cta-button.secondary:hover {
  background: #475569;
  color: #ffffff;
}

.hero-image {
  text-align: center;
}

.hero-img {
  max-width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

/* Sections communes */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  color: var(--text-dark);
  margin-bottom: 3rem;
  font-weight: bold;
}

/* Section Valeurs */
.values-section {
  padding: 4rem 0;
  background: #ffffff;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.value-card {
  text-align: center;
  padding: 2rem;
  border-radius: 12px;
  background: var(--background-light);
  transition: transform 0.3s ease;
}

.value-card:hover {
  transform: translateY(-5px);
}

.value-icon {
  margin-bottom: 1rem;
  color: var(--primary-color);
  display: flex;
  justify-content: center;
}

.value-card h3 {
  font-size: 1.5rem;
  color: var(--text-dark);
  margin-bottom: 1rem;
}

.value-card p {
  color: var(--text-light);
  line-height: 1.6;
}

/* Section Produits */
.featured-products {
  padding: 4rem 0;
  background: var(--background-light);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: var(--text-light);
}

.view-all {
  text-align: center;
  margin-top: 2rem;
}

.view-all-btn {
  display: inline-block;
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.view-all-btn:hover {
  background: var(--primary-color);
  color: #ffffff;
}

/* Section Newsletter */
.newsletter-section {
  padding: 4rem 0;
  background: var(--primary-color);
  color: #ffffff;
}

.newsletter-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.newsletter-content h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #ffffff;
}

.newsletter-content p {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  color: #ffffff;
  opacity: 0.95;
}

.newsletter-form {
  display: flex;
  gap: 1rem;
  max-width: 400px;
  margin: 0 auto 1rem;
}

.newsletter-input {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
}

.newsletter-input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
}

.newsletter-btn {
  background: var(--accent-color);
  color: #ffffff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.newsletter-btn:hover:not(:disabled) {
  background: #e68900;
}

.newsletter-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.subscription-message {
  margin-top: 1rem;
  padding: 0.5rem;
  border-radius: 6px;
  font-weight: 500;
}

.subscription-message.success {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.subscription-message.error {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.3);
}
@media (max-width: 968px) {
  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-actions {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 2rem 1rem;
  }

  .hero-title {
    font-size: 2rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .newsletter-form {
    flex-direction: column;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}
</style>
