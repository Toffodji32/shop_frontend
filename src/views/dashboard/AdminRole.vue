<template>
  <div class="container-fluid px-4">

    <h1 class="mt-4">Gestion des rôles et utilisateurs</h1>
    <ol class="breadcrumb mb-4">
      <li class="breadcrumb-item">
        <router-link to="/dashboard">Dashboard</router-link>
      </li>
      <li class="breadcrumb-item active">Gestion des rôles et utilisateurs</li>
    </ol>

    <!-- ===== LISTE UTILISATEURS ===== -->
    <div class="card mb-4">
      <div class="card-header">
        <i class="fas fa-table me-1"></i>
        Liste des Categories
        <button class="btn btn-sm btn-success float-end" @click="createRoleModal = true">
          Ajouter rôle
        </button>
      </div>

      <div class="card-body">
        <table class="table table-bordered table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Nom</th>
              <th>Rôles</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.id }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.name }}</td>

              <td>
                <span class="badge bg-primary">
                  {{ formatRoles(user).join(', ') }}
                </span>
              </td>

              <td>
                <button class="btn btn-sm btn-warning me-2" :disabled="loading" @click="openRoleModal(user)">
                  Modifier rôles
                </button>

                <button class="btn btn-sm btn-danger" :disabled="loading" @click="deleteUser(user.id)">
                  <span v-if="loading">Chargement...</span>
                  <span v-else>Supprimer</span>
                </button>
              </td>
            </tr>
          </tbody>

        </table>
      </div>
    </div>

    <!-- ===== MODAL ROLE UTILISATEUR ===== -->
    <div class="modal fade show d-block" v-if="roleModal" @click.self="roleModal = false">
      <div class="modal-dialog">
        <div class="modal-content">

          <div class="modal-header">
            <h5 class="modal-title">
              Modifier rôles de {{ selectedUser?.email }}
            </h5>
            <button class="btn-close" @click="roleModal = false"></button>
          </div>

          <div class="modal-body">
            <label>Rôles :</label>

            <div v-for="role in allRoles" :key="role.id" class="form-check">
              <input type="checkbox" class="form-check-input" :id="'role_' + role.id" :value="role.id"
                v-model="selectedRoles" />

              <label class="form-check-label" :for="'role_' + role.id">
                {{ role.name }}
              </label>
            </div>
          </div>

          <div class="modal-footer">

            <button type="button" class="btn btn-secondary" :disabled="loading" @click="roleModal = false">
              Annuler
            </button>

            <button class="btn btn-success" :disabled="loading" @click="updateRoles">
              <span v-if="loading">Chargement...</span>
              <span v-else>Enregistrer</span>
            </button>

          </div>

        </div>
      </div>
    </div>

    <div class="modal-backdrop fade show" v-if="roleModal"></div>

    <!-- ===== MODAL CREATION ROLE ===== -->
    <div class="modal fade show d-block" v-if="createRoleModal" @click="createRoleModal = false">
      <div class="modal-dialog">
        <div class="modal-content">

          <div class="modal-header">
            <h5 class="modal-title">Ajouter un nouveau rôle</h5>
            <button class="btn-close" @click="createRoleModal = false"></button>
          </div>

          <div class="modal-body">

            <div class="mb-3">
              <label class="form-label">Nom du rôle</label>
              <input type="text" class="form-control" v-model="newRole.name" />
            </div>

            <div class="mb-3">
              <label class="form-label">Description</label>
              <input type="text" class="form-control" v-model="newRole.description" />
            </div>

          </div>

          <div class="modal-footer">

            <button type="button" class="btn btn-secondary" :disabled="loading" @click="createRoleModal = false">
              Annuler
            </button>

            <button class="btn btn-success" :disabled="loading" @click="createRole">
              <span v-if="loading">Chargement...</span>
              <span v-else>Créer</span>
            </button>

          </div>

        </div>
      </div>
    </div>

    <div class="modal-backdrop fade show" v-if="createRoleModal"></div>

  </div>
</template>


<script setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "@/stores/user";
import { useRoleStore } from "@/stores/roles";
import Swal from "sweetalert2";
import { ElNotification } from "element-plus";

