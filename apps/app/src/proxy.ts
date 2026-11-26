import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("skymeet_access_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

  if (!apiUrl) {
    return NextResponse.json(
      { message: "Session verification is temporarily unavailable." },
      { status: 503 }
    );
  }

  try {
    const response = await fetch(`${apiUrl}/auth/me`, {
      method: "GET",
      headers: {
        Cookie: `skymeet_access_token=${token}`,
      },
      cache: "no-store",
    });

    if (response.ok) {
      return NextResponse.next();
    }

    if (response.status === 401 || response.status === 403) {
      const redirect = NextResponse.redirect(new URL("/login", request.url));

      redirect.cookies.set("skymeet_access_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        domain: process.env.NODE_ENV === "production" ? ".skymeet.greyholdyngs.com" : undefined,
        path: "/",
        maxAge: 0,
      });

      return redirect;
    }

    return NextResponse.json(
      { message: "Unable to verify your session. Please try again." },
      { status: 503 }
    );
  } catch {
    return NextResponse.json(
      { message: "Authentication service is unavailable. Please try again." },
      { status: 503 }
    );
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
