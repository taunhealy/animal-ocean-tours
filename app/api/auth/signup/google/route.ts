import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Get the current origin for the redirect URI
  const url = new URL(request.url);
  const origin = url.origin;

  // Create a unique state parameter with a timestamp to prevent CSRF
  const state = JSON.stringify({
    mode: "signup",
    csrfToken: Date.now().toString(),
    callbackUrl: `${origin}/register`,
  });

  // Build the Google OAuth URL with proper parameters
  const googleAuthUrl =
    "https://accounts.google.com/o/oauth2/v2/auth" +
    `?client_id=${process.env.GOOGLE_CLIENT_ID}` +
    "&response_type=code" +
    "&scope=openid%20email%20profile" +
    `&redirect_uri=${encodeURIComponent(`${origin}/api/auth/callback/google`)}` +
    "&prompt=select_account" +
    "&access_type=offline" +
    `&state=${encodeURIComponent(state)}`;

  // Set cookies for state verification (this is what's missing in your current implementation)
  const response = NextResponse.redirect(googleAuthUrl);

  // Set a secure, HTTP-only cookie with the state parameter
  response.cookies.set({
    name: "next-auth.state",
    value: state,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 15, // 15 minutes
  });

  return response;
}
