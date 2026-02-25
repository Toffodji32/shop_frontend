import { defineStore } from "pinia";
import api from "../services/api";

export const useRoleStore = defineStore("roles", {
  state: () => ({
    roles: [], // liste des rôles
    loading: false,
  }),

  actions: {
    // 🔹 Récupérer tous les rôles
    async fetchRoles() {
      try {
        this.loading = true;
        const res = await api.get("/admin/roles");
        this.roles = res.data;
      } catch (err) {
        console.error(err.response?.data || err);
      } finally {
        this.loading = false;
      }
    },

    // 🔹 Créer un rôle
    async createRole(name, description) {
      try {
        const res = await api.post("/admin/roles", { name, description });
        this.roles.push(res.data.role);
        return res.data;
      } catch (err) {
        console.error(err.response?.data || err);
        throw err;
      }
    },

    // 🔹 Assigner un rôle à un utilisateur
    async assignRole(userId, roleId) {
      try {
        const res = await api.post("/admin/roles/assign", {
          user_id: userId,
          role_id: roleId,
        });
        return res.data;
      } catch (err) {
        console.error(err.response?.data || err);
        throw err;
      }
    },

    // 🔹 Supprimer un rôle
    async deleteRole(roleId) {
      try {
        await api.delete(`/admin/roles/${roleId}`);
        this.roles = this.roles.filter((r) => r.id !== roleId);
      } catch (err) {
        console.error(err.response?.data || err);
        throw err;
      }
    },
  },
});
