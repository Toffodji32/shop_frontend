<template>
  <HeaderHero />

  <div class="container py-4">

    <h2 class="mb-4 text-center fw-bold">
      Nos produits
    </h2>

    <!-- 🔎 BARRE FILTRE + RECHERCHE -->
    <div class="row mb-4 justify-content-center">
      <div class="col-md-8">
        <div class="input-group shadow-sm">

          <!-- Catégories -->
          <select
            class="form-select"
            v-model="selectedCategory"
            @change="applyFilters"
          >
            <option value="">Toutes les catégories</option>
            <option
              v-for="cat in productStore.categories"
              :key="cat.id"
              :value="cat.id"
            >
              {{ cat.name }}
            </option>
          </select>

          <!-- Recherche -->
          <input
            type="text"
            class="form-control"
            placeholder="Rechercher un produit..."
            v-model="search"
            @input="applyFilters"
          />

        </div>
      </div>
    </div>

    <!-- Produits -->
    <div v-if="productStore.loading" class="text-center py-5">
      <div class="spinner-border"></div>
    </div>

    <div
      v-else
      class="row row-cols-1 row-cols-md-3 g-4"
    >
      <ProductCard
        v-for="product in filteredProducts"
        :key="product.id"
        :product="product"
        @view="openProductModal"
      />
    </div>

    <!-- Aucun résultat -->
    <div
      v-if="!productStore.loading && filteredProducts.length === 0"
      class="text-center text-muted mt-5"
    >
      Aucun produit trouvé
    </div>

    <!-- Modal produit -->
    <ProductModal
      v-if="selectedProduct"
      :product="selectedProduct"
      @close="closeModal"
    />

    <CartModal
      :visible="cartVisible"
      @close="cartVisible = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import HeaderHero from '@/components/HeaderHero.vue'
import { useProductStore } from '@/stores/products.js'
import ProductCard from '@/components/ProductCard.vue'
import ProductModal from '@/components/ProductModal.vue'
import CartModal from '@/components/CartModal.vue'

// store
const productStore = useProductStore()

// states
const selectedCategory = ref('')
const search = ref('')
const selectedProduct = ref(null)
const cartVisible = ref(false)

// 🔹 Computed
const filteredProducts = computed(() => productStore.products)

// 🔹 Appliquer les filtres côté backend
const applyFilters = () => {
  productStore.fetchFilteredProducts(selectedCategory.value, search.value)
}

const closeModal = () => {
  selectedProduct.value = null
}
// Chargement initial
onMounted(async () => {
  await productStore.fetchCategories()
  applyFilters()
})

// ouvrir modal
const openProductModal = (product) => {
  selectedProduct.value = product
}
</script>
