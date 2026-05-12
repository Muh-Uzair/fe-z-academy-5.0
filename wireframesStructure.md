# Z-Academy 5.0 - UI/UX Design System & Layout Structure

## 1. Overall Layout Philosophy

- The application follows a **clean, modern, and minimal** design.
- All pages will use a **fixed left sidebar** navigation.
- Main content area will have consistent spacing.
- Desktop padding: **40px** on all sides for the main content area.
- Mobile padding: **12px** on all sides.
- Some pages (especially Course Detail Page) will have a **maximum width of 1200px** and will be centered.

---

## 2. Layout Types (Wireframe Based)

### A. Course Browsing / Dashboard Layout (Grid View)
- Left Sidebar (Logo + Navigation Menu)
- Top: Page Heading + short description
- Main Content Area:
  - Responsive **Grid of Course Cards** (typically 3-4 columns on desktop)
  - Each card contains: Thumbnail, Title, Instructor Name, Rating, Price, Level
- Bottom area may contain pagination if needed.

### B. List / Table View Layout
- Left Sidebar (Logo + Navigation)
- Top: Page Heading
- Main Content: **Table/List View**
- Used for: My Courses (Instructor), Enrolled Courses (Student), All Users (Admin), All Courses (Admin), etc.
- Table will have proper columns with actions.

### C. Compact / Mobile-friendly Vertical Layout
- Same sidebar + stacked vertical cards
- Used for smaller sections or mobile-first views.

---

## 3. Component Guidelines

### Cards:
- Course cards are the primary component.
- Rounded corners, subtle shadow, clean thumbnail on top.
- Information inside: Title, Instructor, Rating (stars), Price, Category/Level badge.

### Small Info Cards / Stats:
- Used in dashboards for quick analytics (Total Courses, Total Students, Revenue, etc.).
- Small rectangular cards with icon, number, and label.

### Tables:
- Clean, bordered or borderless tables.
- Hover effects on rows.
- Action buttons (Edit, View, Delete, Approve, Ban) in the last column.

### Tabs:
- Will be used where multiple sections exist under one page (e.g. Course Detail: Overview | Curriculum | Reviews | Chat).

---

## 4. Spacing & Constraints

- **Desktop Main Content Padding**: `padding: 40px`
- **Mobile Main Content Padding**: `padding: 12px`
- **Max Width** for content-heavy pages (Course Detail, etc.): **1200px**, centered on large screens.
- Consistent gap between elements (16px ~ 24px).
- Sidebar width should remain fixed (approx 260px–280px).

---

## 5. Page Structure Summary (Based on Wireframes)

1. **Home / Course Listing Page**
   - Grid of course cards (3–4 per row)

2. **Dashboard Pages** (Student, Instructor, Admin)
   - Stats small cards on top
   - Charts section
   - Recent activity / My Courses grid or table below

3. **Management Pages** (Admin & Instructor)
   - Table view with search/filter bar on top

4. **Course Detail Page**
   - Max-width 1200px
   - Large hero/thumbnail
   - Tabs for different sections
   - Sidebar or section for pricing & enroll button

5. **Course Player Page**
   - Video player as main focus
   - Right or bottom section for course content list + chat

---

## 6. Design Tokens (To be followed)

- Consistent border radius for cards and buttons
- Subtle shadows for depth
- Primary color scheme (to be finalized)
- Typography scale (Heading 1, 2, 3, Body, Caption)

---

**Note for Frontend Developer / Codex:**
Please follow the 40px desktop padding strictly for main content area. All layouts must be responsive. Course browsing pages should prioritize **Grid View**, while management and data-heavy pages should use **Table View**.

---

Bhai yeh file bohot clear aur structured hai. Codex isko asani se samajh kar UI generate kar sakega.

---

**Ab aap batao:**

Kya isme kuch add ya change karna hai?  
Ya is file ko final kar ke agla step (jaise specific page ka detailed breakdown) shuru karen?