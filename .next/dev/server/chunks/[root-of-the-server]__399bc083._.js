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
"[project]/OneDrive/Desktop/projects/educify/app/api/courses/[id]/enroll/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$projects$2f$educify$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/projects/educify/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$projects$2f$educify$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/projects/educify/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$projects$2f$educify$2f$lib$2f$api$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/projects/educify/lib/api-utils.ts [app-route] (ecmascript)");
;
;
;
async function POST(request, context) {
    try {
        // Next.js App Router provides params as a Promise; unwrap before use
        const { id: courseId } = await context.params;
        const userId = request.headers.get("x-user-id");
        if (!userId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$projects$2f$educify$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json((0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$projects$2f$educify$2f$lib$2f$api$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["errorResponse"])("Unauthorized"), {
                status: 401
            });
        }
        // Validate user exists in database
        const user = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$projects$2f$educify$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$projects$2f$educify$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json((0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$projects$2f$educify$2f$lib$2f$api$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["errorResponse"])("User not found"), {
                status: 404
            });
        }
        // Check course exists
        const course = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$projects$2f$educify$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].course.findUnique({
            where: {
                id: courseId
            }
        });
        if (!course) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$projects$2f$educify$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json((0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$projects$2f$educify$2f$lib$2f$api$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["errorResponse"])("Course not found"), {
                status: 404
            });
        }
        // Check existing enrollment
        const existing = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$projects$2f$educify$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId
                }
            }
        });
        if (existing) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$projects$2f$educify$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json((0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$projects$2f$educify$2f$lib$2f$api$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["errorResponse"])("Already enrolled"), {
                status: 409
            });
        }
        // Create enrollment
        const enrollment = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$projects$2f$educify$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].enrollment.create({
            data: {
                userId,
                courseId,
                status: "ACTIVE",
                progress: 0,
                lastAccessed: new Date()
            },
            include: {
                course: {
                    select: {
                        id: true,
                        title: true,
                        instructor: true,
                        category: true,
                        difficulty: true,
                        duration: true,
                        thumbnail: true,
                        price: true
                    }
                }
            }
        });
        // Increment course student count safely
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$projects$2f$educify$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].course.update({
                where: {
                    id: courseId
                },
                data: {
                    studentsEnrolled: {
                        increment: 1
                    }
                }
            });
        } catch (e) {
            // ignore if column doesn't exist
            console.warn("Failed to increment studentsEnrolled", e);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$projects$2f$educify$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json((0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$projects$2f$educify$2f$lib$2f$api$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["successResponse"])(enrollment, "Enrolled successfully"), {
            status: 201
        });
    } catch (error) {
        console.error("Enroll error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$projects$2f$educify$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json((0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$projects$2f$educify$2f$lib$2f$api$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["errorResponse"])("Failed to enroll"), {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__399bc083._.js.map