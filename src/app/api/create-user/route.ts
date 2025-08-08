import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Unauthenticated");

    const exists = await db.user.findUnique({
      where: { clerkUserId: user.id },
    });

    if (exists) return NextResponse.json({ status: "exists", user: exists });

    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        email: user.emailAddresses[0]?.emailAddress || "",
        name: user.username || "",
        imageUrl: user.imageUrl || null,
      },
    });

    return NextResponse.json({ status: "created", user: newUser });
  } catch (err: any) {
    console.error("❌ API create-user error:", err.message);
    return NextResponse.json({ status: "error", message: err.message }, { status: 500 });
  }
}
