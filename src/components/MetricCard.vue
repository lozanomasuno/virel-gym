<template>
  <div class="metric-card" :style="{ '--accent': metric.color }">
    <div class="metric-card__top">
      <div class="metric-card__icon">
        <!-- Calendar -->
        <svg v-if="metric.icon === 'calendar'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <!-- Users -->
        <svg v-else-if="metric.icon === 'users'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
        <!-- Check-circle -->
        <svg v-else-if="metric.icon === 'check-circle'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <!-- Activity -->
        <svg v-else-if="metric.icon === 'activity'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
      </div>
      <span class="metric-card__label">{{ metric.label }}</span>
    </div>

    <div class="metric-card__value">{{ metric.value }}</div>

    <div class="metric-card__footer">
      <span class="metric-card__trend" :class="trendClass">
        <svg v-if="metric.trend > 0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
        <svg v-else-if="metric.trend < 0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
        <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        {{ trendText }}
      </span>
      <span class="metric-card__trend-label">{{ metric.trendLabel }}</span>
    </div>

    <!-- Progress bar decorativa -->
    <div class="metric-card__bar">
      <div class="metric-card__bar-fill"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  metric: {
    type: Object,
    required: true,
  },
})

const trendClass = computed(() => {
  if (props.metric.trend > 0) return 'trend--up'
  if (props.metric.trend < 0) return 'trend--down'
  return 'trend--neutral'
})

const trendText = computed(() => {
  const t = props.metric.trend
  if (t > 0) return `+${t}`
  if (t < 0) return `${t}`
  return 'Sin cambio'
})
</script>

<style scoped>
.metric-card {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-gray-light);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
  position: relative;
  overflow: hidden;
}

.metric-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-3px);
}

.metric-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--accent);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}

.metric-card__top {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 1rem;
}

.metric-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  background: color-mix(in srgb, var(--accent) 12%, transparent);
  color: var(--accent);
  flex-shrink: 0;
}

.metric-card__label {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--color-text-muted);
  letter-spacing: 0.02em;
}

.metric-card__value {
  font-size: 2.25rem;
  font-weight: 800;
  color: var(--color-dark);
  line-height: 1;
  margin-bottom: 0.875rem;
  letter-spacing: -0.02em;
}

.metric-card__footer {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.metric-card__trend {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 100px;
}

.trend--up {
  color: #16a34a;
  background: rgba(22, 163, 74, 0.1);
}

.trend--down {
  color: #dc2626;
  background: rgba(220, 38, 38, 0.1);
}

.trend--neutral {
  color: var(--color-text-muted);
  background: var(--color-gray-light);
}

.metric-card__trend-label {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

/* Progress bar decorativa */
.metric-card__bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--color-gray-light);
}

.metric-card__bar-fill {
  height: 100%;
  width: 65%;
  background: var(--accent);
  border-radius: 0 2px 2px 0;
  opacity: 0.35;
}
</style>
