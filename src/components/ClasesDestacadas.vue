<template>
  <section id="clases" class="clases">
    <div class="container">
      <div class="clases__header">
        <p class="label-tag">Nuestras clases</p>
        <h2 class="section-title">Clases para cada momento</h2>
        <p class="section-subtitle">
          Encuentra la actividad perfecta para tu cuerpo, tu ritmo y tu energía.
        </p>
      </div>

      <div class="clases__grid">
        <article
          v-for="clase in clases"
          :key="clase.id"
          class="clase-card"
          :style="{ '--card-color': clase.color }"
        >
          <div class="clase-card__icon">
            <span class="icon-wrapper" v-html="clase.icon"></span>
          </div>
          <h3 class="clase-card__title">{{ clase.nombre }}</h3>
          <p class="clase-card__desc">{{ clase.descripcion }}</p>
          <div class="clase-card__footer">
            <span class="clase-card__tag">{{ clase.nivel }}</span>
            <span class="clase-card__arrow">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </span>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
const clases = [
  {
    id: 'pilates',
    nombre: 'Pilates',
    descripcion: 'Fortalece tu núcleo, mejora la postura y conecta cuerpo y mente en cada sesión.',
    nivel: 'Todos los niveles',
    color: '#42B883',
    icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="2"/><path d="M12 7v5l-3 3"/><path d="M12 12l3 3"/><path d="M9 16l-2 4"/><path d="M15 16l2 4"/></svg>`,
  },
  {
    id: 'fuerza',
    nombre: 'Fuerza',
    descripcion: 'Entrena con pesas, máquinas y peso corporal para ganar músculo y resistencia.',
    nivel: 'Intermedio · Avanzado',
    color: '#35495E',
    icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4v16M18 4v16M2 9h4M18 9h4M2 15h4M18 15h4M6 9h12M6 15h12"/></svg>`,
  },
  {
    id: 'movilidad',
    nombre: 'Movilidad',
    descripcion: 'Recupera y amplía tu rango de movimiento con técnicas de flexibilidad y liberación.',
    nivel: 'Todos los niveles',
    color: '#6EE7B7',
    icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M12 8v4l3 3"/></svg>`,
  },
  {
    id: 'danza',
    nombre: 'Danza',
    descripcion: 'Exprésate con ritmo. Desde salsa hasta contemporánea, el movimiento como arte.',
    nivel: 'Principiante · Medio',
    color: '#F59E0B',
    icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="2"/><path d="M9 19l1-4-2-4 4-3 4 3-2 4 1 4"/><path d="M7 19h10"/></svg>`,
  },
  {
    id: 'adulto-mayor',
    nombre: 'Adulto Mayor',
    descripcion: 'Clases suaves y seguras para mantener la vitalidad, el equilibrio y la independencia.',
    nivel: 'Adaptado',
    color: '#8B5CF6',
    icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  },
]
</script>

<style scoped>
.clases {
  padding: 100px 0;
  background: var(--color-bg);
}

.clases__header {
  text-align: center;
  margin-bottom: 3.5rem;
}

.clases__header .section-subtitle {
  margin-left: auto;
  margin-right: auto;
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

.clases__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.clase-card {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  padding: 2rem 1.75rem;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-gray-light);
  transition: var(--transition);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.clase-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--card-color);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}

.clase-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-md);
  border-color: var(--card-color);
}

.clase-card__icon {
  margin-bottom: 1.25rem;
}

.icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: var(--radius-md);
  background: color-mix(in srgb, var(--card-color) 12%, transparent);
  color: var(--card-color);
  transition: var(--transition);
}

.clase-card:hover .icon-wrapper {
  background: var(--card-color);
  color: white;
}

.clase-card__title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-dark);
  margin-bottom: 0.6rem;
}

.clase-card__desc {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  line-height: 1.6;
  margin-bottom: 1.25rem;
}

.clase-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.clase-card__tag {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--card-color);
  background: color-mix(in srgb, var(--card-color) 10%, transparent);
  padding: 4px 10px;
  border-radius: 100px;
  letter-spacing: 0.04em;
}

.clase-card__arrow {
  color: var(--color-text-muted);
  transition: var(--transition);
  display: flex;
}

.clase-card:hover .clase-card__arrow {
  color: var(--card-color);
  transform: translateX(4px);
}

@media (max-width: 768px) {
  .clases {
    padding: 72px 0;
  }

  .clases__grid {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 1rem;
  }

  .clase-card {
    padding: 1.5rem 1.25rem;
  }
}
</style>
