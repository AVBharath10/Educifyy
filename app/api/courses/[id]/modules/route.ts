import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AddModuleSchema } from "@/lib/validation";
import { successResponse, errorResponse } from "@/lib/api-utils";

/**
 * POST /api/courses/[id]/modules
 * Add modules to course
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        errorResponse("Unauthorized"),
        { status: 401 }
      );
    }

    const { id: courseId } = params;
    const body = await request.json();

    // Validate input
    const validation = AddModuleSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        errorResponse(validation.error.errors[0].message),
        { status: 400 }
      );
    }

    // Check course exists and user is instructor
    const course = await prisma.course.findUnique({
      where: { id: courseId },
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

    // Create module
    const module = await prisma.module.create({
      data: {
        courseId,
        ...validation.data,
      },
    });

    return NextResponse.json(
      successResponse(module, "Module added successfully"),
      { status: 201 }
    );
  } catch (error) {
    console.error("Add module error:", error);
    return NextResponse.json(
      errorResponse("Failed to add module"),
      { status: 500 }
    );
  }
}
