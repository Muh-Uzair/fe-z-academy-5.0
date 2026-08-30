# Next.js Summary

## Project Structure and Organization

### Top-level folders
- `app` – App Router (main routing system).
- `pages` – Pages Router (older routing system).
- `public` – Static assets served directly (images, fonts, etc.).
- `src` – Optional folder to hold all app source code separate from config files.

### Top-level files
- `next.config.js` – Next.js configuration.
- `package.json` – Dependencies and scripts.
- `instrumentation.ts` – OpenTelemetry/instrumentation setup.
- `proxy.ts` – Request proxy.
- `.env`, `.env.local`, `.env.production`, `.env.development` – Environment variables (not tracked by git).
- `eslint.config.mjs` – ESLint configuration.
- `.gitignore` – Git ignore rules.
- `next-env.d.ts` – Auto-generated TypeScript declarations (not tracked by git).
- `tsconfig.json` / `jsconfig.json` – TypeScript/JavaScript configuration.

### Routing files
Special files inside `app` that control routing behavior:
- `layout` – Shared UI wrapping child segments.
- `page` – Makes a route publicly accessible; unique UI for a route.
- `loading` – Loading UI (Suspense boundary).
- `not-found` – Not-found UI.
- `error` – Error UI (error boundary).
- `global-error` – Global error UI.
- `route` – API endpoint.
- `template` – Like layout, but re-renders on navigation instead of persisting.
- `default` – Fallback UI for parallel routes.

### Nested routes
- Folders map to URL segments; nested folders create nested URL segments.
- Layouts wrap their child segments at any level.
- A route is only publicly accessible once it contains a `page` or `route` file.

### Dynamic routes
- `[segment]` – single dynamic segment (e.g. `/blog/[slug]`).
- `[...segment]` – catch-all segments (matches multiple path parts).
- `[[...segment]]` – optional catch-all (matches even with no extra segments).
- Values are accessed via the `params` prop.

### Route groups and private folders
- `(group)` – Wrapping a folder name in parentheses organizes routes without affecting the URL; allows different layouts per group.
- `_folder` – Prefixing with underscore makes a folder private (opted out of routing), including all its subfolders. Useful for separating UI logic from routing, consistent organization, editor sorting, and avoiding naming conflicts with future Next.js conventions. A route segment starting with underscore can still be created using `%5FfolderName`.

### Parallel and intercepted routes
- `@folder` – Named slot rendered by a parent layout (e.g. sidebar + main content).
- `(.)folder` – Intercept a route at the same level.
- `(..)folder` – Intercept a route one level up.
- `(..)(..)folder` – Intercept a route two levels up.
- `(...)folder` – Intercept a route from the root.
- Used for UI patterns like showing a route as a modal without changing the URL.

### Metadata file conventions
- **App icons**: `favicon`, `icon`, `apple-icon` (static files or generated via `.js/.ts/.tsx`).
- **Open Graph / Twitter images**: `opengraph-image`, `twitter-image` (static or generated).
- **SEO**: `sitemap` (static `.xml` or generated via `.js/.ts`), `robots` (static `.txt` or generated).

### Component hierarchy
Rendering order (outer to inner) for special files in a route segment:
`layout` → `template` → `error` (boundary) → `loading` (Suspense) → `not-found` (boundary) → `page` or nested `layout`.
Components render recursively, so a child segment's components nest inside the parent segment's components.

### Colocation
- Folders in `app` define route structure, but a route is not routable until it has a `page.js` or `route.js` file.
- Only the content returned by `page.js`/`route.js` is sent to the client.
- This makes it safe to colocate project files (components, styles, tests, etc.) inside route segments without them becoming routable.

### `src` folder
- Optional folder to store all application code (including `app`) separately from root-level config files.

### Organization strategies
Next.js is unopinionated about file organization. Common strategies:
1. Store project files outside `app` (in root-level shared folders), keeping `app` purely for routing.
2. Store project files in top-level folders inside `app`.
3. Split project files by feature/route – global shared code in root `app`, feature-specific code colocated within its route segment.
Key recommendation: pick one strategy and stay consistent across the team/project.

### Practical patterns
- **Organize routes without affecting URL**: Use route groups like `(marketing)` and `(shop)`; each group can have its own `layout.js` nested within the main app layout.
- **Opt specific segments into a layout**: Create a route group (e.g. `(shop)`) and move only the routes that should share a layout into it; routes outside the group won't share it.
- **Loading skeleton for a specific route**: Place `loading.tsx` inside a route group (e.g. `(overview)`) so it only applies to that specific page, without affecting the URL structure.
- **Multiple root layouts**: Remove the top-level `layout.js` and add a `layout.js` inside each route group; each root layout must include its own `<html>` and `<body>` tags. Useful for sections of an app with completely different UI/experience.

## Layouts and Pages

### Creating a page
- A `page` file inside `app` default-exports a React component to render UI for a specific route (e.g. `app/page.tsx` → `/`).

### Creating a layout
- A `layout` file default-exports a component accepting a `children` prop; it's shared UI that persists across navigations (preserves state, stays interactive, doesn't re-render).
- The root layout (`app/layout.tsx`) is required and must contain `html` and `body` tags.

### Nested routes and layouts
- Folders define route segments; nesting folders nests URL segments and their layouts (each parent layout wraps its child layout/page via `children`).
- A route needs a `[...]` segment folder structure plus a `page` file to become accessible.

### Dynamic segments
- `[segmentName]` folders generate routes from data (e.g. `app/blog/[slug]/page.tsx`).
- `params` is a `Promise` and must be `await`ed to read its values; nested layouts within dynamic segments can also access `params`.

### Search params
- Server Component pages can read query params via the `searchParams` prop, which is a `Promise` and must be `await`ed.
- Using `searchParams` opts the page into dynamic rendering (requires an incoming request).
- Client Components read search params via the `useSearchParams` hook instead.
- Guidance: use `searchParams` prop for data loading (pagination/filtering from a DB); use `useSearchParams` for client-only filtering of already-loaded data; use `new URLSearchParams(window.location.search)` inside callbacks/event handlers to avoid extra re-renders.

### Linking between pages
- Use the `<Link>` component (`next/link`) for navigation; it extends `<a>` with prefetching and client-side navigation. `useRouter` is available for more advanced/programmatic navigation.

### Route Props Helpers (`PageProps` / `LayoutProps`)
- Globally available utility types (no import needed) generated by `next dev`, `next build`, or `next typegen` that infer `params`/`searchParams`/named slots from the actual route structure — e.g. `PageProps<'/blog/[slug]'>`, `LayoutProps<'/dashboard'>`.
- Static routes resolve `params` to `{}`.
- `LayoutProps` also types named parallel-route slots (e.g. `app/dashboard/@analytics` becomes a typed `props.analytics`).

**Golden rule (when to use `PageProps`/`LayoutProps` vs custom types):**
- **Static route** (no `[param]`) → write a **custom type**, since there's no dynamic `params` to infer and `searchParams` usually needs strict/specific keys (e.g. `{ email?: string }`) rather than the generic `{ [key: string]: string | string[] | undefined }` shape the helper provides.
- **Dynamic route** (`[id]`, `[slug]`) → use **`PageProps`/`LayoutProps`** for `params`, since the helper correctly infers the exact param shape from the route path.
- **Exception**: even on a dynamic route, if `searchParams` needs strict/specific keys, take a hybrid approach — use `PageProps` for `params` but define a custom narrowed type for `searchParams`.
- Route Props Helpers only apply to route files (`page.tsx`/`layout.tsx`); regular reusable components (e.g. client feature components) always need their own custom prop types regardless of this rule.
