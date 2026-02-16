<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container px-4 px-lg-5">
      <a class="navbar-brand" href="#">Start Bootstrap</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
          <li class="nav-item">
            <router-link class="nav-link" active-class="active" to="/">Home</router-link>
          </li>
        </ul>

        <!-- Bouton du panier -->
        <button class="btn btn-outline-dark" type="button" @click="showCart = true">
          <i class="bi-cart-fill me-1"></i>
          Cart
          <span class="badge bg-dark text-white ms-1 rounded-pill">{{ cart.totalItems }}</span>
        </button>
      </div>
    </div>

    <!-- Modal du panier -->
    <CartModal :visible="showCart" @close="showCart = false" />
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useCartStore } from '@/stores/cart.js'
import CartModal from './CartModal.vue'

const showCart = ref(false)
const cart = useCartStore()  // ✅ Toujours via Pinia store
</script>
