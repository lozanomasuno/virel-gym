<template>
  <div class="table-wrapper">
    <table class="member-table">
      <thead>
        <tr>
          <th>Miembro</th>
          <th>Membresía</th>
          <th>Estado</th>
          <th>Próxima renovación</th>
          <th>Última reserva</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="m in miembros"
          :key="m.id"
          class="member-row"
          :class="{ 'member-row--selected': selectedId === m.id }"
          @click="$emit('select', m)"
        >
          <!-- Avatar + nombre -->
          <td>
            <div class="member-info">
              <div class="avatar" :style="{ background: avatarColor(m.plan) }">
                {{ m.avatar }}
              </div>
              <div>
                <p class="member-name">{{ m.nombre }}</p>
                <p class="member-email">{{ m.email }}</p>
              </div>
            </div>
          </td>

          <!-- Plan -->
          <td>
            <span class="plan-chip" :style="{ color: planColor(m.plan), background: planBg(m.plan) }">
              {{ m.plan }}
            </span>
          </td>

          <!-- Estado -->
          <td>
            <span class="estado-chip" :class="`estado-chip--${m.estado}`">
              <span class="estado-dot"></span>
              {{ estadoLabel(m.estado) }}
            </span>
          </td>

          <!-- Renovación -->
          <td>
            <span class="renovation-date" :class="{ 'renovation-date--pronto': esPronto(m.renovacion) }">
              {{ formatDate(m.renovacion) }}
            </span>
          </td>

          <!-- Última reserva -->
          <td class="last-booking">{{ m.ultimaReserva }}</td>

          <!-- Acciones -->
          <td @click.stop>
            <div class="actions">
              <button class="action-btn" title="Ver detalle" @click="$emit('select', m)">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              </button>
              <button class="action-btn action-btn--success" title="Renovar plan" @click="$emit('renovar', m.id)">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
              </button>
              <button class="action-btn action-btn--danger" title="Suspender" @click="$emit('suspender', m.id)">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>
              </button>
            </div>
          </td>
        </tr>

        <tr v-if="miembros.length === 0">
          <td colspan="6" class="empty-state">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <p>No se encontraron miembros</p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { planStrategies } from '@/stores/memberStore'

defineProps({
  miembros: { type: Array, required: true },
  selectedId: { type: Number, default: null },
})

defineEmits(['select', 'renovar', 'suspender'])

function planColor(plan) {
  return planStrategies[plan]?.color ?? '#6B7280'
}

function planBg(plan) {
  const c = planStrategies[plan]?.color ?? '#6B7280'
  return `${c}18`
}

function avatarColor(plan) {
  const map = { Essential: '#6B7280', Balance: '#42B883', Premium: '#8B5CF6' }
  return map[plan] ?? '#35495E'
}

function estadoLabel(estado) {
  const map = { activo: 'Activo', pendiente: 'Pendiente', suspendido: 'Suspendido' }
  return map[estado] ?? estado
}

function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
}

function esPronto(iso) {
  const diff = new Date(iso) - new Date()
  return diff > 0 && diff < 15 * 24 * 60 * 60 * 1000
}
</script>

<style scoped>
.table-wrapper {
  overflow-x: auto;
}

.member-table {
  width: 100%;
  border-collapse: collapse;
}

.member-table th {
  padding: 0.75rem 1.25rem;
  text-align: left;
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.07em;
  background: var(--color-bg);
  white-space: nowrap;
}

.member-table td {
  padding: 0.875rem 1.25rem;
  font-size: 0.875rem;
  color: var(--color-text);
  border-top: 1px solid var(--color-gray-light);
  vertical-align: middle;
}

.member-row {
  cursor: pointer;
  transition: background 0.15s;
}

.member-row:hover td {
  background: #f3fdf8;
}

.member-row--selected td {
  background: rgba(66, 184, 131, 0.06);
}

/* Avatar + info */
.member-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  color: white;
  font-size: 0.72rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.member-name {
  font-weight: 600;
  color: var(--color-dark);
  margin-bottom: 1px;
  font-size: 0.875rem;
}

.member-email {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

/* Plan chip */
.plan-chip {
  display: inline-flex;
  padding: 3px 10px;
  border-radius: 100px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

/* Estado chip */
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

.estado-chip--activo {
  color: #16a34a;
  background: rgba(22, 163, 74, 0.1);
}

.estado-chip--pendiente {
  color: #d97706;
  background: rgba(245, 158, 11, 0.1);
}

.estado-chip--suspendido {
  color: #6B7280;
  background: rgba(107, 114, 128, 0.1);
}

/* Renovation */
.renovation-date {
  font-size: 0.82rem;
  color: var(--color-text-muted);
}

.renovation-date--pronto {
  color: #d97706;
  font-weight: 600;
}

/* Last booking */
.last-booking {
  font-size: 0.82rem;
  color: var(--color-text-muted);
  white-space: nowrap;
}

/* Actions */
.actions {
  display: flex;
  gap: 4px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-gray-light);
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: var(--transition);
}

.action-btn:hover {
  background: var(--color-bg);
  color: var(--color-dark);
  border-color: #d1d5db;
}

.action-btn--success:hover {
  background: rgba(22, 163, 74, 0.08);
  color: #16a34a;
  border-color: rgba(22, 163, 74, 0.25);
}

.action-btn--danger:hover {
  background: rgba(220, 38, 38, 0.08);
  color: #dc2626;
  border-color: rgba(220, 38, 38, 0.25);
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #9CA3AF;
  border-top: 1px solid var(--color-gray-light);
}

.empty-state p {
  margin-top: 0.75rem;
  font-size: 0.875rem;
}
</style>
