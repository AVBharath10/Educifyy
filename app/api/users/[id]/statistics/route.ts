import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-utils";

/**
 * GET /api/users/[id]/statistics
 * Get user learning statistics
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get("x-user-id");
    const { id: profileId } = await params;

    if (userId !== profileId) {
      return NextResponse.json(
        errorResponse("Forbidden"),
        { status: 403 }
      );
    }

    const enrolledCount = await prisma.enrollment.count({
      where: { userId: profileId },
    });

    const completedCount = await prisma.enrollment.count({
      where: {
        userId: profileId,
        status: "COMPLETED",
      },
    });

    const certificatesCount = await prisma.enrollment.count({
      where: {
        userId: profileId,
        status: "COMPLETED",
        certificateUrl: {
          not: null,
        },
      },
    });

    const reviews = await prisma.review.findMany({
      where: { userId: profileId },
      select: { rating: true },
    });

    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
        : 0;

    return NextResponse.json(
      successResponse({
        totalCoursesEnrolled: enrolledCount,
        completedCourses: completedCount,
        currentStreak: 12, // Mock for now - would need daily tracking
        totalHoursSpent: 145, // Mock for now
        certificatesEarned: certificatesCount,
        averageRating: Math.round(averageRating * 10) / 10,
      })
    );
  } catch (error) {
    console.error("Get statistics error:", error);
    return NextResponse.json(
      errorResponse("Failed to fetch statistics"),
      { status: 500 }
    );
  }
}
