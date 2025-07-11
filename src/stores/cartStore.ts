import { defineStore } from 'pinia'
import { ref, computed, type Ref, type ComputedRef } from 'vue'
import type { Product, CartItem } from '@/types'

export const useCartStore = defineStore('cart', () => {
  const items: Ref<CartItem[]> = ref([])

  // Getters (computed)
  const itemCount: ComputedRef<number> = computed(() =>
    items.value.reduce((total, item) => total + item.quantity, 0)
  )

  const totalPrice: ComputedRef<number> = computed(() =>
    items.value.reduce((total, item) => total + (item.price * item.quantity), 0)
  )

  const isEmpty: ComputedRef<boolean> = computed(() => items.value.length === 0)
  function addItem(product: Product, quantity: number = 1): void {
    const existingItem = items.value.find(item => item.id === product.id)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      items.value.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity,
        artisan: product.artisan
      })
    }
  }

  function removeItem(productId: number): void {
    const index = items.value.findIndex(item => item.id === productId)
    if (index > -1) {
      items.value.splice(index, 1)
    }
  }

  function updateQuantity(productId: number, quantity: number): void {
    const item = items.value.find(item => item.id === productId)
    if (item) {
      if (quantity <= 0) {
        removeItem(productId)
      } else {
        item.quantity = quantity
      }
    }
  }

  function clearCart(): void {
    items.value = []
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
