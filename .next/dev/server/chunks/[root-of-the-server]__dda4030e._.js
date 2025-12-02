module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/@prisma/client [external] (@prisma/client, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("@prisma/client", () => require("@prisma/client"));

module.exports = mod;
}),
"[project]/OneDrive/Desktop/projects/educify/lib/prisma.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs)");
;
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma || new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["PrismaClient"]({
    log: ("TURBOPACK compile-time truthy", 1) ? [
        "query",
        "info"
    ] : "TURBOPACK unreachable"
});
if ("TURBOPACK compile-time truthy", 1) globalForPrisma.prisma = prisma;
}),
"[project]/OneDrive/Desktop/projects/educify/lib/api-utils.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * API Response utilities
 */ __turbopack_context__.s([
    "AppError",
    ()=>AppError,
    "ConflictError",
    ()=>ConflictError,
    "ForbiddenError",
    ()=>ForbiddenError,
    "NotFoundError",
    ()=>NotFoundError,
    "UnauthorizedError",
    ()=>UnauthorizedError,
    "ValidationError",
    ()=>ValidationError,
    "calculatePages",
    ()=>calculatePages,
    "calculateSkip",
    ()=>calculateSkip,
    "createPaginatedResponse",
    ()=>createPaginatedResponse,
    "errorResponse",
    ()=>errorResponse,
    "parseFormData",
    ()=>parseFormData,
    "parseJsonBody",
    ()=>parseJsonBody,
    "successResponse",
    ()=>successResponse
]);
function successResponse(data, message) {
    return {
        success: true,
        data,
        message
    };
}
function errorResponse(error) {
    return {
        success: false,
        error
    };
}
function calculateSkip(page, limit) {
    return (page - 1) * limit;
}
function calculatePages(total, limit) {
    return Math.ceil(total / limit);
}
function createPaginatedResponse(data, total, page, limit) {
    return {
        data,
        pagination: {
            page,
            limit,
            total,
            pages: calculatePages(total, limit)
        }
    };
}
class AppError extends Error {
    statusCode;
    constructor(statusCode, message){
        super(message), this.statusCode = statusCode;
        this.name = "AppError";
    }
}
class ValidationError extends AppError {
    constructor(message){
        super(400, message);
        this.name = "ValidationError";
    }
}
class NotFoundError extends AppError {
    constructor(resource){
        super(404, `${resource} not found`);
        this.name = "NotFoundError";
    }
}
class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized"){
        super(401, message);
        this.name = "UnauthorizedError";
    }
}
class ForbiddenError extends AppError {
    constructor(message = "Forbidden"){
        super(403, message);
        this.name = "ForbiddenError";
    }
}
class ConflictError extends AppError {
    constructor(message){
        super(409, message);
        this.name = "ConflictError";
    }
}
async function parseJsonBody(request) {
    try {
        return await request.json();
    } catch (error) {
        throw new ValidationError("Invalid JSON in request body");
    }
}
async function parseFormData(request) {
    try {
        return await request.formData();
    } catch (error) {
        throw new ValidationError("Invalid form data in request");
    }
}
}),
"[project]/OneDrive/Desktop/projects/educify/app/api/users/[id]/dashboard/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$projects$2f$educify$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/projects/educify/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$projects$2f$educify$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/projects/educify/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$projects$2f$educify$2f$lib$2f$api$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/projects/educify/lib/api-utils.ts [app-route] (ecmascript)");
;
;
;
async function GET(request, context// FIXED
) {
    try {
        const { id: profileId } = await context.params; // FIXED
        const userId = request.headers.get("x-user-id");
        if (!userId || userId !== profileId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$projects$2f$educify$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json((0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$projects$2f$educify$2f$lib$2f$api$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["errorResponse"])("Forbidden"), {
                status: 403
            });
        }
        const enrollments = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$projects$2f$educify$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].enrollment.findMany({
            where: {
                userId: profileId
            },
            include: {
                course: {
                    include: {
                        instructor: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            },
            take: 10,
            orderBy: {
                lastAccessed: "desc"
            }
        });
        // Stats
        const activeCourses = enrollments.filter((e)=>e.status === "ACTIVE").length;
        const completedCourses = enrollments.filter((e)=>e.status === "COMPLETED").length;
        // Recommended courses (not enrolled)
        const recommendedCourses = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$projects$2f$educify$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].course.findMany({
            where: {
                status: "PUBLISHED",
                enrollments: {
                    none: {
                        userId: profileId
                    }
                }
            },
            take: 3,
            include: {
                instructor: {
                    select: {
                        name: true
                    }
                }
            }
        });
        const user = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$projects$2f$educify$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.findUnique({
            where: {
                id: profileId
            },
            select: {
                totalLearningMinutes: true,
                currentStreak: true
            }
        });
        const formatted = {
            stats: {
                activeCourses,
                totalHours: Math.round((user?.totalLearningMinutes || 0) / 60),
                completedCourses,
                currentStreak: user?.currentStreak || 0
            },
            enrolledCourses: enrollments.map((e)=>({
                    id: e.id,
                    courseId: e.course.id,
                    course: {
                        id: e.course.id,
                        title: e.course.title,
                        instructor: e.course.instructor.name,
                        category: e.course.category,
                        difficulty: e.course.difficulty,
                        duration: e.course.duration,
                        thumbnail: e.course.thumbnail,
                        price: e.course.price
                    },
                    progress: e.progress,
                    lastAccessed: e.lastAccessed
                })),
            recommendedCourses: recommendedCourses.map((course)=>({
                    id: course.id,
                    title: course.title,
                    instructor: course.instructor.name,
                    category: course.category,
                    difficulty: course.difficulty,
                    rating: course.rating,
                    students: course.studentsEnrolled,
                    duration: course.duration,
                    price: course.price,
                    thumbnail: course.thumbnail
                }))
        };
        return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$projects$2f$educify$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json((0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$projects$2f$educify$2f$lib$2f$api$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["successResponse"])(formatted));
    } catch (error) {
        console.error("Get dashboard error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$projects$2f$educify$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json((0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$projects$2f$educify$2f$lib$2f$api$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["errorResponse"])("Failed to fetch dashboard"), {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__dda4030e._.js.map