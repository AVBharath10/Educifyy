import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️  Supabase credentials not configured");
}

// Client-side Supabase client
export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");

// Server-side Supabase client with service role
export const supabaseAdmin = createClient(
  supabaseUrl || "",
  supabaseServiceRoleKey || "",
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export interface UploadOptions {
  bucket: string;
  path: string;
  file: File | Buffer;
  contentType?: string;
}

export interface PresignedUrlResponse {
  url: string;
  path: string;
  expiresIn: number;
}

/**
 * Upload a file to Supabase Storage
 */
export async function uploadFile(options: UploadOptions): Promise<string> {
  const { bucket, path, file, contentType } = options;

  const fileBuffer = file instanceof File ? await file.arrayBuffer() : file;

  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(path, fileBuffer, {
      contentType: contentType,
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  // Return public URL
  const { data: urlData } = supabaseAdmin.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFile(bucket: string, path: string): Promise<void> {
  const { error } = await supabaseAdmin.storage.from(bucket).remove([path]);

  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
}

/**
 * Generate a presigned URL for file upload
 */
export async function generatePresignedUrl(
  bucket: string,
  path: string,
  expiresIn: number = 3600 // 1 hour
): Promise<PresignedUrlResponse> {
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .createSignedUploadUrl(path);

  if (error) {
    throw new Error(`Presigned URL generation failed: ${error.message}`);
  }

  return {
    url: data.signedUrl,
    path: data.path,
    expiresIn,
  };
}

/**
 * Get public URL for a file
 */
export function getPublicUrl(bucket: string, path: string): string {
  const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Upload course thumbnail
 */
export async function uploadCourseThumbnail(
  courseId: string,
  file: File
): Promise<string> {
  const fileName = `${courseId}-${Date.now()}.${file.name.split(".").pop()}`;
  const path = `course-thumbnails/${fileName}`;

  return uploadFile({
    bucket: "educify",
    path,
    file,
    contentType: file.type,
  });
}

/**
 * Upload course module (video or document)
 */
export async function uploadCourseModule(
  courseId: string,
  fileName: string,
  file: File
): Promise<string> {
  const extension = fileName.split(".").pop();
  const uniqueName = `${courseId}-${Date.now()}.${extension}`;
  const path = `course-modules/${uniqueName}`;

  return uploadFile({
    bucket: "educify",
    path,
    file,
    contentType: file.type,
  });
}

/**
 * Upload user avatar
 */
export async function uploadUserAvatar(
  userId: string,
  file: File
): Promise<string> {
  const fileName = `${userId}-${Date.now()}.${file.name.split(".").pop()}`;
  const path = `user-avatars/${fileName}`;

  return uploadFile({
    bucket: "educify",
    path,
    file,
    contentType: file.type,
  });
}
