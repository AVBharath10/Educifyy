import { z } from "zod";

// Auth Schemas
export const SignupSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain uppercase letter")
    .regex(/[a-z]/, "Password must contain lowercase letter")
    .regex(/[0-9]/, "Password must contain number"),
  confirmPassword: z.string().min(1, "Confirm password is required"),
  fullName: z.string().min(2, "Name must be at least 2 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional().default(false),
});

// Course Schemas
export const CreateCourseSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  description: z.string().min(20, "Description must be at least 20 characters").max(5000),
  category: z.enum([
    "WEB_DEVELOPMENT",
    "DATA_SCIENCE",
    "AI_ML",
    "DESIGN",
    "BUSINESS",
    "MUSIC",
    "PHOTOGRAPHY",
    "LANGUAGE_LEARNING",
  ]),
  difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  price: z.number().min(0, "Price must be non-negative"),
  duration: z.string().min(1),
  highlights: z.array(z.string()).optional(),
  requirements: z.array(z.string()).optional(),
  whatYouLearn: z.array(z.string()).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
});

export const UpdateCourseSchema = CreateCourseSchema.partial();

export const AddModuleSchema = z.object({
  title: z.string().min(1, "Module title is required"),
  type: z.enum(["VIDEO", "DOCUMENT"]),
  fileName: z.string().min(1),
  url: z.string().min(1, "URL is required"),
  duration: z.string().optional(),
  order: z.number().int().min(0),
});

// User Schemas
export const UpdateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(20).optional(),
  location: z.string().max(100).optional(),
  bio: z.string().max(500).optional(),
});

export const UpdatePreferencesSchema = z.object({
  emailNotifications: z.boolean().optional(),
  marketingEmails: z.boolean().optional(),
  courseRecommendations: z.boolean().optional(),
});

// Enrollment Schemas
export const CreateEnrollmentSchema = z.object({
  courseId: z.string().min(1, "Course ID is required"),
});

// Wishlist Schemas
export const AddToWishlistSchema = z.object({
  courseId: z.string().min(1, "Course ID is required"),
});

// Search Schema
export const SearchSchema = z.object({
  q: z.string().min(1, "Search query is required"),
  limit: z.number().int().positive().default(10),
});

// Review Schema
export const CreateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  review: z.string().max(1000).optional(),
});

// Pagination Schema
export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  category: z.string().optional(),
  difficulty: z.string().optional(),
});

export type SignupInput = z.infer<typeof SignupSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type CreateCourseInput = z.infer<typeof CreateCourseSchema>;
export type UpdateCourseInput = z.infer<typeof UpdateCourseSchema>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
export type UpdatePreferencesInput = z.infer<typeof UpdatePreferencesSchema>;
export type CreateEnrollmentInput = z.infer<typeof CreateEnrollmentSchema>;
export type AddToWishlistInput = z.infer<typeof AddToWishlistSchema>;
export type CreateReviewInput = z.infer<typeof CreateReviewSchema>;
export type PaginationInput = z.infer<typeof PaginationSchema>;
