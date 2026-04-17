<template>
  <nav class="settings-nav">
    <div v-for="group in navGroups" :key="group.label" class="nav-group">
      <span class="nav-group__label">{{ group.label }}</span>
      <button
        v-for="item in group.items"
        :key="item.id"
        class="nav-item"
        :class="{ active: modelValue === item.id }"
        @click="$emit('update:modelValue', item.id)"
      >
        <span class="nav-item__icon">
          <!-- General -->
          <svg v-if="item.id === 'general'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <!-- Horarios -->
          <svg v-else-if="item.id === 'horarios'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <!-- Clases -->
          <svg v-else-if="item.id === 'clases'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
          <!-- Membresías -->
          <svg v-else-if="item.id === 'membresias'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          <!-- Notificaciones -->
          <svg v-else-if="item.id === 'notificaciones'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          <!-- Apariencia -->
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>
        </span>
        <span class="nav-item__label">{{ item.label }}</span>
        <span v-if="modelValue === item.id" class="nav-item__dot"></span>
      </button>
    </div>
  </nav>
</template>

<script setup>
defineProps({ modelValue: { type: String, required: true } })
defineEmits(['update:modelValue'])

const navGroups = [
  {
    label: 'Sistema',
    items: [
      { id: 'general',        label: 'General' },
      { id: 'notificaciones', label: 'Notificaciones' },
      { id: 'apariencia',     label: 'Apariencia' },
    ],
  },
  {
    label: 'Gimnasio',
    items: [
      { id: 'horarios',   label: 'Horarios' },
      { id: 'clases',     label: 'Clases' },
      { id: 'membresias', label: 'Membresías' },
    ],
  },
]
</script>

<style scoped>
.settings-nav {
  width: 210px;
  flex-shrink: 0;
  padding: 1.5rem 0.75rem 1.5rem 1.25rem;
  border-right: 1px solid var(--color-gray-light);
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  position: sticky;
  top: 68px;
  height: calc(100vh - 68px);
  overflow-y: auto;
}

.nav-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-group__label {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-text-muted);
  padding: 0 0.625rem 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.6rem 0.75rem;
  border-radius: var(--radius-sm);
  background: transparent;
  border: none;
  color: var(--color-text-muted);
  font-size: 0.84rem;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: var(--transition);
  position: relative;
  text-align: left;
  width: 100%;
}

.nav-item:hover {
  background: var(--color-gray-light);
  color: var(--color-dark);
}

.nav-item.active {
  background: rgba(66, 184, 131, 0.1);
  color: var(--color-primary);
  font-weight: 600;
}

.nav-item__icon {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.nav-item__label {
  flex: 1;
}

.nav-item__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-primary);
  flex-shrink: 0;
}
</style>
