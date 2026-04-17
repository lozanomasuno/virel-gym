<template>
  <header class="navbar" :class="{ scrolled: isScrolled, 'menu-open': store.isMenuOpen }">
    <div class="container navbar__inner">
      <!-- Logo -->
      <router-link to="/" class="navbar__logo" @click="store.closeMenu">
        <img src="@/assets/logo.svg" alt="Virel" width="130" height="36" />
      </router-link>

      <!-- Desktop nav -->
      <nav class="navbar__links" aria-label="Navegación principal">
        <a href="#inicio" @click="scrollTo('#inicio')">Inicio</a>
        <a href="#clases" @click="scrollTo('#clases')">Clases</a>
        <a href="#membresias" @click="scrollTo('#membresias')">Membresías</a>
        <a href="#contacto" @click="scrollTo('#contacto')">Contacto</a>
      </nav>

      <div class="navbar__actions">
        <router-link to="/login" class="btn-primary btn-sm">Ingresar</router-link>
        <!-- Hamburger -->
        <button
          class="navbar__hamburger"
          :aria-expanded="store.isMenuOpen"
          aria-label="Abrir menú"
          @click="store.toggleMenu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>

    <!-- Mobile drawer -->
    <Transition name="slide-down">
      <div v-if="store.isMenuOpen" class="navbar__mobile">
        <a href="#inicio" @click="mobileNav('#inicio')">Inicio</a>
        <a href="#clases" @click="mobileNav('#clases')">Clases</a>
        <a href="#membresias" @click="mobileNav('#membresias')">Membresías</a>
        <a href="#contacto" @click="mobileNav('#contacto')">Contacto</a>
        <router-link to="/login" class="btn-primary" @click="store.closeMenu()">Ingresar</router-link>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useGymStore } from '@/stores/gymStore'

const store = useGymStore()
const isScrolled = ref(false)

function onScroll() {
  isScrolled.value = window.scrollY > 20
}

function scrollTo(hash) {
  const el = document.querySelector(hash)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

function mobileNav(hash) {
  store.closeMenu()
  setTimeout(() => scrollTo(hash), 150)
}

onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(249, 250, 251, 0.85);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid transparent;
  transition: var(--transition);
}

.navbar.scrolled {
  background: rgba(249, 250, 251, 0.97);
  border-bottom-color: var(--color-gray-light);
  box-shadow: var(--shadow-sm);
}

.navbar__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
}

.navbar__logo img {
  height: 36px;
  width: auto;
}

.navbar__links {
  display: flex;
  gap: 2rem;
}

.navbar__links a {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text);
  position: relative;
  padding-bottom: 2px;
  transition: var(--transition);
}

.navbar__links a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--color-primary);
  border-radius: 2px;
  transition: var(--transition);
}

.navbar__links a:hover {
  color: var(--color-primary);
}

.navbar__links a:hover::after {
  width: 100%;
}

.navbar__actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-sm {
  padding: 10px 24px;
  font-size: 0.875rem;
}

/* Hamburger */
.navbar__hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  padding: 4px;
}

.navbar__hamburger span {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--color-dark);
  border-radius: 2px;
  transition: var(--transition);
}

/* Mobile drawer */
.navbar__mobile {
  display: flex;
  flex-direction: column;
  gap: 0;
  background: var(--color-white);
  border-top: 1px solid var(--color-gray-light);
  padding: 1rem 24px 1.5rem;
}

.navbar__mobile a {
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-text);
  padding: 12px 0;
  border-bottom: 1px solid var(--color-gray-light);
  transition: var(--transition);
}

.navbar__mobile a:hover {
  color: var(--color-primary);
}

.navbar__mobile .btn-primary {
  margin-top: 1rem;
  justify-content: center;
}

/* Transitions */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  max-height: 0;
}

.slide-down-enter-to,
.slide-down-leave-from {
  opacity: 1;
  max-height: 400px;
}

@media (max-width: 768px) {
  .navbar__links {
    display: none;
  }

  .navbar__hamburger {
    display: flex;
  }

  .navbar__actions .btn-primary {
    display: none;
  }
}
</style>
