<template>
  <ClientLayout>
    <div class="container mt-4">
      <h2 class="mb-4">Mes commandes</h2>

      <!-- Recherche -->
      <div class="row mb-3">
        <div class="col-md-6">
          <input
            v-model="searchQuery"
            type="text"
            class="form-control"
            placeholder="Rechercher par ID ou statut..."
          />
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center">
        Chargement...
      </div>

      <!-- Aucune commande -->
      <div v-else-if="filteredOrders.length === 0" class="alert alert-info">
        Vous n'avez encore aucune commande
      </div>

      <!-- Tableau commandes -->
      <div v-else>
        <table class="table table-hover table-bordered">
          <thead class="table-dark">
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Statut</th>
              <th>Total</th>
              <th>Détails</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in paginatedOrders" :key="order.id">
              <td>{{ order.id }}</td>
              <td>{{ formatDate(order.createdAt) }}</td>
              <td>
                <span
                  class="badge"
                  :class="order.status === 'Livrée' ? 'bg-success' : 'bg-warning text-dark'"
                >
                  {{ order.status }}
                </span>
              </td>
              <td>{{ order.totalPrice.toFixed(2) }} €</td>
              <td>
                <button
                  class="btn btn-sm btn-primary"
                  @click="openModal(order)"
                >
                  Voir
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <nav>
          <ul class="pagination justify-content-center">
            <li
              class="page-item"
              :class="{ disabled: currentPage === 1 }"
            >
              <button class="page-link" @click="prevPage">Précédent</button>
            </li>
            <li
              class="page-item"
              v-for="page in totalPages"
              :key="page"
              :class="{ active: page === currentPage }"
            >
              <button class="page-link" @click="goToPage(page)">
                {{ page }}
              </button>
            </li>
            <li
              class="page-item"
              :class="{ disabled: currentPage === totalPages }"
            >
              <button class="page-link" @click="nextPage">Suivant</button>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- Modal détails commande -->
    <div
      class="modal fade"
      tabindex="-1"
      :class="{ show: modalVisible }"
      style="display: block"
      v-if="modalVisible"
      @click.self="closeModal"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Commande #{{ selectedOrder.id }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <p><strong>Date :</strong> {{ formatDate(selectedOrder.createdAt) }}</p>
            <p><strong>Statut :</strong> {{ selectedOrder.status }}</p>

            <table class="table table-sm table-bordered">
              <thead class="table-light">
                <tr>
                  <th>Produit</th>
                  <th>Prix</th>
                  <th>Qté</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in selectedOrder.orderItems" :key="item.id">
                  <td>{{ item.produit.name }}</td>
                  <td>{{ item.price.toFixed(2) }} €</td>
                  <td>{{ item.quantity }}</td>
                  <td>{{ (item.price * item.quantity).toFixed(2) }} €</td>
                </tr>
              </tbody>
            </table>
            <div class="text-end fw-bold">
              Total : {{ selectedOrder.totalPrice.toFixed(2) }} €
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeModal">Fermer</button>
          </div>
        </div>
      </div>
    </div>
  </ClientLayout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import ClientLayout from "@/layouts/ClientLayout.vue";
import { useOrderStore } from "@/stores/orders";

const store = useOrderStore();
const loading = ref(true);
const orders = ref([]);
const searchQuery = ref("");
const currentPage = ref(1);
const perPage = 10;

// Modal
const modalVisible = ref(false);
const selectedOrder = ref({});

const openModal = (order) => {
  selectedOrder.value = order;
  modalVisible.value = true;
};
const closeModal = () => (modalVisible.value = false);

// Fetch commandes
onMounted(async () => {
  await store.fetchMyOrders();
  orders.value = store.orders;
  loading.value = false;
});

// Format date
const formatDate = (date) => new Date(date).toLocaleString();

// Filtre recherche
const filteredOrders = computed(() => {
  if (!searchQuery.value) return orders.value;
  return orders.value.filter(
    (o) =>
      o.id.toString().includes(searchQuery.value) ||
      o.status.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Pagination
const totalPages = computed(() => Math.ceil(filteredOrders.value.length / perPage));
const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return filteredOrders.value.slice(start, start + perPage);
});

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};
const goToPage = (page) => {
  currentPage.value = page;
};
</script>

<style scoped>
/* Modal backdrop */
.modal.fade {
  background-color: rgba(0, 0, 0, 0.5);
}

/* Modal centré */
.modal-dialog {
  margin-top: 5vh;
}

/* Badge */
.badge {
  font-size: 0.9rem;
  padding: 0.5em 0.7em;
}
</style>
