<template>
  <section class="beneficios">
    <div class="container">
      <div class="beneficios__inner">
        <!-- Text side -->
        <div class="beneficios__text">
          <p class="label-tag">Por qué elegirnos</p>
          <h2 class="section-title">Una experiencia pensada para ti</h2>
          <p class="section-subtitle">
            Cada detalle de Virel está diseñado para que te sientas cómodo, bienvenido y motivado desde el primer día.
          </p>

          <ul class="beneficios__list">
            <li v-for="b in beneficios" :key="b.id" class="beneficio-item">
              <div class="beneficio-item__icon" :style="{ background: `color-mix(in srgb, ${b.color} 12%, transparent)`, color: b.color }">
                <span v-html="b.icon"></span>
              </div>
              <div>
                <h3 class="beneficio-item__title">{{ b.titulo }}</h3>
                <p class="beneficio-item__desc">{{ b.descripcion }}</p>
              </div>
            </li>
          </ul>
        </div>

        <!-- Visual side -->
        <div class="beneficios__visual">
          <div class="visual-card visual-card--main">
            <div class="visual-card__top">
              <div class="visual-metric">
                <span class="visual-metric__num">98%</span>
                <span class="visual-metric__label">Satisfacción</span>
              </div>
              <div class="visual-pulse">
                <span class="pulse-ring"></span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#42B883" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              </div>
            </div>
            <div class="visual-bars">
              <div v-for="(bar, i) in bars" :key="i" class="bar" :style="{ height: bar + '%' }"></div>
            </div>
            <p class="visual-card__label">Actividad semanal</p>
          </div>

          <div class="visual-card visual-card--secondary">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#42B883" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span class="visual-card__stat">+500</span>
            <p class="visual-card__label">Miembros activos</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const bars = [55, 75, 60, 90, 70, 85, 65]

const beneficios = [
  {
    id: 'espacios',
    titulo: 'Espacios modernos',
    descripcion: 'Instalaciones de última generación con equipamiento de primera calidad.',
    color: '#42B883',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
  },
  {
    id: 'inclusivo',
    titulo: 'Ambiente inclusivo',
    descripcion: 'Un espacio donde todas las edades, cuerpos y niveles son bienvenidos.',
    color: '#8B5CF6',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  },
  {
    id: 'edades',
    titulo: 'Clases para todas las edades',
    descripcion: 'Desde jóvenes hasta adultos mayores, tenemos un programa ideal para cada etapa de la vida.',
    color: '#F59E0B',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`,
  },
  {
    id: 'digital',
    titulo: 'Reservas digitales rápidas',
    descripcion: 'Reserva tu clase en segundos desde la app o la web. Sin filas, sin complicaciones.',
    color: '#35495E',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>`,
  },
]
</script>

<style scoped>
.beneficios {
  padding: 100px 0;
  background: var(--color-white);
}

.label-tag {
  display: inline-block;
  color: var(--color-primary);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}

.beneficios__inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.beneficios__list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.beneficio-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.beneficio-item__icon {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
}

.beneficio-item__title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-dark);
  margin-bottom: 0.25rem;
}

.beneficio-item__desc {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  line-height: 1.6;
}

/* Visual side */
.beneficios__visual {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  align-items: center;
}

.visual-card {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-gray-light);
  padding: 1.75rem;
  width: 100%;
  max-width: 320px;
}

.visual-card--main {
  z-index: 2;
}

.visual-card--secondary {
  display: flex;
  align-items: center;
  gap: 1rem;
  align-self: flex-end;
  max-width: 260px;
}

.visual-card__top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.25rem;
}

.visual-metric__num {
  display: block;
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--color-dark);
  line-height: 1;
}

.visual-metric__label {
  font-size: 0.78rem;
  color: var(--color-text-muted);
  letter-spacing: 0.04em;
}

.visual-pulse {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
}

.pulse-ring {
  position: absolute;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid rgba(66, 184, 131, 0.3);
  animation: ring-pulse 2s infinite;
}

@keyframes ring-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.3); opacity: 0; }
}

.visual-bars {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  height: 80px;
  margin-bottom: 0.75rem;
}

.bar {
  flex: 1;
  background: linear-gradient(to top, #42B883, #6EE7B7);
  border-radius: 4px 4px 0 0;
  transition: var(--transition);
}

.visual-card__label {
  font-size: 0.78rem;
  color: var(--color-text-muted);
  text-align: center;
}

.visual-card__stat {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-dark);
}

@media (max-width: 900px) {
  .beneficios__inner {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }

  .beneficios__visual {
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
  }

  .visual-card--secondary {
    align-self: auto;
  }
}

@media (max-width: 768px) {
  .beneficios {
    padding: 72px 0;
  }
}
</style>
