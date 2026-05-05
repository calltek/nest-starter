# NestJS Starter

Starter de backend con NestJS: estructura modular lista para construir APIs multi-tenant con RBAC.

> Stack: **NestJS + TypeScript · PostgreSQL 16 + Prisma · Redis · BullMQ · WebSockets**.
> Patrones, naming y estructura heredados de `vcs-backend`.

## Requisitos

- [Bun](https://bun.com) 1.1+
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
```

