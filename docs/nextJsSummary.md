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

## Linking and Navigating

### How navigation works
- **Server Rendering**: Layouts/Pages are React Server Components by default; the Server Component Payload is generated server-side. Two modes: **Prerendering** (build time/revalidation, cached) and **Dynamic Rendering** (per-request).
- **Prefetching**: `<Link>` automatically prefetches routes as they enter the viewport (or on hover). Static routes are fully prefetched; dynamic routes are skipped or only partially prefetched (if `loading.tsx` exists). Plain `<a>` tags do not get prefetching.
- **Streaming**: A route's `loading.tsx` wraps `page.tsx` in a `<Suspense>` boundary automatically, letting the server send ready parts first. Enables partial prefetching for dynamic routes, immediate navigation feedback, interactive shared layouts, and better Core Web Vitals (TTFB/FCP/TTI).
- **Client-side transitions**: `<Link>` navigation avoids full page reloads — it keeps shared layouts/UI and swaps in the new content (prefetched loading state or full page), preserving state and scroll behavior (auto-scrolls to top; use `scroll-padding-top` for sticky headers).

### What can make transitions slow, and fixes
- **Dynamic routes without `loading.tsx`** → add `loading.tsx` to enable partial prefetch + immediate loading UI.
- **Dynamic segments without `generateStaticParams`** → route falls back to dynamic (per-request) rendering instead of being prerendered; add `generateStaticParams` to prerender at build time when the segment's data is public, relatively stable, and bounded in count.
- **Slow networks** → prefetch may not finish before click; use the `useLinkStatus` hook to show a (debounced) pending indicator during the transition.
- **Disabling prefetching** (`<Link prefetch={false}>`) saves resources for large link lists (e.g. infinite scroll) but static routes then fetch only on click and dynamic routes must render server-side first; a middle ground is prefetch-on-hover only.
- **Hydration not completed** — `<Link>` is a Client Component and needs hydration before it can prefetch; reduce bundle size (`@next/bundle-analyzer`) and move logic server-side where possible.

### Native History API
- `window.history.pushState`/`replaceState` integrate with the Next.js router (sync with `usePathname`/`useSearchParams`) but are pure client-side browser APIs: they only change the URL — **no request to the Next.js server, and the Server Component (`page.tsx`) does NOT re-run**. Only already-rendered Client Components using `useSearchParams`/`usePathname` re-render to reflect the new URL.
- Use `pushState` for reversible URL-only state (adds a history entry, e.g. client-side sort where data is already loaded).
- Use `replaceState` for non-reversible URL-only state (replaces current entry, e.g. locale switch, skipping intermediate wizard steps in back-navigation).
- Contrast: Next.js's own `router.push()` (from `useRouter`, `next/navigation`) DOES send a request to the Next.js server and DOES re-run `page.tsx` with new `searchParams` — this is the correct choice whenever fresh server/backend data (e.g. an Express API call) is needed in response to a client action (e.g. applying a dashboard filter). History API is only appropriate when no new server data is needed.

## Server and Client Components

- Layouts/pages are **Server Components** by default (data fetching, secrets/API keys, less client JS, better FCP + streaming). Add `"use client"` only where interactivity/browser APIs/hooks are needed (state, event handlers, `useEffect`, `localStorage`/`window`, custom hooks).
- **Project pattern (this app)**: `page.tsx`/`layout.tsx` stay Server Components that fetch data (via `apiClient` → Express) and pass it as props to a Client Component that renders the interactive UI (e.g. `admin/layout.tsx` → `getMeQuery()` → `AppLayoutShell`). This matches the docs' recommended split and is the preferred pattern going forward.
- `"use client"` marks a **boundary**: everything that file imports/renders directly joins the client bundle — no need to re-mark every child. Exception: Server Components passed as `children`/props to a Client Component are NOT pulled into the client bundle; they're rendered server-side and only their output crosses the boundary (the "interleaving" pattern, e.g. `<Modal><Cart /></Modal>`).
- Rendering pipeline: Server Components → RSC Payload (serialized tree + Client Component placeholders/props) → used to prerender HTML. First load: HTML shown immediately, RSC Payload reconciles the tree, JS hydrates Client Components. Later navigations: RSC Payload is prefetched/cached, Client Components render fully client-side.
- React Context isn't supported in Server Components — wrap it in a small Client Component provider and render it as deep in the tree as possible (not around `<html>`), so Next.js can still statically optimize the rest.
- Third-party components that use client-only features (state, hooks) but lack `"use client"` must be wrapped in your own `"use client"` file before using them in a Server Component.
- **Critical for this stack (Express backend)**: any module making Express calls with secrets/tokens (e.g. `src/lib/apiClient.ts`) should `import "server-only"` at the top — this causes a build-time error if ever imported into a Client Component, preventing secret leakage. Only `NEXT_PUBLIC_`-prefixed env vars are safe to reach the client bundle.

## Runtime APIs with cached functions

- `cookies()`, `headers()`, `searchParams`, `params` are only known at request time, not build time. A component reading them directly must be wrapped in `<Suspense>` (it can't be part of the static prerendered shell).
- To cache a result that depends on one of these, two options: (1) `"use cache: private"` on the function itself — lets it read cookies/headers directly and still be cached, scoped per-user (this project's `getMeQuery` pattern — simplest, no `<Suspense>` needed). (2) Extract the runtime value in a small non-cached wrapper component, then pass just that value as a prop into a separately `"use cache"`-marked function — the value becomes part of the cache key. Use this when you want only a specific extracted value (not the whole cookie/request) to determine the cache entry.
- **Use case**: any per-user cached fetch that depends on the session cookie (e.g. `getMeQuery` → `/auth/me`) is the "use cache: private" case — prefer it for simplicity over the extract-and-pass pattern unless you specifically need a narrower cache key.

## Random values & timestamps

- `Math.random()`, `Date.now()`, `crypto.randomUUID()` are non-deterministic — calling them in a Server Component needs an explicit choice about caching behavior, otherwise the result may get frozen at build time and served identically to everyone.
- **Need a fresh value per request/user** (e.g. a per-request random ID): call `connection()` before generating it, and wrap the component in `<Suspense>` — this opts the component into dynamic (request-time) execution instead of build-time.
- **Need the same value shared across users until it changes** (e.g. a "quote of the day"): generate it inside a `"use cache"` function with an appropriate `cacheLife` — it computes once and is reused for all requests until the cache entry expires.
- **Use case**: not currently used in this app (OTP/token randomness happens on the Express backend, not in Next.js) — relevant if a future feature generates any random/time-based value directly in a Server Component (e.g. a client-tracking ID, A/B test variant assignment).
