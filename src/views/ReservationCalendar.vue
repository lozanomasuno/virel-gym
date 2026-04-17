<template>
  <div class="rc-root">

    <!-- ══════════════ TOP BAR ══════════════════════════════════════════════ -->
    <header class="rc-topbar">
      <div class="rc-topbar__left">
        <h1 class="rc-topbar__title">Reservaciones</h1>
        <p class="rc-topbar__sub">Gestión del calendario de clases</p>
      </div>

      <div class="rc-topbar__right">
        <!-- View switcher (Strategy: calendar | list) -->
        <div class="view-switcher" role="group" aria-label="Modo de vista">
          <button
            v-for="v in VIEWS"
            :key="v.id"
            class="view-btn"
            :class="{ 'view-btn--active': activeView === v.id }"
            :aria-pressed="String(activeView === v.id)"
            @click="activeView = v.id"
          >
            <!-- eslint-disable-next-line vue/no-v-html -->
            <span v-html="v.icon" aria-hidden="true" />
            {{ v.label }}
          </button>
        </div>

        <!-- New reservation -->
        <button class="rc-btn-new" @click="openModal()">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <span v-html="ICONS.plus" aria-hidden="true" />
          Nueva reserva
        </button>

        <div class="rc-avatar" aria-hidden="true">AV</div>
      </div>
    </header>

    <!-- ══════════════ METRICS STRIP ════════════════════════════════════════ -->
    <section class="rc-metrics" aria-label="Resumen de reservas">
      <div
        v-for="m in metrics"
        :key="m.id"
        class="rc-metric"
        :style="{ '--accent': m.color }"
      >
        <div class="rc-metric__top">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <span class="rc-metric__icon" v-html="m.icon" aria-hidden="true" />
          <span
            class="rc-metric__delta"
            :class="m.delta > 0 ? 'rc-metric__delta--up' : 'rc-metric__delta--dn'"
          >
            {{ m.delta > 0 ? '+' : '' }}{{ m.delta }}%
          </span>
        </div>
        <p class="rc-metric__val">{{ m.value }}</p>
        <p class="rc-metric__label">{{ m.label }}</p>
      </div>
    </section>

    <!-- ══════════════ CALENDAR TOOLBAR ═════════════════════════════════════ -->
    <div class="rc-toolbar">
      <!-- Month navigation -->
      <div class="rc-month-nav">
        <button class="rc-nav-btn" aria-label="Mes anterior" @click="prevMonth">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <span v-html="ICONS.chevLeft" aria-hidden="true" />
        </button>
        <Transition name="month-slide" mode="out-in">
          <h2 :key="monthKey" class="rc-month-title">{{ monthTitle }}</h2>
        </Transition>
        <button class="rc-nav-btn" aria-label="Mes siguiente" @click="nextMonth">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <span v-html="ICONS.chevRight" aria-hidden="true" />
        </button>
        <button class="rc-today-btn" @click="goToday">Hoy</button>
      </div>

      <!-- Filters (Strategy: por tipo de clase) -->
      <div class="rc-filters" role="group" aria-label="Filtrar por tipo">
        <button
          v-for="f in CLASS_FILTERS"
          :key="f.value"
          class="rc-filter-btn"
          :class="{ 'rc-filter-btn--active': activeFilter === f.value }"
          @click="activeFilter = f.value"
        >
          <span
            v-if="f.color"
            class="rc-filter-dot"
            :style="{ background: f.color }"
            aria-hidden="true"
          />
          {{ f.label }}
        </button>
      </div>
    </div>

    <!-- ══════════════ MAIN AREA ═════════════════════════════════════════════ -->
    <div class="rc-body">

      <!-- ── CALENDAR VIEW ──────────────────────────────────────────────── -->
      <Transition name="view-fade" mode="out-in">
        <section v-if="activeView === 'calendar'" key="cal" class="rc-calendar" aria-label="Calendario">

          <!-- Weekday headers -->
          <div class="cal-head" aria-hidden="true">
            <span v-for="d in WEEKDAYS" :key="d">{{ d }}</span>
          </div>

          <!-- Day cells -->
          <div class="cal-grid">
            <div
              v-for="cell in calendarCells"
              :key="cell.key"
              class="cal-cell"
              :class="{
                'cal-cell--out':     !cell.inMonth,
                'cal-cell--today':    cell.isToday,
                'cal-cell--selected': cell.isSelected,
                'cal-cell--hasevt':   cell.events.length > 0,
              }"
              :aria-label="cell.ariaLabel"
              :aria-current="cell.isToday ? 'date' : undefined"
              @click="selectDay(cell)"
            >
              <span class="cal-cell__num">{{ cell.day }}</span>

              <!-- Event pills -->
              <div class="cal-cell__events">
                <div
                  v-for="(ev, i) in cell.events.slice(0, 3)"
                  :key="ev.id"
                  class="cal-pill"
                  :style="{ background: ev.color }"
                  :title="ev.clase"
                >
                  <span v-if="i < 2" class="cal-pill__txt">{{ ev.clase }}</span>
                  <span v-else class="cal-pill__more">+{{ cell.events.length - 2 }}</span>
                </div>
              </div>
            </div>
          </div>

        </section><!-- /calendar -->

        <!-- ── LIST VIEW ──────────────────────────────────────────────────── -->
        <section v-else key="list" class="rc-list" aria-label="Lista de reservas">

          <!-- Group by day -->
          <template v-for="group in listGroups" :key="group.date">
            <div class="list-day-header">
              <span class="list-day-header__date">{{ group.dateLabel }}</span>
              <span class="list-day-header__count">{{ group.items.length }} clase{{ group.items.length !== 1 ? 's' : '' }}</span>
            </div>

            <div
              v-for="ev in group.items"
              :key="ev.id"
              class="list-item"
              :class="{ 'list-item--cancelled': ev.status === 'cancelled' }"
            >
              <div class="list-item__bar" :style="{ background: ev.color }" aria-hidden="true" />

              <div class="list-item__time">
                <p class="list-item__hour">{{ ev.hora }}</p>
                <p class="list-item__dur">{{ ev.duracion }}min</p>
              </div>

              <div class="list-item__info">
                <p class="list-item__clase">{{ ev.clase }}</p>
                <p class="list-item__instructor">{{ ev.instructor }}</p>
              </div>

              <div class="list-item__mid">
                <div class="list-item__spots">
                  <!-- eslint-disable-next-line vue/no-v-html -->
                  <span v-html="ICONS.users" aria-hidden="true" />
                  {{ ev.inscritos }}/{{ ev.capacidad }}
                </div>
                <div class="spots-bar" :aria-label="`${ev.inscritos} de ${ev.capacidad} lugares ocupados`">
                  <div
                    class="spots-bar__fill"
                    :style="{
                      width: `${(ev.inscritos / ev.capacidad) * 100}%`,
                      background: spotsColor(ev),
                    }"
                  />
                </div>
              </div>

              <!-- Status / actions -->
              <div class="list-item__right">
                <span class="list-item__status" :class="`list-item__status--${ev.status}`">
                  {{ STATUS_LABELS[ev.status] }}
                </span>
                <div class="list-item__actions">
                  <button
                    class="rc-icon-btn"
                    aria-label="Editar reserva"
                    @click="openModal(ev)"
                  >
                    <!-- eslint-disable-next-line vue/no-v-html -->
                    <span v-html="ICONS.edit" aria-hidden="true" />
                  </button>
                  <button
                    v-if="ev.status !== 'cancelled'"
                    class="rc-icon-btn rc-icon-btn--danger"
                    aria-label="Cancelar reserva"
                    @click="cancelReservation(ev.id)"
                  >
                    <!-- eslint-disable-next-line vue/no-v-html -->
                    <span v-html="ICONS.trash" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </template>

          <p v-if="!listGroups.length" class="rc-empty">
            No hay reservas para este período.
          </p>

        </section><!-- /list -->
      </Transition>

      <!-- ── DAY DETAIL PANEL ───────────────────────────────────────────── -->
      <Transition name="panel-slide">
        <aside
          v-if="selectedDay"
          class="rc-day-panel"
          :aria-label="`Detalle del ${selectedDayLabel}`"
        >
          <div class="day-panel__hd">
            <div>
              <p class="day-panel__title">{{ selectedDayLabel }}</p>
              <p class="day-panel__count">{{ selectedDayEvents.length }} clases</p>
            </div>
            <button
              class="day-panel__close"
              aria-label="Cerrar panel"
              @click="selectedDay = null"
            >
              <!-- eslint-disable-next-line vue/no-v-html -->
              <span v-html="ICONS.close" aria-hidden="true" />
            </button>
          </div>

          <div v-if="selectedDayEvents.length" class="day-panel__list">
            <div
              v-for="ev in selectedDayEvents"
              :key="ev.id"
              class="day-event"
            >
              <div class="day-event__bar" :style="{ background: ev.color }" aria-hidden="true" />
              <div class="day-event__body">
                <p class="day-event__clase">{{ ev.clase }}</p>
                <p class="day-event__meta">{{ ev.hora }} · {{ ev.instructor }}</p>
                <p class="day-event__meta">{{ ev.inscritos }}/{{ ev.capacidad }} inscritos</p>
              </div>
              <span class="day-event__status" :class="`list-item__status--${ev.status}`">
                {{ STATUS_LABELS[ev.status] }}
              </span>
            </div>
          </div>

          <p v-else class="day-panel__empty">Sin clases este día</p>

          <button class="day-panel__add" @click="openModal()">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <span v-html="ICONS.plus" aria-hidden="true" />
            Agregar clase
          </button>
        </aside>
      </Transition>

    </div><!-- /rc-body -->

    <!-- ══════════════ MODAL ═════════════════════════════════════════════════ -->
    <Transition name="modal-in">
      <div v-if="modalOpen" class="rc-modal-overlay" @click.self="closeModal">
        <div class="rc-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">

          <div class="rc-modal__hd">
            <h3 id="modal-title" class="rc-modal__title">
              {{ editingId ? 'Editar reserva' : 'Nueva reserva' }}
            </h3>
            <button class="rc-modal__close" aria-label="Cerrar" @click="closeModal">
              <!-- eslint-disable-next-line vue/no-v-html -->
              <span v-html="ICONS.close" aria-hidden="true" />
            </button>
          </div>

          <form class="rc-modal__body" @submit.prevent="saveReservation" novalidate>

            <div class="rc-field">
              <label for="modal-clase" class="rc-label">Clase</label>
              <select id="modal-clase" v-model="form.clase" class="rc-input">
                <option value="" disabled>Seleccionar clase…</option>
                <option v-for="c in CLASS_OPTIONS" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>

            <div class="rc-field-row">
              <div class="rc-field">
                <label for="modal-fecha" class="rc-label">Fecha</label>
                <input id="modal-fecha" v-model="form.fecha" type="date" class="rc-input" />
              </div>
              <div class="rc-field">
                <label for="modal-hora" class="rc-label">Hora</label>
                <input id="modal-hora" v-model="form.hora" type="time" class="rc-input" />
              </div>
            </div>

            <div class="rc-field-row">
              <div class="rc-field">
                <label for="modal-instructor" class="rc-label">Instructor</label>
                <input
                  id="modal-instructor"
                  v-model="form.instructor"
                  type="text"
                  placeholder="Nombre del instructor"
                  class="rc-input"
                  autocomplete="off"
                />
              </div>
              <div class="rc-field">
                <label for="modal-dur" class="rc-label">Duración (min)</label>
                <input
                  id="modal-dur"
                  v-model.number="form.duracion"
                  type="number"
                  min="15"
                  max="180"
                  step="15"
                  class="rc-input"
                />
              </div>
            </div>

            <div class="rc-field-row">
              <div class="rc-field">
                <label for="modal-cap" class="rc-label">Capacidad</label>
                <input
                  id="modal-cap"
                  v-model.number="form.capacidad"
                  type="number"
                  min="1"
                  max="50"
                  class="rc-input"
                />
              </div>
              <div class="rc-field">
                <label for="modal-status" class="rc-label">Estado</label>
                <select id="modal-status" v-model="form.status" class="rc-input">
                  <option value="active">Activa</option>
                  <option value="full">Llena</option>
                  <option value="cancelled">Cancelada</option>
                </select>
              </div>
            </div>

            <!-- Error -->
            <Transition name="field-err">
              <p v-if="formError" class="rc-form-error" role="alert">{{ formError }}</p>
            </Transition>

            <div class="rc-modal__footer">
              <button type="button" class="rc-btn-cancel" @click="closeModal">Cancelar</button>
              <button type="submit" class="rc-btn-save" :disabled="!canSave">
                {{ editingId ? 'Guardar cambios' : 'Crear reserva' }}
              </button>
            </div>

          </form>
        </div>
      </div>
    </Transition>

    <!-- Toast -->
    <Transition name="toast-in">
      <div v-if="toast" class="rc-toast" role="status" aria-live="polite">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <span v-html="ICONS.check" aria-hidden="true" />
        {{ toast }}
      </div>
    </Transition>

  </div><!-- /rc-root -->
