import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UpdatePreferencesSchema } from "@/lib/validation";
import { successResponse, errorResponse } from "@/lib/api-utils";

/**
 * GET /api/users/[id]/preferences
 * Get user preferences
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

    const user = await prisma.user.findUnique({
      where: { id: profileId },
      select: {
        emailNotifications: true,
        marketingEmails: true,
        courseRecommendations: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        errorResponse("User not found"),
        { status: 404 }
      );
    }

    return NextResponse.json(successResponse(user));
  } catch (error) {
    console.error("Get preferences error:", error);
    return NextResponse.json(
      errorResponse("Failed to fetch preferences"),
      { status: 500 }
    );
  }
}

/**
 * PUT /api/users/[id]/preferences
 * Update user preferences
 */
export async function PUT(
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

    const body = await request.json();

    // Validate input
    const validation = UpdatePreferencesSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        errorResponse(validation.error.errors[0].message),
        { status: 400 }
      );
    }

    // Update preferences
    const updated = await prisma.user.update({
      where: { id: profileId },
      data: validation.data,
      select: {
        emailNotifications: true,
        marketingEmails: true,
        courseRecommendations: true,
      },
    });

    return NextResponse.json(
      successResponse(updated, "Preferences updated successfully")
    );
  } catch (error) {
    console.error("Update preferences error:", error);
    return NextResponse.json(
      errorResponse("Failed to update preferences"),
      { status: 500 }
    );
  }
}
