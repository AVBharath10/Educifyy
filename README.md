# Educify

Educify is a comprehensive Learning Management System (LMS) designed to facilitate online education for students, instructors, and administrators. It provides a robust platform for course creation, enrollment, progress tracking, and interactive learning.

## Features

-   **User Roles & Authentication**:
    -   Secure authentication system.
    -   Distinct roles: **Student**, **Instructor**, and **Admin**.
-   **Course Management**:
    -   Instructors can **create, edit, and publish courses**.
    -   Support for rich media content including **video modules, documents, and text lessons**.
    -   Course categorization and difficulty levels.
-   **Student Experience**:
    -   **Enroll** in courses and track learning progress.
    -   **Wishlist** functionality to save courses for later.
    -   Submit **reviews and ratings** for courses.
    -   Earn **certificates** upon course completion.
-   **Dashboard & Analytics**:
    -   Personalized dashboards for students and instructors to track activities.

## Tech Stack

-   **Frontend**: [Next.js](https://nextjs.org/) (React framework), [Tailwind CSS](https://tailwindcss.com/)
-   **Backend**: Next.js Server Actions / API Routes
-   **Database**: [PostgreSQL](https://www.postgresql.org/) (via [Supabase](https://supabase.com/))
-   **ORM**: [Prisma](https://www.prisma.io/)
-   **Storage**: AWS S3 (for course assets like videos and thumbnails)
-   **Authentication**: Custom implementation (bcrypt, jose)

## Getting Started

Follow these steps to set up the project locally.

### Prerequisites

-   Node.js (LTS version recommended)
-   npm or yarn
-   PostgreSQL database (or a Supabase project)
-   AWS S3 Bucket credentials

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/AVBharath10/Educifyy.git
    cd Educifyy
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Environment Setup:**

    Create a `.env` file in the root directory and add the following variables:

    ```env
    DATABASE_URL="postgresql://user:password@host:port/database?schema=public"
    # Add other necessary variables for JWT, AWS S3, etc.
    JWT_SECRET="your_jwt_secret"
    AWS_ACCESS_KEY_ID="your_aws_key"
    AWS_SECRET_ACCESS_KEY="your_aws_secret"
    AWS_REGION="your_aws_region"
    AWS_BUCKET_NAME="your_bucket_name"
    ```

4.  **Database Setup:**

    Push the Prisma schema to your database:

    ```bash
    npx prisma generate
    npx prisma db push
    ```

    *(Optional) Seed the database:*
    ```bash
    npm run prisma:seed
    ```

5.  **Run the Development Server:**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Scripts

-   `npm run dev`: Starts the development server.
-   `npm run build`: Builds the application for production.
-   `npm start`: Starts the production server.
-   `npm run lint`: Runs ESLint.
-   `npm run prisma:generate`: Generates the Prisma client.
-   `npm run prisma:migrate`: Runs Prisma migrations.
-   `npm run db:push`: Pushes schema changes to the database.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
