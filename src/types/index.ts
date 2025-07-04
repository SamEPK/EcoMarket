// Types pour les produits
export interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  artisan: string
  rating: number
  inStock: boolean
  category: string
  tags?: string[]
  createdAt?: string
  updatedAt?: string
}

// Types pour le panier
export interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
  artisan: string
}

// Types pour les filtres
export interface ProductFilters {
  category: string
  minPrice: number
  maxPrice: number
  searchTerm: string
}

// Types pour les formulaires
export interface CheckoutForm {
  email: string
  firstName: string
  lastName: string
  address: string
  city: string
  postalCode: string
  country: string
  paymentMethod: string
  cardNumber?: string
  expiryDate?: string
  cvv?: string
}

// Types pour la validation
export interface ValidationRule {
  message: string
  validator: (value: any) => boolean
}

export interface ValidationRules {
  [key: string]: ValidationRule[]
}

// Types pour les erreurs
export interface ApiError {
  message: string
  code?: string
  details?: any
}

// Types pour les composables
export interface UseApiReturn {
  loading: Ref<boolean>
  error: Ref<string | null>
  fetchData: <T = any>(url: string, options?: any) => Promise<T>
  mockApiCall: <T = any>(data: T, delay?: number) => Promise<T>
}

export interface UseFormReturn {
  formData: Ref<any>
  errors: Ref<Record<string, string>>
  isValid: ComputedRef<boolean>
  isSubmitting: Ref<boolean>
  validate: () => boolean
  reset: () => void
  updateField: (field: string, value: any) => void
  setValidationRules: (rules: any) => void
  validateField: (fieldName: string, value: any) => boolean
  validateForm: () => boolean
  resetForm: () => void
  submitForm: (submitHandler: (data: any) => Promise<void>) => Promise<boolean>
}

// Import des types Vue
import type { Ref, ComputedRef } from 'vue'
