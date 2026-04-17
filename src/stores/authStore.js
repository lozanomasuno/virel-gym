/**
 * authStore.js — Autenticación global de Virel
 *
 * Patrones aplicados:
 *   Singleton  → defineStore (una instancia global por app)
 *   Factory    → createUser(): construye el objeto usuario a partir del email/rol
 *   Strategy   → emailRoleStrategy: detecta rol por patrón de email
 *               roleStrategies: acceso y redirección por rol
 *   Observer   → computed reactivos: isAuthenticated, redirectPath, roleLabel
 *   Guard      → canAccess() usada por el router beforeEach
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// ─── Factory: crea el objeto usuario estandarizado ────────────────────────────
function createUser({ email, role, nombre, avatar, plan, id }) {
  return {
    id:     id     ?? Date.now(),
    nombre: nombre ?? (role === 'admin' ? 'Admin Virel' : 'Miembro Virel'),
    email:  email.toLowerCase().trim(),
    role,
    avatar: avatar ?? (role === 'admin' ? 'AV' : email.slice(0, 2).toUpperCase()),
    plan:   plan   ?? (role === 'admin' ? null : 'Premium'),
  }
}

// ─── Strategy: detección de rol por patrón de email ──────────────────────────
const emailRoleStrategy = [
  { test: (email) => email.includes('admin@'),  role: 'admin'  },
  { test: (email) => email.includes('member@'), role: 'member' },
]

function detectRole(email) {
  return emailRoleStrategy.find((s) => s.test(email.toLowerCase()))?.role ?? null
}

// ─── Strategy: comportamiento diferenciado por rol ────────────────────────────
const roleStrategies = {
  admin: {
    label: 'Administrador',
    redirectPath: '/admin/dashboard',
    canAccess: (meta) => !meta?.requiresAuth || meta?.role === 'admin',
  },
  member: {
    label: 'Miembro',
    redirectPath: '/member/dashboard',
    canAccess: (meta) => !meta?.requiresAuth || meta?.role === 'member',
  },
}

// ─── Helpers de almacenamiento (scope módulo para evitar funciones anidadas) ───
function _persist(userData, authToken) {
  try {
    localStorage.setItem('virel_token', authToken)
    localStorage.setItem('virel_user', JSON.stringify(userData))
  } catch { /* storage no disponible */ }
}

function _clear() {
  try {
    localStorage.removeItem('virel_token')
    localStorage.removeItem('virel_user')
  } catch { /* storage no disponible */ }
}

// ─── Helpers de login (extraídos para reducir complejidad cognitiva) ─────────
function _buildDemoSession(demoRole) {
  const profiles = {
    admin:  { nombre: 'Admin Virel',  avatar: 'AV', plan: null      },
    member: { nombre: 'Juan Pérez',   avatar: 'JP', plan: 'Premium' },
  }
  const profile = profiles[demoRole]
  return createUser({ email: `${demoRole}@virelgym.com`, role: demoRole, ...profile })
}

function _validateCredentials(email, password) {
  if (!email || !password) throw new Error('Completa todos los campos')
  const emailNorm = email.toLowerCase().trim()
  if (!emailNorm.includes('@')) throw new Error('Ingresa un correo electrónico válido')
  if (password.length < 4)    throw new Error('La contraseña debe tener al menos 4 caracteres')
  const resolvedRole = detectRole(emailNorm)
  if (!resolvedRole) throw new Error('Correo no reconocido. Usa admin@... o member@... para ingresar')
  return { emailNorm, resolvedRole }
}
export const useAuthStore = defineStore('auth', () => {
  // Estado principal
  const user    = ref(null)
  const role    = ref(null)   // 'admin' | 'member' | null
  const token   = ref(null)
  const error   = ref(null)
  const loading = ref(false)

  // ── Observer: derivados reactivos ─────────────────────────────────────────
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const redirectPath    = computed(() => roleStrategies[role.value]?.redirectPath ?? '/')
  const roleLabel       = computed(() => roleStrategies[role.value]?.label ?? 'Visitante')

  // ── Strategy: validación de acceso ────────────────────────────────────────
  function canAccess(routeMeta) {
    if (!routeMeta?.requiresAuth) return true
    if (!isAuthenticated.value) return false
    return roleStrategies[role.value]?.canAccess(routeMeta) ?? false
  }

  function hasRole(r) {
    return role.value === r
  }

  // ── Login ─────────────────────────────────────────────────────────────────
  async function login({ email, password, demoRole } = {}) {
    error.value   = null
    loading.value = true

    // Simular latencia de red (reemplazar con fetch/axios en producción)
    await new Promise((resolve) => setTimeout(resolve, 600))

    try {
      let resolvedRole, resolvedUser

      if (demoRole) {
        // Modo demo: rol directo (Strategy: botones de acceso rápido)
        if (!roleStrategies[demoRole]) throw new Error('Rol de demo no válido')
        resolvedRole = demoRole
        resolvedUser = _buildDemoSession(demoRole)
      } else {
        // Modo email/password: validar y detectar rol
        const creds  = _validateCredentials(email, password)
        resolvedRole = creds.resolvedRole
        // Factory: construir usuario desde datos disponibles
        resolvedUser = createUser({ email: creds.emailNorm, role: resolvedRole })
      }

      // Guardar sesión
      user.value  = resolvedUser
      role.value  = resolvedRole
      token.value = `virel_${resolvedRole}_${Date.now()}`
      _persist(user.value, token.value)

      return { success: true, redirectPath: redirectPath.value }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // ── Logout ────────────────────────────────────────────────────────────────
  function logout() {
    user.value  = null
    role.value  = null
    token.value = null
    error.value = null
    _clear()
  }

  // ── Persistencia (localStorage) ───────────────────────────────────────────
  function _init() {
    try {
      const savedToken = localStorage.getItem('virel_token')
      const savedUser  = localStorage.getItem('virel_user')
      if (savedToken && savedUser) {
        const parsed = JSON.parse(savedUser)
        token.value  = savedToken
        user.value   = parsed
        role.value   = parsed.role
      }
    } catch {
      _clear()
    }
  }
  _init()

  return {
    // Estado
    user, role, token, error, loading,
    // Computed (Observer)
    isAuthenticated, redirectPath, roleLabel,
    // Acciones
    login, logout, hasRole, canAccess,
  }
})
