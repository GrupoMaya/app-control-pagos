# Plan de refactorización: React + Tailwind + shadcn/ui, sin XState ni Chakra/AntD

## Alcance
Actualizar toda la aplicación `app-control-pagos` (~13,000 líneas de JS) desde:
- React 17 + Create React App
- Chakra UI 1.x + Ant Design 4.x
- XState 4.x para todo el estado asíncrono

Hacia:
- React 19 + Vite (recomendado) o React 18 + CRA con override
- Tailwind CSS v4
- shadcn/ui (componentes headless con Tailwind)
- Sin XState: estado del servidor gestionado con TanStack Query (React Query), estado UI/global con React Context + hooks locales

## Por qué Vite en lugar de CRA
Create React App está en modo mantenimiento desde 2023 y no soporta React 19 ni la integración limpia de Tailwind v4. Migrar a Vite es un paso adicional inicial, pero evita bloqueos con `react-scripts`, ESLint 7, Node 18, etc. Si se insiste en mantener CRA, la alternativa es React 18 + Tailwind v3 + overrides de resolución, lo cual es técnicamente posible pero con más riesgo de incompatibilidades.

## Propuesta de arquitectura final

### 1. Capa de red / estado del servidor
Reemplazar todas las XState machines y las llamadas directas a `fetch` dentro de componentes por **TanStack Query v5**.

- Crear `src/api/` con funciones planas por recurso:
  - `proyectos.js`: getProyectos, createProyecto, updateProyecto, getProyectoByID, getAllLotesByProjectID
  - `clientes.js`: getCliente, getAllClients, patchCliente, searchClientes
  - `lotes.js`: getLotes, getLotesByCliente, assignLoteToNewUser, addLoteToUser, patchLote
  - `pagos.js`: getPagosByProject, getInfoPago, postPago, patchPago, updateFolio
  - `settings.js`: getSettingsApp, patchSettingsData
  - `auth.js`: login, validateToken, register
  - `morosos.js`: getMorosos
- Cada función recibe los parámetros necesarios y devuelve `fetch(...).then(r => r.json())`.
- Usar `useQuery` para lecturas y `useMutation` para escrituras, con `queryClient.invalidateQueries` para refrescar listas después de mutaciones.
- Mantener `baseURL` en `src/api/client.js` usando `import.meta.env.VITE_API_URL` (Vite) o `process.env.REACT_APP_URL` (CRA).

### 2. Estado global UI
Conservar `AppContextProvider` y `UserContext` como Contextos de React, pero sin XState:

- `UserContext`: almacena `user`, `token`, `login`, `logout`. Efecto inicial para validar token con `useQuery` o `useEffect`.
- `AppContext`: modales globales (`modalPago`, `idPago`, `openDrawerNewUser`, `openDrawerNewLote`, `plataformName`).
- Eliminar `MayaMachine`, `BuscadorMachine`, `ClienteDataMachine`, `UpdateMachine`, `ClienteDetailContext`.

### 3. UI system con Tailwind + shadcn/ui
- Inicializar Tailwind CSS v4 en Vite.
- Inicializar shadcn/ui (base color `slate` o `zinc`; tema que se ajuste a los tonos esmeralda/rojo actuales).
- Instalar y adaptar los siguientes componentes shadcn:
  - `button`, `input`, `label`, `select`, `dialog`, `drawer`, `sheet`, `table`, `toast`/`sonner`, `spinner`/`loader`, `card`, `badge`, `separator`, `checkbox`, `accordion` (para los formularios colapsables).
- Reemplazar todos los imports de Chakra UI y Ant Design por los componentes shadcn o nativos con Tailwind.
- Mantener `src/Styles/` para las clases globales y animaciones personalizadas, pero eliminar los imports de `antd/dist/antd.css` y las variables/estilos específicos de Chakra.
- Crear un pequeño sistema de tokens CSS en `src/index.css` con las variables de color actuales (`--esmeralda`, `--rojo`, `--background`) para no perder la identidad visual.

### 4. Formularios
Mantener `react-hook-form` (está instalado y funciona bien con componentes shadcn). Crear wrappers controlados para `Input`, `Select`, `Checkbox`, etc., compatibles con `Controller` de react-hook-form.

### 5. Router
Migrar de `react-router-dom` v5 a v6/v7 (dat routers) si se aprovecha la modernización, o mantener v5 si se quiere minimizar cambios. Recomendación: **react-router-dom v7 con Data API** (`createBrowserRouter`) porque facilita loaders/actions y elimina `useHistory`/`Redirect`. Si no, al menos subir a v6.

## Fases de trabajo

### Fase 0 — Preparación y decisiones
1. Elegir la herramienta de build: **Vite** (recomendado) o CRA con React 18.
2. Decidir si se migra a TypeScript. Propuesta: mantener JavaScript para reducir alcance, pero aceptar TS si el usuario lo prefiere (shadcn/ui funciona mejor con TS).
3. Fijar versión de Node: 20 LTS o 22 LTS (la app actual usa 18, que ya está en mantenimiento).
4. Hacer commit inicial de respaldo y crear rama de refactor.

