# Eventus Backend — NestJS + Prisma + PostgreSQL

API REST para la Plataforma de Gestión de Eventos Académicos  
**Universidad del Cauca — Desarrollo de Aplicaciones Web**

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | NestJS 10 |
| ORM | Prisma 5 |
| Base de datos | PostgreSQL 15 |
| Autenticación | JWT (passport-jwt) |
| Validación | class-validator + class-transformer |
| Seguridad | Helmet, CORS |
| Documentación | Swagger (OpenAPI 3) |

---

## Estructura del proyecto

```
eventus-backend/
├── prisma/
│   ├── schema.prisma       # Modelos de BD (User, Event, Registration)
│   └── seed.ts             # Datos de prueba iniciales
├── src/
│   ├── auth/               # Módulo de autenticación JWT
│   │   ├── dto/            # register.dto, login.dto
│   │   ├── strategies/     # jwt.strategy
│   │   ├── auth.service.ts
│   │   └── auth.controller.ts
│   ├── events/             # CRUD de eventos
│   │   ├── dto/            # create-event.dto, update-event.dto
│   │   ├── events.service.ts
│   │   └── events.controller.ts
│   ├── registrations/      # Inscripciones a eventos
│   ├── users/              # Gestión de usuarios
│   ├── common/
│   │   ├── decorators/     # @GetUser, @Roles
│   │   └── guards/         # RolesGuard
│   ├── prisma/             # PrismaService global
│   ├── app.module.ts
│   └── main.ts
└── package.json
```

---

## Requisitos previos

- Node.js ≥ 18
- PostgreSQL 15 instalado y corriendo
- npm o yarn

---

## Instalación y configuración

### 1. Clonar e instalar dependencias

```bash
git clone https://github.com/tu-usuario/eventus-backend.git
cd eventus-backend
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Editar `.env`:

```env
DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/eventus_db"
JWT_SECRET="una_clave_secreta_larga_y_aleatoria"
PORT=3000
FRONTEND_URL="http://localhost:4200"
```

### 3. Crear la base de datos en PostgreSQL

```sql
-- En psql o pgAdmin
CREATE DATABASE eventus_db;
```

### 4. Ejecutar migraciones y seed

```bash
# Genera el cliente Prisma y aplica migraciones
npm run prisma:migrate

# Inserta datos de prueba (usuarios y eventos de ejemplo)
npm run prisma:seed
```

**Credenciales creadas por el seed:**

| Rol | Email | Contraseña |
|-----|-------|-----------|
| ADMIN | admin@unicauca.edu.co | Admin@1234 |
| PARTICIPANT | estudiante@unicauca.edu.co | User@1234 |

### 5. Iniciar el servidor

```bash
# Desarrollo (hot reload)
npm run start:dev

# Producción
npm run build && npm run start:prod
```

El servidor queda disponible en: `http://localhost:3000`

---

## Documentación de la API

Swagger UI disponible en: **`http://localhost:3000/api/docs`**

### Endpoints principales

#### Autenticación
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/api/v1/auth/register` | Registrar usuario | No |
| POST | `/api/v1/auth/login` | Iniciar sesión (retorna JWT) | No |

#### Usuarios
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | `/api/v1/users/me` | Perfil del usuario autenticado | JWT |
| GET | `/api/v1/users` | Listar todos los usuarios | ADMIN |

#### Eventos
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | `/api/v1/events` | Listar eventos (filtros: category, status) | No |
| GET | `/api/v1/events/:id` | Obtener evento por ID | No |
| POST | `/api/v1/events` | Crear evento | ADMIN |
| PUT | `/api/v1/events/:id` | Actualizar evento | ADMIN |
| DELETE | `/api/v1/events/:id` | Eliminar evento | ADMIN |
| GET | `/api/v1/events/stats` | Estadísticas del panel | ADMIN |

#### Inscripciones
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/api/v1/registrations/events/:id` | Inscribirse a un evento | JWT |
| DELETE | `/api/v1/registrations/events/:id` | Cancelar inscripción | JWT |
| GET | `/api/v1/registrations/my` | Ver mis inscripciones | JWT |
| POST | `/api/v1/registrations/events/:eid/users/:uid/attendance` | Marcar asistencia | ADMIN |

### Ejemplo de request

**Login:**
```json
POST /api/v1/auth/login
{
  "email": "admin@unicauca.edu.co",
  "password": "Admin@1234"
}
```

**Respuesta:**
```json
{
  "user": { "id": 1, "email": "admin@unicauca.edu.co", "role": "ADMIN", ... },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Usar token en siguientes requests:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Modelo de datos

```
User
├── id, email (único), password (bcrypt), firstName, lastName
├── role: ADMIN | PARTICIPANT
└── registrations[]

Event
├── id, title, description, location
├── startDate, endDate, capacity
├── status: UPCOMING | ONGOING | FINISHED | CANCELLED
├── category, imageUrl?
└── registrations[]

Registration
├── userId, eventId (únicos juntos)
├── registeredAt, attended
└── relations: User, Event
```

---

## Seguridad implementada

- ✅ Contraseñas hasheadas con bcrypt (12 rondas)
- ✅ Autenticación stateless con JWT (24h de expiración)
- ✅ Autorización por roles (ADMIN / PARTICIPANT)
- ✅ Helmet para cabeceras HTTP seguras
- ✅ CORS configurado solo para el frontend
- ✅ Validación estricta de todos los inputs (whitelist)
- ✅ Datos sensibles nunca expuestos en respuestas

---

## Scripts disponibles

```bash
npm run start:dev       # Desarrollo con hot-reload
npm run build           # Compilar para producción
npm run start:prod      # Iniciar en producción
npm run prisma:migrate  # Aplicar migraciones
npm run prisma:seed     # Insertar datos de prueba
npm run prisma:studio   # Abrir Prisma Studio (GUI de BD)
npm run test            # Ejecutar tests
```

---

## Despliegue en Railway (recomendado)

1. Crear proyecto en [railway.app](https://railway.app)
2. Agregar servicio PostgreSQL
3. Conectar repositorio de GitHub
4. Configurar variables de entorno en Railway
5. El despliegue es automático con cada push a `main`

---

## Equipo

**Asignatura:** Desarrollo de Aplicaciones Web  
**Universidad del Cauca — Facultad de Ingeniería Electrónica y Telecomunicaciones**
