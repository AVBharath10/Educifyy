import { NextRequest, NextResponse } from "next/server";
import { successResponse, errorResponse } from "@/lib/api-utils";

/**
 * POST /api/upload
 * Upload files (thumbnails, videos, documents)
 * In production, this would handle actual file upload or provide presigned URLs
 */
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
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

    // In production with Supabase:
    // const url = await uploadFile({ bucket: 'educify', path: `${type}/${Date.now()}-${file.name}`, file });
    
    // For now, return mock presigned URL or local path
    const url = `/uploads/${type}/${Date.now()}-${file.name.replace(/\s/g, "-")}`;

    return NextResponse.json(
      successResponse(
        {
          url,
          fileName: file.name,
          size: file.size,
          type: file.type,
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
