<template>
  <Teleport to="body">
    <Transition name="modal" appear>
      <div
        v-if="isOpen"
        class="modal-overlay"
        @click="handleOverlayClick"
        @keydown.esc="closeModal"
        tabindex="-1"
        role="dialog"
        :aria-labelledby="titleId"
        :aria-describedby="contentId"
        aria-modal="true"
      >
        <div
          class="modal-container"
          :class="[
            `modal-${size}`,
            { 'modal-fullscreen': fullscreen },
            { 'modal-centered': centered }
          ]"
          @click.stop
          ref="modalRef"
        >
          <div class="modal-content">
            <!-- Header -->
            <header
              v-if="showHeader"
              class="modal-header"
              :class="{ 'modal-header-borderless': !showHeaderBorder }"
            >
              <h2
                v-if="title"
                :id="titleId"
                class="modal-title"
              >
                {{ title }}
              </h2>
              <slot name="header" v-if="!title"></slot>
              
              <button
                v-if="closable"
                class="modal-close"
                @click="closeModal"
                aria-label="Fermer la modale"
                type="button"
              >
                <span class="modal-close-icon">✕</span>
              </button>
            </header>
            
            <!-- Body -->
            <main
              class="modal-body"
              :class="{ 'modal-body-scrollable': scrollable }"
              :id="contentId"
            >
              <slot></slot>
            </main>
            
            <!-- Footer -->
            <footer
              v-if="showFooter || $slots.footer"
              class="modal-footer"
              :class="{ 'modal-footer-borderless': !showFooterBorder }"
            >
              <slot name="footer">
                <div class="modal-actions">
                  <button
                    v-if="showCancelButton"
                    class="btn btn-outline"
                    @click="handleCancel"
                    type="button"
                  >
                    {{ cancelText }}
                  </button>
                  <button
                    v-if="showConfirmButton"
                    class="btn btn-primary"
                    @click="handleConfirm"
                    :disabled="confirmLoading"
                    type="button"
                  >
                    <span v-if="confirmLoading" class="spinner spinner-sm"></span>
                    <span>{{ confirmText }}</span>
                  </button>
                </div>
              </slot>
            </footer>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl', '2xl'].includes(value)
  },
  fullscreen: {
    type: Boolean,
    default: false
  },
  centered: {
    type: Boolean,
    default: true
  },
  closable: {
    type: Boolean,
    default: true
  },
  closeOnOverlay: {
    type: Boolean,
    default: true
  },
  showHeader: {
    type: Boolean,
    default: true
  },
  showHeaderBorder: {
    type: Boolean,
    default: true
  },
  showFooter: {
    type: Boolean,
    default: false
  },
  showFooterBorder: {
    type: Boolean,
    default: true
  },
  showCancelButton: {
    type: Boolean,
    default: false
  },
  showConfirmButton: {
    type: Boolean,
    default: false
  },
  cancelText: {
    type: String,
    default: 'Annuler'
  },
  confirmText: {
    type: String,
    default: 'Confirmer'
  },
  confirmLoading: {
    type: Boolean,
    default: false
  },
  scrollable: {
    type: Boolean,
    default: true
  },
  persistent: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'confirm', 'cancel', 'opened', 'closed'])

const modalRef = ref(null)
const titleId = computed(() => `modal-title-${Math.random().toString(36).substr(2, 9)}`)
const contentId = computed(() => `modal-content-${Math.random().toString(36).substr(2, 9)}`)

const closeModal = () => {
  if (!props.persistent) {
    emit('close')
  }
}

const handleOverlayClick = () => {
  if (props.closeOnOverlay && !props.persistent) {
    closeModal()
  }
}

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
  if (!props.persistent) {
    closeModal()
  }
}

// Focus management
const focusableElementsSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
let previousActiveElement = null

const trapFocus = (e) => {
  if (!modalRef.value) return
  
  const focusableElements = modalRef.value.querySelectorAll(focusableElementsSelector)
  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  if (e.key === 'Tab') {
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault()
        lastElement.focus()
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault()
        firstElement.focus()
      }
    }
  }
}

watch(() => props.isOpen, async (isOpen) => {
  if (isOpen) {
    previousActiveElement = document.activeElement
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', trapFocus)
    
    await nextTick()
    
    if (modalRef.value) {
      const focusableElements = modalRef.value.querySelectorAll(focusableElementsSelector)
      if (focusableElements.length > 0) {
        focusableElements[0].focus()
      } else {
        modalRef.value.focus()
      }
    }
    
    emit('opened')
  } else {
    document.body.style.overflow = ''
    document.removeEventListener('keydown', trapFocus)
    
    if (previousActiveElement) {
      previousActiveElement.focus()
      previousActiveElement = null
    }
    
    emit('closed')
  }
})

onUnmounted(() => {
  document.body.style.overflow = ''
  document.removeEventListener('keydown', trapFocus)
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  z-index: var(--z-modal-backdrop);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
  overflow-y: auto;
}

.modal-container {
  width: 100%;
  max-height: calc(100vh - 2rem);
  display: flex;
  flex-direction: column;
  position: relative;
}

.modal-container.modal-centered {
  margin: auto;
}

.modal-content {
  background: var(--background-primary);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-2xl);
  display: flex;
  flex-direction: column;
  max-height: 100%;
  overflow: hidden;
  position: relative;
}

.modal-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(255, 255, 255, 0.8);
}

/* Tailles */
.modal-xs { max-width: 320px; }
.modal-sm { max-width: 480px; }
.modal-md { max-width: 640px; }
.modal-lg { max-width: 800px; }
.modal-xl { max-width: 1024px; }
.modal-2xl { max-width: 1280px; }

