<template>
    <div class="container-fluid px-4">
        <h1 class="mt-4">Commandes</h1>
        <ol class="breadcrumb mb-4">
            <li class="breadcrumb-item">
                <router-link to="/dashboard">Dashboard</router-link>
            </li>
            <li class="breadcrumb-item active">Liste des commandes</li>
        </ol>

        <div class="card mb-4">
            <div class="card-header">
                Liste des commandes
            </div>

            <div class="card-body">

                <!-- 🔄 Loader -->
                <div v-if="loading" class="text-center py-5">
                    <div class="spinner-border text-primary"></div>
                    <p class="mt-3">Chargement des commandes...</p>
                </div>

                <!-- 📋 Tableau -->
                <table v-else class="table table-bordered table-striped">

                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Client</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        <!-- ✅ Si commandes disponibles -->
                        <template v-if="orders.length > 0">
                            <tr v-for="order in orders" :key="order.id">
                                <td>{{ order.id }}</td>

                                <td>
                                    {{ order.customer?.email }}
                                </td>

                                <td>{{ order.totalPrice }} FCFA</td>

                                <td>
                                    <span class="badge" :class="{
                                        'bg-warning': order.status === 'En cours',
                                        'bg-success': order.status === 'Livrée',
                                        'bg-danger': order.status === 'Rejetée'
                                    }">
                                        {{ order.status }}
                                    </span>
                                </td>

                                <td>{{ formatDate(order.createdAt) }}</td>

                                <td>
                                    <button class="btn btn-sm btn-info me-2" @click="openDetails(order)">
                                        Voir
                                    </button>

                                    <button class="btn btn-sm btn-success me-2" @click="validate(order.id)"
                                        :disabled="order.status !== 'En cours'">
                                        Valider
                                    </button>

                                    <button class="btn btn-sm btn-danger" @click="reject(order.id)"
                                        :disabled="order.status !== 'En cours'">
                                        Rejeter
                                    </button>
                                </td>
                            </tr>
                        </template>

                        <!-- ❌ Si aucune commande -->
                        <tr v-else>
                            <td colspan="6" class="text-center text-muted py-4">
                                <i class="fas fa-box-open fa-2x mb-2"></i>
                                <br />
                                Aucune commande trouvée
                            </td>
                        </tr>

                    </tbody>
                </table>
            </div>
        </div>

        <!-- ========================= -->
        <!-- 🪟 MODAL DETAILS -->
        <!-- ========================= -->

        <div class="modal fade show d-block" v-if="detailsModal">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">

                    <div class="modal-header">
                        <h5>Détails commande #{{ selectedOrder?.id }}</h5>
                        <button class="btn-close" @click="detailsModal = false"></button>
                    </div>

                    <div class="modal-body">

                        <p><strong>Client :</strong> {{ selectedOrder?.customer?.email }}</p>
                        <p><strong>Total :</strong> {{ selectedOrder?.totalPrice }} FCFA</p>

                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Produit</th>
                                    <th>Prix</th>
                                    <th>Quantité</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr v-for="item in selectedOrder?.items" :key="item.id">
                                    <td>{{ item.product }}</td>
                                    <td>{{ item.price }} FCFA</td>
                                    <td>{{ item.quantity }}</td>
                                </tr>
                            </tbody>
                        </table>

                    </div>

                </div>
            </div>
        </div>

        <div class="modal-backdrop fade show" v-if="detailsModal"></div>

    </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useOrderStore } from "@/stores/orders"

const store = useOrderStore()

const orders = ref([])
const loading = ref(false)
const detailsModal = ref(false)
const selectedOrder = ref(null)

// ========================
// FETCH
// ========================
const fetchOrders = async () => {
    loading.value = true
    await store.fetchAdminOrders()
    orders.value = store.orders
    loading.value = false
}

onMounted(() => {
    fetchOrders()
})

// ========================
// ACTIONS
// ========================
const validate = async (id) => {
    await store.validateOrder(id)
    await fetchOrders() // 🔄 refresh automatique
}

const reject = async (id) => {
    await store.rejectOrder(id)
    await fetchOrders() // 🔄 refresh automatique
}

const openDetails = (order) => {
    selectedOrder.value = order
    detailsModal.value = true
}

// ========================
// UTILS
// ========================
const formatDate = (date) => {
    return new Date(date).toLocaleString()
}
</script>