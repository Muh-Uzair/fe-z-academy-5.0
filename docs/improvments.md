# Next.js Improvements (to consider later)

## 1. Project Structure and Organization

- [ ] **Route Props Helpers**: `src/app/(root)/view-course-reviews/[id]/page.tsx` manually types `params: Promise<{ id: string }>` instead of using `PageProps<'/view-course-reviews/[id]'>`.
- [ ] **Nested layouts missing** for sibling route families that likely share tab/heading UI:
  - `admin/(protected)/courses/{all-courses, pending-verification-courses, verified-courses}` → no `courses/layout.tsx`
  - `admin/(protected)/instructors/{all-instructors, instructor-details, pending-verifications}` → no `instructors/layout.tsx`
  - `instructor/(protected)/my-courses/{all-my-courses, create-new-courses, pending-verifications}` → no `my-courses/layout.tsx`
  - `student/(protected)/my-learning/{continue-watching, enrolled-courses}` → no `my-learning/layout.tsx`
- [ ] **`router.push` → `<Link>` conversion candidates** (simple click-to-navigate buttons, no conditional/async logic):
  - `src/features/auth-and-user-management/AllInstructors.tsx:130`
  - `src/features/auth-and-user-management/AdminStudents.tsx:88`
  - `src/features/auth-and-user-management/InstructorMyStudents.tsx:88`
  - `src/features/reviews-and-feedback/ViewCourseReviews.tsx:85,150`
  - `src/features/course-management/CourseDetails.tsx:380`
  - `src/features/course-management/Courses.tsx:332`
- [ ] **`apple-icon.tsx`** — already added (done).
- [ ] **`(dashboard)` route group** — already added (done).

## 2. Layouts and Pages

(Covered by the Project Structure items above — Route Props Helpers and nested layouts overlap with this section's conventions.)

## 3. Linking and Navigating

- [ ] **Missing `loading.tsx` on dynamic routes** (no segment-level streaming/instant skeleton, only the root `(root)/loading.tsx` exists):
  - `course-details/[id]`
  - `view-course-reviews/[id]`
  - `user-profile/[id]`
  - `course-checkout/[id]`
  - `course-enrollments/[id]`
  - `private-course-chat/[id]`
  - `public-course-chat/[id]`
  - `admin/(protected)/instructors/instructor-details/[id]`
- [ ] **`generateStaticParams` candidacy**: `view-course-reviews/[id]/page.tsx` could adopt it if the underlying `ViewCourseReviews` component confirms it only fetches public review data (needs verification first). `course-details/[id]` and `user-profile/[id]` are not good fits (role/user-gated).
- [ ] **Large-list `<Link>` prefetching**: `src/features/course-management/AllCourses.tsx:121` and `VerifiedCourses.tsx:123` render a `<Link>` per paginated table row with default prefetching on; consider `prefetch={false}` + hover-triggered prefetch if page sizes grow.
- [ ] `useLinkStatus` — no current opportunity found (no manual navigation-pending state exists to replace).

## 4. Server and Client Components

- [x] `src/lib/apiClient.ts` already guards with `import "server-only"` — good, no action needed.
- [ ] Audit other server-side data-fetch modules (anything under `src/services/**/queries.ts` and `actions.ts` besides `auth`) to confirm each also has `import "server-only"` at the top, since they all ultimately call `apiClient` with cookies/tokens.
- [ ] `AppLayoutShell.tsx` stores `user` in `localStorage` via `useEffect` after receiving it as a server-fetched prop — not a bug, but worth confirming this duplication (server-fetched data mirrored into localStorage) is actually needed, since `getMeQuery()` is already cached server-side (`"use cache: private"` + `cacheTag`).
- [ ] General pattern confirmation (no fix needed): the project's `page.tsx`/`layout.tsx` → Server Component data-fetch → props → Client Component render pattern matches Next.js docs' recommended Server/Client split; continue using this as the default for new pages instead of making entire pages `"use client"`.
