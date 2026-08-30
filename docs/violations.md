# Next.js Convention Violations (to fix later)

## Layouts and Pages

- [ ] **`src/app/(root)/user-profile/[id]/page.tsx`** — `params` is typed as a plain object (`{ id: string }`) instead of `Promise<{ id: string }>`, and `params.id` is accessed synchronously without `await`. Violates the App Router rule that `params` is always a Promise and must be awaited before use.
  - Fix reference: `src/app/(root)/view-course-reviews/[id]/page.tsx` already does this correctly — mirror that pattern.
