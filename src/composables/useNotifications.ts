import { ref, reactive } from 'vue'

interface Notification {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  title?: string
  duration?: number
  dismissing?: boolean
}

const notifications = ref<Notification[]>([])

export function useNotifications() {
  function showNotification(
    message: string, 
    type: Notification['type'] = 'info', 
    duration = 5000,
    title?: string
  ) {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    const notification: Notification = {
      id,
      message,
      type,
      title,
      duration,
      dismissing: false
    }

    notifications.value.push(notification)

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        dismiss(id)
      }, duration)
    }

    return id
  }

  function dismiss(id: string) {
    const notification = notifications.value.find(n => n.id === id)
    if (notification) {
      notification.dismissing = true
      // Petit délai pour l'animation avant la suppression
      setTimeout(() => {
        removeNotification(id)
      }, 150)
    }
  }

  function removeNotification(id: string) {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  function clearNotifications() {
    notifications.value = []
  }

  // Méthodes utilitaires pour différents types de notifications
  function showSuccess(message: string, title?: string, duration = 4000) {
    return showNotification(message, 'success', duration, title)
  }

  function showError(message: string, title?: string, duration = 6000) {
    return showNotification(message, 'error', duration, title)
  }

  function showWarning(message: string, title?: string, duration = 5000) {
    return showNotification(message, 'warning', duration, title)
  }

  function showInfo(message: string, title?: string, duration = 4000) {
    return showNotification(message, 'info', duration, title)
  }

  return {
    notifications,
    showNotification,
    dismiss,
    removeNotification,
    clearNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}