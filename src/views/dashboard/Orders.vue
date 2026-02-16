<template>
  <div class="container mt-4">
    <h2 class="mb-4">Mes commandes</h2>

    <div v-if="loading" class="text-center">
      Chargement...
    </div>

    <div v-else-if="orders.length === 0" class="alert alert-info">
      Vous n'avez encore aucune commande
    </div>

    <div v-else>
      <div
        v-for="order in orders"
        :key="order.id"
        class="card mb-3 shadow-sm"
      >
        <div class="card-header d-flex justify-content-between">
          <div>
            <strong>Commande #{{ order.id }}</strong>
          </div>

          <span
            class="badge"
            :class="order.status === 'Livrée'
              ? 'bg-success'
              : 'bg-warning text-dark'"
          >
            {{ order.status }}
          </span>
        </div>

        <div class="card-body">
          <p><strong>Date :</strong> {{ formatDate(order.createdAt) }}</p>

          <table class="table table-sm">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Prix</th>
                <th>Qté</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="item in order.orderItems"
                :key="item.id"
              >
                <td>{{ item.produit.name }}</td>
                <td>{{ item.price }} €</td>
                <td>{{ item.quantity }}</td>
                <td>{{ (item.price * item.quantity).toFixed(2) }} €</td>
              </tr>
            </tbody>
          </table>

          <div class="text-end fw-bold">
            Total : {{ order.totalPrice }} €
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useOrderStore } from '@/stores/orders'
import { onMounted, ref } from 'vue'

const store = useOrderStore()
const loading = ref(true)
const orders = ref([])

onMounted(async () => {
  await store.fetchMyOrders()
  orders.value = store.orders
  loading.value = false
})

const formatDate = (date) => {
  return new Date(date).toLocaleString()
}
</script>
