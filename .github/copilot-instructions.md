## Copilot / AI Agent Instructions — Personal Expense Tracker

This guide summarizes up-to-date conventions for this monorepo. For full setup and features, see the root `README.md`.

### Monorepo Structure

- **Yarn workspaces**: All packages are under `packages/`
  - `api`: NestJS backend (TypeORM + PostgreSQL). Entry: `packages/api/src/main.ts`
  - `frontend`: React + Vite frontend. Entry: `packages/frontend/src/main.tsx`

### Common Commands (from root)

- Install deps: `yarn install`
- Start API: `yarn dev:api` (dev mode)
- Start frontend: `yarn dev:frontend`
- Build: `yarn build:api` and `yarn build:frontend`

### Configuration & Runtime

- API config: via env vars and `@nestjs/config` (see `api/src/app.module.ts`)
- TypeORM: `synchronize: true` for dev only; use migrations for production
- Swagger: `/api` (see `api/src/main.ts`)

### Key Modules & Endpoints

- Health: `GET /health` (`api/src/health/health.controller.ts`)
- Users: `api/src/users/`

### Coding Patterns

- Add features as modules: `src/<feature>/` with `module`, `controller`, `service`, `dto/`, `entities/`
- Inject TypeORM repos with `@InjectRepository(Entity)`
- Use `class-validator` decorators in DTOs (global `ValidationPipe` in `AppModule`)
- Register global pipes/guards/interceptors in `AppModule`
- Rate limiting: `@nestjs/throttler` global guard

### Prettier & ESLint Integration

- Prettier and ESLint are both enforced. Prettier is used for formatting, ESLint for linting.
- If you see `prettier/prettier` errors:
  1. Ensure Prettier is the default formatter in VS Code settings.
  2. Run `yarn lint` and `yarn format` to auto-fix issues.
  3. Check for a `.prettierrc` or `prettier.config.js` at the root. If missing, create one or use the Prettier extension to generate it.
  4. Make sure your VS Code Prettier and ESLint extensions are up to date and not conflicting.
  5. If using `lint-staged`, verify config in `lint-staged.config.json`.

### Testing & CI

- API unit tests: `yarn workspace api test` (Jest)
- Coverage: `yarn workspace api test --coverage`
- E2E: `yarn workspace api test:e2e` (see `api/test/jest-e2e.json`)
- Frontend: manual/visual checks or add tests under `frontend/src`

### Working Across API & Frontend

- Use monorepo scripts to run both dev servers
- Frontend expects API to be running (CORS via `WHITELISTED_DOMAINS` env)

### Example Patterns

- Controller: `@Controller('X')` in `src/<feature>/<feature>.controller.ts`
- Service: business logic, inject repos (see `UsersService`)
- Entity: `src/<feature>/entities/`, register in module

### PR Safety Checklist

1. Run `yarn install` and both dev servers locally
2. Run all tests: `yarn workspace api test` and `yarn workspace api test:e2e`
3. Check Swagger at `http://localhost:3000/api` and `GET /health`
4. No new TypeORM `synchronize`-only behaviors for prod

### Starting New Features

1. Read `README.md`, `src/main.ts`, and `src/app.module.ts`
2. Review similar modules (e.g., `src/users/`)
3. Add DTOs under `dto/`, entities under `entities/`, wire up in module

Need more examples (DTOs, entity fields, test patterns)? Ask for the area and I’ll provide concise, discoverable snippets from the repo.
