<template>
  <footer class="footer">
    <div class="footer-container">
      <!-- Section principale -->
      <div class="footer-content">
        <!-- À propos -->
        <div class="footer-section">
          <h3>EcoMarket</h3>
          <p>
            Votre marketplace dédiée aux produits artisanaux et respectueux de l'environnement.
            Soutenons ensemble l'économie locale et durable.
          </p>
          <div class="social-links">
            <a href="#" class="social-link">
              <Facebook :size="20" />
            </a>
            <a href="#" class="social-link">
              <Instagram :size="20" />
            </a>
            <a href="#" class="social-link">
              <Twitter :size="20" />
            </a>
          </div>
        </div>
        
        <!-- Liens rapides -->
        <div class="footer-section">
          <h4>Liens rapides</h4>
          <ul class="footer-links">
            <li><RouterLink to="/">Accueil</RouterLink></li>
            <li><RouterLink to="/products">Nos produits</RouterLink></li>
            <li><RouterLink to="/about">À propos</RouterLink></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
        
        <!-- Catégories -->
        <div class="footer-section">
          <h4>Catégories</h4>
          <ul class="footer-links">
            <li><a href="#" @click="filterByCategory('Cosmétiques')">Cosmétiques</a></li>
            <li><a href="#" @click="filterByCategory('Alimentation')">Alimentation</a></li>
            <li><a href="#" @click="filterByCategory('Accessoires')">Accessoires</a></li>
            <li><a href="#" @click="filterByCategory('Décoration')">Décoration</a></li>
          </ul>
        </div>
        
        <!-- Contact -->
        <div class="footer-section">
          <h4>Contact</h4>
          <div class="contact-info">
            <p>
              <Mail :size="16" />
              contact@ecomarket.fr
            </p>
            <p>
              <Phone :size="16" />
              01 23 45 67 89
            </p>
            <p>
              <MapPin :size="16" />
              123 Rue Verte, 75001 Paris
            </p>
          </div>
        </div>
      </div>
      
      <!-- Copyright -->
      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} EcoMarket. Tous droits réservés.</p>
        <p class="footer-note">
          Fait avec ♥ pour la planète
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-vue-next'
import { useProductsStore } from '@/stores/productsStore'

const router = useRouter()
const productsStore = useProductsStore()

// Année actuelle
const currentYear = computed(() => new Date().getFullYear())

// Fonction pour filtrer par catégorie
function filterByCategory(category) {
  productsStore.updateFilters({ category })
  router.push('/products')
}
</script>

<style scoped>
.footer {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: #ffffff;
  margin-top: auto;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem 1rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section h3 {
  color: #ffffff;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.footer-section h4 {
  color: #ffffff;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.footer-section p {
  line-height: 1.6;
  margin-bottom: 1rem;
  color: #ffffff;
  opacity: 0.95;
}

.footer-links {
  list-style: none;
  padding: 0;
}

.footer-links li {
  margin-bottom: 0.5rem;
}

.footer-links a {
  color: #ffffff;
  text-decoration: none;
  opacity: 0.95;
  transition: opacity 0.3s ease;
}

.footer-links a:hover {
  opacity: 1;
  text-decoration: underline;
}

.social-links {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.social-link {
  display: inline-block;
  width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  text-align: center;
  line-height: 40px;
  text-decoration: none;
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.social-link:hover {
  background-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.contact-info p {
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #ffffff;
  opacity: 0.95;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 1rem;
  text-align: center;
}

.footer-bottom p {
  margin: 0.25rem 0;
  color: #ffffff;
  opacity: 0.9;
}

.footer-note {
  font-style: italic;
  font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .footer-section {
    text-align: center;
  }
  
  .social-links {
    justify-content: center;
  }
}
</style>
