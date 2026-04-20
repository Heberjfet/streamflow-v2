# StreamFlow v2

**Plataforma de Video Self-Hosted para streaming personal**

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

StreamFlow v2 es una plataforma de streaming de video que permite subir, transcodificar y transmitir contenido en HLS adaptativo desde tu propia infraestructura.

## Características

- **Upload Directo a S3** - URLs pre-firmadas para uploads eficientes desde el navegador
- **Transcoding Real** - FFmpeg convierte videos a HLS 360p/720p/1080p
- **Thumbnail Sprites** - Vista previa en scrubber del reproductor
- **HLS Playback** - Streaming adaptativo con HLS.js
- **Job Queue** - BullMQ para procesamiento confiable de videos
- **Auth** - JWT + OAuth Google
- **Docker Ready** - Despliegue simple con Docker Compose

## Stack Tecnológico

| Componente | Tecnología |
|------------|------------|
| API | Fastify (Node.js) |
| ORM | Drizzle |
| Database | PostgreSQL 16 |
| Queue | BullMQ + Redis |
| Storage | MinIO (S3-compatible) |
| Transcoding | FFmpeg + fluent-ffmpeg |
| Player | HLS.js |
| Frontend | Next.js 15 |

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 20 LTS (para desarrollo local)

### Desarrollo Local

```bash
# Clonar repositorio
git clone https://github.com/Heberjfet/streamflow-v2.git
cd streamflow-v2

# Copiar variables de entorno
cp .env.example .env

# Iniciar servicios
docker compose up -d

# Ver logs
docker compose logs -f
```

La API estará disponible en `http://localhost:3001`

### Desarrollo Local (sin Docker)

```bash
# Instalar dependencias
npm install

# Generar migraciones
npm run db:generate

# Aplicar migraciones
npm run db:migrate

# Iniciar API
npm run dev --workspace=apps/api

# Iniciar Worker (en otra terminal)
npm run dev --workspace=worker
```

## API Endpoints

### Autenticación
- `POST /v1/auth/register` - Registro de usuario
- `POST /v1/auth/login` - Login con JWT
- `GET /v1/auth/google` - Login con Google
- `GET /v1/auth/me` - Usuario actual

### Assets (Videos)
- `GET /v1/assets` - Listar mis videos
- `POST /v1/assets` - Crear asset
- `GET /v1/assets/:id` - Detalle de asset
- `POST /v1/assets/:id/upload-url` - Obtener URL de upload
- `POST /v1/assets/:id/process` - Iniciar transcoding
- `GET /v1/assets/:id/playback` - Obtener HLS manifest
- `DELETE /v1/assets/:id` - Eliminar asset

### Playback Público
- `GET /v1/playback/:playbackId` - Reproducir video (público)

## Upload de Video

```bash
# 1. Crear asset
curl -X POST http://localhost:3001/v1/assets \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Mi Video"}'

# 2. Obtener URL de upload
curl -X POST http://localhost:3001/v1/assets/ASSET_ID/upload-url \
  -H "Authorization: Bearer $TOKEN"

# 3. Subir archivo directo a S3 (la URL returned)
curl -X PUT "$UPLOAD_URL" --data-binary @video.mp4

# 4. Iniciar transcoding
curl -X POST http://localhost:3001/v1/assets/ASSET_ID/process \
  -H "Authorization: Bearer $TOKEN"
```

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# Redis
REDIS_URL=redis://host:6379

# S3/MinIO
S3_ENDPOINT=http://localhost:9000
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
```

## Arquitectura

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│    API      │────▶│  PostgreSQL │
│  (Browser)  │     │  (Fastify)  │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │
       │                   │
       │                   ▼
       │            ┌─────────────┐
       │            │    Redis    │
       │            │  (BullMQ)   │
       │            └─────────────┘
       │                   │
       ▼                   ▼
┌─────────────────────────────────────────┐
│                  S3 (MinIO)             │
│  ┌─────────┐  ┌─────────┐  ┌────────┐  │
│  │  Raw    │  │   HLS   │  │ Thumbs │  │
│  │ uploads │  │ segments│  │        │  │
│  └─────────┘  └─────────┘  └────────┘  │
└─────────────────────────────────────────┘
                      │
                      ▼
               ┌─────────────┐
               │   Worker    │
               │  (Transcode)│
               └─────────────┘
```

## Deployment

### Docker Compose (Producción)

```bash
docker compose -f docker-compose.prod.yml up -d
```

### Dokploy

StreamFlow v2 está optimizado para despliegue en Dokploy con Docker.

## Licencia

MIT - Libre para uso personal y comercial.
