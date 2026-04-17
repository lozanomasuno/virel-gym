<template>
  <div class="login-root">

    <!-- ── Fondo decorativo ─────────────────────────────────────────────── -->
    <div class="bg-layer" aria-hidden="true">
      <div class="bg-circle bg-circle--1"></div>
      <div class="bg-circle bg-circle--2"></div>
      <div class="bg-circle bg-circle--3"></div>
    </div>

    <!-- ── Tarjeta central ──────────────────────────────────────────────── -->
    <Transition name="card-in" appear>
      <div class="login-card">

        <!-- Logo + heading -->
        <div class="card-header">
          <div class="logo-wrap">
            <img src="@/assets/logo.svg" alt="Virel" class="logo-img" />
          </div>
          <h1 class="card-title">Bienvenido</h1>
          <p class="card-sub">Ingresa a tu panel con las credenciales de acceso</p>
        </div>

        <!-- ── Formulario ─────────────────────────────────────────────── -->
        <form class="card-form" @submit.prevent="handleLogin" novalidate>

          <!-- Email -->
          <div class="field-group" :class="{ 'field-group--error': fieldError.email }">
            <label for="login-email" class="field-label">
              <svg class="field-icon" width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              Correo electrónico
            </label>
            <input
              id="login-email"
              v-model.trim="form.email"
              type="email"
              placeholder="admin@virel.com"
              autocomplete="email"
              :disabled="auth.loading"
              @input="clearFieldError('email')"
              @blur="validateEmail"
            />
            <Transition name="field-err">
              <span v-if="fieldError.email" class="field-error-msg">{{ fieldError.email }}</span>
            </Transition>
          </div>

          <!-- Contraseña -->
          <div class="field-group" :class="{ 'field-group--error': fieldError.password }">
            <label for="login-password" class="field-label">
              <svg class="field-icon" width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Contraseña
            </label>
            <div class="password-wrap">
              <input
                v-if="!showPass"
                id="login-password"
                v-model="form.password"
                type="password"
                placeholder="••••••••"
                autocomplete="current-password"
                :disabled="auth.loading"
                @input="clearFieldError('password')"
              />
              <input
                v-else
                id="login-password"
                v-model="form.password"
                type="text"
                placeholder="••••••••"
                autocomplete="off"
                :disabled="auth.loading"
                @input="clearFieldError('password')"
              />
              <button
                type="button"
                class="pass-eye"
                :aria-label="showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                @click="showPass = !showPass"
                tabindex="-1"
              >
                <!-- Mostrar icono ojo / ojo tachado -->
                <svg v-if="!showPass" width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              </button>
            </div>
            <Transition name="field-err">
              <span v-if="fieldError.password" class="field-error-msg">{{ fieldError.password }}</span>
            </Transition>
          </div>

          <!-- Error global del store (Observer) -->
          <Transition name="shake-in">
            <div v-if="auth.error" class="global-error" role="alert">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {{ auth.error }}
            </div>
          </Transition>

          <!-- Botón principal -->
          <button
            type="submit"
            class="btn-submit"
            :class="{ 'btn-submit--loading': auth.loading }"
            :disabled="auth.loading"
          >
            <span v-if="!auth.loading" class="btn-text">
              Ingresar
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </span>
            <span v-else class="btn-loader" aria-label="Cargando">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </span>
          </button>
        </form>

        <!-- ── Separador ─────────────────────────────────────────────────── -->
        <div class="divider">
          <span>acceso rápido</span>
        </div>

        <!-- ── Demo chips (Strategy: selección de rol) ───────────────────── -->
        <div class="demo-row">
          <button
            class="demo-chip demo-chip--admin"
            type="button"
            @click="quickLogin('admin')"
            :disabled="auth.loading"
          >
            <!-- Ícono admin -->
            <span class="chip-icon">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="8" r="4"/>
                <path d="M20 21a8 8 0 1 0-16 0"/>
                <circle cx="18" cy="18" r="4"/>
                <path d="M16 18h4M18 16v4"/>
              </svg>
            </span>
            <span>
              <strong>Administrador</strong>
              <em>admin@virelgym.com</em>
            </span>
          </button>

          <button
            class="demo-chip demo-chip--member"
            type="button"
            @click="quickLogin('member')"
            :disabled="auth.loading"
          >
            <span class="chip-icon">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </span>
            <span>
              <strong>Miembro</strong>
              <em>member@virelgym.com</em>
            </span>
          </button>
        </div>

        <!-- ── Hint de credenciales ──────────────────────────────────────── -->
        <div class="hint-box">
          <p class="hint-title">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            Credenciales de acceso simuladas
          </p>
          <ul class="hint-list">
            <li>
              <span class="role-tag role-tag--admin">Admin</span>
              <code>admin@virel.com</code>
              <span class="sep">·</span>
              <code>cualquier contraseña</code>
            </li>
            <li>
              <span class="role-tag role-tag--member">Miembro</span>
              <code>member@virel.com</code>
              <span class="sep">·</span>
              <code>cualquier contraseña</code>
            </li>
          </ul>
        </div>

        <!-- Footer de la card -->
        <p class="card-footer-text">
          ¿Aún no eres miembro?
          <router-link to="/membership" class="footer-link">Ver planes</router-link>
        </p>

      </div><!-- /login-card -->
    </Transition>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

