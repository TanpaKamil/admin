import { database } from "@/lib/mongodb"; // Import MongoDB connection
import { signToken } from "@/helpers/jwt";
import { serialize } from "cookie";
import { comparePass } from "@/helpers/comparePass"; // Import comparePass function

export async function POST(request: Request) {
  try {
    const body: { password: string; email: string } = await request.json();

    if (!body.password || !body.email) {
      throw { message: "Missing required fields", status: 400 };
    }

    // ✅ Fetch Admin from MongoDB
    const db = await database;
    const admin = await db.collection("users").findOne({ email: body.email });

    if (!admin) throw { message: "Invalid email or password", status: 401 };

    // ✅ Compare hashed password using comparePass function
    const isPasswordValid = await comparePass(body.password, admin.password);
    if (!isPasswordValid) throw { message: "Invalid email or password", status: 401 };

    if (admin.role !== "admin") throw { message: "Access denied", status: 403 };

    // ✅ Generate JWT Token
    const token = signToken({ email: admin.email, _id: admin._id.toString() });

    // ✅ Set Cookie
    const serializedCookie = serialize("Authorization", `Bearer ${token}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return new Response(
      JSON.stringify({
        message: "ok",
        accessToken: token,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": serializedCookie,
        },
      }
    );
  } catch (error) {
    console.log("Error logging in:", error);
  }
}
