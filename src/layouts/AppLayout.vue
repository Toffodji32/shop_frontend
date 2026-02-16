<template>
  <NavBar />
  <main>
    <router-view />
  </main>
  <Footer />
</template>

<script setup>
import NavBar from '@/components/NavBar.vue';
import Footer from '@/components/Footer.vue';
</script>

<style scoped>
main {
  min-height: 80vh; /* Ajuste selon ton design */
  padding: 1rem;
}
</style>
