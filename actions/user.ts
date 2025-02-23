"use server"


import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { userAgent } from "next/server";

export async function updateUser(data: any){
    const {userId} = await auth()
    if(!userId){
        throw new Error("UnAuthorized")
    }

    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId
        }
    })

    if(!user){
        throw new Error("User Not Found")
    }

    try {
        await db?.$transaction(
            async (elem) => {
                let industryInsights = await elem.industryInsight.findUnique({
                    where: {
                        industry: data.industry
                    }
                }) 

                if(industryInsights){
                    return industryInsights         //returning the industry insights as it is
                }

                //creating new industry insights with some default values
                if(!industryInsights){
                    industryInsights = await elem.industryInsight.create({
                        data: {
                            industry: data.industry,
                            salaryRanges: [],
                            growthRate: 0,
                            demandLevel: 'Medium',
                            marketOutlook: 'Neutral',
                            topSkills: [],
                            keyTrends: [],
                            recommendedSkills: [],
                            nextUpdate: new Date(Date.now())
                        }
                    })
                }

                //updating the user
                const updatedUser = await elem.user.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        industry: data.industry,
                        experience: data.experience,
                        bio: data.bio,
                        skills: data.skills
                    }
    
                })

                return {updatedUser, industryInsights}


            },
            {
                timeout: 10000
            }
            
        )
    } catch (error:any) {
        console.log("Error updating industry insights and user", error.message)
        throw new Error("Failed to update Profile")
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