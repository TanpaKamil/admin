import { NextRequest, NextResponse } from "next/server";
import { verifyWithJose } from "./helpers/jwt";

export async function middleware(request: NextRequest) {
    const authorization = request.cookies.get("Authorization");

    const isLoginPage = request.nextUrl.pathname.startsWith("/login");
    const isApiLogin = request.nextUrl.pathname.startsWith("/api/login");
    const isApiAuthRequired = request.nextUrl.pathname.startsWith("/api/");
    const isStaticFile =
        request.nextUrl.pathname.startsWith("/_next/") 
        request.nextUrl.pathname.startsWith("/favicon.ico") 
        request.nextUrl.pathname.startsWith("/public/") 
        request.nextUrl.pathname.startsWith("/static/")

    if (isStaticFile) {
        return NextResponse.next(); 
    }
   
    if (isApiLogin) {
        return NextResponse.next();
    }

    if (!authorization) {
        if (isApiAuthRequired) {
            return NextResponse.json({ message: "Invalid token" }, { status: 401 });
        }
        if (!isLoginPage) return NextResponse.redirect(new URL("/login", request.nextUrl));
        return NextResponse.next();
    }

    const [type, token] = authorization.value.split(" ");
    if (type !== "Bearer") {
        return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    try {
        const payload = await verifyWithJose<{ email: string; _id: string }>(token);

        const requestHeaders = new Headers(request.headers);
        requestHeaders.set("x-user-id", payload._id);

        const response = NextResponse.next({
            request: { headers: requestHeaders },
        });

        if (isLoginPage) {
            return NextResponse.redirect(new URL("/", request.nextUrl));
        }

        return response;
    } catch (error) {
        return NextResponse.redirect(new URL("/login", request.nextUrl));
    }
}


export const config = {
    matcher: ["/((?!_next/|favicon.ico|static/|public/|api/login).*)"], // ✅ Allows static files
};
