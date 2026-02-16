import { useAuthStore } from "@/stores/auth";
import { createRouter, createWebHistory } from "vue-router";

// Pages publiques
import Home from "@/views/Home.vue";
import Register from "@/views/Register.vue";

// Dashboard client
import Orders from "@/views/dashboard/Orders.vue";

// Dashboard admin

// Layouts
import AppLayout from "@/layouts/AppLayout.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";

import Login from "@/views/Login.vue";

const routes = [
  // =======================
  // 🔹 Public avec layout AppLayout
  // =======================
  {
    path: "/",
    component: AppLayout,
    children: [
      { path: "", component: Home },
    ],
  },

  // =======================
  // 🔹 Auth pages (Login/Register) avec layout AuthLayout
  // =======================
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    component: AuthLayout,
    children: [{ path: "", component: Register }],
  },

  // =======================
  // 🔹 Dashboard client
  // =======================
  {
    path: "/dashboard",
    component: AppLayout, // garde navbar/footer
    meta: { auth: true },
    children: [
      { path: "", redirect: "/dashboard/orders" }, // redirection par défaut
      { path: "orders", component: Orders },
      // autres pages dashboard client ici
    ],
  },

  // =======================
  // 🔹 Dashboard admin
  // =======================
  {
    path: "/admin",
    component: AppLayout, // garde navbar/footer
    meta: { admin: true },
    children: [
      { path: "", redirect: "/admin/products" },
      {
        path: "products",
        component: () => import("@/views/Admin/Products.vue"),
      },
      {
        path: "orders",
        component: () => import("@/views/Admin/Orders.vue"),
      },
      // autres pages admin ici
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 🔐 Protection globale des routes
router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  // Pages nécessitant authentification
  if (to.meta.auth && !auth.isAuthenticated()) {
    return next("/login");
  }

  // Pages nécessitant rôle admin
  if (
    to.meta.admin &&
    (!auth.isAuthenticated() || !auth.user?.roles.includes("ROLE_ADMIN"))
  ) {
    return next("/"); // redirection si pas admin
  }

  next();
});

export default router;
