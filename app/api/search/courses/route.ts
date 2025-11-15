import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-utils";

/**
 * GET /api/search/courses
 * Search courses
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const q = searchParams.get("q") || "";
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!q || q.trim().length === 0) {
      return NextResponse.json(
        errorResponse("Search query is required"),
        { status: 400 }
      );
    }

    const courses = await prisma.course.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
          { instructor: { name: { contains: q, mode: "insensitive" } } },
        ],
      },
      take: limit,
      include: {
        instructor: {
          select: {
            name: true,
          },
        },
      },
    });

    const formatted = courses.map((course: any) => ({
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
    console.error("Search error:", error);
    return NextResponse.json(
      errorResponse("Search failed"),
      { status: 500 }
    );
  }
}
