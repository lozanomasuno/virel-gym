<template>
  <div class="settings-main">
      <!-- Topbar -->
      <header class="topbar">
        <div class="topbar__left">
          <h1 class="topbar__title">Configuración</h1>
          <p class="topbar__subtitle">Administra los parámetros del sistema Virel</p>
        </div>
        <div class="topbar__right">
          <div class="topbar__avatar">AV</div>
        </div>
      </header>

      <!-- Body: settings sidebar + panels -->
      <div class="settings-body">
        <SettingsSidebar v-model="activeSection" />

        <div class="settings-panel">

          <!-- ─── GENERAL ────────────────────────────────────────────────── -->
          <div v-show="activeSection === 'general'" class="panel-content">
            <SettingsSection
              title="Información del gimnasio"
              subtitle="Datos principales visibles en la app y en comunicaciones"
            >
              <SettingsForm label="Nombre del gimnasio" hint="Aparece en emails y en la landing page">
                <input type="text" v-model="store.general.nombre" />
              </SettingsForm>
              <SettingsForm label="Correo electrónico" hint="Dirección para contacto y notificaciones">
                <input type="email" v-model="store.general.email" />
              </SettingsForm>
              <SettingsForm label="Teléfono" hint="Número de atención al cliente">
                <input type="tel" v-model="store.general.telefono" />
              </SettingsForm>
              <SettingsForm label="Dirección" hint="Ubicación física del gimnasio">
                <input type="text" v-model="store.general.direccion" />
              </SettingsForm>
              <SettingsForm label="Sitio web" hint="URL pública del gimnasio">
                <input type="url" v-model="store.general.website" />
              </SettingsForm>
              <SettingsForm label="Descripción corta" hint="Frase que resume la propuesta de valor (máx. 160 caracteres)">
                <textarea v-model="store.general.descripcion" maxlength="160" rows="3"></textarea>
                <span class="char-count">{{ store.general.descripcion.length }}/160</span>
              </SettingsForm>
              <template #footer>
                <button class="btn-save" @click="save('general')">Guardar cambios</button>
              </template>
            </SettingsSection>
          </div>

          <!-- ─── HORARIOS ───────────────────────────────────────────────── -->
          <div v-show="activeSection === 'horarios'" class="panel-content">
            <SettingsSection
              title="Horarios de operación"
              subtitle="Define cuándo y cómo funciona el gimnasio"
            >
              <SettingsForm label="Días activos" hint="Selecciona los días en que el gimnasio abre">
                <div class="days-grid">
                  <button
                    v-for="dia in store.diasSemana"
                    :key="dia"
                    class="day-btn"
                    :class="{ active: store.horarios.diasActivos.includes(dia) }"
                    @click="store.toggleDia(dia)"
                  >
                    {{ dia }}
                  </button>
                </div>
              </SettingsForm>
              <SettingsForm label="Apertura" hint="Hora de apertura de instalaciones">
                <input type="time" v-model="store.horarios.apertura" class="input-sm" />
              </SettingsForm>
              <SettingsForm label="Cierre" hint="Hora de cierre de instalaciones">
                <input type="time" v-model="store.horarios.cierre" class="input-sm" />
              </SettingsForm>
              <SettingsForm label="Intervalo entre clases" hint="Tiempo mínimo de descanso entre clases (minutos)">
                <div class="input-with-unit">
                  <input type="number" v-model.number="store.horarios.intervaloClases" min="0" max="120" class="input-sm" />
                  <span class="unit">min</span>
                </div>
              </SettingsForm>
              <SettingsForm label="Capacidad máxima" hint="Número máximo de personas por clase por defecto">
                <div class="input-with-unit">
                  <input type="number" v-model.number="store.horarios.capacidadMaxima" min="1" max="200" class="input-sm" />
                  <span class="unit">personas</span>
                </div>
              </SettingsForm>
              <template #footer>
                <button class="btn-save" @click="save('horarios')">Guardar cambios</button>
              </template>
            </SettingsSection>
          </div>

          <!-- ─── CLASES ─────────────────────────────────────────────────── -->
          <div v-show="activeSection === 'clases'" class="panel-content">
            <SettingsSection
              title="Gestión de clases"
              :subtitle="`${store.totalClases} clases configuradas`"
            >
              <template #header-action>
                <button class="btn-add" @click="openAddClase">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Agregar clase
                </button>
              </template>

              <div class="clase-list">
                <div
                  v-for="clase in store.clases"
                  :key="clase.id"
                  class="clase-card"
                >
                  <div class="clase-color-bar" :style="{ background: clase.color }"></div>
                  <div class="clase-info">
                    <div class="clase-name">{{ clase.nombre }}</div>
                    <div class="clase-meta">
                      <span>{{ clase.instructor }}</span>
                      <span class="meta-dot">·</span>
                      <span>{{ clase.duracion }} min</span>
                      <span class="meta-dot">·</span>
                      <span>{{ clase.cupos }} cupos</span>
                    </div>
                  </div>
                  <div class="clase-actions">
                    <button class="icon-btn" @click="openEditClase(clase)" title="Editar">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button class="icon-btn icon-btn--danger" @click="store.eliminarClase(clase.id)" title="Eliminar">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                    </button>
                  </div>
                </div>

                <div v-if="store.clases.length === 0" class="empty-state">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-gray-light)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/></svg>
                  <p>Sin clases configuradas</p>
                </div>
              </div>
            </SettingsSection>
          </div>

          <!-- ─── MEMBRESÍAS ─────────────────────────────────────────────── -->
          <div v-show="activeSection === 'membresias'" class="panel-content">
            <SettingsSection
              title="Planes de membresía"
              :subtitle="`${store.totalMembresias} planes activos`"
            >
              <template #header-action>
                <button class="btn-add" @click="store.agregarMembresia">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Nuevo plan
                </button>
              </template>

              <div class="membresia-grid">
                <div
                  v-for="plan in store.membresias"
                  :key="plan.id"
                  class="membresia-card"
                  :style="{ '--plan-color': plan.color }"
                >
                  <div class="membresia-card__top">
                    <div class="membresia-color-dot" :style="{ background: plan.color }"></div>
                    <button class="icon-btn icon-btn--danger icon-btn--sm" @click="store.eliminarMembresia(plan.id)" title="Eliminar plan">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>

                  <div class="membresia-field">
                    <label :for="`plan-${plan.id}-nombre`">Nombre del plan</label>
                    <input :id="`plan-${plan.id}-nombre`" type="text" v-model="plan.nombre" @change="store.editarMembresia(plan.id, plan)" />
                  </div>
                  <div class="membresia-row2">
                    <div class="membresia-field">
                      <label :for="`plan-${plan.id}-precio`">Precio (COP)</label>
                      <input :id="`plan-${plan.id}-precio`" type="number" v-model.number="plan.precio" min="0" @change="store.editarMembresia(plan.id, plan)" />
                    </div>
                    <div class="membresia-field">
                      <label :for="`plan-${plan.id}-duracion`">Duración (días)</label>
                      <input :id="`plan-${plan.id}-duracion`" type="number" v-model.number="plan.duracion" min="1" @change="store.editarMembresia(plan.id, plan)" />
                    </div>
                  </div>
                  <div class="membresia-field">
                    <label :for="`plan-${plan.id}-prioridad`">Prioridad de reserva</label>
                    <select :id="`plan-${plan.id}-prioridad`" v-model.number="plan.prioridad" @change="store.editarMembresia(plan.id, plan)">
                      <option :value="1">Alta (reserva primero)</option>
                      <option :value="2">Media</option>
                      <option :value="3">Estándar</option>
                    </select>
                  </div>
                  <div class="membresia-field">
                    <span class="field-label">Color identificador</span>
                    <div class="color-picker-row">
                      <div class="color-preview" :style="{ background: plan.color }"></div>
                      <span class="color-hex">{{ plan.color }}</span>
                      <label class="color-pick-btn">
                        Cambiar
                        <input type="color" v-model="plan.color" @change="store.editarMembresia(plan.id, plan)" />
                      </label>
                    </div>
                  </div>
                  <div class="membresia-field">
                    <label :for="`plan-${plan.id}-beneficios`">Beneficios (uno por línea)</label>
                    <textarea
                      :id="`plan-${plan.id}-beneficios`"
                      rows="4"
                      :value="plan.beneficios.join('\n')"
                      @change="plan.beneficios = $event.target.value.split('\n').filter(b => b.trim()); store.editarMembresia(plan.id, plan)"
                    ></textarea>
                  </div>
                </div>
              </div>

              <template #footer>
                <button class="btn-save" @click="save('membresias')">Guardar cambios</button>
              </template>
            </SettingsSection>
          </div>

          <!-- ─── NOTIFICACIONES ─────────────────────────────────────────── -->
          <div v-show="activeSection === 'notificaciones'" class="panel-content">
            <SettingsSection
              title="Notificaciones y alertas"
              subtitle="Controla qué comunicaciones automáticas se envían"
            >
              <div class="notif-list">
                <div
                  v-for="(notif, key) in store.notificaciones"
                  :key="key"
                  class="notif-row"
                >
                  <div class="notif-info">
                    <p class="notif-label">{{ notif.label }}</p>
                    <p class="notif-desc">{{ notif.desc }}</p>
                  </div>
                  <label class="toggle-switch" :aria-label="notif.label">
                    <input type="checkbox" v-model="notif.activo" :aria-label="notif.label" />
                    <span class="toggle-slider" aria-hidden="true"></span>
                  </label>
                </div>
              </div>
              <template #footer>
                <button class="btn-save" @click="save('notificaciones')">Guardar cambios</button>
              </template>
            </SettingsSection>
          </div>

          <!-- ─── APARIENCIA ─────────────────────────────────────────────── -->
          <div v-show="activeSection === 'apariencia'" class="panel-content">
            <!-- Logo -->
            <SettingsSection
              title="Logo e identidad"
              subtitle="Imagen representativa del gimnasio"
            >
              <SettingsForm label="Logo" hint="PNG, SVG o JPG. Recomendado: 320×80px">
                <div class="logo-upload-area" @click="$refs.logoInput.click()">
                  <div v-if="store.apariencia.logoUrl" class="logo-preview">
                    <img :src="store.apariencia.logoUrl" alt="Logo" />
                    <button class="logo-remove" @click.stop="store.apariencia.logoUrl = ''" title="Eliminar">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                  <div v-else class="logo-placeholder">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    <p>Haz clic para subir logo</p>
                    <span>PNG, SVG, JPG</span>
                  </div>
                </div>
                <input
                  ref="logoInput"
                  type="file"
                  accept="image/*"
                  class="hidden-input"
                  @change="handleLogoUpload"
                />
              </SettingsForm>
              <template #footer>
                <button class="btn-save" @click="save('apariencia')">Guardar cambios</button>
              </template>
            </SettingsSection>

            <!-- Colores -->
            <SettingsSection
              title="Paleta de colores"
              subtitle="Colores que definen la identidad visual de la plataforma"
            >
              <SettingsForm label="Color principal" hint="Usado en botones, acentos e íconos activos">
                <div class="color-picker-row">
                  <div class="color-preview large" :style="{ background: store.apariencia.colorPrimario }"></div>
                  <div class="color-picker-info">
                    <span class="color-hex">{{ store.apariencia.colorPrimario }}</span>
                    <label class="color-pick-btn">
                      Cambiar color
                      <input type="color" v-model="store.apariencia.colorPrimario" />
                    </label>
                  </div>
                </div>
              </SettingsForm>
              <SettingsForm label="Color secundario" hint="Usado en fondos, sidebar y elementos de apoyo">
                <div class="color-picker-row">
                  <div class="color-preview large" :style="{ background: store.apariencia.colorSecundario }"></div>
                  <div class="color-picker-info">
                    <span class="color-hex">{{ store.apariencia.colorSecundario }}</span>
                    <label class="color-pick-btn">
                      Cambiar color
                      <input type="color" v-model="store.apariencia.colorSecundario" />
                    </label>
                  </div>
                </div>
              </SettingsForm>
              <SettingsForm label="Fuente tipográfica" hint="Fuente usada en toda la interfaz">
                <select v-model="store.apariencia.fuente" class="input-sm">
                  <option value="Poppins">Poppins (actual)</option>
                  <option value="Inter">Inter</option>
                  <option value="DM Sans">DM Sans</option>
                  <option value="Nunito">Nunito</option>
                </select>
              </SettingsForm>
              <template #footer>
                <button class="btn-outline" @click="resetColors">Restablecer colores</button>
                <button class="btn-save" @click="save('apariencia')">Guardar cambios</button>
              </template>
            </SettingsSection>

            <!-- Tema -->
            <SettingsSection title="Modo de visualización" subtitle="Preferencia de contraste de la interfaz">
              <SettingsForm label="Tema de la interfaz" hint="Afecta el panel administrativo únicamente">
                <div class="theme-row">
                  <button
                    class="theme-btn"
                    :class="{ active: store.apariencia.tema === 'light' }"
                    @click="store.apariencia.tema = 'light'"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                    Claro
                  </button>
                  <button
                    class="theme-btn"
                    :class="{ active: store.apariencia.tema === 'dark' }"
                    @click="store.apariencia.tema = 'dark'"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                    Oscuro
                  </button>
                </div>
              </SettingsForm>
              <template #footer>
                <button class="btn-save" @click="save('apariencia')">Guardar cambios</button>
              </template>
            </SettingsSection>
          </div>

        </div><!-- /settings-panel -->
      </div><!-- /settings-body -->

    <!-- ─── Modal: Clase ──────────────────────────────────────────────────── -->
    <Transition name="modal-fade">
      <div v-if="showClaseModal" class="modal-overlay" @click.self="showClaseModal = false">
        <div class="modal-box">
          <div class="modal-header">
            <h3>{{ claseForm.id ? 'Editar clase' : 'Nueva clase' }}</h3>
            <button class="close-btn" @click="showClaseModal = false">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-grid">
              <div class="form-group form-group--full">
                <label for="clase-nombre">Nombre de la clase</label>
                <input id="clase-nombre" type="text" v-model="claseForm.nombre" placeholder="Ej: Yoga Flow" />
              </div>
              <div class="form-group">
                <label for="clase-instructor">Instructor</label>
                <input id="clase-instructor" type="text" v-model="claseForm.instructor" placeholder="Nombre completo" />
              </div>
              <div class="form-group">
                <label for="clase-duracion">Duración (min)</label>
                <input id="clase-duracion" type="number" v-model.number="claseForm.duracion" min="15" max="180" />
              </div>
              <div class="form-group">
                <label for="clase-cupos">Cupos máximos</label>
                <input id="clase-cupos" type="number" v-model.number="claseForm.cupos" min="1" max="100" />
              </div>
              <div class="form-group">
                <span class="field-label">Color identificador</span>
                <div class="color-picker-row">
                  <div class="color-preview" :style="{ background: claseForm.color }"></div>
                  <label class="color-pick-btn">
                    Elegir
                    <input type="color" v-model="claseForm.color" />
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-cancel" @click="showClaseModal = false">Cancelar</button>
            <button class="btn-save" @click="saveClase" :disabled="!claseForm.nombre.trim()">
              {{ claseForm.id ? 'Guardar cambios' : 'Crear clase' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ─── Toast ─────────────────────────────────────────────────────────── -->
    <Transition name="toast-slide">
      <div v-if="toast" class="toast">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#42B883" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        {{ toast }}
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useSettingsStore } from '@/stores/settingsStore'
import SettingsSidebar from '@/components/SettingsSidebar.vue'
import SettingsSection from '@/components/SettingsSection.vue'
import SettingsForm from '@/components/SettingsForm.vue'

const store = useSettingsStore()

// ── Active section ─────────────────────────────────────────────────────────
const activeSection = ref('general')

// ── Toast ──────────────────────────────────────────────────────────────────
const toast = ref(null)
let toastTimer = null

function showToast(msg = '¡Guardado correctamente!') {
  toast.value = msg
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value = null }, 3000)
}

