import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CreateCourseSchema, PaginationSchema } from "@/lib/validation";
import {
  successResponse,
  errorResponse,
  NotFoundError,
  UnauthorizedError,
  calculateSkip,
  createPaginatedResponse,
} from "@/lib/api-utils";

/**
 * GET /api/courses
 * Get all courses with filtering, search, and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category");
    const difficulty = searchParams.get("difficulty");

    // Build where clause
    const where: any = {
      status: "PUBLISHED",
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { instructor: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    if (category && category !== "All") {
      where.category = category;
    }

    if (difficulty && difficulty !== "All") {
      where.difficulty = difficulty;
    }

    // Count total
    const total = await prisma.course.count({ where });

    // Get courses
    const courses = await prisma.course.findMany({
      where,
      skip: calculateSkip(page, limit),
      take: limit,
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedCourses = courses.map((course: any) => ({
      id: course.id,
      title: course.title,
      instructor: course.instructor.name,
      instructorId: course.instructor.id,
      category: course.category,
      difficulty: course.difficulty,
      rating: course.rating,
      students: course.studentsEnrolled,
      duration: course.duration,
      thumbnail: course.thumbnail,
      price: course.price,
    }));

    return NextResponse.json(
      successResponse(createPaginatedResponse(formattedCourses, total, page, limit))
    );
  } catch (error) {
    console.error("Get courses error:", error);
    return NextResponse.json(
      errorResponse("Failed to fetch courses"),
      { status: 500 }
    );
  }
}

/**
 * POST /api/courses
 * Create a new course (instructor only)
 */
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        errorResponse("Unauthorized"),
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate input
    const validation = CreateCourseSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        errorResponse(validation.error.errors[0].message),
        { status: 400 }
      );
    }

    const { title, description, category, difficulty, price, duration, highlights, requirements, whatYouLearn } =
      validation.data;

    // Create course
    const course = await prisma.course.create({
      data: {
        title,
        description,
        category,
        difficulty,
        price,
        duration,
        instructorId: userId,
        highlights: highlights || [],
        requirements: requirements || [],
        whatYouLearn: whatYouLearn || [],
        status: (validation.data.status as any) || "DRAFT",
      },
      include: {
        instructor: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(
      successResponse(
        {
          id: course.id,
          title: course.title,
          status: course.status,
          createdAt: course.createdAt,
        },
        "Course created successfully"
      ),
      { status: 201 }
    );
  } catch (error) {
    console.error("Create course error:", error);
    return NextResponse.json(
      errorResponse("Failed to create course"),
      { status: 500 }
    );
  }
}
