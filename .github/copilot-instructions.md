## Copilot / AI agent quick instructions — Personal Expense Tracker

This file captures the latest patterns and conventions for working in this monorepo. See the root `README.md` for badges, features, and setup.

### Repo layout

- Top-level Yarn workspaces. Packages live under `packages/`:
  - `packages/api` — NestJS backend (TypeORM + PostgreSQL). Entry: `packages/api/src/main.ts`.
  - `packages/frontend` — React + Vite frontend. Entry: `packages/frontend/src/main.tsx`.

### Quick commands (run from root)

- Install: `yarn install`
- Dev API: `yarn dev:api` (runs `yarn workspace api start:dev`)
- Dev frontend: `yarn dev:frontend`
- Build API: `yarn build:api` ; Build frontend: `yarn build:frontend`

### Runtime/config notes

- API config via env vars and `@nestjs/config` (see `packages/api/src/app.module.ts`)
- TypeORM: `synchronize: true` for dev only; use migrations for prod
- Swagger UI: `/api` (see `packages/api/src/main.ts`)

### Key modules & endpoints

- Health: `GET /health` (`src/health/health.controller.ts`)
- Users: `src/users/` (controller, service, entity)

### Coding patterns

- Add features as modules: `src/<feature>/` with `module`, `controller`, `service`, `dto/`, `entities/`
- Inject TypeORM repos with `@InjectRepository(Entity)`
- Use `class-validator` decorators in DTOs (see global `ValidationPipe` in `AppModule`)
- Register global pipes/guards/interceptors in `AppModule`
- Rate limiting: `@nestjs/throttler` global guard

### Tests & CI

- Unit: `yarn workspace api test` (Jest)
- Coverage: `yarn workspace api test --coverage`
- E2E: `yarn workspace api test:e2e` (see `test/jest-e2e.json`)
- Frontend: manual/visual checks or add tests under `packages/frontend/src`

### Working across API & frontend

- Use monorepo scripts to run both dev servers
- Frontend expects API to be available (CORS via `WHITELISTED_DOMAINS` env)

### Example code patterns

- Controller: `@Controller('X')` in `src/<feature>/<feature>.controller.ts`
- Service: business logic, inject repos (see `UsersService`)
- Entity: `src/<feature>/entities/`, register in module

### PR safety checklist

1. Run `yarn install` and dev servers locally
2. Run `yarn workspace api test` and `yarn workspace api test:e2e` if needed
3. Verify Swagger at `http://localhost:3000/api` and `GET /health`
4. No new TypeORM `synchronize`-only behaviors for prod

### Where to start for new features

1. Read `README.md` and `src/main.ts` + `src/app.module.ts`
2. Inspect nearby modules for patterns (e.g., `src/users/`)
3. Add DTOs under `dto/`, entities under `entities/`, wire up in module

If you need more examples (DTOs, entity fields, test patterns), specify the area and I will expand with concise, discoverable snippets from the repo.
