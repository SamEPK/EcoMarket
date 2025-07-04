<template>
  <Teleport to="body">
    <div class="toast-container" v-if="toasts.length > 0">
      <TransitionGroup name="toast" tag="div" class="toast-wrapper">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast"
          :class="[`toast-${toast.type}`, { 'toast-dismissible': toast.dismissible }]"
          :aria-live="toast.type === 'error' ? 'assertive' : 'polite'"
          :role="toast.type === 'error' ? 'alert' : 'status'"
        >
          <div class="toast-icon">
            <span v-html="getToastIcon(toast.type)"></span>
          </div>
          
          <div class="toast-content">
            <h4 v-if="toast.title" class="toast-title">{{ toast.title }}</h4>
            <p class="toast-message">{{ toast.message }}</p>
            <div v-if="toast.actions && toast.actions.length" class="toast-actions">
              <button
                v-for="action in toast.actions"
                :key="action.label"
                class="btn btn-sm"
                :class="action.primary ? 'btn-primary' : 'btn-ghost'"
                @click="handleAction(toast.id, action)"
              >
                {{ action.label }}
              </button>
            </div>
          </div>
          
          <button
            v-if="toast.dismissible !== false"
            class="toast-close"
            @click="removeToast(toast.id)"
            aria-label="Fermer la notification"
            type="button"
          >
            ✕
          </button>
          
          <div
            v-if="toast.duration && toast.duration > 0"
            class="toast-progress"
            :style="{ animationDuration: `${toast.duration}ms` }"
          ></div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useToast } from '@/composables/useScrollAnimation'

const { toasts, removeToast } = useToast()

const getToastIcon = (type) => {
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  }
  return icons[type] || icons.info
}

const handleAction = (toastId, action) => {
  if (action.handler) {
    action.handler()
  }
  if (action.dismissOnClick !== false) {
    removeToast(toastId)
  }
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: var(--spacing-xl);
  right: var(--spacing-xl);
  z-index: var(--z-toast);
  pointer-events: none;
  max-width: 420px;
  width: 100%;
}

.toast-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.toast {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: var(--border-radius-xl);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-2xl);
  pointer-events: auto;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  min-height: 64px;
  max-width: 100%;
  word-wrap: break-word;
}

.toast::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: currentColor;
  opacity: 0.8;
}

.toast-success {
  border-left: 4px solid var(--success-color);
  color: var(--success-color);
}

.toast-error {
  border-left: 4px solid var(--error-color);
  color: var(--error-color);
}

.toast-warning {
  border-left: 4px solid var(--warning-color);
  color: var(--warning-color);
}

.toast-info {
  border-left: 4px solid var(--info-color);
  color: var(--info-color);
}

.toast-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  margin-top: 2px;
}

.toast-content {
  flex: 1;
  min-width: 0;
}

.toast-title {
  font-size: 1rem;
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-xs) 0;
  line-height: 1.3;
}

.toast-message {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.4;
}

.toast-actions {
  display: flex;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
  flex-wrap: wrap;
}

.toast-close {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  cursor: pointer;
  color: var(--text-muted);
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all var(--transition-fast);
  margin-top: 2px;
}

.toast-close:hover {
  background: rgba(0, 0, 0, 0.1);
  color: var(--text-primary);
  transform: scale(1.1);
}

.toast-close:focus {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

.toast-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: currentColor;
  width: 100%;
  transform-origin: left;
  animation: toast-progress linear forwards;
  opacity: 0.6;
}

@keyframes toast-progress {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}

/* Transitions */
.toast-enter-active {
  transition: all var(--transition-normal);
}

.toast-leave-active {
  transition: all var(--transition-normal);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}

.toast-move {
  transition: transform var(--transition-normal);
}

/* Responsive */
@media (max-width: 768px) {
  .toast-container {
    top: var(--spacing-md);
    right: var(--spacing-md);
    left: var(--spacing-md);
    max-width: none;
  }
  
  .toast {
    padding: var(--spacing-md);
  }
  
  .toast-actions {
    flex-direction: column;
  }
  
  .toast-actions .btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .toast-container {
    top: var(--spacing-sm);
    right: var(--spacing-sm);
    left: var(--spacing-sm);
  }
  
  .toast {
    padding: var(--spacing-sm) var(--spacing-md);
    min-height: auto;
  }
  
  .toast-title {
    font-size: 0.875rem;
  }
  
  .toast-message {
    font-size: 0.8rem;
  }
}

/* Mode sombre */
@media (prefers-color-scheme: dark) {
  .toast {
    background: rgba(15, 23, 42, 0.98);
    border-color: rgba(71, 85, 105, 0.3);
  }
  
  .toast-close:hover {
    background: rgba(255, 255, 255, 0.1);
  }
}

/* Accessibilité */
@media (prefers-reduced-motion: reduce) {
  .toast-enter-active,
  .toast-leave-active,
  .toast-move {
    transition: none !important;
  }
  
  .toast-progress {
    animation: none !important;
  }
}

/* Focus pour clavier */
.toast:focus-within {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

/* Variantes de toast */
.toast.toast-compact {
  padding: var(--spacing-sm) var(--spacing-md);
  min-height: auto;
}

.toast.toast-compact .toast-title {
  font-size: 0.875rem;
}

.toast.toast-compact .toast-message {
  font-size: 0.8rem;
}

.toast.toast-large {
  padding: var(--spacing-xl);
  max-width: 500px;
}

.toast.toast-large .toast-title {
  font-size: 1.125rem;
}

.toast.toast-large .toast-message {
  font-size: 1rem;
}

/* Toast avec image */
.toast.toast-with-image .toast-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius);
  overflow: hidden;
}

.toast.toast-with-image .toast-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Toast sticky (ne disparaît pas automatiquement) */
.toast.toast-sticky .toast-progress {
  display: none;
}

/* Animation de pulse pour les toasts importants */
.toast.toast-pulse {
  animation: toast-pulse 2s infinite;
}

@keyframes toast-pulse {
  0% {
    box-shadow: var(--shadow-2xl);
  }
  50% {
    box-shadow: var(--shadow-2xl), 0 0 0 8px rgba(45, 90, 61, 0.1);
  }
  100% {
    box-shadow: var(--shadow-2xl);
  }
}
</style>