// ── Save ───────────────────────────────────────────────────────────────────
function save(seccion) {
  store.guardar(seccion)
  showToast()
}

// ── Clase modal ────────────────────────────────────────────────────────────
const showClaseModal = ref(false)
const claseForm = reactive({ id: null, nombre: '', duracion: 60, instructor: '', cupos: 12, color: '#42B883' })

function openAddClase() {
  Object.assign(claseForm, { id: null, nombre: '', duracion: 60, instructor: '', cupos: 12, color: '#42B883' })
  showClaseModal.value = true
}

function openEditClase(clase) {
  Object.assign(claseForm, { ...clase })
  showClaseModal.value = true
}

function saveClase() {
  if (!claseForm.nombre.trim()) return
  if (claseForm.id) {
    store.editarClase(claseForm.id, { ...claseForm })
  } else {
    store.agregarClase({ ...claseForm })
  }
  showClaseModal.value = false
  showToast(claseForm.id ? 'Clase actualizada' : 'Clase creada correctamente')
}

// ── Logo upload ────────────────────────────────────────────────────────────
const logoInput = ref(null)

function handleLogoUpload(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => { store.apariencia.logoUrl = ev.target.result }
  reader.readAsDataURL(file)
}

// ── Reset colors ───────────────────────────────────────────────────────────
function resetColors() {
  store.apariencia.colorPrimario   = '#42B883'
  store.apariencia.colorSecundario = '#35495E'
  showToast('Colores restablecidos')
}
</script>

