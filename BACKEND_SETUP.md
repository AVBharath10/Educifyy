# Educify Backend Setup & API Documentation

This document provides complete setup instructions and API documentation for the Educify backend.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Database Setup](#database-setup)
4. [Running the Backend](#running-the-backend)
5. [API Documentation](#api-documentation)
6. [File Structure](#file-structure)

---

## Prerequisites

- Node.js 18+ and npm/pnpm
- PostgreSQL 12+ database
- Supabase account (for file storage) - optional but recommended

## Environment Setup

### 1. Install Dependencies

```bash
npm install
# or
pnpm install
```

This installs:

- `@prisma/client` - ORM for database
- `argon2` - Password hashing
- `jsonwebtoken` - JWT authentication
- `@supabase/supabase-js` - File storage
- `zod` - Request validation

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/educify"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Supabase (for file uploads)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
NEXT_PUBLIC_GOOGLE_CALLBACK_URL="http://localhost:3000/api/auth/google/callback"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Setup PostgreSQL Database

```bash
# Create database
createdb educify

# Or if using Docker:
docker run --name educify-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=educify \
  -p 5432:5432 \
  -d postgres:15
```

---

## Database Setup

### 1. Generate Prisma Client

```bash
npm run prisma:generate
```

### 2. Run Migrations

```bash
npm run prisma:migrate

# When prompted, name the migration (e.g., "init")
```

This creates all database tables based on the schema in `prisma/schema.prisma`.

### 3. Seed Sample Data

```bash
npm run prisma:seed
```

This creates:

- 1 instructor account (instructor@educify.com / instructor123)
- 2 student accounts (student1@educify.com / student123, student2@educify.com / student456)
- 2 published courses with modules and lessons
- Sample enrollments, wishlist items, and reviews

---

## Running the Backend

### Development Mode

```bash
npm run dev
```

The server starts at `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

---

## API Documentation

### Authentication Routes

#### POST /api/auth/signup

Create a new user account

**Request:**

```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "confirmPassword": "SecurePass123",
  "fullName": "John Doe"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "jwt-token"
  },
  "message": "Signup successful"
}
```

#### POST /api/auth/login

Authenticate user

**Request:**

```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "rememberMe": false
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "name": "John Doe",
      "avatar": null,
      "role": "STUDENT"
    },
    "token": "jwt-token"
  },
  "message": "Login successful"
}
```

#### POST /api/auth/logout

Logout (clears auth cookie)

**Response (200):**

```json
{
  "success": true,
  "data": null,
  "message": "Logout successful"
}
```

---

### Courses Routes

#### GET /api/courses

List all published courses (with filtering)

**Query Parameters:**

- `page` (number, default: 1) - Pagination page
- `limit` (number, default: 10) - Results per page
- `search` (string) - Search by title or instructor
- `category` (string) - Filter by category
- `difficulty` (string) - Filter by difficulty

**Example:**

```
GET /api/courses?page=1&limit=10&category=WEB_DEVELOPMENT&search=react
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "course-id",
        "title": "Advanced React Patterns",
        "instructor": "Alex Turner",
        "instructorId": "instructor-id",
        "category": "WEB_DEVELOPMENT",
        "difficulty": "ADVANCED",
        "rating": 4.9,
        "students": 2543,
        "duration": "12 weeks",
        "price": 99.99,
        "thumbnail": "url"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 150,
      "pages": 15
    }
  }
}
```

#### POST /api/courses

Create a new course (instructor only)

**Request:**

```json
{
  "title": "Course Title",
  "description": "Detailed description...",
  "category": "WEB_DEVELOPMENT",
  "difficulty": "INTERMEDIATE",
  "price": 79.99,
  "duration": "8 weeks",
  "highlights": ["Feature 1", "Feature 2"],
  "requirements": ["Prerequisite 1"],
  "whatYouLearn": ["Learning outcome 1"]
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "course-id",
    "title": "Course Title",
    "status": "DRAFT",
    "createdAt": "2024-11-15T10:30:00Z"
  },
  "message": "Course created successfully"
}
```

#### GET /api/courses/[id]

Get course details

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "course-id",
    "title": "Advanced React Patterns",
    "description": "...",
    "price": 99.99,
    "category": "WEB_DEVELOPMENT",
    "difficulty": "ADVANCED",
    "rating": 4.9,
    "students": 2543,
    "duration": "12 weeks",
    "thumbnail": "url",
    "instructor": {
      "id": "instructor-id",
      "name": "Alex Turner",
      "bio": "...",
      "avatar": "url"
    },
    "highlights": ["Pattern 1", "Pattern 2"],
    "requirements": ["Requirement 1"],
    "whatYouLearn": ["Learning outcome 1"],
    "features": ["Lifetime access"],
    "lessons": [
      {
        "id": "lesson-id",
        "title": "Lesson Title",
        "duration": "45 min",
        "order": 1
      }
    ],
    "modules": [
      {
        "id": "module-id",
        "title": "Module Title",
        "type": "VIDEO",
        "url": "video-url",
        "fileName": "lesson.mp4",
        "duration": "45 min",
        "order": 1
      }
    ]
  }
}
```