</template>

<script setup>
import { ref, computed, reactive, watch } from 'vue'

// ══════════════════════════════════════════════════════════════════════════
// ICONS
// ══════════════════════════════════════════════════════════════════════════
const ICONS = {
  plus:      `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  chevLeft:  `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`,
  chevRight: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`,
  calendar:  `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  list:      `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="3" cy="6" r="1"/><circle cx="3" cy="12" r="1"/><circle cx="3" cy="18" r="1"/></svg>`,
  users:     `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  edit:      `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  trash:     `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>`,
  close:     `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  check:     `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  bolt:      `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  check2:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="16 10 11 15 8 12"/></svg>`,
  x2:        `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
}

// ══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ══════════════════════════════════════════════════════════════════════════
const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

const CLASS_COLORS = {
  'Yoga Flow':    '#42B883',
  'Spinning':     '#3B82F6',
  'Pilates Core': '#8B5CF6',
  'Crossfit':     '#F59E0B',
  'Zumba':        '#EC4899',
  'Natación':     '#06B6D4',
}

const CLASS_OPTIONS = Object.keys(CLASS_COLORS)

const CLASS_FILTERS = [
  { value: 'all',   label: 'Todas',   color: null      },
  { value: 'Yoga Flow',    label: 'Yoga',     color: '#42B883' },
  { value: 'Spinning',     label: 'Spinning', color: '#3B82F6' },
  { value: 'Pilates Core', label: 'Pilates',  color: '#8B5CF6' },
  { value: 'Crossfit',     label: 'Crossfit', color: '#F59E0B' },
  { value: 'Zumba',        label: 'Zumba',    color: '#EC4899' },
  { value: 'Natación',     label: 'Natación', color: '#06B6D4' },
]

