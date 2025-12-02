import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-utils";


export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } // FIXED
) {
  try {
    const { id: profileId } = await context.params; // FIXED

    const userId = request.headers.get("x-user-id");

    if (!userId || userId !== profileId) {
      return NextResponse.json(errorResponse("Forbidden"), { status: 403 });
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { userId: profileId },
      include: {
        course: {
          include: {
            instructor: { select: { name: true } },
          },
        },
      },
      take: 10,
      orderBy: { lastAccessed: "desc" },
    });

    // Stats
    const activeCourses = enrollments.filter((e) => e.status === "ACTIVE").length;
    const completedCourses = enrollments.filter((e) => e.status === "COMPLETED").length;

    // Recommended courses (not enrolled)
    const recommendedCourses = await prisma.course.findMany({
      where: {
        status: "PUBLISHED",
        enrollments: { none: { userId: profileId } },
      },
      take: 3,
      include: {
        instructor: { select: { name: true } },
      },
    });

    const user = await prisma.user.findUnique({
      where: { id: profileId },
      select: { totalLearningMinutes: true, currentStreak: true }
    });

    const formatted = {
      stats: {
        activeCourses,
        totalHours: Math.round((user?.totalLearningMinutes || 0) / 60),
        completedCourses,
        currentStreak: user?.currentStreak || 0,
      },
      enrolledCourses: enrollments.map((e) => ({
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
      })),
      recommendedCourses: recommendedCourses.map((course) => ({
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
      })),
    };

    return NextResponse.json(successResponse(formatted));
  } catch (error) {
    console.error("Get dashboard error:", error);
    return NextResponse.json(errorResponse("Failed to fetch dashboard"), {
      status: 500,
    });
  }
}
