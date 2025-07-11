<template>
  <div class="order-history-page">
    <div class="container">

      <div class="page-header">
        <h1>Historique des commandes</h1>
        <p class="subtitle">Retrouvez toutes vos commandes passées</p>
      </div>

      <div class="filters-section">
        <div class="filters">
          <div class="filter-group">
            <label for="statusFilter">Statut</label>
            <select id="statusFilter" v-model="selectedStatus" class="filter-select">
              <option value="">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="processing">En cours</option>
              <option value="shipped">Expédiée</option>
              <option value="delivered">Livrée</option>
              <option value="cancelled">Annulée</option>
            </select>
          </div>

          <div class="filter-group">
            <label for="dateFilter">Période</label>
            <select id="dateFilter" v-model="selectedPeriod" class="filter-select">
              <option value="">Toutes les périodes</option>
              <option value="last-month">Dernier mois</option>
              <option value="last-3-months">3 derniers mois</option>
              <option value="last-year">Dernière année</option>
            </select>
          </div>

          <button @click="clearFilters" class="clear-filters-btn">
            <X :size="16" />
            Effacer les filtres
          </button>
        </div>
      </div>

      <div v-if="filteredOrders.length === 0" class="empty-state">
        <div class="empty-icon">
          <Package :size="64" />
        </div>
        <h2>Aucune commande trouvée</h2>
        <p v-if="hasActiveFilters">
          Aucune commande ne correspond à vos critères de recherche.
          <button @click="clearFilters" class="link-btn">Effacer les filtres</button>
        </p>
        <p v-else>
          Vous n'avez pas encore passé de commande.
        </p>
        <RouterLink to="/products" class="start-shopping-btn">
          <ShoppingBag :size="20" />
          Commencer mes achats
        </RouterLink>
      </div>

      <div v-else class="orders-list">
        <div
          v-for="order in filteredOrders"
          :key="order.id"
          class="order-card"
        >

          <div class="order-header">
            <div class="order-info">
              <h3 class="order-number">Commande #{{ order.number }}</h3>
              <p class="order-date">{{ formatDate(order.date) }}</p>
            </div>

            <div class="order-status">
              <span class="status-badge" :class="order.status">
                <component :is="getStatusIcon(order.status)" :size="16" />
                {{ getStatusLabel(order.status) }}
              </span>
            </div>
          </div>

          <div class="order-details" :class="{ expanded: expandedOrders.includes(order.id) }">

            <div class="order-summary">
              <div class="summary-item">
                <span class="label">Articles:</span>
                <span class="value">{{ order.totalItems }} article{{ order.totalItems > 1 ? 's' : '' }}</span>
              </div>
              <div class="summary-item">
                <span class="label">Total:</span>
                <span class="value total">{{ formatPrice(order.total) }}</span>
              </div>
            </div>

            <div v-if="expandedOrders.includes(order.id)" class="order-items">
              <h4>Articles commandés</h4>
              <div class="items-list">
                <div
                  v-for="item in order.items"
                  :key="item.id"
                  class="order-item"
                >
                  <div class="item-image">
                    <img :src="item.image" :alt="item.name" />
                  </div>
                  <div class="item-details">
                    <h5>{{ item.name }}</h5>
                    <p class="item-price">{{ formatPrice(item.price) }} × {{ item.quantity }}</p>
                  </div>
                  <div class="item-total">
                    {{ formatPrice(item.price * item.quantity) }}
                  </div>
                </div>
              </div>
            </div>

            <div v-if="expandedOrders.includes(order.id)" class="delivery-info">
              <h4>Adresse de livraison</h4>
              <div class="address">
                <p><strong>{{ order.deliveryAddress.name }}</strong></p>
                <p>{{ order.deliveryAddress.street }}</p>
                <p>{{ order.deliveryAddress.postalCode }} {{ order.deliveryAddress.city }}</p>
              </div>
            </div>
          </div>

          <div class="order-actions">
            <button
              @click="toggleOrderExpansion(order.id)"
              class="toggle-btn"
            >
              <ChevronDown
                :size="16"
                :class="{ rotated: expandedOrders.includes(order.id) }"
              />
              {{ expandedOrders.includes(order.id) ? 'Voir moins' : 'Voir plus' }}
            </button>

            <div class="action-buttons">
              <button
                v-if="order.status === 'delivered'"
                @click="reorderItems(order)"
                class="action-btn reorder"
              >
                <RotateCcw :size="16" />
                Recommander
              </button>

              <button
                v-if="order.status !== 'cancelled' && order.status !== 'delivered'"
                @click="trackOrder(order)"
                class="action-btn track"
              >
                <Truck :size="16" />
                Suivre
              </button>

              <button
                @click="downloadInvoice(order)"
                class="action-btn download"
              >
                <Download :size="16" />
                Facture
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="totalPages > 1" class="pagination">
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="pagination-btn"
        >
          <ChevronLeft :size="16" />
          Précédent
        </button>

        <div class="page-numbers">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="currentPage = page"
            :class="{ active: page === currentPage }"
            class="page-btn"
          >
            {{ page }}
          </button>
        </div>

        <button
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="pagination-btn"
        >
          Suivant
          <ChevronRight :size="16" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, reactive, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import {
  Package,
  ShoppingBag,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Clock,
  Settings,
  Truck,
  CheckCircle,
  XCircle,
  RotateCcw,
  Download
} from 'lucide-vue-next'
import { useCartStore } from '@/stores/cartStore'
import { useOrdersStore } from '@/stores/ordersStore'
import { useNotifications } from '@/composables/useNotifications'

