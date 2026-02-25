<template>
  <div class="bg-light min-vh-100 d-flex align-items-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-5">
          <div class="card shadow-lg border-0 rounded-lg mt-5">
            <div class="card-header">
              <router-link to="/" class="text-decoration-none">
                <h3 class="text-center font-weight-light my-4">Se connecter</h3>
              </router-link>
            </div>

            <div class="card-body">
              <form @submit.prevent="handleLogin">
                <!-- Email -->
                <div class="form-floating mb-3">
                  <input v-model="email" class="form-control" type="email" placeholder="name@example.com" required />
                  <label>Email</label>
                </div>

                <!-- Password -->
                <div class="form-floating mb-3">
                  <input v-model="password" class="form-control" type="password" placeholder="Password" required />
                  <label>Mot de passe</label>
                </div>

                <!-- Error -->
                <div v-if="status === false" class="alert alert-danger">
                  {{ errorMessage }}
                </div>

                <!-- Button -->
                <div class="d-grid mt-4">
                  <button class="btn btn-primary" :disabled="loading">
                    <span v-if="loading">Connexion...</span>
                    <span v-else>Se connecter</span>
                  </button>
                </div>
              </form>
            </div>

            <div class="card-footer text-center py-3">
              <div class="small">
                <router-link to="/register">
                  Créer un compte
                </router-link>

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
import { useRouter } from "vue-router"
import { useAuthStore } from "@/stores/auth"

const auth = useAuthStore()
const router = useRouter()

const email = ref("")
const password = ref("")
const loading = ref(false)
const status = ref(null)
const errorMessage = ref("")

const handleLogin = async () => {
  loading.value = true
  status.value = null
  errorMessage.value = ""

  try {
    // 🔹 Appel à la fonction login du store
    await auth.login(email.value, password.value)

    // 🔹 Charger les infos utilisateur (important)
    await auth.currentUser()



    // 🔹 Redirection intelligente selon rôle
/*     const dashboardRoute = auth.isAdmin ? "/admin/orders" : "/client/orders"
 */    router.replace("/dashboard")

    status.value = true
  } catch (err) {
    console.error(err)
    status.value = false
    errorMessage.value = err.error || "Email ou mot de passe incorrect"
  } finally {
    loading.value = false
  }
}
</script>
