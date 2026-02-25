import { defineStore } from "pinia";
import api from "../services/api";

export const useCategoryStore = defineStore("categories", {
  state: () => ({
    categories: [],
    loading: false,
  }),

  getters: {
    allCategories: (state) => state.categories,
  },

  actions: {
    // ========================
    // 🔹 GET CATEGORIES
    // ========================
    async fetchCategories() {
      try {
        this.loading = true;
        const res = await api.get("/categories");
        this.categories = res.data;
      } catch (err) {
        console.error(err.response?.data || err);
      } finally {
        this.loading = false;
      }
    },

    // ========================
    // 🔹 CREATE (ADMIN)
    // ========================
    async createCategory(data) {
      try {
        const res = await api.post("/categories", data);
        return res.data;
      } catch (err) {
        console.error(err.response?.data || err);
        throw err;
      }
    },

    // ========================
    // 🔹 UPDATE (ADMIN)
    // ========================
    async updateCategory(id, data) {
      try {
        const res = await api.put(`/categories/${id}`, data);

        const index = this.categories.findIndex((c) => c.id === id);
        if (index !== -1) {
          this.categories[index] = res.data.category;
        }
      } catch (err) {
        console.error(err.response?.data || err);
        throw err;
      }
    },

    // ========================
    // 🔹 DELETE (ADMIN)
    // ========================
    async deleteCategory(id) {
      try {
        await api.delete(`/categories/${id}`);
        this.categories = this.categories.filter((c) => c.id !== id);
      } catch (err) {
        console.error(err.response?.data || err);
      }
    },
  },
});
