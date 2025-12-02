import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-utils";

/**
 * GET /api/users/[id]/courses-created
 * Get courses created by a specific instructor
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const courses = await prisma.course.findMany({
            where: {
                instructorId: id,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(successResponse(courses));
    } catch (error) {
        console.error("Get created courses error:", error);
        return NextResponse.json(
            errorResponse("Failed to fetch created courses"),
            { status: 500 }
        );
    }
}
