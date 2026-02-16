<template>
  <div class="auth-layout">
    <slot /> <!-- Contenu des pages auth -->
  </div>
</template>

<script setup>
</script>

<style scoped>
.auth-layout {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5; /* optionnel */
}
</style>