#### PUT /api/courses/[id]

Update course (instructor only)

**Request:**

```json
{
  "title": "Updated Title",
  "price": 89.99
}
```

#### DELETE /api/courses/[id]

Delete course (instructor only)

#### POST /api/courses/[id]/modules

Add module to course

**Request:**

```json
{
  "title": "Video Module",
  "type": "VIDEO",
  "url": "https://example.com/video.mp4",
  "fileName": "video.mp4",
  "duration": "45 min",
  "order": 1
}
```

---

### Enrollment Routes

#### POST /api/enrollments

Enroll in a course

**Request:**

```json
{
  "courseId": "course-id"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "enrollment-id",
    "userId": "user-id",
    "courseId": "course-id",
    "progress": 0,
    "lastAccessed": null,
    "enrolledAt": "2024-11-15T10:30:00Z",
    "course": {
      "id": "course-id",
      "title": "Course Title"
    }
  },
  "message": "Enrolled successfully"
}
```

#### GET /api/enrollments/[courseId]

Check enrollment status

**Response (200):**

```json
{
  "success": true,
  "data": {
    "enrolled": true,
    "enrollment": {
      "id": "enrollment-id",
      "userId": "user-id",
      "courseId": "course-id",
      "progress": 65,
      "status": "ACTIVE"
    }
  }
}
```

#### GET /api/users/[id]/enrollments

Get user's enrolled courses

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "enrollment-id",
      "courseId": "course-id",
      "course": {
        "id": "course-id",
        "title": "Course Title",
        "instructor": "Instructor Name",
        "category": "WEB_DEVELOPMENT",
        "difficulty": "ADVANCED",
        "duration": "12 weeks",
        "price": 99.99
      },
      "progress": 65,
      "lastAccessed": "2024-11-15T10:30:00Z",
      "enrolledAt": "2024-11-10T10:30:00Z",
      "status": "ACTIVE"
    }
  ]
}
```

---

### Wishlist Routes

#### GET /api/wishlist

Get user's wishlist

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "wishlist-id",
      "courseId": "course-id",
      "course": {
        "id": "course-id",
        "title": "Course Title",
        "instructor": "Instructor Name",
        "category": "WEB_DEVELOPMENT",
        "difficulty": "INTERMEDIATE",
        "rating": 4.8,
        "students": 3201,
        "duration": "10 weeks",
        "price": 79.99,
        "thumbnail": "url"
      },
      "addedAt": "2024-11-15T10:30:00Z"
    }
  ]
}
```

#### POST /api/wishlist

Add to wishlist

**Request:**

```json
{
  "courseId": "course-id"
}
```

#### GET /api/wishlist/[courseId]

Check if course in wishlist

**Response (200):**

```json
{
  "success": true,
  "data": {
    "inWishlist": true
  }
}
```

#### DELETE /api/wishlist/[courseId]

Remove from wishlist

---

### User Routes

#### GET /api/users/[id]

Get user profile

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1 (555) 123-4567",
    "location": "San Francisco, CA",
    "bio": "Passionate learner...",
    "avatar": "url",
    "joinDate": "2024-01-15T00:00:00Z",
    "role": "STUDENT",
    "coursesEnrolled": 12,
    "certificatesEarned": 3,
    "totalHours": 145
  }
}
```

#### PUT /api/users/[id]

Update profile (multipart form data)

**Request:**

```
Content-Type: multipart/form-data

name: "John Updated"
email: "newemail@example.com"
phone: "+1 (555) 987-6543"
location: "New York, NY"
bio: "Updated bio..."
avatar: [file]
```

#### GET /api/users/[id]/preferences

Get notification preferences

**Response (200):**

```json
{
  "success": true,
  "data": {
    "emailNotifications": true,
    "marketingEmails": false,
    "courseRecommendations": true
  }
}
```

#### PUT /api/users/[id]/preferences

Update preferences

**Request:**

```json
{
  "emailNotifications": true,
  "marketingEmails": false,
  "courseRecommendations": true
}
```

#### GET /api/users/[id]/statistics

Get learning statistics

**Response (200):**

```json
{
  "success": true,
  "data": {
    "totalCoursesEnrolled": 12,
    "completedCourses": 2,
    "currentStreak": 12,
    "totalHoursSpent": 145,
    "certificatesEarned": 3,
    "averageRating": 4.8
  }
}
```

#### GET /api/users/[id]/dashboard

Get dashboard data

**Response (200):**

```json
{
  "success": true,
  "data": {
    "stats": {
      "activeCourses": 3,
      "totalHours": 145,
      "completedCourses": 2,
      "currentStreak": 12
    },
    "enrolledCourses": [
      {
        "id": "enrollment-id",
        "courseId": "course-id",
        "course": {
          /* course object */
        },
        "progress": 65,
        "lastAccessed": "2024-11-15T10:30:00Z"
      }
    ],
    "recommendedCourses": [
      {
        /* course objects */
      }
    ]
  }
}
```

---

### Search & Recommendations Routes

#### GET /api/search/courses

Search courses

**Query Parameters:**

- `q` (string) - Search query
- `limit` (number, default: 10) - Max results

**Example:**

```
GET /api/search/courses?q=react&limit=10
```

#### GET /api/recommendations

Get course recommendations

**Query Parameters:**

- `limit` (number, default: 3) - Max results

---

### File Upload Routes

#### POST /api/upload

Upload files (thumbnail, video, document)

**Request:**

```
Content-Type: multipart/form-data

