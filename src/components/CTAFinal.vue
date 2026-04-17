<template>
  <section class="cta-final">
    <div class="cta-final__overlay"></div>
    <div class="container cta-final__content">
      <div class="cta-final__icon">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>
      </div>
      <h2 class="cta-final__title">Empieza hoy tu transformación</h2>
      <p class="cta-final__subtitle">
        El mejor momento para comenzar fue ayer. El segundo mejor momento es ahora.
        Únete a la comunidad Virel y da el primer paso hacia tu mejor versión.
      </p>
      <div class="cta-final__actions">
        <a href="#membresias" class="btn-light" @click.prevent="scrollTo('#membresias')">
          Únete ahora
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </a>
        <a href="#clases" class="btn-ghost-dark" @click.prevent="scrollTo('#clases')">
          Ver clases
        </a>
      </div>
    </div>

    <!-- Decorative circles -->
    <div class="cta-final__circle cta-final__circle--1"></div>
    <div class="cta-final__circle cta-final__circle--2"></div>
  </section>
</template>

<script setup>
function scrollTo(hash) {
  const el = document.querySelector(hash)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
.cta-final {
  padding: 120px 0;
  background: linear-gradient(135deg, #35495E 0%, #42B883 100%);
  position: relative;
  overflow: hidden;
  text-align: center;
}

.cta-final__circle {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}

.cta-final__circle--1 {
  width: 500px;
  height: 500px;
  top: -30%;
  right: -15%;
  background: rgba(255, 255, 255, 0.04);
}

.cta-final__circle--2 {
  width: 300px;
  height: 300px;
  bottom: -20%;
  left: -8%;
  background: rgba(255, 255, 255, 0.06);
}

.cta-final__content {
  position: relative;
  z-index: 2;
}

.cta-final__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  color: var(--color-white);
  margin: 0 auto 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.cta-final__title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  color: var(--color-white);
  margin-bottom: 1.25rem;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.cta-final__subtitle {
  font-size: clamp(0.95rem, 2vw, 1.1rem);
  color: rgba(255, 255, 255, 0.78);
  max-width: 560px;
  margin: 0 auto 2.5rem;
  line-height: 1.7;
  font-weight: 300;
}

.cta-final__actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-light {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--color-white);
  color: var(--color-dark);
  padding: 14px 32px;
  border-radius: var(--radius-md);
  font-weight: 700;
  font-size: 1rem;
  font-family: inherit;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border: none;
}

.btn-light:hover {
  background: #f0fdf8;
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

.btn-ghost-dark {
  display: inline-flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
  font-size: 1rem;
  padding: 14px 28px;
  border-radius: var(--radius-md);
  border: 2px solid rgba(255, 255, 255, 0.35);
  transition: var(--transition);
  font-family: inherit;
  background: transparent;
  cursor: pointer;
}

.btn-ghost-dark:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.6);
  color: var(--color-white);
}
</style>
