# 🏥 Clinix — Sistema de Historial de Pacientes

Dashboard frontend para gestión y exploración de registros de pacientes, desarrollado como parte de un challenge técnico para Sirius Software.

---

## 🚀 Demo

[Ver demo en Vercel](https://clinix.vercel.app) ← actualizar con la URL real después del deploy

---

## ✨ Features

### Requeridas
- 📋 Listado de pacientes en tarjetas con información básica
- 🔍 Búsqueda en tiempo real con debounce (300ms)
- ➕ Modal para agregar y editar pacientes con validación de formulario
- 🗑️ Eliminación con modal de confirmación y animación de salida
- ⭐ Favoritos persistidos en localStorage
- 💀 Skeletons loader durante la carga
- ♾️ Infinite scroll con paginación de la API
- 📱 Diseño responsive (mobile, tablet, desktop)
- 🔔 Notificaciones toast de éxito y error

### Adicionales
- 🌙 Dark mode con persistencia en localStorage
- ⊞ Toggle entre vista grilla y vista lista
- 🔤 Ordenamiento A→Z y Z→A por nombre
- 📅 Filtro por año de registro (2023–2026)
- 📊 Barra de estadísticas (total, favoritos, agregados en sesión)
- 🏷️ Badge "Nuevo" en pacientes agregados durante la sesión
- 📄 Página de detalle por paciente con React Router
- 🎨 Avatar con fallback a iniciales coloreadas cuando la imagen falla

---

## 🛠️ Stack tecnológico

| Tecnología | Uso |
|---|---|
| React 19 + TypeScript | Framework principal |
| Vite | Bundler y dev server |
| Tailwind CSS | Estilos utilitarios |
| React Router v7 | Navegación entre páginas |
| Vitest | Tests unitarios |
| Testing Library | Testing de hooks y componentes |

> No se utilizaron librerías de componentes UI (Material UI, Bootstrap, Chakra, etc.)

---

## 🌐 API

Los datos se obtienen de MockAPI: GET https://63bedcf7f5cfc0949b634fc8.mockapi.io/users?page=1&limit=10

Campos utilizados: `id`, `name`, `avatar`, `description`, `website`, `createdAt`

La paginación usa los parámetros `page` y `limit`. El infinite scroll detecta automáticamente cuando no hay más páginas comparando la cantidad de resultados recibidos contra el límite.

---

## 📁 Estructura del proyecto
src/

├── components/       # Componentes reutilizables

│   ├── Avatar.tsx

│   ├── ConfirmModal.tsx

│   ├── Navbar.tsx

│   ├── PatientCard.tsx

│   ├── PatientModal.tsx

│   ├── ProgressBar.tsx

│   ├── Skeleton.tsx

│   ├── StatsBar.tsx

│   └── Toast.tsx

├── hooks/            # Lógica reutilizable

│   ├── useDebounce.ts

│   ├── useFavorites.ts

│   ├── usePatients.ts

│   └── useToast.ts

├── pages/            # Páginas principales

│   ├── Home.tsx

│   └── PatientDetail.tsx

├── services/         # Comunicación con la API

│   └── patientService.ts

├── test/             # Tests unitarios

│   ├── avatarHelper.test.ts

│   ├── formatDate.test.ts

│   ├── useDebounce.test.ts

│   └── setup.ts

├── types/            # Interfaces TypeScript

│   └── index.ts

└── utils/            # Funciones auxiliares

├── avatarHelper.ts

└── formatDate.ts

---

## ⚙️ Instalación y uso local

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/clinix.git
cd clinix

# Instalar dependencias
npm install

# Correr en desarrollo
npm run dev

# Correr tests
npm run test:run

# Build para producción
npm run build
```

---

## 🧪 Tests

18 tests unitarios cubriendo:

- `avatarHelper` — getInitials, isValidAvatar, getAvatarColor
- `formatDate` — formateo de fechas ISO
- `useDebounce` — comportamiento del delay

```bash
npm run test:run
```

---

## 📐 Decisiones técnicas

**Infinite scroll manual** — se implementó con `IntersectionObserver` en vez de una librería externa para mantener control total y evitar dependencias innecesarias.

**Avatar con fallback** — la API devuelve avatares inválidos (`{}`, string vacío, URLs rotas). Se resuelve con un componente `Avatar` que detecta errores de carga (`onError`) y muestra iniciales con color consistente por ID.

**Estado en memoria** — los cambios (agregar, editar, eliminar) viven en el estado de React. Al recargar, la app vuelve a los datos de la API. Esto es el comportamiento esperado según el enunciado del challenge.

**CSS variables para temas** — dark/light mode implementado con variables CSS en `:root` y `html.dark`, sin dependencias externas. Esto permite que todos los componentes respondan al tema con una sola clase en el `html`.

---

## 👩‍💻 Desarrollado por

Emily Kohler — Estudiante de Ingeniería en Sistemas de Información, Universidad de la Cuenca del Plata