<template>
  <div class="dashboard-main">
      <!-- Topbar -->
      <header class="topbar">
        <div class="topbar__left">
          <h1 class="topbar__title">Analítica</h1>
          <p class="topbar__subtitle">{{ store.estrategia.label }} · Actualizado hoy</p>
        </div>
        <div class="topbar__right">
          <!-- Period switcher — Strategy Pattern -->
          <div class="period-switcher">
            <button
              v-for="p in periodos"
              :key="p.value"
              class="period-btn"
              :class="{ active: store.periodo === p.value }"
              @click="store.setPeriodo(p.value)"
            >
              {{ p.label }}
            </button>
          </div>
          <button class="export-btn" @click="exportCSV">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Exportar
          </button>
          <div class="topbar__avatar">AV</div>
        </div>
      </header>

      <div class="analytics-content">

        <!-- ─── KPIs ──────────────────────────────────────────────────────── -->
        <section class="kpi-grid">
          <div
            v-for="kpi in store.kpis"
            :key="kpi.id"
            class="kpi-card"
          >
            <div class="kpi-card__top">
              <div class="kpi-icon" :style="{ color: kpi.color, background: kpi.color + '15' }">
                <!-- Dollar -->
                <svg v-if="kpi.icon === 'dollar'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                <!-- Percent -->
                <svg v-else-if="kpi.icon === 'percent'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>
                <!-- Users -->
                <svg v-else-if="kpi.icon === 'users'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <!-- Activity -->
                <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              </div>
              <div class="kpi-trend" :class="trendDir(kpi) === 'up' ? 'trend--up' : 'trend--down'">
                <svg v-if="trendDir(kpi) === 'up'" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
                <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                {{ trendPct(kpi) }}%
              </div>
            </div>
            <p class="kpi-value">{{ formatValue(kpi) }}</p>
            <p class="kpi-label">{{ kpi.label }}</p>
            <div class="kpi-bar">
              <div class="kpi-bar__fill" :style="{ background: kpi.color, width: kpiBarWidth(kpi) + '%' }"></div>
            </div>
          </div>
        </section>

        <!-- ─── Tendencias ─────────────────────────────────────────────────── -->
        <section class="charts-row">
          <div class="chart-primary">
            <ChartWidget
              title="Tendencia de ingresos"
              :subtitle="store.estrategia.label"
              type="line"
              :data="store.chartIngresos"
              :options="ingresosOptions"
            />
          </div>
          <div class="chart-secondary">
            <ChartWidget
              title="Asistencia"
              :subtitle="store.estrategia.label"
              type="line"
              :data="store.chartAsistencia"
              :options="asistenciaOptions"
            />
          </div>
        </section>

        <!-- ─── Distribución + Clases ──────────────────────────────────────── -->
        <section class="bottom-row">
          <!-- Donut: distribución de planes -->
          <div class="donut-card chart-widget">
            <div class="chart-widget__header">
              <div>
                <h3 class="chart-widget__title">Distribución de planes</h3>
                <p class="chart-widget__subtitle">90 miembros activos</p>
              </div>
            </div>
            <div class="donut-body">
              <div class="donut-wrapper">
                <Doughnut :data="store.distribucionPlanes" :options="donutOptions" />
                <div class="donut-center">
                  <span class="donut-total">90</span>
                  <span class="donut-total-label">miembros</span>
                </div>
              </div>
              <ul class="donut-legend">
                <li v-for="(plan, i) in planLegend" :key="plan.name" class="donut-legend__item">
                  <span class="legend-dot" :style="{ background: plan.color }"></span>
                  <span class="legend-name">{{ plan.name }}</span>
                  <span class="legend-pct">{{ plan.pct }}%</span>
                  <div class="legend-bar">
                    <div :style="{ width: plan.pct + '%', background: plan.color }"></div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <!-- Bar: top clases -->
          <div class="topclases-card chart-widget">
            <div class="chart-widget__header">
              <div>
                <h3 class="chart-widget__title">Clases más populares</h3>
                <p class="chart-widget__subtitle">Por asistencias este período</p>
              </div>
            </div>
            <div class="chart-widget__body">
              <Bar :data="store.topClases" :options="clasesOptions" />
            </div>
          </div>
        </section>

        <!-- ─── Desglose + Transacciones ──────────────────────────────────── -->
        <section class="table-row">
          <!-- Membresías breakdown -->
          <div class="breakdown-card">
            <div class="breakdown-header">
              <h3 class="breakdown-title">Desglose por membresía</h3>
            </div>
            <table class="breakdown-table">
              <thead>
                <tr>
                  <th>Plan</th>
                  <th>Activos</th>
                  <th>Ingresos</th>
                  <th>Retención</th>
                  <th>Crecimiento</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in store.membresiaBreakdown" :key="row.plan">
                  <td>
                    <span class="plan-chip" :style="{ color: row.color, background: row.bg }">{{ row.plan }}</span>
                  </td>
                  <td class="cell-num">{{ row.activos }}</td>
                  <td class="cell-num">{{ formatCurrency(row.ingresos) }}</td>
                  <td>
                    <div class="retention-cell">
                      <div class="retention-bar">
                        <div :style="{ width: row.retencion + '%', background: row.color }"></div>
                      </div>
                      <span>{{ row.retencion }}%</span>
                    </div>
                  </td>
                  <td>
                    <span class="growth-badge" :class="row.crecimiento >= 0 ? 'growth--pos' : 'growth--neg'">
                      {{ row.crecimiento >= 0 ? '+' : '' }}{{ row.crecimiento }}%
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Últimas transacciones -->
          <div class="tx-card">
            <div class="breakdown-header">
              <h3 class="breakdown-title">Últimas transacciones</h3>
            </div>
            <div class="tx-list">
              <div v-for="tx in store.transacciones" :key="tx.id" class="tx-item">
                <div class="tx-avatar">{{ tx.nombre.charAt(0) }}</div>
                <div class="tx-info">
                  <p class="tx-name">{{ tx.nombre }}</p>
                  <p class="tx-meta">{{ tx.id }} · {{ tx.plan }}</p>
                </div>
                <div class="tx-right">
                  <p class="tx-amount">+{{ formatCurrency(tx.monto) }}</p>
                  <span class="tx-tipo" :class="`tx-tipo--${tx.tipo}`">{{ tx.tipo }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div><!-- /analytics-content -->
  </div>
</template>

<script setup>
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Doughnut, Bar } from 'vue-chartjs'

