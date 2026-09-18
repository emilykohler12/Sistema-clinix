# 🏥 Clinix — Sistema de Gestión Clínica

Aplicación full-stack para la gestión de pacientes de un centro de salud: historia clínica básica, búsqueda y filtros, y acceso protegido por login para el personal médico/administrativo.

Proyecto personal desarrollado para portfolio, con frontend, backend y base de datos propios (sin depender de APIs de terceros).

---

## ✨ Features

- 🔐 Login con JWT (roles admin / médico)
- 📋 Listado de pacientes con historia clínica básica (documento, obra social, diagnóstico, médico asignado, estado)
- 🔍 Búsqueda en tiempo real con debounce (300ms) y filtro por año de registro
- ➕ Alta, edición y baja de pacientes con validación de formulario — persistidos en MongoDB
- ⭐ Favoritos, ⊞ vista grilla/lista, 🔤 orden A→Z / Z→A
- 💀 Skeletons con animación shimmer durante la carga, ♾️ infinite scroll con paginación real del backend
- 🌙 Dark mode con persistencia en localStorage
- 📱 Diseño responsive (mobile, tablet, desktop)
- 🔔 Notificaciones toast de éxito y error
- 📖 Documentación de componentes con Storybook

---

## 🛠️ Stack tecnológico

**Frontend**

| Tecnología | Uso |
|---|---|
| React 19 + TypeScript | Framework principal |
| Vite | Bundler y dev server |
| Tailwind CSS v4 | Estilos utilitarios |
| React Router v7 | Navegación entre páginas |
| Zustand | Estado global |
| Storybook | Documentación de componentes |
| Vitest + Testing Library | Tests unitarios |

**Backend**

| Tecnología | Uso |
|---|---|
| Node.js + Express | API REST |
| MongoDB + Mongoose | Base de datos y modelado |
| JWT + bcrypt | Autenticación y hash de contraseñas |

> No se utilizaron librerías de componentes UI (Material UI, Bootstrap, Chakra, etc.) en el frontend.

---

## 📁 Estructura del proyecto

```
Sistema-clinix/
├── src/                        # Frontend (React + Vite)
│   ├── components/
│   │   ├── atoms/              # Avatar, ProgressBar, Skeleton
│   │   ├── molecules/          # DateFilter, SearchBar, StatCard
│   │   └── organisms/          # ConfirmModal, PatientCard, PatientModal,
│   │                           # PatientDetailModal, PatientInfoGrid, Sidebar, StatsBar, Toast
│   ├── hooks/                  # useDebounce
│   ├── pages/                  # Home, Login, PatientDetail
│   ├── services/               # httpClient, authService, patientService
│   ├── store/                  # useClinicStore (Zustand)
│   ├── test/                   # Tests unitarios
│   ├── types/                  # Interfaces TypeScript
│   └── utils/                  # avatarHelper, formatDate
│
└── server/                     # Backend (Node + Express + MongoDB)
    ├── src/
    │   ├── config/db.js        # Conexión a MongoDB
    │   ├── middleware/auth.js  # Verificación de JWT
    │   ├── models/             # User, Patient (Mongoose)
    │   ├── routes/             # auth, patients
    │   ├── index.js            # Punto de entrada del servidor
    │   └── seed.js             # Crea el usuario admin y pacientes de ejemplo
    └── .env.example
```

---

## ⚙️ Instalación y uso local

Necesitás una instancia de MongoDB corriendo (local, Docker o [Atlas free tier](https://www.mongodb.com/cloud/atlas/register)).

### 1. Backend

```bash
cd server
npm install
cp .env.example .env      # Ajustá MONGODB_URI si no usás el default local
npm run seed               # Crea el usuario admin y pacientes de ejemplo
npm run dev                 # Levanta la API en http://localhost:4000
```

Credenciales del usuario admin creado por el seed (configurables en `.env`):

```
Email:     admin@clinix.com
Password:  Admin1234
```

### 2. Frontend

```bash
npm install
npm run dev                 # http://localhost:5173
```

El frontend espera la API en `VITE_API_URL` (ver `.env`), por defecto `http://localhost:4000/api`.

### 3. Otros comandos

```bash
npm run storybook           # Documentación de componentes
npm run test:run            # Tests unitarios
npm run build                # Build de producción
```

---

## 🌐 API

Todos los endpoints de pacientes requieren un header `Authorization: Bearer <token>` obtenido en `/api/auth/login`.

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/auth/login` | Login, devuelve token JWT |
| GET | `/api/auth/me` | Usuario autenticado |
| GET | `/api/patients` | Lista paginada (`page`, `limit`, `search`, `year`) |
| GET | `/api/patients/years` | Años disponibles para filtrar |
| GET | `/api/patients/:id` | Detalle de un paciente |
| POST | `/api/patients` | Crear paciente |
| PUT | `/api/patients/:id` | Editar paciente |
| DELETE | `/api/patients/:id` | Eliminar paciente |

---

## 📐 Decisiones técnicas

**Atomic Design** — los componentes del frontend están organizados en átomos, moléculas y organismos siguiendo la metodología de Brad Frost.

**Zustand para estado global** — evita el prop drilling; cualquier componente accede al store sin pasar props por múltiples niveles.

**Backend propio en vez de mock API** — el CRUD de pacientes y la autenticación viven en una API REST real con persistencia en MongoDB, en lugar de una API pública de solo lectura. Esto permite altas/bajas/ediciones reales y un modelo de datos clínico (documento, obra social, diagnóstico, alergias, médico asignado) en lugar de campos genéricos.

**Autenticación con JWT** — el login devuelve un token que se guarda en `localStorage` y se envía en cada request; las rutas de pacientes están protegidas por middleware en el backend y por un guard de rutas en el frontend.

**Infinite scroll manual** — implementado con `IntersectionObserver` en vez de una librería externa, contra la paginación real del backend.

**Avatar con fallback** — el componente `Avatar` detecta errores de carga (`onError`) y muestra iniciales con color consistente por ID cuando no hay foto.

**CSS variables para temas** — dark/light mode con variables CSS en `:root` y `html.dark`, sin dependencias externas.

---

## 👩‍💻 Desarrollado por

Emily Kohler — Estudiante de Ingeniería en Sistemas de Información, Universidad de la Cuenca del Plata
