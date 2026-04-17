import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// ─── FACTORY PATTERN ─────────────────────────────────────────────────────────
// Crea objetos de métrica de forma estandarizada
function createMetric({ id, label, value, icon, trend, trendLabel, color }) {
  return { id, label, value, icon, trend, trendLabel, color }
}

// ─── STRATEGY PATTERN ────────────────────────────────────────────────────────
// Distintos conjuntos de datos según el periodo seleccionado
const reportStrategies = {
  semanal: {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    reservas: [32, 45, 38, 52, 61, 78, 55],
    clases: ['Pilates', 'Fuerza', 'Movilidad', 'Danza', 'Adulto Mayor'],
    popularidad: [89, 76, 64, 58, 42],
  },
  mensual: {
    labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
    reservas: [210, 248, 195, 310],
    clases: ['Pilates', 'Fuerza', 'Movilidad', 'Danza', 'Adulto Mayor'],
    popularidad: [320, 280, 215, 190, 140],
  },
  anual: {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    reservas: [820, 940, 1100, 980, 1200, 1350, 1100, 1050, 1300, 1180, 1420, 1600],
    clases: ['Pilates', 'Fuerza', 'Movilidad', 'Danza', 'Adulto Mayor'],
    popularidad: [3800, 3200, 2600, 2200, 1500],
  },
}

// ─── SINGLETON STORE (Pinia garantiza una única instancia) ────────────────────
export const useDashboardStore = defineStore('dashboard', () => {
  // ── Estado base ─────────────────────────────────────────────────────────────
  const periodo = ref('semanal') // Strategy activa

  const kpis = ref({
    reservasHoy: 47,
    usuariosActivos: 312,
    clasesCompletadas: 8,
    ocupacionPromedio: 73,
  })

  const tendencias = ref({
    reservasHoy: +12,
    usuariosActivos: +5,
    clasesCompletadas: 0,
    ocupacionPromedio: +3,
  })

  const reservasRecientes = ref([
    { id: 1, nombre: 'Laura Méndez', clase: 'Pilates', hora: '08:00', estado: 'confirmada' },
    { id: 2, nombre: 'Carlos Ruiz', clase: 'Fuerza', hora: '09:30', estado: 'confirmada' },
    { id: 3, nombre: 'Ana Torres', clase: 'Movilidad', hora: '10:00', estado: 'pendiente' },
    { id: 4, nombre: 'Pedro Gómez', clase: 'Danza', hora: '11:00', estado: 'confirmada' },
    { id: 5, nombre: 'Marta Sosa', clase: 'Adulto Mayor', hora: '14:00', estado: 'cancelada' },
  ])

  // ── FACTORY: genera las 4 tarjetas de métricas ───────────────────────────────
  const metricas = computed(() => [
    createMetric({
      id: 'reservas',
      label: 'Reservas del día',
      value: kpis.value.reservasHoy,
      icon: 'calendar',
      trend: tendencias.value.reservasHoy,
      trendLabel: 'vs ayer',
      color: '#42B883',
    }),
    createMetric({
      id: 'usuarios',
      label: 'Usuarios activos',
      value: kpis.value.usuariosActivos,
      icon: 'users',
      trend: tendencias.value.usuariosActivos,
      trendLabel: 'este mes',
      color: '#35495E',
    }),
    createMetric({
      id: 'clases',
      label: 'Clases completadas',
      value: kpis.value.clasesCompletadas,
      icon: 'check-circle',
      trend: tendencias.value.clasesCompletadas,
      trendLabel: 'hoy',
      color: '#8B5CF6',
    }),
    createMetric({
      id: 'ocupacion',
      label: 'Ocupación promedio',
      value: `${kpis.value.ocupacionPromedio}%`,
      icon: 'activity',
      trend: tendencias.value.ocupacionPromedio,
      trendLabel: 'vs semana pasada',
      color: '#F59E0B',
    }),
  ])

  // ── OBSERVER: datos reactivos para las gráficas según periodo ─────────────
  const estrategia = computed(() => reportStrategies[periodo.value])

  const chartReservas = computed(() => ({
    labels: estrategia.value.labels,
    datasets: [
      {
        label: 'Reservas',
        data: estrategia.value.reservas,
        borderColor: '#42B883',
        backgroundColor: 'rgba(66, 184, 131, 0.08)',
        pointBackgroundColor: '#42B883',
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.4,
        fill: true,
        borderWidth: 2.5,
      },
    ],
  }))

  const chartClases = computed(() => ({
    labels: estrategia.value.clases,
    datasets: [
      {
        label: 'Asistentes',
        data: estrategia.value.popularidad,
        backgroundColor: [
          'rgba(66, 184, 131, 0.85)',
          'rgba(53, 73, 94, 0.85)',
          'rgba(139, 92, 246, 0.85)',
          'rgba(245, 158, 11, 0.85)',
          'rgba(16, 185, 129, 0.85)',
        ],
        borderRadius: 8,
        borderSkipped: false,
        borderWidth: 0,
      },
    ],
  }))

  // ── STRATEGY: cambiar periodo de reporte ────────────────────────────────────
  function setReportStrategy(nuevoPeriodo) {
    periodo.value = nuevoPeriodo
  }

  return {
    periodo,
    kpis,
    metricas,
    chartReservas,
    chartClases,
    reservasRecientes,
    setReportStrategy,
  }
})
