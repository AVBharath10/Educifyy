import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-utils";

/**
 * GET /api/enrollments/[courseId]
 * Check if user is enrolled in a course
 */
export async function GET(
    request: NextRequest,
    props: { params: Promise<{ courseId: string }> }
) {
    try {
        const params = await props.params;
        const userId = request.headers.get("x-user-id");
        const { courseId } = params;

        // If no user, return not enrolled
        if (!userId) {
            return NextResponse.json(
                successResponse({
                    enrolled: false,
                    enrollment: null,
                })
            );
        }

        const enrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                },
            },
        });

        return NextResponse.json(
            successResponse({
                enrolled: !!enrollment,
                enrollment: enrollment || null,
            })
        );
    } catch (error) {
        console.error("Check enrollment error:", error);
        return NextResponse.json(
            errorResponse("Failed to check enrollment"),
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/enrollments/[courseId]
 * Unenroll from a course
 */
export async function DELETE(
    request: NextRequest,
    props: { params: Promise<{ courseId: string }> }
) {
    try {
        const params = await props.params;
        const userId = request.headers.get("x-user-id");
        if (!userId) {
            return NextResponse.json(
                errorResponse("Unauthorized"),
                { status: 401 }
            );
        }

        const { courseId } = params;

        // Check if enrollment exists
        const existing = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                },
            },
        });

        if (!existing) {
            return NextResponse.json(
                errorResponse("Enrollment not found"),
                { status: 404 }
            );
        }

        // Delete enrollment
        await prisma.enrollment.delete({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                },
            },
        });

        // Decrement student count
        await prisma.course.update({
            where: { id: courseId },
            data: {
                studentsEnrolled: {
                    decrement: 1,
                },
            },
        });

        return NextResponse.json(
            successResponse(null, "Unenrolled successfully"),
            { status: 200 }
        );
    } catch (error) {
        console.error("Unenroll error:", error);
        return NextResponse.json(
            errorResponse("Failed to unenroll"),
            { status: 500 }
        );
    }
}
