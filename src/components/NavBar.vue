<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container px-4 px-lg-5">
      <a class="navbar-brand" href="#">Start Bootstrap</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">

        <!-- Bouton du panier -->
        <button class="btn btn-outline-dark me-2" type="button" @click="showCart = true">
          <i class="bi-cart-fill me-1"></i>
          Cart
          <span class="badge bg-dark text-white ms-1 rounded-pill">{{ cart.totalItems }}</span>
        </button>

        <!-- 🔹 Bouton Login / Tableau de bord -->
        <div class="ms-auto">
          <button class="btn btn-dark" @click="goToDashboard">
            {{ auth.isAuthenticated ? 'Tableau de bord' : 'Login' }}
          </button>

        </div>


      </div>
    </div>

    <!-- Modal du panier -->
    <CartModal :visible="showCart" @close="showCart = false" />
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useCartStore } from '@/stores/cart.js'
import { useAuthStore } from '@/stores/auth.js'
import { useRouter } from 'vue-router'
import CartModal from './CartModal.vue'

// States
const showCart = ref(false)

// Stores
const cart = useCartStore()
const auth = useAuthStore()
const router = useRouter()

// 🔹 Redirection login / dashboard
const goToDashboard = () => {
  if (!auth.isAuthenticated) {
    router.push('/login')
  } else {
    // Rediriger selon rôle
    if (auth.user?.roles?.includes('ROLE_ADMIN')) {
      router.push('/dashboard') // admin
    } else {
      router.push('/dashboard') // client
    }
  }
}
</script>