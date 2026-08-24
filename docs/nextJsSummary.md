# Next.js 16 — Short Summary (Z-Academy Context)

Yeh summary Next.js ke tamaam ahem concepts ko asaan Roman Urdu mein, aur Z-Academy ke hawale (context) se bayan karti hai.

### 1. Layouts & Pages

1. **`page.tsx`:** Har route/URL ka main UI hota hai. Ek folder mein ek hi `page.tsx` hota hai.
2. **`layout.tsx`:** Yeh shared wrapper hota hai (jaise Navbar ya Sidebar ke liye). Jab user ek page se doosre page par jata hai, toh Layout dubara render nahi hota (is se app fast rehti hai).
3. **Nesting:** Layouts aur pages nest (ek ke andar ek) ho sakte hain.
4. **Root Layout:** `app/layout.tsx` poori app ka baap (root) hai. Isme `<html>` aur `<body>` tags zaroori hain.
5. **`<Link>` vs `router.push()`:** Navigation ke liye hamesha Next.js ka `<Link>` component use karo kyunke yeh agle page ka data background mein pehle se download (prefetch) kar leta hai. `router.push` sirf tab use karo jab `<Link>` use karna mumkin na ho (jaise kisi function ke andar).

### 2. Server & Client Components

1. **Default Behavior:** Next.js mein har component by default Server Component hota hai.
2. **Client Components:** Agar tumhe kisi component mein `useState`, `useEffect`, `onClick` ya browser ki koi cheez (jaise `window`) use karni hai, toh file ke top par `'use client'` likhna zaroori hai.
3. **Z-Academy Rule of Thumb:** Koshish karo ke API fetching aur heavy logic Server Components (`page.tsx`) mein ho, aur wahan se data as props Client Components (jaise interactive tables ya forms) ko bhej do.
4. **Interleaving:** Ek Server Component ko Client Component ke andar directly import mat karo. Balke usay `{children}` ke zariye pass karo taake woh Server Component hi rahe.
5. **`server-only`:** Agar kisi file mein database keys hain, toh top par `import 'server-only'` likh do taake ghalti se bhi woh Client side par leak na ho jaye.

### 3. Fetching Data

1. **Server Components mein Fetching:** Hamesha koshish karo ke API (Express) ko Server Components mein hi call karo. Iske liye seedha `async/await` aur `fetch()` use hota hai.
2. **Memoization:** Agar Next.js mein ek hi API ek page par 3 alag components mein fetch ho rahi ho, toh Next.js server par sirf 1 dafa call jati hai (Duplicate calls ruk jati hain).
3. **Streaming (`loading.tsx` aur `<Suspense>`):** Agar Express se data aane mein time lag raha ho toh poori app ko freeze hone se bachane ke liye "Streaming" use hoti hai.
   - `loading.tsx`: Poore page ko block karne ki bajaye full-page skeleton dikhata hai.
   - `<Suspense>`: Page ke kisi makhsoos (specific) hisse pe skeleton dikhata hai (jaise sirf Table par), jabke page ka Title/Header fauran nazar aa jata hai.
4. **Sequential vs Parallel Fetching:**
   - Sequential (Slow): Ek ke baad ek fetch likhna.
   - Parallel (Fast): Agar APIs aapas mein depend nahi kartin, toh hamesha `Promise.all` use karo taake dono requests ek sath chalein.
5. **React.cache:** Agar ORM use kar rahe ho toh `cache()` lagana parta hai, lekin hum `fetch` API use kar rahe hain toh Next.js yeh automatically kar deta hai.

### 4. Mutating Data (Server Actions)

1. **Server Actions Kya Hain?** Yeh aise `async` functions hain jo sirf server par chalte hain lekin Client Components se seedha call kiye ja sakte hain (jaise form submit par). Inhe `'use server'` se mark kiya jata hai.
2. **Z-Academy Structure:** `services/courses/mutations.ts` mein `'use server'` likh kar Express par POST/PUT/DELETE ki requests maro.
3. **Form Handling:** Zod se client par validation karo, aur sahi data milne par Server Action ko bhej do.
4. **Pending State:** Button ko loading state mein dikhane ke liye `useTransition` ka `isPending` use karo.
5. **Search Query Problem:** Client component mein search hone par `useState` ki bajaye URL update karo (`router.push('?search=React')`). Server component ko `searchParams` prop mein yeh mil jayega aur woh nayi API call kar lega.

