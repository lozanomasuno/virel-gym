import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// ─── Strategy Pattern ─────────────────────────────────────────────────────────
// Cada estrategia define datos para un período de tiempo distinto
const reportStrategies = {
  semanal: {
    label: 'Esta semana',
    ingresos: 850000,
    ingresosAnterior: 780000,
    retencion: 87,
    retencionAnterior: 84,
    nuevos: 3,
    nuevosAnterior: 2,
    clases: 28,
    clasesAnterior: 25,
    revenueLabels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    revenueData: [95000, 120000, 85000, 145000, 135000, 180000, 90000],
    asistenciaData: [18, 22, 15, 28, 25, 32, 14],
  },
  mensual: {
    label: 'Este mes',
    ingresos: 4250000,
    ingresosAnterior: 3900000,
    retencion: 91,
    retencionAnterior: 88,
    nuevos: 12,
    nuevosAnterior: 9,
    clases: 124,
    clasesAnterior: 118,
    revenueLabels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
    revenueData: [1050000, 1100000, 980000, 1120000],
    asistenciaData: [85, 92, 78, 95],
  },
  anual: {
    label: 'Este año',
    ingresos: 48500000,
    ingresosAnterior: 41200000,
    retencion: 89,
    retencionAnterior: 85,
    nuevos: 87,
    nuevosAnterior: 72,
    clases: 1248,
    clasesAnterior: 1150,
    revenueLabels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    revenueData: [3800000, 3600000, 4100000, 4250000, 4400000, 3900000, 4200000, 4600000, 4300000, 4500000, 4800000, 6050000],
    asistenciaData: [340, 310, 380, 390, 420, 350, 400, 450, 410, 430, 460, 510],
  },
}

// ─── Factory Pattern ──────────────────────────────────────────────────────────
// createKPI ensapsula la estructura de cada tarjeta de indicador
function createKPI(id, label, icon, color, getValue, getAnterior, format) {
  return { id, label, icon, color, getValue, getAnterior, format }
}

export const useAnalyticsStore = defineStore('analytics', () => {
  // ── Singleton: estado global único ──────────────────────────────────────────
  const periodo = ref('mensual')

  // ── Observer Pattern: computeds reactivos al período ────────────────────────
  const estrategia = computed(() => reportStrategies[periodo.value])

  // KPIs calculados con la estrategia activa
  const kpis = computed(() => [
    createKPI('ingresos', 'Ingresos del período', 'dollar', '#42B883',
      () => estrategia.value.ingresos,
      () => estrategia.value.ingresosAnterior,
      'currency'),
    createKPI('retencion', 'Tasa de retención', 'percent', '#8B5CF6',
      () => estrategia.value.retencion,
      () => estrategia.value.retencionAnterior,
      'percent'),
    createKPI('nuevos', 'Nuevos miembros', 'users', '#F59E0B',
      () => estrategia.value.nuevos,
      () => estrategia.value.nuevosAnterior,
      'number'),
    createKPI('clases', 'Clases completadas', 'activity', '#06B6D4',
      () => estrategia.value.clases,
      () => estrategia.value.clasesAnterior,
      'number'),
  ])

  // Chart: tendencia de ingresos
  const chartIngresos = computed(() => ({
    labels: estrategia.value.revenueLabels,
    datasets: [
      {
        label: 'Ingresos',
        data: estrategia.value.revenueData,
        borderColor: '#42B883',
        backgroundColor: 'rgba(66, 184, 131, 0.08)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#42B883',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        borderWidth: 2.5,
      },
    ],
  }))

  // Chart: tendencia de asistencia
  const chartAsistencia = computed(() => ({
    labels: estrategia.value.revenueLabels,
    datasets: [
      {
        label: 'Asistencias',
        data: estrategia.value.asistenciaData,
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.08)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#8B5CF6',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        borderWidth: 2.5,
      },
    ],
  }))

  // Chart: distribución de planes (donut) - datos estáticos
  const distribucionPlanes = {
    labels: ['Essential', 'Balance', 'Premium'],
    datasets: [
      {
        data: [45, 35, 20],
        backgroundColor: ['#D1D5DB', '#42B883', '#8B5CF6'],
        hoverBackgroundColor: ['#9CA3AF', '#34a374', '#7C3AED'],
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  }

  // Chart: clases más populares (bar horizontal)
  const topClases = {
    labels: ['Yoga Flow', 'HIIT Pro', 'Spinning', 'Pilates Core', 'Boxing'],
    datasets: [
      {
        label: 'Asistencias',
        data: [89, 76, 65, 58, 42],
        backgroundColor: [
          'rgba(66, 184, 131, 0.9)',
          'rgba(66, 184, 131, 0.75)',
          'rgba(66, 184, 131, 0.6)',
          'rgba(66, 184, 131, 0.45)',
          'rgba(66, 184, 131, 0.3)',
        ],
        borderRadius: 6,
        borderWidth: 0,
      },
    ],
  }

  // Tabla desglose por membresía
  const membresiaBreakdown = [
    { plan: 'Premium', color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)', activos: 18, ingresos: 3240000, retencion: 95, crecimiento: 8 },
    { plan: 'Balance', color: '#42B883', bg: 'rgba(66,184,131,0.1)', activos: 31, ingresos: 2790000, retencion: 91, crecimiento: 12 },
    { plan: 'Essential', color: '#6B7280', bg: 'rgba(107,114,128,0.1)', activos: 41, ingresos: 2050000, retencion: 82, crecimiento: 5 },
  ]

  // Últimas transacciones
  const transacciones = [
    { id: 'T-0041', nombre: 'Ana Torres', plan: 'Premium', monto: 180000, fecha: '2026-04-16', tipo: 'renovacion' },
    { id: 'T-0040', nombre: 'Carlos Mejía', plan: 'Balance', monto: 90000, fecha: '2026-04-15', tipo: 'nuevo' },
    { id: 'T-0039', nombre: 'Laura Gómez', plan: 'Essential', monto: 50000, fecha: '2026-04-14', tipo: 'renovacion' },
    { id: 'T-0038', nombre: 'Diego Ruiz', plan: 'Premium', monto: 180000, fecha: '2026-04-13', tipo: 'nuevo' },
    { id: 'T-0037', nombre: 'María Castro', plan: 'Balance', monto: 90000, fecha: '2026-04-12', tipo: 'renovacion' },
  ]

  // Action: cambiar período (Strategy switcher)
  function setPeriodo(p) {
    periodo.value = p
  }

  return {
    periodo,
    estrategia,
    kpis,
    chartIngresos,
    chartAsistencia,
    distribucionPlanes,
    topClases,
    membresiaBreakdown,
    transacciones,
    setPeriodo,
  }
})
