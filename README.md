<div align="center">

# ⚡ VIREL GYM

**La plataforma digital que tu gimnasio merece.**

*Gestión premium · Experiencia de miembro · Sin fricción.*

[![Vue 3](https://img.shields.io/badge/Vue-3.x-42B883?style=flat-square&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Pinia](https://img.shields.io/badge/Pinia-Store-FFD859?style=flat-square&logo=pinia&logoColor=black)](https://pinia.vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-Build-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-35495E?style=flat-square)](LICENSE)

</div>

---

## ¿Qué es Virel?

Virel es una SPA construida en **Vue 3** que centraliza todo lo que un gimnasio moderno necesita: captación de nuevos socios desde la landing, gestión operativa desde el panel admin y una experiencia exclusiva para cada miembro.

Un solo proyecto. Dos mundos. Cero compromiso.

---

## Lo que incluye

| Módulo | Para quién | Destacado |
|--------|-----------|-----------|
| 🏠 **Landing pública** | Visitantes | Hero, clases, membresías y CTA |
| 🛡️ **Panel admin** | Administradores | Dashboard, miembros, reportes y configuración |
| 📅 **Reservaciones** | Admins | Calendario CRUD con filtros por clase |
| 👤 **Área de miembro** | Socios | Dashboard personal, reservas y perfil |
| 🔐 **Auth por roles** | Sistema | Login dual, guards de ruta y layouts dedicados |

---

## Stack técnico

```
Vue 3  ·  Composition API  ·  <script setup>
Pinia  ·  Vue Router 4     ·  Vite 5
```

Arquitectura orientada a patrones: **Singleton · Factory · Strategy · Observer · Guard**. Sin dependencias de UI externas — cada componente es 100% artesanal.

---

## Arranque rápido

```bash
git clone https://github.com/lozanomasuno/virel-gym.git
cd virel-gym
npm install
npm run dev
```

> Accede en `http://localhost:5173` y entra con cualquier correo terminado en `@virel.com` para el panel admin, o `@gmail.com` para el área de miembro.

---

## Estructura de ramas

El proyecto se desarrolló de forma incremental, rama por rama:

```
virel              ← rama principal (proyecto completo)
├── reservation-calendar
├── member-views
├── auth-routing
├── admin-views
└── landing-page
```

---

<div align="center">

**Construido con intención. Diseñado para escalar.**

*Virel Gym — © 2026*

</div>