const router = useRouter()
const cartStore = useCartStore()
const ordersStore = useOrdersStore()
const { showNotification } = useNotifications()
const selectedStatus = ref('')
const selectedPeriod = ref('')
const currentPage = ref(1)
const itemsPerPage = 5
const expandedOrders = ref([])
const hasActiveFilters = computed(() => {
  return selectedStatus.value !== '' || selectedPeriod.value !== ''
})

const filteredOrders = computed(() => {
  let filtered = [...ordersStore.orders]

  // Filtre par statut
  if (selectedStatus.value) {
    filtered = filtered.filter(order => order.status === selectedStatus.value)
  }

  // Filtre par période
  if (selectedPeriod.value) {
    const now = new Date()
    const filterDate = new Date()

    switch (selectedPeriod.value) {
      case 'last-month':
        filterDate.setMonth(now.getMonth() - 1)
        break
      case 'last-3-months':
        filterDate.setMonth(now.getMonth() - 3)
        break
      case 'last-year':
        filterDate.setFullYear(now.getFullYear() - 1)
        break
    }

    filtered = filtered.filter(order => order.date >= filterDate)
  }

  // Tri par date (plus récent en premier)
  filtered.sort((a, b) => b.date.getTime() - a.date.getTime())

  // Pagination
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage

  return filtered.slice(start, end)
})

const totalPages = computed(() => {
  let filtered = [...ordersStore.orders]

  if (selectedStatus.value) {
    filtered = filtered.filter(order => order.status === selectedStatus.value)
  }

  if (selectedPeriod.value) {
    // Même logique de filtrage par période
    const now = new Date()
    const filterDate = new Date()

    switch (selectedPeriod.value) {
      case 'last-month':
        filterDate.setMonth(now.getMonth() - 1)
        break
      case 'last-3-months':
        filterDate.setMonth(now.getMonth() - 3)
        break
      case 'last-year':
        filterDate.setFullYear(now.getFullYear() - 1)
        break
    }

    filtered = filtered.filter(order => order.date >= filterDate)
  }

  return Math.ceil(filtered.length / itemsPerPage)
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})
function formatDate(date) {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

function formatPrice(price) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

function getStatusLabel(status) {
  const labels = {
    pending: 'En attente',
    processing: 'En cours',
    shipped: 'Expédiée',
    delivered: 'Livrée',
    cancelled: 'Annulée'
  }
  return labels[status] || status
}

function getStatusIcon(status) {
  const icons = {
    pending: Clock,
    processing: Settings,
    shipped: Truck,
    delivered: CheckCircle,
    cancelled: XCircle
  }
  return icons[status] || Clock
}

function toggleOrderExpansion(orderId) {
  const index = expandedOrders.value.indexOf(orderId)
  if (index > -1) {
    expandedOrders.value.splice(index, 1)
  } else {
    expandedOrders.value.push(orderId)
  }
}

function clearFilters() {
  selectedStatus.value = ''
  selectedPeriod.value = ''
  currentPage.value = 1
}

function reorderItems(order) {
  order.items.forEach(item => {
    cartStore.addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image
    }, item.quantity)
  })

  showNotification(`${order.items.length} article(s) ajouté(s) au panier`, 'success')
  router.push('/cart')
}

function trackOrder(order) {
  showNotification('Redirection vers le suivi de commande...', 'info')
  // Ici on pourrait rediriger vers une page de suivi dédiée
}

function downloadInvoice(order) {
  showNotification('Téléchargement de la facture en cours...', 'info')
  // Ici on pourrait générer et télécharger la facture
}

// Initialisation
onMounted(() => {
  ordersStore.initializeWithSampleData()
})
</script>

<style scoped>
.order-history-page {
  min-height: 100vh;
  background: var(--background-light);
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}
.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-header h1 {
  font-size: 2.5rem;
  color: var(--text-dark);
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.subtitle {
  color: var(--text-light);
  font-size: 1.1rem;
}

/* Filtres */
.filters-section {
  background: var(--white);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.filters {
  display: flex;
  gap: 1.5rem;
  align-items: end;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 200px;
}

.filter-group label {
  font-weight: 500;
  color: var(--text-dark);
  font-size: 0.9rem;
}

.filter-select {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 1rem;
  background: var(--white);
  cursor: pointer;
}

.filter-select:focus {
  outline: none;
  border-color: var(--primary-color);
}

.clear-filters-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--white);
  color: var(--text-light);
  border: 1px solid var(--border-color);
  padding: 0.75rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  height: fit-content;
}

