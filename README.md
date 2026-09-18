# 🏥 Clinix — Sistema de Gestión Clínica

Aplicación full-stack para la gestión integral de un centro de salud: pacientes, profesionales, turnos con calendario y notificaciones por email, todo con autenticación y persistencia en base de datos propia.

🔗 **[Ver demo en vivo](https://sistema-clinix.vercel.app/)**

Cuenta de prueba:
```
Email:     admin@clinix.com
Password:  Admin1234
```

---

## ✨ Features

- 🔐 Autenticación con JWT (roles admin / médico), registro de profesionales y recuperación de contraseña por código enviado al email
- 📋 Historia clínica completa por paciente: datos personales, obra social, contacto de emergencia, tutor (menores), alergias, medicación, grupo sanguíneo, adjuntos (PDF/imágenes) y notas de consulta con historial
- 🔍 Búsqueda en tiempo real (nombre, DNI, diagnóstico) y filtros combinables (género, estado, profesional, grupo sanguíneo, año de registro)
- 🗂️ Archivado y restauración de pacientes y profesionales (baja reversible, sin borrado definitivo)
- 👩‍⚕️ Gestión de profesionales: alta, activar/desactivar acceso al sistema, especialidad
- 📅 Calendario de turnos con vistas por día, semana, mes y año; duración y precio configurables, tipo de pago (particular / obra social)
- ✅ Estados de turno (programado, confirmado, completado, cancelado, no asistió) con aviso automático por email al paciente cuando un turno se cancela o reprograma
- ⏰ Recordatorio automático por email 12 horas antes de cada turno
- 🖨️ Exportación / impresión de la ficha del paciente
- 📶 Indicador de conexión: avisa en pantalla cuando el dispositivo pierde internet
- 🌙 Dark mode con persistencia, diseño responsive (mobile, tablet, desktop)
- 💀 Skeletons, infinite scroll con paginación real del backend, notificaciones toast

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
| JWT + bcrypt | Autenticación, hash de contraseñas y códigos de recuperación |
| Multer | Carga de avatares y adjuntos clínicos |
| Brevo | Envío de emails (recordatorios de turno, avisos de cancelación/reprogramación y código de recuperación de contraseña) |

> No se utilizaron librerías de componentes UI (Material UI, Bootstrap, Chakra, etc.) en el frontend.

---

## 📁 Estructura del proyecto

```
Sistema-clinix/
├── src/                        # Frontend (React + Vite)
│   ├── components/
│   │   ├── atoms/              # Avatar, ProgressBar, Skeleton, OfflineBanner, icons
│   │   ├── molecules/          # DateFilter, SearchBar, FilterBar, ImageUpload
│   │   └── organisms/          # PatientCard, PatientModal, PatientDetailModal,
│   │                           # PatientInfoGrid, AppointmentModal, Sidebar, Toast
│   ├── hooks/                  # useDebounce
│   ├── pages/                  # Home, Login, Register, ForgotPassword, PatientDetail,
│   │                           # Calendar, Archived, Doctors
│   ├── services/               # httpClient, authService, patientService,
│   │                           # appointmentService, userService
│   ├── store/                  # useClinicStore (Zustand)
│   ├── types/                  # Interfaces TypeScript
│   └── utils/                  # avatarHelper, formatDate, calendarUtils
│
└── server/                     # Backend (Node + Express + MongoDB)
    ├── src/
    │   ├── config/db.js        # Conexión a MongoDB
    │   ├── middleware/auth.js  # Verificación de JWT
    │   ├── models/             # User, Patient, Appointment (Mongoose)
    │   ├── routes/             # auth, patients, users, appointments, uploads
    │   ├── services/           # emailService, reminderJob
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
cp .env.example .env
npm run seed        # Crea el usuario admin y pacientes de ejemplo
npm run dev          # Levanta la API en http://localhost:4000
```

Credenciales del usuario admin creado por el seed (configurables en `.env`):

```
Email:     admin@clinix.com
Password:  Admin1234
```

El envío de emails (recordatorios de turno, avisos de cancelación/reprogramación y código de recuperación de contraseña) usa [Brevo](https://brevo.com); sin una `BREVO_API_KEY` configurada, la app funciona igual pero esos emails no se envían.

### 2. Frontend

```bash
npm install
npm run dev          # http://localhost:5173
```

El frontend espera la API en `VITE_API_URL` (ver `.env`), por defecto `http://localhost:4000/api`.

### 3. Otros comandos

```bash
npm run storybook     # Documentación de componentes
npm run test:run      # Tests unitarios
npm run build          # Build de producción
```

---

## 🌐 API

Todos los endpoints (salvo login, registro y recuperación de contraseña) requieren un header `Authorization: Bearer <token>` obtenido en `/api/auth/login`.

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/auth/login` | Login, devuelve token JWT |
| POST | `/api/auth/register` | Registro de un profesional |
| POST | `/api/auth/forgot-password` | Solicita un código de 6 dígitos por email |
| POST | `/api/auth/reset-password` | Cambia la contraseña usando el código recibido |
| GET | `/api/patients` | Lista paginada (`page`, `limit`, `search`, `year`, filtros) |
| POST/PUT/DELETE | `/api/patients/:id` | Alta, edición y baja (archivado) de un paciente |
| POST | `/api/patients/:id/notes` | Agrega una nota de consulta |
| POST | `/api/patients/:id/attachments` | Sube un adjunto clínico |
| GET | `/api/users` | Lista de profesionales |
| PATCH | `/api/users/:id/active` | Activa o desactiva el acceso de un profesional |
| GET | `/api/appointments` | Turnos filtrados por rango de fechas / profesional / paciente |
| POST | `/api/appointments/:id/complete` | Marca un turno como completado |
| POST | `/api/appointments/:id/no-show` | Marca un turno como no asistido |
| POST | `/api/appointments/:id/cancel` | Cancela o reprograma un turno y avisa al paciente por email |

---

## 📐 Decisiones técnicas

**Atomic Design** — los componentes del frontend están organizados en átomos, moléculas y organismos siguiendo la metodología de Brad Frost.

**Zustand para estado global** — evita el prop drilling; cualquier componente accede al store sin pasar props por múltiples niveles.

**Backend propio** — el CRUD de pacientes, profesionales y turnos vive en una API REST real con persistencia en MongoDB, con un modelo de datos clínico completo (documento, obra social, diagnóstico, alergias, adjuntos, historial de notas) en lugar de campos genéricos.

**Archivado en vez de borrado** — pacientes y profesionales usan un flag `archived` en lugar de eliminarse de la base, permitiendo restaurarlos en cualquier momento.

**Autenticación con JWT y recuperación por código** — el login devuelve un token que se guarda en `localStorage`; la recuperación de contraseña genera un código de 6 dígitos con vencimiento de 10 minutos, hasheado igual que una contraseña antes de guardarse.

**Recordatorios y avisos por email** — un job en el backend revisa cada 15 minutos los turnos próximos a las 12hs y envía el recordatorio; cancelar o reprogramar un turno dispara un aviso al paciente si tiene email cargado.

**Infinite scroll manual** — implementado con `IntersectionObserver` en vez de una librería externa, contra la paginación real del backend.

**CSS variables para temas** — dark/light mode con variables CSS en `:root` y `html.dark`, sin dependencias externas.

---

## 👩‍💻 Desarrollado por

Emily Kohler