import { useAnalyticsStore } from '@/stores/analyticsStore'
import ChartWidget from '@/components/ChartWidget.vue'

// Register Chart.js components needed for inline charts
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const store = useAnalyticsStore()

const periodos = [
  { value: 'semanal', label: 'Semana' },
  { value: 'mensual', label: 'Mes' },
  { value: 'anual', label: 'Año' },
]

// ─── Formatters ───────────────────────────────────────────────────────────────
function formatCurrency(v) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`
  return `$${v}`
}

function formatValue(kpi) {
  const v = kpi.getValue()
  if (kpi.format === 'currency') return formatCurrency(v)
  if (kpi.format === 'percent') return `${v}%`
  return v.toLocaleString('es-CO')
}

function trendPct(kpi) {
  const cur = kpi.getValue()
  const prev = kpi.getAnterior()
  if (prev === 0) return '0'
  return Math.abs(((cur - prev) / prev) * 100).toFixed(1)
}

function trendDir(kpi) {
  return kpi.getValue() >= kpi.getAnterior() ? 'up' : 'down'
}

function kpiBarWidth(kpi) {
  const cur = kpi.getValue()
  const prev = kpi.getAnterior()
  const max = Math.max(cur, prev)
  return max > 0 ? Math.round((cur / max) * 100) : 50
}

// ─── Chart options ────────────────────────────────────────────────────────────
const ingresosOptions = {
  plugins: {
    tooltip: {
      callbacks: {
        label: (ctx) => ` ${formatCurrency(ctx.raw)}`,
      },
    },
  },
}

const asistenciaOptions = {
  plugins: {
    tooltip: {
      callbacks: {
        label: (ctx) => ` ${ctx.raw} asistencias`,
      },
    },
  },
}

const donutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '72%',
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#35495E',
      titleColor: '#fff',
      bodyColor: 'rgba(255,255,255,0.8)',
      padding: 12,
      cornerRadius: 8,
      displayColors: true,
      titleFont: { family: 'Poppins', size: 12 },
      bodyFont: { family: 'Poppins', size: 12 },
    },
  },
}

const clasesOptions = {
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#35495E',
      titleColor: '#fff',
      bodyColor: 'rgba(255,255,255,0.8)',
      padding: 12,
      cornerRadius: 8,
      displayColors: false,
      titleFont: { family: 'Poppins', size: 12 },
      bodyFont: { family: 'Poppins', size: 12 },
    },
  },
  scales: {
    x: {
      grid: { color: 'rgba(229,231,235,0.7)', drawBorder: false },
      border: { display: false },
      ticks: { color: '#6B7280', font: { family: 'Poppins', size: 11 } },
    },
    y: {
      grid: { display: false },
      border: { display: false },
      ticks: { color: '#1F2937', font: { family: 'Poppins', size: 12, weight: '500' } },
    },
  },
}

// ─── Plan legend data ─────────────────────────────────────────────────────────
const planLegend = [
  { name: 'Essential', color: '#D1D5DB', pct: 45 },
  { name: 'Balance', color: '#42B883', pct: 35 },
  { name: 'Premium', color: '#8B5CF6', pct: 20 },
]

// ─── Export ───────────────────────────────────────────────────────────────────
function exportCSV() {
  const rows = [
    ['Plan', 'Activos', 'Ingresos', 'Retención', 'Crecimiento'],
    ...store.membresiaBreakdown.map((r) => [r.plan, r.activos, r.ingresos, `${r.retencion}%`, `${r.crecimiento}%`]),
  ]
  const csv = rows.map((r) => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `virel-analitica-${store.periodo}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
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

