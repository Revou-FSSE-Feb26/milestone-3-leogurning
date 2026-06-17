import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AuthSessionData } from "@/types";

// Escuela JS API base URL
// const API_URL = "https://api.escuelajs.co/api/v1";
// Dummjson api url
const API_URL = "https://dummyjson.com";

export async function POST(request: Request) {
  try {
    const { userName, password } = await request.json();

    if (!userName || !password) {
      return NextResponse.json(
        { error: "email and password are required" },
        { status: 400 },
      );
    }

    // ==========================================
    // Forward (proxy) the login request to the external flatzi api authentication service
    // ==========================================
    // const response = await fetch(API_URL + "/auth/login", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     email,
    //     password,
    //     expiresInMins: 30,
    //   }),
    //   credentials: "include",
    // });

    const response = await fetch(API_URL + "/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: userName,
        password,
        expiresInMins: 30,
      }),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || "Invalid credentials" },
        { status: response.status },
      );
    }

    const data = await response.json();

    const authSession: AuthSessionData = {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    };

    // ==========================================
    // create a secure HttpOnly session cookie, and return user profile
    // ==========================================
    const cookieStore = await cookies();
    cookieStore.set("auth_session", JSON.stringify(authSession), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 30, // 30 minutes
    });

    return NextResponse.json({
      success: true,
      message: "Logged in successfully",
    });
  } catch (error: any) {
    console.error("Login Proxy Error:", error);
    return NextResponse.json(
      { error: "An unexpected authentication error occurred" },
      { status: 500 },
    );
  }
}