const STATUS_LABELS = {
  active:    'Activa',
  full:      'Llena',
  cancelled: 'Cancelada',
}

// Strategy: porcentaje de ocupación → color
function spotsColor(ev) {
  const pct = ev.inscritos / ev.capacidad
  if (pct >= 1)   return '#B91C1C'
  if (pct >= 0.8) return '#F59E0B'
  return '#42B883'
}

// View switcher options
const VIEWS = [
  { id: 'calendar', label: 'Calendario', icon: ICONS.calendar },
  { id: 'list',     label: 'Lista',      icon: ICONS.list     },
]

// ══════════════════════════════════════════════════════════════════════════
// METRICS (Factory: construidos con la misma forma)
// ══════════════════════════════════════════════════════════════════════════
function makeMetric(id, label, value, delta, icon, color) {
  return { id, label, value, delta, icon, color }
}

const metrics = [
  makeMetric('total',     'Total este mes',    148,  '+12', ICONS.calendar, '#42B883'),
  makeMetric('active',    'Reservas activas',   34,  '+5',  ICONS.bolt,     '#3B82F6'),
  makeMetric('confirmed', 'Confirmadas',        102, '+8',  ICONS.check2,   '#8B5CF6'),
  makeMetric('cancelled', 'Canceladas',          12, '-3',  ICONS.x2,       '#F59E0B'),
]

