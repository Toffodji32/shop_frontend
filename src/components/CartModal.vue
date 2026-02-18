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
            <table class="table table-striped align-middle">
              <thead class="table-light">
                <tr>
                  <th>Produit</th>
                  <th>Prix</th>
                  <th>Quantité</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              
              <tbody>
                <tr v-for="item in cart.items" :key="item.id">
                  <td>{{ item.name }}</td>

                  <td>{{ item.price.toFixed(2) }} €</td>

                  <td style="max-width: 90px">
                    <input
                      type="number"
                      min="1"
                      v-model.number="item.quantity"
                      class="form-control"
                    />
                  </td>

                  <td class="fw-bold">
                    {{ (item.price * item.quantity).toFixed(2) }} €
                  </td>

                  <td>
                    <button
                      class="btn btn-outline-danger btn-sm"
                      @click="remove(item.id)"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Footer -->
        <div class="cart-modal-footer">
          <div class="me-auto fw-bold fs-5">
            Total : {{ cart.totalPrice.toFixed(2) }} €
          </div>

          <button
            class="btn btn-primary"
            :disabled="loading || cart.items.length === 0"
            @click="checkout"
          >
            <span v-if="loading">Commande en cours...</span>
            <span v-else>Commander</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useCartStore } from "@/stores/cart.js"
import { useAuthStore } from "@/stores/auth"
import { useRouter } from "vue-router"
import api from '../services/api'

defineProps({ visible: Boolean })

const cart = useCartStore()
const auth = localStorage.getItem("token")
const router = useRouter()
const loading = ref(false)

const remove = (id) => cart.remove(id)

const checkout = async () => {
  
  if (!auth) {
    router.push({
      path: "/login",
      query: { redirect: "checkout" }
    })
    return
  }

  if (cart.items.length === 0) return

  loading.value = true

  try {
    await api.post("/orders", cart.toOrderPayload())

    alert("Commande effectuée avec succès 🎉")
    cart.clear()
    router.push("/client/dashboard")
  } catch (err) {
    console.error(err)
    alert(err.response?.data?.message || "Erreur serveur")
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Overlay clair et lisible */
.cart-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.35);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
  overflow-y: auto;
  padding: 1rem;
}

/* Modal */
.cart-modal-dialog {
  max-width: 900px;
  width: 100%;
}

/* Contenu */
.cart-modal-content {
  background-color: #ffffff;
  border-radius: 0.6rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.25);
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
  font-weight: 600;
}

.cart-modal-close {
  background: none;
  border: none;
  font-size: 1.7rem;
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
  align-items: center;
  padding: 1rem;
  border-top: 1px solid #dee2e6;
}
</style>
