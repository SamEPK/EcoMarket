import { ref, computed } from 'vue'

export function useForm(initialValues = {}) {
  const formData = ref({ ...initialValues })
  const errors = ref({})
  const isSubmitting = ref(false)
  
  // Validation des champs
  const validationRules = ref({})
  
  const isValid = computed(() => {
    return Object.keys(errors.value).length === 0
  })
  
  function setValidationRules(rules) {
    validationRules.value = rules
  }
  
  function validateField(fieldName, value) {
    const rules = validationRules.value[fieldName]
    if (!rules) return true
    
    let fieldErrors = []
    
    // Validation required
    if (rules.required && (!value || value.toString().trim() === '')) {
      fieldErrors.push('Ce champ est obligatoire')
    }
    
    // Validation minLength
    if (rules.minLength && value && value.length < rules.minLength) {
      fieldErrors.push(`Minimum ${rules.minLength} caractères`)
    }
    
    // Validation email
    if (rules.email && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        fieldErrors.push('Format email invalide')
      }
    }
    
    // Validation pattern
    if (rules.pattern && value && !rules.pattern.test(value)) {
      fieldErrors.push(rules.patternMessage || 'Format invalide')
    }
    
    // Validation custom
    if (rules.custom && typeof rules.custom === 'function') {
      const customError = rules.custom(value)
      if (customError) {
        fieldErrors.push(customError)
      }
    }
    
    if (fieldErrors.length > 0) {
      errors.value[fieldName] = fieldErrors[0]
      return false
    } else {
      delete errors.value[fieldName]
      return true
    }
  }
  
  function validateForm() {
    let isFormValid = true
    
    Object.keys(validationRules.value).forEach(fieldName => {
      const isFieldValid = validateField(fieldName, formData.value[fieldName])
      if (!isFieldValid) {
        isFormValid = false
      }
    })
    
    return isFormValid
  }
  
  function updateField(fieldName, value) {
    formData.value[fieldName] = value
    validateField(fieldName, value)
  }
  
  function resetForm() {
    formData.value = { ...initialValues }
    errors.value = {}
    isSubmitting.value = false
  }
  
  async function submitForm(submitHandler) {
    if (!validateForm()) {
      return false
    }
    
    isSubmitting.value = true
    
    try {
      await submitHandler(formData.value)
      return true
    } catch (error) {
      console.error('Erreur lors de la soumission:', error)
      return false
    } finally {
      isSubmitting.value = false
    }
  }
  
  return {
    formData,
    errors,
    isSubmitting,
    isValid,
    setValidationRules,
    validateField,
    validateForm,
    updateField,
    resetForm,
    submitForm
  }
}
