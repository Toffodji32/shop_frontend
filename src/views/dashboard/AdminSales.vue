<template>
    <div class="container-fluid px-4">

        
        <h1 class="mt-4">Point de vente</h1>
        <ol class="breadcrumb mb-4">
            <li class="breadcrumb-item">
                <router-link to="/dashboard">Dashboard</router-link>
            </li>
            <li class="breadcrumb-item active">Liste des points de vente</li>
        </ol>

        
        <div class="row">

            <div class="col-xl-3 col-md-6">
                <div class="card bg-primary text-white mb-4">
                    <div class="card-body">
                        <h5>Chiffre d'affaires</h5>
                        <h3>{{ sales?.totalSales ?? 0 }} FCFA</h3>
                    </div>
                </div>
            </div>

            <div class="col-xl-3 col-md-6">
                <div class="card bg-success text-white mb-4">
                    <div class="card-body">
                        <h5>Produits vendus</h5>
                        <h3>{{ totalProducts }}</h3>
                    </div>
                </div>
            </div>

            <div class="col-xl-3 col-md-6">
                <div class="card bg-warning text-white mb-4">
                    <div class="card-body">
                        <h5>Date</h5>
                        <h5>{{ today }}</h5>
                    </div>
                </div>
            </div>

        </div>

        <!-- TABLE -->
        <div class="card mb-4">

            <div class="card-header">
                Liste des produits vendus aujourd’hui
            </div>

            <div class="card-body">

                <!-- LOADING -->
                <div v-if="store.loading" class="text-center p-4">
                    Chargement...
                </div>

                <!-- EMPTY -->
                <div v-else-if="!sales || Object.keys(sales.products).length === 0" class="alert alert-info">
                    Aucune vente aujourd'hui.
                </div>

                <!-- TABLE -->
                <table v-else class="table table-bordered table-striped">

                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Produit</th>
                            <th>Quantité vendue</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="(qty, product, index) in sales.products" :key="product">
                            <td>{{ index + 1 }}</td>
                            <td>{{ product }}</td>
                            <td>
                                <span class="badge bg-success">{{ qty }}</span>
                            </td>
                        </tr>
                    </tbody>

                </table>

            </div>
        </div>

    </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useSalesStore } from "@/stores/sales";

const store = useSalesStore();
const sales = ref(null);

// 🔹 Total produits vendus
const totalProducts = computed(() => {
    if (!sales.value) return 0;

    return Object.values(sales.value.products || {})
        .reduce((a, b) => a + b, 0);
});

// 🔹 Date aujourd’hui
const today = new Date().toLocaleDateString();

onMounted(async () => {
    await store.fetchTodaySales();
    sales.value = store.todaySales;
});
</script>
