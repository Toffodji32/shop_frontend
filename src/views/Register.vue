<template>
  <form @submit.prevent="handleRegister">
    <input v-model="name" placeholder="Nom" />
    <input v-model="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Mot de passe" />
    <button type="submit">S’inscrire</button>
    <p v-if="error">{{ error }}</p>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

const name = ref('');
const email = ref('');
const password = ref('');
const error = ref('');

const handleRegister = async () => {
  error.value = '';
  try {
    await auth.register(name.value, email.value, password.value);
    router.push('/login'); // après inscription, redirige vers login
  } catch (err) {
    error.value = err.error || 'Erreur lors de l’inscription';
  }
};
</script>