// ══════════════════════════════════════════════════════════════════════════
// RESERVATIONS DATA (seed)
// ══════════════════════════════════════════════════════════════════════════
let nextId = 100

function makeReservation(clase, fecha, hora, instructor, inscritos, capacidad, status = 'active') {
  return {
    id: ++nextId,
    clase,
    fecha,     // 'YYYY-MM-DD'
    hora,      // 'HH:MM'
    instructor,
    inscritos,
    capacidad,
    duracion: 60,
    status,
    color: CLASS_COLORS[clase] ?? '#42B883',
  }
}

// Seed en torno al mes actual
const today    = new Date()
const yy       = today.getFullYear()
const mm       = String(today.getMonth() + 1).padStart(2, '0')

const reservations = ref([
  makeReservation('Yoga Flow',    `${yy}-${mm}-03`, '07:00', 'Laura Díaz',    18, 20, 'active'),
  makeReservation('Spinning',     `${yy}-${mm}-03`, '09:00', 'Carlos Reyes',  20, 20, 'full'),
  makeReservation('Pilates Core', `${yy}-${mm}-05`, '10:00', 'Sandra Mora',   12, 15, 'active'),
  makeReservation('Crossfit',     `${yy}-${mm}-07`, '06:30', 'Miguel Torres', 15, 18, 'active'),
  makeReservation('Zumba',        `${yy}-${mm}-10`, '18:30', 'Ana García',    22, 25, 'active'),
  makeReservation('Natación',     `${yy}-${mm}-10`, '07:30', 'Pedro Ávila',    8, 12, 'active'),
  makeReservation('Yoga Flow',    `${yy}-${mm}-12`, '07:00', 'Laura Díaz',    14, 20, 'active'),
  makeReservation('Crossfit',     `${yy}-${mm}-14`, '06:30', 'Miguel Torres',  5, 18, 'cancelled'),
  makeReservation('Spinning',     `${yy}-${mm}-17`, '09:00', 'Carlos Reyes',  19, 20, 'active'),
  makeReservation('Pilates Core', `${yy}-${mm}-17`, '17:00', 'Sandra Mora',   11, 15, 'active'),
  makeReservation('Zumba',        `${yy}-${mm}-20`, '18:30', 'Ana García',    24, 25, 'active'),
  makeReservation('Yoga Flow',    `${yy}-${mm}-22`, '07:00', 'Laura Díaz',    20, 20, 'full'),
  makeReservation('Natación',     `${yy}-${mm}-24`, '07:30', 'Pedro Ávila',   10, 12, 'active'),
  makeReservation('Crossfit',     `${yy}-${mm}-26`, '06:30', 'Miguel Torres', 17, 18, 'active'),
  makeReservation('Spinning',     `${yy}-${mm}-28`, '09:00', 'Carlos Reyes',  15, 20, 'active'),
])

// ══════════════════════════════════════════════════════════════════════════
// CALENDAR STATE
// ══════════════════════════════════════════════════════════════════════════
const curYear  = ref(today.getFullYear())
const curMonth = ref(today.getMonth())   // 0-based

const monthTitle = computed(() => `${MONTH_NAMES[curMonth.value]} ${curYear.value}`)
const monthKey   = computed(() => `${curYear.value}-${curMonth.value}`)

function prevMonth() {
  if (curMonth.value === 0) { curMonth.value = 11; curYear.value-- }
  else curMonth.value--
}

function nextMonth() {
  if (curMonth.value === 11) { curMonth.value = 0; curYear.value++ }
  else curMonth.value++
}

function goToday() {
  const now = new Date()
  curYear.value  = now.getFullYear()
  curMonth.value = now.getMonth()
}

// ══════════════════════════════════════════════════════════════════════════
// FILTERS
// ══════════════════════════════════════════════════════════════════════════
const activeFilter = ref('all')

// Strategy: filtrar por tipo de clase
const filteredReservations = computed(() =>
  activeFilter.value === 'all'
    ? reservations.value
    : reservations.value.filter((r) => r.clase === activeFilter.value)
)

// ══════════════════════════════════════════════════════════════════════════
// CALENDAR CELLS (Observer: se recalcula al cambiar mes o filtro)
// ══════════════════════════════════════════════════════════════════════════
const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

const calendarCells = computed(() => {
  const year  = curYear.value
  const month = curMonth.value
  const first = new Date(year, month, 1).getDay()   // 0 = Dom
  const days  = new Date(year, month + 1, 0).getDate()

  const cells = []

  // Padding from previous month
  const prevDays = new Date(year, month, 0).getDate()
  for (let i = first - 1; i >= 0; i--) {
    const d   = prevDays - i
    const key = `prev-${d}`
    cells.push({ key, day: d, inMonth: false, isToday: false, isSelected: false, events: [], ariaLabel: '' })
  }

  // Current month
  for (let d = 1; d <= days; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const evs     = filteredReservations.value.filter((r) => r.fecha === dateStr)
    cells.push({
      key:        dateStr,
      day:        d,
      inMonth:    true,
      isToday:    dateStr === todayStr,
      isSelected: selectedDay.value === dateStr,
      events:     evs,
      ariaLabel:  `${d} de ${MONTH_NAMES[month]}${evs.length ? `, ${evs.length} clase${evs.length > 1 ? 's' : ''}` : ''}`,
    })
  }

  // Padding to next month
  const remaining = 42 - cells.length
  for (let d = 1; d <= remaining; d++) {
    cells.push({ key: `next-${d}`, day: d, inMonth: false, isToday: false, isSelected: false, events: [], ariaLabel: '' })
  }

  return cells
})

