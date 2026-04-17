<template>
  <div class="settings-section">
    <div class="section-head">
      <div class="section-head__text">
        <h2 class="section-title">{{ title }}</h2>
        <p v-if="subtitle" class="section-subtitle">{{ subtitle }}</p>
      </div>
      <slot name="header-action" />
    </div>

    <div class="section-body">
      <slot />
    </div>

    <div v-if="$slots.footer" class="section-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title:    { type: String, required: true },
  subtitle: { type: String, default: '' },
})
</script>

<style scoped>
.settings-section {
  background: var(--color-white);
  border: 1px solid var(--color-gray-light);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.375rem 1.75rem;
  border-bottom: 1px solid var(--color-gray-light);
  background: var(--color-bg);
}

.section-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--color-dark);
  margin-bottom: 2px;
}

.section-subtitle {
  font-size: 0.78rem;
  color: var(--color-text-muted);
}

.section-body {
  padding: 0;
}

.section-footer {
  padding: 1.125rem 1.75rem;
  border-top: 1px solid var(--color-gray-light);
  background: var(--color-bg);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
}
</style>