const userStore = useUserStore();
const roleStore = useRoleStore();

const users = ref([]);
const allRoles = ref([]);
const roleModal = ref(false);
const createRoleModal = ref(false);
const loading = ref(false);

const selectedUser = ref(null);
const selectedRoles = ref([]);

const newRole = ref({ name: "", description: "" });


// ========================
const fetchData = async () => {

  await userStore.fetchUsers();

  users.value = userStore.users.map((u) => ({
    ...u,
    roles: Array.isArray(u.roles) ? u.roles : [],
  }));

  await roleStore.fetchRoles();
  allRoles.value = roleStore.roles;
};

onMounted(fetchData);


// ========================
const formatRoles = (user) => {
  if (!user.roles) return [];
  if (Array.isArray(user.roles)) return user.roles;
  return Object.values(user.roles);
};


// ========================
const openRoleModal = (user) => {

  selectedUser.value = user;

  selectedRoles.value = allRoles.value
    .filter((r) => user.roles.includes(r.name))
    .map((r) => r.id);

  roleModal.value = true;
};


// ========================
const updateRoles = async () => {

  const result = await Swal.fire({
    title: "Confirmer la modification ?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Oui, modifier",
    cancelButtonText: "Annuler",
  });

  if (!result.isConfirmed) return;

  try {

    loading.value = true;

    await roleStore.updateUserRoles(
      selectedUser.value.id,
      selectedRoles.value
    );

    await fetchData();

    roleModal.value = false;

    ElNotification.success({
      title: "Succès",
      message: "Rôles mis à jour avec succès",
      position: "top-right",
    });

  } catch (err) {

    ElNotification.error({
      title: "Erreur",
      message: "Erreur lors de la mise à jour",
      position: "top-right",
    });

    console.error(err);
  }

  loading.value = false;
};


// ========================
const createRole = async () => {

  if (!newRole.value.name) {
    ElNotification.warning({
      title: "Attention",
      message: "Nom requis",
      position: "top-right",
    });
    return;
  }

  const result = await Swal.fire({
    title: "Créer ce rôle ?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Oui, créer",
    cancelButtonText: "Annuler",
  });

  if (!result.isConfirmed) return;

  try {

    loading.value = true;

    await roleStore.createRole(
      newRole.value.name,
      newRole.value.description
    );

    newRole.value = { name: "", description: "" };

    createRoleModal.value = false;

    await fetchData();

    ElNotification.success({
      title: "Succès",
      message: "Rôle créé avec succès",
      position: "top-right",
    });

  } catch (err) {

    console.error(err);

  }

  loading.value = false;
};


// ========================
const deleteUser = async (userId) => {

  const result = await Swal.fire({
    title: "Supprimer cet utilisateur ?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Oui, supprimer",
    cancelButtonText: "Annuler",
  });

  if (!result.isConfirmed) return;

  try {

    loading.value = true;

    await userStore.deleteUser(userId);

    await fetchData();

    ElNotification.success({
      title: "Succès",
      message: "Utilisateur supprimé",
      position: "top-right",
    });

  } catch (err) {

    console.error(err);

  }

  loading.value = false;
};
</script>

<style scoped>
/* overlay sombre */
.modal-backdrop.fade.show {
  background: rgba(0, 0, 0, 0.55) !important;
  z-index: 1040;
}

/* centrage modal */
.modal.fade.show.d-block {
  position: fixed;
  inset: 0;
  display: flex !important;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 1050;
}

/* taille modal */
.modal-dialog {
  max-width: 600px;
  width: 100%;
  margin: 0;
}

/* design modal */
.modal-content {
  border-radius: 12px;
  border: none;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
  padding: 5px;
}

/* header */
.modal-header {
  border-bottom: 1px solid #eee;
}

.modal-title {
  font-weight: 600;
}

/* body */
.modal-body {
  padding-top: 15px;
}

/* footer */
.modal-footer {
  border-top: 1px solid #eee;
}

/* animation */
.modal-content {
  animation: modalAnimation 0.25s ease;
}

@keyframes modalAnimation {
  from {
    transform: translateY(-15px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* responsive */
@media (max-width:768px) {
  .modal-dialog {
    max-width: 95%;
  }
}
</style>