import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface OrderItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

export interface DeliveryAddress {
  name: string
  street: string
  postalCode: string
  city: string
}

export interface Order {
  id: string
  number: string
  date: Date
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  totalItems: number
  items: OrderItem[]
  deliveryAddress: DeliveryAddress
}

export const useOrdersStore = defineStore('orders', () => {
  const orders = ref<Order[]>([])
  
  // Computed
  const totalOrders = computed(() => orders.value.length)
  
  const recentOrders = computed(() => {
    return orders.value
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5)
  })
  
  const ordersByStatus = computed(() => {
    return (status: Order['status']) => {
      return orders.value.filter(order => order.status === status)
    }
  })
  
  // Actions
  function addOrder(orderData: Omit<Order, 'id' | 'number' | 'date'>) {
    const order: Order = {
      id: generateOrderId(),
      number: generateOrderNumber(),
      date: new Date(),
      ...orderData
    }
    
    orders.value.unshift(order)
    return order
  }
  
  function updateOrderStatus(orderId: string, status: Order['status']) {
    const order = orders.value.find(o => o.id === orderId)
    if (order) {
      order.status = status
    }
  }
  
  function getOrderById(orderId: string) {
    return orders.value.find(o => o.id === orderId)
  }
  
  function getOrderByNumber(orderNumber: string) {
    return orders.value.find(o => o.number === orderNumber)
  }
  
  // Méthodes utilitaires
  function generateOrderId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9)
  }
  
  function generateOrderNumber() {
    const year = new Date().getFullYear()
    const orderCount = orders.value.length + 1
    return `ECO-${year}-${orderCount.toString().padStart(3, '0')}`
  }
  
  // Initialiser avec des données d'exemple
  function initializeWithSampleData() {
    if (orders.value.length === 0) {
      const sampleOrders: Omit<Order, 'id' | 'number' | 'date'>[] = [
        {
          status: 'delivered',
          total: 45.90,
          totalItems: 3,
          items: [
            {
              id: 1,
              name: 'Sac en toile de jute bio',
              price: 15.90,
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop'
            },
            {
              id: 2,
              name: 'Savon artisanal à l\'huile d\'olive',
              price: 8.50,
              quantity: 2,
              image: 'https://images.unsplash.com/photo-1544207240-1b6ee5e12b51?w=100&h=100&fit=crop'
            },
            {
              id: 3,
              name: 'Gourde en inox 500ml',
              price: 12.50,
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=100&h=100&fit=crop'
            }
          ],
          deliveryAddress: {
            name: 'Jean Dupont',
            street: '123 rue de la Paix',
            postalCode: '75001',
            city: 'Paris'
          }
        },
        {
          status: 'shipped',
          total: 28.90,
          totalItems: 2,
          items: [
            {
              id: 4,
              name: 'Brosse à dents en bambou',
              price: 4.90,
              quantity: 2,
              image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=100&h=100&fit=crop'
            },
            {
              id: 5,
              name: 'Shampoing solide naturel',
              price: 19.10,
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=100&h=100&fit=crop'
            }
          ],
          deliveryAddress: {
            name: 'Jean Dupont',
            street: '123 rue de la Paix',
            postalCode: '75001',
            city: 'Paris'
          }
        },
        {
          status: 'processing',
          total: 67.80,
          totalItems: 4,
          items: [
            {
              id: 6,
              name: 'Couverts en bambou réutilisables',
              price: 12.90,
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop'
            },
            {
              id: 7,
              name: 'Lingettes démaquillantes lavables',
              price: 18.30,
              quantity: 2,
              image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100&h=100&fit=crop'
            },
            {
              id: 8,
              name: 'Bee-wrap réutilisable',
              price: 18.30,
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1610736969678-7b8f81ac0a2a?w=100&h=100&fit=crop'
            }
          ],
          deliveryAddress: {
            name: 'Jean Dupont',
            street: '123 rue de la Paix',
            postalCode: '75001',
            city: 'Paris'
          }
        }
      ]
      
      // Ajouter les commandes d'exemple avec des dates différentes
      sampleOrders.forEach((orderData, index) => {
        const order: Order = {
          id: generateOrderId(),
          number: generateOrderNumber(),
          date: new Date(Date.now() - (index * 5 * 24 * 60 * 60 * 1000)), // 5 jours d'écart
          ...orderData
        }
        orders.value.push(order)
      })
    }
  }
  
  return {
    orders,
    totalOrders,
    recentOrders,
    ordersByStatus,
    addOrder,
    updateOrderStatus,
    getOrderById,
    getOrderByNumber,
    initializeWithSampleData
  }
})
