"use server"


import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { userAgent } from "next/server";
import { generateAiIndustryInsights } from "./industryInsights";

export async function updateUser(data: any) {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
        where: { clerkUserId: userId }
    });

    if (!user) {
        throw new Error("User Not Found");
    }

    try {
        const result = await db.$transaction(
            async (elem) => {
                let industryInsights = await elem.industryInsight.findUnique({
                    where: { industry: data.industry }
                });

                if (!industryInsights) {
                    // Generate AI-based insights if none exist
                    const insights = await generateAiIndustryInsights(data?.industry);
                    industryInsights = await elem.industryInsight.create({
                        data: {
                            industry: data?.industry,
                            ...insights,
                            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                        }
                    });
                }

                // Updating user details
                const updatedUser = await elem.user.update({
                    where: { id: user.id },
                    data: {
                        industry: data.industry,
                        experience: data.experience,
                        bio: data.bio,
                        skills: data.skills
                    }
                });

                return { success: true, updatedUser, industryInsights };
            },
            { timeout: 10000 }
        );

        return result; 
    } catch (error: any) {
        console.error("Error updating industry insights and user:", error.message);
        throw new Error("Failed to update Profile");
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