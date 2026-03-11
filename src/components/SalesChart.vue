<template>
    <div class="card shadow-sm">
        <div class="card-header">
            Ventes de la semaine
        </div>

        <div class="card-body">
            <Line :data="chartData" :options="chartOptions" />
        </div>
    </div>
</template>

<script setup>
import { Line } from "vue-chartjs";

import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement
} from "chart.js";

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement
);

const chartData = {
    labels: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"],
    datasets: [
        {
            label: "Ventes (€)",
            data: [120, 190, 300, 500, 200, 300, 450],
            borderColor: "#0d6efd",
            backgroundColor: "rgba(13,110,253,0.2)",
            tension: 0.4
        }
    ]
};

const chartOptions = {
    responsive: true,
    plugins: {
        legend: {
            display: true
        }
    }
};
</script>