.clear-filters-btn:hover {
  background: var(--background-light);
  color: var(--text-dark);
}

/* État vide */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  background: var(--background-light);
  color: var(--text-light);
  border-radius: 50%;
  margin-bottom: 2rem;
}

.empty-state h2 {
  color: var(--text-dark);
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.empty-state p {
  color: var(--text-light);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.link-btn {
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  text-decoration: underline;
}

.start-shopping-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--primary-color);
  color: var(--white);
  padding: 1rem 2rem;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.start-shopping-btn:hover {
  background: #45a049;
  transform: translateY(-2px);
}

/* Liste des commandes */
.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.order-card {
  background: var(--white);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.order-card:hover {
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.order-number {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-dark);
  margin: 0 0 0.25rem 0;
}

.order-date {
  color: var(--text-light);
  font-size: 0.9rem;
  margin: 0;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.status-badge.pending {
  background: rgba(255, 193, 7, 0.1);
  color: #ff8c00;
}

.status-badge.processing {
  background: rgba(23, 162, 184, 0.1);
  color: #17a2b8;
}

.status-badge.shipped {
  background: rgba(40, 167, 69, 0.1);
  color: #28a745;
}

.status-badge.delivered {
  background: rgba(40, 167, 69, 0.1);
  color: #28a745;
}

.status-badge.cancelled {
  background: rgba(220, 53, 69, 0.1);
  color: #dc3545;
}

/* Détails de commande */
.order-details {
  overflow: hidden;
  transition: all 0.3s ease;
}

.order-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: var(--background-light);
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.summary-item .label {
  font-size: 0.85rem;
  color: var(--text-light);
}

.summary-item .value {
  font-weight: 600;
  color: var(--text-dark);
}

.summary-item .value.total {
  font-size: 1.1rem;
  color: var(--primary-color);
}

/* Articles de commande */
.order-items {
  padding: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.order-items h4 {
  color: var(--text-dark);
  margin: 0 0 1rem 0;
  font-size: 1rem;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--background-light);
  border-radius: 8px;
}

.item-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  flex: 1;
}

.item-details h5 {
  margin: 0 0 0.25rem 0;
  color: var(--text-dark);
  font-size: 0.95rem;
}

.item-price {
  color: var(--text-light);
  font-size: 0.85rem;
  margin: 0;
}

.item-total {
  font-weight: 600;
  color: var(--text-dark);
}

/* Adresse de livraison */
.delivery-info {
  padding: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.delivery-info h4 {
  color: var(--text-dark);
  margin: 0 0 1rem 0;
  font-size: 1rem;
}

.address {
  background: var(--background-light);
  padding: 1rem;
  border-radius: 8px;
}

.address p {
  margin: 0 0 0.25rem 0;
  color: var(--text-dark);
  line-height: 1.4;
}

.address p:last-child {
  margin-bottom: 0;
}
.order-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-top: 1px solid var(--border-color);
  background: var(--background-light);
}

.toggle-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.toggle-btn:hover {
  color: #45a049;
}

.toggle-btn svg {
  transition: transform 0.3s ease;
}

.toggle-btn svg.rotated {
  transform: rotate(180deg);
}

.action-buttons {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.action-btn.reorder {
  background: var(--primary-color);
  color: var(--white);
}

.action-btn.reorder:hover {
  background: #45a049;
}

.action-btn.track {
  background: #17a2b8;
  color: var(--white);
}

.action-btn.track:hover {
  background: #138496;
}

.action-btn.download {
  background: var(--white);
  color: var(--text-dark);
  border: 1px solid var(--border-color);
}

.action-btn.download:hover {
  background: var(--background-light);
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 3rem;
}

.pagination-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--white);
  border: 1px solid var(--border-color);
  color: var(--text-dark);
  padding: 0.75rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: var(--background-light);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 0.5rem;
}

.page-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--white);
  border: 1px solid var(--border-color);
  color: var(--text-dark);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-btn:hover {
  background: var(--background-light);
}

.page-btn.active {
  background: var(--primary-color);
  color: var(--white);
  border-color: var(--primary-color);
}
@media (max-width: 768px) {
  .order-history-page {
    padding: 1rem 0;
  }

  .page-header h1 {
    font-size: 2rem;
  }

  .filters {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-group {
    min-width: auto;
  }

  .order-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .order-summary {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .order-actions {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .action-buttons {
    justify-content: center;
    flex-wrap: wrap;
  }

  .order-item {
    flex-direction: column;
    text-align: center;
  }

  .pagination {
    flex-wrap: wrap;
  }

  .page-numbers {
    order: -1;
    width: 100%;
    justify-content: center;
  }
}
</style>
