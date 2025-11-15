import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UpdateCourseSchema } from "@/lib/validation";
import { successResponse, errorResponse, NotFoundError, ForbiddenError } from "@/lib/api-utils";

/**
 * GET /api/courses/[id]
 * Get course details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Debug: log incoming URL and params to diagnose undefined id
    console.log('[api/courses/[id] GET] request.url=', request.url);
    console.log('[api/courses/[id] GET] params=', params);
    const { id } = await params;

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            bio: true,
            avatar: true,
          },
        },
        modules: {
          orderBy: { order: "asc" },
        },
        lessons: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!course) {
      return NextResponse.json(
        errorResponse("Course not found"),
        { status: 404 }
      );
    }

    return NextResponse.json(
      successResponse({
        id: course.id,
        title: course.title,
        description: course.description,
        // Convert Decimal types to numbers/strings for JSON serialization
        price: typeof course.price === 'object' && course.price !== null ? Number(course.price) : course.price,
        category: course.category,
        difficulty: course.difficulty,
        rating: typeof course.rating === 'object' && course.rating !== null ? Number(course.rating) : course.rating,
        students: course.studentsEnrolled,
        duration: course.duration,
        thumbnail: course.thumbnail,
        instructor: course.instructor,
        highlights: course.highlights,
        requirements: course.requirements,
        whatYouLearn: course.whatYouLearn,
        features: course.features,
        lessons: course.lessons,
        modules: course.modules,
      })
    );
  } catch (error) {
    console.error("Get course error:", error);
    return NextResponse.json(
      errorResponse("Failed to fetch course"),
      { status: 500 }
    );
  }
}

/**
 * PUT /api/courses/[id]
 * Update course (instructor only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        errorResponse("Unauthorized"),
        { status: 401 }
      );
    }
    const { id } = await params;
    const body = await request.json();

    // Validate input
    const validation = UpdateCourseSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        errorResponse(validation.error.errors[0].message),
        { status: 400 }
      );
    }

    // Check course exists and user is instructor
    const course = await prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      return NextResponse.json(
        errorResponse("Course not found"),
        { status: 404 }
      );
    }

    if (course.instructorId !== userId) {
      return NextResponse.json(
        errorResponse("Forbidden"),
        { status: 403 }
      );
    }

    // Update course
    const updated = await prisma.course.update({
      where: { id },
      data: validation.data,
      include: {
        instructor: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(
      successResponse(updated, "Course updated successfully")
    );
  } catch (error) {
    console.error("Update course error:", error);
    return NextResponse.json(
      errorResponse("Failed to update course"),
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/courses/[id]
 * Delete course (instructor only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        errorResponse("Unauthorized"),
        { status: 401 }
      );
    }
    const { id } = await params;

    // Check course exists and user is instructor
    const course = await prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      return NextResponse.json(
        errorResponse("Course not found"),
        { status: 404 }
      );
    }

    if (course.instructorId !== userId) {
      return NextResponse.json(
        errorResponse("Forbidden"),
        { status: 403 }
      );
    }

    // Delete course (cascade deletes modules, lessons, enrollments)
    await prisma.course.delete({
      where: { id },
    });

    return NextResponse.json(
      successResponse(null, "Course deleted successfully")
    );
  } catch (error) {
    console.error("Delete course error:", error);
    return NextResponse.json(
      errorResponse("Failed to delete course"),
      { status: 500 }
    );
  }
}