<style scoped>
/* ── Layout ──────────────────────────────────────────────────────────────── */
.settings-main {
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
}

.topbar__avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #35495E;
  color: #f9fafb;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── Settings body ───────────────────────────────────────────────────────── */
.settings-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.settings-panel {
  flex: 1;
  padding: 1.75rem 2rem;
  overflow-y: auto;
}

.panel-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-width: 780px;
}

/* ── Shared form inputs ──────────────────────────────────────────────────── */
input[type='text'],
input[type='email'],
input[type='tel'],
input[type='url'],
input[type='time'],
input[type='number'],
select,
textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--color-gray-light);
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  font-family: inherit;
  color: var(--color-text);
  background: var(--color-white);
  transition: var(--transition);
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.12);
}

.input-sm {
  max-width: 160px;
}

.input-with-unit {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.unit {
  font-size: 0.82rem;
  color: var(--color-text-muted);
  white-space: nowrap;
}

.char-count {
  font-size: 0.72rem;
  color: var(--color-text-muted);
  text-align: right;
}

.hidden-input {
  display: none;
}

/* ── Days grid ───────────────────────────────────────────────────────────── */
.days-grid {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.day-btn {
  padding: 5px 14px;
  border-radius: 100px;
  font-size: 0.78rem;
  font-weight: 600;
  font-family: inherit;
  border: 1.5px solid var(--color-gray-light);
  background: var(--color-white);
  color: var(--color-text-muted);
  cursor: pointer;
  transition: var(--transition);
  text-transform: capitalize;
}

.day-btn.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}

.day-btn:hover:not(.active) {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

/* ── Add button ──────────────────────────────────────────────────────────── */
.btn-add {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 16px;
  border-radius: var(--radius-sm);
  background: var(--color-primary);
  color: #fff;
  font-size: 0.8rem;
  font-weight: 600;
  font-family: inherit;
  border: none;
  cursor: pointer;
  transition: var(--transition);
}

.btn-add:hover { background: var(--color-primary-dark); }

/* ── Clase list ──────────────────────────────────────────────────────────── */
.clase-list {
  display: flex;
  flex-direction: column;
}

.clase-card {
  display: flex;
  align-items: center;
  gap: 0;
  border-bottom: 1px solid rgba(229, 231, 235, 0.6);
  transition: background var(--transition);
  overflow: hidden;
}

.clase-card:last-child { border-bottom: none; }
.clase-card:hover { background: rgba(249, 250, 251, 0.8); }

.clase-color-bar {
  width: 4px;
  align-self: stretch;
  flex-shrink: 0;
}

.clase-info {
  flex: 1;
  padding: 1rem 1.25rem;
}

.clase-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-dark);
  margin-bottom: 3px;
}

