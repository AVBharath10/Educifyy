import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setAuthCookie, signToken } from "@/lib/auth";
import { LoginSchema } from "@/lib/validation";
import { successResponse, errorResponse } from "@/lib/api-utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = LoginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        errorResponse(validation.error.errors[0].message),
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        errorResponse("Invalid email or password"),
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        errorResponse("Invalid email or password"),
        { status: 401 }
      );
    }

    // Generate token
    const token = signToken({
      userId: user.id,
      email: user.email,
    });

    // Set cookie
    await setAuthCookie(token);

    // Return response
    return NextResponse.json(
      successResponse(
        {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            avatar: user.avatar,
            role: user.role,
          },
          token,
        },
        "Login successful"
      )
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      errorResponse("Login failed"),
      { status: 500 }
    );
  }
}
