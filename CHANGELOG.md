# Changelog - StreamFlow v2

Todos los cambios significativos de este proyecto se documentarán aquí.

## [Unreleased] - 2026-04-20

### Agregado
- Sistema de diseño "Cinema Noir" completo
- Paleta de colores con variables CSS
- Componentes UI (Button, Input, Card) con variantes
- Animaciones CSS personalizadas
- Documentación del sistema de diseño en DESIGN_SYSTEM.md

### Modificado
- Frontend rediseñado con estética Cinema Noir
- Login page: Card glass con shimmer y glow effects
- Register page: Con indicador de fuerza de contraseña
- Dashboard: Layout limpio con navbar glass
- API routes: Corregido uso de fastify.authenticate

### Corregido
- Login/Register ahora usan API real (antes hardcoded demo)
- Error `request.currentUser.userId` en assets routes
- Response handling en api.ts para errores con `error.error`
- Puerto PostgreSQL 5433 (era 5432)

### Infraestrutura
- Docker Compose con todos los servicios
- Frontend Dockerfile creado
- API y Worker Dockerfiles actualizados
- CORS configurado para localhost:3000

## Credenciales de Prueba
- **Email**: admin@streamflow.local
- **Password**: admin123
