<template>
  <div class="dashboard-main">
      <!-- Top bar -->
      <header class="topbar">
        <div class="topbar__left">
          <h1 class="topbar__title">Dashboard</h1>
          <p class="topbar__date">{{ fechaHoy }}</p>
        </div>
        <div class="topbar__right">
          <!-- Period switcher - Strategy Pattern -->
          <div class="period-switcher">
            <button
              v-for="p in periodos"
              :key="p.value"
              class="period-btn"
              :class="{ active: store.periodo === p.value }"
              @click="store.setReportStrategy(p.value)"
            >
              {{ p.label }}
            </button>
          </div>
          <div class="topbar__avatar">AV</div>
        </div>
      </header>

      <div class="dashboard-content">
        <!-- Metric cards - Factory Pattern -->
        <section class="metrics-grid">
          <MetricCard
            v-for="metric in store.metricas"
            :key="metric.id"
            :metric="metric"
          />
        </section>

        <!-- Charts -->
        <section class="charts-grid">
          <ChartWidget
            type="line"
            title="Reservas por período"
            :subtitle="`Vista ${periodoLabel}`"
            :data="store.chartReservas"
          >
            <template #actions>
              <div class="chart-legend">
                <span class="legend-dot" style="background: #42B883"></span>
                <span>Reservas</span>
              </div>
            </template>
          </ChartWidget>

          <ChartWidget
            type="bar"
            title="Clases más populares"
            :subtitle="`Asistentes ${periodoLabel}`"
            :data="store.chartClases"
          >
            <template #actions>
              <div class="chart-legend">
                <span class="legend-dot" style="background: #35495E"></span>
                <span>Asistentes</span>
              </div>
            </template>
          </ChartWidget>
        </section>

        <!-- Recent reservations table -->
        <section class="reservas-section">
          <div class="reservas-section__header">
            <div>
              <h2 class="section-heading">Reservas recientes</h2>
              <p class="section-subheading">Últimas reservas registradas hoy</p>
            </div>
            <button class="btn-ver-todas">Ver todas</button>
          </div>

          <div class="table-wrapper">
            <table class="reservas-table">
              <thead>
                <tr>
                  <th>Miembro</th>
                  <th>Clase</th>
                  <th>Hora</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="r in store.reservasRecientes" :key="r.id">
                  <td>
                    <div class="member-cell">
                      <div class="member-avatar">{{ r.nombre.charAt(0) }}</div>
                      {{ r.nombre }}
                    </div>
                  </td>
                  <td>{{ r.clase }}</td>
                  <td>{{ r.hora }}</td>
                  <td>
                    <span class="estado-badge" :class="`estado-badge--${r.estado}`">
                      {{ r.estado }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useDashboardStore } from '@/stores/dashboardStore'
import MetricCard from '@/components/MetricCard.vue'
import ChartWidget from '@/components/ChartWidget.vue'

const store = useDashboardStore()

const periodos = [
  { value: 'semanal', label: 'Semana' },
  { value: 'mensual', label: 'Mes' },
  { value: 'anual', label: 'Año' },
]

const periodoLabel = computed(() =>
  periodos.find((p) => p.value === store.periodo)?.label.toLowerCase() ?? '',
)

const fechaHoy = computed(() =>
  new Date().toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }),
)
</script>

<style scoped>
/* ── Main ────────────────────────────────────────────────────────────────── */
.dashboard-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* ── Topbar ──────────────────────────────────────────────────────────────── */
.topbar {
  background: var(--color-white);
  border-bottom: 1px solid var(--color-gray-light);
  padding: 0 2rem;
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 40;
}

.topbar__title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-dark);
  line-height: 1;
  margin-bottom: 2px;
}

.topbar__date {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  text-transform: capitalize;
}

.topbar__right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.period-switcher {
  display: flex;
  gap: 2px;
  background: var(--color-bg);
  border: 1px solid var(--color-gray-light);
  padding: 3px;
  border-radius: var(--radius-sm);
}

.period-btn {
  padding: 5px 14px;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--color-text-muted);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: var(--transition);
  font-family: inherit;
}

.period-btn.active {
  background: var(--color-white);
  color: var(--color-dark);
  box-shadow: var(--shadow-sm);
  font-weight: 600;
}

.topbar__avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #35495E, #42B883);
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── Content ─────────────────────────────────────────────────────────────── */
.dashboard-content {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* ── Metrics grid ────────────────────────────────────────────────────────── */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
}

/* ── Charts grid ─────────────────────────────────────────────────────────── */
.charts-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 1.25rem;
}

.chart-legend {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.legend-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

/* ── Reservas table ──────────────────────────────────────────────────────── */
.reservas-section {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-gray-light);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.reservas-section__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--color-gray-light);
}

.section-heading {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--color-dark);
  margin-bottom: 2px;
}

.section-subheading {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.btn-ver-todas {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--color-primary);
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: inherit;
  transition: var(--transition);
}

.btn-ver-todas:hover {
  color: var(--color-primary-dark);
}

.table-wrapper {
  overflow-x: auto;
}

.reservas-table {
  width: 100%;
  border-collapse: collapse;
}

.reservas-table th {
  padding: 0.75rem 1.5rem;
  text-align: left;
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.07em;
  background: var(--color-bg);
}

.reservas-table td {
  padding: 0.875rem 1.5rem;
  font-size: 0.875rem;
  color: var(--color-text);
  border-top: 1px solid var(--color-gray-light);
}

.reservas-table tr:hover td {
  background: var(--color-bg);
}

.member-cell {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: 500;
}

.member-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: linear-gradient(135deg, #42B883, #35495E);
  color: white;
  font-size: 0.72rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.estado-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 100px;
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: capitalize;
}

.estado-badge--confirmada {
  background: rgba(22, 163, 74, 0.1);
  color: #16a34a;
}

.estado-badge--pendiente {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
}

.estado-badge--cancelada {
  background: rgba(220, 38, 38, 0.1);
  color: #dc2626;
}

/* ── Responsive ──────────────────────────────────────────────────────────── */
@media (max-width: 1200px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 900px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .sidebar {
    display: none;
  }

  .dashboard-main {
    margin-left: 0;
  }

  .metrics-grid {
    grid-template-columns: 1fr 1fr;
  }

  .dashboard-content {
    padding: 1.25rem;
  }
}

@media (max-width: 480px) {
  .metrics-grid {
    grid-template-columns: 1fr;
  }
}
</style>
