<template>
  <div class="form-row">
    <div class="form-row__meta">
      <p class="form-row__label">{{ label }}</p>
      <p v-if="hint" class="form-row__hint">{{ hint }}</p>
    </div>
    <div class="form-row__control">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  hint:  { type: String, default: '' },
})
</script>

<style scoped>
.form-row {
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  padding: 1.125rem 1.75rem;
  border-bottom: 1px solid rgba(229, 231, 235, 0.6);
  transition: background var(--transition);
}

.form-row:last-child {
  border-bottom: none;
}

.form-row:hover {
  background: rgba(249, 250, 251, 0.6);
}

.form-row__meta {
  flex: 0 0 220px;
  padding-top: 2px;
}

.form-row__label {
  display: block;
  font-size: 0.84rem;
  font-weight: 600;
  color: var(--color-dark);
  margin-bottom: 3px;
}

.form-row__hint {
  font-size: 0.73rem;
  color: var(--color-text-muted);
  line-height: 1.4;
}

.form-row__control {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* Shared input styles exposed to slot content */
:deep(input[type='text']),
:deep(input[type='email']),
:deep(input[type='tel']),
:deep(input[type='url']),
:deep(input[type='time']),
:deep(input[type='number']),
:deep(select),
:deep(textarea) {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--color-gray-light);
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  font-family: inherit;
  color: var(--color-text);
  background: var(--color-white);
  transition: var(--transition);
}

:deep(input:focus),
:deep(select:focus),
:deep(textarea:focus) {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.12);
}

:deep(textarea) {
  resize: vertical;
  min-height: 80px;
  line-height: 1.5;
}

@media (max-width: 700px) {
  .form-row {
    flex-direction: column;
    gap: 0.75rem;
  }

  .form-row__meta {
    flex: none;
  }
}
</style>
