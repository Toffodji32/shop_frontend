<template>
  <div v-if="visible" class="cart-modal-backdrop" @click.self="$emit('close')">
    <div class="cart-modal-dialog">
      <div class="cart-modal-content">
        <!-- Header -->
        <div class="cart-modal-header">
          <h5 class="cart-modal-title">Votre panier</h5>
          <button class="cart-modal-close" @click="$emit('close')">&times;</button>
        </div>

        <!-- Body -->
        <div class="cart-modal-body">
          <div v-if="cart.items.length === 0" class="text-center p-3">
            <p>Votre panier est vide</p>
          </div>

          <div v-else>
            <table class="table table-striped">
              <thead class="table-light">
                <tr>
                  <th>Produit</th>
                  <th>Prix</th>
                  <th>Quantité</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in cart.items" :key="item.id">
                  <td>{{ item.name }}</td>
                  <td>{{ item.price }} €</td>
                  <td>
                    <input type="number" min="1" v-model.number="item.quantity" class="form-control"/>
                  </td>
                  <td>{{ (item.price * item.quantity).toFixed(2) }} €</td>
                  <td>
                    <button class="btn btn-danger btn-sm" @click="remove(item.id)">Supprimer</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Footer -->
        <div class="cart-modal-footer">
          <div class="me-auto fw-bold">Total : {{ cart.totalPrice.toFixed(2) }} €</div>
          <button class="btn btn-primary" :disabled="loading" @click="checkout">
            <span v-if="loading">Commande en cours...</span>
            <span v-else>Commander</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCartStore } from '@/stores/cart.js'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

defineProps({ visible: Boolean })

const cart = useCartStore()
const auth = useAuthStore()
const loading = ref(false)

const remove = (id) => cart.remove(id)

const checkout = async () => {
  if (!auth.token) return alert("Veuillez vous connecter avant de commander")
  if (cart.items.length === 0) return alert("Votre panier est vide")

  loading.value = true
  try {
    await axios.post(
      'https://127.0.0.1:8000/api/orders',
      cart.toOrderPayload(),
      { headers: { Authorization: `Bearer ${auth.token}` } }
    )
    alert("Commande effectuée avec succès 🎉")
    cart.clear()
  } catch (err) {
    console.error(err)
    alert(err.response?.data?.message || "Erreur serveur")
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Overlay sombre mais lisible */
.cart-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.35); /* léger sombre */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
  overflow-y: auto;
  padding: 1rem;
}

/* Modal centré et scrollable */
.cart-modal-dialog {
  max-width: 800px;
  width: 100%;
}

/* Contenu du modal */
.cart-modal-content {
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.3);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

/* Header */
.cart-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
}
.cart-modal-title {
  margin: 0;
}
.cart-modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
}

/* Body */
.cart-modal-body {
  padding: 1rem;
  overflow-y: auto;
}

/* Footer */
.cart-modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 1rem;
  border-top: 1px solid #dee2e6;
}
</style>
