<template>
  <div class="member-card" :style="{ '--card-accent': metric.color }">
    <div class="member-card__icon">
      <!-- Users -->
      <svg v-if="metric.icon === 'users'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
      <!-- Alert -->
      <svg v-else-if="metric.icon === 'alert'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <!-- Plus -->
      <svg v-else-if="metric.icon === 'plus'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    </div>
    <div class="member-card__body">
      <span class="member-card__value">{{ metric.value }}</span>
      <span class="member-card__label">{{ metric.label }}</span>
    </div>
    <div class="member-card__bar">
      <div class="member-card__bar-fill"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  metric: { type: Object, required: true },
})
</script>

<style scoped>
.member-card {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-gray-light);
  padding: 1.375rem 1.5rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
  overflow: hidden;
  transition: var(--transition);
}

.member-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.member-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--card-accent);
  border-radius: 0 2px 2px 0;
}

.member-card__icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  background: color-mix(in srgb, var(--card-accent) 12%, transparent);
  color: var(--card-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.member-card__body {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.member-card__value {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--color-dark);
  line-height: 1;
  letter-spacing: -0.02em;
}

.member-card__label {
  font-size: 0.78rem;
  color: var(--color-text-muted);
  font-weight: 500;
}

.member-card__bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--color-gray-light);
}

.member-card__bar-fill {
  height: 100%;
  width: 60%;
  background: var(--card-accent);
  border-radius: 0 2px 2px 0;
  opacity: 0.4;
}
</style>
