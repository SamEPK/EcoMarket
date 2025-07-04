import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ProductCard from '../common/ProductCard.vue'

const mockProduct = {
  id: 1,
  name: 'Produit Test',
  description: 'Description du produit test qui est assez longue pour tester la troncature',
  price: 29.99,
  image: 'https://example.com/image.jpg',
  artisan: 'Artisan Test',
  rating: 4.5,
  inStock: true,
  category: 'Décoration'
}

describe('ProductCard', () => {
  it('should render product information correctly', () => {
    const wrapper = mount(ProductCard, {
      props: { product: mockProduct }
    })

    expect(wrapper.find('.product-name').text()).toBe(mockProduct.name)
    expect(wrapper.find('.product-artisan').text()).toBe(`Par ${mockProduct.artisan}`)
    expect(wrapper.find('.rating').text()).toBe(`⭐ ${mockProduct.rating}`)
    expect(wrapper.find('.product-price').text()).toBe('29,99 €')
  })

  it('should emit click event when card is clicked', async () => {
    const wrapper = mount(ProductCard, {
      props: { product: mockProduct }
    })

    await wrapper.find('.product-card').trigger('click')

    expect(wrapper.emitted('click')).toBeTruthy()
    expect(wrapper.emitted('click')?.[0]).toEqual([mockProduct])
  })

  it('should emit add-to-cart event when button is clicked', async () => {
    const wrapper = mount(ProductCard, {
      props: { product: mockProduct }
    })

    await wrapper.find('.add-to-cart-btn').trigger('click')

    expect(wrapper.emitted('add-to-cart')).toBeTruthy()
    expect(wrapper.emitted('add-to-cart')?.[0]).toEqual([mockProduct])
  })

  it('should disable add to cart button when product is out of stock', () => {
    const outOfStockProduct = { ...mockProduct, inStock: false }
    const wrapper = mount(ProductCard, {
      props: { product: outOfStockProduct }
    })

    const button = wrapper.find('.add-to-cart-btn')
    expect(button.attributes('disabled')).toBeDefined()
    expect(button.text()).toBe('Indisponible')
  })

  it('should truncate long descriptions', () => {
    const wrapper = mount(ProductCard, {
      props: { product: mockProduct }
    })

    const description = wrapper.find('.product-description').text()
    expect(description.length).toBeLessThanOrEqual(103) // 100 chars + "..."
  })

  it('should handle image error', async () => {
    const wrapper = mount(ProductCard, {
      props: { product: mockProduct }
    })

    const img = wrapper.find('img')
    await img.trigger('error')

    expect(img.attributes('src')).toBe('https://via.placeholder.com/300x200?text=Image+non+disponible')
  })
})
