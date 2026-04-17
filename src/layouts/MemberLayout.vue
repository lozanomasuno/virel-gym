<template>
  <div class="ml-root">

    <!-- ══════════════════ HEADER ══════════════════════════════════════════ -->
    <header class="ml-header">

      <!-- Logo ──────────────────────────────────────────────────────────── -->
      <router-link to="/" class="ml-logo" aria-label="Virel — ir al inicio">
        <div class="ml-logo__mark" aria-hidden="true">
          <img src="@/assets/logo.svg" alt="" class="ml-logo__img" />
        </div>
        <span class="ml-logo__name">Virel</span>
      </router-link>

      <!-- Greeting (Observer: reactivo al nombre del usuario) ────────────── -->
      <div class="ml-greeting" aria-live="polite">
        <span class="ml-greeting__hi">Hola,</span>
        <span class="ml-greeting__name">{{ firstName }}</span>
        <Transition name="greeting-wave">
          <span v-if="showWave" class="ml-greeting__wave" aria-hidden="true">👋</span>
        </Transition>
      </div>

      <div class="ml-header-gap" />

      <!-- Actions ────────────────────────────────────────────────────────── -->
      <div class="ml-actions">

        <!-- Notifications ──────────────────────────────────────────────── -->
        <div class="ml-pop-anchor" ref="notifRef">
          <button
            class="ml-icon-btn"
            :aria-label="`Notificaciones${unreadCount ? ` — ${unreadCount} sin leer` : ''}`"
            :aria-expanded="String(notifOpen)"
            @click="notifOpen = !notifOpen; avatarOpen = false"
          >
            <!-- eslint-disable-next-line vue/no-v-html -->
            <span v-html="ICONS.bell" aria-hidden="true" />
            <Transition name="badge-pop">
              <span v-if="unreadCount" class="ml-badge" aria-hidden="true">
                {{ unreadCount }}
              </span>
            </Transition>
          </button>

          <Transition name="drop-in">
            <section
              v-if="notifOpen"
              class="ml-popover notif-pop"
              aria-label="Notificaciones"
            >
              <div class="notif-pop__hd">
                <span class="notif-pop__ttl">Notificaciones</span>
                <button
                  v-if="unreadCount"
                  class="notif-pop__mark"
                  @click="markAllRead"
                >Ver todas</button>
              </div>
              <ul class="notif-list">
                <li
                  v-for="n in notifications"
                  :key="n.id"
                  class="notif-item"
                  :class="{ 'notif-item--unread': !n.read }"
                >
                  <div class="notif-item__dot" :class="`notif-item__dot--${n.type}`" aria-hidden="true" />
                  <div class="notif-item__body">
                    <p class="notif-item__msg">{{ n.message }}</p>
                    <time class="notif-item__time">{{ n.time }}</time>
                  </div>
                </li>
              </ul>
            </section>
          </Transition>
        </div>

        <!-- Avatar + dropdown ──────────────────────────────────────────── -->
        <div class="ml-pop-anchor" ref="avatarRef">
          <button
            class="ml-avatar-btn"
            :aria-expanded="String(avatarOpen)"
            aria-haspopup="true"
            aria-label="Menú de usuario"
            @click="avatarOpen = !avatarOpen; notifOpen = false"
          >
            <div class="ml-avatar" aria-hidden="true">{{ userInitials }}</div>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <span class="ml-avatar-btn__chev" v-html="ICONS.chevron" aria-hidden="true" />
          </button>

          <Transition name="drop-in">
            <div
              v-if="avatarOpen"
              class="ml-popover avatar-pop"
              role="menu"
              aria-label="Opciones de usuario"
            >
              <!-- User card ──────────────────────────────────────────── -->
              <div class="avatar-pop__card">
                <div class="avatar-pop__av" aria-hidden="true">{{ userInitials }}</div>
                <div class="avatar-pop__info">
                  <p class="avatar-pop__name">{{ auth.user?.nombre }}</p>
                  <p class="avatar-pop__email">{{ auth.user?.email }}</p>
                </div>
              </div>

              <!-- Strategy: badge de membresía ───────────────────────── -->
              <div v-if="auth.user?.plan" class="avatar-pop__plan">
                <!-- eslint-disable-next-line vue/no-v-html -->
                <span v-html="ICONS.star" aria-hidden="true" />
                Plan {{ auth.user.plan }} activo
              </div>

              <div class="avatar-pop__divider" />

              <router-link
                to="/member/profile"
                class="avatar-pop__item"
                role="menuitem"
                @click="avatarOpen = false"
              >
                <!-- eslint-disable-next-line vue/no-v-html -->
                <span v-html="ICONS.user" aria-hidden="true" />
                Mi perfil
              </router-link>

              <div class="avatar-pop__divider" />

              <button
                class="avatar-pop__logout"
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

      </div><!-- /ml-actions -->
    </header><!-- /ml-header -->

    <!-- ══════════════════ NAV HORIZONTAL (desktop) ═════════════════════════ -->
    <nav class="ml-nav" aria-label="Navegación de miembro">
      <div class="ml-nav__inner">
        <router-link
          v-for="item in navItems"
          :key="item.name"
          :to="{ name: item.name }"
          class="ml-nav__item"
          active-class="ml-nav__item--active"
        >
          <!-- eslint-disable-next-line vue/no-v-html -->
          <span v-html="item.icon" aria-hidden="true" />
          {{ item.label }}
        </router-link>

        <!-- Logout en la nav (desktop, derecha) -->
        <button class="ml-nav__logout" @click="handleLogout">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <span v-html="ICONS.logout" aria-hidden="true" />
          Salir
        </button>
      </div>
    </nav>

    <!-- ══════════════════ SUMMARY STRIP ════════════════════════════════════ -->
    <!-- Strategy: visible solo si hay datos de plan/clase próxima ───────── -->
    <Transition name="strip-in">
      <div v-if="showSummary" class="ml-strip" aria-label="Resumen rápido">

        <!-- Próxima clase ────────────────────────────────────────────────── -->
        <div class="strip-card strip-card--next">
          <div class="strip-card__ico" aria-hidden="true">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <span v-html="ICONS.calendar" />
          </div>
          <div class="strip-card__body">
            <p class="strip-card__label">Próxima clase</p>
            <p class="strip-card__value">{{ nextClass.name }}</p>
            <p class="strip-card__sub">{{ nextClass.time }}</p>
          </div>
        </div>

        <!-- Membresía ────────────────────────────────────────────────────── -->
        <div class="strip-card strip-card--plan">
          <div class="strip-card__ico" aria-hidden="true">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <span v-html="ICONS.star" />
          </div>
          <div class="strip-card__body">
            <p class="strip-card__label">Membresía</p>
            <p class="strip-card__value">{{ auth.user?.plan ?? 'Básico' }}</p>
            <p class="strip-card__sub">Activa</p>
          </div>
        </div>

        <!-- Reservas activas ────────────────────────────────────────────── -->
        <div class="strip-card strip-card--res">
          <div class="strip-card__ico" aria-hidden="true">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <span v-html="ICONS.bookmark" />
          </div>
          <div class="strip-card__body">
            <p class="strip-card__label">Reservas activas</p>
            <p class="strip-card__value">{{ activeReservations }}</p>
            <p class="strip-card__sub">este mes</p>
          </div>
        </div>

      </div>
    </Transition>

    <!-- ══════════════════ CONTENT ══════════════════════════════════════════ -->
    <main class="ml-content" id="main-content" tabindex="-1">
      <RouterView v-slot="{ Component }">
        <Transition name="page-fade" mode="out-in">
          <component :is="Component" :key="String(route.name)" />
        </Transition>
      </RouterView>
    </main>

    <!-- ══════════════════ BOTTOM NAV (móvil) ═══════════════════════════════ -->
    <nav class="ml-bottom-nav" aria-label="Navegación móvil">
      <router-link
        v-for="item in mobileNavItems"
        :key="item.name"
        :to="{ name: item.name }"
        class="ml-bottom-nav__item"
        active-class="ml-bottom-nav__item--active"
        :aria-label="item.label"
      >
        <!-- eslint-disable-next-line vue/no-v-html -->
        <span class="ml-bottom-nav__icon" v-html="item.icon" aria-hidden="true" />
        <span class="ml-bottom-nav__label">{{ item.label }}</span>
      </router-link>

      <button class="ml-bottom-nav__item" aria-label="Cerrar sesión" @click="handleLogout">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <span class="ml-bottom-nav__icon" v-html="ICONS.logout" aria-hidden="true" />
        <span class="ml-bottom-nav__label">Salir</span>
      </button>
    </nav>

  </div><!-- /ml-root -->
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
// SVG ICONS — hardcodeados (v-html seguro: no hay input de usuario)
// ══════════════════════════════════════════════════════════════════════════
const ICONS = {
  home:     `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  calendar: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  history:  `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polyline points="12 8 12 12 14 14"/><path d="M3.05 11a9 9 0 1 0 .5-3.5"/><polyline points="3 4 3 11 10 11"/></svg>`,
  user:     `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  star:     `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  bookmark: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`,
  bell:     `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
  logout:   `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
  chevron:  `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`,
  membership: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`,
}

// ══════════════════════════════════════════════════════════════════════════
// NAVIGATION ITEMS
// ══════════════════════════════════════════════════════════════════════════
const navItems = [
  { name: 'member-dashboard',    label: 'Inicio',      icon: ICONS.home     },
  { name: 'member-reservations', label: 'Mis reservas', icon: ICONS.calendar },
  { name: 'member-profile',      label: 'Perfil',      icon: ICONS.user     },
]

// Observer: en móvil se usa un subconjunto compacto para el bottom-nav
const mobileNavItems = [
  { name: 'member-dashboard',    label: 'Inicio',    icon: ICONS.home     },
  { name: 'member-reservations', label: 'Reservas',  icon: ICONS.calendar },
  { name: 'member-profile',      label: 'Perfil',    icon: ICONS.user     },
]

// ══════════════════════════════════════════════════════════════════════════
// USER STATE (Observer — computed reactivos)
// ══════════════════════════════════════════════════════════════════════════
const firstName = computed(() => auth.user?.nombre?.split(' ')[0] ?? 'Miembro')

const userInitials = computed(() =>
  (auth.user?.nombre ?? '')
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0].toUpperCase())
    .slice(0, 2)
    .join('') || '?'
)

// Strategy: mostrar el strip de resumen solo si hay sesión activa
const showSummary = computed(() => auth.isAuthenticated)

// ══════════════════════════════════════════════════════════════════════════
// SUMMARY DATA (Strategy: varía según plan/membresía)
// ══════════════════════════════════════════════════════════════════════════
const PLAN_CLASS_MAP = {
  Premium: { name: 'Yoga Flow',    time: 'Hoy · 18:30 h' },
  Básico:  { name: 'Pilates Core', time: 'Mañana · 09:00 h' },
}

const nextClass = computed(() =>
  PLAN_CLASS_MAP[auth.user?.plan ?? ''] ?? { name: 'Sin clase programada', time: '—' }
)

const activeReservations = ref(3)   // reemplazar con llamada real al backend

// ══════════════════════════════════════════════════════════════════════════
// NOTIFICATIONS
// ══════════════════════════════════════════════════════════════════════════
const notifications = ref([
  { id: 1, message: 'Tu clase de Yoga es mañana a las 07:00 h',  time: 'Hace 10 min', read: false, type: 'class'  },
  { id: 2, message: 'Tu membresía Premium vence en 5 días',      time: 'Hace 2 h',   read: false, type: 'plan'   },
  { id: 3, message: 'Reserva confirmada: Spinning · Sábado',     time: 'Ayer',        read: true,  type: 'confirm'},
])

const unreadCount = computed(() => notifications.value.filter((n) => !n.read).length)

function markAllRead() {
  notifications.value.forEach((n) => (n.read = true))
}

// ══════════════════════════════════════════════════════════════════════════
// GREETING WAVE (microinteracción: aparece al montar)
// ══════════════════════════════════════════════════════════════════════════
const showWave = ref(false)

onMounted(() => {
  setTimeout(() => { showWave.value = true }, 200)
  setTimeout(() => { showWave.value = false }, 2200)
  document.addEventListener('click', onDocumentClick)
})

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
})

// ══════════════════════════════════════════════════════════════════════════
// UI STATE
// ══════════════════════════════════════════════════════════════════════════
const notifOpen  = ref(false)
const avatarOpen = ref(false)
const notifRef   = ref(null)
const avatarRef  = ref(null)

function onDocumentClick(e) {
  if (notifRef.value  && !notifRef.value.contains(e.target))  notifOpen.value  = false
  if (avatarRef.value && !avatarRef.value.contains(e.target)) avatarOpen.value = false
}

// ══════════════════════════════════════════════════════════════════════════
// LOGOUT — Singleton clear + Strategy redirect
// ══════════════════════════════════════════════════════════════════════════
async function handleLogout() {
  avatarOpen.value = false
  auth.logout()
  await router.push({ name: 'login' })
}
</script>

<style scoped>
/* ════════════════════════════════════════════════════════════════════════
   ROOT
════════════════════════════════════════════════════════════════════════ */
.ml-root {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #F9FAFB;
  /* bottom-nav clearance on mobile */
  padding-bottom: 0;
}

/* ════════════════════════════════════════════════════════════════════════
   HEADER
════════════════════════════════════════════════════════════════════════ */
.ml-header {
  position: sticky;
  top: 0;
  z-index: 100;
  height: 60px;
  background: #ffffff;
  border-bottom: 1px solid #E5E7EB;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 24px;
  flex-shrink: 0;
}

/* ── Logo ───────────────────────────────────────────────────────────── */
.ml-logo {
  display: flex;
  align-items: center;
  gap: 9px;
  text-decoration: none;
  flex-shrink: 0;
}

.ml-logo__mark {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #35495E;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}

.ml-logo__mark:hover { background: #2c3f51; }

.ml-logo__img {
  height: 18px;
  filter: brightness(0) saturate(100%)
          invert(63%) sepia(42%) saturate(490%)
          hue-rotate(104deg) brightness(96%) contrast(90%);
}

.ml-logo__name {
  font-size: 1rem;
  font-weight: 800;
  color: #1F2937;
  letter-spacing: -0.03em;
}

/* ── Greeting ───────────────────────────────────────────────────────── */
.ml-greeting {
  display: flex;
  align-items: baseline;
  gap: 5px;
  overflow: hidden;
}

.ml-greeting__hi {
  font-size: 0.9rem;
  color: #4B5563;         /* 6.77:1 on white ✓ */
  font-weight: 400;
}

.ml-greeting__name {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1F2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 160px;
}

.ml-greeting__wave {
  font-size: 1rem;
  display: inline-block;
  animation: wave 0.8s ease-in-out;
}

@keyframes wave {
  0%, 100% { transform: rotate(0deg);   }
  20%       { transform: rotate(-10deg); }
  50%       { transform: rotate(20deg);  }
  80%       { transform: rotate(-5deg);  }
}

/* ── Gap ────────────────────────────────────────────────────────────── */
.ml-header-gap { flex: 1; }

/* ── Actions ────────────────────────────────────────────────────────── */
.ml-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.ml-pop-anchor { position: relative; }

/* ── Icon buttons ───────────────────────────────────────────────────── */
.ml-icon-btn {
  position: relative;
  width: 38px;
  height: 38px;
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

.ml-icon-btn:hover { background: #F3F4F6; color: #1F2937; }

.ml-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 100px;
  background: #B91C1C;    /* 6.33:1 on white label ✓ */
  color: #fff;
  font-size: 0.6rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #fff;
  line-height: 1;
}

/* ── Avatar button ──────────────────────────────────────────────────── */
.ml-avatar-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px 4px 4px;
  border-radius: 12px;
  border: 1.5px solid #E5E7EB;
  background: #fff;
  cursor: pointer;
  transition: border-color 0.18s ease, box-shadow 0.18s ease;
}

.ml-avatar-btn:hover {
  border-color: #42B883;
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.1);
}

.ml-avatar {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: #42B883;
  color: #072e1a;         /* 9.2:1 on #42B883 ✓ */
  font-size: 0.72rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  letter-spacing: -0.02em;
}

.ml-avatar-btn__chev {
  display: flex;
  align-items: center;
  color: #6B7280;
}

/* ════════════════════════════════════════════════════════════════════════
   HORIZONTAL NAV (desktop)
════════════════════════════════════════════════════════════════════════ */
.ml-nav {
  background: #fff;
  border-bottom: 1px solid #E5E7EB;
  position: sticky;
  top: 60px;
  z-index: 90;
  flex-shrink: 0;
}

.ml-nav__inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  gap: 0;
}

.ml-nav__item {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 14px 16px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4B5563;         /* 6.77:1 ✓ */
  text-decoration: none;
  border-bottom: 2.5px solid transparent;
  transition: color 0.18s ease, border-color 0.18s ease;
  white-space: nowrap;
}

.ml-nav__item:hover {
  color: #1F2937;
  border-bottom-color: #E5E7EB;
}

.ml-nav__item--active {
  color: #1F2937;
  font-weight: 700;
  border-bottom-color: #42B883;
}

/* Logout on the right side of nav */
.ml-nav__logout {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 14px 16px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4B5563;
  background: none;
  border: none;
  border-bottom: 2.5px solid transparent;
  cursor: pointer;
  font-family: inherit;
  margin-left: auto;
  transition: color 0.18s ease;
}

.ml-nav__logout:hover { color: #B91C1C; }

/* ════════════════════════════════════════════════════════════════════════
   SUMMARY STRIP
════════════════════════════════════════════════════════════════════════ */
.ml-strip {
  display: flex;
  gap: 12px;
  padding: 12px 24px;
  background: #ffffff;
  border-bottom: 1px solid #E5E7EB;
  overflow-x: auto;
  scrollbar-width: none;
  flex-shrink: 0;
}

.ml-strip::-webkit-scrollbar { display: none; }

.strip-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 18px;
  border-radius: 14px;
  border: 1.5px solid #E5E7EB;
  background: #F9FAFB;
  flex-shrink: 0;
  min-width: 200px;
  transition: border-color 0.18s ease, box-shadow 0.18s ease;
}

.strip-card:hover {
  border-color: #42B883;
  box-shadow: 0 2px 10px rgba(66, 184, 131, 0.1);
}

/* Color accent per card type */
.strip-card--next { border-left: 3px solid #42B883; }
.strip-card--plan { border-left: 3px solid #3B82F6; }
.strip-card--res  { border-left: 3px solid #8B5CF6; }

.strip-card__ico {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.strip-card--next .strip-card__ico { background: #ECFDF5; color: #065F46; }
.strip-card--plan .strip-card__ico { background: #EFF6FF; color: #1E40AF; }
.strip-card--res  .strip-card__ico { background: #F5F3FF; color: #5B21B6; }

.strip-card__label {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #4B5563;         /* 6.77:1 ✓ */
  line-height: 1;
  margin-bottom: 3px;
}

.strip-card__value {
  font-size: 0.9rem;
  font-weight: 700;
  color: #1F2937;
  line-height: 1.2;
}

.strip-card__sub {
  font-size: 0.72rem;
  color: #4B5563;         /* 6.77:1 ✓ */
  margin-top: 2px;
}

/* ════════════════════════════════════════════════════════════════════════
   CONTENT
════════════════════════════════════════════════════════════════════════ */
.ml-content {
  flex: 1;
  overflow-y: auto;
  outline: none;
}

/* ════════════════════════════════════════════════════════════════════════
   POPOVERS
════════════════════════════════════════════════════════════════════════ */
.ml-popover {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  background: #fff;
  border: 1px solid #E5E7EB;
  border-radius: 14px;
  box-shadow:
    0 10px 40px rgba(0, 0, 0, 0.1),
    0 2px 8px rgba(0, 0, 0, 0.05);
  z-index: 200;
  overflow: hidden;
}

/* Notifications popover */
.notif-pop { width: 320px; }

.notif-pop__hd {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px 10px;
  border-bottom: 1px solid #F3F4F6;
}

.notif-pop__ttl {
  font-size: 0.875rem;
  font-weight: 700;
  color: #1F2937;
}

.notif-pop__mark {
  font-size: 0.75rem;
  font-weight: 600;
  color: #42B883;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  padding: 2px 6px;
  border-radius: 6px;
  transition: background 0.15s;
}

.notif-pop__mark:hover { background: rgba(66, 184, 131, 0.08); }

.notif-list { list-style: none; max-height: 240px; overflow-y: auto; padding: 6px 0; }

.notif-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 9px 16px;
  transition: background 0.15s;
}

.notif-item:hover { background: #F9FAFB; }
.notif-item--unread { background: rgba(66, 184, 131, 0.04); }
.notif-item--unread:hover { background: rgba(66, 184, 131, 0.08); }

.notif-item__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 4px;
}

.notif-item__dot--class   { background: #42B883; }
.notif-item__dot--plan    { background: #3B82F6; }
.notif-item__dot--confirm { background: #8B5CF6; }

.notif-item__msg {
  font-size: 0.82rem;
  color: #1F2937;
  font-weight: 500;
  line-height: 1.4;
}

.notif-item__time {
  display: block;
  font-size: 0.7rem;
  color: #4B5563;         /* 6.77:1 ✓ */
  margin-top: 2px;
}

/* Avatar popover */
.avatar-pop { width: 240px; }

.avatar-pop__card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
}

.avatar-pop__av {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #42B883;
  color: #072e1a;         /* 9.2:1 ✓ */
  font-size: 0.85rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-pop__name {
  font-size: 0.875rem;
  font-weight: 700;
  color: #1F2937;
  line-height: 1.2;
}

.avatar-pop__email {
  font-size: 0.7rem;
  color: #4B5563;
  margin-top: 2px;
  word-break: break-all;
}

/* Strategy: badge de plan */
.avatar-pop__plan {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 16px 12px;
  padding: 8px 12px;
  border-radius: 10px;
  background: #ECFDF5;
  font-size: 0.78rem;
  font-weight: 600;
  color: #065F46;         /* 8.8:1 on #ECFDF5 ✓ */
}

.avatar-pop__divider {
  height: 1px;
  background: #F3F4F6;
  margin: 0 16px;
}

.avatar-pop__item {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 11px 16px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #374151;
  text-decoration: none;
  transition: background 0.15s ease, color 0.15s ease;
}

.avatar-pop__item:hover { background: #F9FAFB; color: #1F2937; }

.avatar-pop__logout {
  display: flex;
  align-items: center;
  gap: 9px;
  width: 100%;
  padding: 11px 16px;
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

.avatar-pop__logout:hover { background: #FEF2F2; color: #B91C1C; }

/* ════════════════════════════════════════════════════════════════════════
   BOTTOM NAV (móvil only)
════════════════════════════════════════════════════════════════════════ */
.ml-bottom-nav {
  display: none;          /* hidden on desktop */
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 90;
  background: #fff;
  border-top: 1px solid #E5E7EB;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.06);
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

.ml-bottom-nav__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 10px 0 8px;
  flex: 1;
  font-size: 0.7rem;
  font-weight: 500;
  color: #4B5563;         /* 6.77:1 ✓ */
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  transition: color 0.15s ease;
}

.ml-bottom-nav__item:hover { color: #1F2937; }

.ml-bottom-nav__item--active {
  color: #42B883;
  font-weight: 700;
}

.ml-bottom-nav__icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.ml-bottom-nav__label { line-height: 1; }

/* ════════════════════════════════════════════════════════════════════════
   TRANSITIONS
════════════════════════════════════════════════════════════════════════ */

/* Page crossfade */
.page-fade-enter-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.page-fade-leave-active { transition: opacity 0.15s ease; }
.page-fade-enter-from   { opacity: 0; transform: translateY(8px); }
.page-fade-leave-to     { opacity: 0; }

/* Summary strip */
.strip-in-enter-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.strip-in-enter-from   { opacity: 0; transform: translateY(-6px); }

/* Dropdown */
.drop-in-enter-active {
  transition: opacity 0.18s ease, transform 0.18s cubic-bezier(0.34, 1.3, 0.64, 1);
}
.drop-in-leave-active { transition: opacity 0.12s ease, transform 0.12s ease; }
.drop-in-enter-from   { opacity: 0; transform: translateY(-6px) scale(0.97); }
.drop-in-leave-to     { opacity: 0; transform: translateY(-4px) scale(0.98); }

/* Badge */
.badge-pop-enter-active { animation: badge-bounce 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.badge-pop-leave-active { transition: opacity 0.15s; }
.badge-pop-leave-to     { opacity: 0; }

@keyframes badge-bounce {
  from { transform: scale(0); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}

/* Greeting wave */
.greeting-wave-enter-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.greeting-wave-leave-active { transition: opacity 0.3s ease; }
.greeting-wave-enter-from   { opacity: 0; transform: translateX(-6px); }
.greeting-wave-leave-to     { opacity: 0; }

/* ════════════════════════════════════════════════════════════════════════
   RESPONSIVE
════════════════════════════════════════════════════════════════════════ */
@media (max-width: 768px) {
  .ml-header { padding: 0 16px; gap: 10px; }
  .ml-greeting { display: none; }

  /* Hide desktop nav */
  .ml-nav { display: none; }

  /* Show bottom nav */
  .ml-bottom-nav {
    display: flex;
  }

  /* Push content above bottom nav */
  .ml-root { padding-bottom: 64px; }

  /* Summary strip scrolls horizontally */
  .ml-strip { padding: 10px 16px; }
  .strip-card { min-width: 165px; padding: 10px 14px; }
}

@media (max-width: 480px) {
  .ml-logo__name { display: none; }
  .ml-avatar-btn__chev { display: none; }
  .ml-avatar-btn { padding: 4px; }
}
</style>
