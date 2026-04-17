<template>
  <div class="al-root">

    <!-- ── Mobile overlay ───────────────────────────────────────────────────── -->
    <Transition name="fade-overlay">
      <div
        v-if="showOverlay"
        class="al-overlay"
        aria-hidden="true"
        @click="sidebarOpen = false"
      />
    </Transition>

    <!-- ══════════════════ SIDEBAR ══════════════════════════════════════════ -->
    <aside
      class="al-sidebar"
      :class="{ 'al-sidebar--open': sidebarOpen }"
    >

      <!-- Logo ──────────────────────────────────────────────────────────── -->
      <div class="sb-logo">
        <div class="sb-logo__mark">
          <img src="@/assets/logo.svg" alt="" aria-hidden="true" class="sb-logo__img" />
        </div>
        <div class="sb-logo__text">
          <span class="sb-logo__name">Virel</span>
          <span class="sb-logo__tag">Admin Panel</span>
        </div>
      </div>

      <div class="sb-divider" />

      <!-- Navigation (Strategy: navSections ← auth.role) ─────────────────── -->
      <nav class="sb-nav" aria-label="Menú principal">
        <template v-for="section in navSections" :key="section.label">
          <p class="sb-section-label">{{ section.label }}</p>

          <router-link
            v-for="item in section.items"
            :key="item.name"
            :to="{ name: item.name }"
            class="sb-item"
            active-class="sb-item--active"
            @click="sidebarOpen = false"
          >
            <!-- v-html is safe: SVG is hardcoded, not user-supplied -->
            <!-- eslint-disable-next-line vue/no-v-html -->
            <span class="sb-item__icon" v-html="item.icon" aria-hidden="true" />
            <span class="sb-item__label">{{ item.label }}</span>
            <span
              v-if="item.badge"
              class="sb-item__badge"
              :aria-label="`${item.badge} nuevos`"
            >{{ item.badge }}</span>
          </router-link>
        </template>
      </nav>

      <div class="sb-spacer" />

      <!-- Logout ────────────────────────────────────────────────────────── -->
      <button class="sb-logout" @click="handleLogout">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <span class="sb-logout__icon" v-html="ICONS.logout" aria-hidden="true" />
        <span>Cerrar sesión</span>
      </button>

      <div class="sb-divider sb-divider--faint" />

      <!-- User info ─────────────────────────────────────────────────────── -->
      <div class="sb-user">
        <div class="sb-user__av" aria-hidden="true">{{ userInitials }}</div>
        <div class="sb-user__info">
          <p class="sb-user__name">{{ auth.user?.nombre }}</p>
          <p class="sb-user__role">{{ auth.roleLabel }}</p>
        </div>
        <div class="sb-user__online" title="En línea" />
      </div>

    </aside><!-- /al-sidebar -->

    <!-- ══════════════════ BODY ════════════════════════════════════════════ -->
    <div class="al-body">

      <!-- HEADER ────────────────────────────────────────────────────────── -->
      <header class="al-header">

        <!-- Hamburger — visible only on mobile ─────────────────────────── -->
        <button
          class="al-hbg"
          :aria-label="sidebarOpen ? 'Cerrar menú lateral' : 'Abrir menú lateral'"
          :aria-expanded="String(sidebarOpen)"
          @click="sidebarOpen = !sidebarOpen"
        >
          <Transition name="icon-swap" mode="out-in">
            <span v-if="sidebarOpen" key="x" v-html="ICONS.close" aria-hidden="true" />
            <span v-else              key="m" v-html="ICONS.menu"  aria-hidden="true" />
          </Transition>
        </button>

        <!-- Page title ─────────────────────────────────────────────────── -->
        <div class="al-title-wrap">
          <Transition name="title-in" mode="out-in">
            <div :key="String(route.name)" class="al-title-wrap__inner">
              <p class="al-title-wrap__crumb">Panel Administrativo</p>
              <h1 class="al-title-wrap__h1">{{ pageTitle }}</h1>
            </div>
          </Transition>
        </div>

        <div class="al-header-gap" />

        <!-- Search ─────────────────────────────────────────────────────── -->
        <div class="al-search">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <span class="al-search__icon" v-html="ICONS.search" aria-hidden="true" />
          <input
            v-model="searchQuery"
            type="search"
            class="al-search__input"
            placeholder="Buscar..."
            autocomplete="off"
            aria-label="Buscar en el panel administrativo"
          />
          <kbd class="al-search__kbd" aria-hidden="true">⌘K</kbd>
        </div>

        <!-- Actions ────────────────────────────────────────────────────── -->
        <div class="al-header-actions">

          <!-- Notifications ──────────────────────────────────────────── -->
          <div class="al-pop-anchor" ref="notifRef">
            <button
              class="al-icon-btn"
              :aria-label="`Notificaciones${unreadCount ? ` — ${unreadCount} sin leer` : ''}`"
              :aria-expanded="String(notifOpen)"
              @click="notifOpen = !notifOpen; profileOpen = false"
            >
              <!-- eslint-disable-next-line vue/no-v-html -->
              <span v-html="ICONS.bell" aria-hidden="true" />
              <Transition name="badge-pop">
                <span
                  v-if="unreadCount"
                  class="al-icon-btn__badge"
                  aria-hidden="true"
                >{{ unreadCount }}</span>
              </Transition>
            </button>

            <Transition name="dropdown-in">
              <section
                v-if="notifOpen"
                class="al-popover notif-popover"
                aria-label="Notificaciones"
              >
                <div class="notif-popover__hd">
                  <span class="notif-popover__ttl">Notificaciones</span>
                  <button
                    v-if="unreadCount"
                    class="notif-popover__mark"
                    @click="markAllRead"
                  >Marcar todas</button>
                </div>
                <ul class="notif-list">
                  <li
                    v-for="n in notifications"
                    :key="n.id"
                    class="notif-item"
                    :class="{ 'notif-item--unread': !n.read }"
                  >
                    <div
                      class="notif-item__dot"
                      :class="`notif-item__dot--${n.type}`"
                      aria-hidden="true"
                    />
                    <div class="notif-item__body">
                      <p class="notif-item__msg">{{ n.message }}</p>
                      <time class="notif-item__time">{{ n.time }}</time>
                    </div>
                  </li>
                </ul>
                <p v-if="!notifications.length" class="notif-empty">
                  Sin notificaciones nuevas
                </p>
              </section>
            </Transition>
          </div>

          <!-- Profile chip ───────────────────────────────────────────── -->
          <div class="al-pop-anchor" ref="profileRef">
            <button
              class="al-profile-chip"
              :aria-expanded="String(profileOpen)"
              aria-haspopup="true"
              @click="profileOpen = !profileOpen; notifOpen = false"
            >
              <div class="al-profile-chip__av" aria-hidden="true">{{ userInitials }}</div>
              <div class="al-profile-chip__txt">
                <span class="al-profile-chip__name">{{ firstName }}</span>
                <span class="al-profile-chip__role">{{ auth.roleLabel }}</span>
              </div>
              <!-- eslint-disable-next-line vue/no-v-html -->
              <span class="al-profile-chip__chev" v-html="ICONS.chevron" aria-hidden="true" />
            </button>

            <Transition name="dropdown-in">
              <div
                v-if="profileOpen"
                class="al-popover profile-popover"
                role="menu"
                aria-label="Menú de usuario"
              >
                <div class="profile-popover__head">
                  <div class="profile-popover__av" aria-hidden="true">{{ userInitials }}</div>
                  <div>
                    <p class="profile-popover__name">{{ auth.user?.nombre }}</p>
                    <p class="profile-popover__email">{{ auth.user?.email }}</p>
                    <span class="profile-popover__tag">{{ auth.roleLabel }}</span>
                  </div>
                </div>
                <div class="al-pop-divider" />
                <button
                  class="profile-popover__logout"
                  role="menuitem"
                  @click="handleLogout"
                >
                  <!-- eslint-disable-next-line vue/no-v-html -->
                  <span v-html="ICONS.logout" aria-hidden="true" />
                  Cerrar sesión
                </button>
              </div>
            </Transition>
          </div>

        </div><!-- /al-header-actions -->
      </header><!-- /al-header -->

      <!-- CONTENT ────────────────────────────────────────────────────────── -->
      <main class="al-content" id="main-content" tabindex="-1">
        <RouterView v-slot="{ Component }">
          <Transition name="page-fade" mode="out-in">
            <component :is="Component" :key="String(route.name)" />
          </Transition>
        </RouterView>
      </main>

    </div><!-- /al-body -->
  </div><!-- /al-root -->
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

