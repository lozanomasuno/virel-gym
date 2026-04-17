/**
 * router/index.js — Arquitectura de navegación Virel
 *
 * Patrones aplicados:
 *   Singleton  → router único exportado
 *   Strategy   → routeStrategies valida permisos por rol antes de navegar
 *   Observer   → beforeEach reacciona a cada cambio de ruta
 *   Guard      → protección declarativa con meta: { requiresAuth, role }
 */

import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import HomeView from '../views/HomeView.vue'

// ─── Strategy: validadores de acceso por tipo de ruta ────────────────────────
const routeStrategies = {
  /** Ruta pública: siempre accesible */
  public: () => true,

  /** Solo visitantes no autenticados (ej: /login) */
  guestOnly: (auth) => !auth.isAuthenticated,

  /** Requiere rol 'member' */
  member: (auth) => auth.isAuthenticated && auth.role === 'member',

  /** Requiere rol 'admin' */
  admin: (auth) => auth.isAuthenticated && auth.role === 'admin',
}

// ─── Árbol de rutas ───────────────────────────────────────────────────────────
const routes = [
  // ── Rutas públicas (Layout con NavBar + Footer) ───────────────────────────
  {
    path: '/',
    component: () => import('../layouts/PublicLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: HomeView,
      },
      {
        path: 'about',
        name: 'about',
        component: () => import('../views/AboutView.vue'),
      },
      {
        path: 'classes',
        name: 'classes',
        component: () => import('../views/ClassesView.vue'),
      },
      {
        path: 'membership',
        name: 'membership',
        component: () => import('../views/MembershipView.vue'),
      },
      {
        path: 'login',
        name: 'login',
        component: () => import('../views/Login.vue'),
        meta: { guestOnly: true },
      },
    ],
  },

  // ── Rutas privadas: Miembro ───────────────────────────────────────────────
  {
    path: '/member',
    component: () => import('../layouts/MemberLayout.vue'),
    meta: { requiresAuth: true, role: 'member' },
    redirect: '/member/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'member-dashboard',
        component: () => import('../views/member/MemberDashboard.vue'),
      },
      {
        path: 'reservations',
        name: 'member-reservations',
        component: () => import('../views/member/MemberReservations.vue'),
      },
      {
        path: 'profile',
        name: 'member-profile',
        component: () => import('../views/member/MemberProfile.vue'),
      },
    ],
  },

  // ── Rutas privadas: Administrador ─────────────────────────────────────────
  {
    path: '/admin',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, role: 'admin' },
    redirect: '/admin/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: () => import('../views/DashboardAdmin.vue'),
      },
      {
        // Placeholder: ReservationCalendar.vue se implementará en una iteración futura
        path: 'reservations',
        name: 'admin-reservations',
        component: () => import('../views/ReservationCalendar.vue'),
      },
      {
        path: 'members',
        name: 'admin-members',
        component: () => import('../views/MemberManagement.vue'),
      },
      {
        path: 'reports',
        name: 'admin-reports',
        component: () => import('../views/ReportsAnalytics.vue'),
      },
      {
        path: 'settings',
        name: 'admin-settings',
        component: () => import('../views/SystemSettings.vue'),
      },
    ],
  },

  // ── Rutas del sistema ─────────────────────────────────────────────────────
  {
    path: '/unauthorized',
    name: 'unauthorized',
    component: () => import('../views/UnauthorizedView.vue'),
  },

  // ── Compatibilidad: redirigir rutas antiguas ──────────────────────────────
  { path: '/dashboard',                redirect: '/admin/dashboard' },
  { path: '/dashboard/miembros',       redirect: '/admin/members'   },
  { path: '/dashboard/analitica',      redirect: '/admin/reports'   },
  { path: '/dashboard/configuracion',  redirect: '/admin/settings'  },

  // ── Catch-all ─────────────────────────────────────────────────────────────
  { path: '/:pathMatch(.*)*', name: 'not-found', redirect: '/' },
]

// ─── Crear instancia (Singleton) ──────────────────────────────────────────────
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return savedPosition || { top: 0 }
  },
})

// ─── Guard global (Observer + Strategy) ──────────────────────────────────────
router.beforeEach((to) => {
  const auth = useAuthStore()

  // 1. Ruta solo para visitantes (ej: /login) → redirigir si ya autenticado
  const isGuestOnly = to.matched.some((r) => r.meta.guestOnly)
  if (isGuestOnly && auth.isAuthenticated) {
    return { path: auth.redirectPath }
  }

  // 2. Ruta requiere autenticación → enviar a /login
  const requiresAuth = to.matched.some((r) => r.meta.requiresAuth)
  if (requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  // 3. Validar rol con Strategy → enviar a /unauthorized si no coincide
  const requiredRole = to.matched.find((r) => r.meta.role)?.meta.role
  if (requiredRole && !routeStrategies[requiredRole]?.(auth)) {
    return { name: 'unauthorized' }
  }

  // 4. Acceso permitido
})

export default router
