import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * Store para gestión de membresías y plan seleccionado.
 * Preparado para integrar reservas y CRM.
 */
export const useGymStore = defineStore('gym', () => {
  const selectedPlan = ref(null)
  const isMenuOpen = ref(false)

  const planes = ref([
    {
      id: 'essential',
      nombre: 'Essential',
      precio: 49,
      periodo: 'mes',
      descripcion: 'Ideal para comenzar tu camino al bienestar.',
      beneficios: ['Acceso a sala de fitness', '2 clases grupales/semana', 'App de seguimiento'],
      destacado: false,
    },
    {
      id: 'balance',
      nombre: 'Balance',
      precio: 89,
      periodo: 'mes',
      descripcion: 'El equilibrio perfecto entre precio y experiencia.',
      beneficios: ['Todo lo del plan Essential', 'Clases ilimitadas', 'Nutrición básica', 'Acceso a zonas premium'],
      destacado: true,
    },
    {
      id: 'premium',
      nombre: 'Premium',
      precio: 149,
      periodo: 'mes',
      descripcion: 'La experiencia Virel completa sin límites.',
      beneficios: ['Todo lo del plan Balance', 'Entrenador personal 2x/semana', 'Plan nutricional personalizado', 'Acceso 24/7', 'Zona de recuperación y spa'],
      destacado: false,
    },
  ])

  function seleccionarPlan(planId) {
    selectedPlan.value = planId
  }

  function toggleMenu() {
    isMenuOpen.value = !isMenuOpen.value
  }

  function closeMenu() {
    isMenuOpen.value = false
  }

  return {
    selectedPlan,
    isMenuOpen,
    planes,
    seleccionarPlan,
    toggleMenu,
    closeMenu,
  }
})
