/**
 * Central API client for frontend-backend communication
 * Handles requests, responses, authentication, and error management
 */

const API_BASE_URL = "";

export interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
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

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Generic fetch wrapper for API calls
 */
export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit & { authenticated?: boolean } = {}
): Promise<T> {
  const { authenticated = true, ...fetchOptions } = options;

  const url = `/api${endpoint}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers || {}),
  };

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
    credentials: "include", // Important: include cookies for auth
  });

  // Try to parse JSON body; if it fails, capture text for better error reporting
  let body: any = null;
  try {
    body = await response.json();
  } catch (jsonErr) {
    try {
      const text = await response.text();
      body = { message: text };
    } catch (textErr) {
      body = { message: response.statusText || "No response body" };
    }
  }

  if (!response.ok) {
    const message = (body && (body.message || body.error)) || response.statusText || "API request failed";
    throw new ApiError(response.status, message, body?.data ?? body);
  }

  // If the API returns our wrapper shape, return body.data, otherwise return body directly
  if (body && typeof body === "object" && ("success" in body)) {
    return body.data as T;
  }

  return body as T;
}

/**
 * Upload file with multipart form data
 */
export async function uploadFile(
  endpoint: string,
  file: File,
  additionalFields: Record<string, string> = {}
): Promise<any> {
  const formData = new FormData();
  formData.append("file", file);

  Object.entries(additionalFields).forEach(([key, value]) => {
    formData.append(key, value);
  });

  const url = `/api${endpoint}`;

  const response = await fetch(url, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  const body = await response.json();

  if (!response.ok) {
    throw new ApiError(
      response.status,
      body.message || "Upload failed",
      body.data
    );
  }

  return body.data;
}

// ============================================================================
// AUTH API
// ============================================================================

export interface SignupData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
}

export interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: "STUDENT" | "INSTRUCTOR" | "ADMIN";
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

export const authApi = {
  signup: (data: SignupData) =>
    apiFetch<AuthResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
      authenticated: false,
    }),

  login: (data: LoginData) =>
    apiFetch<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
      authenticated: false,
    }),

  logout: () =>
    apiFetch("/auth/logout", {
      method: "POST",
    }),

  googleAuth: (code: string) =>
    apiFetch<AuthResponse>("/auth/google", {
      method: "POST",
      body: JSON.stringify({ code }),
      authenticated: false,
    }),
};

// ============================================================================
// COURSE API
// ============================================================================

export interface Course {
  id: string;
  title: string;
  description?: string;
  instructor: string;
  instructorId: string;
  category: string;
  difficulty: string;
  rating: number;
  students: number;
  duration: string;
  price: number;
  thumbnail?: string;
  status?: string;
}

export interface CourseDetail extends Course {
  highlights?: string[];
  requirements?: string[];
  whatYouLearn?: string[];
  features?: string[];
  lessons?: any[];
  modules?: any[];
}

export interface CreateCourseData {
  title: string;
  description: string;
  category: string;
  difficulty: string;
  price: number;
  duration: string;
  highlights?: string[];
  requirements?: string[];
  whatYouLearn?: string[];
}

export const courseApi = {
  listCourses: (params: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    difficulty?: string;
  } = {}) => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.search) searchParams.append("search", params.search);
    if (params.category) searchParams.append("category", params.category);
    if (params.difficulty)
      searchParams.append("difficulty", params.difficulty);

    return apiFetch<PaginatedResponse<Course>>(
      `/courses?${searchParams.toString()}`,
      { authenticated: false }
    );
  },

  getCourse: (id: string) =>
    apiFetch<CourseDetail>(`/courses/${id}`, { authenticated: false }),

  getCourses: (params?: any) =>
    apiFetch<Course[]>(`/courses`, { 
      authenticated: false,
      ...params 
    }),

  createCourse: (data: CreateCourseData) =>
    apiFetch<Course>(`/courses`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateCourse: (id: string, data: Partial<CreateCourseData>) =>
    apiFetch<Course>(`/courses/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteCourse: (id: string) =>
    apiFetch(`/courses/${id}`, {
      method: "DELETE",
    }),

  addModule: (courseId: string, data: any) =>
    apiFetch(`/courses/${courseId}/modules`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  enrollCourse: (courseId: string) =>
    apiFetch(`/courses/${courseId}/enroll`, {
      method: "POST",
    }).then((res) => {
      try {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("enrollment:created", { detail: res }));
        }
      } catch (e) {
        /* ignore */
      }
      return res;
    }),
};

// ============================================================================
// ENROLLMENT API
// ============================================================================

