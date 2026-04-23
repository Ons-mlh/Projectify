import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        const client = await clientPromise;
        const db = client.db();

        await db.collection("projects").deleteOne({
            _id : new ObjectId(id),
            userEmail: session.user?.email,
        })

        return NextResponse.json({ message: "Project deleted successfully" });

    } catch (error) {
        console.error("Delete project error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}