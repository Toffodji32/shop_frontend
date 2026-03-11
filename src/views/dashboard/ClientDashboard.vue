<template>
    <div class="container-fluid px-4 dashboard">

        <!-- Bienvenue -->
        <div class="card mb-4 shadow-sm mt-3">
            <div class="card-body">
                <h4>Bonjour {{ user.name }} 👋</h4>
                <p class="text-muted">Bienvenue dans votre espace client</p>
            </div>
        </div>

        <!-- Statistiques -->
        <div class="row mb-4">
            <div class="col-md-3" v-for="card in cards" :key="card.title">
                <div class="card dashboard-card shadow-sm border-0">
                    <div class="card-body d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="text-muted">{{ card.title }}</h6>
                            <h3 class="fw-bold">{{ card.value }}</h3>
                        </div>
                        <i :class="card.icon" class="stat-icon"></i>
                    </div>
                </div>
            </div>
        </div>

        <!-- Graphique dépenses -->
        <ClientSpendingChart />

        <!-- Commandes récentes -->
        <div class="card shadow-sm mb-4">
            <div class="card-header fw-bold">Mes commandes récentes</div>
            <div class="card-body">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Date</th>
                            <th>Total</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="order in orders" :key="order.id">
                            <td>#{{ order.id }}</td>
                            <td>{{ order.date }}</td>
                            <td>{{ order.total }} €</td>
                            <td>
                                <span class="badge" :class="order.status === 'Livré' ? 'bg-success' : 'bg-warning'">
                                    {{ order.status }}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useOrderStore } from "@/stores/orders";
import ClientSpendingChart from "@/components/ClientSpendingChart.vue";

const authStore = useAuthStore();
const orderStore = useOrderStore();

const user = ref({ name: "Client" });
const orders = ref([]);
const cards = ref([
    { title: "Commandes", value: 0, icon: "bi bi-bag" },
    { title: "En livraison", value: 0, icon: "bi bi-truck" },
    { title: "Total dépensé", value: "0 €", icon: "bi bi-currency-euro" }
]);

const fetchData = async () => {
    // Récupérer utilisateur connecté
    user.value = authStore.user || { name: "Client" };

    // Récupérer commandes utilisateur
    await orderStore.fetchMyOrders();
    orders.value = orderStore.myOrders;

    // Mettre à jour les cards
    const totalDepense = orders.value
        .filter(o => o.status === "Livré")
        .reduce((acc, o) => acc + Number(o.total), 0);

    const enLivraison = orders.value.filter(o => o.status !== "Livré").length;

    cards.value = [
        { title: "Commandes", value: orders.value.length, icon: "bi bi-bag" },
        { title: "En livraison", value: enLivraison, icon: "bi bi-truck" },
        { title: "Total dépensé", value: `${totalDepense} €`, icon: "bi bi-currency-euro" }
    ];
};

onMounted(fetchData);
</script>

<style scoped>
.dashboard {
    background: #f6f8fb;
    min-height: 100vh;
}

/* cards */
.dashboard-card {
    border-radius: 15px;
    transition: 0.3s;
}

.dashboard-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.stat-icon {
    font-size: 28px;
    color: #0d6efd;
}
</style>