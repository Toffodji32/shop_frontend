<template>
    <div class="sb-nav-fixed">

        <!-- TOP NAVBAR -->
        <nav class="sb-topnav navbar navbar-expand navbar-dark bg-dark">

            <!-- Brand -->
            <a class="navbar-brand ps-3" href="#">Start Bootstrap</a>

            <!-- Sidebar toggle -->
            <button class="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" @click="toggleSidebar">
                <i class="fas fa-bars"></i>
            </button>

            <!-- Navbar user -->
            <ul class="navbar-nav ms-auto me-3 me-lg-4">
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown">
                        <i class="fas fa-user fa-fw"></i>
                    </a>

                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                        <li><a class="dropdown-item" @click="$router.push('/settings')">Settings</a></li>
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

        <!-- LAYOUT -->
        <div class="d-flex" style="height: 100vh; overflow: hidden;">

            <!-- SIDEBAR -->
            <div id="layoutSidenav_nav" class="bg-dark" :class="{ 'd-none': sidebarCollapsed }" style="width: 250px;">
                <nav class="sb-sidenav sb-sidenav-dark">

                    <div class="sb-sidenav-menu">
                        <div class="nav">

                            <div class="sb-sidenav-menu-heading">Core</div>

                            <RouterLink to="/client/orders" class="nav-link" active-class="active-link">
                                Mes commandes
                            </RouterLink>

                        </div>
                    </div>

                </nav>
            </div>

            <!-- CONTENU -->
            <div class="d-flex flex-column flex-grow-1">

                <main class="mt-5 flex-grow-1 p-4 overflow-auto">
                    <slot />
                </main>

                <footer class="py-4 bg-light mt-auto">
                    <div class="container-fluid px-4">
                        <div class="d-flex justify-content-between small">
                            <div class="text-muted">
                                Copyright &copy; 2026
                            </div>
                        </div>
                    </div>
                </footer>

            </div>
        </div>
    </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth"
import { ref } from "vue"
import { useRouter } from "vue-router"

const auth = useAuthStore()
const router = useRouter()

const sidebarCollapsed = ref(false)

const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
}

const logout = () => {
    auth.logout()
    router.push("/login")
}
</script>

<style scoped>
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
</style>
