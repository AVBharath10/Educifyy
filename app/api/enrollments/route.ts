import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CreateEnrollmentSchema } from "@/lib/validation";
import { successResponse, errorResponse, ConflictError } from "@/lib/api-utils";

/**
 * POST /api/enrollments
 * Enroll in a course
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
    const validation = CreateEnrollmentSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        errorResponse(validation.error.errors[0].message),
        { status: 400 }
      );
    }

    const { courseId } = validation.data;

    // Check course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json(
        errorResponse("Course not found"),
        { status: 404 }
      );
    }

    // Check if already enrolled
    const existing = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        errorResponse("Already enrolled in this course"),
        { status: 409 }
      );
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId,
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    // Update course student count
    await prisma.course.update({
      where: { id: courseId },
      data: {
        studentsEnrolled: {
          increment: 1,
        },
      },
    });

    return NextResponse.json(
      successResponse(enrollment, "Enrolled successfully"),
      { status: 201 }
    );
  } catch (error) {
    console.error("Enrollment error:", error);
    return NextResponse.json(
      errorResponse("Failed to enroll"),
      { status: 500 }
    );
  }
}


