# 🚀 Quick Start Guide - Educify

## Get Started in 5 Minutes

### 1. Install Dependencies (1 minute)

```bash
cd c:\Users\avbha\OneDrive\Desktop\projects\educify
npm install
```

### 2. Setup Database (2 minutes)

```bash
# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma migrate dev

# Populate sample data
npm run prisma:seed
```

### 3. Start Development Server (1 minute)

```bash
npm run dev
```

### 4. Test the App (1 minute)

Open browser: http://localhost:3000

**Try the demo:**

- Visit: http://localhost:3000/auth/login
- Email: `student1@educify.com`
- Password: `student123`
- Click Login → See dashboard with real data!

---

## Key URLs

| Page           | URL                               | Purpose        |
| -------------- | --------------------------------- | -------------- |
| Home           | http://localhost:3000             | Landing page   |
| Sign Up        | http://localhost:3000/auth/signup | Create account |
| Login          | http://localhost:3000/auth/login  | Login          |
| Dashboard      | http://localhost:3000/dashboard   | User dashboard |
| Catalog        | http://localhost:3000/catalog     | Browse courses |
| Course Details | http://localhost:3000/course/[id] | Course info    |
| Profile        | http://localhost:3000/profile     | User profile   |

---

## Demo Accounts

### Instructor

- **Email:** instructor@educify.com
- **Password:** instructor123

### Student 1

- **Email:** student1@educify.com
- **Password:** student123

### Student 2

- **Email:** student2@educify.com
- **Password:** student456

---

## Important Files

### Frontend

| File                       | Purpose                               |
| -------------------------- | ------------------------------------- |
| `lib/api.ts`               | API client - use this to call backend |
| `lib/useAuth.ts`           | Auth hook - manage user state         |
| `lib/useCourses.ts`        | Course hook - manage courses          |
| `app/auth/signup/page.tsx` | Signup page                           |
| `app/auth/login/page.tsx`  | Login page                            |
| `app/dashboard/page.tsx`   | Dashboard page (fetches real data)    |

### Backend

| File                   | Purpose               |
| ---------------------- | --------------------- |
| `app/api/auth/`        | Authentication routes |
| `app/api/courses/`     | Course routes         |
| `app/api/users/`       | User routes           |
| `middleware.ts`        | Route protection      |
| `lib/auth.ts`          | JWT utilities         |
| `prisma/schema.prisma` | Database schema       |

---

## How to Use the API Client

### In Your Components

```typescript
"use client";
import { useAuth } from "@/lib/useAuth";
import { courseApi } from "@/lib/api";

export function MyComponent() {
  // Get current user
  const { user, isAuthenticated, login, logout } = useAuth();

  // Use API
  const courses = await courseApi.listCourses({ page: 1 });

  return <div>Hello {user?.name}</div>;
}
```

### Direct API Calls

```typescript
import { authApi, courseApi, userApi } from "@/lib/api";

// Signup
const response = await authApi.signup({
  email: "user@example.com",
  password: "password123",
  confirmPassword: "password123",
  fullName: "John Doe",
});

// Get courses
const { data, pagination } = await courseApi.listCourses({
  page: 1,
  limit: 10,
  search: "React",
});

// Get dashboard
const dashboard = await userApi.getDashboard(userId);
console.log(dashboard.stats); // { activeCourses, totalHours, etc. }
```

---

## Common Tasks

### Add Authentication to a Page

```typescript
"use client";
import { useAuth } from "@/lib/useAuth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MyPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated]);

  return <div>Protected page - Hello {user?.name}</div>;
}
```

### Fetch Courses

```typescript
"use client";
import { useState, useEffect } from "react";
import { courseApi } from "@/lib/api";

export default function CoursesList() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await courseApi.listCourses({ page: 1 });
        setCourses(response.data);
      } catch (error) {
        console.error("Failed to fetch:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {courses.map((course) => (
        <div key={course.id}>{course.title}</div>
      ))}
    </div>
  );
}
```

### Enroll in a Course

