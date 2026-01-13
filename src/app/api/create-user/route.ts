import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { status: "error", message: "Unauthenticated" },
        { status: 401 }
      );
    }

    const exists = await db.user.findUnique({
      where: { clerkUserId: user.id },
    });

    if (exists) {
      return NextResponse.json({ status: "exists", user: exists });
    }

    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        email: user.emailAddresses[0]?.emailAddress || "",
        name: user.username || `${user.firstName} ${user.lastName}`.trim() || "",
        imageUrl: user.imageUrl || null,
      },
    });

    return NextResponse.json({ status: "created", user: newUser });
  } catch (error: unknown) {
    console.error("❌ API create-user error:", error);
    
    // Type-safe error message extraction
    let errorMessage = "An unknown error occurred";
    
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }
    
    return NextResponse.json(
      { status: "error", message: errorMessage },
      { status: 500 }
    );
  }
}