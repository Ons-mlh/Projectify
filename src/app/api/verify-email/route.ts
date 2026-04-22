import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    if (!token) {
      return NextResponse.redirect(
        new URL("/verify-email/confirm?error=missing-token", req.url),
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const user = await db
      .collection("users")
      .findOne({ verificationToken: token });

    if (!user) {
      return NextResponse.redirect(
        new URL("/verify-email/confirm?error=invalid-token", req.url),
      );
    }

    await db.collection("users").updateOne(
      { verificationToken: token },
      {
        $set: { emailVerified: new Date() },
        $unset: { verificationToken: "" },
      }
    )

    return NextResponse.redirect(
      new URL("/verify-email/confirm?success=true", req.url)
    )

  } catch (error) {
    console.error("Verify email error:", error);
    return NextResponse.redirect(
      new URL("/verify-email/confirm?error=server-error", req.url)
    );
  }
}
