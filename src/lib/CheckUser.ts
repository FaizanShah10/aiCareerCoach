import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export async function checkUser() {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  try {
    const loggedIn = await db.user.findUnique({
      where: {
        clerkUserId: user.id
      }
    });

    if (loggedIn) {
      return loggedIn;
    }

    // Use const instead of var
    const name = `${user.firstName || ""} ${user.lastName || ""}`.trim();
    const email = user.emailAddresses[0]?.emailAddress;

    // Validate required fields
    if (!email) {
      console.error("User email is missing");
      return null;
    }

    // Create a new user in database
    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name: name || user.username || "User",
        imageUrl: user.imageUrl,
        email
      }
    });

    return newUser;
    
  } catch (error: unknown) {
    console.error("Error in checkUser:", error);
    
    // Type-safe error message extraction
    if (error instanceof Error) {
      console.error(error.message);
    } else if (typeof error === "string") {
      console.error(error);
    } else {
      console.error("An unknown error occurred");
    }
    
    return null;
  }
}