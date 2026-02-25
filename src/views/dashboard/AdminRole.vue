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
        <button class="btn btn-sm btn-success float-end" @click="createRoleModal = true">Ajouter rôle</button>
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
                <span class="badge bg-primary">{{ formatRoles(user).join(', ') }}</span>
              </td>
              <td>
                <button class="btn btn-sm btn-warning me-2" @click="openRoleModal(user)">
                  Modifier rôles
                </button>
                <button class="btn btn-sm btn-danger" @click="deleteUser(user.id)">
                  Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ===== MODAL ROLE UTILISATEUR ===== -->
    <div class="modal fade show d-block" v-if="roleModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Modifier rôles de {{ selectedUser?.email }}</h5>
            <button class="btn-close" @click="roleModal = false"></button>
          </div>
          <div class="modal-body">
            <label>Rôles :</label>
            <div v-for="role in allRoles" :key="role.id" class="form-check">
              <input type="checkbox" class="form-check-input" :id="'role_' + role.id" :value="role.id" v-model="selectedRoles" />
              <label class="form-check-label" :for="'role_' + role.id">
                {{ role.name }}
              </label>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="roleModal = false">Annuler</button>
            <button class="btn btn-success" @click="updateRoles">Enregistrer</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show" v-if="roleModal"></div>

    <!-- ===== MODAL CREATION ROLE ===== -->
    <div class="modal fade show d-block" v-if="createRoleModal">
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
            <button class="btn btn-secondary" @click="createRoleModal = false">Annuler</button>
            <button class="btn btn-success" @click="createRole">Créer</button>
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

const userStore = useUserStore();
const roleStore = useRoleStore();

const users = ref([]);
const allRoles = ref([]);
const roleModal = ref(false);
const createRoleModal = ref(false);

const selectedUser = ref(null);
const selectedRoles = ref([]);

const newRole = ref({ name: '', description: '' });

// ========================
// FETCH USERS & ROLES
// ========================
const fetchData = async () => {
  await userStore.fetchUsers();
  users.value = userStore.users.map(u => ({
    ...u,
    roles: Array.isArray(u.roles) ? u.roles : [] // sécurité
  }));

  await roleStore.fetchRoles();
  allRoles.value = roleStore.roles;
};

onMounted(fetchData);

// ========================
// FORMAT ROLES POUR AFFICHAGE
// ========================
const formatRoles = (user) => {
  if (!user.roles) return [];
  if (Array.isArray(user.roles)) return user.roles;
  return Object.values(user.roles);
};

// ========================
// MODAL ROLE UTILISATEUR
// ========================
const openRoleModal = (user) => {
  selectedUser.value = user;
  selectedRoles.value = allRoles.value
    .filter(r => user.roles.includes(r.name))
    .map(r => r.id);
  roleModal.value = true;
};

// ========================
// ACTIONS MODAL ROLE
// ========================
const updateRoles = async () => {
  try {
    // supprimer les rôles existants avant réassignation (optionnel selon backend)
    // assigner les rôles sélectionnés
    for (const roleId of selectedRoles.value) {
      await roleStore.assignRole(selectedUser.value.id, roleId);
    }

    await fetchData();
    roleModal.value = false;
  } catch (err) {
    console.error(err);
  }
};

// ========================
// CREER NOUVEAU ROLE
// ========================
const createRole = async () => {
  if (!newRole.value.name) return alert("Nom requis");
  try {
    await roleStore.createRole(newRole.value.name, newRole.value.description);
    newRole.value = { name: '', description: '' };
    createRoleModal.value = false;
    await fetchData();
  } catch (err) {
    console.error(err);
  }
};

// ========================
// SUPPRIMER UTILISATEUR
// ========================
const deleteUser = async (userId) => {
  if (!confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;
  try {
    await userStore.deleteUser(userId);
    await fetchData();
  } catch (err) {
    console.error(err);
  }
};
</script>