.modal-fullscreen {
  max-width: none;
  max-height: none;
  height: 100vh;
  width: 100vw;
  margin: 0;
}

.modal-fullscreen .modal-content {
  border-radius: 0;
  height: 100%;
}

/* Header */
.modal-header {
  padding: var(--spacing-xl) var(--spacing-xl) var(--spacing-lg);
  border-bottom: 1px solid var(--border-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  background: rgba(248, 250, 252, 0.5);
  backdrop-filter: blur(8px);
}

.modal-header.modal-header-borderless {
  border-bottom: none;
  background: none;
  backdrop-filter: none;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0;
  line-height: 1.3;
  font-family: var(--font-family-serif);
}

.modal-close {
  width: 40px;
  height: 40px;
  border: none;
  background: none;
  cursor: pointer;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius);
  transition: all var(--transition-fast);
  flex-shrink: 0;
  margin-left: var(--spacing-lg);
}

.modal-close:hover {
  background: rgba(0, 0, 0, 0.1);
  color: var(--text-primary);
  transform: scale(1.1);
}

.modal-close:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

.modal-close-icon {
  font-size: 1.25rem;
  line-height: 1;
}

/* Body */
.modal-body {
  padding: var(--spacing-lg) var(--spacing-xl);
  flex: 1;
  overflow-y: auto;
  color: var(--text-secondary);
  line-height: 1.6;
}

.modal-body.modal-body-scrollable {
  max-height: 60vh;
}

.modal-body::-webkit-scrollbar {
  width: 6px;
}

.modal-body::-webkit-scrollbar-track {
  background: var(--background-secondary);
  border-radius: 3px;
}

.modal-body::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: var(--primary-color);
}

/* Footer */
.modal-footer {
  padding: var(--spacing-lg) var(--spacing-xl) var(--spacing-xl);
  border-top: 1px solid var(--border-light);
  background: rgba(248, 250, 252, 0.3);
  backdrop-filter: blur(8px);
  flex-shrink: 0;
}

.modal-footer.modal-footer-borderless {
  border-top: none;
  background: none;
  backdrop-filter: none;
}

.modal-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
  flex-wrap: wrap;
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: all var(--transition-normal);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9) translateY(-20px);
}

/* Responsive */
@media (max-width: 768px) {
  .modal-overlay {
    padding: var(--spacing-md);
  }
  
  .modal-xs,
  .modal-sm,
  .modal-md {
    max-width: none;
    width: 100%;
  }
  
  .modal-header {
    padding: var(--spacing-lg);
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }
  
  .modal-close {
    position: absolute;
    top: var(--spacing-lg);
    right: var(--spacing-lg);
    margin: 0;
  }
  
  .modal-body {
    padding: var(--spacing-md) var(--spacing-lg);
  }
  
  .modal-footer {
    padding: var(--spacing-lg);
  }
  
  .modal-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .modal-actions .btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .modal-overlay {
    padding: var(--spacing-sm);
  }
  
  .modal-content {
    border-radius: var(--border-radius-lg);
  }
  
  .modal-header {
    padding: var(--spacing-md);
  }
  
  .modal-title {
    font-size: 1.25rem;
  }
  
  .modal-body {
    padding: var(--spacing-md);
    max-height: 50vh;
  }
  
  .modal-footer {
    padding: var(--spacing-md);
  }
  
  .modal-close {
    width: 32px;
    height: 32px;
    top: var(--spacing-md);
    right: var(--spacing-md);
  }
  
  .modal-close-icon {
    font-size: 1rem;
  }
}

/* Mode sombre */
@media (prefers-color-scheme: dark) {
  .modal-content {
    background: var(--background-primary);
  }
  
  .modal-header {
    background: rgba(30, 41, 59, 0.5);
  }
  
  .modal-footer {
    background: rgba(30, 41, 59, 0.3);
  }
  
  .modal-close:hover {
    background: rgba(255, 255, 255, 0.1);
  }
}

/* Accessibilité */
@media (prefers-reduced-motion: reduce) {
  .modal-enter-active,
  .modal-leave-active {
    transition: none !important;
  }
  
  .modal-close {
    transition: none !important;
  }
}

/* Focus trap styling */
.modal-container:focus {
  outline: none;
}

/* Variantes spéciales */
.modal-danger .modal-header {
  background: rgba(239, 68, 68, 0.1);
  border-bottom-color: rgba(239, 68, 68, 0.2);
}

.modal-danger .modal-title {
  color: var(--error-color);
}

.modal-success .modal-header {
  background: rgba(16, 185, 129, 0.1);
  border-bottom-color: rgba(16, 185, 129, 0.2);
}

.modal-success .modal-title {
  color: var(--success-color);
}

.modal-warning .modal-header {
  background: rgba(245, 158, 11, 0.1);
  border-bottom-color: rgba(245, 158, 11, 0.2);
}

.modal-warning .modal-title {
  color: var(--warning-color);
}

/* Animation de chargement pour les boutons */
.modal-actions .btn .spinner {
  margin-right: var(--spacing-sm);
}

/* Amélioration visuelle */
.modal-content {
  position: relative;
  overflow: hidden;
}

.modal-content::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(0, 0, 0, 0.1);
}

/* Support pour les modales imbriquées */
.modal-overlay[data-level="2"] {
  background: rgba(0, 0, 0, 0.8);
  z-index: calc(var(--z-modal-backdrop) + 10);
}

.modal-overlay[data-level="2"] .modal-content {
  transform: scale(0.95);
}
</style>
