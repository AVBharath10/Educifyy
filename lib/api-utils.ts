/**
 * API Response utilities
 */

export interface ApiResponse<T = null> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export function successResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
  };
}

export function errorResponse(error: string): ApiResponse {
  return {
    success: false,
    error,
  };
}

/**
 * Pagination utilities
 */
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export function calculateSkip(page: number, limit: number): number {
  return (page - 1) * limit;
}

export function calculatePages(total: number, limit: number): number {
  return Math.ceil(total / limit);
}

export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResponse<T> {
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      pages: calculatePages(total, limit),
    },
  };
}

/**
 * Error handling
 */
export class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = "AppError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, `${resource} not found`);
    this.name = "NotFoundError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(401, message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden") {
    super(403, message);
    this.name = "ForbiddenError";
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, message);
    this.name = "ConflictError";
  }
}

/**
 * Request parsing utilities
 */
export async function parseJsonBody(request: Request): Promise<any> {
  try {
    return await request.json();
  } catch (error) {
    throw new ValidationError("Invalid JSON in request body");
  }
}

export async function parseFormData(request: Request): Promise<FormData> {
  try {
    return await request.formData();
  } catch (error) {
    throw new ValidationError("Invalid form data in request");
  }
}
