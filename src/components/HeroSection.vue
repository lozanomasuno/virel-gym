<template>
  <section id="inicio" class="hero">
    <div class="hero__overlay"></div>
    <div class="container hero__content">
      <div class="hero__badge">
        <span class="badge-dot"></span>
        Bienestar · Tecnología · Inclusión
      </div>
      <h1 class="hero__title">
        Muévete mejor.<br />
        <span class="hero__title--accent">Vive mejor.</span>
      </h1>
      <p class="hero__subtitle">
        Un espacio diseñado para todas las personas que desean bienestar, fuerza y equilibrio en un solo lugar.
      </p>
      <div class="hero__cta">
        <a href="#clases" class="btn-primary" @click.prevent="scrollTo('#clases')">
          Reserva tu clase
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </a>
        <a href="#membresias" class="btn-ghost" @click.prevent="scrollTo('#membresias')">Ver planes</a>
      </div>

      <!-- Stats row -->
      <div class="hero__stats">
        <div class="stat">
          <span class="stat__number">500+</span>
          <span class="stat__label">Miembros activos</span>
        </div>
        <div class="stat__divider"></div>
        <div class="stat">
          <span class="stat__number">20+</span>
          <span class="stat__label">Tipos de clases</span>
        </div>
        <div class="stat__divider"></div>
        <div class="stat">
          <span class="stat__number">100%</span>
          <span class="stat__label">Inclusivo</span>
        </div>
      </div>
    </div>

    <!-- Scroll indicator -->
    <div class="hero__scroll-indicator">
      <span></span>
    </div>
  </section>
</template>

<script setup>
function scrollTo(hash) {
  const el = document.querySelector(hash)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
.hero {
  min-height: 100vh;
  background: linear-gradient(135deg, #35495E 0%, #42B883 100%);
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

/* Decorative blobs */
.hero::before {
  content: '';
  position: absolute;
  top: -20%;
  right: -15%;
  width: 600px;
  height: 600px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  pointer-events: none;
}

.hero::after {
  content: '';
  position: absolute;
  bottom: -25%;
  left: -10%;
  width: 500px;
  height: 500px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 50%;
  pointer-events: none;
}

.hero__content {
  position: relative;
  z-index: 2;
  padding-top: 100px;
  padding-bottom: 80px;
  max-width: 700px;
}

.hero__badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  color: rgba(255, 255, 255, 0.9);
  padding: 8px 18px;
  border-radius: 100px;
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.badge-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  background: #42B883;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.2); }
}

.hero__title {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 800;
  color: var(--color-white);
  line-height: 1.15;
  margin-bottom: 1.25rem;
  letter-spacing: -0.02em;
}

.hero__title--accent {
  color: rgba(255, 255, 255, 0.75);
}

.hero__subtitle {
  font-size: clamp(1rem, 2vw, 1.2rem);
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.7;
  margin-bottom: 2.5rem;
  max-width: 560px;
  font-weight: 300;
}

.hero__cta {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 3rem;
}

.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
  font-size: 1rem;
  padding: 14px 24px;
  border-radius: var(--radius-md);
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: var(--transition);
  font-family: inherit;
  background: transparent;
  cursor: pointer;
}

.btn-ghost:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.6);
  color: var(--color-white);
}

/* Stats */
.hero__stats {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat__number {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-white);
  line-height: 1;
}

.stat__label {
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.65);
  font-weight: 400;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.stat__divider {
  width: 1px;
  height: 36px;
  background: rgba(255, 255, 255, 0.25);
}

/* Scroll indicator */
.hero__scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  width: 28px;
  height: 44px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-radius: 20px;
  display: flex;
  justify-content: center;
  padding-top: 8px;
}

.hero__scroll-indicator span {
  display: block;
  width: 4px;
  height: 10px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 4px;
  animation: scroll-bounce 1.8s infinite;
}

@keyframes scroll-bounce {
  0% { transform: translateY(0); opacity: 1; }
  80% { transform: translateY(10px); opacity: 0; }
  100% { transform: translateY(0); opacity: 0; }
}

@media (max-width: 640px) {
  .hero__content {
    padding-top: 120px;
  }

  .hero__stats {
    gap: 1.25rem;
  }

  .stat__divider {
    display: none;
  }
}
</style>
