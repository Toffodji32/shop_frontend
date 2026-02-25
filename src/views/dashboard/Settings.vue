<template>

    <div class="settings-wrapper">
        <div class="settings-card">
            <h2 class="title">Paramètres du compte</h2>

            <form @submit.prevent="updateUser" class="settings-form">
                <!-- Nom -->
                <div class="form-group">
                    <label for="name">Nom</label>
                    <input id="name" type="text" v-model="form.name" required />
                </div>

                <!-- Email -->
                <div class="form-group">
                    <label for="email">Email</label>
                    <input id="email" type="email" v-model="form.email" required />
                </div>

                <hr />

                <!-- Ancien mot de passe -->
                <div class="form-group">
                    <label for="currentPassword">Mot de passe actuel</label>
                    <input id="currentPassword" type="password" v-model="form.currentPassword"
                        placeholder="Entrez votre mot de passe actuel" />
                </div>

                <!-- Nouveau mot de passe -->
                <div class="form-group">
                    <label for="newPassword">Nouveau mot de passe</label>
                    <input id="newPassword" type="password" v-model="form.newPassword"
                        placeholder="Entrez un nouveau mot de passe" />
                </div>

                <button class="btn-submit" :disabled="loading">
                    {{ loading ? 'Mise à jour...' : 'Mettre à jour' }}
                </button>

                <div v-if="successMessage" class="alert success">{{ successMessage }}</div>
                <div v-if="errorMessage" class="alert error">{{ errorMessage }}</div>
            </form>
        </div>
    </div>

</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import ClientLayout from '@/layouts/ClientLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'

const auth = useAuthStore()
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const form = ref({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: ''
})

// Déterminer le layout selon le rôle
const layoutComponent = computed(() => auth.isAdmin ? AdminLayout : ClientLayout)

// Charger l’utilisateur
onMounted(async () => {
    try {
        const user = await auth.currentUser()
        form.value.name = user.name
        form.value.email = user.email
    } catch (err) {
        console.warn('Impossible de récupérer l\'utilisateur courant')
    }
})

// Fonction de mise à jour
const updateUser = async () => {
    successMessage.value = ''
    errorMessage.value = ''
    loading.value = true

    try {
        const payload = {
            name: form.value.name,
            email: form.value.email,
            oldPassword: form.value.currentPassword,
            password: form.value.newPassword
        }

        const res = await auth.updateUser(payload)
        form.value.currentPassword = ''
        form.value.newPassword = ''
        successMessage.value = 'Profil mis à jour avec succès !'
    } catch (err) {
        errorMessage.value = err?.error || 'Erreur lors de la mise à jour'
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
/* Wrapper pour centrer le contenu */
.settings-wrapper {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 3rem 1rem;
    min-height: calc(100vh - 80px);
    /* ajuster selon ton header */
    background: #f5f6fa;
}

/* Carte du formulaire */
.settings-card {
    background: #fff;
    border-radius: 12px;
    padding: 2rem 2.5rem;
    width: 100%;
    max-width: 500px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
    transition: transform 0.2s;
}

.settings-card:hover {
    transform: translateY(-2px);
}

/* Titres et formulaire */
.title {
    font-size: 1.7rem;
    margin-bottom: 1.5rem;
    font-weight: 600;
    color: #333;
}

.settings-form .form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
}

.settings-form label {
    font-weight: 500;
    margin-bottom: 0.4rem;
}

.settings-form input {
    padding: 0.6rem 0.8rem;
    border-radius: 6px;
    border: 1px solid #ccc;
    font-size: 0.95rem;
    transition: border-color 0.2s;
}

.settings-form input:focus {
    border-color: #0d6efd;
    outline: none;
}

/* Bouton */
.btn-submit {
    width: 100%;
    padding: 0.7rem;
    margin-top: 1rem;
    background: #0d6efd;
    color: #fff;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
}

.btn-submit:disabled {
    background: #6c757d;
    cursor: not-allowed;
}

.btn-submit:hover:not(:disabled) {
    background: #0b5ed7;
}

/* Alerts */
.alert {
    margin-top: 1rem;
    padding: 0.6rem 0.8rem;
    border-radius: 6px;
    font-size: 0.9rem;
}

.alert.success {
    background: #d1e7dd;
    color: #0f5132;
}

.alert.error {
    background: #f8d7da;
    color: #842029;
}
</style>