// ══════════════════════════════════════════════════════════════════════════
// DAY SELECTION
// ══════════════════════════════════════════════════════════════════════════
const selectedDay = ref(null)

const selectedDayLabel = computed(() => {
  if (!selectedDay.value) return ''
  const [, , d] = selectedDay.value.split('-')
  return `${parseInt(d)} de ${MONTH_NAMES[curMonth.value]}, ${curYear.value}`
})

const selectedDayEvents = computed(() =>
  filteredReservations.value.filter((r) => r.fecha === selectedDay.value)
)

function selectDay(cell) {
  if (!cell.inMonth) return
  selectedDay.value = selectedDay.value === cell.key ? null : cell.key
}

// ══════════════════════════════════════════════════════════════════════════
// LIST VIEW
// ══════════════════════════════════════════════════════════════════════════
const activeView = ref('calendar')

const listGroups = computed(() => {
  const sorted = [...filteredReservations.value].sort((a, b) => {
    const da = a.fecha + a.hora
    const db = b.fecha + b.hora
    return da.localeCompare(db)
  })

  const map = new Map()
  for (const ev of sorted) {
    if (!map.has(ev.fecha)) map.set(ev.fecha, [])
    map.get(ev.fecha).push(ev)
  }

  return [...map.entries()].map(([date, items]) => {
    const [yr, mo, dy] = date.split('-').map(Number)
    const label = new Date(yr, mo - 1, dy).toLocaleDateString('es-MX', {
      weekday: 'long', day: 'numeric', month: 'long',
    })
    // Capitalize first letter
    const dateLabel = label.charAt(0).toUpperCase() + label.slice(1)
    return { date, dateLabel, items }
  })
})

// ══════════════════════════════════════════════════════════════════════════
// MODAL — CRUD
// ══════════════════════════════════════════════════════════════════════════
const modalOpen  = ref(false)
const editingId  = ref(null)
const formError  = ref('')

const form = reactive({
  clase:      '',
  fecha:      todayStr,
  hora:       '07:00',
  instructor: '',
  duracion:   60,
  capacidad:  20,
  status:     'active',
})

const canSave = computed(() =>
  form.clase && form.fecha && form.hora && form.instructor.trim().length >= 2
)

function openModal(ev = null) {
  formError.value = ''
  if (ev) {
    editingId.value = ev.id
    Object.assign(form, {
      clase: ev.clase, fecha: ev.fecha, hora: ev.hora,
      instructor: ev.instructor, duracion: ev.duracion,
      capacidad: ev.capacidad, status: ev.status,
    })
  } else {
    editingId.value = null
    Object.assign(form, {
      clase: '', fecha: selectedDay.value ?? todayStr,
      hora: '07:00', instructor: '', duracion: 60, capacidad: 20, status: 'active',
    })
  }
  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
  editingId.value  = null
  formError.value  = ''
}

function saveReservation() {
  if (!canSave.value) {
    formError.value = 'Completa todos los campos requeridos'
    return
  }
  formError.value = ''

  if (editingId.value) {
    // Update
    const idx = reservations.value.findIndex((r) => r.id === editingId.value)
    if (idx !== -1) {
      reservations.value[idx] = {
        ...reservations.value[idx],
        ...form,
        color: CLASS_COLORS[form.clase] ?? '#42B883',
      }
    }
    showToast('Reserva actualizada')
  } else {
    // Create (Factory)
    reservations.value.push(makeReservation(
      form.clase, form.fecha, form.hora, form.instructor,
      0, form.capacidad, form.status,
    ))
    showToast('Reserva creada exitosamente')
  }

  closeModal()
}

function cancelReservation(id) {
  const idx = reservations.value.findIndex((r) => r.id === id)
  if (idx !== -1) reservations.value[idx].status = 'cancelled'
  showToast('Reserva cancelada')
}

// ══════════════════════════════════════════════════════════════════════════
// TOAST
// ══════════════════════════════════════════════════════════════════════════
const toast   = ref('')
let toastTimer = null

function showToast(msg) {
  toast.value = msg
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value = '' }, 3000)
}

// Clear timer on unmount
watch(toast, (val) => { if (!val) clearTimeout(toastTimer) })
</script>

<style scoped>
/* ════════════════════════════════════════════════════════════════════════
   ROOT
════════════════════════════════════════════════════════════════════════ */
.rc-root {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #F9FAFB;
  padding-bottom: 2rem;
}

/* ════════════════════════════════════════════════════════════════════════
   TOPBAR
════════════════════════════════════════════════════════════════════════ */
.rc-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 24px 28px 20px;
  flex-wrap: wrap;
}

.rc-topbar__title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1F2937;
  letter-spacing: -0.03em;
  line-height: 1.1;
}

.rc-topbar__sub {
  font-size: 0.85rem;
  color: #4B5563;
  margin-top: 3px;
}

.rc-topbar__right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

