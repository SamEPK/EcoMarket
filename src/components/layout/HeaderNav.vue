<template>
  <header class="header">
    <nav class="navbar" role="navigation" aria-label="Navigation principale">
      <div class="nav-container">
        <!-- Logo et titre -->
        <RouterLink to="/" class="nav-brand hover-grow" aria-label="Retour à l'accueil">
          <div class="logo-container">
            <span class="logo">🌱</span>
            <span class="brand-text">EcoMarket</span>
          </div>
        </RouterLink>
        
        <!-- Menu principal -->
        <ul class="nav-menu" :class="{ active: isMenuOpen }" role="menubar">
          <li class="nav-item" role="none">
            <RouterLink 
              to="/" 
              class="nav-link link-underline" 
              role="menuitem"
              @click="closeMenu"
              aria-label="Accueil"
            >
              <span class="nav-icon">🏠</span>
              <span class="nav-text">Accueil</span>
            </RouterLink>
          </li>
          <li class="nav-item" role="none">
            <RouterLink 
              to="/products" 
              class="nav-link link-underline" 
              role="menuitem"
              @click="closeMenu"
              aria-label="Produits"
            >
              <span class="nav-icon">🛍️</span>
              <span class="nav-text">Produits</span>
            </RouterLink>
          </li>
          <li class="nav-item" role="none">
            <RouterLink 
              to="/about" 
              class="nav-link link-underline" 
              role="menuitem"
              @click="closeMenu"
              aria-label="À propos"
            >
              <span class="nav-icon">ℹ️</span>
              <span class="nav-text">À propos</span>
            </RouterLink>
          </li>
        </ul>
        
        <!-- Panier et menu burger -->
        <div class="nav-actions">
          <RouterLink 
            to="/cart" 
            class="cart-link hover-lift" 
            aria-label="Panier d'achat"
            :aria-describedby="cartItemCount > 0 ? 'cart-count' : undefined"
          >
            <span class="cart-icon">🛒</span>
            <span 
              v-if="cartItemCount > 0" 
              class="cart-badge animate-pulse"
              :id="cartItemCount > 0 ? 'cart-count' : undefined"
              :aria-label="`${cartItemCount} articles dans le panier`"
            >
              {{ cartItemCount }}
            </span>
          </RouterLink>
          
          <button 
            class="menu-toggle btn-ghost"
            @click="toggleMenu"
            :class="{ active: isMenuOpen }"
            :aria-expanded="isMenuOpen"
            aria-label="Menu de navigation"
            aria-controls="nav-menu"
            type="button"
          >
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
          </button>
        </div>
      </div>
    </nav>
    
    <!-- Overlay pour fermer le menu mobile -->
    <div 
      v-if="isMenuOpen" 
      class="menu-overlay"
      @click="closeMenu"
      aria-hidden="true"
    ></div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'

// État du menu mobile
const isMenuOpen = ref(false)

// Store du panier
const cartStore = useCartStore()
const cartItemCount = computed(() => cartStore.itemCount)

// Méthodes pour le menu mobile
function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
  
  // Gestion de l'accessibilité
  if (isMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

function closeMenu() {
  isMenuOpen.value = false
  document.body.style.overflow = ''
}

// Fermer le menu avec Escape
function handleEscapeKey(event) {
  if (event.key === 'Escape' && isMenuOpen.value) {
    closeMenu()
  }
}

// Fermer le menu lors du redimensionnement
function handleResize() {
  if (window.innerWidth > 768 && isMenuOpen.value) {
    closeMenu()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscapeKey)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscapeKey)
  window.removeEventListener('resize', handleResize)
  document.body.style.overflow = '' // Nettoyage
})
</script>

<style scoped>
.header {
  background: var(--background-primary);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow-lg);
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  transition: all var(--transition-normal);
}

.header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--primary-color);
  opacity: 0.3;
}

.navbar {
  width: 100%;
  position: relative;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
}

/* Logo et marque */
.nav-brand {
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: all var(--transition-fast);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-sm);
}

.nav-brand:hover {
  background: var(--primary-color);
  color: var(--background-primary);
}

.logo-container {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.logo {
  font-size: 2.5rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  transition: transform var(--transition-fast);
}

.nav-brand:hover .logo {
  transform: rotate(10deg) scale(1.1);
}

.brand-text {
  font-family: var(--font-family-serif);
  font-size: 1.75rem;
  font-weight: var(--font-weight-bold);
  color: var(--primary-color);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: color var(--transition-fast);
}

.nav-brand:hover .brand-text {
  color: var(--background-primary);
}

/* Menu principal */
.nav-menu {
  display: flex;
  list-style: none;
  gap: var(--spacing-lg);
  margin: 0;
  padding: 0;
  align-items: center;
}

.nav-item {
  margin: 0;
  position: relative;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  text-decoration: none;
  color: var(--text-primary);
  font-weight: var(--font-weight-medium);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--border-radius-lg);
  transition: all var(--transition-fast);
  position: relative;
  border: 2px solid transparent;
}

.nav-link:hover {
  background: var(--primary-color);
  color: var(--background-primary);
  transform: translateY(-2px);
  border-color: var(--primary-dark);
}

.nav-link.router-link-active {
  background: var(--primary-color);
  color: var(--background-primary);
  box-shadow: var(--shadow-md);
  border-color: var(--primary-dark);
}

