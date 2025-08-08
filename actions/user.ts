"use server"


import { db } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { generateAiIndustryInsights } from "./industryInsights";


export async function createUserInDB() {
  try {
    const user = await currentUser();

    if (!user) throw new Error("User not authenticated");

    // Check if already exists
    const exists = await db.user.findUnique({
      where: { clerkUserId: user.id },
    });

    if (exists) return { status: "exists", user: exists };

    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        email: user.emailAddresses[0]?.emailAddress || "",
        name: user.username || "",
        imageUrl: user.imageUrl || null,
      },
    });

    return { status: "created", user: newUser };
  } catch (err: any) {
    console.error("❌ createUserInDB error:", err.message);
    return { status: "error", message: err.message };
  }
}

export async function updateUser(data: any) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const formattedIndustry = data.subIndustry
    ? `${data.industry}-${data.subIndustry.toLowerCase().replace(/ /g, "-")}`
    : data.industry;

  if (!formattedIndustry) throw new Error("Industry is required");

  try {
    let industryInsights = await db.industryInsight.findUnique({
      where: { industry: formattedIndustry },
    });

    if (!industryInsights) {
      const insights = await generateAiIndustryInsights(formattedIndustry);

      const result = await db.$transaction(async (tx) => {
        const createdInsight = await tx.industryInsight.create({
          data: {
            industry: formattedIndustry,
            ...insights,
            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        });

        const updatedUser = await tx.user.update({
          where: { id: user.id },
          data: {
            industry: formattedIndustry,
            experience: data.experience,
            bio: data.bio,
            skills: data.skills,
          },
        });

        return { success: true, updatedUser, industryInsights: createdInsight };
      });

      return result;
    }

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        industry: formattedIndustry,
        experience: data.experience,
        bio: data.bio,
        skills: data.skills,
      },
    });

    return { success: true, updatedUser, industryInsights };
  } catch (error: any) {
    console.error("Error updating user:", error.message);
    throw new Error("Failed to update profile");
  }
}



export async function getOnBoardingUserStatus(){
    try {
        const {userId} = await auth()

        if(!userId){    
            return {status: 'NotLoggedIn', message: 'Please login to access onboarding status'}
        }

        const user = await db.user.findUnique({
            where: {
                clerkUserId: userId
            },
            select: {
                industry: true
            }

        })

        return {
            isOnboarded: !!user?.industry
        }
        

    } catch (error: any) {
        console.log("Error Getting the onBoarding Status",error.message)
        throw new Error("Errors fetching onboarding status")
    }
}