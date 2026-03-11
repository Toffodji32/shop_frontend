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
        <button class="btn btn-sm btn-success float-end" @click="openAddModal" :disabled="loading">Ajouter une
          catégorie</button>
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
                <button class="btn btn-sm btn-primary me-2" @click="openEditModal(category)" :disabled="loading">
                  Modifier
                </button>
                <button class="btn btn-sm btn-danger" @click="deleteCategory(category.id)" :disabled="loading">
                  Supprimer
                </button>
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
            <fieldset :disabled="loading">
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
                  <button type="button" class="btn btn-secondary me-2" @click="closeModal" :disabled="loading">
                    Annuler
                  </button>

                  <button type="submit" class="btn btn-primary" :disabled="loading">
                    <span v-if="loading">
                      <span class="spinner-border spinner-border-sm"></span>
                      Chargement...
                    </span>

                    {{ isEditMode ? "Mettre à jour" : "Ajouter" }}
                  </button>
                </div>

              </form>
            </fieldset>
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
import Swal from "sweetalert2";
import { ElNotification } from "element-plus";

const store = useOrderStore();
const loading = ref(false);
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



// 🔥 SWEET ALERT + ELEMENT PLUS
const deleteCategory = async (id) => {

  const result = await Swal.fire({
    title: "Êtes-vous sûr ?",
    text: "Cette catégorie sera supprimée définitivement !",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Oui, supprimer",
    cancelButtonText: "Annuler"
  });

  if (!result.isConfirmed) return;

  try {
    await categoryStore.deleteCategory(id);


    ElNotification.success({
      title: "Succès",
      message: "Catégorie supprimée avec succès ✅",
      showClose: false,
      position: "top-right",
    });

    // refresh
    categories.value = categories.value.filter(c => c.id !== id);

  } catch (error) {
    ElMessage.error("Erreur lors de la suppression ❌");
    console.error(error);
  }
};


// Soumission
const submitCategory = async () => {
  loading.value = true;

  try {
    if (isEditMode.value) {
      const result = await Swal.fire({
        title: "Confirmer la mise à jour",
        text: "Êtes-vous sûr de vouloir mettre à jour cette catégorie ?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Oui, mettre à jour",
        cancelButtonText: "Annuler"
      });
      if (!result.isConfirmed) return;
      await categoryStore.updateCategory(form.value.id, form.value);
      ElNotification.success({
        title: "Succès",
        message: "Catégorie mise à jour avec succès ✅",
        showClose: false,
        position: "top-right",
      });
    } else {
      const result = await Swal.fire({
        title: "Confirmer l'ajout",
        text: "Êtes-vous sûr de vouloir ajouter cette catégorie ?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Oui, ajouter",
        cancelButtonText: "Annuler"
      });
      if (!result.isConfirmed) return;
      await categoryStore.createCategory(form.value);
      ElNotification.success({
        title: "Succès",
        message: "Catégorie créée avec succès ✅",
        showClose: false,
        position: "top-right",
      });
    }

    // Refresh liste
    categories.value = await productStore.fetchCategories();

    closeModal();
  } catch (error) {
    ElNotification.error({
      title: "Erreur",
      message: "Une erreur est survenue ❌",
      showClose: false,
      position: "top-right",
    });
    console.error("Erreur :", error);
  } finally {

    loading.value = false

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

// Fetch categories
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

.modal-backdrop.fade.show {
  background-color: rgba(0, 0, 0, 0.5) !important;
  z-index: 1040 !important;
}

/* Modal centré verticalement et horizontalement */
.modal.fade.show.d-block {
  position: fixed !important;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1050 !important;
  display: flex !important;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  width: 100%;
}

/* Dialog */
.modal-dialog {
  max-width: 700px;
  /* largeur max */
  width: 100%;
  max-height: 85vh;
  /* hauteur max */
  overflow-y: auto;
}

/* Contenu */
.modal-content {
  border-radius: 0.8rem;
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.3);
  padding: 1rem 1.5rem;
}

/* Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

/* Body */
.modal-body {
  padding: 1rem 0;
}

/* Footer */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #eee;
  padding-top: 1rem;
}

/* Boutons */
.btn-primary {
  background-color: #3085d6;
  border-color: #3085d6;
}

.btn-primary:hover {
  background-color: #2573c5;
  border-color: #2573c5;
}

.btn-secondary {
  background-color: #6c757d;
  border-color: #6c757d;
}

.btn-secondary:hover {
  background-color: #5a6268;
  border-color: #545b62;
}

/* Responsive : réduire la largeur sur petits écrans */
@media (max-width: 768px) {
  .modal-dialog {
    max-width: 95%;
  }
}
</style>
