import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-utils";

export async function POST(
    request: NextRequest,
    context: { params: Promise<{ courseId: string }> }
) {
    try {
        const { courseId } = await context.params;
        const userId = request.headers.get("x-user-id");
        const { lessonId } = await request.json();

        if (!userId) {
            return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
        }

        if (!lessonId) {
            return NextResponse.json(errorResponse("Lesson ID required"), { status: 400 });
        }

        // 1. Get Enrollment and Course
        const enrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                },
            },
            include: {
                course: {
                    include: {
                        modules: true,
                        lessons: true,
                    }
                }
            }
        });

        if (!enrollment) {
            return NextResponse.json(errorResponse("Enrollment not found"), { status: 404 });
        }

        // 2. Check if lesson already completed
        if (enrollment.completedLessonIds.includes(lessonId)) {
            return NextResponse.json(successResponse({ message: "Already completed", progress: enrollment.progress }));
        }

        // 3. Calculate new progress
        const totalItems = (enrollment.course.modules.length || 0) + (enrollment.course.lessons.length || 0);
        const completedCount = enrollment.completedLessonIds.length + 1;
        const newProgress = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 100;

        // 4. Update Enrollment
        await prisma.enrollment.update({
            where: { id: enrollment.id },
            data: {
                completedLessonIds: {
                    push: lessonId
                },
                progress: newProgress,
                lastAccessed: new Date(),
                status: newProgress === 100 ? "COMPLETED" : "ACTIVE",
                completedAt: newProgress === 100 ? new Date() : null,
            }
        });

        // 5. Update User Stats
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (user) {
            const now = new Date();
            const lastActive = user.lastActiveDate;
            let newStreak = user.currentStreak;

            // Check streak
            if (lastActive) {
                const lastDate = new Date(lastActive);
                const today = new Date();
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);

                if (lastDate.toDateString() === yesterday.toDateString()) {
                    newStreak += 1;
                } else if (lastDate.toDateString() !== today.toDateString()) {
                    // If not today and not yesterday, reset streak
                    newStreak = 1;
                }
                // If today, keep same streak
            } else {
                newStreak = 1;
            }

            // Calculate time spent (simplistic: 15 mins per lesson)
            const lessonDuration = 15;

            await prisma.user.update({
                where: { id: userId },
                data: {
                    totalLearningMinutes: { increment: lessonDuration },
                    currentStreak: newStreak,
                    lastActiveDate: now,
                }
            });
        }

        return NextResponse.json(successResponse({ progress: newProgress }));

    } catch (error) {
        console.error("Update progress error:", error);
        return NextResponse.json(errorResponse("Failed to update progress"), { status: 500 });
    }
}
