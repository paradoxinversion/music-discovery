import axios from "axios";
import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";

export default async function proxy(request: NextRequest) {
  try {
    let backendUrl: string;
    if (process.env.NODE_ENV === "production") {
      backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/check-auth`;
    } else {
      backendUrl = "http://backend:3001/api/v1/auth/check-auth";
    }
    const authentication = await axios.get(backendUrl, {
      headers: { cookie: request.headers.get("cookie") ?? "" },
      withCredentials: true,
    });

    if (authentication.status !== 200) {
      throw new Error("Not authenticated");
    }

    return NextResponse.next();
  } catch (error) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: "/discover",
};
