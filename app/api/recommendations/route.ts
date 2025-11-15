import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-utils";

/**
 * GET /api/recommendations
 * Get recommended courses for user
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    const { searchParams } = request.nextUrl;
    const limit = parseInt(searchParams.get("limit") || "3");

    // If no user, return top rated courses
    if (!userId) {
      const topRated = await prisma.course.findMany({
        where: { status: "PUBLISHED" },
        take: limit,
        orderBy: { rating: "desc" },
        include: {
          instructor: {
            select: {
              name: true,
            },
          },
        },
      });

      const formatted = topRated.map((course: any) => ({
        id: course.id,
        title: course.title,
        instructor: course.instructor.name,
        category: course.category,
        difficulty: course.difficulty,
        rating: course.rating,
        students: course.studentsEnrolled,
        duration: course.duration,
        price: course.price,
        thumbnail: course.thumbnail,
      }));

      return NextResponse.json(successResponse(formatted));
    }

    // Get user's enrolled categories
    const userEnrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            category: true,
          },
        },
      },
    });

    const enrolledCategories = [
      ...new Set(userEnrollments.map((e: any) => e.course.category)),
    ];

    // Recommend courses in similar categories not yet enrolled
    const recommendations = await prisma.course.findMany({
      where: {
        status: "PUBLISHED",
        category: { in: enrolledCategories },
        enrollments: {
          none: {
            userId,
          },
        },
      },
      take: limit,
      orderBy: { rating: "desc" },
      include: {
        instructor: {
          select: {
            name: true,
          },
        },
      },
    });

    const formatted = recommendations.map((course: any) => ({
      id: course.id,
      title: course.title,
      instructor: course.instructor.name,
      category: course.category,
      difficulty: course.difficulty,
      rating: course.rating,
      students: course.studentsEnrolled,
      duration: course.duration,
      price: course.price,
      thumbnail: course.thumbnail,
    }));

    return NextResponse.json(successResponse(formatted));
  } catch (error) {
    console.error("Recommendations error:", error);
    return NextResponse.json(
      errorResponse("Failed to fetch recommendations"),
      { status: 500 }
    );
  }
}
