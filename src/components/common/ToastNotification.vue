<template>
  <Teleport to="body">
    <div class="toast-container" v-if="notifications.length > 0">
      <TransitionGroup name="toast" tag="div">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          :class="[
            'toast',
            `toast--${notification.type}`,
            { 'toast--dismissing': notification.dismissing }
          ]"
          @click="dismiss(notification.id)"
        >
          <div class="toast__icon">
            <CheckCircle v-if="notification.type === 'success'" :size="20" />
            <AlertCircle v-else-if="notification.type === 'error'" :size="20" />
            <AlertTriangle v-else-if="notification.type === 'warning'" :size="20" />
            <Info v-else :size="20" />
          </div>
          
          <div class="toast__content">
            <h4 v-if="notification.title" class="toast__title">
              {{ notification.title }}
            </h4>
            <p class="toast__message">
              {{ notification.message }}
            </p>
          </div>
          
          <button 
            class="toast__close"
            @click.stop="dismiss(notification.id)"
            aria-label="Fermer la notification"
          >
            <X :size="16" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-vue-next'
import { useNotifications } from '@/composables/useNotifications'

const { notifications, dismiss } = useNotifications()
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 9999;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  min-width: 320px;
  max-width: 400px;
  padding: 1rem;
  margin-bottom: 0.5rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border-left: 4px solid;
  pointer-events: all;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toast:hover {
  transform: translateX(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

.toast--success {
  border-left-color: var(--success-color);
}

.toast--error {
  border-left-color: var(--error-color);
}

.toast--warning {
  border-left-color: var(--warning-color);
}

.toast--info {
  border-left-color: var(--info-color);
}

.toast__icon {
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.toast--success .toast__icon {
  color: var(--success-color);
}

.toast--error .toast__icon {
  color: var(--error-color);
}

.toast--warning .toast__icon {
  color: var(--warning-color);
}

.toast--info .toast__icon {
  color: var(--info-color);
}

.toast__content {
  flex: 1;
  min-width: 0;
}

.toast__title {
  margin: 0 0 0.25rem 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-color);
}

.toast__message {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.4;
  color: #6b7280;
}

.toast__close {
  flex-shrink: 0;
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
  margin: -0.25rem -0.25rem 0 0;
}

.toast__close:hover {
  background-color: #f3f4f6;
  color: #6b7280;
}

/* Animations */
.toast-enter-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.toast-leave-active {
  transition: all 0.3s ease-in;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.95);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.95);
}

.toast-move {
  transition: transform 0.3s ease;
}

/* États de dismissing */
.toast--dismissing {
  opacity: 0.7;
  transform: scale(0.98);
}

/* Responsive */
@media (max-width: 768px) {
  .toast-container {
    top: 0.5rem;
    right: 0.5rem;
    left: 0.5rem;
  }
  
  .toast {
    min-width: auto;
    max-width: none;
    width: 100%;
    padding: 0.875rem;
  }
  
  .toast__title {
    font-size: 0.85rem;
  }
  
  .toast__message {
    font-size: 0.8rem;
  }
}

/* Animation pour l'auto-dismiss */
@keyframes progress {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

.toast::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background-color: currentColor;
  opacity: 0.3;
  animation: progress var(--duration, 5s) linear forwards;
}

.toast--success::after {
  background-color: var(--success-color);
}

.toast--error::after {
  background-color: var(--error-color);
}

.toast--warning::after {
  background-color: var(--warning-color);
}

.toast--info::after {
  background-color: var(--info-color);
}
</style>
