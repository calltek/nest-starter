# NestJS Starter

Starter de backend con NestJS: estructura modular lista para construir APIs multi-tenant con RBAC.

> Stack: **NestJS + TypeScript · PostgreSQL 16 + Prisma · Redis**.
> Patrones, naming y estructura heredados de `vcs-backend`.

## Requisitos

- [Bun](https://bun.com) 1.3+
- Docker (para Postgres + Redis locales)

## Quickstart

```bash
# 1. Variables de entorno
cp .env.example .env
# editar .env (al menos DATABASE_URL, JWT_SECRET_KEY, VAULT_MASTER_KEY)

# 2. Servicios anexos (postgres + redis)
bun run docker:dev

# 3. Dependencias y cliente Prisma
bun install
bun run generate

# 4. Migraciones
bun run migrate

# 5. Servidor en modo desarrollo
bun run dev
```

Una vez arrancado:

- API: `http://localhost:5050`
- Healthcheck: `GET /ping`
- Swagger UI: `GET /docs`
- Swagger JSON: `GET /swagger`

## Scripts

| Script | Acción |
|---|---|
| `bun run dev` | Arranca el servidor con watch mode |
| `bun run build` | Compila a `dist/` |
| `bun run migrate` | Aplica migraciones Prisma |
| `bun run generate` | Genera el cliente Prisma |
| `bun run format` | Biome format sobre `src/` y `test/` |
| `bun run lint` | Biome check con autofix |
| `bun run test` | Tests unitarios (bun test) |

## Tests

Los tests viven en `test/` (convención `*.spec.ts`) y corren con `bun test` — sin Jest ni configuración extra. Los specs importan el código de `src/` directamente vía el alias `@/`.

```bash
bun run test        # una pasada
bun run test:watch  # watch mode
bun run test:cov    # con coverage
```

> Nota: en ficheros con decoradores, importa las interfaces con `import type` — Bun conserva los imports de valor cuando hay `emitDecoratorMetadata` y un tipo inexistente en runtime rompe la carga del módulo.

## Estructura

```
src/
├── common/            decorators, exceptions, guards, helpers,
│                      middlewares, schemas, types
├── config/            settings, logger, cache, sentry
├── modules/           un directorio por feature
├── providers/         prisma, jwt, logger
├── app.module.ts
├── app.controller.ts
├── app.swagger.ts
└── main.ts
test/                  specs (bun test)
```

## Notas sobre Bun

- El lockfile (`bun.lock`) está versionado — el build de Docker usa `--frozen-lockfile`.
- No uses `@sentry/profiling-node` ni otros addons NAPI que dependan de libuv (`uv_default_loop`): crashean bajo Bun. Sentry (errores + tracing) funciona sin el profiler.