.topbar__subtitle {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.topbar__right {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

/* Period switcher */
.period-switcher {
  display: flex;
  gap: 3px;
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
  font-weight: 600;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

/* Export */
.export-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 15px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-gray-light);
  background: var(--color-white);
  color: var(--color-text-muted);
  font-size: 0.82rem;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: var(--transition);
}

.export-btn:hover {
  background: var(--color-bg);
  color: var(--color-dark);
  border-color: #42B883;
}

.topbar__avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #35495E;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── Analytics content ───────────────────────────────────────────────────── */
.analytics-content {
  padding: 1.75rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* ── KPI Grid ────────────────────────────────────────────────────────────── */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
}

.kpi-card {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-gray-light);
  padding: 1.375rem;
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
  overflow: hidden;
}

.kpi-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.kpi-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.kpi-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

.kpi-trend {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 100px;
}

.trend--up {
  color: #14532d;
  background: #dcfce7;
}

.trend--down {
  color: #7f1d1d;
  background: #fee2e2;
}

.kpi-value {
  font-size: 1.625rem;
  font-weight: 800;
  color: var(--color-dark);
  line-height: 1;
  margin-bottom: 4px;
  letter-spacing: -0.02em;
}

.kpi-label {
  font-size: 0.78rem;
  color: var(--color-text-muted);
  font-weight: 500;
  margin-bottom: 1rem;
}

.kpi-bar {
  height: 3px;
  background: var(--color-gray-light);
  border-radius: 100px;
  overflow: hidden;
}

.kpi-bar__fill {
  height: 100%;
  border-radius: 100px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ── Charts row ──────────────────────────────────────────────────────────── */
.charts-row {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 1.25rem;
}

/* ChartWidget from the shared component */
.chart-primary :deep(.chart-widget),
.chart-secondary :deep(.chart-widget) {
  height: 100%;
}

/* ── Bottom row ──────────────────────────────────────────────────────────── */
.bottom-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

/* Donut card */
.donut-card {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-gray-light);
  box-shadow: var(--shadow-sm);
}

.chart-widget {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-gray-light);
  box-shadow: var(--shadow-sm);
  padding: 1.375rem;
}

.chart-widget__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.chart-widget__title {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--color-dark);
  margin-bottom: 2px;
}

.chart-widget__subtitle {
  font-size: 0.72rem;
  color: var(--color-text-muted);
}

