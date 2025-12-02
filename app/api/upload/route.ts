import { NextRequest, NextResponse } from "next/server";
import { successResponse, errorResponse } from "@/lib/api-utils";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

/**
 * POST /api/upload
 * Upload files (thumbnails, videos, documents)
 * In production, this would handle actual file upload or provide presigned URLs
 */
export async function POST(request: NextRequest) {
  try {
    let userId = request.headers.get("x-user-id");

    // If middleware didn't inject user ID (because we bypassed it), verify token here
    if (!userId) {
      const token = request.cookies.get("auth-token")?.value;
      if (token) {
        try {
          // We need to import verifyToken dynamically or move it to a shared lib that doesn't use 'server-only' if needed
          // But lib/auth.ts uses 'jsonwebtoken' which is fine in route handlers
          const { verifyToken } = await import("@/lib/auth");
          const decoded = verifyToken(token);
          if (decoded) {
            userId = decoded.userId;
          }
        } catch (e) {
          console.error("Token verification failed in upload route:", e);
        }
      }
    }

    if (!userId) {
      return NextResponse.json(
        errorResponse("Unauthorized"),
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string;

    if (!file) {
      return NextResponse.json(
        errorResponse("No file provided"),
        { status: 400 }
      );
    }

    // Validate file size (max 500MB)
    if (file.size > 500 * 1024 * 1024) {
      return NextResponse.json(
        errorResponse("File too large"),
        { status: 413 }
      );
    }

    // Validate file type based on upload type
    const validTypes = {
      thumbnail: ["image/jpeg", "image/png", "image/webp"],
      video: ["video/mp4", "video/mpeg"],
      document: ["application/pdf", "application/msword"],
    };

    if (type && validTypes[type as keyof typeof validTypes]) {
      const allowed = validTypes[type as keyof typeof validTypes];
      if (!allowed.includes(file.type)) {
        return NextResponse.json(
          errorResponse(`Invalid file type for ${type}`),
          { status: 400 }
        );
      }
    }

    // Create unique filename
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "-");
    const fileName = `${timestamp}-${safeName}`;

    // Check if AWS is configured
    const hasAwsConfig = process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && process.env.AWS_BUCKET_NAME;

    if (hasAwsConfig) {
      try {
        console.log("Uploading to AWS S3...");
        const { uploadToS3 } = await import("@/lib/s3");
        const buffer = Buffer.from(await file.arrayBuffer());
        // Add type prefix to folder structure in S3
        const s3Key = `${type}/${fileName}`;
        const url = await uploadToS3(buffer, s3Key, file.type);

        return NextResponse.json(
          successResponse(
            {
              url,
              fileName: file.name,
              size: file.size,
              type: file.type,
              provider: 's3'
            },
            "File uploaded successfully to S3"
          ),
          { status: 201 }
        );
      } catch (s3Error) {
        console.error("S3 Upload failed, falling back to local:", s3Error);
        // Fallback to local upload if S3 fails
      }
    }

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads", type);
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      console.error("Failed to create upload directory:", e);
    }

    // Write file to disk
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    // Public URL
    const url = `/uploads/${type}/${fileName}`;

    return NextResponse.json(
      successResponse(
        {
          url,
          fileName: file.name,
          size: file.size,
          type: file.type,
          provider: 'local'
        },
        "File uploaded successfully"
      ),
      { status: 201 }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      errorResponse("Upload failed"),
      { status: 500 }
    );
  }
}

/**
 * POST /api/upload/presign
 * Generate presigned URL for direct upload to storage
 */
export async function PUT(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        errorResponse("Unauthorized"),
        { status: 401 }
      );
    }

    const body = await request.json();
    const { fileName, type, fileType } = body;

    if (!fileName) {
      return NextResponse.json(
        errorResponse("File name is required"),
        { status: 400 }
      );
    }

    // In production with Supabase:
    // const presigned = await generatePresignedUrl('educify', `${type}/${Date.now()}-${fileName}`);

    // For now, return mock presigned URL
    const presignedUrl = `https://storage.example.com/presign?token=mock_token_${Date.now()}`;

    return NextResponse.json(
      successResponse({
        presignedUrl,
        path: `${type}/${Date.now()}-${fileName}`,
        expiresIn: 3600,
      })
    );
  } catch (error) {
    console.error("Presign error:", error);
    return NextResponse.json(
      errorResponse("Failed to generate presigned URL"),
      { status: 500 }
    );
  }
}
