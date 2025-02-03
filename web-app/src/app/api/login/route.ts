import { signToken } from "@/helpers/jwt";
import { User } from "@/types";
import admins from "../../../../public/db.json";
import { serialize } from "cookie";
import { errHandler } from "@/helpers/errHandler";


function getUserByCredentials(password: string, email: string): User | undefined {
  return admins.find((user: User) => user.password === password && user.email === email);
}


export async function POST(request: Request) {
  try {
    const body: { password: string; email: string } = await request.json();

    if (!body.password || !body.email) {
      throw { message: "Missing required fields", status: 400 };
    }

    const user = getUserByCredentials(body.password, body.email);
    if (!user) throw { message: "Invalid password or email", status: 401 };

    if (user.role !== "admin") throw { message: "Access denied", status: 403 };

    const token = signToken({ email: user.email, _id: user._id });

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
