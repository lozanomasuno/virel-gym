<template>
  <div class="member-view">
    <header class="topbar">
      <div class="topbar__left">
        <h1 class="topbar__title">Mis reservas</h1>
        <p class="topbar__sub">Gestiona tus clases reservadas</p>
      </div>
      <div class="topbar__right">
        <button class="btn-nueva" @click="showModal = true">+ Nueva reserva</button>
      </div>
    </header>

    <div class="member-content">
      <!-- Filtros -->
      <div class="filter-bar">
        <button
          v-for="f in filtros"
          :key="f.value"
          class="filter-btn"
          :class="{ active: filtroActivo === f.value }"
          @click="filtroActivo = f.value"
        >
          {{ f.label }}
        </button>
      </div>

      <!-- Lista -->
      <div class="reservas-list">
        <div
          v-for="res in filtradas"
          :key="res.id"
          class="reserva-card"
        >
          <div class="reserva-color" :style="{ background: res.color }"></div>
          <div class="reserva-body">
            <div class="reserva-top">
              <div>
                <h3 class="reserva-clase">{{ res.clase }}</h3>
                <p class="reserva-meta">{{ res.instructor }} · {{ res.duracion }} min · {{ res.lugar }}</p>
              </div>
              <span class="estado-badge" :class="`estado-badge--${res.estado}`">{{ res.estado }}</span>
            </div>
            <div class="reserva-footer">
              <div class="reserva-datetime">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                {{ res.fecha }} · {{ res.hora }}
              </div>
              <button
                v-if="res.estado !== 'completada'"
                class="btn-cancel-res"
                @click="cancelar(res.id)"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>

        <div v-if="filtradas.length === 0" class="empty-state">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-gray-light)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <p>Sin reservas en esta categoría</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const filtroActivo = ref('proximas')
const showModal = ref(false)

const filtros = [
  { value: 'proximas', label: 'Próximas' },
  { value: 'completada', label: 'Completadas' },
  { value: 'cancelada', label: 'Canceladas' },
]

const reservas = ref([
  { id: 1, clase: 'Yoga Flow', instructor: 'Ana Martínez', duracion: 60, lugar: 'Sala A', fecha: 'Lun 22 abr', hora: '07:00', color: '#42B883', estado: 'confirmada' },
  { id: 2, clase: 'HIIT Express', instructor: 'Carlos López', duracion: 45, lugar: 'Sala B', fecha: 'Mié 24 abr', hora: '18:30', color: '#3B82F6', estado: 'confirmada' },
  { id: 3, clase: 'Pilates Core', instructor: 'Laura Díaz', duracion: 55, lugar: 'Sala C', fecha: 'Vie 26 abr', hora: '08:00', color: '#A855F7', estado: 'pendiente' },
  { id: 4, clase: 'Spinning', instructor: 'Marco Ruiz', duracion: 50, lugar: 'Cycling', fecha: 'Mar 16 abr', hora: '06:30', color: '#F59E0B', estado: 'completada' },
  { id: 5, clase: 'Zumba', instructor: 'Sofía Ríos', duracion: 60, lugar: 'Sala A', fecha: 'Vie 12 abr', hora: '19:00', color: '#EC4899', estado: 'completada' },
])

const filtradas = computed(() => {
  if (filtroActivo.value === 'proximas') {
    return reservas.value.filter((r) => r.estado === 'confirmada' || r.estado === 'pendiente')
  }
  return reservas.value.filter((r) => r.estado === filtroActivo.value)
})

function cancelar(id) {
  const r = reservas.value.find((r) => r.id === id)
  if (r) r.estado = 'cancelada'
}
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

.btn-nueva {
  padding: 8px 18px;
  border-radius: var(--radius-sm);
  background: var(--color-primary);
  color: #fff;
  font-size: 0.84rem;
  font-weight: 600;
  font-family: inherit;
  border: none;
  cursor: pointer;
  transition: var(--transition);
}

.btn-nueva:hover { background: var(--color-primary-dark); }

.member-content {
  padding: 1.75rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-width: 760px;
}

/* Filtros */
.filter-bar { display: flex; gap: 8px; }

.filter-btn {
  padding: 6px 18px;
  border-radius: 100px;
  font-size: 0.8rem;
  font-weight: 600;
  font-family: inherit;
  border: 1.5px solid var(--color-gray-light);
  background: var(--color-white);
  color: var(--color-text-muted);
  cursor: pointer;
  transition: var(--transition);
}

.filter-btn.active, .filter-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: rgba(66, 184, 131, 0.06);
}

/* Lista */
.reservas-list { display: flex; flex-direction: column; gap: 0.875rem; }

.reserva-card {
  background: var(--color-white);
  border: 1px solid var(--color-gray-light);
  border-radius: var(--radius-md);
  overflow: hidden;
  display: flex;
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
}

.reserva-card:hover { box-shadow: var(--shadow-md); }

.reserva-color { width: 5px; flex-shrink: 0; }

.reserva-body { flex: 1; padding: 1rem 1.25rem; }

.reserva-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.reserva-clase { font-size: 0.95rem; font-weight: 700; color: var(--color-dark); margin-bottom: 3px; }
.reserva-meta  { font-size: 0.75rem; color: var(--color-text-muted); }

.estado-badge {
  padding: 3px 10px; border-radius: 100px; font-size: 0.7rem; font-weight: 700;
  white-space: nowrap; flex-shrink: 0;
}

.estado-badge--confirmada { background: #dcfce7; color: #15803d; }
.estado-badge--pendiente  { background: #fef9c3; color: #92400e; }
.estado-badge--completada { background: #f3f4f6; color: #6b7280; }
.estado-badge--cancelada  { background: #fee2e2; color: #b91c1c; }

.reserva-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.reserva-datetime {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  color: var(--color-text-muted);
}

.btn-cancel-res {
  font-size: 0.75rem;
  font-weight: 500;
  font-family: inherit;
  color: #b91c1c;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  transition: var(--transition);
}

.btn-cancel-res:hover { background: #fef2f2; }

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 3rem;
  background: var(--color-white);
  border: 1px solid var(--color-gray-light);
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  font-size: 0.875rem;
}
</style>
