"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export const generateCoverLetter = async (role: any, description: any) => {
  // 1. Propmt
  // 2. result
  // 3. result.respone --> response
  // 4. take the text from response
  // 5. clean the text
  // 6. return the cleaned text in JSON format JSON.parse

        const prompt = `
        You are an expert career assistant and professional writer. Your task is to generate a highly personalized and impactful cover letter that contains the important details and not too long, keep it short upto maximum of 2 paragraphs. 
        Start the cover letter with greetings e.g Dear [HR Manager], and ends on Best Regards, [Name]
        Use the job role and job description provided below to understand the employer's needs, then craft a cover letter that aligns perfectly with those requirements and presents the candidate as an ideal fit.

        Job Role: {${role}}
        Job Description: {${description}}

        IMPORTANT NOTE:
        generate a cover letter that:
            --> Is aligned with the expectations and responsibilities mentioned in the job description.
            --> Highlights the candidate’s relevant skills, qualifications, and enthusiasm for the role.
            --> Maintains a professional tone while sounding human and authentic.
            --> Is structured properly with a strong introduction, a detailed body, and a concise closing paragraph.
            --> Avoids repetition and generic phrases.

           
        `;

        const result = await model.generateContent(prompt)
        const response = result.response
        const text = response.text()
        const cleanText = text.replace(/```(?:json)?\n?/g, "").trim();
        return cleanText
};
