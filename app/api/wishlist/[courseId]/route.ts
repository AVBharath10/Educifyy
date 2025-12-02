import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-utils";

/**
 * GET /api/wishlist/[courseId]
 * Check if course is in wishlist
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const userId = request.headers.get("x-user-id");
    const { courseId } = await params;

    // If no user, return not in wishlist
    if (!userId) {
      return NextResponse.json(
        successResponse({
          inWishlist: false,
        })
      );
    }

    const wishlistItem = await prisma.wishlist.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    return NextResponse.json(
      successResponse({
        inWishlist: !!wishlistItem,
      })
    );
  } catch (error) {
    console.error("Check wishlist error:", error);
    return NextResponse.json(
      errorResponse("Failed to check wishlist"),
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/wishlist/[courseId]
 * Remove course from wishlist
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        errorResponse("Unauthorized"),
        { status: 401 }
      );
    }
    const { courseId } = await params;

    await prisma.wishlist.deleteMany({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    return NextResponse.json(
      successResponse(null, "Removed from wishlist")
    );
  } catch (error) {
    console.error("Remove from wishlist error:", error);
    return NextResponse.json(
      errorResponse("Failed to remove from wishlist"),
      { status: 500 }
    );
  }
}
