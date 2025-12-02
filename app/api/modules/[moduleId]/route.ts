import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-utils";
import { AddModuleSchema } from "@/lib/validation";

/**
 * PUT /api/modules/[moduleId]
 * Update a module
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ moduleId: string }> }
) {
    try {
        const userId = request.headers.get("x-user-id");
        if (!userId) {
            return NextResponse.json(
                errorResponse("Unauthorized"),
                { status: 401 }
            );
        }

        const { moduleId } = await params;
        const body = await request.json();

        // 1. Check module ownership via course
        const moduleItem = await prisma.module.findUnique({
            where: { id: moduleId },
            include: { course: true },
        });

        if (!moduleItem) {
            return NextResponse.json(
                errorResponse("Module not found"),
                { status: 404 }
            );
        }

        if (moduleItem.course.instructorId !== userId) {
            return NextResponse.json(
                errorResponse("Forbidden"),
                { status: 403 }
            );
        }

        // 2. Validate input (using AddModuleSchema as base, but partial)
        // We can reuse AddModuleSchema but we might need to relax it if we want partial updates
        // For now, let's assume we send the full module data or valid partials
        const validation = AddModuleSchema.partial().safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                errorResponse(validation.error.errors[0].message),
                { status: 400 }
            );
        }

        // 3. Update module
        const updatedModule = await prisma.module.update({
            where: { id: moduleId },
            data: {
                title: body.title,
                type: body.type,
                url: body.url,
                content: body.content,
                fileName: body.fileName,
                duration: body.duration,
                order: body.order,
            },
        });

        return NextResponse.json(
            successResponse(updatedModule, "Module updated successfully")
        );
    } catch (error) {
        console.error("Update module error:", error);
        return NextResponse.json(
            errorResponse("Failed to update module"),
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/modules/[moduleId]
 * Delete a module
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ moduleId: string }> }
) {
    try {
        const userId = request.headers.get("x-user-id");
        if (!userId) {
            return NextResponse.json(
                errorResponse("Unauthorized"),
                { status: 401 }
            );
        }

        const { moduleId } = await params;

        // 1. Check module ownership
        const moduleItem = await prisma.module.findUnique({
            where: { id: moduleId },
            include: { course: true },
        });

        if (!moduleItem) {
            return NextResponse.json(
                errorResponse("Module not found"),
                { status: 404 }
            );
        }

        if (moduleItem.course.instructorId !== userId) {
            return NextResponse.json(
                errorResponse("Forbidden"),
                { status: 403 }
            );
        }

        // 2. Delete file from S3 if it exists
        if (moduleItem.url && moduleItem.url.includes("amazonaws.com")) {
            try {
                const { deleteFromS3 } = await import("@/lib/s3");
                await deleteFromS3(moduleItem.url);
            } catch (e) {
                console.error("Failed to delete file from S3:", e);
                // Continue with DB deletion even if S3 fails
            }
        }

        // 3. Delete from DB
        await prisma.module.delete({
            where: { id: moduleId },
        });

        return NextResponse.json(
            successResponse(null, "Module deleted successfully")
        );
    } catch (error) {
        console.error("Delete module error:", error);
        return NextResponse.json(
            errorResponse("Failed to delete module"),
            { status: 500 }
        );
    }
}
