import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// ─── Strategy Pattern ─────────────────────────────────────────────────────────
// Cada sección tiene su propia estrategia de guardado / validación
const saveStrategies = {
  general:       (s) => ({ ...s.general }),
  horarios:      (s) => ({ ...s.horarios, diasActivos: [...s.horarios.diasActivos] }),
  clases:        (s) => s.clases.map((c) => ({ ...c })),
  membresias:    (s) => s.membresias.map((m) => ({ ...m, beneficios: [...m.beneficios] })),
  notificaciones:(s) => ({ ...s.notificaciones }),
  apariencia:    (s) => ({ ...s.apariencia }),
}

// ─── Factory Pattern ──────────────────────────────────────────────────────────
export function createClase(id, nombre, duracion, instructor, cupos, color) {
  return { id, nombre, duracion: Number(duracion), instructor, cupos: Number(cupos), color }
}

export function createMembresia(id, nombre, precio, duracion, beneficios, prioridad, color) {
  return { id, nombre, precio: Number(precio), duracion: Number(duracion), beneficios, prioridad: Number(prioridad), color }
}

// ─── Store (Singleton) ────────────────────────────────────────────────────────
export const useSettingsStore = defineStore('settings', () => {

  // ── General ─────────────────────────────────────────────────────────────────
  const general = ref({
    nombre:     'Virel Gym',
    email:      'hola@virelgym.com',
    telefono:   '+57 300 000 0000',
    direccion:  'Calle 93 # 12-34, Bogotá, Colombia',
    website:    'https://virelgym.com',
    descripcion:'El gimnasio premium que transforma vidas a través del movimiento consciente y el bienestar integral.',
  })

  // ── Horarios ─────────────────────────────────────────────────────────────────
  const diasSemana = ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom']

  const horarios = ref({
    apertura:        '06:00',
    cierre:          '22:00',
    intervaloClases: 30,
    capacidadMaxima: 20,
    diasActivos:     ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
  })

  function toggleDia(dia) {
    const i = horarios.value.diasActivos.indexOf(dia)
    if (i === -1) horarios.value.diasActivos.push(dia)
    else horarios.value.diasActivos.splice(i, 1)
  }

  // ── Clases ────────────────────────────────────────────────────────────────────
  let nextClaseId = 6

  const clases = ref([
    createClase(1, 'Yoga Flow',    60, 'Sofía Reyes',    12, '#42B883'),
    createClase(2, 'HIIT Pro',     45, 'Carlos Mendoza', 15, '#EF4444'),
    createClase(3, 'Spinning',     50, 'Ana Martínez',   18, '#F59E0B'),
    createClase(4, 'Pilates Core', 55, 'Laura Gómez',    10, '#8B5CF6'),
    createClase(5, 'Boxing',       60, 'Miguel Torres',  12, '#06B6D4'),
  ])

  function agregarClase(data) {
    clases.value.push(createClase(nextClaseId++, data.nombre, data.duracion, data.instructor, data.cupos, data.color))
  }

  function editarClase(id, data) {
    const i = clases.value.findIndex((c) => c.id === id)
    if (i !== -1) clases.value[i] = createClase(id, data.nombre, data.duracion, data.instructor, data.cupos, data.color)
  }

  function eliminarClase(id) {
    clases.value = clases.value.filter((c) => c.id !== id)
  }

  // ── Membresías ────────────────────────────────────────────────────────────────
  let nextMembresiaId = 4

  const membresias = ref([
    createMembresia(1, 'Essential', 50000,  30, ['Acceso ilimitado', 'Vestuarios', 'App móvil'], 3, '#6B7280'),
    createMembresia(2, 'Balance',   90000,  30, ['Todo Essential', 'Clases grupales', 'Evaluación mensual', 'Asesoría nutricional'], 2, '#42B883'),
    createMembresia(3, 'Premium',   180000, 30, ['Todo Balance', 'Entrenador personal', 'Reserva prioritaria', 'Zona VIP', 'Consulta médica'], 1, '#8B5CF6'),
  ])

  function editarMembresia(id, data) {
    const i = membresias.value.findIndex((m) => m.id === id)
    if (i !== -1) membresias.value[i] = { ...membresias.value[i], ...data }
  }

  function agregarMembresia() {
    membresias.value.push(createMembresia(nextMembresiaId++, 'Nuevo Plan', 60000, 30, ['Acceso ilimitado'], membresias.value.length + 1, '#42B883'))
  }

  function eliminarMembresia(id) {
    membresias.value = membresias.value.filter((m) => m.id !== id)
  }

  // ── Notificaciones ────────────────────────────────────────────────────────────
  const notificaciones = ref({
    recordatorioClase:    { activo: true,  label: 'Recordatorio de clase',      desc: 'Enviar recordatorio 1 hora antes de cada clase' },
    emailBienvenida:      { activo: true,  label: 'Email de bienvenida',         desc: 'Correo automático al registrar un nuevo miembro' },
    alertaCupos:          { activo: true,  label: 'Alerta de cupos llenos',      desc: 'Notificar cuando una clase llega al 90% de capacidad' },
    renovacionAutomatica: { activo: false, label: 'Recordatorio de renovación',  desc: 'Alertar 7 días antes del vencimiento de membresía' },
    resumenSemanal:       { activo: true,  label: 'Resumen semanal',             desc: 'Reporte de actividad cada lunes al administrador' },
    inactividad:          { activo: true,  label: 'Alerta de inactividad',       desc: 'Notificar miembros sin reservas en 14 días' },
    nuevosHorarios:       { activo: false, label: 'Cambios de horario',          desc: 'Informar a los miembros cuando cambien los horarios' },
    promoMensual:         { activo: false, label: 'Promociones mensuales',       desc: 'Enviar boletín con ofertas y novedades del mes' },
  })

  // ── Apariencia ────────────────────────────────────────────────────────────────
  const apariencia = ref({
    colorPrimario:    '#42B883',
    colorSecundario:  '#35495E',
    tema:             'light',
    fuente:           'Poppins',
    logoUrl:          '',
  })

  // ── Observer: Computed stats ─────────────────────────────────────────────────
  const totalClases     = computed(() => clases.value.length)
  const totalMembresias = computed(() => membresias.value.length)
  const diasActivosCount = computed(() => horarios.value.diasActivos.length)

  // ── Strategy: save per section ───────────────────────────────────────────────
  function guardar(seccion) {
    const snapshot = saveStrategies[seccion]({
      general:        general.value,
      horarios:       horarios.value,
      clases:         clases.value,
      membresias:     membresias.value,
      notificaciones: notificaciones.value,
      apariencia:     apariencia.value,
    })
    // Production: replace with API call
    console.log(`[Virel Settings] ${seccion} saved:`, snapshot)
    return snapshot
  }

  return {
    // State
    general,
    horarios, diasSemana,
    clases,
    membresias,
    notificaciones,
    apariencia,
    // Computed (Observer)
    totalClases, totalMembresias, diasActivosCount,
    // Actions
    toggleDia,
    agregarClase, editarClase, eliminarClase,
    agregarMembresia, editarMembresia, eliminarMembresia,
    guardar,
  }
})
