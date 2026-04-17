<template>
  <div class="member-view">
    <header class="topbar">
      <div class="topbar__left">
        <h1 class="topbar__title">Mi perfil</h1>
        <p class="topbar__sub">Administra tu información personal</p>
      </div>
      <div class="topbar__right">
        <div class="topbar__avatar">{{ auth.user?.avatar }}</div>
      </div>
    </header>

    <div class="member-content">
      <!-- Perfil info -->
      <div class="profile-header-card">
        <div class="profile-avatar-big">{{ auth.user?.avatar }}</div>
        <div class="profile-meta">
          <h2 class="profile-name">{{ form.nombre }}</h2>
          <p class="profile-email">{{ form.email }}</p>
          <span class="plan-badge">{{ auth.user?.plan }}</span>
        </div>
      </div>

      <!-- Formulario info personal -->
      <div class="settings-card">
        <div class="card-header">
          <h3 class="card-title">Información personal</h3>
        </div>
        <div class="card-body">
          <div class="form-row">
            <div class="form-group">
              <label for="profile-nombre">Nombre completo</label>
              <input id="profile-nombre" type="text" v-model="form.nombre" />
            </div>
            <div class="form-group">
              <label for="profile-email">Correo electrónico</label>
              <input id="profile-email" type="email" v-model="form.email" />
            </div>
            <div class="form-group">
              <label for="profile-telefono">Teléfono</label>
              <input id="profile-telefono" type="tel" v-model="form.telefono" />
            </div>
            <div class="form-group">
              <label for="profile-nacimiento">Fecha de nacimiento</label>
              <input id="profile-nacimiento" type="date" v-model="form.nacimiento" />
            </div>
          </div>
        </div>
        <div class="card-footer">
          <button class="btn-save" @click="saveProfile">Guardar cambios</button>
        </div>
      </div>

      <!-- Cambiar contraseña -->
      <div class="settings-card">
        <div class="card-header">
          <h3 class="card-title">Cambiar contraseña</h3>
        </div>
        <div class="card-body">
          <div class="form-row form-row--narrow">
            <div class="form-group">
              <label for="pass-actual">Contraseña actual</label>
              <input id="pass-actual" type="password" v-model="passForm.actual" placeholder="••••••••" />
            </div>
            <div class="form-group">
              <label for="pass-nueva">Nueva contraseña</label>
              <input id="pass-nueva" type="password" v-model="passForm.nueva" placeholder="••••••••" />
            </div>
            <div class="form-group">
              <label for="pass-confirmar">Confirmar nueva contraseña</label>
              <input id="pass-confirmar" type="password" v-model="passForm.confirmar" placeholder="••••••••" />
            </div>
          </div>
        </div>
        <div class="card-footer">
          <button class="btn-save" @click="changePassword" :disabled="!passValid">Actualizar contraseña</button>
        </div>
      </div>

      <!-- Toast -->
      <Transition name="fade-up">
        <div v-if="toast" class="toast">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#42B883" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          {{ toast }}
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'

const auth = useAuthStore()

const form = ref({
  nombre:     auth.user?.nombre ?? '',
  email:      auth.user?.email  ?? '',
  telefono:   '+57 300 000 0000',
  nacimiento: '1995-06-15',
})

const passForm = ref({ actual: '', nueva: '', confirmar: '' })

const passValid = computed(() =>
  passForm.value.actual.length > 0 &&
  passForm.value.nueva.length >= 8 &&
  passForm.value.nueva === passForm.value.confirmar,
)

const toast = ref(null)
let toastTimer = null

function showToast(msg) {
  toast.value = msg
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value = null }, 3000)
}

function saveProfile() {
  // Aquí iría el PUT a la API
  showToast('Perfil actualizado correctamente')
}

function changePassword() {
  if (!passValid.value) return
  passForm.value = { actual: '', nueva: '', confirmar: '' }
  showToast('Contraseña actualizada')
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
  gap: 1.25rem;
  max-width: 680px;
}

/* Profile header */
.profile-header-card {
  background: var(--color-white);
  border: 1px solid var(--color-gray-light);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  box-shadow: var(--shadow-sm);
}

.profile-avatar-big {
  width: 64px; height: 64px; border-radius: 50%;
  background: var(--color-primary); color: #fff;
  font-size: 1.2rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.profile-name  { font-size: 1.15rem; font-weight: 700; color: var(--color-dark); }
.profile-email { font-size: 0.84rem; color: var(--color-text-muted); margin-top: 2px; margin-bottom: 0.5rem; }

.plan-badge {
  display: inline-block;
  padding: 3px 12px;
  border-radius: 100px;
  background: rgba(66, 184, 131, 0.12);
  color: var(--color-primary-dark);
  font-size: 0.72rem;
  font-weight: 700;
}

/* Settings cards */
.settings-card {
  background: var(--color-white);
  border: 1px solid var(--color-gray-light);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.card-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--color-gray-light);
  background: var(--color-bg);
}

.card-title { font-size: 0.9rem; font-weight: 700; color: var(--color-dark); }

.card-body { padding: 1.5rem; }

.card-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--color-gray-light);
  display: flex;
  justify-content: flex-end;
  background: var(--color-bg);
}

/* Form */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.125rem;
}

.form-row--narrow { grid-template-columns: 1fr; }

.form-group { display: flex; flex-direction: column; gap: 6px; }

.form-group label {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--color-dark);
}

.form-group input {
  padding: 9px 12px;
  border: 1.5px solid var(--color-gray-light);
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  font-family: inherit;
  color: var(--color-text);
  background: var(--color-white);
  transition: var(--transition);
}

.form-group input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.12);
}

.btn-save {
  padding: 9px 22px;
  border-radius: var(--radius-sm);
  background: var(--color-primary);
  color: #fff;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: inherit;
  border: none;
  cursor: pointer;
  transition: var(--transition);
}

.btn-save:hover:not(:disabled) { background: var(--color-primary-dark); }
.btn-save:disabled { opacity: 0.5; cursor: not-allowed; }

/* Toast */
.toast {
  position: fixed;
  bottom: 1.75rem; right: 1.75rem;
  background: var(--color-white);
  border: 1px solid var(--color-gray-light);
  border-radius: var(--radius-md);
  padding: 0.875rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-dark);
  box-shadow: var(--shadow-md);
  display: flex;
  align-items: center;
  gap: 0.625rem;
  z-index: 300;
}

.fade-up-enter-active, .fade-up-leave-active { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.fade-up-enter-from, .fade-up-leave-to { opacity: 0; transform: translateY(10px); }
</style>
