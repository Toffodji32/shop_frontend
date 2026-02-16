import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('cart') || '[]')
  }),

  getters: {
    totalItems: (state) =>
      state.items.reduce((sum, item) => sum + item.quantity, 0),

    totalPrice: (state) =>
      state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),

    isEmpty: (state) => state.items.length === 0
  },

  actions: {
    add(product) {
      const existing = this.items.find(item => item.id === product.id)

      if (existing) {
        existing.quantity++
      } else {
        this.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1
        })
      }

      this.save()
    },

    remove(id) {
      this.items = this.items.filter(item => item.id !== id)
      this.save()
    },

    updateQuantity(id, quantity) {
      const item = this.items.find(i => i.id === id)
      if (item) {
        item.quantity = quantity < 1 ? 1 : quantity
      }
      this.save()
    },

    clear() {
      this.items = []
      this.save()
    },

    save() {
      localStorage.setItem('cart', JSON.stringify(this.items))
    },

    // 🔥 IMPORTANT pour Symfony checkout
    // Format attendu :
    // {
    //   items: [{ product: 1, quantity: 2 }]
    // }
    toOrderPayload() {
      return {
        items: this.items.map(item => ({
          product: item.id,
          quantity: item.quantity
        }))
      }
    }
  }
})