.clase-meta {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  gap: 5px;
}

.meta-dot { opacity: 0.4; }

.clase-actions {
  display: flex;
  gap: 4px;
  padding-right: 1.25rem;
}

/* ── Membresías ──────────────────────────────────────────────────────────── */
.membresia-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1rem;
  padding: 1.25rem 1.75rem;
}

.membresia-card {
  border: 1.5px solid var(--color-gray-light);
  border-radius: var(--radius-md);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  background: var(--color-white);
  transition: var(--transition);
  box-shadow: var(--shadow-sm);
}

.membresia-card:hover {
  border-color: var(--plan-color, var(--color-primary));
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.06);
}

.membresia-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.membresia-color-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.membresia-field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.membresia-field label,
.membresia-field .field-label {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-muted);
}

.membresia-field input,
.membresia-field select,
.membresia-field textarea {
  padding: 7px 10px;
  font-size: 0.84rem;
}

.membresia-field textarea {
  resize: vertical;
  min-height: 90px;
}

.membresia-row2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

/* ── Notifications ───────────────────────────────────────────────────────── */
.notif-list {
  display: flex;
  flex-direction: column;
}

.notif-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 1.125rem 1.75rem;
  border-bottom: 1px solid rgba(229, 231, 235, 0.6);
  transition: background var(--transition);
}

