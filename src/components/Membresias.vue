<template>
  <section id="membresias" class="membresias">
    <div class="container">
      <div class="membresias__header">
        <p class="label-tag">Planes</p>
        <h2 class="section-title">Membresías para cada etapa</h2>
        <p class="section-subtitle">
          Sin contratos, sin sorpresas. Elige el plan que mejor se adapte a tu estilo de vida.
        </p>
      </div>

      <div class="membresias__grid">
        <div
          v-for="plan in store.planes"
          :key="plan.id"
          class="plan-card"
          :class="{ 'plan-card--destacado': plan.destacado }"
        >
          <div v-if="plan.destacado" class="plan-card__badge">Más popular</div>

          <div class="plan-card__header">
            <h3 class="plan-card__nombre">{{ plan.nombre }}</h3>
            <p class="plan-card__desc">{{ plan.descripcion }}</p>
          </div>

          <div class="plan-card__precio">
            <span class="precio-currency">$</span>
            <span class="precio-amount">{{ plan.precio }}</span>
            <span class="precio-period">/{{ plan.periodo }}</span>
          </div>

          <ul class="plan-card__beneficios">
            <li v-for="(b, i) in plan.beneficios" :key="i">
              <svg class="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              {{ b }}
            </li>
          </ul>

          <button
            class="plan-card__cta"
            :class="plan.destacado ? 'btn-primary' : 'btn-outline'"
            @click="store.seleccionarPlan(plan.id)"
          >
            {{ plan.destacado ? 'Comenzar ahora' : 'Seleccionar plan' }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useGymStore } from '@/stores/gymStore'

const store = useGymStore()
</script>

<style scoped>
.membresias {
  padding: 100px 0;
  background: var(--color-bg);
}

.membresias__header {
  text-align: center;
  margin-bottom: 3.5rem;
}

.membresias__header .section-subtitle {
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

.membresias__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  align-items: start;
}

.plan-card {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  border: 2px solid var(--color-gray-light);
  padding: 2.5rem 2rem;
  position: relative;
  transition: var(--transition);
}

.plan-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-4px);
}

.plan-card--destacado {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 1px var(--color-primary), var(--shadow-md);
  transform: scale(1.03);
  background: var(--color-white);
}

.plan-card--destacado:hover {
  transform: scale(1.03) translateY(-4px);
}

.plan-card__badge {
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-primary);
  color: var(--color-white);
  font-size: 0.75rem;
  font-weight: 700;
  padding: 5px 18px;
  border-radius: 100px;
  letter-spacing: 0.06em;
  white-space: nowrap;
}

.plan-card__header {
  margin-bottom: 1.5rem;
}

.plan-card__nombre {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-dark);
  margin-bottom: 0.4rem;
}

.plan-card__desc {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  line-height: 1.5;
}

.plan-card__precio {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  margin-bottom: 1.75rem;
  padding-bottom: 1.75rem;
  border-bottom: 1px solid var(--color-gray-light);
}

.precio-currency {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-muted);
  margin-bottom: 6px;
}

.precio-amount {
  font-size: 3rem;
  font-weight: 800;
  color: var(--color-dark);
  line-height: 1;
}

.plan-card--destacado .precio-amount {
  color: var(--color-primary);
}

.precio-period {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  margin-bottom: 8px;
}

.plan-card__beneficios {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.plan-card__beneficios li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 0.875rem;
  color: var(--color-text);
  line-height: 1.4;
}

.check-icon {
  flex-shrink: 0;
  color: var(--color-primary);
  margin-top: 2px;
}

.plan-card__cta {
  width: 100%;
  justify-content: center;
  font-size: 0.9rem;
}

@media (max-width: 900px) {
  .membresias__grid {
    grid-template-columns: 1fr;
    max-width: 420px;
    margin: 0 auto;
  }

  .plan-card--destacado {
    transform: scale(1);
    order: -1;
  }

  .plan-card--destacado:hover {
    transform: translateY(-4px);
  }
}

@media (max-width: 768px) {
  .membresias {
    padding: 72px 0;
  }
}
</style>
