import { defineStore } from 'pinia'
import api from '../services/api'

export const useProductStore = defineStore('products', {
  state: () => ({
    products: [],
    categories: [],
    selectedCategory: null,
    search: '',
    loading: false
  }),

  getters: {
    filteredProducts: (state) => state.products // tout est déjà filtré côté backend
  },

  actions: {
    // ========================
    // GET PRODUITS
    // ========================
    async fetchProducts() {
      try {
        this.loading = true
        const res = await api.get('/products')
        this.products = res.data
      } catch (err) {
        console.error(err.response?.data || err)
      } finally {
        this.loading = false
      }
    },

    // ========================
    // GET PRODUITS FILTRÉS
    // ========================
    async fetchFilteredProducts(categoryId = '', searchTerm = '') {
      try {
        this.loading = true
        const params = {}
        if (categoryId) params.category = categoryId
        if (searchTerm) params.search = searchTerm

        const res = await api.get('/products', { params })
        this.products = res.data
      } catch (err) {
        console.error(err.response?.data || err)
        this.products = []
      } finally {
        this.loading = false
      }
    },

    // ========================
    // GET CATEGORIES
    // ========================
    async fetchCategories() {
      try {
        const res = await api.get('/categories')
        this.categories = res.data
      } catch (err) {
        console.error(err.response?.data || err)
      }
    },

    selectCategory(id) {
      this.selectedCategory = id
    },

    setSearch(term) {
      this.search = term
    },

    // ========================
    // CRUD ADMIN
    // ========================
    async createProduct(formData) {
      try {
        const res = await api.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        this.products.push(res.data.product)
      } catch (err) {
        console.error(err.response?.data || err)
        throw err
      }
    },

    async updateProduct(id, formData) {
      try {
        const res = await api.post(`/products/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        const index = this.products.findIndex(p => p.id === id)
        if (index !== -1) this.products[index] = res.data.product
      } catch (err) {
        console.error(err.response?.data || err)
        throw err
      }
    },

    async deleteProduct(id) {
      try {
        await api.delete(`/products/${id}`)
        this.products = this.products.filter(p => p.id !== id)
      } catch (err) {
        console.error(err.response?.data || err)
      }
    }
  }
})
