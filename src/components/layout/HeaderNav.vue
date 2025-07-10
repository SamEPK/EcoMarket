<template>
  <header class="header">
    <nav class="navbar">
      <div class="nav-container">
        <!-- Logo et titre -->
        <RouterLink to="/" class="nav-brand">
          <span class="logo">🌱</span>
          <span class="brand-text">EcoMarket</span>
        </RouterLink>
        
        <!-- Menu principal -->
        <ul class="nav-menu" :class="{ active: isMenuOpen }">
          <li class="nav-item">
            <RouterLink to="/" class="nav-link" @click="closeMenu">
              Accueil
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/products" class="nav-link" @click="closeMenu">
              Produits
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/about" class="nav-link" @click="closeMenu">
              À propos
            </RouterLink>
          </li>
        </ul>
        
        <!-- Panier et menu burger -->
        <div class="nav-actions">
          <RouterLink to="/cart" class="cart-link">
            <span v-if="cartItemCount > 0" class="cart-badge">
              {{ cartItemCount }}
            </span>
          </RouterLink>
          
          <button 
            class="menu-toggle"
            @click="toggleMenu"
            :class="{ active: isMenuOpen }"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
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
}

function closeMenu() {
  isMenuOpen.value = false
}
</script>

<style scoped>
.header {
  background: var(--white);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar {
  width: 100%;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

/* Logo et marque */
.nav-brand {
  display: flex;
  align-items: center;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
}

.logo {
  font-size: 2rem;
  margin-right: 0.5rem;
}

.brand-text {
  color: var(--text-dark);
}

/* Menu principal */
.nav-menu {
  display: flex;
  list-style: none;
  gap: 2rem;
  margin: 0;
}

.nav-item {
  margin: 0;
}

.nav-link {
  text-decoration: none;
  color: var(--text-dark);
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  transition: all 0.3s ease;
}

.nav-link:hover,
.nav-link.router-link-active {
  background-color: var(--primary-color);
  color: var(--white);
}

/* Actions du nav (panier et menu) */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.cart-link {
  position: relative;
  text-decoration: none;
  padding: 0.5rem;
  border-radius: 50%;
  background-color: var(--secondary-color);
  color: var(--white);
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.cart-link:hover {
  background-color: var(--primary-color);
  transform: scale(1.1);
}

.cart-icon {
  display: block;
}

.cart-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: var(--accent-color);
  color: var(--white);
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

/* Menu burger pour mobile */
.menu-toggle {
  display: none;
  flex-direction: column;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  gap: 4px;
}

.menu-toggle span {
  width: 25px;
  height: 3px;
  background-color: var(--text-dark);
  transition: all 0.3s ease;
}

.menu-toggle.active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.menu-toggle.active span:nth-child(2) {
  opacity: 0;
}

.menu-toggle.active span:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}

/* Responsive */
@media (max-width: 768px) {
  .menu-toggle {
    display: flex;
  }
  
  .nav-menu {
    position: fixed;
    top: 70px;
    left: -100%;
    width: 100%;
    height: calc(100vh - 70px);
    background-color: var(--white);
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding-top: 2rem;
    transition: left 0.3s ease;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  }
  
  .nav-menu.active {
    left: 0;
  }
  
  .nav-item {
    margin: 1rem 0;
  }
  
  .nav-link {
    font-size: 1.2rem;
    padding: 1rem 2rem;
  }
}
</style>
