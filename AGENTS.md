<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Z-Academy 5.0 Coding Agent Guidelines

## 1. Project Conventions
- **Page Components:** Each pure server-side page component must have the word "Page" at the end (e.g., `SignUpPage.tsx`). Feature components imported into pages should NOT have the "Page" suffix (e.g., `feature/auth/ui/SignUp.tsx`).
- **Auth Verbs:** Always use `SignIn`, `SignUp`, and `SignOut`.
- **Terminology:** Use "verification" instead of "approval" (e.g., pending verifications).
- **Inputs:** All inputs must use realistic placeholders (e.g., `user@example.com` instead of "Enter your email").

## 2. Layout & UI Structure
- **General Layout:** Clean, modern, minimal. Fixed left sidebar navigation.
- **Padding:** Desktop main content area must have `padding: 40px`. Mobile padding must be `12px`.
- **Max Width:** Content-heavy pages (like Course Detail) have a max-width of `1200px` and are centered.
- **Views:** Use responsive Grid Views (3-4 columns on desktop) for course browsing and dashboards. Use Table Views for management and data-heavy pages.

## 3. Media Handling
- **Storage:** All media goes to AWS S3. The backend stores only public URLs or object key metadata.
- **Local Previews:** Frontend uses `URL.createObjectURL(file)` for temporary previews before S3 upload. Never send local preview URLs to the backend.
- **Upload Flow:** Frontend gets a presigned URL, uploads directly to S3, and then sends the public URL in the create/update request.
- **Validation:** Validate file types on the client before upload. Allowed category images: `.jpg`, `.jpeg`, `.png`.
- **Aspect Ratio:** Default category images to a `16 / 9` ratio.

## 4. Forms (React Hook Form + Zod)
- **Architecture:** Use React Hook Form combined with Zod for schema validation.
- **Components:** Forms are built using our custom `Field` architecture.
- **Implementation:** 
  - Use `Controller` for controlled inputs.
  - Wrap inputs in `<Field data-invalid={fieldState.invalid}>`.
  - Pass `aria-invalid={fieldState.invalid}` to input elements.
  - Display errors using `{fieldState.invalid && <FieldError errors={[fieldState.error]} />}`.

## 5. App Features & Routing
- **Public:** Home (`/`), About Us, Courses Catalog, Course Details, Public/Private Chat, Auth (`/signin`, `/signup`, `/verify-otp`).
- **Admin:** Management of Courses, Instructors, Students, Categories, Analytics, Settings (`/admin/*`).
- **Instructor:** Course Builder, Dashboard, My Students, Analytics (`/instructor/*`).
- **Student:** My Learning, Enrolled Courses, Course Player with progress tracking (`/student/*`).
