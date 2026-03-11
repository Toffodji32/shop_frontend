<template>
    <div class="card shadow-sm mb-4">
        <div class="card-header fw-bold">
            Mes dépenses
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
    labels: ["Jan", "Fev", "Mar", "Avr", "Mai", "Jun"],

    datasets: [
        {
            label: "Dépenses €",
            data: [50, 120, 90, 200, 160, 240],
            borderColor: "#0d6efd",
            backgroundColor: "rgba(13,110,253,0.2)",
            tension: 0.4
        }
    ]

};

const chartOptions = {
    responsive: true
};

</script>