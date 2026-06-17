import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AuthUser, SessionData, AuthSessionData } from "@/types";

// Escuela JS API base URL
// const API_URL = "https://api.escuelajs.co/api/v1";
const API_URL = "https://dummyjson.com";

export async function GET() {
  try {
    // ==========================================
    // Retrieve, parse, and return the session cookie payload.
    // ==========================================
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("auth_session");

    if (!authCookie || !authCookie.value) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const authSessionData: AuthSessionData = JSON.parse(authCookie.value);

    // Get the user profile using the access token
    // const profileResponse = await fetch(API_URL + "/auth/profile", {
    //   method: "GET",
    //   headers: {
    //     Authorization: `Bearer ${authSessionData.accessToken}`,
    //     "Content-Type": "application/json",
    //   },
    // });
    const profileResponse = await fetch(API_URL + "/auth/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authSessionData.accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!profileResponse.ok) {
      return NextResponse.json(
        { error: "Failed to get user profile. Please try again." },
        { status: 404 },
      );
    }

    const userProfile = await profileResponse.json();

    // Determine role based on user data
    const role = userProfile.role === "admin" ? "admin" : "customer";

    // Create user object with profile data
    const authUser: AuthUser = {
      id: userProfile.id,
      email: userProfile.email,
      //name: userProfile.name,
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      role: role,
      //avatar: userProfile.avatar,
      image: userProfile.image,
    };

    const sessionData: SessionData = {
      user: authUser,
      token: authSessionData.accessToken,
    };

    // ==========================================
    // Map roles based on email, create a secure HttpOnly session cookie, and return user profile
    // ==========================================
    cookieStore.set("session", JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 30, // 30 minutes
    });

    // Return only the user info (hiding the JWT token from browser scripts)
    return NextResponse.json(sessionData.user);
  } catch (error) {
    console.error("Fetch Session Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch session" },
      { status: 500 },
    );
  }
}
