<template>
  <div id="app" class="min-h-screen d-flex flex-column">
    <!-- Skip to main content link for accessibility -->
    <a href="#main-content" class="skip-link">Aller au contenu principal</a>
    
    <!-- Header avec navigation -->
    <HeaderNav />
    
    <!-- Contenu principal avec routeur -->
    <main id="main-content" class="main-content flex-1 animate-fade-in">
      <RouterView />
    </main>
    
    <!-- Footer -->
    <FooterComponent />
    
    <!-- Scroll to top button -->
    <button
      v-if="showScrollToTop"
      @click="scrollToTop"
      class="scroll-to-top"
      :class="{ visible: showScrollToTop }"
      aria-label="Retour en haut de la page"
      title="Retour en haut"
    >
      <span class="btn btn-primary">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </span>
    </button>
    
    <!-- Toast notifications container -->
    <div class="toast-container" aria-live="polite" aria-atomic="true">
      <ToastNotification
        v-for="toast in toasts"
        :key="toast.id"
        :type="toast.type"
        :title="toast.title"
        :message="toast.message"
        :duration="toast.duration"
        :actions="toast.actions"
        @close="removeToast(toast.id)"
      />
    </div>
    
    <!-- Modal dialog -->
    <ModalDialog
      v-if="modal.show"
      :title="modal.title"
      :size="modal.size"
      :closable="modal.closable"
      :actions="modal.actions"
      @close="closeModal"
    >
      <component :is="modal.component" v-bind="modal.props" />
    </ModalDialog>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, reactive } from 'vue'
import { RouterView } from 'vue-router'
import HeaderNav from './components/layout/HeaderNav.vue'
import FooterComponent from './components/layout/FooterComponent.vue'
import ToastNotification from './components/common/ToastNotification.vue'
import ModalDialog from './components/common/ModalDialog.vue'

// State pour le scroll to top
const showScrollToTop = ref(false)

// State pour les toasts
const toasts = ref([])
let toastId = 0

// State pour les modals
const modal = reactive({
  show: false,
  title: '',
  size: 'medium',
  closable: true,
  component: null,
  props: {},
  actions: []
})

// Gestion du scroll
const handleScroll = () => {
  showScrollToTop.value = window.scrollY > 300
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// Gestion des toasts
const addToast = (toastData) => {
  const toast = {
    id: ++toastId,
    type: toastData.type || 'info',
    title: toastData.title || '',
    message: toastData.message || '',
    duration: toastData.duration || 5000,
    actions: toastData.actions || []
  }
  
  toasts.value.push(toast)
  
  // Auto-remove après la durée spécifiée
  if (toast.duration > 0) {
    setTimeout(() => {
      removeToast(toast.id)
    }, toast.duration)
  }
  
  return toast.id
}

const removeToast = (id) => {
  const index = toasts.value.findIndex(toast => toast.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

// Gestion des modals
const showModal = (modalData) => {
  modal.show = true
  modal.title = modalData.title || ''
  modal.size = modalData.size || 'medium'
  modal.closable = modalData.closable !== false
  modal.component = modalData.component
  modal.props = modalData.props || {}
  modal.actions = modalData.actions || []
}

const closeModal = () => {
  modal.show = false
  modal.title = ''
  modal.size = 'medium'
  modal.closable = true
  modal.component = null
  modal.props = {}
  modal.actions = []
}

// Expose global functions pour les utiliser dans toute l'app
window.showToast = addToast
window.showModal = showModal
window.closeModal = closeModal

// Lifecycle
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  
  // Exemple de toast de bienvenue
  setTimeout(() => {
    addToast({
      type: 'success',
      title: 'Bienvenue sur EcoMarket !',
      message: 'Découvrez nos produits écologiques et durables.',
      duration: 4000
    })
  }, 1000)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style>
#app {
  background: var(--background-primary);
  font-family: var(--font-family-sans);
}

.main-content {
  position: relative;
  z-index: 1;
}

/* Container pour les toasts */
.toast-container {
  position: fixed;
  top: var(--spacing-xl);
  right: var(--spacing-xl);
  z-index: var(--z-toast);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  max-width: 400px;
  pointer-events: none;
}

.toast-container > * {
  pointer-events: auto;
}

/* Scroll smooth pour toute l'application */
html {
  scroll-behavior: smooth;
}

/* Amélioration du focus pour l'accessibilité */
*:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

/* Transition globale pour les changements de route */
.router-view-transition {
  transition: all var(--transition-normal);
}

/* Scroll to top button */
.scroll-to-top {
  position: fixed;
  bottom: var(--spacing-xl);
  right: var(--spacing-xl);
  z-index: var(--z-fixed);
  opacity: 0;
  transform: translateY(100px);
  transition: all var(--transition-normal);
  background: none;
  border: none;
  cursor: pointer;
}

.scroll-to-top.visible {
  opacity: 1;
  transform: translateY(0);
}

.scroll-to-top .btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-lg);
  transition: all var(--transition-normal);
}

.scroll-to-top .btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
}

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-md) 0;
  font-size: 0.875rem;
  color: var(--text-muted);
}

.breadcrumb-item {
  display: flex;
  align-items: center;
}

.breadcrumb-item:not(:last-child)::after {
  content: '/';
  margin-left: var(--spacing-sm);
  color: var(--text-light);
}

.breadcrumb-item.active {
  color: var(--text-primary);
  font-weight: var(--font-weight-medium);
}

/* Loading states */
.loading-shimmer {
  position: relative;
  overflow: hidden;
}

.loading-shimmer::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.4);
  animation: shimmer 2s infinite;
}

/* Page transitions */
.page-enter-active,
.page-leave-active {
  transition: all var(--transition-normal);
}

.page-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* Error boundary */
.error-boundary {
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--spacing-5xl);
}

.error-boundary h1 {
  color: var(--error-color);
  margin-bottom: var(--spacing-xl);
}

.error-boundary p {
  color: var(--text-muted);
  max-width: 500px;
  margin-bottom: var(--spacing-2xl);
}

/* Accessibility improvements */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--primary-color);
  color: var(--background-primary);
  padding: 8px;
  border-radius: var(--border-radius);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  z-index: var(--z-tooltip);
  transition: top var(--transition-fast);
}

.skip-link:focus {
  top: 6px;
}

/* Mobile-first responsive typography */
@media (max-width: 768px) {
  .toast-container {
    top: var(--spacing-md);
    right: var(--spacing-md);
    left: var(--spacing-md);
    max-width: none;
  }
  
  .scroll-to-top {
    bottom: var(--spacing-md);
    right: var(--spacing-md);
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .breadcrumb {
    border-bottom: 1px solid currentColor;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .router-view-transition,
  .scroll-to-top,
  .page-enter-active,
  .page-leave-active {
    transition: none !important;
    animation: none !important;
  }
  
  .loading-shimmer::before {
    animation: none !important;
  }
  
  html {
    scroll-behavior: auto;
  }
}
</style>