// ── Singleton: instancia única del store ───────────────────────────────────
const auth   = useAuthStore()
const router = useRouter()
const route  = useRoute()

// ── Estado local (Observer: la UI reacciona a estos refs) ──────────────────
const showPass = ref(false)

const form = reactive({
  email:    '',
  password: '',
})

const fieldError = reactive({
  email:    '',
  password: '',
})

// ── Validación inline ──────────────────────────────────────────────────────
function validateEmail() {
  const e = form.email.toLowerCase()
  if (!e) {
    fieldError.email = 'El correo es obligatorio'
    return false
  }
  if (!e.includes('@') || !e.includes('.')) {
    fieldError.email = 'Ingresa un correo válido'
    return false
  }
  fieldError.email = ''
  return true
}

function clearFieldError(field) {
  fieldError[field] = ''
  if (auth.error) auth.error = null
}

// ── Strategy: redirección dinámica según rol ───────────────────────────────
function redirect(path) {
  const dest = route.query.redirect || path
  router.push(dest)
}

// ── Login con email y contraseña ───────────────────────────────────────────
async function handleLogin() {
  const emailOk = validateEmail()
  if (!emailOk) return

  const result = await auth.login({
    email:    form.email,
    password: form.password,
  })

  if (result.success) redirect(result.redirectPath)
}

// ── Quick login (acceso rápido por rol) ────────────────────────────────────
async function quickLogin(demoRole) {
  const result = await auth.login({ demoRole })
  if (result.success) redirect(result.redirectPath)
}
</script>

<style scoped>
/* ── Root: pantalla completa ─────────────────────────────────────────────── */
.login-root {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #35495E;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
}

/* ── Fondo decorativo ────────────────────────────────────────────────────── */
.bg-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.bg-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(66, 184, 131, 0.08);
}

.bg-circle--1 {
  width: 520px;
  height: 520px;
  top: -160px;
  right: -120px;
}

.bg-circle--2 {
  width: 320px;
  height: 320px;
  bottom: -100px;
  left: -80px;
  background: rgba(66, 184, 131, 0.05);
}

.bg-circle--3 {
  width: 180px;
  height: 180px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.03);
}

/* ── Tarjeta central ─────────────────────────────────────────────────────── */
.login-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 440px;
  background: #ffffff;
  border-radius: 24px;
  box-shadow:
    0 32px 64px rgba(0, 0, 0, 0.18),
    0 4px 16px rgba(0, 0, 0, 0.08);
  padding: 2.5rem 2.25rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* ── Card header ─────────────────────────────────────────────────────────── */