/* View switcher */
.view-switcher {
  display: flex;
  background: #F3F4F6;
  border-radius: 10px;
  padding: 3px;
  gap: 2px;
}

.view-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  border: none;
  background: none;
  font-size: 0.82rem;
  font-weight: 600;
  color: #4B5563;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s ease, color 0.15s ease;
}

.view-btn:hover { color: #1F2937; }

.view-btn--active {
  background: #fff;
  color: #1F2937;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

/* New reservation button */
.rc-btn-new {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 9px 16px;
  border-radius: 10px;
  background: #42B883;
  color: #072e1a;         /* 9.2:1 ✓ */
  font-size: 0.875rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
  box-shadow: 0 3px 12px rgba(66, 184, 131, 0.3);
}

.rc-btn-new:hover {
  background: #359a6d;
  transform: translateY(-1px);
  box-shadow: 0 5px 18px rgba(66, 184, 131, 0.38);
}

.rc-avatar {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #35495E;
  color: #F1F5F9;         /* 8.14:1 ✓ */
  font-size: 0.72rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* ════════════════════════════════════════════════════════════════════════
   METRICS
════════════════════════════════════════════════════════════════════════ */
.rc-metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  padding: 0 28px 20px;
}

.rc-metric {
  background: #fff;
  border-radius: 16px;
  border: 1.5px solid #E5E7EB;
  padding: 16px 18px;
  transition: border-color 0.18s ease, box-shadow 0.18s ease;
}

.rc-metric:hover {
  border-color: var(--accent, #42B883);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.rc-metric__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.rc-metric__icon {
  display: flex;
  align-items: center;
  color: var(--accent, #42B883);
}

.rc-metric__delta {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 100px;
}

.rc-metric__delta--up { background: #ECFDF5; color: #065F46; }
.rc-metric__delta--dn { background: #FEF3C7; color: #92400E; }

.rc-metric__val {
  font-size: 1.75rem;
  font-weight: 800;
  color: #1F2937;
  letter-spacing: -0.03em;
  line-height: 1;
  margin-bottom: 4px;
}

.rc-metric__label {
  font-size: 0.78rem;
  color: #4B5563;
  font-weight: 500;
}

/* ════════════════════════════════════════════════════════════════════════
   TOOLBAR
════════════════════════════════════════════════════════════════════════ */
.rc-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px 14px;
  gap: 16px;
  flex-wrap: wrap;
}

/* Month navigation */
.rc-month-nav {
  display: flex;
  align-items: center;
  gap: 6px;
}

.rc-nav-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1.5px solid #E5E7EB;
  background: #fff;
  color: #374151;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
}

.rc-nav-btn:hover { background: #F3F4F6; border-color: #D1D5DB; }

.rc-month-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1F2937;
  min-width: 180px;
  text-align: center;
}

.rc-today-btn {
  padding: 5px 12px;
  border-radius: 8px;
  border: 1.5px solid #E5E7EB;
  background: #fff;
  font-size: 0.8rem;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}

.rc-today-btn:hover {
  background: #42B883;
  border-color: #42B883;
  color: #072e1a;
}

/* Filters */
.rc-filters {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.rc-filter-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 100px;
  border: 1.5px solid #E5E7EB;
  background: #fff;
  font-size: 0.78rem;
  font-weight: 600;
  color: #4B5563;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}

.rc-filter-btn:hover { background: #F3F4F6; border-color: #D1D5DB; }

.rc-filter-btn--active {
  background: #35495E;
  border-color: #35495E;
  color: #F1F5F9;
}

.rc-filter-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* ════════════════════════════════════════════════════════════════════════
   BODY
════════════════════════════════════════════════════════════════════════ */
.rc-body {
  display: flex;
  gap: 16px;
  padding: 0 28px;
  flex: 1;
  align-items: flex-start;
}

/* ════════════════════════════════════════════════════════════════════════
   CALENDAR VIEW
════════════════════════════════════════════════════════════════════════ */
.rc-calendar {
  flex: 1;
  background: #fff;
  border-radius: 18px;
  border: 1.5px solid #E5E7EB;
  overflow: hidden;
}

.cal-head {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: #F9FAFB;
  border-bottom: 1px solid #E5E7EB;
}

.cal-head span {
  padding: 10px 0;
  text-align: center;
  font-size: 0.72rem;
  font-weight: 700;
  color: #4B5563;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.cal-cell {
  min-height: 88px;
  border-right: 1px solid #F3F4F6;
  border-bottom: 1px solid #F3F4F6;
  padding: 6px 8px;
  cursor: pointer;
  transition: background 0.15s ease;
  position: relative;
  overflow: hidden;
}

.cal-cell:nth-child(7n) { border-right: none; }

.cal-cell:hover { background: #F9FAFB; }

.cal-cell--out {
  background: #FAFAFA;
  cursor: default;
}

.cal-cell--out .cal-cell__num { color: #D1D5DB; }
.cal-cell--out:hover { background: #FAFAFA; }

.cal-cell--today .cal-cell__num {
  background: #42B883;
  color: #072e1a;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
}

.cal-cell--selected {
  background: rgba(66, 184, 131, 0.06);
}

.cal-cell__num {
  font-size: 0.8rem;
  font-weight: 600;
  color: #1F2937;
  line-height: 1;
  margin-bottom: 4px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Event pills */
.cal-cell__events {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.cal-pill {
  display: flex;
  align-items: center;
  border-radius: 4px;
  padding: 2px 5px;
  color: #fff;
  font-size: 0.65rem;
  font-weight: 600;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  line-height: 1.3;
}

.cal-pill__txt {
  overflow: hidden;
  text-overflow: ellipsis;
  color: #fff;
}

.cal-pill__more {
  color: #fff;
  font-weight: 700;
}

/* ════════════════════════════════════════════════════════════════════════
   LIST VIEW
════════════════════════════════════════════════════════════════════════ */
.rc-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.list-day-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0 6px;
}

.list-day-header__date {
  font-size: 0.875rem;
  font-weight: 700;
  color: #1F2937;
}

.list-day-header__count {
  font-size: 0.75rem;
  color: #4B5563;
  background: #F3F4F6;
  padding: 2px 10px;
  border-radius: 100px;
  font-weight: 600;
}

.list-item {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #fff;
  border: 1.5px solid #E5E7EB;
  border-radius: 14px;
  padding: 14px 18px;
  transition: border-color 0.18s ease, box-shadow 0.18s ease;
}

.list-item:hover {
  border-color: #D1D5DB;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.list-item--cancelled {
  opacity: 0.6;
}

.list-item__bar {
  width: 4px;
  height: 44px;
  border-radius: 100px;
  flex-shrink: 0;
}

.list-item__time {
  flex-shrink: 0;
  text-align: center;
  min-width: 52px;
}

.list-item__hour {
  font-size: 1rem;
  font-weight: 800;
  color: #1F2937;
  letter-spacing: -0.02em;
}

.list-item__dur {
  font-size: 0.7rem;
  color: #4B5563;
  margin-top: 2px;
}

.list-item__info {
  flex: 1;
  min-width: 0;
}

.list-item__clase {
  font-size: 0.9rem;
  font-weight: 700;
  color: #1F2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.list-item__instructor {
  font-size: 0.78rem;
  color: #4B5563;
  margin-top: 3px;
}

.list-item__mid {
  min-width: 110px;
}

.list-item__spots {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.78rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 5px;
}

.spots-bar {
  height: 5px;
  background: #E5E7EB;
  border-radius: 100px;
  overflow: hidden;
}

.spots-bar__fill {
  height: 100%;
  border-radius: 100px;
  transition: width 0.4s ease;
}

.list-item__right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.list-item__status {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 100px;
}

.list-item__status--active    { background: #ECFDF5; color: #065F46; }
.list-item__status--full      { background: #EFF6FF; color: #1E40AF; }
.list-item__status--cancelled { background: #FEF2F2; color: #B91C1C; }

.list-item__actions {
  display: flex;
  gap: 4px;
}

.rc-icon-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1.5px solid #E5E7EB;
  background: #fff;
  color: #374151;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}

.rc-icon-btn:hover { background: #F3F4F6; border-color: #D1D5DB; }

.rc-icon-btn--danger:hover { background: #FEF2F2; border-color: #FCA5A5; color: #B91C1C; }

.rc-empty {
  text-align: center;
  padding: 40px;
  color: #4B5563;
  font-size: 0.9rem;
}

/* ════════════════════════════════════════════════════════════════════════
   DAY PANEL
════════════════════════════════════════════════════════════════════════ */
.rc-day-panel {
  width: 300px;
  flex-shrink: 0;
  background: #fff;
  border: 1.5px solid #E5E7EB;
  border-radius: 18px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.day-panel__hd {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 18px 18px 14px;
  border-bottom: 1px solid #F3F4F6;
}

.day-panel__title {
  font-size: 0.9rem;
  font-weight: 700;
  color: #1F2937;
  line-height: 1.2;
}

.day-panel__count {
  font-size: 0.72rem;
  color: #4B5563;
  margin-top: 3px;
}

.day-panel__close {
  width: 28px;
  height: 28px;
  border-radius: 7px;
  border: none;
  background: #F3F4F6;
  color: #374151;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s ease;
}

.day-panel__close:hover { background: #E5E7EB; }

.day-panel__list {
  flex: 1;
  overflow-y: auto;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.day-event {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  background: #F9FAFB;
  border: 1px solid #F3F4F6;
}

.day-event__bar {
  width: 3px;
  height: 44px;
  border-radius: 100px;
  flex-shrink: 0;
  margin-top: 2px;
}

.day-event__body { flex: 1; }

.day-event__clase {
  font-size: 0.82rem;
  font-weight: 700;
  color: #1F2937;
}

.day-event__meta {
  font-size: 0.72rem;
  color: #4B5563;
  margin-top: 2px;
}

.day-event__status {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 100px;
  flex-shrink: 0;
}

.day-panel__empty {
  padding: 24px 18px;
  text-align: center;
  font-size: 0.82rem;
  color: #4B5563;
}

.day-panel__add {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  width: 100%;
  padding: 12px;
  border: none;
  background: #F9FAFB;
  border-top: 1px solid #F3F4F6;
  font-size: 0.82rem;
  font-weight: 600;
  color: #42B883;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s ease;
}

.day-panel__add:hover { background: #ECFDF5; }

/* ════════════════════════════════════════════════════════════════════════
   MODAL
════════════════════════════════════════════════════════════════════════ */
.rc-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.42);
  backdrop-filter: blur(3px);
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.rc-modal {
  background: #fff;
  border-radius: 20px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.rc-modal__hd {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 22px 16px;
  border-bottom: 1px solid #F3F4F6;
}

.rc-modal__title {
  font-size: 1.05rem;
  font-weight: 800;
  color: #1F2937;
}

.rc-modal__close {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: #F3F4F6;
  color: #374151;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s ease;
}

.rc-modal__close:hover { background: #E5E7EB; }

.rc-modal__body {
  padding: 20px 22px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.rc-field {
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1;
}

.rc-field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.rc-label {
  font-size: 0.78rem;
  font-weight: 700;
  color: #374151;
}

.rc-input {
  padding: 9px 12px;
  border: 1.5px solid #E5E7EB;
  border-radius: 10px;
  font-size: 0.875rem;
  font-family: inherit;
  color: #1F2937;
  background: #F9FAFB;
  transition: border-color 0.18s ease, box-shadow 0.18s ease;
  outline: none;
  width: 100%;
}

.rc-input:focus {
  border-color: #42B883;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.12);
}

.rc-form-error {
  font-size: 0.78rem;
  color: #B91C1C;
  font-weight: 500;
  background: #FEF2F2;
  padding: 8px 12px;
  border-radius: 8px;
}

.rc-modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 4px;
}

.rc-btn-cancel {
  padding: 9px 18px;
  border-radius: 10px;
  border: 1.5px solid #E5E7EB;
  background: #fff;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s ease;
}

.rc-btn-cancel:hover { background: #F3F4F6; }

.rc-btn-save {
  padding: 9px 20px;
  border-radius: 10px;
  border: none;
  background: #42B883;
  color: #072e1a;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s ease, transform 0.15s ease;
  box-shadow: 0 3px 10px rgba(66, 184, 131, 0.28);
}

.rc-btn-save:hover:not(:disabled) {
  background: #359a6d;
  transform: translateY(-1px);
}

.rc-btn-save:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

/* ════════════════════════════════════════════════════════════════════════
   TOAST
════════════════════════════════════════════════════════════════════════ */
.rc-toast {
  position: fixed;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
  background: #1F2937;
  color: #F9FAFB;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 11px 20px;
  border-radius: 100px;
  display: flex;
  align-items: center;
  gap: 9px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  white-space: nowrap;
}

/* ════════════════════════════════════════════════════════════════════════
   TRANSITIONS
════════════════════════════════════════════════════════════════════════ */

/* Month title */
.month-slide-enter-active { transition: opacity 0.18s ease, transform 0.18s ease; }
.month-slide-leave-active { transition: opacity 0.12s ease; }
.month-slide-enter-from   { opacity: 0; transform: translateX(12px); }
.month-slide-leave-to     { opacity: 0; }

/* View switch */
.view-fade-enter-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.view-fade-leave-active { transition: opacity 0.12s ease; }
.view-fade-enter-from   { opacity: 0; transform: translateY(6px); }
.view-fade-leave-to     { opacity: 0; }

/* Day panel */
.panel-slide-enter-active { transition: opacity 0.22s ease, transform 0.22s cubic-bezier(0.34, 1.2, 0.64, 1); }
.panel-slide-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.panel-slide-enter-from   { opacity: 0; transform: translateX(16px); }
.panel-slide-leave-to     { opacity: 0; transform: translateX(16px); }

/* Modal */
.modal-in-enter-active { transition: opacity 0.2s ease; }
.modal-in-leave-active { transition: opacity 0.15s ease; }
.modal-in-enter-from,
.modal-in-leave-to     { opacity: 0; }

/* Toast */
.toast-in-enter-active { transition: opacity 0.2s ease, transform 0.25s cubic-bezier(0.34, 1.4, 0.64, 1); }
.toast-in-leave-active { transition: opacity 0.2s ease, transform 0.15s ease; }
.toast-in-enter-from   { opacity: 0; transform: translateX(-50%) translateY(12px); }
.toast-in-leave-to     { opacity: 0; transform: translateX(-50%) translateY(12px); }

/* Field error */
.field-err-enter-active { transition: all 0.18s ease; }
.field-err-leave-active { transition: all 0.12s ease; }
.field-err-enter-from   { opacity: 0; transform: translateY(-4px); }
.field-err-leave-to     { opacity: 0; }

/* ════════════════════════════════════════════════════════════════════════
   RESPONSIVE
════════════════════════════════════════════════════════════════════════ */
@media (max-width: 1024px) {
  .rc-metrics { grid-template-columns: repeat(2, 1fr); }
  .rc-day-panel { display: none; }
}

@media (max-width: 768px) {
  .rc-topbar  { padding: 16px 16px 12px; }
  .rc-metrics { padding: 0 16px 14px; grid-template-columns: repeat(2, 1fr); }
  .rc-toolbar { padding: 0 16px 12px; flex-direction: column; align-items: flex-start; }
  .rc-body    { padding: 0 16px; flex-direction: column; }
  .rc-calendar { overflow-x: auto; }
  .cal-cell   { min-height: 60px; }
  .rc-month-title { min-width: 140px; font-size: 0.9rem; }
}

@media (max-width: 480px) {
  .rc-metrics       { grid-template-columns: 1fr 1fr; gap: 10px; }
  .rc-topbar__right { gap: 6px; }
  .view-switcher    { display: none; }
  .rc-field-row     { grid-template-columns: 1fr; }
  .view-btn span    { display: none; }
}
</style>
