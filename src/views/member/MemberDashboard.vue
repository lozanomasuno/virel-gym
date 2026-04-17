<template>
  <div class="member-view">
    <!-- Topbar -->
    <header class="topbar">
      <div class="topbar__left">
        <h1 class="topbar__title">Mi Dashboard</h1>
        <p class="topbar__sub">Bienvenido de vuelta, {{ auth.user?.nombre }}</p>
      </div>
      <div class="topbar__right">
        <div class="topbar__avatar">{{ auth.user?.avatar }}</div>
      </div>
    </header>

    <div class="member-content">
      <!-- Tarjetas de resumen -->
      <section class="stats-grid">
        <div class="stat-card" v-for="stat in stats" :key="stat.label">
          <div class="stat-icon" :style="{ background: stat.bg, color: stat.color }">
            <component :is="'svg'" v-html="stat.iconPath" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </div>
          <div>
            <p class="stat-value">{{ stat.value }}</p>
            <p class="stat-label">{{ stat.label }}</p>
          </div>
        </div>
      </section>

      <!-- Próximas reservas -->
      <section class="upcoming-section">
        <div class="section-header">
          <h2 class="section-title">Próximas reservas</h2>
          <router-link to="/member/reservations" class="see-all">Ver todas →</router-link>
        </div>
        <div class="reservations-list">
          <div class="reservation-item" v-for="res in upcomingReservations" :key="res.id">
            <div class="res-color" :style="{ background: res.color }"></div>
            <div class="res-info">
              <p class="res-name">{{ res.clase }}</p>
              <p class="res-meta">{{ res.instructor }} · {{ res.duracion }} min</p>
            </div>
            <div class="res-time">
              <p class="res-date">{{ res.fecha }}</p>
              <p class="res-hour">{{ res.hora }}</p>
            </div>
            <span class="res-badge" :class="`res-badge--${res.estado}`">{{ res.estado }}</span>
          </div>
        </div>
      </section>

      <!-- Plan activo -->
      <section class="plan-card">
        <div class="plan-header">
          <div>
            <p class="plan-label">Tu plan activo</p>
            <h3 class="plan-name">{{ auth.user?.plan }}</h3>
          </div>
          <router-link to="/member/profile" class="btn-upgrade">Ver detalles</router-link>
        </div>
        <div class="plan-benefits">
          <span class="benefit-chip" v-for="b in planBenefits" :key="b">{{ b }}</span>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore'

const auth = useAuthStore()

const stats = [
  { label: 'Clases este mes', value: '12', bg: '#dcfce7', color: '#15803d', iconPath: '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>' },
  { label: 'Reservas activas', value: '3', bg: '#e0f2fe', color: '#0369a1', iconPath: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>' },
  { label: 'Días restantes plan', value: '18', bg: '#fef9c3', color: '#92400e', iconPath: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>' },
  { label: 'Puntos acumulados', value: '840', bg: '#ede9fe', color: '#7c3aed', iconPath: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>' },
]

const upcomingReservations = [
  { id: 1, clase: 'Yoga Flow', instructor: 'Ana Martínez', duracion: 60, fecha: 'Lun 22 abr', hora: '07:00', color: '#42B883', estado: 'confirmada' },
  { id: 2, clase: 'HIIT Express', instructor: 'Carlos López', duracion: 45, fecha: 'Mié 24 abr', hora: '18:30', color: '#3B82F6', estado: 'confirmada' },
  { id: 3, clase: 'Pilates Core', instructor: 'Laura Díaz', duracion: 55, fecha: 'Vie 26 abr', hora: '08:00', color: '#A855F7', estado: 'pendiente' },
]

const planBenefits = ['Clases ilimitadas', 'Reserva prioritaria', 'Acceso vestuarios premium', 'Asesoría nutricional']
</script>

<style scoped>
.member-view { flex: 1; display: flex; flex-direction: column; }

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

.topbar__title { font-size: 1.1rem; font-weight: 700; color: var(--color-dark); }
.topbar__sub   { font-size: 0.75rem; color: var(--color-text-muted); }

.topbar__avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: var(--color-primary); color: #fff;
  font-size: 0.72rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}

.member-content {
  padding: 1.75rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 860px;
}

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: var(--color-white);
  border: 1px solid var(--color-gray-light);
  border-radius: var(--radius-md);
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: var(--shadow-sm);
}

.stat-icon {
  width: 44px; height: 44px; border-radius: var(--radius-sm);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}

.stat-value { font-size: 1.4rem; font-weight: 700; color: var(--color-dark); }
.stat-label { font-size: 0.72rem; color: var(--color-text-muted); }

/* Upcoming */
.upcoming-section {
  background: var(--color-white);
  border: 1px solid var(--color-gray-light);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.125rem 1.5rem;
  border-bottom: 1px solid var(--color-gray-light);
}

.section-title { font-size: 0.95rem; font-weight: 700; color: var(--color-dark); }
.see-all { font-size: 0.8rem; color: var(--color-primary); text-decoration: none; font-weight: 500; }
.see-all:hover { text-decoration: underline; }

.reservation-item {
  display: flex;
  align-items: center;
  gap: 0;
  padding-right: 1.5rem;
  border-bottom: 1px solid rgba(229, 231, 235, 0.5);
  transition: background var(--transition);
}

.reservation-item:last-child { border-bottom: none; }
.reservation-item:hover { background: var(--color-bg); }

.res-color { width: 4px; align-self: stretch; flex-shrink: 0; }

.res-info { flex: 1; padding: 1rem 1.25rem; }
.res-name { font-size: 0.875rem; font-weight: 600; color: var(--color-dark); }
.res-meta { font-size: 0.72rem; color: var(--color-text-muted); margin-top: 2px; }

.res-time { text-align: right; margin-right: 1rem; }
.res-date { font-size: 0.78rem; font-weight: 600; color: var(--color-dark); }
.res-hour { font-size: 0.72rem; color: var(--color-text-muted); }

.res-badge {
  padding: 3px 10px; border-radius: 100px; font-size: 0.7rem; font-weight: 600;
}
.res-badge--confirmada { background: #dcfce7; color: #15803d; }
.res-badge--pendiente  { background: #fef9c3; color: #92400e; }

/* Plan card */
.plan-card {
  background: linear-gradient(135deg, #35495E 0%, #2a3a4c 100%);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  box-shadow: var(--shadow-md);
}

.plan-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.plan-label { font-size: 0.72rem; color: rgba(255,255,255,0.55); text-transform: uppercase; letter-spacing: 0.06em; }
.plan-name  { font-size: 1.5rem; font-weight: 700; color: #fff; }

.btn-upgrade {
  padding: 8px 18px;
  border-radius: var(--radius-sm);
  background: var(--color-primary);
  color: #fff;
  font-size: 0.82rem;
  font-weight: 600;
  text-decoration: none;
  transition: var(--transition);
}

.btn-upgrade:hover { background: var(--color-primary-dark); }

.plan-benefits { display: flex; flex-wrap: wrap; gap: 8px; }

.benefit-chip {
  padding: 4px 12px;
  border-radius: 100px;
  background: #1e3a2b;
  color: #a7f3d0;
  font-size: 0.75rem;
  font-weight: 500;
}
</style>
