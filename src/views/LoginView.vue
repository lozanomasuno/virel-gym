<template>
  <div class="login-page">
    <!-- Panel izquierdo: branding -->
    <div class="login-brand" aria-hidden="true">
      <div class="brand-inner">
        <img src="@/assets/logo.svg" alt="Virel" class="brand-logo" />
        <h1 class="brand-headline">Bienvenido de vuelta</h1>
        <p class="brand-sub">
          Gestiona tu gimnasio o accede a tus reservas desde un solo lugar.
        </p>
        <ul class="brand-features">
          <li>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            Dashboard en tiempo real
          </li>
          <li>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            Gestión de reservas y clases
          </li>
          <li>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            Reportes y analítica avanzada
          </li>
        </ul>
      </div>
      <div class="brand-badge">Plataforma CRM Virel v2.0</div>
    </div>

    <!-- Panel derecho: formulario -->
    <div class="login-panel">
      <div class="login-box">
        <!-- Logo mobile -->
        <img src="@/assets/logo.svg" alt="Virel" class="login-logo-mobile" />

        <h2 class="login-title">Iniciar sesión</h2>
        <p class="login-sub">Ingresa tus credenciales o usa el acceso demo</p>

        <!-- Demo mode -->
        <div class="demo-section">
          <p class="demo-label">Acceso rápido demo</p>
          <div class="demo-btns">
            <button
              class="demo-btn demo-btn--admin"
              @click="loginDemo('admin')"
              :disabled="auth.loading"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/><circle cx="18" cy="18" r="4"/><path d="M16 18h4M18 16v4"/></svg>
              Administrador
            </button>
            <button
              class="demo-btn demo-btn--member"
              @click="loginDemo('member')"
              :disabled="auth.loading"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Miembro
            </button>
          </div>
        </div>

        <div class="divider"><span>o ingresa con email</span></div>

        <!-- Formulario real -->
        <form @submit.prevent="handleLogin" novalidate>
          <div class="form-group">
            <label for="login-email">Correo electrónico</label>
            <input
              id="login-email"
              v-model="form.email"
              type="email"
              placeholder="correo@ejemplo.com"
              autocomplete="email"
              :disabled="auth.loading"
            />
          </div>

          <div class="form-group">
            <label for="login-password">
              Contraseña
              <a href="#" class="forgot-link" tabindex="-1">¿Olvidaste tu contraseña?</a>
            </label>
            <div class="input-password">
              <input
                id="login-password"
                v-model="form.password"
                :type="showPass ? 'text' : 'password'"
                placeholder="••••••••"
                autocomplete="current-password"
                :disabled="auth.loading"
              />
              <button
                type="button"
                class="pass-toggle"
                :aria-label="showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                @click="showPass = !showPass"
              >
                <svg v-if="!showPass" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              </button>
            </div>
          </div>

          <!-- Error -->
          <Transition name="fade-up">
            <div v-if="auth.error" class="login-error" role="alert">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {{ auth.error }}
            </div>
          </Transition>

          <button type="submit" class="btn-login" :disabled="auth.loading">
            <span v-if="!auth.loading">Ingresar</span>
            <span v-else class="loading-dots">
              <span></span><span></span><span></span>
            </span>
          </button>
        </form>

        <p class="login-register">
          ¿Aún no tienes cuenta?
          <router-link to="/membership">Ver planes de membresía</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const auth   = useAuthStore()
const router = useRouter()
const route  = useRoute()

const showPass = ref(false)
const form = reactive({ email: '', password: '' })

// ── Demo login (Strategy: role-based redirect) ────────────────────────────
async function loginDemo(demoRole) {
  const result = await auth.login({ demoRole })
  if (result.success) redirect(result.redirectPath)
}

// ── Real login ────────────────────────────────────────────────────────────
async function handleLogin() {
  const result = await auth.login({ email: form.email, password: form.password })
  if (result.success) redirect(result.redirectPath)
}

function redirect(fallback) {
  const dest = route.query.redirect || fallback
  router.push(dest)
}
</script>

<style scoped>
.login-page {
  display: flex;
  min-height: 100vh;
}

/* ── Branding panel ──────────────────────────────────────────────────────── */
.login-brand {
  width: 44%;
  background: linear-gradient(145deg, #35495E 0%, #2a3a4c 100%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2.5rem;
  position: relative;
  overflow: hidden;
}

.login-brand::before {
  content: '';
  position: absolute;
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background: rgba(66, 184, 131, 0.12);
  top: -80px;
  right: -80px;
}

.login-brand::after {
  content: '';
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: rgba(66, 184, 131, 0.08);
  bottom: 80px;
  left: -60px;
}

.brand-inner { position: relative; z-index: 1; }

.brand-logo {
  height: 38px;
  filter: brightness(0) invert(1);
  margin-bottom: 3rem;
}

.brand-headline {
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  line-height: 1.2;
  margin-bottom: 1rem;
}

.brand-sub {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
  margin-bottom: 2.5rem;
  max-width: 320px;
}

.brand-features {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.brand-features li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
}

.brand-features li svg {
  color: var(--color-primary);
  flex-shrink: 0;
}

.brand-badge {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 100px;
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.5);
  width: fit-content;
}

