import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-utils";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Validate header user id if present (optional)
    const requesterId = request.headers.get("x-user-id");

    // Fetch user with enrollments
    const user = await prisma.user.findUnique({
      where: { id },
      include: { enrollments: true },
    });

    if (!user) {
      return NextResponse.json(errorResponse("User not found"), { status: 404 });
    }

    const enrollments = user.enrollments || [];

    const stats = {
      activeCourses: enrollments.filter((e) => e.status === "ACTIVE").length,
      completedCourses: enrollments.filter((e) => e.status === "COMPLETED").length,
    };

    const profile = {
      id: user.id,
      name: user.name || null,
      email: user.email,
      avatar: user.avatar || null,
      bio: user.bio || null,
      joinDate: user.joinDate ? user.joinDate.toISOString() : new Date().toISOString(),
      stats,
    };

    return NextResponse.json(successResponse(profile));
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(errorResponse("Failed to fetch profile"), { status: 500 });
  }
}
