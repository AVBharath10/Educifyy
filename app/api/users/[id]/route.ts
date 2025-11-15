import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UpdateProfileSchema } from "@/lib/validation";
import { successResponse, errorResponse } from "@/lib/api-utils";
import { uploadUserAvatar } from "@/lib/storage";

/**
 * GET /api/users/[id]
 * Get user profile
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        location: true,
        bio: true,
        avatar: true,
        joinDate: true,
        role: true,
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        errorResponse("User not found"),
        { status: 404 }
      );
    }

    // Get statistics
    const enrolledCount = await prisma.enrollment.count({
      where: { userId: id },
    });

    const completedCount = await prisma.enrollment.count({
      where: {
        userId: id,
        status: "COMPLETED",
      },
    });

    const totalHours = await prisma.lesson.aggregate({
      where: {
        course: {
          enrollments: {
            some: {
              userId: id,
            },
          },
        },
      },
      _sum: {
        duration: true,
      },
    });

    const certificatesCount = await prisma.enrollment.count({
      where: {
        userId: id,
        status: "COMPLETED",
        certificateUrl: {
          not: null,
        },
      },
    });

    return NextResponse.json(
      successResponse({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        bio: user.bio,
        avatar: user.avatar,
        joinDate: user.joinDate,
        role: user.role,
        coursesEnrolled: enrolledCount,
        certificatesEarned: certificatesCount,
        totalHours: 145, // Mock for now
      })
    );
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      errorResponse("Failed to fetch profile"),
      { status: 500 }
    );
  }
}

/**
 * PUT /api/users/[id]
 * Update user profile (multipart - includes avatar)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get("x-user-id");
    const { id: profileId } = params;

    // User can only update their own profile
    if (userId !== profileId) {
      return NextResponse.json(
        errorResponse("Forbidden"),
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const data: any = {};

    // Parse form data
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const location = formData.get("location") as string;
    const bio = formData.get("bio") as string;
    const avatarFile = formData.get("avatar") as File | null;

    // Validate
    const validation = UpdateProfileSchema.safeParse({
      name: name || undefined,
      email: email || undefined,
      phone: phone || undefined,
      location: location || undefined,
      bio: bio || undefined,
    });

    if (!validation.success) {
      return NextResponse.json(
        errorResponse(validation.error.errors[0].message),
        { status: 400 }
      );
    }

    Object.assign(data, validation.data);

    // Handle avatar upload
    if (avatarFile && avatarFile.size > 0) {
      try {
        const avatarUrl = await uploadUserAvatar(userId, avatarFile);
        data.avatar = avatarUrl;
      } catch (error) {
        console.error("Avatar upload error:", error);
        return NextResponse.json(
          errorResponse("Failed to upload avatar"),
          { status: 500 }
        );
      }
    }

    // Update user
    const updated = await prisma.user.update({
      where: { id: profileId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        location: true,
        bio: true,
        avatar: true,
      },
    });

    return NextResponse.json(
      successResponse(updated, "Profile updated successfully")
    );
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      errorResponse("Failed to update profile"),
      { status: 500 }
    );
  }
}
