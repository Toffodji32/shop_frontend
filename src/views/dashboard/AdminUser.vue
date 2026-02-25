<template>
    <div class="container-fluid px-4">
        <h1 class="mt-4">Utilisateurs</h1>

        <ol class="breadcrumb mb-4">
            <li class="breadcrumb-item">
                <router-link to="/dashboard">Dashboard</router-link>
            </li>
            <li class="breadcrumb-item active">Liste des utilisateurs</li>
        </ol>

        <div class="card mb-4">
            <div class="card-header">
                Liste des utilisateurs
                <button class="btn btn-sm btn-success float-end" @click="openAddModal">
                    Ajouter utilisateur
                </button>
            </div>

            <div class="card-body">
                <table class="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Email</th>
                            <th>Nom</th>
                            <th>Rôle</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="user in users" :key="user.id">
                            <td>{{ user.id }}</td>
                            <td>{{ user.email }}</td>
                            <td>{{ user.name }}</td>

                            <td>
                                <span class="badge" :class="Array.isArray(user.roles) &&
                                        user.roles.includes('ROLE_ADMIN')
                                        ? 'bg-danger'
                                        : 'bg-primary'
                                    ">
                                    {{ Array.isArray(user.roles) ? user.roles.join(', ') : '' }}
                                </span>
                            </td>

                            <td>
                                <button class="btn btn-sm btn-primary me-2" @click="openEditModal(user)">
                                    Modifier
                                </button>

                                <button class="btn btn-sm btn-warning me-2" @click="openRoleModal(user)">
                                    Rôle
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

        <!-- MODAL ADD / EDIT -->
        <div class="modal fade show d-block" v-if="modalVisible">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            {{ isEditMode ? "Modifier utilisateur" : "Ajouter utilisateur" }}
                        </h5>
                        <button class="btn-close" @click="closeModal"></button>
                    </div>

                    <div class="modal-body">
                        <form @submit.prevent="submitUser">
                            <div class="mb-3">
                                <label>Email</label>
                                <input v-model="form.email" class="form-control" required />
                            </div>

                            <div class="mb-3">
                                <label>Nom complet</label>
                                <input v-model="form.name" class="form-control" required />
                            </div>

                            <div class="mb-3" v-if="!isEditMode">
                                <label>Mot de passe</label>
                                <input type="password" v-model="form.password" class="form-control" required />
                            </div>

                            <div class="text-end">
                                <button class="btn btn-secondary me-2" @click="closeModal">
                                    Annuler
                                </button>
                                <button type="submit" class="btn btn-success">
                                    {{ isEditMode ? "Mettre à jour" : "Ajouter" }}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- MODAL ROLE -->
        <div class="modal fade show d-block" v-if="roleModal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Modifier rôle</h5>
                        <button class="btn-close" @click="roleModal = false"></button>
                    </div>

                    <div class="modal-body">
                        <select v-model="selectedRole" class="form-select">
                            <option v-for="role in roles" :key="role.id" :value="role.name">
                                {{ role.name }}
                            </option>
                        </select>
                    </div>

                    <div class="modal-footer">
                        <button class="btn btn-secondary" @click="roleModal = false">
                            Annuler
                        </button>
                        <button class="btn btn-success" @click="updateRole">
                            Enregistrer
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal-backdrop fade show" v-if="modalVisible || roleModal"></div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "@/stores/user";
import { useRoleStore } from "@/stores/gestionrole";

const userStore = useUserStore();
const roleStore = useRoleStore();

const users = ref([]);
const roles = ref([]);

const modalVisible = ref(false);
const roleModal = ref(false);
const isEditMode = ref(false);

const selectedUser = ref(null);
const selectedRole = ref("");

const form = ref({
    id: null,
    email: "",
    name: "",
    password: "",
});

// ========================
// FETCH USERS + ROLES
// ========================
onMounted(async () => {
    await userStore.fetchUsers();
    users.value = userStore.users;

    await roleStore.fetchRoles();
    roles.value = roleStore.roles;
});

// ========================
// MODALS
// ========================
const openAddModal = () => {
    isEditMode.value = false;
    form.value = { email: "", name: "", password: "" };
    modalVisible.value = true;
};

const openEditModal = (user) => {
    isEditMode.value = true;
    form.value = { id: user.id, email: user.email, name: user.name };
    modalVisible.value = true;
};

const openRoleModal = (user) => {
    selectedUser.value = user;

    if (Array.isArray(user.roles) && user.roles.length > 0) {
        selectedRole.value = user.roles[0];
    } else {
        selectedRole.value = "";
    }

    roleModal.value = true;
};

const closeModal = () => (modalVisible.value = false);

// ========================
// CRUD
// ========================
const submitUser = async () => {
    if (isEditMode.value) {
        await userStore.updateUser(form.value.id, form.value);
    } else {
        await userStore.createUser(form.value);
    }

    await userStore.fetchUsers();
    users.value = userStore.users;

    closeModal();
};

const deleteUser = async (id) => {
    if (!confirm("Supprimer cet utilisateur ?")) return;

    await userStore.deleteUser(id);
    users.value = users.value.filter((u) => u.id !== id);
};

const updateRole = async () => {
    await userStore.updateRole(selectedUser.value.id, [selectedRole.value]);

    await userStore.fetchUsers();
    users.value = userStore.users;

    roleModal.value = false;
};
</script>