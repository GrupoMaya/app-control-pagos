# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

This is `app-control-pagos`, a React 19 SPA built with **Vite 6**. It is a payment-control dashboard for real-estate projects (proyectos / lotes / clientes / pagos / morosos). The README (`README.md`) is a Spanish-language changelog and does not contain setup or architecture instructions.

## Environment

- **Node version:** 24 (`.nvmrc`). Run `nvm use` if using nvm.
- **Package manager:** npm. The repo contains legacy lockfiles from other managers; only `package-lock.json` should be trusted now.
- **Required environment variable:** `VITE_API_URL` (set in a `.env` file) is the API base URL. `src/api/client.js` reads it as `import.meta.env.VITE_API_URL` and falls back to a hard-coded staging URL.

## Common commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Runs the Vite dev server on port 3001. |
| `npm run build` | Production build into `build/`. |
| `npm run preview` | Previews the production build locally. |
| `npm run lint` | Runs ESLint with `--fix` on `src`. |
| `npm run lint:check` | Runs ESLint without fixing. |
| `npm test` / `npm run test:run` | Runs Vitest (watch / once). |

### Linting notes

- ESLint config is `eslint.config.js` using the flat config format. It extends the recommended React, Hooks, and Refresh rules plus `globals`.
- `react/prop-types` and `react/react-in-jsx-scope` are turned off.
- Several source files contain `/* eslint-disable camelcase */` because the backend/API returns snake_case/Mongo-style fields (`$numberDecimal`, `_id`, etc.).

### Testing notes

- Tests use **Vitest** + `@testing-library/react` + `jsdom`.
- There are currently no test files; `test:run` uses `--passWithNoTests` so CI does not fail.
- `src/test/setup.js` mocks `window.matchMedia` because `sonner` and `next-themes` need it.

## High-level architecture

### UI stack

- **React 19** with functional components and hooks.
- **react-router-dom v7** with `createBrowserRouter` (`src/router.jsx`).
- **Tailwind CSS v4** via `@import "tailwindcss"` in `src/index.css`.
- **shadcn/ui v4** (Base UI / nova preset, Lucide icons) components live in `src/components/ui/`.
- **Sass/SCSS** legacy styling is still imported from `src/Styles/index.scss` in `src/main.jsx`, but it no longer imports Ant Design or Chakra UI.

### State management

- **TanStack Query v5** handles all server state. Hooks live in `src/hooks/api/` and call the flat API functions in `src/api/`.
- **React Context** (plain, not XState) handles auth (`src/context/userContext.js`) and global UI state like modal/drawer toggles (`src/context/AppContextProvider.js`).
- **XState has been removed**; no machines remain in the repo.

### API layer

`src/api/client.js` exports:

- `fetcher(path, options)` — JSON fetch wrapper.
- `fetchBlob(path)` — for Excel downloads.
- `fetchWithAuth(path, options)` — authenticated fetch helper.

Domain API files (`src/api/auth.js`, `projects.js`, `clients.js`, `lotes.js`, `pagos.js`, `morosos.js`, `settings.js`) export async functions that use the base client. Auth tokens are read from `localStorage` under `tokenUserSite` where required.

### Routing and views

`src/App.jsx` renders the `RouterProvider`. Providers are configured in `src/router.jsx` inside `RootLayout`.

Key routes (from `src/router.jsx`):

- `/` — `Dashboard`: list of projects.
- `/login` — `Login`.
- `/proyecto/:slug/:projectName` — `Proyecto`: project detail, lotes table, search, Excel export.
- `/detalle/lote/:idlote/cliente/:clienteSlug/projecto/:projectSlug` — `ClienteFluid`: main payment/invoice flow.
- `/cliente/:slug` — `Cliente`.
- `/add/proyecto/:idProyecto/cliente/:idCliente` — `ClienteDataForm`.
- `/detalle/cliente/:id` — `ClientDetail`.
- `/morosos` — `Morosos`.

`RequireAuth` redirects unauthenticated users to `/login` based on `useUserState()`.

### Directory conventions

- `src/views/` — page-level components connected to routing.
- `src/Components/` — reusable UI pieces, tables, and modals.
- `src/Modales/` — larger modal/drawer components, plus `UpdateModal/`.
- `src/Models/` — generic modal shells (`DetallePago.js`).
- `src/context/` — React context providers (no XState machines).
- `src/hooks/` — small custom hooks for formatting/lookup and TanStack Query API hooks (`src/hooks/api/`).
- `src/utils/` — formatting helpers (`NumberFormat`, `DateIntlFormat`, `Notify`), `SelectorBanco`, `SearchClientProyecto`, etc.
- `src/Styles/` — SCSS entry point and partials.
- `src/providers/` — app-level providers (`QueryProvider.jsx`).

Imports use absolute paths via the `@/` alias configured in `vite.config.js` and `jsconfig.json` (e.g. `import { useProjects } from '@/hooks/api/useProjects'`).

### Important Vite / JSX note

Because the project keeps `.js` extensions for JSX files, `vite.config.js` configures esbuild to treat `.js` and `.jsx` as JSX:

```js
esbuild: {
  include: [/\.js$/, /\.jsx$/],
  exclude: [],
  loader: 'jsx',
  jsx: 'automatic'
}
```

Do not remove this block unless every JSX file is renamed to `.jsx`.

### Key code patterns

- Server state is fetched via `useQuery`/`useMutation` hooks from `src/hooks/api/*`.
- Mutations invalidate related query keys on success (e.g. `['projects']`, `['lotes', 'project', projectId]`, `['clients', id, 'detail']`).
- Payment status is boolean `pago.status` (true = pagado, false = pendiente).
- Currency formatting uses `Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' })`.
- Dates use `Intl.DateTimeFormat` with `timeZone: 'UTC'`.
- Excel export uses `xlsx`; PDF generation is done on the backend via `/pdf?folio=...` and downloaded as a Blob.
- `react-hook-form` is used for form handling.
- `sonner` is used for toast notifications.

### Important quirks

- `swr` is no longer used; remove it if you see it in `dependencies`.
- `pnpm` should not be a production dependency.
- The localStorage token key is `tokenUserSite`.
- Chakra UI, Ant Design, XState, Framer Motion, and the old `context/controllers.js` API class have been removed.
