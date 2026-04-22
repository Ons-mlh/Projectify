import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { sendVerificationEmail } from "@/lib/mailer"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    const client = await clientPromise
    const db = client.db()

    const user = await db.collection("users").findOne({ email })

    if (!user) {
      return NextResponse.json(
        { error: "No account found with this email" },
        { status: 404 }
      )
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: "Email already verified" },
        { status: 400 }
      )
    }

    const newToken = crypto.randomUUID()
    await db.collection("users").updateOne(
      { email },
      { $set: { verificationToken: newToken } }
    )

    await sendVerificationEmail(email, newToken)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Resend verification error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}