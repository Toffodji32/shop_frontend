<template>
  <div>
    <h2>Gestion des produits</h2>

    <button class="btn btn-primary mb-3" @click="showForm = !showForm">
      {{ showForm ? 'Annuler' : 'Ajouter un produit' }}
    </button>

    <div v-if="showForm" class="mb-4">
      <input v-model="form.name" placeholder="Nom" class="form-control mb-2" />
      <input v-model="form.price" type="number" placeholder="Prix" class="form-control mb-2" />
      <textarea v-model="form.description" placeholder="Description" class="form-control mb-2"></textarea>
      <input type="file" @change="handleFile" class="form-control mb-2" />
      <select v-model="form.categorie_id" class="form-control mb-2">
        <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
      </select>
      <button class="btn btn-success" @click="createProduct">Créer</button>
    </div>

    <table class="table table-striped">
      <thead>
        <tr>
          <th>Nom</th>
          <th>Prix</th>
          <th>Catégorie</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in productStore.products" :key="p.id">
          <td>{{ p.name }}</td>
          <td>{{ p.price }} €</td>
          <td>{{ p.categorie }}</td>
          <td>
            <button class="btn btn-danger btn-sm" @click="deleteProduct(p.id)">Supprimer</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { productStore } from '@/stores/products.js'
import api from '@/services/api.js'

const showForm = ref(false)
const form = ref({ name: '', price: '', description: '', image: null, categorie_id: 1 })
const categories = ref([])

onMounted(async () => {
  await productStore.fetchProducts()
  // récupérer les catégories depuis API
  try {
    const res = await api.get('/categories')
    categories.value = res.data
  } catch (err) {
    console.error(err)
  }
})

const handleFile = (e) => {
  form.value.image = e.target.files[0]
}

const createProduct = async () => {
  try {
    const formData = new FormData()
    Object.keys(form.value).forEach(k => formData.append(k, form.value[k]))

    await productStore.createProduct(formData)
    showForm.value = false
    form.value = { name: '', price: '', description: '', image: null, categorie_id: 1 }
  } catch (err) {
    alert(err.error || 'Erreur création produit')
  }
}

const deleteProduct = async (id) => {
  if (confirm('Supprimer ce produit ?')) {
    await productStore.deleteProduct(id)
  }
}
</script>