.donut-body {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.donut-wrapper {
  position: relative;
  width: 160px;
  height: 160px;
  flex-shrink: 0;
}

.donut-center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.donut-total {
  font-size: 1.625rem;
  font-weight: 800;
  color: var(--color-dark);
  line-height: 1;
}

.donut-total-label {
  font-size: 0.7rem;
  color: var(--color-text-muted);
  margin-top: 2px;
}

.donut-legend {
  list-style: none;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.donut-legend__item {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-name {
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--color-dark);
  flex: 1;
}

.legend-pct {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--color-dark);
}

.legend-bar {
  width: 100%;
  height: 4px;
  background: var(--color-gray-light);
  border-radius: 100px;
  overflow: hidden;
}

.legend-bar > div {
  height: 100%;
  border-radius: 100px;
  transition: width 0.6s ease;
}

/* Top clases */
.topclases-card .chart-widget__body {
  height: 200px;
}

/* Shared body */
.chart-widget__body {
  height: 200px;
}

/* ── Table row ────────────────────────────────────────────────────────────── */
.table-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

.breakdown-card,
.tx-card {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-gray-light);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.breakdown-header {
  padding: 1.125rem 1.375rem;
  border-bottom: 1px solid var(--color-gray-light);
}

.breakdown-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--color-dark);
}

/* Breakdown table */
.breakdown-table {
  width: 100%;
  border-collapse: collapse;
}

.breakdown-table th {
  padding: 0.75rem 1.375rem;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-muted);
  text-align: left;
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-gray-light);
}

.breakdown-table td {
  padding: 0.875rem 1.375rem;
  font-size: 0.82rem;
  color: var(--color-text);
  border-bottom: 1px solid rgba(229, 231, 235, 0.5);
  vertical-align: middle;
}

.breakdown-table tr:last-child td {
  border-bottom: none;
}

.breakdown-table tr:hover td {
  background: rgba(249, 250, 251, 0.8);
}

.cell-num {
  font-weight: 600;
  color: var(--color-dark);
}

.plan-chip {
  display: inline-flex;
  padding: 3px 10px;
  border-radius: 100px;
  font-size: 0.72rem;
  font-weight: 700;
}

.retention-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.retention-bar {
  flex: 1;
  height: 5px;
  background: var(--color-gray-light);
  border-radius: 100px;
  overflow: hidden;
  max-width: 80px;
}

.retention-bar > div {
  height: 100%;
  border-radius: 100px;
  transition: width 0.6s ease;
}

.growth-badge {
  display: inline-flex;
  padding: 2px 8px;
  border-radius: 100px;
  font-size: 0.72rem;
  font-weight: 700;
}

.growth--pos {
  color: #14532d;
  background: #dcfce7;
}

.growth--neg {
  color: #7f1d1d;
  background: #fee2e2;
}

/* Transacciones */
.tx-list {
  display: flex;
  flex-direction: column;
}

.tx-item {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1.375rem;
  border-bottom: 1px solid rgba(229, 231, 235, 0.5);
  transition: var(--transition);
}

.tx-item:last-child {
  border-bottom: none;
}

.tx-item:hover {
  background: var(--color-bg);
}

.tx-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #35495E;
  color: #fff;
  font-size: 0.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.tx-info {
  flex: 1;
}

.tx-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-dark);
  line-height: 1;
  margin-bottom: 3px;
}

.tx-meta {
  font-size: 0.72rem;
  color: var(--color-text-muted);
}

.tx-right {
  text-align: right;
}

.tx-amount {
  font-size: 0.875rem;
  font-weight: 700;
  color: #16a34a;
  line-height: 1;
  margin-bottom: 4px;
}

.tx-tipo {
  font-size: 0.68rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 100px;
}

.tx-tipo--nuevo {
  color: #0c4a6e;
  background: #e0f2fe;
}

.tx-tipo--renovacion {
  color: #3b0764;
  background: #ede9fe;
}

/* ── Responsive ──────────────────────────────────────────────────────────── */
@media (max-width: 1200px) {
  .kpi-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 900px) {
  .charts-row,
  .bottom-row,
  .table-row { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  .analytics-content { padding: 1.25rem; }
  .kpi-grid { grid-template-columns: 1fr 1fr; }
}
</style>
