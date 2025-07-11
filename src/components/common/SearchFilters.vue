<template>
  <div class="search-filters">
    <!-- Barre de recherche -->
    <div class="search-bar">
      <div class="search-input-wrapper">
        <input
          type="text"
          :value="modelValue.searchTerm"
          @input="updateSearch"
          placeholder="Rechercher un produit..."
          class="search-input"
        />
        <span class="search-icon">
          <Search :size="20" />
        </span>
      </div>
    </div>
    
    <!-- Filtres -->
    <div class="filters-row">
      <!-- Filtre par catégorie -->
      <div class="filter-group">
        <label for="category-select">Catégorie :</label>
        <select
          id="category-select"
          :value="modelValue.category"
          @change="updateCategory"
          class="filter-select"
        >
          <option value="">Toutes les catégories</option>
          <option
            v-for="category in categories"
            :key="category"
            :value="category"
          >
            {{ category }}
          </option>
        </select>
      </div>
      
      <!-- Filtre par prix -->
      <div class="filter-group">
        <label>Prix :</label>
        <div class="price-range">
          <input
            type="number"
            :value="modelValue.minPrice"
            @input="updateMinPrice"
            placeholder="Min"
            class="price-input"
            min="0"
          />
          <span class="price-separator">-</span>
          <input
            type="number"
            :value="modelValue.maxPrice"
            @input="updateMaxPrice"
            placeholder="Max"
            class="price-input"
            min="0"
          />
          <span class="currency">€</span>
        </div>
      </div>
      
      <!-- Bouton reset -->
      <button @click="resetFilters" class="reset-btn">
        <RotateCcw :size="16" />
        Réinitialiser
      </button>
    </div>
    
    <!-- Compteur de résultats -->
    <div class="results-info">
      <p>{{ resultCount }} produit{{ resultCount > 1 ? 's' : '' }} trouvé{{ resultCount > 1 ? 's' : '' }}</p>
    </div>
  </div>
</template>

<script setup>
import { RotateCcw, Search } from 'lucide-vue-next'

// Props avec v-model
const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
    default: () => ({
      searchTerm: '',
      category: '',
      minPrice: 0,
      maxPrice: 1000
    })
  },
  categories: {
    type: Array,
    default: () => []
  },
  resultCount: {
    type: Number,
    default: 0
  }
})

// Emit pour v-model
const emit = defineEmits(['update:modelValue', 'reset'])

// Méthodes pour mettre à jour les filtres
function updateSearch(event) {
  emit('update:modelValue', {
    ...props.modelValue,
    searchTerm: event.target.value
  })
}

function updateCategory(event) {
  emit('update:modelValue', {
    ...props.modelValue,
    category: event.target.value
  })
}

function updateMinPrice(event) {
  const value = parseFloat(event.target.value) || 0
  emit('update:modelValue', {
    ...props.modelValue,
    minPrice: value
  })
}

function updateMaxPrice(event) {
  const value = parseFloat(event.target.value) || 1000
  emit('update:modelValue', {
    ...props.modelValue,
    maxPrice: value
  })
}

function resetFilters() {
  emit('update:modelValue', {
    searchTerm: '',
    category: '',
    minPrice: 0,
    maxPrice: 1000
  })
  emit('reset')
}
</script>

<style scoped>
.search-filters {
  background: var(--white);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.search-bar {
  margin-bottom: 1.5rem;
}

.search-input-wrapper {
  position: relative;
  max-width: 500px;
  margin: 0 auto;
}

.search-input {
  width: 100%;
  padding: 0.75rem 3rem 0.75rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: 25px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.search-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
  color: var(--text-light);
  display: flex;
  align-items: center;
  justify-content: center;
}

.filters-row {
  display: flex;
  gap: 1rem;
  align-items: end;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 150px;
}

.filter-group label {
  font-weight: 500;
  color: var(--text-dark);
  font-size: 0.9rem;
}

.filter-select {
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 0.9rem;
  background: var(--white);
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.filter-select:focus {
  outline: none;
  border-color: var(--primary-color);
}

.price-range {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.price-input {
  width: 80px;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 0.9rem;
  text-align: center;
}

.price-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.price-separator {
  color: var(--text-light);
  font-weight: bold;
}

.currency {
  color: var(--text-light);
  font-weight: 500;
}

.reset-btn {
  background: var(--accent-color);
  color: var(--white);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.reset-btn:hover {
  background: #e68900;
  transform: scale(1.05);
}

.reset-btn svg {
  transition: transform 0.3s ease;
}

.reset-btn:hover svg {
  transform: rotate(-180deg);
}

.results-info {
  text-align: center;
  color: var(--text-light);
  font-size: 0.9rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

/* Responsive */
@media (max-width: 768px) {
  .search-filters {
    padding: 1rem;
  }
  
  .filters-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-group {
    min-width: auto;
  }
  
  .price-range {
    justify-content: center;
  }
  
  .reset-btn {
    align-self: center;
    width: fit-content;
  }
}
</style>