/* ── Form panel ──────────────────────────────────────────────────────────── */
.login-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  padding: 2rem;
}

.login-box {
  width: 100%;
  max-width: 420px;
}

.login-logo-mobile {
  height: 32px;
  margin-bottom: 2rem;
  display: none;
}

.login-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--color-dark);
  margin-bottom: 0.375rem;
}

.login-sub {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  margin-bottom: 2rem;
}

/* ── Demo section ────────────────────────────────────────────────────────── */
.demo-section {
  background: var(--color-white);
  border: 1px solid var(--color-gray-light);
  border-radius: var(--radius-md);
  padding: 1.25rem;
  margin-bottom: 1.5rem;
}

.demo-label {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--color-text-muted);
  margin-bottom: 0.875rem;
}

.demo-btns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.demo-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 10px 16px;
  border-radius: var(--radius-sm);
  font-size: 0.84rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: var(--transition);
  border: 1.5px solid transparent;
}

.demo-btn--admin {
  background: rgba(53, 73, 94, 0.07);
  color: var(--color-dark);
  border-color: rgba(53, 73, 94, 0.15);
}

.demo-btn--admin:hover:not(:disabled) {
  background: var(--color-dark);
  color: #fff;
}

.demo-btn--member {
  background: rgba(66, 184, 131, 0.08);
  color: var(--color-primary-dark);
  border-color: rgba(66, 184, 131, 0.25);
}

.demo-btn--member:hover:not(:disabled) {
  background: var(--color-primary);
  color: #fff;
}

.demo-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ── Divider ─────────────────────────────────────────────────────────────── */
.divider {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  margin-bottom: 1.5rem;
  color: var(--color-text-muted);
  font-size: 0.78rem;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--color-gray-light);
}

/* ── Form ────────────────────────────────────────────────────────────────── */
form { display: flex; flex-direction: column; gap: 1.125rem; }

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--color-dark);
}

.forgot-link {
  font-size: 0.78rem;
  font-weight: 400;
  color: var(--color-primary);
  text-decoration: none;
}

.forgot-link:hover { text-decoration: underline; }

.form-group input {
  padding: 10px 14px;
  border: 1.5px solid var(--color-gray-light);
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
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

.form-group input:disabled {
  background: var(--color-bg);
  cursor: not-allowed;
}

.input-password {
  position: relative;
}

.input-password input {
  width: 100%;
  padding-right: 42px;
}

.pass-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-muted);
  padding: 2px;
  display: flex;
  align-items: center;
  transition: var(--transition);
}

.pass-toggle:hover { color: var(--color-dark); }

/* ── Error ───────────────────────────────────────────────────────────────── */
.login-error {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: var(--radius-sm);
  font-size: 0.84rem;
  color: #b91c1c;
}

/* ── Submit ──────────────────────────────────────────────────────────────── */
.btn-login {
  padding: 12px;
  border-radius: var(--radius-sm);
  background: var(--color-primary);
  color: #fff;
  font-size: 0.95rem;
  font-weight: 700;
  font-family: inherit;
  border: none;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
}

.btn-login:hover:not(:disabled) { background: var(--color-primary-dark); }
.btn-login:disabled { opacity: 0.6; cursor: not-allowed; }

/* Loading dots */
.loading-dots {
  display: flex;
  gap: 5px;
}

.loading-dots span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.8);
  animation: dot-bounce 1.2s infinite ease-in-out;
}

.loading-dots span:nth-child(2) { animation-delay: 0.2s; }
.loading-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes dot-bounce {
  0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
  40% { transform: scale(1.1); opacity: 1; }
}

.login-register {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.84rem;
  color: var(--color-text-muted);
}

.login-register a {
  color: var(--color-primary);
  font-weight: 600;
  text-decoration: none;
}

.login-register a:hover { text-decoration: underline; }

/* ── Transitions ─────────────────────────────────────────────────────────── */
.fade-up-enter-active, .fade-up-leave-active { transition: all 0.25s ease; }
.fade-up-enter-from { opacity: 0; transform: translateY(-6px); }
.fade-up-leave-to   { opacity: 0; }

/* ── Responsive ──────────────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .login-brand { display: none; }
  .login-logo-mobile { display: block; }
  .login-panel { padding: 1.5rem; }
}
</style>
