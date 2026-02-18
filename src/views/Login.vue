<template>
  <div class="bg-light min-vh-100 d-flex align-items-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-5">
          <div class="card shadow-lg border-0 rounded-lg mt-5">
            <div class="card-header">
              <h3 class="text-center font-weight-light my-4">Connexion</h3>
            </div>

            <div class="card-body">
              <form @submit.prevent="login">
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
                <div v-if="status" class="alert alert-success">
                  Connexion réussie !
                </div>
                <div v-if="status === false" class="alert alert-danger">
                  Email ou mot de passe incorrect
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
import { useAuthStore } from "@/stores/auth"
import { ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import api from '../services/api'

const email = ref("")
const password = ref("")
const error = ref("")
const loading = ref(false)
const status = ref(null)

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

let token = localStorage.getItem("token")

const login = async () => {
  error.value = ""
  loading.value = true

  try {
    const res = await api.post("login",
      {
        email: email.value,
        password: password.value,
      }
    )

    if(res.status === 200) {
      token = localStorage.setItem("token", res.data.token)
      status.value = true
      router.push("/client/dashboard")  
    }



    // 🔥 Redirection intelligente
    /* if (route.query.redirect === "checkout") {
      router.push("/checkout")
    } else if (auth.isAdmin) {
      router.push("/admin/dashboard")
    } else {
      router.push("/client/dashboard")
    } */

  } catch (err) {
    status.value = false
  } finally {
    loading.value = false
  }
}
</script>
