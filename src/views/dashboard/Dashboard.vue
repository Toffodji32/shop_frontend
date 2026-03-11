<template>

    <div class="container-fluid px-4 dashboard">

        <h1 class="mt-4 mb-4">Dashboard Admin</h1>

        <!-- ===================== -->
        <!-- CARDS STATISTIQUES -->
        <!-- ===================== -->

        <div class="row mb-4">

            <div class="col-md-3 mb-3" v-for="card in cards" :key="card.title">

                <div class="card dashboard-card shadow-sm border-0">

                    <div class="card-body d-flex justify-content-between align-items-center">

                        <div>
                            <h6 class="text-muted">{{ card.title }}</h6>
                            <h3 class="fw-bold">{{ card.value }}</h3>
                        </div>

                        <div class="icon-circle">
                            <i :class="card.icon"></i>
                        </div>

                    </div>

                </div>

            </div>

        </div>


        <!-- ===================== -->
        <!-- GRAPH VENTES -->
        <!-- ===================== -->

        <div class="row mb-4">

            <div class="col-md-12">

                <SalesChart />

            </div>

        </div>


        <!-- ===================== -->
        <!-- TOP PRODUITS -->
        <!-- ===================== -->

        <div class="card mb-4 shadow-sm">

            <div class="card-header fw-bold">
                Top produits
            </div>

            <div class="card-body">

                <table class="table table-hover">

                    <thead>

                        <tr>
                            <th>ID</th>
                            <th>Nom</th>
                            <th>Prix</th>
                            <th>Catégorie</th>
                        </tr>

                    </thead>

                    <tbody>

                        <tr v-for="product in topProducts" :key="product.id">

                            <td>{{ product.id }}</td>
                            <td>{{ product.name }}</td>
                            <td>{{ product.price }} €</td>
                            <td>{{ product.categorie?.name }}</td>

                        </tr>

                    </tbody>

                </table>

            </div>

        </div>

    </div>

</template>



<script setup>

import { ref, onMounted } from "vue"

import SalesChart from "@/components/SalesChart.vue"

import { useProductStore } from "@/stores/products"
import { useUserStore } from "@/stores/user"
import { useOrderStore } from "@/stores/orders"
import { useCategoryStore } from "@/stores/category"



const productStore = useProductStore()
const userStore = useUserStore()
const orderStore = useOrderStore()
const categoryStore = useCategoryStore()



const cards = ref([])
const topProducts = ref([])



const fetchData = async () => {

    // récupérer toutes les données
    await productStore.fetchProducts()
    await userStore.fetchUsers()
    await orderStore.fetchAdminOrders()
    await categoryStore.fetchCategories()



    // =====================
    // CALCUL BENEFICES
    // =====================

    const totalSales = orderStore.orders
        .filter(order => order.status === "Livrée")
        .reduce((sum, order) => {
            return sum + Number(order.totalPrice)
        }, 0)



    // =====================
    // CALCUL ADMINS
    // =====================

    const totalAdmins = userStore.users.filter(user =>

        user.roles.includes("ROLE_ADMIN")

    ).length



    // =====================
    // CARDS DASHBOARD
    // =====================

    cards.value = [

        {
            title: "Produits",
            value: productStore.products.length,
            icon: "bi bi-box"
        },

        {
            title: "Catégories",
            value: categoryStore.categories.length,
            icon: "bi bi-tags"
        },

        {
            title: "Utilisateurs",
            value: userStore.users.length,
            icon: "bi bi-people"
        },

        {
            title: "Commandes",
            value: orderStore.orders.length,
            icon: "bi bi-bag"
        },

        {
            title: "Bénéfices",
            value: totalSales + " €",
            icon: "bi bi-currency-euro"
        },

        {
            title: "Admins",
            value: totalAdmins,
            icon: "bi bi-shield-lock"
        }

    ]



    // =====================
    // TOP PRODUITS
    // =====================

    topProducts.value = productStore.products.slice(0, 5)

}



onMounted(fetchData)

</script>



<style scoped>
.dashboard {
    background: #f6f8fb;
    min-height: 100vh;
}


/* ==================== */
/* cards */
/* ==================== */

.dashboard-card {

    border-radius: 15px;
    transition: 0.3s;

}

.dashboard-card:hover {

    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);

}



/* ==================== */
/* icones */
/* ==================== */

.icon-circle {

    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #eef4ff;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 22px;
    color: #0d6efd;

}



/* ==================== */
/* table */
/* ==================== */

table {

    font-size: 15px;

}
</style>