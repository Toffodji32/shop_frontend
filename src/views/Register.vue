<template>
  <div class="bg-light min-vh-100 d-flex align-items-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-6">

          <div class="card shadow-lg border-0 rounded-lg mt-5">
            <div class="card-header">
              <h3 class="text-center font-weight-light my-4">Créer un compte</h3>
            </div>

            <div class="card-body">
              <form @submit.prevent="register">

                <!-- NAME -->
                <div class="form-floating mb-3">
                  <input
                    v-model="name"
                    class="form-control"
                    type="text"
                    placeholder="Votre nom"
                    required
                  />
                  <label>Nom</label>
                </div>

                <!-- EMAIL -->
                <div class="form-floating mb-3">
                  <input
                    v-model="email"
                    class="form-control"
                    type="email"
                    placeholder="name@example.com"
                    required
                  />
                  <label>Email</label>
                </div>

                <!-- PASSWORD -->
                <div class="form-floating mb-3">
                  <input
                    v-model="password"
                    class="form-control"
                    type="password"
                    placeholder="Mot de passe"
                    required
                  />
                  <label>Mot de passe</label>
                </div>

                <!-- CONFIRM -->
                <div class="form-floating mb-3">
                  <input
                    v-model="confirmPassword"
                    class="form-control"
                    type="password"
                    placeholder="Confirmer"
                    required
                  />
                  <label>Confirmer mot de passe</label>
                </div>

                <!-- BUTTON -->
                <div class="d-grid mt-4">
                  <button class="btn btn-primary" :disabled="loading">
                    <span v-if="loading">Création...</span>
                    <span v-else>Créer un compte</span>
                  </button>
                </div>

              </form>

              <!-- ERROR -->
              <div v-if="error" class="alert alert-danger mt-3">
                {{ error }}
              </div>
            </div>

            <div class="card-footer text-center py-3">
              <div class="small">
                <router-link to="/login">Déjà un compte ? Connexion</router-link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useAuthStore } from "@/stores/auth"
import { useRouter } from "vue-router"

const router = useRouter()
const authStore = useAuthStore()

const name = ref("")
const email = ref("")
const password = ref("")
const confirmPassword = ref("")
const error = ref("")
const loading = ref(false)

const register = async () => {
  error.value = ""

  if (password.value !== confirmPassword.value) {
    error.value = "Les mots de passe ne correspondent pas"
    return
  }

  loading.value = true

  try {
    await authStore.register({
      name: name.value,
      email: email.value,
      password: password.value
    })

    alert("Compte créé avec succès 🎉")

    // 🔥 redirection vers login
    router.push("/login")

  } catch (err) {
    error.value = err.response?.data?.message || "Erreur serveur"
  } finally {
    loading.value = false
  }
}
</script>


