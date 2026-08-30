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
