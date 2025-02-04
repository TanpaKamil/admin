import { signToken } from "@/helpers/jwt";
import { Admin } from "@/types";
import adminsDataRaw from "@/../public/db.json"; // Import raw JSON data
import { serialize } from "cookie";
import { errHandler } from "@/helpers/errHandler";

// ✅ Explicitly cast JSON data to `Admin[]`
const admins: Admin[] = adminsDataRaw.admins as Admin[];

function getUserByCredentials(password: string, email: string): Admin | undefined {
  return admins.find((admin) => admin.password === password && admin.email === email);
}

export async function POST(request: Request) {
  try {
    const body: { password: string; email: string } = await request.json();

    if (!body.password || !body.email) {
      throw { message: "Missing required fields", status: 400 };
    }

    const admin = getUserByCredentials(body.password, body.email);
    if (!admin) throw { message: "Invalid password or email", status: 401 };

    if (admin.role !== "admin") throw { message: "Access denied", status: 403 };

    const token = signToken({ email: admin.email, _id: admin._id });

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
    return errHandler(error);
  }
}
