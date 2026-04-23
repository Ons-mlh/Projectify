import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";

export async function GET() {
    try{
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({error: "Unauthorized"}, { status: 401 });
        }

        const client = await clientPromise;
        const db = client.db();
        const projects = await db.collection("projects").find({ userEmail: session.user?.email}).sort({ createdAt: -1 }).toArray();
        return NextResponse.json(projects);

    } catch(error) {
        console.error("Error fetching projects:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST (req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userEmail = session.user?.email;
        if (!userEmail) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const {projects} = await req.json();
        if (!Array.isArray(projects)) {
            return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db();
        const collection = db.collection("projects");

        const normalize = (value: unknown) =>
            typeof value === "string" ? value.trim().toLowerCase() : "";

        const dedupedIncoming = projects.reduce((acc: any[], project: any) => {
            const title = typeof project?.title === "string" ? project.title.trim() : "";
            const description =
                typeof project?.description === "string" ? project.description.trim() : "";

            if (!title || !description) {
                return acc;
            }

            const signature = `${normalize(title)}::${normalize(description)}`;
            if (acc.some((p) => p.__signature === signature)) {
                return acc;
            }

            acc.push({ ...project, title, description, __signature: signature });
            return acc;
        }, []);

        if (dedupedIncoming.length === 0) {
            return NextResponse.json({ message: "No new projects to save", insertedCount: 0 });
        }

        const existing = await collection
            .find({ userEmail })
            .project({ title: 1, description: 1 })
            .toArray();

        const existingSignatures = new Set(
            existing.map((p: any) => `${normalize(p.title)}::${normalize(p.description)}`)
        );

        const docs = dedupedIncoming
            .filter((p) => !existingSignatures.has(p.__signature))
            .map(({ __signature, ...project }) => ({
                ...project,
                userEmail,
                createdAt: new Date(),
            }));

        if (docs.length === 0) {
            return NextResponse.json({ message: "Projects already saved", insertedCount: 0 });
        }

        await collection.insertMany(docs);

        return NextResponse.json({ message: "Projects saved successfully", insertedCount: docs.length });

    } catch (error) {
        console.error("Save projects error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}