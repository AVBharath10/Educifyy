import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setAuthCookie, signToken } from "@/lib/auth";
import { SignupSchema } from "@/lib/validation";
import { successResponse, errorResponse } from "@/lib/api-utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 🔥 Debug Logs (important)
    console.log("📩 Received signup body:", body);

    // Validate input
    const validation = SignupSchema.safeParse(body);

    // 🔥 Debug Logs (important)
    console.log("🔍 Validation result:", validation);

    if (!validation.success) {
      return NextResponse.json(
        errorResponse(validation.error.errors[0].message),
        { status: 400 }
      );
    }

    const { email, password, fullName } = validation.data;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        errorResponse("Email already registered"),
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: fullName,
        role: "STUDENT",
      },
    });

    // Generate token
    const token = await signToken({
      userId: user.id,
      email: user.email,
    });

    // Set cookie
    await setAuthCookie(token);

    // Return response
    const response = NextResponse.json(
      successResponse(
        {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
          },
          token,
        },
        "Signup successful"
      )
    );

    return response;
  } catch (error) {
    console.error("❌ Signup error:", error);
    return NextResponse.json(
      errorResponse("Failed to create account"),
      { status: 500 }
    );
  }
}