### 5. Caching & Revalidating

1. **Golden Rule:** Jo data sab ke liye same hai (All Courses), usay Next.js server pe cache karo. Jo data user-specific hai (My Profile), usay private cache karo ya har baar fresh mangwao.
2. **`'use cache'` aur Tags:** Global data fetch karte waqt `'use cache'` lagao aur usay ek naam (tag) de do (`cacheTag('courses')`).
3. **Revalidation (Cache Update):** Jab koi form submit ho aur data change ho jaye:
   - `updateTag('courses')`: Fauran cache urra do (User ko apna naya data fauran dikhega).
   - `revalidateTag('courses')`: Background mein cache refresh hoga (Slight delay OK ho tab).
   - `revalidatePath('/courses')`: Jab tag yaad na ho toh poore page ka cache clear kar do.
4. **`'use cache: private'`:** Yeh data ko server ki bajaye makhsoos user ke browser mein cache karta hai (Security ke liye best).

### 6. Error Handling

1. **Expected Errors (Mutations):** Agar form submit karte waqt koi masla aaye, toh `throw` mat karo. Balke ek error message return kar do (`return { error: 'Failed' }`) aur UI mein dikha do.
2. **Uncaught Exceptions (Crash):** Agar achanak koi bara error aa jaye, toh Next.js poori app band nahi karta agar tumne `error.tsx` file banai ho. Yeh fallback UI dikhata hai.
3. **`error.tsx` Rules:** Yeh lazmi `'use client'` hona chahiye. Isme `retry()` ka function milta hai taake user dobara try kar sake.
4. **404 Errors:** Agar data (jaise ID) na mile, toh `notFound()` call karo, jisse `not-found.tsx` wala page chal jayega.

### 7. Proxy (Middleware)

1. **Darban (Guard):** Proxy (`src/proxy.ts`) ek guard ki tarah hai jo har page load hone se pehle chalta hai.
2. **Z-Academy Use Case:** Iska sabse ahem kaam yeh check karna hai ke user ke paas Token (Cookie) hai ya nahi. Agar nahi hai aur woh `/admin` par jana chahta hai, toh Proxy usay fauran `/signin` par redirect kar dega.
3. **Important Note:** Proxy mein kabhi Express se data fetch karne ki koshish mat karo. Yeh sirf headers, cookies, aur URLs check karne ke liye hai.

### 8. Image, Font & CSS

1. **Images:** HTML ke `<img>` ki bajaye Next.js ka `<Image>` tag use karo. Yeh images ko WebP mein convert karke optimize karta hai aur lazy loading deta hai.
   - **S3 Images:** AWS S3 ke URLs use karne ke liye unhe `next.config.ts` mein allow (whitelist) karna zaroori hai.
2. **S3 Upload Flow:** Client se Express ko bolo "Mujhe Presigned URL do", phir Client se seedha S3 par upload karo, aur aakhir mein S3 ka URL Server Action ke zariye Express ko bhej do.
3. **Fonts:** `next/font/google` use karo. Yeh fonts ko server par rakh leta hai taake loading fast ho. Ise Root Layout mein laga do.
4. **CSS:** Z-Academy mein Tailwind CSS best hai. CSS ki order bohot matter karti hai, isliye imports ka khayal rakho.

### 9. Route Handlers & Metadata

1. **Route Handlers:** Yeh Next.js ki apni APIs hoti hain (`app/api/route.ts`). Z-Academy mein inki zaroorat kam paregi kyunke Express server pehle se mojood hai. Yeh Stripe webhooks wagera ke liye use hote hain.
2. **Metadata:** Har page ke liye `title` aur `description` lazmi do (SEO ke liye).
   - Static: `export const metadata = { title: 'Z-Academy' }`
   - Dynamic (jaise course details): `generateMetadata` function use karo.
3. **OG Images:** `opengraph-image.jpg` rakh do taake social media par link share karne par image nazar aaye.
