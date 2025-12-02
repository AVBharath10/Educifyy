import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-utils";

/**
 * GET /api/users/[id]/enrollments
 * Get user's enrolled courses
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get("x-user-id");
    const { id: profileUserId } = await params;

    // User can only see their own enrollments (unless admin)
    if (userId !== profileUserId) {
      return NextResponse.json(
        errorResponse("Forbidden"),
        { status: 403 }
      );
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { userId: profileUserId },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: { enrolledAt: "desc" },
    });

    const formatted = enrollments.map((e: any) => ({
      id: e.id,
      courseId: e.course.id,
      course: {
        id: e.course.id,
        title: e.course.title,
        instructor: e.course.instructor.name,
        category: e.course.category,
        difficulty: e.course.difficulty,
        duration: e.course.duration,
        thumbnail: e.course.thumbnail,
        price: e.course.price,
      },
      progress: e.progress,
      lastAccessed: e.lastAccessed,
      enrolledAt: e.enrolledAt,
      status: e.status,
    }));

    return NextResponse.json(successResponse(formatted));
  } catch (error) {
    console.error("Get enrollments error:", error);
    return NextResponse.json(
      errorResponse("Failed to fetch enrollments"),
      { status: 500 }
    );
  }
}
