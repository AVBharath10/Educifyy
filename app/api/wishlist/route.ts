import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AddToWishlistSchema } from "@/lib/validation";
import { successResponse, errorResponse, ConflictError } from "@/lib/api-utils";

/**
 * GET /api/wishlist
 * Get user's wishlist
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        errorResponse("Unauthorized"),
        { status: 401 }
      );
    }

    const wishlist = await prisma.wishlist.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: { addedAt: "desc" },
    });

    const formatted = wishlist.map((item: any) => ({
      id: item.id,
      courseId: item.course.id,
      course: {
        id: item.course.id,
        title: item.course.title,
        instructor: item.course.instructor.name,
        category: item.course.category,
        difficulty: item.course.difficulty,
        rating: item.course.rating,
        students: item.course.studentsEnrolled,
        duration: item.course.duration,
        price: item.course.price,
        thumbnail: item.course.thumbnail,
      },
      addedAt: item.addedAt,
    }));

    return NextResponse.json(successResponse(formatted));
  } catch (error) {
    console.error("Get wishlist error:", error);
    return NextResponse.json(
      errorResponse("Failed to fetch wishlist"),
      { status: 500 }
    );
  }
}

/**
 * POST /api/wishlist
 * Add course to wishlist
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
    const validation = AddToWishlistSchema.safeParse(body);
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

    // Check if already in wishlist
    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        errorResponse("Course already in wishlist"),
        { status: 409 }
      );
    }

    // Add to wishlist
    const wishlistItem = await prisma.wishlist.create({
      data: {
        userId,
        courseId,
      },
    });

    return NextResponse.json(
      successResponse(wishlistItem, "Added to wishlist"),
      { status: 201 }
    );
  } catch (error) {
    console.error("Add to wishlist error:", error);
    return NextResponse.json(
      errorResponse("Failed to add to wishlist"),
      { status: 500 }
    );
  }
}