file: [file]
type: "thumbnail" | "video" | "document"
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "url": "/uploads/thumbnail/1234567890-image.jpg",
    "fileName": "image.jpg",
    "size": 524288,
    "type": "image/jpeg"
  },
  "message": "File uploaded successfully"
}
```

#### PUT /api/upload/presign

Generate presigned URL for direct upload

**Request:**

```json
{
  "fileName": "video.mp4",
  "type": "video",
  "fileType": "video/mp4"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "presignedUrl": "https://storage.example.com/presign?token=...",
    "path": "video/1234567890-video.mp4",
    "expiresIn": 3600
  }
}
```

---

## File Structure

```
educify/
├── app/
│   └── api/
│       ├── auth/
│       │   ├── signup/route.ts
│       │   ├── login/route.ts
│       │   ├── logout/route.ts
│       │   └── google/route.ts
│       ├── courses/
│       │   ├── route.ts (GET list, POST create)
│       │   ├── [id]/
│       │   │   ├── route.ts (GET, PUT, DELETE)
│       │   │   └── modules/route.ts (POST)
│       ├── enrollments/
│       │   └── route.ts (POST, GET check)
│       ├── users/
│       │   └── [id]/
│       │       ├── route.ts (GET, PUT)
│       │       ├── enrollments/route.ts
│       │       ├── preferences/route.ts
│       │       ├── statistics/route.ts
│       │       └── dashboard/route.ts
│       ├── wishlist/
│       │   ├── route.ts (GET, POST)
│       │   └── [courseId]/route.ts (GET, DELETE)
│       ├── search/
│       │   └── courses/route.ts
│       ├── recommendations/route.ts
│       └── upload/route.ts
├── lib/
│   ├── prisma.ts (DB client)
│   ├── auth.ts (JWT helpers)
│   ├── storage.ts (File upload helpers)
│   ├── api-utils.ts (Response utilities)
│   └── validation.ts (Zod schemas)
├── prisma/
│   ├── schema.prisma (Database schema)
│   └── seed.js (Sample data)
├── middleware.ts (Authentication)
└── .env.local (Environment variables)
```

---

## Authentication Flow

1. **Signup/Login**: User provides credentials → JWT token generated → Token stored in HttpOnly cookie
2. **Middleware**: Every request checked for valid token → User ID added to request headers
3. **API Routes**: User ID extracted from headers → Authorization checks performed
4. **Logout**: Auth cookie cleared on client

---

## Security Considerations

✅ **Implemented:**

- HttpOnly cookies prevent XSS attacks
- JWT tokens with expiration
- Password hashing with Argon2
- Input validation with Zod
- CORS protection
- Authorization checks on protected routes

**Production Checklist:**

- [ ] Update `JWT_SECRET` to strong random value
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Setup rate limiting
- [ ] Enable request logging
- [ ] Configure Supabase buckets
- [ ] Setup email verification
- [ ] Implement 2FA

---

## Troubleshooting

### Database Connection Error

```
Error: P1000 - Authentication failed against database server
```

**Solution**: Check `DATABASE_URL` in `.env.local`

### Prisma Schema Issues

```bash
# Regenerate client
npm run prisma:generate

# Reset database
npx prisma migrate reset
```

### JWT Token Invalid

```
Error: Invalid token
```

**Solution**: Ensure `JWT_SECRET` matches between sessions

---

## Performance Tips

- Add database indexes on frequently queried fields
- Implement caching for course listings
- Use pagination for large datasets
- Compress uploaded files
- Monitor API response times

---

## Next Steps

1. Configure Supabase for production file uploads
2. Setup email service for notifications
3. Implement admin dashboard
4. Add payment processing (Stripe)
5. Setup monitoring and logging
6. Configure CI/CD pipeline

---

## Support

For API issues or questions, check:

- Response status codes (400, 401, 403, 404, 500)
- Error messages in response body
- Console logs in development mode
- Database logs in Prisma Studio: `npx prisma studio`
