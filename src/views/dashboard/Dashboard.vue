<template>
  <ClientLayout>
    <div class="container mt-4">
      <h2>Mon espace client</h2>
      <div class="row">
        <!-- Menu gauche -->
        <div class="col-md-3">
          <div class="list-group">
            <router-link to="/dashboard/orders" class="list-group-item">
              Mes commandes
            </router-link>
          </div>
        </div>

        <!-- Contenu -->
        <div class="col-md-9">
          <router-view />
        </div>
      </div>
    </div>
  </ClientLayout>
</template>
<script setup>
import ClientLayout from '@/layouts/ClientLayout.vue';
</script>