export interface Enrollment {
  id: string;
  courseId: string;
  course: Course;
  progress: number;
  status: string;
  enrolledAt: string;
  lastAccessed?: string;
}

export const enrollmentApi = {
  enroll: (courseId: string) =>
    // prefer course-level enroll endpoint which returns enrollment with course details
    courseApi.enrollCourse ? courseApi.enrollCourse(courseId) : apiFetch<Enrollment>("/enrollments", {
      method: "POST",
      body: JSON.stringify({ courseId }),
    }),

  checkEnrollment: (courseId: string) =>
    apiFetch<{ enrolled: boolean; enrollment?: Enrollment }>(
      `/enrollments/${courseId}`
    ),

  getUserEnrollments: (userId: string) =>
    apiFetch<Enrollment[]>(`/users/${userId}/enrollments`),
};

// ============================================================================
// WISHLIST API
// ============================================================================

export interface WishlistItem {
  id: string;
  courseId: string;
  course: Course;
  addedAt: string;
}

export const wishlistApi = {
  getWishlist: () => apiFetch<WishlistItem[]>("/wishlist"),

  addToWishlist: (courseId: string) =>
    apiFetch<WishlistItem>("/wishlist", {
      method: "POST",
      body: JSON.stringify({ courseId }),
    }),

  checkInWishlist: (courseId: string) =>
    apiFetch<{ inWishlist: boolean }>(`/wishlist/${courseId}`),

  removeFromWishlist: (courseId: string) =>
    apiFetch(`/wishlist/${courseId}`, {
      method: "DELETE",
    }),
};

// ============================================================================
// USER API
// ============================================================================

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  bio?: string;
  avatar?: string;
  joinDate: string;
  role: string;
  coursesEnrolled: number;
  certificatesEarned: number;
  totalHours: number;
}

export interface UserPreferences {
  emailNotifications: boolean;
  marketingEmails: boolean;
  courseRecommendations: boolean;
}

export interface UserStatistics {
  totalCoursesEnrolled: number;
  completedCourses: number;
  currentStreak: number;
  totalHoursSpent: number;
  certificatesEarned: number;
  averageRating: number;
}

export interface DashboardData {
  stats: {
    activeCourses: number;
    totalHours: number;
    completedCourses: number;
    currentStreak: number;
  };
  enrolledCourses: Enrollment[];
  recommendedCourses: Course[];
}

export const userApi = {
  getProfile: (userId: string) =>
    apiFetch<UserProfile>(`/users/${userId}/profile`),

  updateProfile: (userId: string, data: FormData | Partial<UserProfile>) => {
    if (data instanceof FormData) {
      const url = `/api/users/${userId}`;
      return fetch(url, {
        method: "PUT",
        body: data,
        credentials: "include",
      }).then((res) => res.json());
    }
    return apiFetch<UserProfile>(`/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  getPreferences: (userId: string) =>
    apiFetch<UserPreferences>(`/users/${userId}/preferences`),

  updatePreferences: (userId: string, data: UserPreferences) =>
    apiFetch<UserPreferences>(`/users/${userId}/preferences`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  getStatistics: (userId: string) =>
    apiFetch<UserStatistics>(`/users/${userId}/statistics`),

  getDashboard: (userId: string) =>
    apiFetch<DashboardData>(`/users/${userId}/dashboard`),
};

// ============================================================================
// SEARCH API
// ============================================================================

export const searchApi = {
  searchCourses: (query: string, limit: number = 10) =>
    apiFetch<Course[]>(
      `/search/courses?q=${encodeURIComponent(query)}&limit=${limit}`,
      { authenticated: false }
    ),
};

// ============================================================================
// RECOMMENDATIONS API
// ============================================================================

export const recommendationsApi = {
  getRecommendations: (limit: number = 3) =>
    apiFetch<Course[]>(`/recommendations?limit=${limit}`),
};

// ============================================================================
// UPLOAD API
// ============================================================================

export interface UploadResponse {
  url: string;
  fileName: string;
  size: number;
  type: string;
}

export interface PresignedUrlResponse {
  presignedUrl: string;
  path: string;
  expiresIn: number;
}

export const uploadApi = {
  uploadFile: (file: File, type: "thumbnail" | "video" | "document") =>
    uploadFile("/upload", file, { type }),

  getPresignedUrl: (fileName: string, fileType: string, type: string) =>
    apiFetch<PresignedUrlResponse>("/upload/presign", {
      method: "PUT",
      body: JSON.stringify({ fileName, fileType, type }),
    }),
};