.notif-row:last-child { border-bottom: none; }
.notif-row:hover { background: rgba(249, 250, 251, 0.6); }

.notif-info { flex: 1; }

.notif-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-dark);
  margin-bottom: 2px;
}

.notif-desc {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

/* Toggle switch */
.toggle-switch {
  position: relative;
  width: 44px;
  height: 24px;
  flex-shrink: 0;
  cursor: pointer;
}

.toggle-switch input { display: none; }

.toggle-slider {
  position: absolute;
  inset: 0;
  background: #D1D5DB;
  border-radius: 100px;
  transition: var(--transition);
}

.toggle-slider::before {
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
  left: 3px;
  top: 3px;
  background: #fff;
  border-radius: 50%;
  transition: var(--transition);
  box-shadow: 0 1px 4px rgba(0,0,0,0.15);
}

.toggle-switch input:checked + .toggle-slider {
  background: var(--color-primary);
}

.toggle-switch input:checked + .toggle-slider::before {
  transform: translateX(20px);
}

/* ── Apariencia ──────────────────────────────────────────────────────────── */
.logo-upload-area {
  width: 100%;
  max-width: 320px;
  border: 2px dashed var(--color-gray-light);
  border-radius: var(--radius-md);
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
  min-height: 110px;
}

.logo-upload-area:hover {
  border-color: var(--color-primary);
  background: rgba(66, 184, 131, 0.03);
}

.logo-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-align: center;
}

