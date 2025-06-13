"use server"
//2 functions
    //1. A function for generating Ai response -- generateAiIndustryInsights()
    //2. A function for taking that Ai function and setting the industry insights


import { db } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import {GoogleGenerativeAI} from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

export const generateAiIndustryInsights = async (industry: any) => {
    const prompt = `
          Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
          {
            "salaryRanges": [
              { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
            ],
            "growthRate": number,
            "demandLevel": "High" | "Medium" | "Low",
            "topSkills": ["skill1", "skill2"],
            "marketOutlook": "Positive" | "Neutral" | "Negative",
            "keyTrends": ["trend1", "trend2"],
            "recommendedSkills": ["skill1", "skill2"]
          }
          
          IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
          Include at least 5 common roles for salary ranges.
          Growth rate should be a percentage.
          Include at least 5 skills and trends.
        `;

        const result = await model.generateContent(prompt)
        const response = result.response
        const text = await response.text()
        const cleanText = text.replace(/```(?:json)?\n?/g, "").trim();
        return JSON.parse(cleanText)

}

export const getIndustryInsights = async () => {
            try {
                const {userId} = await auth()
        
                if(!userId){    
                    return {status: 'NotLoggedIn', message: 'Please login to access onboarding status'}
                }
        
                const user = await db.user.findUnique({
                    where: {
                        clerkUserId: userId
                    },
                    include: {
                        industryInsight: true
                    }
                })
    
                
                //if no industry insights are found
                if(!user?.industryInsight){
                    //generating insights from ai and storing them into db
                    const insights = await generateAiIndustryInsights(user?.industry)

                    const industryInsight = await db.industryInsight.create({
                        data: {
                            industry: user?.industry,
                            ...insights,
                            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                        }
                    })

                    return industryInsight
                }

                //if already industry insights are found
                return user.industryInsight

            } catch (error: any) {
                console.log("Error creating industry insights", error.message)
            }
}