import { defineStore } from "pinia";
import api from "../services/api";

export const useUserStore = defineStore("users", {
  state: () => ({
    users: [],
    loading: false,
  }),

  getters: {
    allUsers: (state) => state.users,
  },

  actions: {
    // ========================
    // 🔹 GET USERS (ADMIN)
    // ========================
    async fetchUsers() {
      try {
        this.loading = true;
        const res = await api.get("/admin/users");
        this.users = res.data;
      } catch (err) {
        console.error(err.response?.data || err);
      } finally {
        this.loading = false;
      }
    },

    // ========================
    // 🔹 CREATE USER (ADMIN)
    // ========================
    async createUser(data) {
      try {
        const res = await api.post("/admin/users", data);
        return res.data;
      } catch (err) {
        console.error(err.response?.data || err);
        throw err;
      }
    },

    // ========================
    // 🔹 UPDATE USER (ADMIN)
    // ========================
    async updateUser(id, data) {
      try {
        const res = await api.put(`/admin/users/${id}`, data);

        const index = this.users.findIndex((u) => u.id === id);
        if (index !== -1) {
          this.users[index] = {
            ...this.users[index],
            ...data,
          };
        }

        return res.data;
      } catch (err) {
        console.error(err.response?.data || err);
        throw err;
      }
    },

    // ========================
    // 🔹 UPDATE ROLE (ADMIN)
    // ========================
    async updateRole(id, roles) {
      try {
        const res = await api.put(`/admin/users/${id}/role`, { roles });

        const user = this.users.find((u) => u.id === id);
        if (user) {
          user.roles = roles;
        }

        return res.data;
      } catch (err) {
        console.error(err.response?.data || err);
        throw err;
      }
    },

    // ========================
    // 🔹 DELETE USER (ADMIN)
    // ========================
    async deleteUser(id) {
      try {
        await api.delete(`/admin/users/${id}`);
        this.users = this.users.filter((u) => u.id !== id);
      } catch (err) {
        console.error(err.response?.data || err);
      }
    },
  },
});
