# StreamFlow v2 - Sistema de Diseño Cinema Noir

## Paleta de Colores

El diseño utiliza una paleta "Cinema Noir" con acentos púrpuras sobre fondos extremadamente oscuros.

| Variable | Color | Uso |
|----------|-------|-----|
| `--color-bg-primary` | `#050505` | Fondo principal |
| `--color-bg-card` | `#121212` | Tarjetas y elementos elevados |
| `--color-bg-elevated` | `#1a1a1a` | Elementos muy elevados |
| `--color-border` | `#262626` | Bordes y separadores |
| `--color-text-primary` | `#ffffff` | Texto principal |
| `--color-text-secondary` | `#a1a1aa` | Texto secundario |
| `--color-text-muted` | `#71717a` | Texto terciario |
| `--color-accent` | `#A855F7` | Color primario (purple-500) |
| `--color-accent-hover` | `#D946EF` | Color hover (fuchsia-500) |
| `--color-accent-muted` | `#A855F7` | Color mutes para sombras |
| `--color-success` | `#22c55e` | Éxito |
| `--color-error` | `#ef4444` | Error |
| `--color-warning` | `#f59e0b` | Advertencia |

## Tipografía

- **Display**: Syne (Google Fonts) - Títulos y elementos destacados
- **Body**: Manrope (Google Fonts) - Texto general

## Estética General

- **Tema**: Cinema Noir - osc uridad cinematográfica con iluminación púrpura
- **Superficies**: Glass-morphism con blur y transparencias
- **Bordes**: Bordes sutiles con `border-[var(--color-border)]`
- **Sombras**: Sombras púrpuras sutiles en elementos importantes
- **Texturas**: Ruido sutil en fondos para profundidad

## Componentes UI

### Button
```tsx
<Button variant="primary" size="md|lg">Texto</Button>
```
- `primary`: Gradiente púrpura con glow
- `secondary`: Fondo elevado con borde
- `ghost`: Transparente con hover
- `danger`: Rojo para acciones destructivas

### Input
```tsx
<Input label="Email" type="email" placeholder="tu@ejemplo.com" />
```
- Focus glow púrpura
- Labels flotantes
- Iconos opcionales

### Card
```tsx
<Card variant="default|elevated|bordered|glass">
```
- `glass`: Glass-morphism con backdrop-blur
- `bordered`: Borde visible
- `elevated`: Sombra pronunciada

## Estructura de Páginas

### Login/Register
- Fondo con gradientes radiales púrpuras animados
- Card central con glass-morphism
- Animaciones de entrada (fade-in-up, float)
- Indicador de fuerza de contraseña (register)

### Dashboard
- Navbar glass en la parte superior
- Contenido en contenedor centrado
- Grid de videos responsive
- Estados de carga y vacío

## Animaciones CSS

| Clase | Efecto |
|-------|--------|
| `animate-fade-in` | Fade de entrada |
| `animate-fade-in-up` | Fade con movimiento hacia arriba |
| `animate-float` | Flotación continua |
| `animate-glow-pulse` | Pulso de glow |
| `animate-shimmer` | Efecto shimmer en gradientes |
| `animate-shake` | Shake para errores |

## Endpoints API

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/v1/auth/register` | Registro de usuario |
| POST | `/v1/auth/login` | Inicio de sesión |
| GET | `/v1/assets` | Listar assets (autenticado) |
| POST | `/v1/assets` | Crear asset (autenticado) |
| GET | `/v1/assets/:id` | Obtener asset (autenticado) |
| DELETE | `/v1/assets/:id` | Eliminar asset (autenticado) |

## Servicios Docker

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| frontend | 3000 | Next.js frontend |
| api | 3001 | Fastify API |
| postgres | 5433 | PostgreSQL (puerto local) |
| redis | 6379 | Redis |
| minio | 9000 | MinIO S3 |

## Variables de Entorno Importantes

```env
DATABASE_URL=postgres://streamflow:streamflow@postgres:5432/streamflow
REDIS_URL=redis://redis:6379
S3_ENDPOINT=http://minio:9000
JWT_SECRET=tu-secret-key
```
