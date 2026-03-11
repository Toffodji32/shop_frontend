<template>
  <div class="bg-light min-vh-100 d-flex align-items-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-5">

          <div class="card shadow-lg border-0 rounded-lg mt-5">

            <!-- Header -->
            <div class="card-header">
              <router-link to="/" class="text-decoration-none">
                <h3 class="text-center font-weight-light my-4">
                  Se connecter
                </h3>
              </router-link>
            </div>

            <!-- Body -->
            <div class="card-body">
              <form @submit.prevent="handleLogin">

                <!-- Email -->
                <div class="form-floating mb-3">
                  <input v-model="email" class="form-control" :class="{ 'is-invalid': errors.email }" type="email"
                    placeholder="name@example.com" />
                  <label>Email</label>

                  <div v-if="errors.email" class="invalid-feedback">
                    {{ errors.email }}
                  </div>
                </div>

                <!-- Password -->
                <div class="form-floating mb-3 position-relative">

                  <input v-model="password" class="form-control" :class="{ 'is-invalid': errors.password }"
                    :type="showPassword ? 'text' : 'password'" placeholder="Password" />

                  <label>Mot de passe</label>

                  <!-- Toggle password -->
                  <span @click="showPassword = !showPassword"
                    style="position:absolute; right:15px; top:50%; transform:translateY(-50%); cursor:pointer; font-size:18px;">
                    {{ showPassword ? "🙈" : "👁" }}
                  </span>

                  <div v-if="errors.password" class="invalid-feedback">
                    {{ errors.password }}
                  </div>

                </div>

                <!-- API Error -->
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

            <!-- Footer -->
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
const showPassword = ref(false)

const loading = ref(false)
const status = ref(null)
const errorMessage = ref("")

const errors = ref({
  email: "",
  password: ""
})

/* Validation du formulaire */
const validateForm = () => {

  let valid = true

  errors.value.email = ""
  errors.value.password = ""

  // Email obligatoire
  if (!email.value) {
    errors.value.email = "Email obligatoire"
    valid = false
  }

  // Format email
  else if (!/\S+@\S+\.\S+/.test(email.value)) {
    errors.value.email = "Format d'email invalide"
    valid = false
  }

  // Mot de passe obligatoire
  if (!password.value) {
    errors.value.password = "Mot de passe obligatoire"
    valid = false
  }

  // Minimum caractères
  else if (password.value.length < 6) {
    errors.value.password = "Minimum 6 caractères"
    valid = false
  }

  return valid
}

/* Connexion */
const handleLogin = async () => {

  if (!validateForm()) {
    return
  }

  loading.value = true
  status.value = null
  errorMessage.value = ""

  try {

    await auth.login(email.value, password.value)

    await auth.currentUser()

    router.replace("/dashboard")

    status.value = true

  } catch (err) {

    console.error(err)

    status.value = false

    errorMessage.value =
      err.response?.data?.message || "Email ou mot de passe incorrect"

  } finally {

    loading.value = false

  }

}
</script>