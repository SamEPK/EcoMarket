import { defineStore } from 'pinia'
import { ref, computed, type Ref, type ComputedRef } from 'vue'
import type { Product, CartItem } from '@/types'

export const useCartStore = defineStore('cart', () => {
  // État réactif du panier
  const items: Ref<CartItem[]> = ref([])
  
  // Getters (computed)
  const itemCount: ComputedRef<number> = computed(() => 
    items.value.reduce((total, item) => total + item.quantity, 0)
  )
  
  const totalPrice: ComputedRef<number> = computed(() => 
    items.value.reduce((total, item) => total + (item.price * item.quantity), 0)
  )
  
  const isEmpty: ComputedRef<boolean> = computed(() => items.value.length === 0)
  
  // Helper pour les notifications
  const showToast = (toastData: any) => {
    if (typeof window !== 'undefined' && window.showToast) {
      window.showToast(toastData)
    }
  }
  
  // Actions
  function addItem(product: Product, quantity: number = 1): void {
    const existingItem = items.value.find(item => item.id === product.id)
    
    if (existingItem) {
      existingItem.quantity += quantity
      showToast({
        type: 'success',
        title: 'Quantité mise à jour',
        message: `${product.name} - Quantité: ${existingItem.quantity}`,
        duration: 3000
      })
    } else {
      items.value.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity,
        artisan: product.artisan
      })
      showToast({
        type: 'success',
        title: 'Produit ajouté au panier',
        message: `${product.name} a été ajouté à votre panier`,
        duration: 3000,
        actions: [
          {
            label: 'Voir le panier',
            action: () => {
              // Navigate to cart page
              if (typeof window !== 'undefined' && window.location) {
                window.location.hash = '#/cart'
              }
            }
          }
        ]
      })
    }
  }
  
  function removeItem(productId: number): void {
    const index = items.value.findIndex(item => item.id === productId)
    if (index > -1) {
      const removedItem = items.value[index]
      items.value.splice(index, 1)
      showToast({
        type: 'info',
        title: 'Produit retiré',
        message: `${removedItem.name} a été retiré de votre panier`,
        duration: 3000
      })
    }
  }
  
  function updateQuantity(productId: number, quantity: number): void {
    const item = items.value.find(item => item.id === productId)
    if (item) {
      if (quantity <= 0) {
        removeItem(productId)
      } else {
        const oldQuantity = item.quantity
        item.quantity = quantity
        if (quantity > oldQuantity) {
          showToast({
            type: 'success',
            title: 'Quantité augmentée',
            message: `${item.name} - Nouvelle quantité: ${quantity}`,
            duration: 2000
          })
        } else {
          showToast({
            type: 'info',
            title: 'Quantité diminuée',
            message: `${item.name} - Nouvelle quantité: ${quantity}`,
            duration: 2000
          })
        }
      }
    }
  }
  
  function clearCart(): void {
    if (items.value.length > 0) {
      items.value = []
      showToast({
        type: 'warning',
        title: 'Panier vidé',
        message: 'Tous les produits ont été retirés de votre panier',
        duration: 3000
      })
    }
  }
  
  return {
    items,
    itemCount,
    totalPrice,
    isEmpty,
    addItem,
    removeItem,
    updateQuantity,
    clearCart
  }
})
