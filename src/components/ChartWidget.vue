<template>
  <div class="chart-widget">
    <div class="chart-widget__header">
      <div>
        <h3 class="chart-widget__title">{{ title }}</h3>
        <p v-if="subtitle" class="chart-widget__subtitle">{{ subtitle }}</p>
      </div>
      <slot name="actions" />
    </div>
    <div class="chart-widget__body">
      <Line v-if="type === 'line'" :data="data" :options="mergedOptions" />
      <Bar v-else-if="type === 'bar'" :data="data" :options="mergedOptions" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line, Bar } from 'vue-chartjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
)

const props = defineProps({
  type: {
    type: String,
    default: 'line', // 'line' | 'bar'
  },
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
  data: {
    type: Object,
    required: true,
  },
  options: {
    type: Object,
    default: () => ({}),
  },
})

const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: '#35495E',
      titleColor: '#ffffff',
      bodyColor: 'rgba(255,255,255,0.8)',
      padding: 12,
      cornerRadius: 8,
      displayColors: false,
      titleFont: { family: 'Poppins', weight: '600', size: 13 },
      bodyFont: { family: 'Poppins', size: 12 },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      border: { display: false },
      ticks: {
        color: '#6B7280',
        font: { family: 'Poppins', size: 11 },
      },
    },
    y: {
      grid: {
        color: 'rgba(229, 231, 235, 0.7)',
        drawBorder: false,
      },
      border: { display: false, dash: [4, 4] },
      ticks: {
        color: '#6B7280',
        font: { family: 'Poppins', size: 11 },
        maxTicksLimit: 5,
      },
    },
  },
}

const mergedOptions = computed(() => ({
  ...baseOptions,
  ...props.options,
  plugins: {
    ...baseOptions.plugins,
    ...(props.options.plugins || {}),
  },
  scales: {
    ...baseOptions.scales,
    ...(props.options.scales || {}),
  },
}))
</script>

<style scoped>
.chart-widget {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-gray-light);
  box-shadow: var(--shadow-sm);
  padding: 1.5rem;
  transition: var(--transition);
}

.chart-widget:hover {
  box-shadow: var(--shadow-md);
}

.chart-widget__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.chart-widget__title {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--color-dark);
  margin-bottom: 0.2rem;
}

.chart-widget__subtitle {
  font-size: 0.78rem;
  color: var(--color-text-muted);
}

.chart-widget__body {
  height: 220px;
  position: relative;
}
</style>