```typescript
import { enrollmentApi } from "@/lib/api";

const handleEnroll = async (courseId: string) => {
  try {
    const enrollment = await enrollmentApi.enroll(courseId);
    console.log("Enrolled:", enrollment);
  } catch (error) {
    console.error("Enrollment failed:", error);
  }
};
```

---

## Environment Variables

Create `.env.local`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/educify"

# JWT
JWT_SECRET="your-super-secret-key-change-me"
JWT_EXPIRES_IN="7d"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Optional: Supabase for file uploads
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Optional: Google OAuth
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

---

## Troubleshooting

### Error: "Cannot find module '@prisma/client'"

```bash
npm install
npx prisma generate
```

### Error: "Unauthorized" on API calls

1. Make sure you're logged in
2. Check `.env.local` JWT_SECRET matches backend
3. Clear browser cookies and login again

### Error: "Database connection failed"

1. Make sure PostgreSQL is running
2. Check DATABASE_URL in `.env.local`
3. Run: `npx prisma db push`

### Dashboard shows "Loading..." forever

1. Check browser console for errors
2. Make sure you're logged in
3. Check network tab for API failures
4. Verify backend is running

### Form won't submit

1. Check form validation messages
2. Make sure passwords match
3. Check browser console for errors
4. Verify API endpoint is correct

---

## API Response Format

All API responses follow this format:

### Success

```json
{
  "success": true,
  "data": {
    /* actual data */
  },
  "message": "Operation successful"
}
```

### Error

```json
{
  "success": false,
  "data": null,
  "message": "Error description"
}
```

---

## Common API Endpoints

### GET /api/courses

List all published courses

```typescript
const response = await courseApi.listCourses({
  page: 1,
  limit: 10,
  search: "React",
  category: "WEB_DEVELOPMENT",
});
```

### POST /api/enrollments

Enroll in a course

```typescript
const enrollment = await enrollmentApi.enroll(courseId);
```

### GET /api/users/[id]/dashboard

Get user dashboard

```typescript
const dashboard = await userApi.getDashboard(userId);
console.log(dashboard.stats.activeCourses);
console.log(dashboard.enrolledCourses);
console.log(dashboard.recommendedCourses);
```

### GET /api/wishlist

Get user's wishlist

```typescript
const wishlist = await wishlistApi.getWishlist();
```

---

## Building for Production

### 1. Build

```bash
npm run build
```

### 2. Start Production Server

```bash
npm start
```

### 3. Set Production Environment

```env
JWT_SECRET="generate-a-random-secure-string"
NODE_ENV="production"
# ... other vars
```

---

## What Was Built

✅ **27 API Endpoints** - Full CRUD for courses, enrollments, users, etc.
✅ **Frontend API Client** - Type-safe API calls with full TypeScript
✅ **Authentication** - Bcrypt + JWT, HttpOnly cookies
✅ **Auth Pages** - Beautiful signup & login forms
✅ **Dynamic Dashboard** - Pulls real data from API
✅ **State Management** - React hooks for auth and courses
✅ **Database** - PostgreSQL with Prisma ORM
✅ **Documentation** - Complete setup and API docs

---

## Next Steps

1. ✅ Install dependencies
2. ✅ Setup database
3. ✅ Start dev server
4. ✅ Test login
5. ⭐ Extend with more features
6. ⭐ Deploy to production

---

## Documentation Files

| File                      | Purpose                                  |
| ------------------------- | ---------------------------------------- |
| `BACKEND_SETUP.md`        | Complete backend setup and API reference |
| `INTEGRATION_COMPLETE.md` | Integration summary and architecture     |
| `FILE_INVENTORY.md`       | Detailed file inventory                  |
| `COMPLETION_CHECKLIST.md` | Complete feature checklist               |
| `QUICK_START.md`          | This file!                               |

---

## Getting Help

1. Check the documentation files
2. Review console errors
3. Check network tab in DevTools
4. Look at database with: `npx prisma studio`
5. Check seed data: `npm run prisma:seed`

---

**You're all set! Happy coding! 🚀**

Questions? Check the documentation files or review the code comments.
