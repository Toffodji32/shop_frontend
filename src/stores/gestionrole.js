import { defineStore } from "pinia";
import api from "../services/api";

export const useRoleStore = defineStore("roles", {
  state: () => ({
    roles: [], // tous les rôles de la base
    loading: false,
  }),
  actions: {
    async fetchRoles() {
      try {
        this.loading = true;
        const res = await api.get("/admin/roles"); // ton AdminRoleController
        this.roles = res.data;
      } catch (err) {
        console.error(err.response?.data || err);
      } finally {
        this.loading = false;
      }
    },
  },
});
