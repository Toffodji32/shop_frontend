// stores/auth.js
import { defineStore } from 'pinia'
import api from '../services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: (() => {
      const u = localStorage.getItem('user')
      try {
        return u ? JSON.parse(u) : null
      } catch (err) {
        console.warn('Erreur JSON.parse sur user dans localStorage', err)
        return null
      }
    })(),
    loading: false
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,

    isAdmin: (state) => {
      return state.user?.roles?.includes('ROLE_ADMIN')
    }
  },

  actions: {
    // ========================
    // REGISTER
    // ========================
    async register(name, email, password) {
      try {
        this.loading = true
        const res = await api.post('/register', { name, email, password })
        return res.data
      } catch (err) {
        throw err.response?.data || err
      } finally {
        this.loading = false
      }
    },

    // ========================
    // LOGIN
    // ========================
    async login(email, password) {
      try {
        this.loading = true
        const res = await api.post('/login', { email, password })

        this.token = res.data.token
        this.user = res.data.user

        localStorage.setItem('token', this.token)
        localStorage.setItem('user', JSON.stringify(this.user))

        return res.data
      } catch (err) {
        throw err.response?.data || err
      } finally {
        this.loading = false
      }
    },

    // ========================
    // LOGOUT
    // ========================
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },

    // ========================
    // INITIALISATION
    // ========================
    init() {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')

      if (token) this.token = token

      if (user) {
        try {
          this.user = JSON.parse(user)
        } catch (err) {
          console.warn('Erreur JSON.parse sur user dans init', err)
          this.user = null
        }
      }
    }
  }
})
