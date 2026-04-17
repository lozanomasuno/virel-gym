<template>
  <div class="dashboard-main">
      <!-- Topbar -->
      <header class="topbar">
        <div class="topbar__left">
          <h1 class="topbar__title">Miembros</h1>
          <p class="topbar__subtitle">Gestión de miembros del gimnasio</p>
        </div>
        <div class="topbar__right">
          <button class="btn-nuevo" @click="showNuevoModal = true">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Nuevo miembro
          </button>
          <div class="topbar__avatar">AV</div>
        </div>
      </header>

      <div class="members-content" :class="{ 'has-panel': !!store.miembroSeleccionado }">
        <div class="members-main">
          <!-- Métricas summary -->
          <section class="metrics-row">
            <MemberCard
              v-for="m in store.metricas"
              :key="m.id"
              :metric="m"
            />
          </section>

          <!-- Filtros y buscador -->
          <div class="filters-bar">
            <div class="search-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                v-model="store.busqueda"
                type="text"
                placeholder="Buscar por nombre o email..."
                class="search-input"
              />
              <button v-if="store.busqueda" class="search-clear" @click="store.busqueda = ''">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <div class="filter-plans">
              <button
                v-for="f in filtros"
                :key="f.value"
                class="filter-btn"
                :class="{ active: store.filtroPlan === f.value }"
                @click="store.filtroPlan = f.value"
              >
                {{ f.label }}
              </button>
            </div>

            <span class="results-count">{{ store.miembrosFiltrados.length }} miembros</span>
          </div>

          <!-- Tabla -->
          <div class="table-card">
            <MemberTable
              :miembros="store.miembrosFiltrados"
              :selected-id="store.miembroSeleccionado?.id ?? null"
              @select="store.seleccionarMiembro"
              @renovar="store.renovarPlan"
              @suspender="store.suspenderMiembro"
            />
          </div>
        </div>

        <!-- Panel de detalle -->
        <MemberDetail
          :miembro="store.miembroSeleccionado"
          @close="store.cerrarDetalle"
          @renovar="store.renovarPlan"
          @suspender="store.suspenderMiembro"
          @update-nota="store.actualizarNota"
        />
      </div>
    </div>

    <!-- Modal nuevo miembro (placeholder) -->
    <Transition name="modal-fade">
      <div v-if="showNuevoModal" class="modal-overlay" @click.self="showNuevoModal = false">
        <div class="modal-box">
          <div class="modal-header">
            <h3>Nuevo miembro</h3>
            <button class="close-btn" @click="showNuevoModal = false">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-row">
              <div class="form-group">
                <label>Nombre completo</label>
                <input type="text" placeholder="Laura Méndez" />
              </div>
              <div class="form-group">
                <label>Email</label>
                <input type="email" placeholder="laura@email.com" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Teléfono</label>
                <input type="tel" placeholder="+57 300 000 0000" />
              </div>
              <div class="form-group">
                <label>Plan</label>
                <select>
                  <option>Essential</option>
                  <option>Balance</option>
                  <option>Premium</option>
                </select>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-cancel" @click="showNuevoModal = false">Cancelar</button>
            <button class="btn-save" @click="showNuevoModal = false">Guardar miembro</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useMemberStore } from '@/stores/memberStore'
import MemberCard from '@/components/MemberCard.vue'
import MemberTable from '@/components/MemberTable.vue'
import MemberDetail from '@/components/MemberDetail.vue'

const store = useMemberStore()
const showNuevoModal = ref(false)

const filtros = [
  { value: 'todos', label: 'Todos' },
  { value: 'Essential', label: 'Essential' },
  { value: 'Balance', label: 'Balance' },
  { value: 'Premium', label: 'Premium' },
]
</script>

<style scoped>
.dashboard-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Topbar */
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
  gap: 1rem;
}

.btn-nuevo {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--color-primary);
  color: white;
  padding: 8px 18px;
  border-radius: var(--radius-md);
  font-size: 0.82rem;
  font-weight: 600;
  font-family: inherit;
  border: none;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: 0 2px 12px rgba(66, 184, 131, 0.3);
}

.btn-nuevo:hover {
  background: var(--color-primary-dark);
  transform: translateY(-1px);
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

/* Content layout */
.members-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.members-main {
  flex: 1;
  padding: 1.75rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  overflow-y: auto;
  min-width: 0;
}

/* Metrics */
.metrics-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}

/* Filters bar */
.filters-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 220px;
  max-width: 320px;
}

.search-box > svg {
  position: absolute;
  left: 12px;
  color: var(--color-text-muted);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 9px 12px 9px 36px;
  border: 1px solid var(--color-gray-light);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-family: inherit;
  color: var(--color-text);
  background: var(--color-white);
  transition: var(--transition);
}

.search-input:focus {
  outline: none;
  border-color: #42B883;
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.12);
}

.search-clear {
  position: absolute;
  right: 10px;
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  padding: 2px;
  border-radius: 4px;
  transition: var(--transition);
}

.search-clear:hover { color: var(--color-dark); }

.filter-plans {
  display: flex;
  gap: 4px;
  background: var(--color-white);
  border: 1px solid var(--color-gray-light);
  padding: 3px;
  border-radius: var(--radius-sm);
}

.filter-btn {
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

.filter-btn.active {
  background: var(--color-primary);
  color: white;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(66, 184, 131, 0.3);
}

.results-count {
  font-size: 0.78rem;
  color: var(--color-text-muted);
  margin-left: auto;
  white-space: nowrap;
}

/* Table card */
.table-card {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-gray-light);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 1rem;
}

.modal-box {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  width: 100%;
  max-width: 540px;
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--color-gray-light);
}

.modal-header h3 {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-dark);
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
  transition: var(--transition);
}

.close-btn:hover { background: var(--color-bg); color: var(--color-dark); }

.modal-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.form-group input,
.form-group select {
  padding: 9px 12px;
  border: 1px solid var(--color-gray-light);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-family: inherit;
  color: var(--color-text);
  background: var(--color-bg);
  transition: var(--transition);
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #42B883;
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.12);
}

.modal-footer {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--color-gray-light);
  background: var(--color-bg);
}

.btn-cancel {
  padding: 9px 20px;
  border-radius: var(--radius-md);
  background: transparent;
  border: 1px solid var(--color-gray-light);
  color: var(--color-text-muted);
  font-size: 0.875rem;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: var(--transition);
}

.btn-cancel:hover { background: var(--color-white); color: var(--color-dark); }

.btn-save {
  padding: 9px 20px;
  border-radius: var(--radius-md);
  background: var(--color-primary);
  border: none;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: var(--transition);
}

.btn-save:hover { background: var(--color-primary-dark); }

/* Modal transition */
.modal-fade-enter-active,
.modal-fade-leave-active { transition: all 0.25s ease; }
.modal-fade-enter-from,
.modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-from .modal-box,
.modal-fade-leave-to .modal-box { transform: scale(0.95); }

/* Responsive */
@media (max-width: 768px) {
  .dashboard-main { margin-left: 0; }
  .metrics-row { grid-template-columns: 1fr; }
  .members-main { padding: 1.25rem; }
  .form-row { grid-template-columns: 1fr; }
}
</style>
