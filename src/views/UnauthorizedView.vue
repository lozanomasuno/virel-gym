<template>
  <div class="unauthorized-page">
    <div class="unauth-box">
      <!-- Ícono -->
      <div class="unauth-icon">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 9.9-1"/>
        </svg>
      </div>

      <p class="unauth-code">403</p>
      <h1 class="unauth-title">Acceso denegado</h1>
      <p class="unauth-desc">
        No tienes permiso para ver esta página. Tu sesión actual
        {{ auth.isAuthenticated ? `(${auth.roleLabel})` : '' }}
        no tiene los privilegios necesarios.
      </p>

      <div class="unauth-actions">
        <button class="btn-back" @click="router.go(-1)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Volver atrás
        </button>

        <router-link v-if="!auth.isAuthenticated" to="/login" class="btn-login-link">
          Iniciar sesión
        </router-link>
        <router-link v-else :to="auth.redirectPath" class="btn-login-link">
          Ir a mi panel
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const auth   = useAuthStore()
</script>

<style scoped>
.unauthorized-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  padding: 2rem;
}

.unauth-box {
  text-align: center;
  max-width: 420px;
}

.unauth-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #fef2f2;
  color: #b91c1c;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.unauth-code {
  font-size: 4rem;
  font-weight: 800;
  color: var(--color-gray-light);
  line-height: 1;
  margin-bottom: 0.5rem;
}

.unauth-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-dark);
  margin-bottom: 0.875rem;
}

.unauth-desc {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  line-height: 1.6;
  margin-bottom: 2rem;
}

.unauth-actions {
  display: flex;
  gap: 0.875rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 22px;
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

.btn-back:hover {
  border-color: var(--color-dark);
  color: var(--color-dark);
  background: var(--color-bg);
}

.btn-login-link {
  display: inline-flex;
  align-items: center;
  padding: 10px 22px;
  border-radius: var(--radius-sm);
  background: var(--color-primary);
  color: #fff;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  transition: var(--transition);
}

.btn-login-link:hover { background: var(--color-primary-dark); }
</style>
