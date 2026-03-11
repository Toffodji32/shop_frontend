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

                  <td>{{ item.price.toFixed(2) }} FCFA</td>

                  <td style="max-width: 90px">
                    <input type="number" min="1" v-model.number="item.quantity" class="form-control" />
                  </td>

                  <td class="fw-bold">
                    {{ (item.price * item.quantity).toFixed(2) }} FCFA
                  </td>

                  <td>
                    <button class="btn btn-outline-danger btn-sm" @click="remove(item.id)">
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
            Total : {{ cart.totalPrice.toFixed(2) }} FCFA
          </div>

          <button id="checkout-btn" class="btn btn-primary" :disabled="loading || cart.items.length === 0"
            @click="checkout">
            Commander
          </button>

          <!-- 🔹 bouton FedaPay invisible -->
          <button id="pay-btn" style="display:none;"></button>
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
    router.push({ path: "/login", query: { redirect: "checkout" } })
    return
  }

  if (cart.items.length === 0) return

  loading.value = true

  try {
    // 🔹 récupérer info utilisateur
    const userStore = useAuthStore()
    const user = userStore.user || { email: 'client@example.com', name: 'Client' }

    // 🔹 montant total (FCFA)
    const totalAmount = Math.round(cart.totalPrice)  // FedaPay veut un entier

    // 🔹 initialiser FedaPay
    FedaPay.init('#pay-btn', {
      public_key: 'pk_sandbox_hJix3Vgf3L9UNj3Fs4EObNRo', 
      transaction: {
        amount: totalAmount,
        description: 'Achat sur mon site'
      },
      customer: {
        email: user.email,
        firstname: user.name.split(' ')[0] || 'Client',
        lastname: user.name.split(' ')[1] || ''
      },
      

    })

    // 🔹 lancer le paiement
    document.querySelector('#pay-btn').click()

  } catch (err) {
    console.error(err)
    alert("Erreur lors de la commande")
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