import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-utils";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Next.js App Router provides params as a Promise; unwrap before use
    const { id: courseId } = await context.params;
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
    }

    // Validate user exists in database
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json(errorResponse("User not found"), { status: 404 });
    }

    // Check course exists
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return NextResponse.json(errorResponse("Course not found"), { status: 404 });
    }

    // Check existing enrollment
    const existing = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });

    if (existing) {
      return NextResponse.json(errorResponse("Already enrolled"), { status: 409 });
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId,
        status: "ACTIVE",
        progress: 0,
        lastAccessed: new Date(),
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            instructor: true,
            category: true,
            difficulty: true,
            duration: true,
            thumbnail: true,
            price: true,
          },
        },
      },
    });

    // Increment course student count safely
    try {
      await prisma.course.update({ where: { id: courseId }, data: { studentsEnrolled: { increment: 1 } } });
    } catch (e) {
      // ignore if column doesn't exist
      console.warn("Failed to increment studentsEnrolled", e);
    }

    return NextResponse.json(successResponse(enrollment, "Enrolled successfully"), { status: 201 });
  } catch (error) {
    console.error("Enroll error:", error);
    return NextResponse.json(errorResponse("Failed to enroll"), { status: 500 });
  }
}
