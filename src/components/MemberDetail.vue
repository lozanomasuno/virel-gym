<template>
  <Transition name="slide-panel">
    <div v-if="miembro" class="detail-panel">
      <!-- Header -->
      <div class="detail-panel__header">
        <div class="detail-avatar" :style="{ background: avatarColor(miembro.plan) }">
          {{ miembro.avatar }}
        </div>
        <div class="detail-header-info">
          <h2 class="detail-name">{{ miembro.nombre }}</h2>
          <span class="plan-chip" :style="{ color: planColor(miembro.plan), background: planBg(miembro.plan) }">
            {{ miembro.plan }}
          </span>
        </div>
        <button class="close-btn" @click="$emit('close')" aria-label="Cerrar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- Info personal -->
      <div class="detail-section">
        <h3 class="detail-section__title">Información</h3>
        <div class="info-grid">
          <div class="info-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            {{ miembro.email }}
          </div>
          <div class="info-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.38 2 2 0 0 1 3.58 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            {{ miembro.telefono }}
          </div>
          <div class="info-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Renueva: {{ formatDate(miembro.renovacion) }}
          </div>
        </div>
      </div>

      <!-- Estado -->
      <div class="detail-section">
        <h3 class="detail-section__title">Estado de cuenta</h3>
        <div class="estado-row">
          <span class="estado-chip" :class="`estado-chip--${miembro.estado}`">
            <span class="estado-dot"></span>
            {{ estadoLabel(miembro.estado) }}
          </span>
          <div class="asistencia-badge">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            {{ miembro.asistenciaMes }} clases este mes
          </div>
        </div>

        <!-- Beneficios del plan - Strategy Pattern -->
        <div class="plan-benefits">
          <p class="benefits-label">Incluido en tu plan:</p>
          <ul>
            <li v-for="b in planBeneficios(miembro.plan)" :key="b">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#42B883" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              {{ b }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Historial -->
      <div class="detail-section">
        <h3 class="detail-section__title">Últimas reservas</h3>
        <div class="historial-list">
          <div v-for="(h, i) in miembro.historial" :key="i" class="historial-item">
            <div class="historial-dot" :class="`dot--${h.estado.replace(' ', '-')}`"></div>
            <div class="historial-info">
              <p class="historial-clase">{{ h.clase }}</p>
              <p class="historial-meta">{{ h.fecha }} · {{ h.hora }}</p>
            </div>
            <span class="historial-estado" :class="`hestado--${h.estado.replace(' ', '-')}`">{{ h.estado }}</span>
          </div>
          <p v-if="!miembro.historial.length" class="empty-historial">Sin historial disponible</p>
        </div>
      </div>

      <!-- Notas -->
      <div class="detail-section">
        <h3 class="detail-section__title">Notas administrativas</h3>
        <textarea
          class="notas-input"
          :value="miembro.notas"
          placeholder="Escribe una nota sobre este miembro..."
          rows="3"
          @input="$emit('update-nota', miembro.id, $event.target.value)"
        ></textarea>
      </div>

      <!-- Acciones -->
      <div class="detail-actions">
        <button class="action-primary" @click="$emit('renovar', miembro.id)">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
          Renovar plan
        </button>
        <button class="action-secondary" @click="$emit('suspender', miembro.id)">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
          Suspender
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { planStrategies } from '@/stores/memberStore'

defineProps({
  miembro: { type: Object, default: null },
})

defineEmits(['close', 'renovar', 'suspender', 'update-nota'])

function planColor(plan) { return planStrategies[plan]?.color ?? '#6B7280' }
function planBg(plan) { const c = planStrategies[plan]?.color ?? '#6B7280'; return `${c}18` }
function avatarColor(plan) { const map = { Essential: '#6B7280', Balance: '#42B883', Premium: '#8B5CF6' }; return map[plan] ?? '#35495E' }
function estadoLabel(e) { return { activo: 'Activo', pendiente: 'Pendiente', suspendido: 'Suspendido' }[e] ?? e }
function planBeneficios(plan) { return planStrategies[plan]?.beneficios ?? [] }
function formatDate(iso) { return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }) }
</script>

