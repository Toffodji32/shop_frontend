import { defineStore } from 'pinia'
import api from '../services/api'

export const useOrderStore = defineStore('orders', {
  state: () => ({
    orders: [],       // commandes côté admin
    myOrders: [],     // commandes de l'utilisateur
    loading: false
  }),

  actions: {
    // 🔹 Créer commande (USER)
    async createOrder(cartItems) {
      const payload = {
        items: cartItems.map(item => ({
          product: item.id,
          quantity: item.quantity
        }))
      }

      const res = await api.post('/orders', payload)
      return res.data
    },

    // 🔹 Mes commandes (USER)
    async fetchMyOrders() {
      try {
        this.loading = true
        const res = await api.get('/orders/me')
        this.myOrders = res.data
      } catch (err) {
        console.error(err.response?.data || err)
      } finally {
        this.loading = false
      }
    },

    // 🔹 Liste commandes admin
    async fetchAdminOrders() {
      try {
        this.loading = true
        const res = await api.get('/orders/admin')
        this.orders = res.data
      } catch (err) {
        console.error(err.response?.data || err)
      } finally {
        this.loading = false
      }
    },

    // 🔹 Validation commande (ADMIN)
    async validateOrder(id) {
      try {
        await api.put(`/orders/${id}/validate`)
        // mettre à jour le status dans la liste admin sans refetch complet
        const order = this.orders.find(o => o.id === id)
        if (order) order.status = 'Livrée'
      } catch (err) {
        console.error(err.response?.data || err)
        throw err
      }
    },

    // 🔹 Rejet commande (ADMIN)
    async rejectOrder(id) {
      try {
        await api.put(`/orders/${id}/reject`)
        const order = this.orders.find(o => o.id === id)
        if (order) order.status = 'Rejetée'
      } catch (err) {
        console.error(err.response?.data || err)
        throw err
      }
    }
  }
})
