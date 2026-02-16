import { defineStore } from 'pinia'
import api from '../services/api'

export const useOrderStore = defineStore('orders', {
  state: () => ({
    orders: []
  }),

  actions: {
    // 🔹 Créer commande
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

    // 🔹 Mes commandes
    async fetchMyOrders() {
      const res = await api.get('/orders/me')
      this.orders = res.data
    },

    // 🔹 Validation admin
    async validateOrder(id) {
      await api.put(`/orders/${id}/validate`)
    }
  }
})