.logo-placeholder p {
  font-size: 0.84rem;
  font-weight: 500;
  color: var(--color-text-muted);
}

.logo-placeholder span {
  font-size: 0.72rem;
  color: var(--color-gray-light);
}

.logo-preview {
  position: relative;
  display: inline-flex;
}

.logo-preview img {
  max-height: 60px;
  max-width: 240px;
  object-fit: contain;
}

.logo-remove {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #b91c1c;
  color: #fef2f2;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.75rem;
  line-height: 1;
}

/* Color picker */
.color-picker-row {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.color-preview {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  border: 1.5px solid rgba(0,0,0,0.08);
  flex-shrink: 0;
}

.color-preview.large {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
}

.color-picker-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.color-hex {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-dark);
  font-family: monospace;
}

.color-pick-btn {
  display: inline-flex;
  padding: 6px 14px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-gray-light);
  background: var(--color-white);
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--color-dark);
  cursor: pointer;
  transition: var(--transition);
  font-family: inherit;
}

.color-pick-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.color-pick-btn input[type='color'] {
  display: none;
}

/* Theme buttons */
.theme-row {
  display: flex;
  gap: 0.75rem;
}

.theme-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: var(--radius-sm);
  border: 1.5px solid var(--color-gray-light);
  background: var(--color-white);
  color: var(--color-text-muted);
  font-size: 0.875rem;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: var(--transition);
}

