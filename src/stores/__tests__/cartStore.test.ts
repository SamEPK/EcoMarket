import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCartStore } from '../cartStore'

const mockProduct = {
  id: 1,
  name: 'Produit Test',
  description: 'Description test',
  price: 29.99,
  image: 'https://example.com/image.jpg',
  artisan: 'Artisan Test',
  rating: 4.5,
  inStock: true,
  category: 'Décoration'
}

describe('Cart Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with empty cart', () => {
    const cart = useCartStore()
    
    expect(cart.items).toEqual([])
    expect(cart.totalPrice).toBe(0)
    expect(cart.itemCount).toBe(0)
  })

  it('should add item to cart', () => {
    const cart = useCartStore()
    
    cart.addItem(mockProduct)
    
    expect(cart.items).toHaveLength(1)
    expect(cart.items[0].id).toBe(mockProduct.id)
    expect(cart.items[0].quantity).toBe(1)
    expect(cart.totalPrice).toBe(29.99)
  })

  it('should increase quantity if item already exists', () => {
    const cart = useCartStore()
    
    cart.addItem(mockProduct)
    cart.addItem(mockProduct)
    
    expect(cart.items).toHaveLength(1)
    expect(cart.items[0].quantity).toBe(2)
    expect(cart.totalPrice).toBe(59.98)
  })

  it('should remove item from cart', () => {
    const cart = useCartStore()
    
    cart.addItem(mockProduct)
    cart.removeItem(mockProduct.id)
    
    expect(cart.items).toHaveLength(0)
    expect(cart.totalPrice).toBe(0)
  })

  it('should update item quantity', () => {
    const cart = useCartStore()
    
    cart.addItem(mockProduct)
    cart.updateQuantity(mockProduct.id, 3)
    
    expect(cart.items[0].quantity).toBe(3)
    expect(cart.totalPrice).toBe(89.97)
  })

  it('should clear cart', () => {
    const cart = useCartStore()
    
    cart.addItem(mockProduct)
    cart.clearCart()
    
    expect(cart.items).toHaveLength(0)
    expect(cart.totalPrice).toBe(0)
  })

  it('should calculate correct item count', () => {
    const cart = useCartStore()
    
    cart.addItem(mockProduct)
    cart.addItem({ ...mockProduct, id: 2 })
    cart.updateQuantity(mockProduct.id, 3)
    
    expect(cart.itemCount).toBe(4) // 3 + 1
  })
})
