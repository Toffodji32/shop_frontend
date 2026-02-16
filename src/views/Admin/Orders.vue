<template>
  <div>
    <h2>Commandes</h2>

    <table class="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Client</th>
          <th>Total</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="o in orderStore.orders" :key="o.id">
          <td>{{ o.id }}</td>
          <td>{{ o.customer.name }}</td>
          <td>{{ o.totalPrice }} €</td>
          <td>{{ o.status }}</td>
          <td>
            <button v-if="o.status !== 'Livrée'" class="btn btn-success btn-sm" @click="validateOrder(o.id)">
              Valider
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useOrderStore } from '@/stores/orders'

const orderStore = useOrderStore()

onMounted(async () => {
  await orderStore.fetchMyOrders() // pour admin, on pourra créer fetchAllOrders()
})

const validateOrder = async (id) => {
  await orderStore.validateOrder(id)
  await orderStore.fetchMyOrders()
}
</script>