.theme-btn.active {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: rgba(66, 184, 131, 0.06);
  font-weight: 600;
}

.theme-btn:hover:not(.active) {
  border-color: var(--color-dark);
  color: var(--color-dark);
}

/* ── Action buttons ──────────────────────────────────────────────────────── */
.icon-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-gray-light);
  background: var(--color-white);
  color: var(--color-text-muted);
  cursor: pointer;
  transition: var(--transition);
}

.icon-btn:hover {
  background: var(--color-bg);
  color: var(--color-dark);
}

.icon-btn--danger:hover {
  border-color: rgba(185, 28, 28, 0.4);
  color: #b91c1c;
  background: #fef2f2;
}

.icon-btn--sm { width: 26px; height: 26px; }

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

.btn-outline {
  padding: 9px 22px;
  border-radius: var(--radius-sm);
  background: transparent;
  border: 1px solid var(--color-gray-light);
  color: var(--color-text-muted);
  font-size: 0.875rem;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: var(--transition);
}

.btn-outline:hover { background: var(--color-bg); color: var(--color-dark); }

/* ── Empty state ─────────────────────────────────────────────────────────── */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 3rem;
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

/* ── Modal ───────────────────────────────────────────────────────────────── */
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
  max-width: 500px;
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
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
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
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-group--full {
  grid-column: 1 / -1;
}

.form-group label,
.form-group .field-label {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-muted);
}

.form-group input,
.form-group select {
  padding: 8px 12px;
  border: 1px solid var(--color-gray-light);
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  font-family: inherit;
  color: var(--color-text);
  background: var(--color-bg);
  transition: var(--transition);
  width: 100%;
}

.form-group input:focus, .form-group select:focus {
  outline: none;
  border-color: var(--color-primary);
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
  border-radius: var(--radius-sm);
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

/* ── Toast ───────────────────────────────────────────────────────────────── */
.toast {
  position: fixed;
  bottom: 1.75rem;
  right: 1.75rem;
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

/* ── Transitions ─────────────────────────────────────────────────────────── */
.modal-fade-enter-active, .modal-fade-leave-active { transition: all 0.25s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-from .modal-box, .modal-fade-leave-to .modal-box { transform: scale(0.95); }

.toast-slide-enter-active, .toast-slide-leave-active { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.toast-slide-enter-from, .toast-slide-leave-to { opacity: 0; transform: translateY(10px); }

/* ── Responsive ──────────────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .settings-main { margin-left: 0; }
  .settings-panel { padding: 1.25rem; }
  .membresia-grid { grid-template-columns: 1fr; }
  .form-grid { grid-template-columns: 1fr; }
}
</style>