<style scoped>
.detail-panel {
  width: 340px;
  flex-shrink: 0;
  background: var(--color-white);
  border-left: 1px solid var(--color-gray-light);
  height: calc(100vh - 68px);
  position: sticky;
  top: 68px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

/* Header */
.detail-panel__header {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-gray-light);
  position: sticky;
  top: 0;
  background: var(--color-white);
  z-index: 2;
}

.detail-avatar {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  color: white;
  font-size: 0.875rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.detail-header-info {
  flex: 1;
  min-width: 0;
}

.detail-name {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--color-dark);
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.plan-chip {
  display: inline-flex;
  padding: 2px 9px;
  border-radius: 100px;
  font-size: 0.7rem;
  font-weight: 700;
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-gray-light);
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  flex-shrink: 0;
  transition: var(--transition);
}

.close-btn:hover {
  background: var(--color-bg);
  color: var(--color-dark);
}

/* Sections */
.detail-section {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--color-gray-light);
}

.detail-section__title {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.875rem;
}

/* Info grid */
.info-grid {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  color: var(--color-text);
}

.info-item svg {
  color: var(--color-text-muted);
  flex-shrink: 0;
}

/* Estado */
.estado-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.estado-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  border-radius: 100px;
  font-size: 0.72rem;
  font-weight: 600;
}

.estado-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.estado-chip--activo { color: #16a34a; background: rgba(22, 163, 74, 0.1); }
.estado-chip--pendiente { color: #d97706; background: rgba(245, 158, 11, 0.1); }
.estado-chip--suspendido { color: #6B7280; background: rgba(107, 114, 128, 0.1); }

.asistencia-badge {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.78rem;
  color: var(--color-text-muted);
  font-weight: 500;
}

.asistencia-badge svg { color: #42B883; }

/* Plan benefits */
.plan-benefits {
  background: var(--color-bg);
  border-radius: var(--radius-md);
  padding: 0.875rem 1rem;
}

.benefits-label {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--color-text-muted);
  margin-bottom: 0.5rem;
}

.plan-benefits ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.plan-benefits li {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: var(--color-text);
}

/* Historial */
.historial-list {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.historial-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.historial-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.dot--asistió { background: #42B883; }
.dot--canceló { background: #F59E0B; }
.dot--no-asistió { background: #EF4444; }

.historial-info { flex: 1; }

.historial-clase {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--color-dark);
}

.historial-meta {
  font-size: 0.72rem;
  color: var(--color-text-muted);
}

.historial-estado {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 100px;
}

.hestado--asistió { color: #16a34a; background: rgba(22, 163, 74, 0.1); }
.hestado--canceló { color: #d97706; background: rgba(245, 158, 11, 0.1); }
.hestado--no-asistió { color: #dc2626; background: rgba(220, 38, 38, 0.1); }

.empty-historial {
  font-size: 0.82rem;
  color: var(--color-text-muted);
  text-align: center;
  padding: 1rem 0;
}

/* Notas */
.notas-input {
  width: 100%;
  border: 1px solid var(--color-gray-light);
  border-radius: var(--radius-md);
  padding: 0.75rem;
  font-size: 0.82rem;
  font-family: inherit;
  color: var(--color-text);
  background: var(--color-bg);
  resize: vertical;
  transition: var(--transition);
  min-height: 80px;
  line-height: 1.5;
}

.notas-input:focus {
  outline: none;
  border-color: #42B883;
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.12);
}

/* Acciones */
.detail-actions {
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: auto;
  border-top: 1px solid var(--color-gray-light);
  position: sticky;
  bottom: 0;
  background: var(--color-white);
}

.action-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  width: 100%;
  padding: 10px;
  border-radius: var(--radius-md);
  background: var(--color-primary);
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  font-family: inherit;
  cursor: pointer;
  border: none;
  transition: var(--transition);
}

.action-primary:hover {
  background: var(--color-primary-dark);
}

.action-secondary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  width: 100%;
  padding: 9px;
  border-radius: var(--radius-md);
  background: transparent;
  color: #dc2626;
  font-weight: 600;
  font-size: 0.875rem;
  font-family: inherit;
  cursor: pointer;
  border: 1px solid rgba(220, 38, 38, 0.25);
  transition: var(--transition);
}

.action-secondary:hover {
  background: rgba(220, 38, 38, 0.06);
}

/* Panel transition */
.slide-panel-enter-active,
.slide-panel-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-panel-enter-from,
.slide-panel-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
