import { useAuthStore } from "@/stores/auth";
import { createRouter, createWebHistory } from "vue-router";

// Pages publiques
import Home from "@/views/Home.vue";

// Dashboard admin

// Layouts
import AppLayout from "@/layouts/AppLayout.vue";
import AdminLayout from "@/layouts/AdminLayout.vue";

import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import Dashboard from "@/views/dashboard/Dashboard.vue";
import Categories from "@/views/dashboard/Categories.vue";
import Produits from "@/views/dashboard/Produits.vue";
import AdminUser from "@/views/dashboard/AdminUser.vue";
import AdminOrder from "@/views/dashboard/AdminOrder.vue";
import AdminSales from "@/views/dashboard/AdminSales.vue";
import Settings from "@/views/dashboard/Settings.vue";
import AdminRole from "@/views/dashboard/AdminRole.vue";
import OrdersCopy from "@/views/dashboard/Orders copy.vue";

const routes = [
  {
    path: "/",
    component: AppLayout,
    children: [{ path: "", component: Home }],
  },

  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/dashboard",
    component: AdminLayout,
    meta: { requiresAuth: true }, // Toutes les routes enfants nécessitent authentification
    children: [
      {
        path: "",
        name: "Dashboard",
        component: Dashboard,
        meta: { roles: ["ROLE_ADMIN", "ROLE_USER"] },
      },
      {
        path: "categories",
        name: "Categories",
        component: Categories,
        meta: { roles: ["ROLE_ADMIN"] },
      },
      {
        path: "produits",
        name: "Produits",
        component: Produits,
        meta: { roles: ["ROLE_ADMIN"] },
      },
      {
        path: "users",
        name: "Users",
        component: AdminUser,
        meta: { roles: ["ROLE_ADMIN"] },
      },
      {
        path: "orders",
        name: "Orders",
        component: AdminOrder,
        meta: { roles: ["ROLE_ADMIN"] },
      },
      {
        path: "sales",
        name: "Sales",
        component: AdminSales,
        meta: { roles: ["ROLE_ADMIN"] },
      },
      {
        path: "roles",
        name: "Roles",
        component: AdminRole,
        meta: { roles: ["ROLE_ADMIN"] },
      },
      {
        path: "orders-copy",
        name: "Orders Copy",
        component: OrdersCopy,
        meta: { roles: ["ROLE_USER"] },
      },
      {
        path: "settings",
        name: "Settings",
        component: Settings,
        meta: { roles: ["ROLE_ADMIN", "ROLE_USER"] },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  const isLoggedIn = auth.isAuthenticated;
  const userRoles = auth.user?.roles || [];

  // 1️⃣ Si la route nécessite authentification
  if (to.meta.requiresAuth && !isLoggedIn) {
    return next("/login");
  }

  // 2️⃣ Si la route a des rôles définis
  if (to.meta.roles) {
    const hasAccess = to.meta.roles.some((role) => userRoles.includes(role));

    if (!hasAccess) {
      return next("/dashboard");
    }
  }

  //3️⃣ Bloquer login/register si connecté
  if ((to.name === "Login" || to.name === "Register") && isLoggedIn) {
    return next("/dashboard");
  }

  next();
});

export default router;