.nav-icon {
  font-size: 1.2rem;
  transition: transform var(--transition-fast);
}

.nav-link:hover .nav-icon {
  transform: scale(1.2);
}

.nav-text {
  font-size: 1rem;
}

/* Actions du nav (panier et menu) */
.nav-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.cart-link {
  position: relative;
  text-decoration: none;
  padding: var(--spacing-md);
  border-radius: var(--border-radius-xl);
  background: var(--secondary-color);
  color: var(--background-primary);
  font-size: 1.5rem;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-md);
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 50px;
  height: 50px;
  border: 2px solid var(--secondary-color);
}

.cart-link:hover {
  background: var(--primary-color);
  border-color: var(--primary-color);
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
}

.cart-icon {
  display: block;
  transition: transform var(--transition-fast);
}

.cart-link:hover .cart-icon {
  transform: scale(1.1);
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: var(--accent-color);
  color: var(--background-primary);
  border-radius: 50%;
  min-width: 24px;
  height: 24px;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-bold);
  box-shadow: var(--shadow-md);
  border: 2px solid var(--background-primary);
}

/* Menu burger pour mobile */
.menu-toggle {
  display: none;
  flex-direction: column;
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--spacing-md);
  gap: 6px;
  border-radius: var(--border-radius);
  transition: all var(--transition-fast);
}

.menu-toggle:hover {
  background: var(--primary-color);
}

.hamburger-line {
  width: 28px;
  height: 3px;
  background: var(--primary-color);
  transition: all var(--transition-fast);
  border-radius: 2px;
}

.menu-toggle:hover .hamburger-line {
  background: var(--background-primary);
}

.menu-toggle.active .hamburger-line:nth-child(1) {
  transform: rotate(45deg) translate(8px, 8px);
}

.menu-toggle.active .hamburger-line:nth-child(2) {
  opacity: 0;
  transform: translateX(-20px);
}

.menu-toggle.active .hamburger-line:nth-child(3) {
  transform: rotate(-45deg) translate(8px, -8px);
}

/* Overlay pour fermer le menu */
.menu-overlay {
  position: fixed;
  top: 80px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: var(--z-dropdown);
  animation: fadeIn var(--transition-fast);
}

/* Responsive */
@media (max-width: 768px) {
  .nav-container {
    height: 70px;
    padding: 0 var(--spacing-md);
  }
  
  .menu-toggle {
    display: flex;
  }
  
  .nav-menu {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    height: calc(100vh - 70px);
    background: var(--background-primary);
    backdrop-filter: blur(10px);
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding-top: var(--spacing-3xl);
    gap: var(--spacing-xl);
    transform: translateX(-100%);
    transition: transform var(--transition-normal);
    box-shadow: var(--shadow-xl);
    z-index: var(--z-dropdown);
  }
  
  .nav-menu.active {
    transform: translateX(0);
  }
  
  .nav-item {
    width: 100%;
    max-width: 300px;
    margin: 0;
  }
  
  .nav-link {
    width: 100%;
    font-size: 1.25rem;
    padding: var(--spacing-lg) var(--spacing-xl);
    justify-content: center;
    border-radius: var(--border-radius-xl);
    margin-bottom: var(--spacing-sm);
  }
  
  .nav-icon {
    font-size: 1.5rem;
  }
  
  .nav-text {
    font-size: 1.125rem;
  }
  
  .brand-text {
    font-size: 1.5rem;
  }
  
  .logo {
    font-size: 2rem;
  }
  
  .cart-link {
    min-width: 45px;
    height: 45px;
    font-size: 1.25rem;
  }
  
  .cart-badge {
    min-width: 20px;
    height: 20px;
    font-size: 0.7rem;
    top: -6px;
    right: -6px;
  }
}

@media (max-width: 480px) {
  .nav-container {
    height: 60px;
    padding: 0 var(--spacing-sm);
  }
  
  .nav-menu {
    top: 60px;
    height: calc(100vh - 60px);
    padding-top: var(--spacing-2xl);
  }
  
  .brand-text {
    font-size: 1.25rem;
  }
  
  .logo {
    font-size: 1.75rem;
  }
  
  .cart-link {
    min-width: 40px;
    height: 40px;
    font-size: 1.1rem;
  }
  
  .hamburger-line {
    width: 24px;
    height: 2px;
  }
}

/* Animation d'entrée pour les éléments du menu */
.nav-item {
  animation: slideInFromTop 0.3s ease-out;
}

.nav-item:nth-child(1) {
  animation-delay: 0.1s;
}

.nav-item:nth-child(2) {
  animation-delay: 0.2s;
}

.nav-item:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes slideInFromTop {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Support pour les préférences d'accessibilité */
@media (prefers-reduced-motion: reduce) {
  .nav-item {
    animation: none;
  }
  
  .nav-link,
  .cart-link,
  .hamburger-line,
  .menu-toggle,
  .nav-menu {
    transition: none !important;
  }
}

/* Mode sombre */
@media (prefers-color-scheme: dark) {
  .header {
    background: var(--background-secondary);
    border-bottom-color: var(--border-color);
  }
  
  .nav-menu {
    background: var(--background-secondary);
  }
  
  .menu-toggle:hover {
    background: var(--primary-color);
  }
  
  .nav-brand:hover {
    background: var(--primary-color);
  }
}
</style>
