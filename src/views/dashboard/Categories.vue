<template>
  <div class="container-fluid px-4">
    <h1 class="mt-4">Categories</h1>
    <ol class="breadcrumb mb-4">
      <li class="breadcrumb-item"><router-link to="/dashboard">Dashboard</router-link></li>
      <li class="breadcrumb-item active">Liste des Categories</li>
    </ol>
    <div class="card mb-4">
      <div class="card-header">
        <i class="fas fa-table me-1"></i>
        Liste des Categories
        <button class="btn btn-sm btn-success float-end" @click="openAddModal">Ajouter une catégorie</button>
      </div>
      <div class="card-body">
        <table class="table table-bordered table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="category in categories" :key="category.id">
              <td>{{ category.id }}</td>
              <td>{{ category.name }}</td>
              <td>{{ category.description }}</td>
              <td>
                <button class="btn btn-sm btn-primary me-2" @click="openEditModal(category)">Modifier</button>
                <button class="btn btn-sm btn-danger" @click="deleteCategory(category.id)">Supprimer</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <div class="modal fade show d-block" v-if="modalVisible">
      <div class="modal-dialog">
        <div class="modal-content">

          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEditMode ? "Modifier la catégorie" : "Ajouter une catégorie" }}
            </h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>

          <div class="modal-body">
            <form @submit.prevent="submitCategory">

              <div class="mb-3">
                <label class="form-label">Nom</label>
                <input type="text" class="form-control" v-model="form.name" required>
              </div>

              <div class="mb-3">
                <label class="form-label">Description</label>
                <textarea class="form-control" v-model="form.description" rows="3" required></textarea>
              </div>

              <div class="text-end">
                <button type="button" class="btn btn-secondary me-2" @click="closeModal">
                  Annuler
                </button>
                <button type="submit" class="btn btn-success">
                  {{ isEditMode ? "Mettre à jour" : "Ajouter" }}
                </button>
              </div>

            </form>
          </div>

        </div>
      </div>
    </div>

    <!-- Backdrop -->
    <div class="modal-backdrop fade show" v-if="modalVisible"></div>

  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import { useOrderStore } from "@/stores/orders";
import { useProductStore } from "@/stores/products";
import { useCategoryStore } from "@/stores/category";
import { computed, onMounted, ref } from "vue";

const store = useOrderStore();
const loading = ref(true);
const orders = ref([]);
const searchQuery = ref("");
const currentPage = ref(1);
const perPage = 10;
const userConnected = ref(null);
const productStore = useProductStore();
const categoryStore = useCategoryStore();
const auth = useAuthStore();
const isEditMode = ref(false);

const form = ref({
  name: "",
  description: ""
});

const categories = ref([]);

useAuthStore().currentUser().then(user => {
  userConnected.value = user;
})

const openAddModal = () => {
  isEditMode.value = false;
  form.value = {
    id: null,
    name: "",
    description: ""
  };
  modalVisible.value = true;
};

const openEditModal = (category) => {
  isEditMode.value = true;
  form.value = {
    id: category.id,
    name: category.name,
    description: category.description
    
  };
  modalVisible.value = true;
};

const deleteCategory = async (id) => {
  const confirmDelete = confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?");
  if (!confirmDelete) return;
  try {
    await categoryStore.deleteCategory(id);
    categories.value = categories.value.filter(c => c.id !== id);
  } catch (error) {
    console.error("Erreur :", error);
  }
};

// Soumission
const submitCategory = async () => {
  try {
    if (isEditMode.value) {
      await categoryStore.updateCategory(form.value.id, form.value);
    } else {
      await categoryStore.createCategory(form.value);
    }

    // Refresh liste
    categories.value = await productStore.fetchCategories();

    closeModal();
  } catch (error) {
    console.error("Erreur :", error);
  }
};



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
  const res = await productStore.fetchCategories();
  categories.value = res;
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
