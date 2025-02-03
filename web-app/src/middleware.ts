import { NextRequest, NextResponse } from "next/server";
import { verifyWithJose } from "./helpers/jwt";

export async function middleware(request: NextRequest) {
    const authorization = request.cookies.get("Authorization");

    const isLoginPage = request.nextUrl.pathname.startsWith("/login");
    const isApiLogin = request.nextUrl.pathname.startsWith("/api/login");
    const isApiAuthRequired = request.nextUrl.pathname.startsWith("/api/");
    const isStaticFile =
        request.nextUrl.pathname.startsWith("/_next/") || // ✅ Allow Next.js assets
        request.nextUrl.pathname.startsWith("/favicon.ico") || // ✅ Allow favicon
        request.nextUrl.pathname.startsWith("/public/") || // ✅ Allow static assets
        request.nextUrl.pathname.startsWith("/static/"); // ✅ Allow static files

    if (isStaticFile) {
        return NextResponse.next(); // ✅ Let static files load
    }

    console.log("🔍 Checking request path:", request.nextUrl.pathname);
    console.log("🔍 Authorization cookie:", authorization?.value);

    // ✅ Allow API login without authentication
    if (isApiLogin) {
        return NextResponse.next();
    }

    // 🚀 If no token is found, redirect to login (except API login)
    if (!authorization) {
        if (isApiAuthRequired) {
            return NextResponse.json({ message: "Invalid token" }, { status: 401 });
        }
        if (!isLoginPage) return NextResponse.redirect(new URL("/login", request.nextUrl));
        return NextResponse.next();
    }

    // ✅ Verify the JWT token
    const [type, token] = authorization.value.split(" ");
    if (type !== "Bearer") {
        return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    try {
        const payload = await verifyWithJose<{ email: string; _id: string }>(token);

        // 🚀 Attach user ID to the request headers
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set("x-user-id", payload._id);

        const response = NextResponse.next({
            request: { headers: requestHeaders },
        });

        // ✅ Prevent logged-in users from accessing `/login`
        if (isLoginPage) {
            return NextResponse.redirect(new URL("/", request.nextUrl));
        }

        return response;
    } catch (error) {
        return NextResponse.redirect(new URL("/login", request.nextUrl));
    }
}

// ✅ Exclude static files from middleware
export const config = {
    matcher: ["/((?!_next/|favicon.ico|static/|public/|api/login).*)"], // ✅ Allows static files
};
