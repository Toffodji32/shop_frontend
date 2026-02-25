import { defineStore } from "pinia";
import api from "../services/api";

export const useSalesStore = defineStore("sales", {
  state: () => ({
    todaySales: null,
    loading: false,
  }),

  actions: {
    async fetchTodaySales() {
      try {
        this.loading = true;
        const res = await api.get("/admin/sales/today");
        this.todaySales = res.data;
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
  },
});