// ── Singleton: instancia global del store ─────────────────────────────────
const auth   = useAuthStore()
const router = useRouter()
const route  = useRoute()

// ══════════════════════════════════════════════════════════════════════════
// SVG ICONS — contenido hardcodeado (v-html es seguro aquí)
// ══════════════════════════════════════════════════════════════════════════
const ICONS = {
  dashboard: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></svg>`,
  calendar:  `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  users:     `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  chart:     `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>`,
  settings:  `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  logout:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
  search:    `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  bell:      `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
  menu:      `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="8" x2="21" y2="8"/><line x1="3" y1="16" x2="21" y2="16"/></svg>`,
  close:     `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  chevron:   `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`,
}

// ══════════════════════════════════════════════════════════════════════════
// STRATEGY — estructura de nav según rol (Observer: computed reactivo)
// ══════════════════════════════════════════════════════════════════════════
const NAV_STRATEGIES = {
  admin: () => [
    {
      label: 'Principal',
      items: [
        { name: 'admin-dashboard',    label: 'Dashboard', icon: ICONS.dashboard, badge: null },
        { name: 'admin-reservations', label: 'Reservas',  icon: ICONS.calendar,  badge: 3    },
        { name: 'admin-members',      label: 'Miembros',  icon: ICONS.users,     badge: null },
        { name: 'admin-reports',      label: 'Reportes',  icon: ICONS.chart,     badge: null },
      ],
    },
    {
      label: 'Sistema',
      items: [
        { name: 'admin-settings', label: 'Configuración', icon: ICONS.settings, badge: null },
      ],
    },
  ],
}

// Observer: navSections se recalcula si cambia auth.role
const navSections = computed(() => NAV_STRATEGIES[auth.role]?.() ?? NAV_STRATEGIES.admin())

// ══════════════════════════════════════════════════════════════════════════
// PAGE TITLE — mapa de rutas a títulos legibles
// ══════════════════════════════════════════════════════════════════════════
const PAGE_TITLES = {
  'admin-dashboard':    'Dashboard',
  'admin-reservations': 'Reservaciones',
  'admin-members':      'Gestión de Miembros',
  'admin-reports':      'Reportes y Análisis',
  'admin-settings':     'Configuración del Sistema',
}

// Observer: título reactivo a la ruta actual
const pageTitle = computed(() => PAGE_TITLES[String(route.name)] ?? 'Panel Administrativo')

// ══════════════════════════════════════════════════════════════════════════
// USER DERIVED STATE (Observer)
// ══════════════════════════════════════════════════════════════════════════
const userInitials = computed(() =>
  (auth.user?.nombre ?? '')
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0].toUpperCase())
    .slice(0, 2)
    .join('') || 'AV'
)

const firstName = computed(() => auth.user?.nombre?.split(' ')[0] ?? '')

// ══════════════════════════════════════════════════════════════════════════
// UI STATE
// ══════════════════════════════════════════════════════════════════════════
const sidebarOpen = ref(false)
const searchQuery = ref('')
const notifOpen   = ref(false)
const profileOpen = ref(false)
const notifRef    = ref(null)
const profileRef  = ref(null)

// Mobile detection — Observer
const windowWidth = ref(globalThis.window?.innerWidth ?? 1200)
const isMobile    = computed(() => windowWidth.value < 768)
const showOverlay = computed(() => isMobile.value && sidebarOpen.value)

// ══════════════════════════════════════════════════════════════════════════
// NOTIFICATIONS
// ══════════════════════════════════════════════════════════════════════════
const notifications = ref([
  { id: 1, message: 'Nuevo miembro registrado: María López',  time: 'Hace 5 min', read: false, type: 'member' },
  { id: 2, message: 'Reporte mensual listo para descarga',    time: 'Hace 1 h',   read: false, type: 'report' },
  { id: 3, message: 'Actualización del sistema completada',   time: 'Hace 3 h',   read: true,  type: 'system' },
])

const unreadCount = computed(() => notifications.value.filter((n) => !n.read).length)

function markAllRead() {
  notifications.value.forEach((n) => (n.read = true))
}

// ══════════════════════════════════════════════════════════════════════════
// ACTIONS
// ══════════════════════════════════════════════════════════════════════════

// Strategy: logout → limpiar store + redirigir a /login
async function handleLogout() {
  profileOpen.value = false
  sidebarOpen.value = false
  auth.logout()
  await router.push({ name: 'login' })
}

// Click-outside — cierra dropdowns
function onDocumentClick(e) {
  if (notifRef.value   && !notifRef.value.contains(e.target))   notifOpen.value   = false
  if (profileRef.value && !profileRef.value.contains(e.target)) profileOpen.value = false
}

// Resize — cierra sidebar al pasar a desktop
function onWindowResize() {
  windowWidth.value = globalThis.window?.innerWidth ?? windowWidth.value
  if (!isMobile.value) sidebarOpen.value = false
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  window.addEventListener('resize', onWindowResize)
})

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
  window.removeEventListener('resize', onWindowResize)
})
</script>

<style scoped>
/* ════════════════════════════════════════════════════════════════════════
   ROOT
════════════════════════════════════════════════════════════════════════ */
.al-root {
  display: flex;
  min-height: 100vh;
  background: #F9FAFB;
}

/* ════════════════════════════════════════════════════════════════════════
   OVERLAY (mobile)
════════════════════════════════════════════════════════════════════════ */
.al-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(2px);
  z-index: 999;
}

/* ════════════════════════════════════════════════════════════════════════
   SIDEBAR
════════════════════════════════════════════════════════════════════════ */
.al-sidebar {
  position: fixed;
  left: 0;
  top: 0;
  width: 260px;
  height: 100vh;
  background: #35495E;
  display: flex;
  flex-direction: column;
  z-index: 100;
  overflow-y: auto;
  overflow-x: hidden;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 0.3s ease;
  scrollbar-width: none;
}

.al-sidebar::-webkit-scrollbar { display: none; }

/* ── Logo area ──────────────────────────────────────────────────────── */
.sb-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px 20px 20px;
  flex-shrink: 0;
}

.sb-logo__mark {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: rgba(66, 184, 131, 0.18);
  border: 1px solid rgba(66, 184, 131, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.2s ease;
}

.sb-logo__mark:hover { background: rgba(66, 184, 131, 0.26); }

.sb-logo__img {
  height: 22px;
  /* Tint the SVG green */
  filter: brightness(0) saturate(100%)
          invert(63%) sepia(42%) saturate(490%)
          hue-rotate(104deg) brightness(96%) contrast(90%);
}

.sb-logo__text { display: flex; flex-direction: column; }

.sb-logo__name {
  font-size: 1.05rem;
  font-weight: 800;
  color: #F1F5F9;
  letter-spacing: -0.025em;
  line-height: 1.1;
}

.sb-logo__tag {
  font-size: 0.67rem;
  font-weight: 600;
  color: #B8C4CF;         /* 4.66:1 contrast on #35495E ✓ */
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-top: 1px;
}

/* ── Dividers ───────────────────────────────────────────────────────── */
.sb-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.09);
  margin: 0 20px;
  flex-shrink: 0;
}

.sb-divider--faint {
  background: rgba(255, 255, 255, 0.05);
}

/* ── Navigation ─────────────────────────────────────────────────────── */
.sb-nav {
  display: flex;
  flex-direction: column;
  padding: 16px 12px 8px;
  flex-shrink: 0;
}

.sb-section-label {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #B8C4CF;         /* 4.66:1 ✓ */
  padding: 0 10px;
  margin: 12px 0 6px;
}

.sb-section-label:first-child { margin-top: 0; }

.sb-item {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 10px 12px;
  border-radius: 10px;
  text-decoration: none;
  color: #CBD5E1;         /* 5.58:1 on #35495E ✓ */
  font-size: 0.875rem;
  font-weight: 500;
  transition: background 0.17s ease, color 0.17s ease, box-shadow 0.17s ease;
  position: relative;
  margin-bottom: 2px;
}

.sb-item:hover {
  background: #435669;
  color: #F1F5F9;
}

.sb-item--active {
  background: #375963;
  color: #d1fae5;         /* 6.58:1 on #375963 ✓ */
  font-weight: 600;
  box-shadow: inset 3px 0 0 #42B883;
}

.sb-item--active .sb-item__icon { color: #6ee7b7; }

.sb-item__icon {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.sb-item:hover .sb-item__icon { transform: translateX(1px); }

.sb-item__label { flex: 1; }

.sb-item__badge {
  background: #B91C1C;    /* dark red → white text 6.33:1 ✓ */
  color: #fff;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 100px;
  line-height: 1.4;
}

/* ── Spacer ─────────────────────────────────────────────────────────── */
.sb-spacer { flex: 1; }

/* ── Logout button ──────────────────────────────────────────────────── */
.sb-logout {
  display: flex;
  align-items: center;
  gap: 11px;
  width: calc(100% - 24px);
  margin: 4px 12px 12px;
  padding: 10px 12px;
  border-radius: 10px;
  background: none;
  border: none;
  color: #CBD5E1;         /* 5.58:1 ✓ */
  font-size: 0.875rem;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  text-align: left;
  transition: background 0.17s ease, color 0.17s ease;
}

.sb-logout:hover {
  background: #4B485B;
  color: #FEE2E2;         /* 6.68:1 on #35495E ✓ */
}

.sb-logout__icon {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

/* ── User info ──────────────────────────────────────────────────────── */
.sb-user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 20px 20px;
  flex-shrink: 0;
  position: relative;
}

.sb-user__av {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #243447;
  color: #CBD5E1;         /* 7.5:1 on #243447 ✓ */
  font-size: 0.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  letter-spacing: -0.02em;
}

.sb-user__info { flex: 1; overflow: hidden; }

.sb-user__name {
  font-size: 0.82rem;
  font-weight: 700;
  color: #F1F5F9;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
}

.sb-user__role {
  font-size: 0.7rem;
  color: #CBD5E1;         /* 5.58:1 ✓ */
  margin-top: 2px;
  line-height: 1.2;
}

.sb-user__online {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #42B883;
  border: 2px solid #35495E;
  flex-shrink: 0;
}

/* ════════════════════════════════════════════════════════════════════════
   BODY (right of sidebar)
════════════════════════════════════════════════════════════════════════ */
.al-body {
  flex: 1;
  margin-left: 260px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ════════════════════════════════════════════════════════════════════════
   HEADER
════════════════════════════════════════════════════════════════════════ */
.al-header {
  position: sticky;
  top: 0;
  z-index: 50;
  height: 64px;
  background: #ffffff;
  border-bottom: 1px solid #E5E7EB;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 24px;
  flex-shrink: 0;
}

/* ── Hamburger ──────────────────────────────────────────────────────── */
.al-hbg {
  display: none;          /* hidden on desktop */
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 8px;
  background: none;
  border: none;
  cursor: pointer;
  color: #374151;
  flex-shrink: 0;
  transition: background 0.15s ease, color 0.15s ease;
}

.al-hbg:hover { background: #F3F4F6; }

/* ── Page title ─────────────────────────────────────────────────────── */
.al-title-wrap { flex-shrink: 0; overflow: hidden; }

.al-title-wrap__inner {
  display: flex;
  flex-direction: column;
  gap: 1px;
  line-height: 1;
}

.al-title-wrap__crumb {
  font-size: 0.7rem;
  font-weight: 600;
  color: #4B5563;         /* 6.77:1 on white ✓ */
  text-transform: uppercase;
  letter-spacing: 0.07em;
  line-height: 1;
}

.al-title-wrap__h1 {
  font-size: 1.05rem;
  font-weight: 800;
  color: #1F2937;
  letter-spacing: -0.025em;
  line-height: 1.15;
  white-space: nowrap;
}

/* ── Spacer ─────────────────────────────────────────────────────────── */
.al-header-gap { flex: 1; }

/* ── Search ─────────────────────────────────────────────────────────── */
.al-search {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #F9FAFB;
  border: 1.5px solid #E5E7EB;
  border-radius: 10px;
  padding: 0 12px;
  height: 38px;
  width: 240px;
  transition: border-color 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
}

.al-search:focus-within {
  border-color: #42B883;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.12);
}

.al-search__icon {
  display: flex;
  align-items: center;
  color: #6B7280;
  flex-shrink: 0;
}

.al-search__input {
  flex: 1;
  border: none;
  background: none;
  outline: none;
  font-size: 0.85rem;
  font-family: inherit;
  color: #1F2937;
  min-width: 0;
}

.al-search__input::placeholder { color: #9CA3AF; }

/* Remove the browser's default "x" button on search */
.al-search__input::-webkit-search-cancel-button { display: none; }

.al-search__kbd {
  font-size: 0.65rem;
  font-family: inherit;
  color: #374151;
  background: #E5E7EB;
  border-radius: 4px;
  padding: 2px 5px;
  flex-shrink: 0;
  cursor: default;
  user-select: none;
}

/* ── Header actions ─────────────────────────────────────────────────── */
.al-header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

/* ── Icon buttons (bell, etc.) ──────────────────────────────────────── */
.al-pop-anchor { position: relative; }

.al-icon-btn {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: none;
  background: none;
  color: #374151;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease, color 0.15s ease;
}

.al-icon-btn:hover { background: #F3F4F6; color: #1F2937; }

.al-icon-btn__badge {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 17px;
  height: 17px;
  border-radius: 50%;
  background: #B91C1C;    /* 6.33:1 on white text ✓ */
  color: #fff;
  font-size: 0.6rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #fff;
  line-height: 1;
}

/* ── Profile chip ───────────────────────────────────────────────────── */
.al-profile-chip {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 5px 10px 5px 5px;
  border-radius: 12px;
  border: 1.5px solid #E5E7EB;
  background: #fff;
  cursor: pointer;
  transition: border-color 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
}

.al-profile-chip:hover {
  border-color: #42B883;
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.08);
}

.al-profile-chip__av {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: #35495E;
  color: #F1F5F9;         /* 8.14:1 ✓ */
  font-size: 0.72rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  letter-spacing: -0.02em;
}

.al-profile-chip__txt {
  display: flex;
  flex-direction: column;
  gap: 1px;
  text-align: left;
}

.al-profile-chip__name {
  font-size: 0.8rem;
  font-weight: 700;
  color: #1F2937;
  line-height: 1.1;
  white-space: nowrap;
}

.al-profile-chip__role {
  font-size: 0.67rem;
  color: #4B5563;         /* 6.77:1 ✓ */
  line-height: 1.1;
  white-space: nowrap;
}

.al-profile-chip__chev {
  display: flex;
  align-items: center;
  color: #6B7280;
  transition: transform 0.2s ease;
}

/* ════════════════════════════════════════════════════════════════════════
   POPOVERS (dropdowns)
════════════════════════════════════════════════════════════════════════ */
.al-popover {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  background: #fff;
  border: 1px solid #E5E7EB;
  border-radius: 14px;
  box-shadow:
    0 10px 40px rgba(0, 0, 0, 0.10),
    0 2px 8px rgba(0, 0, 0, 0.05);
  z-index: 200;
  overflow: hidden;
}

.al-pop-divider {
  height: 1px;
  background: #F3F4F6;
  margin: 0 16px;
}

/* Notifications popover */
.notif-popover {
  width: 340px;
}

.notif-popover__hd {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px 10px;
  border-bottom: 1px solid #F3F4F6;
}

.notif-popover__ttl {
  font-size: 0.875rem;
  font-weight: 700;
  color: #1F2937;
}

.notif-popover__mark {
  font-size: 0.75rem;
  font-weight: 600;
  color: #42B883;
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 6px;
  transition: background 0.15s;
  font-family: inherit;
}

.notif-popover__mark:hover { background: rgba(66, 184, 131, 0.08); }

.notif-list {
  list-style: none;
  max-height: 260px;
  overflow-y: auto;
  padding: 6px 0;
}

.notif-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 10px 16px;
  transition: background 0.15s ease;
  cursor: default;
}

.notif-item:hover { background: #F9FAFB; }

.notif-item--unread { background: rgba(66, 184, 131, 0.04); }
.notif-item--unread:hover { background: rgba(66, 184, 131, 0.08); }

.notif-item__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 5px;
}

.notif-item__dot--member { background: #42B883; }
.notif-item__dot--report { background: #3B82F6; }
.notif-item__dot--system { background: #8B5CF6; }

.notif-item__body { flex: 1; }

.notif-item__msg {
  font-size: 0.82rem;
  color: #1F2937;
  line-height: 1.4;
  font-weight: 500;
}

.notif-item__time {
  display: block;
  font-size: 0.72rem;
  color: #4B5563;         /* 6.77:1 ✓ */
  margin-top: 2px;
}

.notif-empty {
  text-align: center;
  padding: 20px;
  font-size: 0.85rem;
  color: #4B5563;
}

/* Profile popover */
.profile-popover { width: 260px; }

.profile-popover__head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
}

.profile-popover__av {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: #35495E;
  color: #F1F5F9;         /* 8.14:1 ✓ */
  font-size: 0.9rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.profile-popover__name {
  font-size: 0.875rem;
  font-weight: 700;
  color: #1F2937;
  line-height: 1.2;
}

.profile-popover__email {
  font-size: 0.72rem;
  color: #4B5563;         /* 6.77:1 ✓ */
  margin-top: 2px;
  word-break: break-all;
}

.profile-popover__tag {
  display: inline-block;
  margin-top: 5px;
  padding: 2px 8px;
  border-radius: 100px;
  background: #ECFDF5;
  color: #065F46;         /* 8.8:1 on #ECFDF5 ✓ */
  font-size: 0.67rem;
  font-weight: 700;
}

.profile-popover__logout {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 12px 16px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #374151;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  text-align: left;
  transition: background 0.15s ease, color 0.15s ease;
}

.profile-popover__logout:hover {
  background: #FEF2F2;
  color: #B91C1C;
}

/* ════════════════════════════════════════════════════════════════════════
   CONTENT
════════════════════════════════════════════════════════════════════════ */
.al-content {
  flex: 1;
  overflow-y: auto;
  background: #F9FAFB;
  outline: none;   /* removes focus ring from tabindex=-1 */
}

/* ════════════════════════════════════════════════════════════════════════
   TRANSITIONS
════════════════════════════════════════════════════════════════════════ */

/* Overlay fade */
.fade-overlay-enter-active,
.fade-overlay-leave-active { transition: opacity 0.25s ease; }
.fade-overlay-enter-from,
.fade-overlay-leave-to     { opacity: 0; }

/* Page content crossfade */
.page-fade-enter-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.page-fade-leave-active { transition: opacity 0.15s ease; }
.page-fade-enter-from   { opacity: 0; transform: translateY(6px); }
.page-fade-leave-to     { opacity: 0; }

/* Page title slide */
.title-in-enter-active { transition: opacity 0.22s ease, transform 0.22s ease; }
.title-in-leave-active { transition: opacity 0.12s ease; }
.title-in-enter-from   { opacity: 0; transform: translateX(6px); }
.title-in-leave-to     { opacity: 0; }

/* Dropdown popover */
.dropdown-in-enter-active {
  transition: opacity 0.18s ease, transform 0.18s cubic-bezier(0.34, 1.3, 0.64, 1);
}
.dropdown-in-leave-active { transition: opacity 0.12s ease, transform 0.12s ease; }
.dropdown-in-enter-from   { opacity: 0; transform: translateY(-6px) scale(0.97); }
.dropdown-in-leave-to     { opacity: 0; transform: translateY(-4px) scale(0.98); }

/* Badge pop */
.badge-pop-enter-active { animation: badge-bounce 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.badge-pop-leave-active { transition: opacity 0.15s; }
.badge-pop-leave-to     { opacity: 0; }

@keyframes badge-bounce {
  from { transform: scale(0); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}

/* Hamburger icon swap */
.icon-swap-enter-active { transition: opacity 0.12s ease, transform 0.12s ease; }
.icon-swap-leave-active { transition: opacity 0.1s ease; }
.icon-swap-enter-from   { opacity: 0; transform: rotate(-90deg) scale(0.8); }
.icon-swap-leave-to     { opacity: 0; }

/* ════════════════════════════════════════════════════════════════════════
   RESPONSIVE
════════════════════════════════════════════════════════════════════════ */
@media (max-width: 768px) {
  /* Sidebar: hidden off-screen, slides in with .al-sidebar--open */
  .al-sidebar {
    transform: translateX(-100%);
    z-index: 1000;
    box-shadow: none;
  }

  .al-sidebar--open {
    transform: translateX(0);
    box-shadow: 4px 0 24px rgba(0, 0, 0, 0.2);
  }

  /* Body: full width, no left margin */
  .al-body { margin-left: 0; }

  /* Header adjustments */
  .al-hbg { display: flex; }

  .al-title-wrap__crumb { display: none; }
  .al-title-wrap__h1    { font-size: 0.95rem; }

  .al-search { width: 160px; }
  .al-search__kbd { display: none; }

  .al-header { padding: 0 16px; gap: 10px; }
}

@media (max-width: 520px) {
  .al-search      { display: none; }
  .al-profile-chip__txt,
  .al-profile-chip__chev { display: none; }
  .al-profile-chip { padding: 5px; }
}
</style>
