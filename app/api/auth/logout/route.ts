import { NextRequest, NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth";
import { successResponse } from "@/lib/api-utils";

export async function POST(request: NextRequest) {
  try {
    // Clear auth cookie
    await clearAuthCookie();

    return NextResponse.json(
      successResponse(null, "Logout successful"),
      { status: 200 }
    );
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, error: "Logout failed" },
      { status: 500 }
    );
  }
}
