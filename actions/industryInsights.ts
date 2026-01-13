"use server"


import { IndustryInsights } from "@/types/industryInsights";
import { db } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import {GoogleGenerativeAI} from '@google/generative-ai'
import { redirect } from 'next/navigation';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-lite",
});

type AiIndustryInsights = {
  salaryRanges: {
    role: string;
    min: number;
    max: number;
    median: number;
    location: string;
  }[];
  growthRate: number;
  demandLevel: "High" | "Medium" | "Low";
  marketOutlook: "Positive" | "Neutral" | "Negative";
  topSkills: string[];
  keyTrends: string[];
  recommendedSkills: string[];
};

export const generateAiIndustryInsights = async (
  industry: string
): Promise<AiIndustryInsights> => {
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

export const getIndustryInsights = async (): Promise<IndustryInsights> => {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: { industryInsight: true },
  });

  if (!user?.industryInsight) redirect("/onboarding");

  const insight = user.industryInsight;

  return {
    salaryRanges: insight.salaryRanges as IndustryInsights["salaryRanges"],
    growthRate: insight.growthRate,
    demandLevel: insight.demandLevel.toLowerCase() as IndustryInsights["demandLevel"],
    marketOutlook: insight.marketOutlook.toLowerCase() as IndustryInsights["marketOutlook"],
    topSkills: insight.topSkills,
    keyTrends: insight.keyTrends,
    recommendedSkills: insight.recommendedSkills,
    lastUpdated: insight.lastUpdated,
    nextUpdate: insight.nextUpdate,
  };
};
