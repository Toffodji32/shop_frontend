<template>

    <body class="sb-nav-fixed">

        <!-- TOP NAVBAR -->
        <nav class="sb-topnav navbar navbar-expand navbar-dark bg-dark">

            <!-- Brand -->
            <a class="navbar-brand ps-3" href="#">Start Bootstrap</a>

            <!-- Sidebar toggle -->
            <button class="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" @click="toggleSidebar">
                <i class="fas fa-bars"></i>
            </button>

            <!-- BARRE DE RECHERCHE -->
            <!-- BOUTON RETOUR PAGE PRODUITS -->
            <div class="ms-auto me-3 my-2 my-md-0">
                <button class="btn btn-primary" @click="$router.push('/')">
                    Accueil
                </button>
            </div>

            <!-- Navbar user -->
            <ul class="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown">
                        <i class="fas fa-user fa-fw"></i>
                    </a>

                    <ul class="dropdown-menu dropdown-menu-end">
                        <li><a class="dropdown-item" @click="$router.push('/dashboard/settings')">Settings</a></li>
                        <li>
                            <hr class="dropdown-divider" />
                        </li>
                        <li>
                            <a class="dropdown-item" @click="logout">Logout</a>
                        </li>
                    </ul>
                </li>
            </ul>
        </nav>

        <div id="layoutSidenav">
            <div id="layoutSidenav_nav">
                <nav class="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
                    <div class="sb-sidenav-menu">
                        <div class="nav">
                            <div class="sb-sidenav-menu-heading">Core</div>
                            <router-link v-if="isAdmin()" class="nav-link" to="/dashboard">
                                <div class="sb-nav-link-icon"><i class="fas fa-tachometer-alt"></i></div>
                                Dashboard
                            </router-link>
                            <router-link v-if="!isAdmin()" class="nav-link" to="/dashboard/client">
                                <div class="sb-nav-link-icon"><i class="fas fa-tachometer-alt"></i></div>
                                Dashboard
                            </router-link>
                            <router-link v-if="!isAdmin()" class="nav-link" to="/dashboard/orders-copy">
                                <div class="sb-nav-link-icon"><i class="fas fa-tachometer-alt"></i></div>
                                Mes commandes
                            </router-link>
                            <div class="sb-sidenav-menu-heading">Modules</div>
                            <a v-if="isAdmin()" class="nav-link collapsed" href="#" data-bs-toggle="collapse"
                                data-bs-target="#collapseLayouts" aria-expanded="false" aria-controls="collapseLayouts">
                                <div class="sb-nav-link-icon"><i class="fas fa-columns"></i></div>
                                Gestion des produits
                                <div class="sb-sidenav-collapse-arrow"><i class="fas fa-angle-down"></i></div>
                            </a>

                            <div class="collapse" id="collapseLayouts" aria-labelledby="headingOne"
                                data-bs-parent="#sidenavAccordion">
                                <nav class="sb-sidenav-menu-nested nav">
                                    <router-link class="nav-link" to="/dashboard/categories">Categories</router-link>
                                    <router-link class="nav-link" to="/dashboard/produits">Produits</router-link>
                                </nav>
                            </div>

                            <a v-if="isAdmin()" class="nav-link collapsed" href="#" data-bs-toggle="collapse"
                                data-bs-target="#collapseLayouts1" aria-expanded="false"
                                aria-controls="collapseLayouts1">
                                <div class="sb-nav-link-icon"><i class="fas fa-columns"></i></div>
                                Gestion des commandes
                                <div class="sb-sidenav-collapse-arrow"><i class="fas fa-angle-down"></i></div>
                            </a>
                            <div class="collapse" id="collapseLayouts1" aria-labelledby="headingOne"
                                data-bs-parent="#sidenavAccordion">
                                <nav class="sb-sidenav-menu-nested nav">
                                    <router-link class="nav-link" to="/dashboard/orders">Commandes</router-link>
                                    <router-link class="nav-link" to="/dashboard/sales">Points de vente</router-link>
                                </nav>
                            </div>

                            <a v-if="isAdmin()" class="nav-link collapsed" href="#" data-bs-toggle="collapse"
                                data-bs-target="#collapseLayouts2" aria-expanded="false"
                                aria-controls="collapseLayouts2">
                                <div class="sb-nav-link-icon"><i class="fas fa-columns"></i></div>
                                Gestion des utilisateurs
                                <div class="sb-sidenav-collapse-arrow"><i class="fas fa-angle-down"></i></div>
                            </a>
                            <div class="collapse" id="collapseLayouts2" aria-labelledby="headingOne"
                                data-bs-parent="#sidenavAccordion">
                                <nav class="sb-sidenav-menu-nested nav">
                                    <router-link class="nav-link" to="/dashboard/users">Utilisateurs</router-link>
                                    <router-link class="nav-link" to="/dashboard/roles">Gestion des rôles</router-link>
                                </nav>
                            </div>



                        </div>
                    </div>
                    <div class="sb-sidenav-footer">
                        <div class="small">Logged in as:</div>
                        {{ userConnected?.email }}
                    </div>
                </nav>
            </div>
            <div id="layoutSidenav_content">
                <main>
                    <router-view />
                </main>
                <footer class="py-4 bg-light mt-auto">
                    <div class="container-fluid px-4">
                        <div class="d-flex align-items-center justify-content-between small">
                            <div class="text-muted">Copyright &copy; Your Website 2023</div>
                            <div>
                                <a href="#">Privacy Policy</a>
                                &middot;
                                <a href="#">Terms &amp; Conditions</a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>

    </body>
</template>

<script setup>
import { ref } from "vue"
import { useAuthStore } from "@/stores/auth"
import { useRouter } from "vue-router"
import {useCartStore} from "@/stores/cart"


const userConnected = ref(null);
const auth = useAuthStore();
const cart = useCartStore();
const router = useRouter()

const sidebarCollapsed = ref(false)

const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
}

useAuthStore().currentUser().then(user => {
    userConnected.value = user;
})

const logout = () => {
    auth.logout()
    cart.clear()
    router.push("/login")
}

const isAdmin = () => {
    return userConnected.value?.roles?.includes("ROLE_ADMIN")
}

</script>

<!-- <style scoped>
/* 🔥 Surbrillance menu actif */
.active-link {
    background-color: #0d6efd;
    color: white !important;
    border-radius: 5px;
}


.nav-link:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

/* scroll sidebar */
.sb-sidenav {
    height: 100%;
    overflow-y: auto;
}

/* main */
main {
    background: #f8f9fa;
}
</style> -->
