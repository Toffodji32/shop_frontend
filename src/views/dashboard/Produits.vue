<template>
  <div class="container-fluid px-4">
    <h1 class="mt-4">Produits</h1>
    <ol class="breadcrumb mb-4">
      <li class="breadcrumb-item"><router-link to="/dashboard">Dashboard</router-link></li>
      <li class="breadcrumb-item active">Liste des produits</li>
    </ol>

    <div class="card mb-4">
      <div class="card-header">
        Liste des Produits
        <button class="btn btn-sm btn-success float-end" @click="openAddModal">
          Ajouter un produit
        </button>
      </div>

      <div class="card-body">
        <table class="table table-bordered table-striped align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Nom</th>
              <th>Prix</th>
              <th>Catégorie</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="product in products" :key="product.id">
              <td>{{ product.id }}</td>

              <td>
                <img
                  v-if="product.image"
                  :src="product.image"
                  width="50"
                  class="rounded"
                />
              </td>

              <td>{{ product.name }}</td>
              <td>{{ product.price }} €</td>
              <td>{{ product.categorie?.name }}</td>

              <td>
                <button
                  class="btn btn-sm btn-primary me-2"
                  @click="openEditModal(product)"
                >
                  Modifier
                </button>

                <button
                  class="btn btn-sm btn-danger"
                  @click="openDeleteModal(product.id)"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- MODAL ADD / EDIT -->
    <div class="modal fade show d-block" v-if="modalVisible">
      <div class="modal-dialog">
        <div class="modal-content">

          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEditMode ? "Modifier produit" : "Ajouter produit" }}
            </h5>
            <button class="btn-close" @click="closeModal"></button>
          </div>

          <div class="modal-body">
            <form @submit.prevent="submitProduct">

              <div class="mb-3">
                <label>Nom</label>
                <input v-model="form.name" class="form-control" required />
              </div>

              <div class="mb-3">
                <label>Prix</label>
                <input v-model="form.price" type="number" class="form-control" required />
              </div>

              <div class="mb-3">
                <label>Description</label>
                <textarea v-model="form.description" class="form-control"></textarea>
              </div>

              <div class="mb-3">
                <label>Catégorie</label>
                <select v-model="form.categorie_id" class="form-select" required>
                  <option disabled value="">Choisir...</option>
                  <option
                    v-for="cat in categories"
                    :key="cat.id"
                    :value="cat.id"
                  >
                    {{ cat.name }}
                  </option>
                </select>
              </div>

              <div class="mb-3">
                <label>Image</label>
                <input type="file" @change="handleImage" class="form-control" />
              </div>

              <div class="text-end">
                <button class="btn btn-secondary me-2" @click="closeModal">
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

    <!-- MODAL CONFIRM DELETE -->
    <div class="modal fade show d-block" v-if="confirmDeleteModal">
      <div class="modal-dialog modal-sm modal-dialog-centered">
        <div class="modal-content">

          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title">Confirmation</h5>
          </div>

          <div class="modal-body text-center">
            Supprimer ce produit ?
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" @click="confirmDeleteModal = false">
              Annuler
            </button>
            <button class="btn btn-danger" @click="confirmDeleteProduct">
              Supprimer
            </button>
          </div>

        </div>
      </div>
    </div>

    <div class="modal-backdrop fade show" v-if="modalVisible || confirmDeleteModal"></div>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useProductStore } from "@/stores/products"

const productStore = useProductStore()

const products = ref([])
const categories = ref([])

const modalVisible = ref(false)
const confirmDeleteModal = ref(false)
const isEditMode = ref(false)

const productToDelete = ref(null)

const form = ref({
  id: null,
  name: "",
  price: "",
  description: "",
  categorie_id: "",
  image: null
})

onMounted(async () => {
  await productStore.fetchProducts()
  await productStore.fetchCategories()
  products.value = productStore.products
  categories.value = productStore.categories
})

const openAddModal = () => {
  isEditMode.value = false
  form.value = {
    id: null,
    name: "",
    price: "",
    description: "",
    categorie_id: "",
    image: null
  }
  modalVisible.value = true
}

const openEditModal = (product) => {
  isEditMode.value = true
  form.value = {
    id: product.id,
    name: product.name,
    price: product.price,
    description: product.description,
    categorie_id: product.categorie?.id,
    image: null
  }
  modalVisible.value = true
}

const handleImage = (e) => {
  form.value.image = e.target.files[0]
}

const submitProduct = async () => {
  const formData = new FormData()
  formData.append("name", form.value.name)
  formData.append("price", form.value.price)
  formData.append("description", form.value.description)
  formData.append("categorie_id", form.value.categorie_id)
  if (form.value.image) formData.append("image", form.value.image)

  if (isEditMode.value) {
    await productStore.updateProduct(form.value.id, formData)
  } else {
    await productStore.createProduct(formData)
  }

  await productStore.fetchProducts()
  products.value = productStore.products
  closeModal()
}

const openDeleteModal = (id) => {
  productToDelete.value = id
  confirmDeleteModal.value = true
}

const confirmDeleteProduct = async () => {
  try {
    await productStore.deleteProduct(productToDelete.value)
    products.value = products.value.filter(p => p.id !== productToDelete.value)
  } catch (error) {
    console.error("Erreur :", error)
  }
  confirmDeleteModal.value = false
}

const closeModal = () => {
  modalVisible.value = false
}
</script>