### Fase 1 — Setup del nuevo proyecto/build
1. Si se elige Vite:
   - Crear estructura Vite con React + SWC.
   - Migrar `src/`, `public/`, `.env` y dependencias.
   - Configurar `vite.config.js` con alias `@/` o mantener `baseUrl: "src"` vía `resolve.alias`.
   - Configurar ESLint 9 flat config (si se desea) o mantener `.eslintrc.js` legacy con compatibilidad.
2. Instalar Tailwind CSS v4 y plugin de Vite.
3. Inicializar shadcn/ui e instalar componentes base.
4. Migrar `index.html` desde `public/index.html`.
5. Configurar variables de entorno `VITE_API_URL`.

### Fase 2 — Capa API + TanStack Query
1. Crear `src/api/client.js`, `src/api/...`.
2. Implementar `useProjects`, `useProject`, `useClients`, `usePayments`, `useAuth`, etc., como custom hooks basados en TanStack Query.
3. Crear `src/providers/QueryProvider.jsx`.
4. Eliminar archivos de XState: `MayaMachine.js`, `BuscadorMachine.js`, `ClienteDataMachine.js`, `UpdateMachine.js`, `ClienteDetailContext.js`.

### Fase 3 — Componentes base shadcn/ui + diseño global
1. Crear `src/components/ui/` con wrappers shadcn.
2. Reconstruir `src/Styles/index.css` (Tailwind + variables + animaciones custom).
3. Reemplazar `ChakraProvider`/`themeContext` por Tailwind + tema shadcn.
4. Asegurar que `MenuMaya` y layout general se vean correctamente con Tailwind.

### Fase 4 — Migración de vistas y componentes
Orden recomendado (de menos a más dependencias):
1. `views/Login.js` + `context/userContext.js`.
2. `Components/MenuMaya.js` + `Components/PrivetRoutes.js`.
3. `views/Dashboard.js` + `Components/CardProyectos.js`.
4. `views/Proyecto.js`.
5. `Components/Search*` y buscadores.
6. `views/Cliente.js` + `views/ClientDetail.js` + `Components/DrawerAddLote` + `Modales/DrawUpdateCiente`.
7. `views/ClienteFluid.js` + `Components/TablaPagosClient.js` + `hooks/HookPagosTable.js` + `Components/ModalPagosClient.js` + `Components/ModalEstatus.js`.
8. `views/ClienteDataForm.js` + `Components/DrawerAddUser` + `Modales/ModalAddUserProject` + `Modales/ModalUserSearch`.
9. `Modales/NuevoProject.js` + `Modales/ModalProyectName.js` + `Modales/ModalSettings.js`.
10. `Modales/UpdateModal/*` + `Modales/FolioUpdate/*`.
11. `views/Morosos.js` + `Components/Morosos/TablaMorosos.js`.
12. `Components/ErrorModal.js`, `Components/ModalStatusProjectDetails.js`, etc.

### Fase 5 — Limpieza, tests y validación
1. Desinstalar Chakra UI, Ant Design, XState, `@xstate/react`, `framer-motion` (si no se usa), `babel-eslint`, `eslint-config-standard` legacy, etc.
2. Actualizar `package.json` scripts: `dev`, `build`, `preview`, `test`, `lint`.
3. Arreglar `App.test.js` para que pruebe algo real o se elimine.
4. Ejecutar build de producción y resolver errores.
5. Revisar manualmente los flujos críticos: login, dashboard, proyecto, detalle de cliente/pago, agregar pago, exportar Excel, generar PDF.
6. Actualizar `CLAUDE.md` con los nuevos comandos y arquitectura.

## Riesgos y consideraciones
- **Tamaño del cambio:** ~13,000 líneas de JS y ~40 archivos. Es una reescritura parcial; conviene hacerlo en rama separada y por fases.
- **Compatibilidad de shadcn/ui con JS:** shadcn está pensado para TypeScript. En JavaScript se puede usar, pero la CLI genera archivos `.tsx`. Se pueden mantener como `.jsx` manualmente.
- **Router:** saltar de v5 a v7 cambia muchos patrones (`useHistory` → `useNavigate`, `Redirect` → `Navigate`, `Switch` → `Routes`, `component/render` → `element`).
- **Estado local complejo:** XState manejaba secuencias de estados y reintentos. Con TanStack Query se simplifica a `idle/loading/success/error` por petición; para flujos multi-paso se pueden usar mutaciones encadenadas o estados locales.
- **Estilos existentes:** Hay muchos estilos SCSS. Se pueden dejar como Tailwind arbitrario (`className="..."`) o migrar gradualmente.
- **Tiempo estimado:** Este plan representa varias horas/días de trabajo incluso con asistencia automatizada. Se recomienda ejecutar por fases y validar cada una.

## Decisiones confirmadas por el usuario
- **Build / React:** Vite + React 19.
- **Lenguaje:** JavaScript (`.jsx`), manteniendo la extensión actual.
- **Router:** react-router-dom v7 con Data API (`createBrowserRouter`).

## Próximo paso inmediato
Comenzar con la **Fase 1 — Setup del nuevo build con Vite + React 19 + Tailwind v4 + shadcn/ui**, seguida de la capa API/TanStack Query y la migración progresiva de componentes.