.card-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: #35495E;
  margin-bottom: 1.25rem;
  box-shadow: 0 8px 24px rgba(53, 73, 94, 0.35);
}

.logo-img {
  height: 32px;
  filter: brightness(0) invert(1);
}

.card-title {
  font-size: 1.65rem;
  font-weight: 800;
  color: #1F2937;
  letter-spacing: -0.02em;
  margin-bottom: 0.375rem;
}

.card-sub {
  font-size: 0.875rem;
  color: #6B7280;
  line-height: 1.5;
}

/* ── Formulario ──────────────────────────────────────────────────────────── */
.card-form {
  display: flex;
  flex-direction: column;
  gap: 1.125rem;
  margin-bottom: 1.5rem;
}

/* Grupos de campo */
.field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 0.8rem;
  font-weight: 700;
  color: #374151;
  user-select: none;
}

.field-icon {
  color: #9CA3AF;
  flex-shrink: 0;
}

.field-group input {
  width: 100%;
  padding: 11px 14px;
  border: 1.5px solid #E5E7EB;
  border-radius: 10px;
  font-size: 0.9rem;
  font-family: inherit;
  color: #1F2937;
  background: #F9FAFB;
  transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
  outline: none;
}

.field-group input::placeholder { color: #9CA3AF; }

.field-group input:focus {
  border-color: #42B883;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.14);
}

.field-group input:disabled {
  background: #F3F4F6;
  cursor: not-allowed;
  opacity: 0.7;
}

/* Estado error */
.field-group--error input {
  border-color: #EF4444;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.field-error-msg {
  font-size: 0.72rem;
  color: #B91C1C;
  font-weight: 500;
  padding-left: 2px;
}

/* Contraseña con ojo */
.password-wrap {
  position: relative;
}

.password-wrap input {
  width: 100%;
  padding-right: 44px;
}

.pass-eye {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: #9CA3AF;
  display: flex;
  align-items: center;
  transition: color 0.15s;
  border-radius: 6px;
}

.pass-eye:hover { color: #35495E; }

/* Error global */
.global-error {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 11px 14px;
  background: #FEF2F2;
  border: 1px solid #FECACA;
  border-radius: 10px;
  font-size: 0.84rem;
  color: #B91C1C;
  font-weight: 500;
  line-height: 1.4;
}

.global-error svg { flex-shrink: 0; margin-top: 1px; }

/* Botón submit */
.btn-submit {
  width: 100%;
  padding: 13px;
  border-radius: 10px;
  background: linear-gradient(135deg, #42B883 0%, #359a6d 100%);
  color: #072e1a;
  font-size: 0.95rem;
  font-weight: 700;
  font-family: inherit;
  border: none;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
  box-shadow: 0 4px 16px rgba(66, 184, 131, 0.38);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  margin-top: 0.375rem;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 22px rgba(66, 184, 131, 0.45);
}

.btn-submit:active:not(:disabled) { transform: translateY(0); }
.btn-submit:disabled { opacity: 0.65; cursor: not-allowed; }

.btn-text {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Loading dots */
.btn-loader {
  display: flex;
  align-items: center;
  gap: 5px;
}

.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.85);
  animation: dot-pulse 1.2s infinite ease-in-out;
}

.dot:nth-child(2) { animation-delay: 0.2s; }
.dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes dot-pulse {
  0%, 80%, 100% { transform: scale(0.75); opacity: 0.5; }
  40%            { transform: scale(1.1);  opacity: 1; }
}

/* ── Separador ───────────────────────────────────────────────────────────── */
.divider {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  margin-bottom: 1rem;
  color: #9CA3AF;
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #E5E7EB;
}

/* ── Demo chips ──────────────────────────────────────────────────────────── */
.demo-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.demo-chip {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 12px;
  font-family: inherit;
  font-size: 0.78rem;
  cursor: pointer;
  border: 1.5px solid transparent;
  transition: transform 0.15s, border-color 0.18s, background 0.18s, box-shadow 0.18s;
  text-align: left;
}

.demo-chip:hover:not(:disabled) {
  transform: translateY(-1px);
}

.demo-chip:disabled { opacity: 0.5; cursor: not-allowed; }

.demo-chip strong {
  display: block;
  font-weight: 700;
  color: #1F2937;
  font-size: 0.8rem;
  line-height: 1.2;
}

.demo-chip em {
  display: block;
  font-style: normal;
  font-size: 0.68rem;
  color: #6B7280;
  margin-top: 1px;
}

/* Variante admin */
.demo-chip--admin {
  background: rgba(53, 73, 94, 0.05);
  border-color: rgba(53, 73, 94, 0.12);
}

.demo-chip--admin:hover:not(:disabled) {
  background: rgba(53, 73, 94, 0.1);
  border-color: #35495E;
  box-shadow: 0 4px 12px rgba(53, 73, 94, 0.14);
}

.demo-chip--admin .chip-icon {
  background: #35495E;
  color: #e2e8f0;
}

/* Variante member */
.demo-chip--member {
  background: rgba(66, 184, 131, 0.05);
  border-color: rgba(66, 184, 131, 0.18);
}

.demo-chip--member:hover:not(:disabled) {
  background: rgba(66, 184, 131, 0.1);
  border-color: #42B883;
  box-shadow: 0 4px 12px rgba(66, 184, 131, 0.16);
}

.demo-chip--member .chip-icon {
  background: #1a5c40;
  color: #6ee7b7;
}

/* Icono del chip */
.chip-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* ── Hint box ────────────────────────────────────────────────────────────── */
.hint-box {
  background: #F9FAFB;
  border: 1px solid #E5E7EB;
  border-radius: 10px;
  padding: 0.875rem 1rem;
  margin-bottom: 1.5rem;
}

.hint-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #6B7280;
  margin-bottom: 0.625rem;
}

.hint-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.hint-list li {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  flex-wrap: wrap;
}

.hint-list code {
  background: #E5E7EB;
  border-radius: 4px;
  padding: 1px 6px;
  font-size: 0.71rem;
  color: #374151;
}

.sep { color: #D1D5DB; }

.role-tag {
  display: inline-block;
  padding: 1px 8px;
  border-radius: 100px;
  font-size: 0.65rem;
  font-weight: 700;
}

.role-tag--admin  { background: #EFF6FF; color: #1D4ED8; }
.role-tag--member { background: #ECFDF5; color: #065F46; }

/* ── Footer ──────────────────────────────────────────────────────────────── */
.card-footer-text {
  text-align: center;
  font-size: 0.82rem;
  color: #9CA3AF;
}

.footer-link {
  color: #42B883;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.15s;
}

.footer-link:hover { color: #359a6d; text-decoration: underline; }

/* ── Transiciones ────────────────────────────────────────────────────────── */
/* Card entrada */
.card-in-enter-active {
  transition: opacity 0.45s ease, transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.card-in-enter-from {
  opacity: 0;
  transform: translateY(24px) scale(0.97);
}

/* Error global shake */
.shake-in-enter-active { animation: shake 0.4s ease; }

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%       { transform: translateX(-5px); }
  40%       { transform: translateX(5px); }
  60%       { transform: translateX(-4px); }
  80%       { transform: translateX(4px); }
}

/* Error de campo */
.field-err-enter-active { transition: all 0.2s ease; }
.field-err-leave-active { transition: all 0.15s ease; }
.field-err-enter-from   { opacity: 0; transform: translateY(-4px); }
.field-err-leave-to     { opacity: 0; }

/* ── Responsive ──────────────────────────────────────────────────────────── */
@media (max-width: 480px) {
  .login-card { padding: 2rem 1.5rem 1.5rem; border-radius: 18px; }
  .demo-row   { grid-template-columns: 1fr; }
  .card-title { font-size: 1.4rem; }
}
</style>
