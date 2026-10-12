# Manual Testing Guide — User Flows and Cache Invalidation

This guide tests the app the way real people use it: one story, step by step. After every action it tells you **what must update** and **where**.

The main goal is to prove that when one resource changes (for example a course is verified), every other screen that shows that data (public pages, dashboards, other roles' lists) also changes. If a screen stays stale, that is a cache-invalidation bug.

Tick the boxes as you go. Stop and write down any step that does not match.

---

## 0. Before you start

### 0.1 Run the app in production mode

Caching behaves differently in `next dev`. Test with a production build (or the deployed Vercel app):

```bash
npm run build
npm start
```

### 0.2 Checklist

- [ ] Backend is running and reachable.
- [ ] `API_URL` **and** `NEXT_PUBLIC_API_URL` are both set to the backend (`.../api/v1`). `src/proxy.ts` reads `NEXT_PUBLIC_API_URL`, `apiClient` reads `API_URL`.
- [ ] Stripe is in **test mode** (publishable and secret keys).
- [ ] The Stripe **webhook** reaches the backend. Enrollments, paid transactions and refunds are only completed by webhooks. Locally, use the Stripe CLI (`stripe listen --forward-to <backend webhook URL>`). Ask the backend owner for the exact URL.
- [ ] Email sending works and you can read the inbox (OTP codes, verification emails).
- [ ] An **admin account exists**. There is no admin signup, so insert it in the database by hand.
- [ ] Test files ready:
  - 1 thumbnail `.jpg`/`.png`, 16:9, under 5 MB
  - 1 short video `.mp4` (30–60 seconds is ideal), under 20 MB
  - 1 file that is too big (video over 20 MB) and 1 wrong type (for example `.gif` or `.pdf`)

### 0.3 Browsers and accounts

Cookies are shared inside one browser profile, so use a **separate profile per role**. For example: Chrome normal window, Chrome Incognito, and a second browser.

| Window | Role | Account (use **lowercase** emails) |
| --- | --- | --- |
| A | Admin | `admin@example.com` (created in DB) |
| B | Instructor | `instructor1@example.com` (Flow 2) |
| C | Student 1 | `student1@example.com` (Flow 3) |
| D | Student 2 | `student2@example.com` (used for refund, Flow 12) |
| E | Anonymous | A private window, **not signed in** |

Keep all windows open side by side. You will switch between them a lot.

### 0.4 How to read "what must update"

| Mark | Meaning | How to check |
| --- | --- | --- |
| ⚡ **Instant** | The same person who did the action sees the change. | Use sidebar links or buttons. Do **not** press F5. |
| 🔄 **Reload** | Another person's browser (or the public site). | Press **F5** in that window, then look. |

Why: the person who runs an action gets fresh data immediately. Other people's browsers keep their own short-lived copy, so they see the change after a reload. Public pages (Home, `/courses`, public course details) are cached on the server and must be fresh on **any** reload after the change.

If something is wrong, press F5 once. If F5 fixes it for the **acting** user, that is still a bug (⚡ failed). If F5 is needed for **other** users, that is expected.

### 0.5 Test data

Use easy numbers so the maths is simple:

- Course price: **$10**. Platform commission is 5% = **$0.50**; instructor gets **$9.50**.
- Course names: `QA Course A`, `QA Delete Me`, etc.
- Dashboards have a period filter (week / month / year, default **month**). Keep it on the same value for before/after comparisons.

### 0.6 Snapshot sheet

Write the "before" numbers here, then compare after each flow. Copy this table into a note.

| What | Where | Before | After |
| --- | --- | --- | --- |
| Home "Active Students" | Home (anonymous) | | |
| Home "Premium Courses" | Home (anonymous) | | |
| Category course count | Home, "Explore Top Categories" | | |
| Admin Total Revenue / Commission | Admin dashboard | | |
| Admin Total Students / Instructors / Courses | Admin dashboard | | |
| Instructor Total Revenue / Students / Courses / Avg rating | Instructor dashboard | | |
| Student Enrolled / Completed / Avg completion | Student dashboard | | |

### 0.7 Stripe test cards

| Card | Result |
| --- | --- |
| `4242 4242 4242 4242` | Succeeds |
| `5555 5555 5555 4444` | Succeeds (Mastercard) |
| `4000 0000 0000 0002` | Declined |

Any future expiry date, any 3-digit CVC, any name.

---

## Flow 1 — Access control and session

Goal: every person lands only in their own area.

> Do steps 1.1 to 1.3 now. Do 1.4 after Flow 5 (you need a course id).

**1.1 Signed out**
- [ ] Open `/admin/dashboard`, `/instructor/dashboard`, `/student/dashboard`. Each redirects to `/signin`.
- [ ] Open `/course-checkout/<any id>`. Redirects to `/signin`.

**1.2 Wrong workspace** (after you have accounts from Flows 2 and 3)
- [ ] Signed in as **Admin**, type `/instructor/dashboard` in the address bar. You land on `/admin/dashboard`.
- [ ] Same for `/student/dashboard`. You land on `/admin/dashboard`.
- [ ] Signed in as **Instructor**, open `/admin/dashboard` and `/student/dashboard`. You land on `/instructor/dashboard`.
- [ ] Signed in as **Student**, open `/admin/dashboard` and `/instructor/dashboard`. You land on `/student/dashboard`.
- [ ] None of these show the "Something went wrong" error screen.

**1.3 Local storage**
- [ ] After sign-in, open DevTools → Application → Local Storage. `currentUser` exists and has the right `role` and `email`.

**1.4 Checkout guard** (after Flow 5)
- [ ] As Admin or Instructor, open `/course-checkout/<course id>`. You are sent to your own dashboard, not shown a broken payment form.

---

## Flow 2 — Instructor signs up, Admin verifies, instructor connects Stripe

**Before:** in Window A note Admin dashboard **Total Instructors** and the row count in **All Instructors**.

**2.1 Instructor signs up** (Window B)
- [ ] Open `/signup`, choose **Instructor**, fill name, email, password (8+ chars), bio, highest education, years of experience. Submit.
- [ ] Toast: "Signup successful, your account will be reviewed by an Admin...". You go to `/signin`.

**2.2 Instructor cannot sign in yet** (Window B)
- [ ] Sign in with the new account. Toast: "Your account is pending Admin approval". You stay on `/signin`.

**2.3 Admin sees the new instructor** (Window A, press F5) 🔄
- [ ] **Instructors → Pending Verifications**: the instructor is listed.
- [ ] **Instructors → All Instructors**: listed, status "Not verified".
- [ ] **Dashboard**: Total Instructors is +1. **Recent Users** shows the instructor at the top as unverified.

**2.4 Admin verifies** (Window A)
- [ ] On **Pending Verifications** click **Verify** on that row.
- [ ] ⚡ Only that row shows a spinner. A success toast appears. The row disappears **without reload**.
- [ ] ⚡ **All Instructors** (sidebar): status is now Verified. **View** shows the verified instructor.
- [ ] ⚡ **Dashboard → Recent Users**: the instructor shows as verified.

**2.5 Public site** (Window E, F5) 🔄
- [ ] `/courses` → the instructor filter lists the instructor.

**2.6 Instructor signs in and connects Stripe** (Window B)
- [ ] Sign in works. You land on `/instructor/dashboard` (all zeros).
- [ ] **My Courses → Create New Course** shows the "Stripe onboarding required" card, not the form.
- [ ] Clear Local Storage (DevTools), reload the page: the card still shows. (The page must not depend on local storage.)
- [ ] Click **Complete Stripe onboarding**, finish the Stripe test onboarding, come back.
- [ ] **Create New Course** now shows the course form. (Reload once if needed: the flag is set by a webhook.)

**2.7 Rejection path** (second instructor)
- [ ] Sign up `instructor2@example.com`. In Window A open **All Instructors → View** on that instructor, type a reason in **Verification Rejection Reason**, click reject.
- [ ] Toast succeeds. `instructor2` still cannot sign in. (The rejection email with the reason is sent.)

---

## Flow 3 — Student signs up and verifies the email code

**Before:** note Admin **Total Students**, the **Students** list count, and Home (Window E) **Active Students**.

**3.1 Sign up** (Window C)
- [ ] `/signup` → **Student** form → submit. You land on `/verify-otp` with your email shown.

**3.2 Admin sees the student** (Window A, F5) 🔄
- [ ] **Students**: new student listed.
- [ ] **Dashboard**: Total Students +1. **Recent Users** shows the student as unverified.
- [ ] Home **Active Students** did **not** change (it only counts students with at least one enrollment).

**3.3 OTP checks** (Window C)
- [ ] Enter a wrong 6-digit code. Toast: "Invalid OTP".
- [ ] Click resend. Toast: OTP resent. Use the **newest** email.
- [ ] Enter the correct code. You land on `/signin` with the email filled in.

**3.4 Admin sees verified student** (Window A, F5) 🔄
- [ ] Students list and Recent Users show the student as verified.

**3.5 First sign-in** (Window C)
- [ ] Sign in. `/student/dashboard` loads with zeros and empty states.

**3.6 Forgot password** (Window C, signed out)
- [ ] **Forgot password** (`/forget-password`) → enter email → OTP page → enter the emailed code → **Reset Password** → set a new password → `/signin`.
- [ ] Sign in with the **new** password works. The old password fails.

Repeat 3.1–3.5 for `student2@example.com` (Window D).

---

## Flow 4 — Admin creates categories (needed for courses)

**4.1 Create** (Window A)
- [ ] **Categories → Add Category**: name `QA Web`, description (10+ chars), image `.jpg`/`.png`. A `.gif` is rejected on the client.
- [ ] ⚡ The category appears in the list. Create a second one, `QA Design`.

**4.2 Other roles** (Window B, F5) 🔄
- [ ] **Create New Course** → the category picker lists `QA Web` and `QA Design`.

---

## Flow 5 — Instructor creates a course, Admin rejects, then verifies

**Before (write on the snapshot sheet):** Home **Premium Courses**, the category count for `QA Web` (if it shows in the top categories), Admin **Total Courses**, Instructor **Total Courses**.

**5.1 Validation** (Window B, Create New Course)
- [ ] Title `abc` → "at least 5 characters".
- [ ] Description under 20 characters → error.
- [ ] No thumbnail → "Course thumbnail is required".
- [ ] `.gif` thumbnail → "Only .jpg, .jpeg, and .png...".
- [ ] Video over 20 MB → "Course video must be 20MB or smaller".
- [ ] The **Create Course** button stays disabled until the form is valid.

**5.2 Create** (Window B)
- [ ] Fill: title `QA Course A`, description 20+ chars, price `10`, level Beginner, category `QA Web`, thumbnail, video. Click **Create Course**.
- [ ] Toast: "Course created successfully, it will be reviewed by an Admin". You land on **All My Courses**; the course shows as pending.

**5.3 Instructor sees it** (Window B)
- [ ] ⚡ **My Courses → Pending Verifications** lists the course.
- [ ] ⚡ **Dashboard**: Total Courses is +1.

**5.4 Admin sees it** (Window A, F5) 🔄
- [ ] **Courses → Pending Verification** lists it. **All Courses** shows it as Pending Review.
- [ ] **Dashboard**: Total Courses is +1.

**5.5 Public site must NOT show it yet** (Window E, F5) 🔄
- [ ] Home: **Premium Courses** is unchanged. The course is not in Featured or Trending.
- [ ] `/courses` does not list it. Opening its direct URL shows not found.
- [ ] Home top categories: the `QA Web` count is **+1** (it counts all courses, verified or not).

**5.6 Admin rejects** (Window A)
- [ ] Open the course from the pending list. In **Admin Review**, type a reason ("The intro video has no audio.") and click **Save Rejection Reason**.
- [ ] ⚡ You land on **All Courses**; the course shows Rejected. It is gone from **Pending Verification**.

**5.7 Instructor sees the rejection** (Window B, F5) 🔄
- [ ] **All My Courses**: status Rejected. The course details show the reason in a red box.
- [ ] It is no longer in **Pending Verifications**.

**5.8 Instructor edits** (Window B)
- [ ] **View Details → Edit Course**: change the description → **Save Changes**. ⚡ View mode shows the new text.

**5.9 Admin verifies** (Window A)
- [ ] Open the course → **Verify Course**.
- [ ] ⚡ You land on **Verified Courses** and the course is listed. (Approving a rejected course clears the reason.)

**5.10 Public site now shows it** (Window E, F5) 🔄
- [ ] Home **Premium Courses** is +1.
- [ ] `/courses` lists `QA Course A` with the correct price and instructor name. Its public details page opens.
- [ ] The `QA Web` category count is **unchanged** compared with step 5.5 (verification must not change it).

**5.11 Instructor sees verified** (Window B, F5) 🔄
- [ ] **All My Courses** and **Dashboard** show the course as verified. The rejection reason is gone.

**5.12 Edit after verification updates public pages** (Window B, then E)
- [ ] Instructor edits the title to `QA Course A (Edited)` → Save Changes.
- [ ] Window E, F5: `/courses` card, the public course page, and Home (if featured/trending) show the new title.

Use `QA Course A (Edited)` from here on.

---

## Flow 6 — Student starts checkout and pays

**Before:** Student 1 dashboard (Enrolled 0), Student 1 **Transactions** (empty) and **Cards** (empty). Instructor dashboard revenue and students. Admin dashboard revenue. Home **Active Students**. Public course page "students" number.

**6.1 Signed out** (Window E)
- [ ] Open `/courses` → the course → **Enroll Now**. You are sent to `/signin`.

**6.2 Open checkout** (Window C)
- [ ] **Browse Courses** → open the course → **Enroll Now**. Checkout loads with course details and a **Payment Details** form.
- [ ] DevTools → Network: the payment-intent request happens **once** when the page opens.
- [ ] The form does not flicker or reset after it loads.

**6.3 A pending transaction exists** (Window C, new tab: `/student/transactions`)
- [ ] There is a transaction with status **Pending**. Open it; the detail page shows Pending.
- [ ] Student **Dashboard → Recent Transactions** shows it.
- [ ] (Windows A and B, F5) 🔄 Admin **Transactions** and Instructor **Transactions** also show the pending row.

**6.4 Declined card** (Window C)
- [ ] Pay with `4000 0000 0000 0002`. An error appears under the form. No enrollment is created.

**6.5 Successful payment** (Window C)
- [ ] Pay with `4242 4242 4242 4242`. A "Payment Successful" panel appears, then after about 5 seconds you land on **Enrolled Courses** with the course listed.
- [ ] If the list is empty, wait a few seconds and reload. Write down how long it took (webhook delay).

**6.6 Student sees everything** (Window C, use the sidebar) ⚡
- [ ] **Enrolled Courses** lists the course. **Enrollments** lists it at 0%.
- [ ] **Transactions**: the row is now **Paid** ($10). Reopen the transaction detail you opened in 6.3: it now shows **Paid**.
- [ ] **Dashboard**: Enrolled Courses is 1.
- [ ] **Cards**: a card ending in `4242` is listed. (The backend docs imply checkout saves the card. If it does not, tell me.)
- [ ] **Enrolled Courses → instructor filter** lists the instructor.

**6.7 Instructor sees it** (Window B, F5) 🔄
- [ ] **Dashboard**: Total Revenue is +$9.50, Admin Commission is $0.50, Total Students is 1, the course performance row shows 1 enrollment.
- [ ] **My Students** lists Student 1. **Enrollments** lists the enrollment.
- [ ] **Transactions**: row is Paid with instructor revenue $9.50 and commission $0.50.

**6.8 Admin sees it** (Window A, F5) 🔄
- [ ] **Dashboard**: Total Revenue is +$10, Admin Commission is +$0.50. **Top Performing Courses** lists the course.
- [ ] **Enrollments** and **Transactions** list the new rows.

**6.9 Public site** (Window E, F5) 🔄
- [ ] The public course page shows 1 more student.
- [ ] Home **Active Students** is +1.
- [ ] Trending shows the course if it is in the top 3.

**6.10 Cannot buy twice** (Window C)
- [ ] Open the checkout for the same course again. An error (already enrolled) is shown instead of a working form.

---

## Flow 7 — Student watches the course (progress)

**7.1 Watch** (Window C)
- [ ] **Enrolled Courses** → open the course. The video plays.
- [ ] Play 10–20 seconds and press **pause**. Wait 2 seconds.

**7.2 Student sees progress** ⚡
- [ ] **Continue Watching** lists the course with a percentage and minutes watched.
- [ ] **Dashboard**: Avg. Completion and Total Watch Time are above 0.

**7.3 Resume**
- [ ] Reopen the course. The video starts near where you paused.
- [ ] Drag the video back to the start and pause. The progress percentage does **not** go down (the furthest point is kept).

**7.4 Other roles** (Window B, F5) 🔄
- [ ] Instructor **Dashboard**: the course's average completion is above 0.

**7.5 Refund button shows the rule** (Window C)
- [ ] Watch past 30% and pause. Reload the course page. **Request Refund** is disabled and a reason explains the 30% rule.

**7.6 Closing the tab (observe only)**
- [ ] Play, then close the tab without pausing. Reopen. Note whether the last position was saved. (This may not always save. Write down what you see.)

---

## Flow 8 — Student reviews the course

**Before:** public course rating shows 0 and 0 reviews.

**8.1 Write a review** (Window C)
- [ ] **Enrolled Courses** → open the course → click the review button. A **Write a Review** dialog opens.
- [ ] Feedback under 10 characters → error.
- [ ] Rating 5, feedback "Great course, learned a lot." → submit.
- [ ] ⚡ The button becomes **Already Reviewed**.

**8.2 Student sees it** ⚡
- [ ] **Reviews** lists the course; the course reviews page shows your review with edit and delete icons.
- [ ] **Dashboard → Recent Reviews** shows it.

**8.3 Other roles** 🔄
- [ ] Instructor (Window B): **Dashboard** Average Rating 5.0, the review appears in recent reviews with the student's name, the course performance rating is 5. **Reviews** page lists it.
- [ ] Admin (Window A): **Reviews** lists it. **Dashboard → Top Performing Courses** shows rating 5.0.
- [ ] Public (Window E): the course page shows 5.0 and 1 review; the `/courses` card shows 5.0; Home Featured shows it if it is in the top 3.

**8.4 Edit feedback only** (Window C)
- [ ] Edit the review: change only the text, keep rating 5. Save.
- [ ] ⚡ Your reviews page and dashboard show the new text.
- [ ] Windows A and B (F5) 🔄: the new text appears in recent reviews. **Ratings did not change.**

**8.5 Edit rating** (Window C)
- [ ] Change rating 5 → 3. Save.
- [ ] Public course page shows 3.0 (F5) 🔄. Instructor Average Rating is 3.0. Admin top courses shows 3.0. The course card in **Enrolled Courses** shows 3.0.

**8.6 Delete review** (Window C)
- [ ] Delete the review and confirm. ⚡ You can write a new review again.
- [ ] Public course page returns to 0 reviews (F5) 🔄. Instructor recent reviews is empty.

**8.7** Write a new review with rating 4 and keep it for later flows.

---

## Flow 9 — Certificate

**9.1** (Window C)
- [ ] Drag the video to near the end and let it play until you pass 95%, then pause.

**9.2 Get the certificate**
- [ ] **Continue Watching** shows an amber **Get Certificate** button for the course. (If a completed course is not listed on this page at all, write that down.)
- [ ] Click it. A certificate opens with your name, course, instructor, level, category, duration, and date.
- [ ] **Download PDF** downloads a landscape A4 file named `Z-Academy-Certificate-<id>.pdf`.
- [ ] Click **Get Certificate** again later. The issue date is the same.

**9.3 Enrollment filter** (Window C) ⚡
- [ ] **Enrollments** → filter **Certificate issued = Yes**. The course is listed.
- [ ] **Dashboard**: Completed Courses is 1.

**9.4 Other roles** (F5) 🔄
- [ ] Admin and Instructor **Enrollments** with **Certificate issued = Yes** list the enrollment.

---

## Flow 10 — Profile changes show up everywhere

Do this when Student 1 has an enrollment, a review and a transaction.

**10.1 Instructor changes name and avatar** (Window B → Settings)
- [ ] Change the name to `Jane Updated`, choose a `.jpg`/`.png` avatar (under 5 MB), **Save Changes**.
- [ ] ⚡ The avatar in the top bar updates. Local Storage `currentUser.fullName` shows the new name (no reload).
- [ ] Student (Window C, F5) 🔄: **Enrolled Courses**, **Enrollments**, **Transactions**, and **Dashboard** (continue watching, recent transactions, recent reviews) show the new instructor name.
- [ ] Admin (Window A, F5) 🔄: **All Instructors**, instructor details, **Dashboard** (Recent Users, Top Performing Courses), and **Enrollments / Transactions / Reviews** show the new name.
- [ ] Public (Window E, F5) 🔄: `/courses` cards, the course page, Home Featured/Trending, and the instructor filter show the new name.
- [ ] Validation: a one-character name is rejected.

**10.2 Bio only**
- [ ] Instructor changes only the bio. Admin's instructor details and the instructor's public profile page (`/user-profile/<id>?role=instructor`) show the new bio (F5).

**10.3 Student changes name** (Window C → Settings)
- [ ] Change the name and save.
- [ ] Instructor (Window B, F5) 🔄: **My Students**, **Enrollments**, **Dashboard → Recent Reviews** show the new name.
- [ ] Admin (Window A, F5) 🔄: **Students**, **Dashboard → Recent Users**, **Reviews** show it.

**10.4 Admin changes name** (Window A → Settings)
- [ ] Save. ⚡ The top bar avatar updates. **Dashboard → Recent Users** shows the new name if the admin is among the last 5 users.

---

## Flow 11 — Saved cards

(Window C → **Cards**)
- [ ] **Add New Card** with `4242...`. ⚡ It appears and is marked **Default** (the first card is default).
- [ ] Add `5555 5555 5555 4444`. ⚡ It appears; the first card stays default.
- [ ] Set the second card as default. ⚡ The Default badge moves.
- [ ] Remove the default card (confirm). ⚡ The other card becomes default automatically.
- [ ] Add a card with an invalid number. An error is shown and nothing is saved.
- [ ] Open a checkout for another course (create one first if needed). The **Saved Cards (n)** tab lists your cards.

---

## Flow 12 — Refund (use Student 2)

**Setup:** Student 2 (Window D) buys `QA Course A (Edited)` with `4242...` (same as Flow 6) and watches only a few seconds (**under 30%**).

**Before:** public course student count, Home Active Students, Admin revenue, Instructor revenue and students.

**12.1 Request the refund** (Window D)
- [ ] **Enrolled Courses** → open the course. **Request Refund** is enabled with no warning text.
- [ ] Click it, confirm in the dialog.
- [ ] Toast: "Refund initiated successfully...". You land on **Enrolled Courses**.
- [ ] Clicking twice quickly does not send two requests (button is disabled while loading).

**12.2 Student 2 sees it**
- [ ] **Transactions** shows **Refund Processing**, then after a few seconds and a reload, **Refunded**. The transaction detail page shows the same status.
- [ ] After the webhook, **Enrolled Courses** and **Enrollments** no longer list the course. Dashboard Enrolled Courses is 0.
- [ ] If Student 2 had written a review, it is gone.

**12.3 Other roles** (F5) 🔄
- [ ] Instructor: revenue and Total Students go back down; **My Students** no longer lists Student 2; **Transactions** shows Refunded.
- [ ] Admin: Total Revenue and Admin Commission are reduced; **Transactions** shows Refunded; **Enrollments** no longer lists it.
- [ ] Public: the course page student count is −1. Home **Active Students** is −1 if Student 2 has no other enrollments.

**12.4 Not eligible**
- [ ] Student 1 (watched over 30%): **Request Refund** is disabled with the reason visible.

**12.5** Student 2 can open checkout and buy the course again.

---

## Flow 13 — Category rules and course deletion

**13.1 Edit and delete a category with no courses** (Window A)
- [ ] **Categories**: edit `QA Design` (change the name). ⚡ The list shows the new name.
- [ ] Instructor (Window B, F5) 🔄: the category picker shows the new name.
- [ ] Delete `QA Design` and confirm. ⚡ It disappears. Instructor picker (F5) no longer lists it.

**13.2 Category with courses is protected** (Window A)
- [ ] Edit `QA Web`. Toast: "Cannot update a category that has courses assigned to it".
- [ ] Delete `QA Web`. Toast: "Cannot delete a category that has courses assigned to it".

**13.3 Delete a course with no students**

Create a throwaway course `QA Delete Me` in `QA Web`, verify it as Admin, and write down: Home **Premium Courses**, the `QA Web` count, Admin **Total Courses**, Instructor **Total Courses**.

- [ ] Instructor: **All My Courses** → trash icon (**Delete Course**) → confirm. ⚡ The course disappears. Instructor **Dashboard** Total Courses is −1.
- [ ] Admin (F5) 🔄: **Dashboard** Total Courses −1. **Verified Courses** no longer lists it.
- [ ] Public (F5) 🔄: Premium Courses −1. `/courses` no longer lists it. The direct URL shows not found. The `QA Web` count is −1.

**13.4 Course with students is protected**
- [ ] Instructor tries to delete `QA Course A (Edited)` (Student 1 is enrolled). Toast: "Cannot delete course because students are enrolled in it". The course stays.

**13.5 Course with a refunded purchase (watch for crashes)**
- [ ] Create `QA Delete Me 2`, verify it, let Student 2 buy it and refund it, then the Instructor deletes it.
- [ ] Open Student 2, Instructor and Admin **Transactions** and the transaction detail page. They must **not** crash or show the error screen. If they do, report it.

---

## Flow 14 — Session expiry and sign-out

**14.1 Token rotation** (any signed-in window)
- [ ] DevTools → Application → Cookies: delete only `accessToken`, keep `refreshToken`.
- [ ] Click any sidebar link. You stay signed in and a new `accessToken` cookie appears.

**14.2 Role redirect after rotation** (Admin window)
- [ ] Delete `accessToken` again, then open `/instructor/dashboard`. You land on `/admin/dashboard`.

**14.3 Full expiry**
- [ ] Delete both cookies and click a sidebar link. You are sent to `/signin`.

**14.4 Sign-out**
- [ ] Click the sign-out icon at the bottom of the sidebar. You land on `/signin`.
- [ ] Local Storage `currentUser` is gone. Cookies are cleared.
- [ ] Press the browser **Back** button. You are not shown the dashboard.

---

## Appendix A — Quick reference: action → what must update

⚡ = the person who did it. 🔄 = everyone else (after reload). "Public" = Home, `/courses`, public course page.

| Action | Must update |
| --- | --- |
| Instructor signs up | Admin: Pending Verifications, All Instructors, Dashboard Total Instructors and Recent Users |
| Student signs up | Admin: Students, Dashboard Total Students and Recent Users |
| Student verifies OTP | Admin: Students, Recent Users (verified) |
| Admin verifies instructor | Pending list (row gone), All Instructors, Instructor Details, Admin Recent Users, public instructor filter |
| Create course | Instructor: My Courses, Pending, Dashboard Total Courses. Admin: Pending, All Courses, Dashboard Total Courses. Home category count +1. **Not** public lists or Premium Courses |
| Verify or reject course | Admin lists. Instructor status, reason, dashboard verified flag. Public lists, Home Premium Courses, Featured, Trending. Course info in enrollments, transactions, reviews. **Not** Admin dashboard, **not** category count |
| Edit course | Instructor lists and details. Public cards and page, Featured, Trending. Course info in enrollments, transactions, reviews. Dashboards (titles) |
| Delete course | Instructor and Admin lists, dashboards (Total Courses), Premium Courses, category count, public pages, past transactions |
| Open checkout | Pending transaction in Student, Instructor, Admin transaction lists, and Student dashboard recent transactions |
| Payment succeeds | Enrollments, transactions (Paid), course student count, Trending and Featured, Home Active Students, all three dashboards, instructor and student lists, saved cards |
| Watch progress | Student: Continue Watching, dashboard, refund button. Instructor: dashboard avg completion. **Not** Admin dashboard |
| Create or delete review | Course rating and count everywhere (public, Featured, Trending, enrollments, transactions), review lists, all three dashboards |
| Edit review (rating) | Same as above |
| Edit review (text only) | Review lists, Instructor and Student dashboards (recent reviews). **Not** ratings |
| Get certificate | Enrollments filtered by Certificate issued |
| Refund | Reverse of payment: enrollments, transactions, revenue, student counts, reviews, dashboards, public counts |
| Profile edit (name/avatar) | Own top bar and Local Storage; every list that shows that person's name (see Flow 10) |
| Card add, default, delete | Cards list and checkout saved cards |
| Category create, edit, delete | Categories list, course form picker, Home top categories (create/delete). Edit and delete are blocked while courses use the category |

---

## Appendix B — Known behaviors (do not report as bugs)

- **Other people's browsers update on reload.** Inside one session, client-side navigation can show data up to a few minutes old. This is the browser's own short cache.
- **Webhook delay.** After payment or refund, the final status can take a few seconds.
- **Emails must be lowercase.** The backend looks up the email exactly as typed, so `John@x.com` can fail for `john@x.com`.
- **A rejected instructor stays in Pending Verifications.** The list filters on "not verified".
- **Chat and the notification bell are placeholders** (dummy data, not connected).
- **The password-reset OTP appears in the URL** of `/reset-password`.
- **Admin cannot delete reviews in the UI**, although the backend allows it.
- **`/view-course-reviews/<id>` needs sign-in**, so signed-out visitors cannot read reviews.

---

## Appendix C — Bug report template

```
Flow / step:
Who did the action (role):
Action:
Expected (which screen should have changed):
Actual:
Checked as: ⚡ (same person, no reload)  or  🔄 (other person)
Did a reload fix it?  yes / no
Browser console or network error:
Time of action (to match backend logs):
```
