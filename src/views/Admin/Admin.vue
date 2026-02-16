<template>
  <div class="admin-dashboard d-flex">
    <nav class="sidebar bg-dark text-white p-3">
      <h3>Admin Dashboard</h3>
      <ul class="list-unstyled mt-4">
        <li><router-link class="text-white" to="/admin/products">Produits</router-link></li>
        <li><router-link class="text-white" to="/admin/orders">Commandes</router-link></li>
      </ul>
    </nav>

    <main class="flex-grow-1 p-4">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
}
.sidebar {
  width: 200px;
}
main {
  background: #f8f9fa;
}
</style>
