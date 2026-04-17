import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// ─── FACTORY PATTERN ─────────────────────────────────────────────────────────
function createMember({ id, nombre, email, telefono, avatar, plan, estado, renovacion, ultimaReserva, asistenciaMes, notas, historial }) {
  return { id, nombre, email, telefono, avatar, plan, estado, renovacion, ultimaReserva, asistenciaMes, notas: notas ?? '', historial: historial ?? [] }
}

// ─── STRATEGY PATTERN ─────────────────────────────────────────────────────────
// Cada plan define beneficios y reglas distintas
export const planStrategies = {
  Essential: {
    color: '#6B7280',
    badge: 'bg-gray',
    clasesSemanales: 2,
    precio: 49,
    beneficios: ['Sala de fitness', '2 clases/semana'],
  },
  Balance: {
    color: '#42B883',
    badge: 'bg-green',
    clasesSemanales: 999,
    precio: 89,
    beneficios: ['Clases ilimitadas', 'Nutrición básica', 'Zonas premium'],
  },
  Premium: {
    color: '#8B5CF6',
    badge: 'bg-purple',
    clasesSemanales: 999,
    precio: 149,
    beneficios: ['Entrenador personal', 'Plan nutricional', 'Acceso 24/7', 'Spa'],
  },
}

// ─── SINGLETON STORE ──────────────────────────────────────────────────────────
export const useMemberStore = defineStore('members', () => {
  const miembros = ref([
    createMember({
      id: 1, nombre: 'Laura Méndez', email: 'laura@email.com', telefono: '+57 300 111 2233',
      avatar: 'LM', plan: 'Premium', estado: 'activo',
      renovacion: '2026-05-15', ultimaReserva: 'Pilates — Hoy 08:00',
      asistenciaMes: 18,
      notas: 'Prefiere clases matutinas. Lesión leve en rodilla derecha (2025).',
      historial: [
        { clase: 'Pilates', fecha: '17 Abr', hora: '08:00', estado: 'asistió' },
        { clase: 'Movilidad', fecha: '15 Abr', hora: '10:00', estado: 'asistió' },
        { clase: 'Fuerza', fecha: '12 Abr', hora: '09:30', estado: 'canceló' },
      ],
    }),
    createMember({
      id: 2, nombre: 'Carlos Ruiz', email: 'carlos@email.com', telefono: '+57 310 222 3344',
      avatar: 'CR', plan: 'Balance', estado: 'activo',
      renovacion: '2026-04-28', ultimaReserva: 'Fuerza — Ayer 09:30',
      asistenciaMes: 12,
      notas: '',
      historial: [
        { clase: 'Fuerza', fecha: '16 Abr', hora: '09:30', estado: 'asistió' },
        { clase: 'Fuerza', fecha: '14 Abr', hora: '09:30', estado: 'asistió' },
      ],
    }),
    createMember({
      id: 3, nombre: 'Ana Torres', email: 'ana@email.com', telefono: '+57 320 333 4455',
      avatar: 'AT', plan: 'Essential', estado: 'pendiente',
      renovacion: '2026-04-22', ultimaReserva: 'Movilidad — 10 Abr',
      asistenciaMes: 5,
      notas: 'Renovación pendiente de pago.',
      historial: [
        { clase: 'Movilidad', fecha: '10 Abr', hora: '10:00', estado: 'asistió' },
        { clase: 'Pilates', fecha: '05 Abr', hora: '08:00', estado: 'no asistió' },
      ],
    }),
    createMember({
      id: 4, nombre: 'Pedro Gómez', email: 'pedro@email.com', telefono: '+57 315 444 5566',
      avatar: 'PG', plan: 'Premium', estado: 'activo',
      renovacion: '2026-06-01', ultimaReserva: 'Danza — 16 Abr',
      asistenciaMes: 22,
      notas: 'Instructor referido. Excelente asistencia.',
      historial: [
        { clase: 'Danza', fecha: '16 Abr', hora: '11:00', estado: 'asistió' },
        { clase: 'Movilidad', fecha: '14 Abr', hora: '10:00', estado: 'asistió' },
        { clase: 'Fuerza', fecha: '12 Abr', hora: '09:30', estado: 'asistió' },
      ],
    }),
    createMember({
      id: 5, nombre: 'Marta Sosa', email: 'marta@email.com', telefono: '+57 301 555 6677',
      avatar: 'MS', plan: 'Balance', estado: 'suspendido',
      renovacion: '2026-03-30', ultimaReserva: 'Adulto Mayor — 20 Mar',
      asistenciaMes: 0,
      notas: 'Cuenta suspendida por mora. Contactar para regularizar.',
      historial: [
        { clase: 'Adulto Mayor', fecha: '20 Mar', hora: '14:00', estado: 'asistió' },
      ],
    }),
    createMember({
      id: 6, nombre: 'Jorge Medina', email: 'jorge@email.com', telefono: '+57 318 666 7788',
      avatar: 'JM', plan: 'Essential', estado: 'activo',
      renovacion: '2026-05-05', ultimaReserva: 'Pilates — 15 Abr',
      asistenciaMes: 8,
      notas: '',
      historial: [
        { clase: 'Pilates', fecha: '15 Abr', hora: '08:00', estado: 'asistió' },
      ],
    }),
  ])

  // ── Estado UI ────────────────────────────────────────────────────────────────
  const busqueda = ref('')
  const filtroPlan = ref('todos')
  const miembroSeleccionado = ref(null)

  // ── Observer: métricas reactivas ─────────────────────────────────────────────
  const totalActivos = computed(() => miembros.value.filter((m) => m.estado === 'activo').length)
  const porVencer = computed(() => {
    const limite = new Date()
    limite.setDate(limite.getDate() + 15)
    return miembros.value.filter((m) => {
      const r = new Date(m.renovacion)
      return r <= limite && m.estado !== 'suspendido'
    }).length
  })
  const nuevosEsteMes = computed(() => 2) // Mock — futuro: filtrar por fecha de alta

  const metricas = computed(() => [
    { id: 'activos', label: 'Miembros activos', value: totalActivos.value, icon: 'users', color: '#42B883' },
    { id: 'vencer', label: 'Membresías por vencer', value: porVencer.value, icon: 'alert', color: '#F59E0B' },
    { id: 'nuevos', label: 'Nuevos este mes', value: nuevosEsteMes.value, icon: 'plus', color: '#8B5CF6' },
  ])

  // ── Observer: lista filtrada reactiva ────────────────────────────────────────
  const miembrosFiltrados = computed(() => {
    return miembros.value.filter((m) => {
      const coincideBusqueda =
        m.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
        m.email.toLowerCase().includes(busqueda.value.toLowerCase())
      const coincidePlan = filtroPlan.value === 'todos' || m.plan === filtroPlan.value
      return coincideBusqueda && coincidePlan
    })
  })

  // ── Acciones ─────────────────────────────────────────────────────────────────
  function seleccionarMiembro(miembro) {
    miembroSeleccionado.value = miembro
  }

  function cerrarDetalle() {
    miembroSeleccionado.value = null
  }

  function suspenderMiembro(id) {
    const m = miembros.value.find((x) => x.id === id)
    if (m) m.estado = 'suspendido'
  }

  function renovarPlan(id) {
    const m = miembros.value.find((x) => x.id === id)
    if (m) {
      m.estado = 'activo'
      const nueva = new Date()
      nueva.setMonth(nueva.getMonth() + 1)
      m.renovacion = nueva.toISOString().split('T')[0]
    }
  }

  function actualizarNota(id, nota) {
    const m = miembros.value.find((x) => x.id === id)
    if (m) m.notas = nota
  }

  return {
    miembros,
    busqueda,
    filtroPlan,
    miembroSeleccionado,
    metricas,
    miembrosFiltrados,
    seleccionarMiembro,
    cerrarDetalle,
    suspenderMiembro,
    renovarPlan,
    actualizarNota,
    planStrategies,
  }
})
