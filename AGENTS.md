# Repository Guidelines

## Project Structure & Module Organization

This is a Yarn workspaces monorepo (`packageManager: yarn@1.22.21`) with three packages:

- **`web/`** — Preact frontend app built with the `cmmn` toolchain. Source in `web/src/`, compiled to `web/dist/`. Includes a service worker (`web/service-worker/`).
- **`server/`** — Fastify backend (Node.js/TypeScript). Handles auth via JWT tokens stored in `server/secrets/secret.key`, CouchDB/MongoDB access, and Google Sheets import.
- **`e2e/`** — Playwright end-to-end tests.

The `web/` package uses TypeScript path aliases — always prefer them over relative imports:
- `@components`, `@components/*` → `src/components/*`
- `@stores`, `@stores/*` → `src/stores/*`
- `@helpers/*` → `src/helpers/*`
- `@icons`, `@hooks`, `@api`, `@constants`

The frontend proxies `/webapi` to `http://localhost:5003` in development. The server reads auth secrets from `server/secrets/secret.key` (auto-created on first run).

## Build, Test, and Development Commands

All commands are run from the repo root with `yarn`.

**Development:**
```sh
yarn workspace @insight/app compile      # compile TS → dist/esm + dist/typings (watch)
yarn workspace @insight/app bundle:watch # bundle frontend (watch)
yarn workspace @insight/app serve        # serve frontend on port 5001
yarn workspace @insight/app run          # compile + bundle + serve in one command
yarn workspace @insomnia/intro-server server  # run backend with nodemon
```

**Build:**
```sh
yarn workspace @insight/app build        # compile + minified production bundle
yarn workspace @insomnia/intro-server build  # compile server TS
```

**Testing:**
```sh
# Frontend unit tests (node:test runner + tsx):
yarn workspace @insight/app test         # runs web/specs/*.specs.ts

# Server tests (requires server/.env.local):
yarn workspace @insomnia/intro-server test  # runs server/specs/*.specs.ts

# E2E tests:
yarn workspace @insight/e2e "run tests"  # Playwright UI mode
```

**Docker/CI:**
```sh
yarn ci                                  # docker build . -t insomnia/intronet-front
```

**KML conversion (server data):**
```sh
yarn workspace @insomnia/intro-server kml  # converts KML → GeoJSON for map data
```

## Coding Style & Naming Conventions

- **Formatter:** Prettier (v2) — no config file found, uses defaults. Applied via lint-staged on commit.
- **Indentation:** 2 spaces, UTF-8, trailing newlines (enforced by `.editorconfig`).
- **TypeScript:** 5.2.2, `experimentalDecorators: true`, JSX via Preact (`jsxImportSource: preact`). Extends `@cmmn/tools/compile/tsconfig.json`.
- **Module format:** ESM (`"type": "module"`) throughout all packages.
- **Test files:** Named `*.specs.ts` (not `*.spec.ts` or `*.test.ts`).

## Testing Guidelines

- **Frontend:** Node.js built-in test runner (`node --import tsx --test`), files match `**/*.specs.ts`. Test files live in `web/specs/`.
- **Server:** Same runner with `@swc-node/register/esm` loader; requires `server/.env.local` with env vars. Tests in `server/specs/`.
- **E2E:** Playwright (`@playwright/test`), config at `e2e/playwright.config.ts`, run with `--ui` flag.

## Commit & Pull Request Guidelines

Branch naming observed in history: `feat/<ticket-or-description>` and `fix/<ticket-or-description>` (e.g., `feat/Insomnia-0001-MapFixAndCentreButton-dev`, `fix/Insomnia-0002-ToiletAndBanyaPodpis-dev`). Commit messages are in Russian or English. PRs are merged into `develop`; `master` is the main/production branch.
