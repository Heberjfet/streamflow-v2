# Plan de Desarrollo: StreamFlow v2

## Resumen del Proyecto

**StreamFlow v2** es una plataforma de video self-hosted que permite a usuarios subir, transcodificar y transmitir videos en HLS adaptativo. Construida con Node.js, Fastify, PostgreSQL y FFmpeg.

## Stack Tecnológico

| Componente | Tecnología | Versión |
|------------|-----------|---------|
| Runtime | Node.js | 20 LTS |
| API Framework | Fastify | ^5.0.0 |
| ORM | Drizzle ORM | ^0.40.0 |
| Database | PostgreSQL | 16 |
| Job Queue | BullMQ | ^5.0.0 |
| Storage | MinIO (S3-compatible) | - |
| Video Player | HLS.js | ^1.0.0 |
| Transcoding | fluent-ffmpeg | ^2.1.0 |
| Auth | @fastify/jwt + @fastify/passport | ^9.0.0 |
| Frontend | Next.js | 15 |

## Arquitectura del Proyecto

```
streamflow-v2/
├── apps/
│   └── api/                    # Fastify REST API
├── packages/
│   └── db/                     # Schema compartido Drizzle
├── worker/                      # BullMQ Worker
├── frontend/                    # Next.js 15
├── docker/
│   ├── api.Dockerfile
│   └── worker.Dockerfile
├── docker-compose.yml           # Desarrollo
├── docker-compose.prod.yml     # Producción
└── .env.example
```

## Estructura de Base de Datos

### Tablas Principales

- **users** - Usuarios del sistema
- **assets** - Videos/assets del sistema
- **renditions** - Versiones HLS (360p, 720p, 1080p)
- **jobs** - Jobs de BullMQ (transcoding, thumbnails)
- **categories** - Categorías de videos

### Estados de un Asset

```
created → uploading → processing → ready
                              ↓
                           failed
```

## API Endpoints

### Autenticación
- `POST /v1/auth/register` - Registro
- `POST /v1/auth/login` - Login JWT
- `GET /v1/auth/google` - OAuth Google
- `GET /v1/auth/callback` - OAuth callback
- `GET /v1/auth/me` - Usuario actual
- `POST /v1/auth/logout` - Logout

### Assets
- `GET /v1/assets` - Listar videos
- `POST /v1/assets` - Crear asset
- `GET /v1/assets/:id` - Detalle asset
- `POST /v1/assets/:id/upload-url` - URL pre-firmada S3
- `POST /v1/assets/:id/process` - Iniciar transcoding
- `GET /v1/assets/:id/playback` - Obtener HLS manifest
- `DELETE /v1/assets/:id` - Eliminar asset

### Categorías
- `GET /v1/categories` - Listar categorías
- `POST /v1/categories` - Crear categoría (admin)

### Playback Público
- `GET /v1/playback/:playbackId` - Endpoint público

## Pipeline de Video

### Upload
```
1. POST /v1/assets → { id, title }
2. POST /v1/assets/:id/upload-url → { uploadUrl }
3. PUT uploadUrl (cliente sube directo a S3)
4. POST /v1/assets/:id/process → Job en cola
```

### Worker (Transcoding)
```
1. Descargar source desde S3
2. FFmpeg → HLS 360p, 720p, 1080p
3. Subir HLS segments a S3
4. Generar thumbnails
5. Actualizar DB: status = 'ready'
```

### Playback
```
1. GET /v1/assets/:id/playback → { hlsPlaylist, thumbnails }
2. hls.js reproduce desde S3 directamente
```

## Docker Configuration

### Servicios
- **api** - Fastify REST API (puerto 3001)
- **worker** - BullMQ worker (transcoding)
- **postgres** - PostgreSQL 16
- **redis** - Redis 7 (cola de jobs)
- **minio** - Object storage S3-compatible

### Escalabilidad
- API: 1 réplica por defecto
- Worker: 2 réplicas (escalable)

## Fases de Desarrollo

### Fase 1: Estructura Base
- [ ] Crear estructura de monorepo npm workspaces
- [ ] Configurar `packages/db` con Drizzle
- [ ] Definir schemas de base de datos
- [ ] Generar migraciones

### Fase 2: API Fastify
- [ ] Crear `apps/api` con Fastify
- [ ] Configurar plugins (jwt, cors, multipart)
- [ ] Implementar autenticación (JWT + Google OAuth)
- [ ] CRUD de assets con pre-signed URLs
- [ ] Configurar BullMQ
- [ ] Endpoint playback

### Fase 3: Worker Transcoding
- [ ] Crear worker con BullMQ
- [ ] Pipeline FFmpeg → HLS
- [ ] Generación thumbnails
- [ ] Manejo de errores

### Fase 4: Frontend
- [ ] Mantener Next.js existente
- [ ] Actualizar API client
- [ ] Integrar hls.js player
- [ ] Mantener diseño actual

### Fase 5: Deployment
- [ ] Dockerfiles
- [ ] docker-compose.yml
- [ ] Deploy en Dokploy

## Tiempo Estimado

| Fase | Duración |
|------|----------|
| Fase 1 | 2-3 días |
| Fase 2 | 5-7 días |
| Fase 3 | 4-5 días |
| Fase 4 | 3-4 días |
| Fase 5 | 2-3 días |

**Total: ~3-4 semanas**

## Variables de Entorno

```env
# Database
DATABASE_URL=postgresql://streamflow:streamflow@postgres:5432/streamflow

# Redis
REDIS_URL=redis://redis:6379

# S3/MinIO
S3_ENDPOINT=http://minio:9000
S3_BUCKET=streamflow
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin

# Auth
JWT_SECRET=your-secret-key
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
FRONTEND_URL=http://localhost:3000

# Server
PORT=3001
NODE_ENV=production
```

## Deployment

### Desarrollo Local
```bash
docker compose up -d
```

### Producción
```bash
docker compose -f docker-compose.prod.yml up -d
```

## Métricas de Calidad

- **Benchmark Fastify**: 85.68
- **Benchmark Drizzle ORM**: 85.01
- **Benchmark BullMQ**: 85.85
- **Benchmark HLS.js**: 66.1

## License

MIT
