import { NextResponse } from "next/server";
import { sendVerificationEmail } from "@/lib/mailer";
import clientPromise from "@/lib/mongodb";
import bycrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const existing = await db.collection("users").findOne({ email })
    if (existing) {
      if (!existing.emailVerified) {
        const newToken = crypto.randomUUID()
        await db.collection("users").updateOne(
          { email },
          { $set: { verificationToken: newToken } }
        )
        await sendVerificationEmail(email, newToken)
        return NextResponse.json(
          { error: "Account not verified. We resent the verification email." },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { error: "Email already in use. Please sign in." },
        { status: 400 }
      )
    }

    const hashedPassword = await bycrypt.hash(password, 12);
    const verificationToken = crypto.randomUUID();

    await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
      emailVerified: null,
      verificationToken,
      createdAt: new Date(),
    });

    await sendVerificationEmail(email, verificationToken);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Register error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}